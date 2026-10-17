import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "brand" | "light";
};

const variants = {
  brand:
    "bg-[var(--brand-blue)] text-white hover:bg-[#003a88]",
  light:
    "bg-white text-[var(--brand-blue)] hover:bg-slate-100",
};

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export default function ButtonLink({
  href,
  children,
  variant = "brand",
}: ButtonLinkProps) {
  const className = `inline-flex items-center justify-center px-7 py-3 text-sm font-black uppercase tracking-[0.12em] transition ${variants[variant]}`;

  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noopener noreferrer"}
      className={className}
    >
      {children}
    </a>
  );
}
