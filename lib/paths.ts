export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Next Link handles basePath itself; native URLs and images need it explicitly.
export function withBasePath(url: string): string {
  if (!basePath || !url.startsWith("/") || url.startsWith("//") ||
      url === basePath || url.startsWith(`${basePath}/`)) return url;
  return `${basePath}${url}`;
}
