import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const worker = await readFile(new URL('../public/radio/sw.js', import.meta.url), 'utf8');

function harness({ offline = false } = {}) {
  const events = {};
  const deleted = [];
  const fallback = new Response('offline radio');
  const context = {
    URL,
    self: { location: { origin: 'https://mmmchile.cl' }, clients: { claim: async () => {} }, addEventListener: (name, handler) => { events[name] = handler; } },
    caches: {
      match: async () => fallback,
      keys: async () => ['bethel-radio-v0', 'bethel-radio-v1', 'another-app-v1'],
      delete: async (key) => { deleted.push(key); },
      open: async () => ({ addAll: async () => {} }),
    },
    fetch: async () => { if (offline) throw new Error('offline'); return new Response('network'); },
  };
  vm.runInNewContext(worker, context);
  return { events, deleted, fallback };
}

test('app navigation has an offline fallback without caching HTML or RSC responses', async () => {
  const { events, fallback } = harness({ offline: true });
  let response;
  events.fetch({ request: { url: 'https://mmmchile.cl/radio/app', method: 'GET', mode: 'navigate' }, respondWith: (value) => { response = value; } });
  assert.equal(await response, fallback);
});

test('online app navigation always uses the network', async () => {
  const { events } = harness();
  let response;
  events.fetch({ request: { url: 'https://mmmchile.cl/radio/app', method: 'GET', mode: 'navigate' }, respondWith: (value) => { response = value; } });
  assert.equal(await (await response).text(), 'network');
});

test('worker does not intercept streaming, private pages, APIs, mutations, or RSC', () => {
  const { events } = harness();
  for (const [url, method, mode] of [
    ['https://radio.mmmchile.cl/stream', 'GET', 'no-cors'],
    ['https://mmmchile.cl/seguimiento', 'GET', 'navigate'],
    ['https://mmmchile.cl/admin', 'GET', 'navigate'],
    ['https://mmmchile.cl/api/private', 'GET', 'cors'],
    ['https://mmmchile.cl/radio/app', 'POST', 'cors'],
    ['https://mmmchile.cl/radio/app?_rsc=123', 'GET', 'cors'],
  ]) {
    events.fetch({ request: { url, method, mode }, respondWith: () => assert.fail(`Intercepted ${method} ${url}`) });
  }
});

test('activation only removes old radio caches', async () => {
  const { events, deleted } = harness();
  let completion;
  events.activate({ waitUntil: (value) => { completion = value; } });
  await completion;
  assert.deepEqual(deleted, ['bethel-radio-v0']);
});
