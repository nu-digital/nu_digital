import ContentCard from "@/components/content/ContentCard";
import type { ContentMeta } from "@/lib/markdown";

export default function PostCard(props: ContentMeta) {
  return <ContentCard {...props} />;
}
