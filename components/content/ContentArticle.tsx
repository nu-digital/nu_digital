import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import { withBasePath } from "@/lib/paths";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { getBlogFeed, type ContentPost } from "@/lib/markdown";
import ContentCard from "@/components/content/ContentCard";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import { getYouTubeVideoIds } from "@/lib/youtube";
import { formatArticleDate, rehypeArticleGallery } from "@/lib/content-presentation.mjs";
import ArticleMedia from "@/components/content/ArticleMedia";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { featuredVideo, overviewSlides } from "@/data/site";

type ContentArticleProps = { post: ContentPost };

export default function ContentArticle({ post }: ContentArticleProps) {
  const hasFeaturedVideo = /<div\s+data-video="featured"\s*>\s*<\/div>/.test(post.content);
  const videoIds = getYouTubeVideoIds(post.content)
    .filter((id) => !hasFeaturedVideo || id !== featuredVideo.videoId);
  const latestPosts = getBlogFeed()
    .filter((item) => item.collection !== post.collection || item.slug !== post.slug)
    .slice(0, 5);

  return (
    <main className="bg-white px-4 py-8 text-[var(--brand-ink)] sm:px-6 lg:py-12">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="パンくずリスト" className="mb-8 flex items-center gap-3 text-xs text-slate-500">
          <Link href="/" className="hover:text-[var(--brand-blue)]">ホーム</Link>
          <span aria-hidden>›</span>
          <Link href="/blog" className="hover:text-[var(--brand-blue)]">ブログ</Link>
          <span aria-hidden>›</span>
          <span>記事</span>
        </nav>
        <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-10">
          <article className="min-w-0">
            <header className="mb-8 border-b border-slate-200 pb-7">
              {post.date && (
                <time dateTime={/^\d{4}-\d{2}-\d{2}$/.test(post.date) ? post.date : undefined} className="text-sm font-bold text-slate-500">{formatArticleDate(post.date)}</time>
              )}
              <span className="ml-4 text-xs font-bold text-[var(--brand-blue)]">{post.category}</span>
              <h1 className="mt-3 break-words text-2xl font-black leading-relaxed tracking-tight sm:text-3xl lg:text-4xl lg:leading-snug">{post.title}</h1>
            </header>
            <ArticleMedia>
            <div className="mb-10 bg-slate-50">
              <Image src={post.image} alt={post.title} role="button" tabIndex={0} aria-label="カバー画像を拡大" width={1200} height={675} priority sizes="(min-width: 1280px) 870px, (min-width: 1024px) calc(100vw - 152px), 100vw" className="mx-auto h-auto max-h-[560px] w-full cursor-zoom-in object-contain" />
            </div>
            {videoIds.length > 0 && (
              <section aria-label="記事の関連動画" className="mb-10 space-y-6 [&>div]:mt-0">
                {videoIds.map((videoId, index) => (
                  <YouTubeEmbed key={videoId} videoId={videoId} title={`${post.title} 関連動画 ${index + 1}`} />
                ))}
              </section>
            )}
            <div className="article-body prose prose-blue max-w-none text-base leading-[1.95] prose-headings:tracking-tight prose-a:text-[var(--brand-blue)] prose-pre:bg-slate-950">
              <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeArticleGallery]} remarkPlugins={[remarkGfm]} urlTransform={(url) => withBasePath(defaultUrlTransform(url))}
                components={{
                  div: ({ node, children, ...props }) => node?.properties?.dataCarousel === "overview" ? (
                    <div className="not-prose my-8 bg-[var(--brand-blue)] p-4 text-white sm:p-6">
                      <p className="mb-4 text-lg font-bold">団体概要スライド</p>
                      <ImageCarousel images={overviewSlides} />
                    </div>
                  ) : node?.properties?.dataVideo === "featured" ? (
                    <div className="not-prose my-8">
                      <YouTubeEmbed videoId={featuredVideo.videoId} title={featuredVideo.title} />
                    </div>
                  ) : typeof node?.properties?.dataYoutube === "string" && /^[\w-]{11}$/.test(node.properties.dataYoutube) ? (
                    <div className="not-prose my-8">
                      <YouTubeEmbed videoId={node.properties.dataYoutube} title={`${post.title} 紹介動画`} />
                    </div>
                  ) : <div {...props}>{children}</div>,
                }}>
                {post.content}
              </ReactMarkdown>
            </div>
            </ArticleMedia>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 py-6 text-sm">
              <span className="text-slate-500">投稿者：{post.author}</span>
              <Link href="/blog" className="font-bold text-[var(--brand-blue)]">ブログ一覧へ →</Link>
            </div>
          </article>
          <aside aria-labelledby="latest-articles" className="min-w-0 border-t-4 border-[var(--brand-blue)] pt-5 xl:sticky xl:top-6">
            <h2 id="latest-articles" className="text-xl font-black">新着ブログ</h2>
            <div className="mt-2">
              {latestPosts.map((item) => (
                <ContentCard key={`${item.collection}/${item.slug}`} {...item} compact showCategory={false} />
              ))}
            </div>
            <Link href="/blog" className="mt-5 block border border-slate-200 px-4 py-3 text-center text-sm font-bold text-[var(--brand-blue)] hover:bg-blue-50">すべての記事を見る</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
