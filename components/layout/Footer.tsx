import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { siteConfig, socialLinks } from "@/data/site";

const githubLink = socialLinks.find((link) => link.type === "github");

export default function Footer() {
  return (
    <footer className="relative border-t border-white/20 bg-[var(--brand-blue)] px-6 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
        <div className="max-w-md">
          <p className="text-3xl font-black tracking-tight">{siteConfig.name}</p>
          <p className="mt-4 text-sm font-bold leading-7 text-white/75">
            ゲーム、VRChat、3D、Webなどを横断して、デジタル創作を続けるプロジェクト団体です。
          </p>
          <p className="mt-6 text-xs uppercase tracking-widest text-white/55">
            &copy; 2026 {siteConfig.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-8 text-sm font-bold text-white/80">

          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/project" className="hover:text-white">
            Project
          </Link>
          <Link href="/terms" className="hover:text-white">
            利用規約
          </Link>

          {githubLink && (
            <a
              href={githubLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <FaGithub aria-hidden size={18} />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
