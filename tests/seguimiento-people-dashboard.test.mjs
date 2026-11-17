import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
const module = {exports: {}};
const {outputText} = ts.transpileModule(readFileSync(new URL('../src/lib/seguimiento/people-dashboard.ts', import.meta.url), 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS}});
new Function('module', 'exports', outputText)(module, module.exports);
const {summarizePeople, selectPeople, emptyPeopleFilters} = module.exports;
const person = (id, extra = {}) => ({id, name: id, phone: '', address: '', responsible: '', assigned_to: null, age_group: null, sex: null, status: 'Pendiente', kind: 'Nuevo creyente', next_date: '', created_at: '2026-11-01', ...extra});
const people = [person('1', {name: 'José Álvarez', responsible: 'María', assigned_to: 'a', next_date: '2026-11-17', age_group: 'Joven', sex: 'Masculino'}), person('2', {name: 'Ana', next_date: '2026-11-16'}), person('3', {name: 'Zoe'}), person('4', {status: 'Finalizado', next_date: '2026-11-15'})];
const visits = [{id: 'v1', person_id: '1', date: '2026-11-10', created_at: '2026-11-10T12:00', result: 'Realizada'}, {id: 'v2', person_id: '1', date: '2026-11-10', created_at: '2026-11-10T13:00', result: 'Reprogramada'}, {id: 'v3', person_id: '2', date: '2026-11-09', created_at: '2026-11-09', result: 'No se encontró'}];
const rows = summarizePeople(people, visits);
const select = (filters = {}, sort = 'next', desc = false) => selectPeople(rows, {...emptyPeopleFilters, ...filters}, sort, desc, '2026-11-17').map(r => r.person.id);
test('combines accent-insensitive search, assignment, classification, inclusive dates and latest result', () => {
 assert.deepEqual(select({query: 'maria JOSE', assignedTo: 'a', classification: 'joven_masculino', from: '2026-11-17', to: '2026-11-17', result: 'Reprogramada'}), ['1']);
 assert.deepEqual(select({query: 'jose', result: 'Realizada'}), []);
 assert.deepEqual(select({from: '2026-11-18', to: '2026-11-16'}), []);
});
test('schedule boundaries exclude finalized people and distinguish today from future', () => {
 assert.deepEqual(select({schedule: 'overdue'}), ['2']);
 assert.deepEqual(select({schedule: 'today'}), ['1']);
 assert.deepEqual(select({schedule: 'upcoming'}), []);
 assert.deepEqual(select({schedule: 'unscheduled'}), ['3']);
 assert.deepEqual(select({status: 'active', assignedTo: 'unassigned'}), ['2', '3']);
});
test('summaries use authorized visits only and choose the latest deterministically', () => {
 assert.equal(rows[0].latest.id, 'v2');
 assert.equal(rows[0].count, 2);
 assert.deepEqual(summarizePeople(people, [...visits].reverse()), rows);
 assert.equal(summarizePeople(people, [visits[0]])[0].count, 1);
 assert.deepEqual(select({result: 'none', status: 'active'}), ['3']);
 assert.deepEqual(select({classification: 'unclassified', status: 'active'}), ['2', '3']);
});
test('sorting keeps missing dates last in both directions without mutating input', () => {
 assert.deepEqual(select({}, 'next'), ['4', '2', '1', '3']);
 assert.deepEqual(select({}, 'next', true), ['1', '2', '4', '3']);
 assert.deepEqual(select({}, 'count', true), ['1', '2', '4', '3']);
 assert.deepEqual(select({}, 'name'), ['4', '2', '1', '3']);
 assert.deepEqual(rows.map(r => r.person.id), ['1', '2', '3', '4']);
});
