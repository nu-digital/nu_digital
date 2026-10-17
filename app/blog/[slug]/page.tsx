import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentArticle from "@/components/content/ContentArticle";
import { siteConfig } from "@/data/site";
import { getAllContentSlugs, getContentBySlug } from "@/lib/markdown";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllContentSlugs("blog");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getContentBySlug("blog", slug);

  if (!post) {
    return {};
  }

  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${siteConfig.url}${post.image}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getContentBySlug("blog", slug);

  if (!post) {
    notFound();
  }

  return <ContentArticle post={post} />;
}
