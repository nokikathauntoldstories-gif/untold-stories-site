import { NextRequest, NextResponse } from "next/server";
import { fetchPostsFromGitHub, commitPostsToGitHub } from "@/lib/github";
import { editFacebookPost, isRealFacebookId } from "@/lib/facebook";
import { CATEGORIES } from "@/lib/categories";

export async function PUT(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get("x-admin-password");
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { postId, message, category, imageUrl } = await req.json();

    if (!postId || !message || !category) {
      return NextResponse.json({ error: "postId, message, and category are required" }, { status: 400 });
    }

    const { posts, fileSha } = await fetchPostsFromGitHub();

    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Try to edit on Facebook
    let fbEdited = false;
    let fbError: string | null = null;
    if (isRealFacebookId(postId)) {
      try {
        await editFacebookPost(postId, message);
        fbEdited = true;
      } catch (err) {
        fbError = err instanceof Error ? err.message : String(err);
      }
    }

    // Update post in array
    const categoryInfo = CATEGORIES[category] || CATEGORIES.other;
    const post = posts[postIndex];
    post.message = message;
    post.category = category;
    post.categoryInfo = categoryInfo;
    if (imageUrl !== undefined) {
      post.full_picture = imageUrl || null;
    }

    await commitPostsToGitHub(posts, fileSha, `Edit post: ${message.substring(0, 50)}...`);

    return NextResponse.json({
      success: true,
      fbEdited,
      fbError: fbError || undefined,
      message: "Post updated! Site will update in ~1 minute.",
    });
  } catch (err) {
    console.error("Edit error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
