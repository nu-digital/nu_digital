import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { articleCategory, articleDateOrder } from "./content-presentation.mjs";

export type ContentCollection = "blog" | "news" | "project";

const contentDirectories: Record<ContentCollection, string> = {
  project: path.join(process.cwd(), "content", "project"),
  blog: path.join(process.cwd(), "content", "blog"),
  news: path.join(process.cwd(), "content", "news"),
};

export type ContentMeta = {
  collection: ContentCollection;
  slug: string;
  title: string;
  image: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
};

export type ContentPost = ContentMeta & {
  content: string;
};

function getDirectory(collection: ContentCollection) {
  return contentDirectories[collection];
}

function readContentFile(collection: ContentCollection, slug: string) {
  if (!/^[\w.-]+$/.test(slug)) {
    return null;
  }

  const filePath = path.join(getDirectory(collection), `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf-8");
}

function normalizeContent(
  collection: ContentCollection,
  slug: string,
  fileContent: string,
): ContentPost {
  const { data, content } = matter(fileContent);
  const fallbackExcerpt = content.replace(/\s+/g, " ").trim().slice(0, 120);

  return {
    collection,
    slug,
    title: String(data.title ?? slug),
    image: String(data.image ?? "/images/ogp/member.webp"),
    author: String(data.author ?? "nu_digital"),
    date: String(data.date ?? ""),
    category: articleCategory(collection, String(data.category ?? "")),
    excerpt: String(data.excerpt ?? fallbackExcerpt),
    content,
  };
}

export function getAllContent(collection: ContentCollection): ContentMeta[] {
  const directory = getDirectory(collection);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fileContent = fs.readFileSync(path.join(directory, fileName), "utf-8");
      const post = normalizeContent(collection, slug, fileContent);

      return {
        collection: post.collection,
        slug: post.slug,
        title: post.title,
        image: post.image,
        author: post.author,
        date: post.date,
        category: post.category,
        excerpt: post.excerpt,
      };
    })
    .sort((a, b) => articleDateOrder(b.date) - articleDateOrder(a.date));
}

export function getLatestContent(collection: ContentCollection, limit: number) {
  return getAllContent(collection).slice(0, limit);
}

export function getContentBySlug(
  collection: ContentCollection,
  slug: string,
) {
  const fileContent = readContentFile(collection, slug);

  if (!fileContent) {
    return null;
  }

  return normalizeContent(collection, slug, fileContent);
}

export function getAllContentSlugs(collection: ContentCollection) {
  return getAllContent(collection).map((post) => ({ slug: post.slug }));
}

export const getAllPosts = () => getAllContent("blog");
export const getLatestPosts = (limit: number) => getLatestContent("blog", limit);
export const getPostBySlug = (slug: string) => getContentBySlug("blog", slug);
export const getAllPostSlugs = () => getAllContentSlugs("blog");

// Period-only records use their stated starting month/day for ordering only.
function chronology(post: ContentMeta) {
  return articleDateOrder(post.date);
}

export function getBlogFeed(limit?: number): ContentMeta[] {
  const posts = [...getAllContent("blog"), ...getAllContent("news"), ...getAllContent("project")]
    .sort((a, b) => chronology(b) - chronology(a) || a.slug.localeCompare(b.slug));
  return limit === undefined ? posts : posts.slice(0, limit);
}
