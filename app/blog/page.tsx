import ContentCard from "@/components/content/ContentCard";
import { getBlogFeed } from "@/lib/markdown";

export default function BlogPage() {
  const latestPosts = getBlogFeed();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <header className="mb-12 border-b-4 border-[var(--brand-blue)] pb-6">
        <h1 className="mt-3 text-6xl font-black uppercase leading-none tracking-tight text-[var(--brand-ink)] md:text-7xl">
          Blog
        </h1>
        <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-slate-600">
          活動報告、お知らせ、制作コンテンツを、新しい順にまとめています。
        </p>
      </header>

      <div className="grid min-w-0 gap-x-8 gap-y-10 md:grid-cols-2">
        {latestPosts.map((post) => (
          <ContentCard key={`${post.collection}/${post.slug}`} {...post} />
        ))}
      </div>
    </main>
  );
}
