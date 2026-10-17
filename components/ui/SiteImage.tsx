import Image, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/paths";

export default function SiteImage({ src, alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} src={typeof src === "string" ? withBasePath(src) : src} />;
}
