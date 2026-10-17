import ContentCard from "@/components/content/ContentCard";

import { getAllContent } from "@/lib/markdown";

export default function ProjectPage() {
  return (
    <main className="min-h-screen px-5 py-14 text-[var(--brand-ink)] md:py-20">
      <header className="mx-auto mb-12 max-w-6xl border-b-4 border-[var(--brand-blue)] pb-6">
        <h1 className="mt-3 text-6xl font-black uppercase leading-none tracking-tight md:text-7xl">
          Contents
        </h1>
        <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-slate-600">
          nu_digitalの制作物や公開中のプロジェクトをまとめています。
        </p>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {getAllContent("project").map((project) => (
          <ContentCard key={project.slug} {...project} />
        ))}
      </section>
    </main>
  );
}
