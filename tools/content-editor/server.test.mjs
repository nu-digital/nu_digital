import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import matter from 'gray-matter';
import { createEditor } from './server.mjs';

test('article editing preserves data, backs up originals, and rejects stale/unauthorized writes', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nu-editor-test-'));
  for (const collection of ['blog', 'news', 'project']) fs.mkdirSync(path.join(root, 'content', collection), { recursive: true });
  fs.mkdirSync(path.join(root, 'public', 'images'), { recursive: true });
  const file = path.join(root, 'content', 'blog', 'sample.md');
  const raw = '---\ntitle: "元タイトル"\ndate: "2026-10-17"\nsourceId: "preserve-me"\ncustom:\n  enabled: true\n---\n\n## 本文\n\n変更前\n';
  fs.writeFileSync(file, raw);
  const server = createEditor(root);
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const get = url => fetch(origin + url);
  let token;
  const post = (url, data, auth = true) => fetch(origin + url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, ...(auth ? { 'X-Editor-Token': token } : {}) }, body: JSON.stringify(data) });
  try {
    ({ token } = await (await get('/api/session')).json());
    const list = await (await get('/api/articles')).json(); assert.equal(list.length, 1);
    const article = list[0]; assert.equal(article.metadata.date, '2026.10.17');
    const payload = { id: article.id, version: article.version, metadata: { title: '編集済み' }, body: '\n## 本文\n\n変更後\n' };
    assert.equal((await post('/api/save', payload, false)).status, 403);
    assert.equal(fs.readFileSync(file, 'utf8'), raw);
    assert.equal((await get('/api/article?id=blog%2F..%2F..%2Fpackage')).status, 400);
    const save = await post('/api/save', payload); assert.equal(save.status, 200);
    const saved = await save.json();
    const parsed = matter(fs.readFileSync(file, 'utf8')); assert.equal(parsed.data.title, '編集済み'); assert.equal(parsed.data.sourceId, 'preserve-me'); assert.deepEqual(parsed.data.custom, { enabled: true });
    const backups = path.join(root, '.content-editor', 'backups', 'blog', 'sample'); assert.equal(fs.readFileSync(path.join(backups, fs.readdirSync(backups)[0]), 'utf8'), raw);
    assert.equal((await post('/api/save', payload)).status, 409);
    const bodySave = await (await post('/api/save', { id: saved.id, version: saved.version, metadata: {}, body: '\n本文のみ編集\n' })).json(); assert.equal('dateLabel' in bodySave.metadata, false);
    assert.equal(matter(fs.readFileSync(file, 'utf8')).data.sourceId, 'preserve-me');
    const dated = await (await post('/api/save', { id: bodySave.id, version: bodySave.version, metadata: { date: '2026.08.13–22' }, body: bodySave.body })).json();
    assert.equal(dated.metadata.date, '2026.08.13–22');
    assert.equal(matter(fs.readFileSync(file, 'utf8')).data.date, '2026.08.13–22');
    assert.equal('dateLabel' in matter(fs.readFileSync(file, 'utf8')).data, false);
    assert.equal((await post('/api/save', { id: dated.id, version: dated.version, metadata: { date: '2026.02.30' }, body: dated.body })).status, 400);
    const preview = await (await post('/api/preview', { metadata: { title: '<script>bad()</script>' }, body: '| A | B |\n|---|---|\n| 1 | 2 |\n\n![画像](/images/test.webp)\n<script>bad()</script>' })).json();
    assert.match(preview.html, /<table>/); assert.match(preview.html, /Content-Security-Policy/); assert.match(preview.html, /&lt;script&gt;/);
  } finally {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
