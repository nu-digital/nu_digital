"use client";

import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import { useId, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Product = { title: string; image: string; link: string };

export default function ProductCarousel({ products }: { products: Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();

  function scroll(direction: number) {
    const element = track.current;
    if (!element) return;
    const card = element.firstElementChild as HTMLElement | null;
    element.scrollBy({
      left: direction * ((card?.offsetWidth ?? element.clientWidth) + 16),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <section aria-label="制作物一覧">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-[var(--brand-ink)]">Products</h2>
        <div className="flex items-center gap-3">
          <Link href="/project" className="mr-2 text-sm font-bold text-[var(--brand-blue)]">すべて見る</Link>
          <button type="button" aria-label="前の作品へ" aria-controls={id} onClick={() => scroll(-1)} className="grid h-11 w-11 place-items-center border border-slate-300 text-[var(--brand-blue)] hover:bg-blue-50">
            <FaChevronLeft aria-hidden />
          </button>
          <button type="button" aria-label="次の作品へ" aria-controls={id} onClick={() => scroll(1)} className="grid h-11 w-11 place-items-center border border-slate-300 text-[var(--brand-blue)] hover:bg-blue-50">
            <FaChevronRight aria-hidden />
          </button>
        </div>
      </div>
      <div ref={track} id={id} tabIndex={0} aria-label="横にスクロールして作品を見る" className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 focus-visible:outline-2 focus-visible:outline-blue-600">
        {products.map((product) => (
          <Link key={product.link} href={product.link} className="group relative aspect-[4/5] w-[85%] shrink-0 snap-start overflow-hidden bg-[var(--brand-blue)] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
            <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent" />
            <h3 className="absolute inset-x-0 bottom-0 p-6 text-2xl font-black text-white">{product.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
