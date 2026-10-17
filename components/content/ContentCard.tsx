import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import type { ContentMeta } from "@/lib/markdown";
import { formatArticleDate } from "@/lib/content-presentation.mjs";

type ContentCardProps = ContentMeta & {
  compact?: boolean;
  showCategory?: boolean;
};

export default function ContentCard({
  collection,
  title,
  image,
  slug,
  date,
  category,
  excerpt,
  compact = false,
  showCategory = true,
}: ContentCardProps) {
  const href = `/${collection}/${slug}`;

  if (compact) {
    return (
      <Link
        href={href}
        className="group grid min-w-0 grid-cols-[92px_minmax(0,1fr)] gap-4 border-b border-slate-200 py-4 transition hover:border-[var(--brand-blue)]"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={image}
            alt={title}
            fill
            sizes="92px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 pr-2">
          <div className="mb-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            <time dateTime={/^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined}>{formatArticleDate(date)}</time>
            {showCategory && <span className="normal-case">{category}</span>}
          </div>
          <h3 className="line-clamp-2 break-words text-base font-black leading-snug text-[var(--brand-ink)] group-hover:text-[var(--brand-blue)]">
            {title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group grid min-w-0 border-b border-slate-200 bg-white transition hover:border-[var(--brand-blue)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 px-5 py-5 md:px-6">
        <div className="mb-3 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
          <time dateTime={/^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined}>{formatArticleDate(date)}</time>
          {showCategory && <span className="normal-case">{category}</span>}
        </div>
        <h3 className="break-words text-2xl font-black leading-tight text-[var(--brand-ink)] group-hover:text-[var(--brand-blue)]">
          {title}
        </h3>
        <p className="mt-3 line-clamp-2 break-words text-sm leading-7 text-slate-600">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}
