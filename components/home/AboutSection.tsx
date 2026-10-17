import Image from "@/components/ui/SiteImage";
import { featuredVideo, introductionVideo, homeCopy, homeLinks, memberImages, overviewSlides } from "@/data/site";
import MotionReveal from "@/components/motion/MotionReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import ImageCarousel from "@/components/ui/ImageCarousel";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

export default function AboutSection() {
  return (
    <section id="about" className="overflow-hidden bg-[var(--brand-blue)] py-10 text-white lg:py-12" aria-labelledby="about-heading">
      <div className="section-shell">
        <MotionReveal>
          <div className="grid gap-5 border-b border-white/25 pb-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:pb-8">
            <div>
              <h2 id="about-heading" className="text-3xl font-black leading-tight tracking-tight sm:text-4xl xl:text-5xl">nu_digitalについて</h2>
              <p className="mt-3 text-sm font-bold tracking-wider text-white/75">日本大学デジタル創作研究会</p>
            </div>
            <div>
              <p className="text-base font-medium leading-7 text-white/90">{homeCopy.about}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {homeLinks.about.map((link) => (
                  <ButtonLink key={link.href} href={link.href} variant="light">{link.label}</ButtonLink>
                ))}
              </div>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-6 grid items-start gap-7 lg:mt-8 lg:grid-cols-[1.35fr_1fr]">
          <div className="min-w-0">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 className="text-xl font-black">団体概要スライド</h3>
              <span className="text-xs text-white/65">{overviewSlides.length}枚</span>
            </div>
            <ImageCarousel images={overviewSlides} />
          </div>
          <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {[introductionVideo, featuredVideo].map((video, index) => (
              <div key={video.videoId} className="min-w-0">
                <div className="mb-3 flex items-baseline gap-3">
                  <h3 className="text-xl font-black">{index === 0 ? "団体紹介" : "制作物紹介"}</h3>
                </div>
                <div className="[&>div]:mt-0">
                  <YouTubeEmbed videoId={video.videoId} title={video.title} />
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12} className="mt-7 border-t border-white/25 pt-6 lg:mt-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-xl font-black">メンバー</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {memberImages.map((member) => (
              <div key={member.src} className="relative aspect-[4/3] overflow-hidden border border-white/20 bg-white">
                <Image src={member.src} alt={member.alt} fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px" className="object-contain" />
              </div>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
