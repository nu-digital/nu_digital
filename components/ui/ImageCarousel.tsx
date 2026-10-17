"use client";

import Image from "@/components/ui/SiteImage";
import { withBasePath } from "@/lib/paths";
import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export type ImageItem = { src: string; alt: string };

export default function ImageCarousel({ images }: { images: ImageItem[] }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  if (!images.length) return null;
  const current = images[index % images.length];
  const move = (step: number) => setIndex((value) => (value + step + images.length) % images.length);

  return (
    <div className="mx-auto w-full max-w-5xl" role="region" aria-label="団体概要スライド" tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      }}>
      <div className="relative aspect-video overflow-hidden bg-white shadow-xl"
        onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          if (touchStart.current !== null) {
            const delta = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1);
          }
          touchStart.current = null;
        }}>
        <Image src={current.src} alt={current.alt} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-contain" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <a href={withBasePath(current.src)} target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline underline-offset-4">スライドを拡大 ↗</a>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => move(-1)} aria-label="前のスライドへ" className="grid h-11 w-11 place-items-center border border-white/50 hover:bg-white/15"><FaChevronLeft aria-hidden /></button>
          <span aria-live="polite" aria-atomic="true" className="min-w-16 text-center font-mono text-sm">{index + 1} / {images.length}</span>
          <button type="button" onClick={() => move(1)} aria-label="次のスライドへ" className="grid h-11 w-11 place-items-center border border-white/50 hover:bg-white/15"><FaChevronRight aria-hidden /></button>
        </div>
      </div>
    </div>
  );
}
