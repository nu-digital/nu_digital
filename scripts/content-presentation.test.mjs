import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { formatArticleDate, articleDateOrder, articleCategory, rehypeArticleGallery } from '../lib/content-presentation.mjs';

test('dates share a format without inventing missing days', () => {
  assert.equal(formatArticleDate('2026-01-02'), '2026.01.02');
  assert.equal(formatArticleDate('2026年1月2日'), '2026.01.02');
  assert.equal(formatArticleDate('2025年3月〜 6月'), '2025.03–06');
  assert.equal(formatArticleDate('2026年8月13日〜22日'), '2026.08.13–22');
  assert.equal(formatArticleDate('2026年8月1〜2日'), '2026.08.01–02');
  assert.equal(formatArticleDate(''), '');
  assert.equal(articleDateOrder('2026.08.13–22'), Date.UTC(2026, 7, 13));
  assert.equal(articleDateOrder('2025年3月〜 6月'), Date.UTC(2025, 2, 1));
  assert.equal(articleCategory('project', '制作コンテンツ'), 'Product');
  assert.equal(articleCategory('news', 'News'), 'Blog');
  assert.equal(articleCategory('blog', 'Product'), 'Product');
});
test('galleries hide photo labels while preserving meaningful headings, prose, alt text and images', () => {
  const markdown = '### 制作の工夫\n\n本文を維持。\n\n## 写真（サイト掲載順）\n\n### 写真タイトル1\n\n![説明1](/images/1.webp "非表示タイトル")\n\n### 写真タイトル2\n\n![説明2](/images/2.webp)\n\n## 次の話\n\n### 残す見出し\n\n本文。\n\n<figure><img src="/images/3.webp" alt="説明3"><figcaption>写真キャプション</figcaption></figure>';
  const html = renderToStaticMarkup(React.createElement(ReactMarkdown, { rehypePlugins: [rehypeRaw, rehypeArticleGallery] }, markdown));
  assert.match(html, /data-count="2"/);
  assert.match(html, /制作の工夫/); assert.match(html, /残す見出し/); assert.match(html, /本文を維持/);
  assert.doesNotMatch(html, /写真タイトル|写真キャプション|非表示タイトル/);
  assert.equal((html.match(/<img /g) || []).length, 3);
  assert.match(html, /alt="説明1"/); assert.match(html, /tabindex="0"/);
});
