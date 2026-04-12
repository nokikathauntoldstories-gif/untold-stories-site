import { NextRequest, NextResponse } from "next/server";
import { fetchPostsFromGitHub, commitPostsToGitHub } from "@/lib/github";
import { deleteFacebookPost, isRealFacebookId } from "@/lib/facebook";

export async function DELETE(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get("x-admin-password");
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    const { posts, fileSha } = await fetchPostsFromGitHub();

    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postMessage = (posts[postIndex].message as string) || "";

    // Try to delete from Facebook
    let fbDeleted = false;
    let fbError: string | null = null;
    if (isRealFacebookId(postId)) {
      try {
        await deleteFacebookPost(postId);
        fbDeleted = true;
      } catch (err) {
        fbError = err instanceof Error ? err.message : String(err);
      }
    }

    // Remove from array
    posts.splice(postIndex, 1);

    await commitPostsToGitHub(posts, fileSha, `Delete post: ${postMessage.substring(0, 50)}...`);

    return NextResponse.json({
      success: true,
      fbDeleted,
      fbError: fbError || undefined,
      message: "Post deleted! Site will update in ~1 minute.",
    });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
