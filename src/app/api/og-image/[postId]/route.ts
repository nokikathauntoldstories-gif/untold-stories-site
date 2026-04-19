import { NextRequest } from "next/server";
import { getPostById, getPostImages } from "@/lib/posts";

// OG image proxy. Serves a stable, permanent URL at our own origin for each
// post's social-share image. This fixes two problems at once:
//
//   1. Facebook CDN URLs carry an `oe=` expiry signature (24-48h TTL). When
//      someone shares a post, FB's scraper caches our og:image URL for ~30
//      days. If that URL was a raw fbcdn.net link, the cached link dies
//      within 2 days and previews silently break for weeks. A stable
//      nokikatha.com URL never expires, so FB's cache never goes stale.
//
//   2. Any transient FB hiccup during FB's scrape would poison the cache.
//      With a proxy, the scraper always gets a 200 from us — either fresh
//      bytes from FB, Vercel edge cache, or the static fallback.
//
// Cache strategy:
//   - s-maxage=31536000 (1y on Vercel's edge) so FB's scraper and browsers
//     get instant bytes after the first fetch.
//   - stale-while-revalidate=604800 (7d) so a failed re-fetch still serves
//     the last known-good bytes while we retry in the background.
//   - immutable because (postId -> image) is content-addressed — if the
//     admin changes the image, we'd bump by publishing a new post, and the
//     old postId's og-image can safely stay pinned.
//
// If FB fetch fails AND nothing is cached yet, fall through to a static
// default so the preview card never renders blank.

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 86400; // 1 day ISR fallback

async function fetchFacebookImage(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      // Let Vercel cache at the edge for a year. FB CDN already sets long
      // cache headers on the bytes themselves; we just need to trust them.
      next: { revalidate: 31536000 },
      headers: {
        // Some FB CDN edges 403 without a UA
        "User-Agent":
          "Mozilla/5.0 (compatible; nokikatha-og/1.0; +https://nokikatha.com)",
      },
    });
    if (!res.ok) return null;
    return res;
  } catch {
    return null;
  }
}

function fallbackRedirect(req: NextRequest): Response {
  // Redirect so we don't have to ship a binary placeholder. FB's scraper
  // follows redirects on og:image. The file `/og-default.jpg` is optional —
  // if it's missing, the preview just falls back to no-image (same as
  // before this proxy existed, so never worse).
  return Response.redirect(new URL("/og-default.jpg", req.url), 302);
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ postId: string }> }
): Promise<Response> {
  const { postId } = await ctx.params;
  // URLs in <meta> use the underscore form (same as the page route)
  const post =
    getPostById(postId.replace(/_/g, "/")) || getPostById(postId);

  if (!post) return fallbackRedirect(req);

  const images = getPostImages(post);
  const src = images[0];
  if (!src) return fallbackRedirect(req);

  const upstream = await fetchFacebookImage(src);
  if (!upstream || !upstream.body) return fallbackRedirect(req);

  const contentType = upstream.headers.get("content-type") || "image/jpeg";

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      // Edge caches forever; browsers cache a day; stale bytes OK for a week
      // if the upstream fetch later fails.
      "Cache-Control":
        "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800, immutable",
    },
  });
}
