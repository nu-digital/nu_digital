---
title: "メタ創専用CMSができました"
image: "/images/imported/img-e88ab2587c1261de9af6.webp"
author: "yurarara"
date: "2025-09-03"
category: "Blog"
excerpt: "「どのフォルダに画像を入れるの？」「そもそも環境構築で詰む」… そんな声に応えるために、 非エンジニアでも記事が書きやすい CMS を開発しました。 その名も MetaCMS 。"
sourceId: "blog/metacms_article"
---

<!-- 元URL: https://nu-meta.vercel.app/blog/metacms_article | 取得日: 2026-10-16 -->

![メタ創専用CMSができました](/images/imported/img-e88ab2587c1261de9af6.webp)

## ブログが書きにくい？

「どのフォルダに画像を入れるの？」「そもそも環境構築で詰む」…  
そんな声に応えるために、**非エンジニアでも記事が書きやすい CMS** を開発しました。  
その名も **MetaCMS**。

MetaCMS は、記事をローカル環境で管理できるとても便利なアプリです。  
メタ創のホームページに直接投稿できる機能はまだ開発中ですが、しばらくはこのローカル CMS を使ってもらいます。

---

### 使い方

まず以下のコマンドを使って、リポジトリをデスクトップなどわかりやすい場所にクローンしてください。

```
git clone https://github.com/yurarara23/LocalCMS
```

クローンしたフォルダ内にある`setup.bat` を実行します。

![記事画像](/images/imported/img-1b7f5e020bf719003359.webp)

この画面が表示されますが、そのまま実行してください。  
※ Python と pip をインストールしてパスを通しておかないとエラーになります。わからなかったら直接聞いてください。

---

その後、

![記事画像](/images/imported/img-8e8126d089b53e63b87d.webp)
このように表示されるので

```
yes
```

と入力してください。

少し待つとダウンロードが始まり、`setup complete` と表示されたら準備完了です。

![記事画像](/images/imported/img-869bb807bab34ece119e.webp)

※ Python と pip をインストールしてパスを通しておかないとエラーになります!!!

```
where python
```

```
where pip
```

↑ これを cmd で実行するとパスが通っているか確認できます。

---

セットアップが終了後、一度コマンド画面を閉じてフォルダ内の `app.bat` を実行すると、CMS が起動します。  
CMS をこれから起動するときは app.bat を使ってください。

![記事画像](/images/imported/img-b5962bf3284c8d9f05f2.webp)

---

### 記事の作成とエクスポート

「新規作成」から記事を書けます。

![記事画像](/images/imported/img-067556e3edffe26f7558.webp)
![記事画像](/images/imported/img-ca4109a570e75eb1ba9f.webp)

某技術ブログサービスのように、Markdown を編集しながらリアルタイムでプレビューできます。  
編集が終わったら一番下の「保存」ボタンを押し、記事作成完了です！

記事一覧から「export」をクリックすると記事と画像をセットでまとめた zip ファイルができるので
出力された zip ファイルを yurarara に渡してもらえれば、ホームページに人力でアップロードします。  
※ 将来的にはここも自動化しようと思ってる...

---

MetaCMS を使えば、メタ創のメンバーは今まで以上に簡単に記事作成＆共有ができます。  
デザイン、細かい機能などまだ修正点も多くあるので、ぜひ使いながらフィードバックをください！

![yurarara](/images/imported/img-17e875a51d1f648d2574.webp)

## 関連する活動・制作物

- [団体ホームページ](/project/organization-website)
