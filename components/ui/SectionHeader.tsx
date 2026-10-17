type SectionHeaderProps = {
  title: string;
  description?: string;
  tone?: "light" | "dark";
};

export default function SectionHeader({
  title,
  description,
  tone = "light",
}: SectionHeaderProps) {
  const isDark = tone === "dark";

  return (
    <>
      <p
        className={`font-mono text-xs font-bold uppercase tracking-[0.3em] ${
          isDark ? "text-white/65" : "text-[var(--brand-blue)]"
        }`}
      >
        nu_digital
      </p>
      <h2
        className={`mt-3 text-4xl font-black tracking-tight md:text-5xl ${
          isDark ? "text-white" : "text-[var(--brand-ink)]"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 whitespace-pre-line text-base leading-8 ${
            isDark ? "text-white/78" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </>
  );
}
