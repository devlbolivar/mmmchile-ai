import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/seguimiento/origin.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { resolveFollowupOrigin } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const preview = { VERCEL_ENV: 'preview', VERCEL_URL: 'app-123.vercel.app', VERCEL_BRANCH_URL: 'app-branch.vercel.app', SEGUIMIENTO_APP_URL: 'https://mmmchile.cl' };

test('preview keeps deployment or branch origin, even with production override', () => {
  for (const host of [preview.VERCEL_URL, preview.VERCEL_BRANCH_URL]) {
    assert.equal(resolveFollowupOrigin(preview, `https://${host}`), `https://${host}`);
  }
});
test('rejects missing, foreign and spoofed preview origins', () => {
  for (const origin of [null, 'https://evil.test', 'https://app-123.vercel.app.evil.test', 'https://mmmchile.cl', 'http://app-123.vercel.app']) {
    assert.throws(() => resolveFollowupOrigin(preview, origin));
  }
  assert.throws(() => resolveFollowupOrigin({ VERCEL_ENV: 'preview' }, 'https://evil.test'));
});
test('production ignores request headers and uses configured origin', () => {
  assert.equal(resolveFollowupOrigin({}, 'https://evil.test'), 'https://mmmchile.cl');
  assert.equal(resolveFollowupOrigin({ SEGUIMIENTO_APP_URL: 'http://localhost:3000' }, null), 'http://localhost:3000');
  assert.throws(() => resolveFollowupOrigin({ SEGUIMIENTO_APP_URL: 'http://evil.test' }, null));
});
