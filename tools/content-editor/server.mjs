import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';
import matter from 'gray-matter';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { articleCategory, articleDateOrder, formatArticleDate, rehypeArticleGallery } from '../../lib/content-presentation.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const collections = ['blog', 'news', 'project'];
const fields = ['title', 'image', 'author', 'date', 'category', 'excerpt'];
const hash = (text) => createHash('sha256').update(text).digest('hex');
const fail = (status, message) => Object.assign(new Error(message), { status });
const read = (file) => fs.readFileSync(file, 'utf8');

export function createEditor(root) {
  const token = randomBytes(32).toString('hex');
  const stateDir = path.join(root, '.content-editor');
  function articlePath(id) {
    if (!/^(blog|news|project)\/[\w.-]+$/.test(id || '')) throw fail(400, '記事IDが不正です。');
    const file = path.join(root, 'content', `${id}.md`);
    if (!fs.existsSync(file)) throw fail(404, '記事が見つかりません。');
    const relative = path.relative(fs.realpathSync(path.join(root, 'content')), fs.realpathSync(file));
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw fail(403, '対象外のファイルです。');
    return file;
  }
  function load(id) {
    const raw = read(articlePath(id));
    const parsed = matter(raw);
    const metadata = Object.fromEntries(fields.map(key => [key, parsed.data[key] instanceof Date ? parsed.data[key].toISOString().slice(0, 10) : String(parsed.data[key] ?? '')]));
    metadata.date = formatArticleDate(metadata.date);
    metadata.category = articleCategory(id.split('/')[0], metadata.category);
    return { id, metadata, displayDate: formatArticleDate(metadata.date), body: parsed.content, version: hash(raw) };
  }
  function preview(data) {
    const markdown = renderToStaticMarkup(React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw, rehypeArticleGallery] }, String(data.body || '')));
    const heading = renderToStaticMarkup(React.createElement('header', null,
      React.createElement('small', null, formatArticleDate(data.metadata?.date)),
      React.createElement('h1', null, data.metadata?.title || '無題の記事'),
      data.metadata?.image ? React.createElement('img', { src: data.metadata.image, alt: '', className: 'cover' }) : null));
    return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' https:; style-src 'unsafe-inline'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; base-uri 'none'; form-action 'none'"><style>body{font:16px/1.95 system-ui,sans-serif;color:#071b3f;margin:32px;overflow-wrap:anywhere}h1{font-size:28px;line-height:1.6}h2{border-left:4px solid #004aad;padding-left:16px;margin-top:40px;font-size:24px}img{display:block;max-width:100%;max-height:640px;height:auto;object-fit:contain;margin:24px auto}.cover{max-height:340px}a{color:#004aad}blockquote{margin:24px 0;border-left:3px solid #004aad;padding:12px 20px;background:#f3f6fc}pre{background:#071b3f;color:white;padding:16px;overflow:auto}table{border-collapse:collapse;display:block;overflow:auto}td,th{border:1px solid #d9e2f4;padding:8px}iframe{width:100%;aspect-ratio:16/9;border:0}figcaption{font-size:13px;color:#64748b;text-align:center}small{color:#64748b}${read(path.resolve(here, '../../components/content/article-media.css'))}</style></head><body>${heading}<div class="article-body">${markdown}</div></body></html>`;
  }
  const server = http.createServer(async (req, res) => {
    const send = (status, data, type = 'application/json; charset=utf-8') => {
      res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY' });
      res.end(type.startsWith('application/json') ? JSON.stringify(data) : data);
    };
    try {
      const origin = `http://127.0.0.1:${server.address().port}`;
      if (req.headers.host !== new URL(origin).host) throw fail(403, '127.0.0.1 のURLで開いてください。');
      const url = new URL(req.url, origin);
      let data;
      if (req.method === 'POST') {
        if (req.headers.origin !== origin || req.headers['x-editor-token'] !== token) throw fail(403, '編集画面を再読み込みしてください。');
        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 2 * 1024 * 1024) throw fail(413, '記事が大きすぎます。');
        }
        try { data = JSON.parse(body); } catch { throw fail(400, 'JSONが不正です。'); }
      } else if (req.method !== 'GET') throw fail(405, '未対応の操作です。');
      if (req.method === 'GET' && url.pathname === '/api/session') return send(200, { token });
      if (req.method === 'GET' && url.pathname === '/api/articles') {
        const articles = collections.flatMap(collection => fs.readdirSync(path.join(root, 'content', collection)).filter(name => name.endsWith('.md')).map(name => load(`${collection}/${name.slice(0, -3)}`)));
        return send(200, articles.sort((a, b) => articleDateOrder(b.metadata.date) - articleDateOrder(a.metadata.date)));
      }
      if (req.method === 'GET' && url.pathname === '/api/article') return send(200, load(url.searchParams.get('id')));
      if (req.method === 'GET' && url.pathname === '/api/images') {
        const base = path.join(root, 'public', 'images');
        const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isSymbolicLink() ? [] : entry.isDirectory() ? walk(path.join(dir, entry.name)) : /\.(webp|png|jpe?g|gif|ico)$/i.test(entry.name) ? ['/images/' + path.relative(base, path.join(dir, entry.name)).split(path.sep).join('/')] : []);
        return send(200, walk(base));
      }
      if (req.method === 'POST' && url.pathname === '/api/preview') return send(200, { html: preview(data) });
      if (req.method === 'POST' && url.pathname === '/api/save') {
        const file = articlePath(data.id);
        const raw = read(file);
        if (hash(raw) !== data.version) throw fail(409, '別の画面やアプリで更新されています。編集内容をコピーしてから「再読込」してください。');
        fs.mkdirSync(stateDir, { recursive: true });
        {
          if (typeof data.body !== 'string' || !data.metadata || typeof data.metadata !== 'object') throw fail(400, '本文または項目が不正です。');
          const parsed = matter(raw);
          for (const [key, value] of Object.entries(data.metadata)) {
            if (!fields.includes(key) || typeof value !== 'string') throw fail(400, '編集項目が不正です。');
            parsed.data[key] = value;
          }
          if (Object.hasOwn(data.metadata, 'date')) {
            const fullDate = data.metadata.date.trim().match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
            if (fullDate) {
              const iso = `${fullDate[1]}-${fullDate[2].padStart(2, '0')}-${fullDate[3].padStart(2, '0')}`;
              const parsedDate = new Date(iso);
              if (!Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== iso) throw fail(400, '正しい日付を入力してください。');
              parsed.data.date = iso;
            } else parsed.data.date = formatArticleDate(data.metadata.date);
          }
          if (!['Blog', 'Product'].includes(parsed.data.category)) parsed.data.category = articleCategory(data.id.split('/')[0]);
          if (!String(parsed.data.title || '').trim()) throw fail(400, 'タイトルを入力してください。');
          const next = Object.keys(data.metadata).length ? matter.stringify(data.body, parsed.data) : raw.slice(0, raw.length - parsed.content.length) + data.body;
          const backupDir = path.join(stateDir, 'backups', data.id);
          fs.mkdirSync(backupDir, { recursive: true });
          fs.writeFileSync(path.join(backupDir, `${Date.now()}-${hash(raw).slice(0, 12)}.md`), raw);
          const temp = `${file}.editor-tmp`;
          try { fs.writeFileSync(temp, next, { flag: 'wx' }); fs.renameSync(temp, file); }
          finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
        }
        return send(200, load(data.id));
      }
      if (req.method === 'GET' && url.pathname.startsWith('/images/')) {
        const base = fs.realpathSync(path.join(root, 'public', 'images'));
        const target = path.resolve(base, decodeURIComponent(url.pathname.slice(8)));
        if (!target.startsWith(base + path.sep) || !fs.existsSync(target) || !fs.realpathSync(target).startsWith(base + path.sep)) throw fail(404, '画像が見つかりません。');
        const types = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon' };
        const type = types[path.extname(target).toLowerCase()];
        if (!type) throw fail(404, '未対応の画像です。');
        return send(200, fs.readFileSync(target), type);
      }
      const assets = { '/': ['index.html', 'text/html; charset=utf-8'], '/app.js': ['app.js', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'] };
      if (req.method === 'GET' && assets[url.pathname]) {
        const [file, type] = assets[url.pathname];
        return send(200, read(path.join(here, file)), type);
      }
      throw fail(404, '見つかりません。');
    } catch (error) { send(error.status || 500, { error: error.status ? error.message : '処理に失敗しました。ターミナルを確認してください。' }); if (!error.status) console.error(error); }
  });
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createEditor(path.resolve(here, '../..'));
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? 'ポート4310は使用中です。既存の編集画面を使うか EDITOR_PORT を変更してください。' : error); process.exitCode = 1; });
  server.listen(Number(process.env.EDITOR_PORT || 4310), '127.0.0.1', () => console.log(`記事エディター: http://127.0.0.1:${server.address().port}\n終了: Ctrl+C / 保存先: content/ / バックアップ: .content-editor/backups/`));
}
