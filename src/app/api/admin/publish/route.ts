import { NextRequest, NextResponse } from "next/server";
import { fetchPostsFromGitHub, commitPostsToGitHub } from "@/lib/github";
import { postToFacebook } from "@/lib/facebook";
import { CATEGORIES } from "@/lib/categories";

const FB_PAGE_ID = "842442602292665";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get("x-admin-password");
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, category, imageUrl, imageUrls, videoUrl, postToFb } = await req.json();

    if (!message || !category) {
      return NextResponse.json({ error: "Message and category are required" }, { status: 400 });
    }

    // Normalize to an array. Prefer new `imageUrls` field; fall back to legacy `imageUrl`.
    const normalizedImages: string[] = Array.isArray(imageUrls)
      ? imageUrls.filter((u: unknown): u is string => typeof u === "string" && u.trim().length > 0).map((u: string) => u.trim())
      : imageUrl
      ? [String(imageUrl).trim()].filter((u) => u.length > 0)
      : [];

    const categoryInfo = CATEGORIES[category] || CATEGORIES.other;
    let fbPostId = null;
    let fbError: string | null = null;
    const firstImage = normalizedImages[0] || null;

    // 1. Post to Facebook if requested (single image only — first one)
    if (postToFb) {
      try {
        const fbResult = await postToFacebook(message, firstImage || undefined);
        fbPostId = fbResult.id || fbResult.post_id;
      } catch (err) {
        fbError = err instanceof Error ? err.message : String(err);
        console.error("Facebook post failed:", fbError);
      }
    }

    // 2. Create post object
    const postId = fbPostId || `${FB_PAGE_ID}_${Date.now()}`;
    const attachmentData: Record<string, unknown>[] = [];
    for (const img of normalizedImages) {
      attachmentData.push({ media: { image: { src: img } } });
    }
    if (videoUrl) {
      attachmentData.push({ url: videoUrl });
    }

    const newPost = {
      id: postId,
      message,
      created_time: new Date().toISOString(),
      full_picture: firstImage,
      attachments: attachmentData.length > 0 ? { data: attachmentData } : undefined,
      category,
      categoryInfo,
    };

    // 3. Commit to GitHub (triggers Vercel deploy)
    const { posts, fileSha } = await fetchPostsFromGitHub();
    posts.unshift(newPost);
    await commitPostsToGitHub(posts, fileSha, `New post: ${message.substring(0, 50)}...`);

    return NextResponse.json({
      success: true,
      postId,
      fbPosted: postToFb && fbPostId ? true : false,
      fbError: fbError || undefined,
      message: "Post published! Site will update in ~1 minute.",
    });
  } catch (err) {
    console.error("Publish error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
