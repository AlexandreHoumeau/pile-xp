// Isolated PostgreSQL tests. PGLITE_MODULE may point to an external installation.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
await db.exec(`
  CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
  CREATE TABLE public.projects (id text PRIMARY KEY, created_at timestamptz, program text[]);
  INSERT INTO public.projects VALUES ('a','2026-01-01','{housing}'), ('b','2026-01-02','{office}'), ('c','2026-01-02','{housing}');
  GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO service_role;
  GRANT SELECT, UPDATE ON public.projects TO authenticated;
`);
await db.exec(await readFile(new URL('../supabase/migrations/20261102130000_project_display_order.sql', import.meta.url), 'utf8'));
const order = async () => (await db.query('SELECT id FROM projects ORDER BY display_order, id')).rows.map(r => r.id);
assert.deepEqual(await order(), ['b','c','a']);
await db.exec('SET ROLE service_role');
const reorder = (ids, expected) => db.query('SELECT public.reorder_projects($1::text[], $2::text[])', [ids, expected]);
await reorder(['a','b','c'], ['b','c','a']);
assert.deepEqual(await order(), ['a','b','c']); // separate read / refresh
assert.deepEqual((await db.query("SELECT id FROM projects WHERE program @> '{housing}' ORDER BY display_order, id")).rows.map(r=>r.id), ['a','c']);
await assert.rejects(reorder(['a','a','c'], ['a','b','c']));
await assert.rejects(reorder(['a','b'], ['a','b','c']));
await assert.rejects(reorder(['a','b','unknown'], ['a','b','c']));
await assert.rejects(reorder(['c','b','a'], ['b','c','a'])); // stale client
assert.deepEqual(await order(), ['a','b','c']); // all rejected writes are atomic
await db.exec("INSERT INTO projects (id, created_at) VALUES ('d',now()),('e',now())");
assert.deepEqual(await order(), ['a','b','c','d','e']);
await db.exec("DELETE FROM projects WHERE id='b'");
await reorder(['e','c','d','a'], ['a','c','d','e']);
await db.exec("INSERT INTO projects (id) VALUES ('f')");
assert.deepEqual(await order(), ['e','c','d','a','f']);
await db.exec('SET ROLE authenticated');
await assert.rejects(reorder(['a'], ['a']));
await assert.rejects(db.exec("UPDATE projects SET display_order=100 WHERE id='a'"));
await db.exec('SET ROLE anon');
await assert.rejects(reorder([], []));
await db.exec('RESET ROLE; DELETE FROM projects; SET ROLE service_role');
await reorder([], []);
await db.exec("INSERT INTO projects(id) VALUES ('after-empty')");
assert.deepEqual(await order(), ['after-empty']);
await db.close();
console.log('PASS: initial order, persistence, category order, atomic swaps, invalid/stale writes, append/delete/empty list, role restrictions');
