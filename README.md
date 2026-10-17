# nu_digital website

nu_digital の公式ホームページです。

ゲーム制作、VRChat ワールド、3D、Web、映像、サウンドなどの活動を紹介し、ニュース・ブログ・公開コンテンツを管理します。

## 使用技術

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Markdown
- gray-matter
- remark-gfm
- rehype-raw
- react-icons
- ESLint

## 開発方法

初回は依存関係をインストールします。

```powershell
npm.cmd install
```

開発サーバーを起動します。

```powershell
npm.cmd run dev
```

通常は次のURLで確認できます。

```txt
http://localhost:3000
```

ビルド確認をします。

```powershell
npm.cmd run build
```

Lint確認をします。

```powershell
npm.cmd run lint
```

## GitHub Pages への公開

公開URL: https://yurarara23.github.io/nu_digital/

`.github/workflows/pages.yml` が `main` への push 時に lint・静的ビルド・公開を実行します。Pull Request では lint とビルドのみ実行します。Actions 画面から手動実行もできます。

リポジトリの Settings → Pages → Source は **GitHub Actions** を選択します。追加のシークレットは不要です。

Next.js の静的出力を `out/` に生成します。画像最適化サーバーは使用せず、既存の WebP を配信します。新しい画像コンポーネントには `components/ui/SiteImage.tsx` を使い、通常の内部リンクには `next/link` を使ってください。Markdown 内のルート相対URLも自動で公開先のパスに対応します。

本番と同じパスでローカルビルドする場合:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = "/nu_digital"
$env:NEXT_PUBLIC_SITE_URL = "https://yurarara23.github.io/nu_digital"
npm.cmd run build
```

`npm run start` は静的出力のプレビューには使えません。`out/` を静的サーバーの `/nu_digital/` 配下で配信してください。通常の開発は環境変数を設定しないシェルで `npm run dev` を使います。

カスタムドメインに変更する際は Pages のドメイン設定に加え、workflow の `NEXT_PUBLIC_BASE_PATH` を空文字列、`NEXT_PUBLIC_SITE_URL` を新しいURLに変更して再ビルドします。

設定参考: [GitHub Pages のカスタムワークフロー](https://docs.github.com/ja/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## ディレクトリ構成

```txt
app/
  page.tsx              トップページ
  layout.tsx            共通レイアウト
  globals.css           全体スタイル・ブランドカラー
  blog/
    page.tsx            ブログ一覧
    [slug]/page.tsx     ブログ詳細
  news/
    page.tsx            ニュース一覧
    [slug]/page.tsx     ニュース詳細
  project/page.tsx      公開コンテンツ一覧
  terms/page.tsx        利用規約

components/
  home/                 トップページの各セクション
  layout/               Header / Sidebar / Footer
  content/              記事カード・記事本文
  ui/                   汎用UI
  motion/               Framer Motionラッパー

content/
  blog/                 ブログ記事Markdown
  news/                 ニュース記事Markdown
  project/              制作コンテンツMarkdown

data/
  site.ts               サイト設定、ナビ、リンク、公開コンテンツ

lib/
  markdown.ts           Markdown読み込み処理

public/
  images/               サイトで使用する画像（全画像のGit管理先）
    contents/           公開VRChatコンテンツ画像
    member/             メンバー紹介画像
    imported/           移行データから取り込んだ画像
    2026_6/             記事用画像
```

## デザイン管理

ブランドカラーなどの基本色は `app/globals.css` のCSS変数で管理します。

```css
:root {
  --brand-blue: #004aad;
  --brand-white: #ffffff;
  --brand-ink: #071b3f;
  --brand-pale: #f7f8fb;
  --brand-line: #d9e2f4;
}
```

サイト全体で使う文言、ナビゲーション、SNSリンク、トップページの画像、公開コンテンツは `data/site.ts` にまとめています。

## 記事追加方法

記事は Markdown で追加します。

ブログ記事は `content/blog/` に追加します。

```txt
content/blog/my-article.md
```

ニュース記事は `content/news/` に追加します。

```txt
content/news/my-news.md
```

ファイル名がURLになります。

```txt
content/blog/iwakenlab-5th-mini-exhibit.md
→ /blog/iwakenlab-5th-mini-exhibit
```

### Frontmatter

記事の先頭に次の情報を書きます。

```md
---
title: "記事タイトル"
image: "/images/2026_6/example.webp"
author: "yurarara"
date: "2026-07-14"
category: "Event"
excerpt: "一覧に表示する短い説明文です。"
---

本文を書きます。
```

### 画像の置き場所

記事用画像は `public/images/` 配下に置きます。

例:

```txt
public/images/2026_6/example.webp
```

Markdownからは次のように参照します。

```md
![説明文](/images/2026_6/example.webp)
```

HTMLタグも使えます。

```html
<figure>
  <img src="/images/2026_6/example.webp" alt="説明文" style="width:100%">
  <figcaption>キャプション</figcaption>
</figure>
```

YouTubeを埋め込む場合:

```html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="動画タイトル"
  style="width:100%; aspect-ratio:16/9; border:0;"
  allowfullscreen
></iframe>
```

## 公開コンテンツ追加方法

制作コンテンツの一覧・詳細は `content/project/` のMarkdownで管理します。トップページのおすすめ作品は `data/site.ts` の `featuredProjects` に追加します。

画像は `public/images/contents/` に置きます。

```txt
public/images/contents/my-world.webp
```

`data/site.ts` に追加します。

```ts
export const featuredProjects = [
  {
    title: "World Name",
    description: "ワールドの説明文です。",
    image: "/images/contents/my-world.webp",
    link: "https://vrchat.com/home/world/xxxxxxxx/info",
  },
];
```

ここに追加したコンテンツは、次の場所に反映されます。

- トップページの Works / VRChat World 表示
- トップページの Works カルーセル

## トップページのおすすめ作品

- 学生VR集会 Webサイト
- ReCall
- LBE Restaurant Simulator

現在のおすすめ作品画像は `public/images/imported/` にあります。紹介動画は `data/site.ts` の `featuredVideo` で設定します。

## 運用メモ

- 記事本文を増やすだけなら `content/blog` または `content/news` にMarkdownを追加します。
- 公開作品を増やす場合は `public/images/contents` に画像を置き、`content/project/` にMarkdownを追加します。
- デザインの色を変える場合は、まず `app/globals.css` のCSS変数を変更します。
- トップページの構成を変える場合は `components/home/` を編集します。

## 移行データと画像管理

詳細は [今回の変更とコミット分割案](docs/migration-review.md) を参照してください。

画像はfaviconを除きWebPで管理し、長辺は2,560px以内にします。`python scripts/optimize_images.py` で変換・参照更新できます（PythonとPillowが必要）。PNG由来は可逆圧縮、写真のJPEGと縮小対象WebPはquality=88で保存します。小さい画像は拡大しません。変換前データはGit対象外の `.image-originals/` に残します。
