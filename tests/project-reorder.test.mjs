import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { z } from 'zod';

const code = ts.transpileModule(readFileSync(new URL('../src/app/actions/projects/reorder.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function load(session, rpcError = null) {
  const calls = [];
  const paths = [];
  const dependencies = {
    'next/headers': { cookies: async () => ({ get: () => ({ value: 'test-session' }) }) },
    'next/cache': { revalidatePath: (...args) => paths.push(args) },
    '@/app/lib/session': { decrypt: async () => session },
    '@/utils/supabaseAdmin': { supabaseAdmin: { rpc: async (...args) => { calls.push(args); return { error: rpcError }; } } },
    zod: { z },
  };
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => dependencies[name] });
  return { reorder: exports.reorderProjects, calls, paths };
}
test('unauthenticated and malformed sessions never write to the database', async () => {
  for (const session of [null, {}, { userId: '' }, { userId: 123 }]) {
    const { reorder, calls } = load(session);
    assert.ok((await reorder(['a'], ['a'])).error);
    assert.equal(calls.length, 0);
  }
});
test('invalid input never writes to the database', async () => {
  const { reorder, calls } = load({ userId: 'admin' });
  assert.ok((await reorder([null], ['a'])).error);
  assert.equal(calls.length, 0);
});
test('authenticated reorder uses one RPC and invalidates all affected pages', async () => {
  const { reorder, calls, paths } = load({ userId: 'admin' });
  assert.equal((await reorder(['b','a'], ['a','b'])).success, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'reorder_projects');
  assert.equal(JSON.stringify(calls[0][1]), JSON.stringify({ ordered_ids: ['b','a'], expected_ids: ['a','b'] }));
  assert.equal(paths.length, 3);
});
test('stale orders report a conflict without invalidating caches', async () => {
  const { reorder, paths } = load({ userId: 'admin' }, { code: '40001' });
  assert.match((await reorder(['a'], ['a'])).error, /liste a changé/);
  assert.equal(paths.length, 0);
});
