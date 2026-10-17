import ProductCarousel from "@/components/home/ProductCarousel";
import Link from "next/link";
import ContentCard from "@/components/content/ContentCard";
import MotionReveal from "@/components/motion/MotionReveal";
import { featuredProjects } from "@/data/site";
import { getAllContent, getBlogFeed } from "@/lib/markdown";

export default function BlogSection() {
  const latestPosts = getBlogFeed(6);
  const featuredLinks = new Set(featuredProjects.map((project) => project.link));
  const products = [
    ...featuredProjects,
    ...getAllContent("project")
      .filter((project) => !featuredLinks.has(`/project/${project.slug}`))
      .map((project) => ({ title: project.title, image: project.image, link: `/project/${project.slug}` })),
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section-shell">
        <MotionReveal>
          <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="mt-2 text-5xl font-black uppercase tracking-tight text-[var(--brand-ink)]">
                Blog
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-black uppercase tracking-[0.18em] text-[var(--brand-blue)]"
            >
              すべて見る
            </Link>
          </div>

          <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
            {latestPosts.map((post) => (
              <ContentCard key={`${post.collection}/${post.slug}`} {...post} compact showCategory={false} />
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1} className="mt-20">
          <ProductCarousel products={products} />
        </MotionReveal>
      </div>
    </section>
  );
}
