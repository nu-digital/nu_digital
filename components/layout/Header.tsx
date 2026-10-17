"use client";

import Link from "next/link";
import Image from "@/components/ui/SiteImage";
import { useState } from "react";
import { FaBars, FaGithub, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Sidebar from "@/components/layout/Sidebar";
import { siteConfig, socialLinks } from "@/data/site";

const socialIcons = {
  github: FaGithub,
  youtube: FaYoutube,
  x: FaXTwitter,
};

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-[var(--brand-ink)] lg:fixed lg:inset-y-0 lg:left-0 lg:w-[104px] lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-4 lg:h-full lg:flex-col lg:px-0 lg:py-5">
          <Link
            href="/"
            aria-label={`${siteConfig.name} home`}
            className="grid h-12 w-12 place-items-center bg-[var(--brand-blue)] text-sm font-black text-white"
          >
            <Image src="/images/icons/nu_digital.webp" alt={siteConfig.name} width={48} height={48} priority />
          </Link>


          <div className="hidden flex-col items-center gap-4 lg:flex">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.type];

              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-12 w-12 items-center justify-center text-slate-500 transition hover:text-[var(--brand-blue)]"
                >
                  <Icon aria-hidden size={32} />
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="メニューを開く"
            className="inline-flex h-11 w-11 items-center justify-center border border-slate-200 text-[var(--brand-blue)] lg:hidden"
          >
            <FaBars aria-hidden size={18} />
          </button>
        </div>
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
