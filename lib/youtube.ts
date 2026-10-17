export function getYouTubeVideoIds(content: string): string[] {
  const ids = new Set<string>();
  for (const match of content.matchAll(/https?:\/\/[^\s<>"'\]\)]+/g)) {
    try {
      const url = new URL(match[0].replace(/&amp;/g, "&"));
      const host = url.hostname.toLowerCase();
      let id: string | null = null;
      if (host === "youtu.be") id = url.pathname.split("/")[1];
      if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) {
        id = url.pathname === "/watch" ? url.searchParams.get("v") : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
      }
      if (id && /^[\w-]{11}$/.test(id)) ids.add(id);
    } catch {
      // Ignore malformed links; keep the original article text unchanged.
    }
  }
  return [...ids];
}
