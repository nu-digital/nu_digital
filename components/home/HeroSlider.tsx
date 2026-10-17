"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/data/site";

const heroLinks = [
  { href: "/blog", label: "BLOG" },
  { href: "/project", label: "PRODUCTS" },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const current = heroSlides[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[var(--brand-blue)] lg:min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.src}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/72 via-blue-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-950/70 to-transparent" />

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-end px-5 pb-10 pt-20 lg:min-h-screen lg:px-12 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl text-white"
        >
          <p className="mb-4 text-sm font-bold tracking-wider sm:text-base lg:text-lg">
            日本大学デジタル創作研究会
          </p>
          <h1 className="editorial-title max-w-4xl font-black">
            nu_digital
          </h1>
        </motion.div>

        <div className="mt-10 grid max-w-3xl border-y border-white/35 text-white md:grid-cols-2">
          {heroLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-white/35 px-5 py-4 text-sm font-black tracking-[0.22em] transition hover:bg-white hover:text-[var(--brand-blue)] md:border-r md:last:border-r-0"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-2 lg:flex">
        {heroSlides.map((slide, slideIndex) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`キービジュアル ${slideIndex + 1}`}
            onClick={() => setIndex(slideIndex)}
            className={`h-[3px] w-10 transition ${
              index === slideIndex ? "bg-white" : "bg-white/35"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
