import { NextRequest, NextResponse } from "next/server";

const GITHUB_REPO = "nokikathauntoldstories-gif/untold-stories-site";
const FB_PAGE_ID = "842442602292665";

async function postToFacebook(message: string, imageUrl?: string) {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token) throw new Error("Facebook token not configured");

  let endpoint: string;
  let body: Record<string, string>;

  if (imageUrl) {
    // Post with image
    endpoint = `https://graph.facebook.com/v25.0/${FB_PAGE_ID}/photos`;
    body = { message, url: imageUrl, access_token: token };
  } else {
    // Text-only post
    endpoint = `https://graph.facebook.com/v25.0/${FB_PAGE_ID}/feed`;
    body = { message, access_token: token };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

async function updatePostsOnGitHub(newPost: Record<string, unknown>) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GitHub token not configured");

  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" };

  // 1. Get file metadata (sha) from Contents API
  const fileRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/posts.json`,
    { headers }
  );
  const fileData = await fileRes.json();
  const fileSha = fileData.sha;

  // 2. For large files, content is not inline — fetch via Git Blobs API
  let currentContent: string;
  if (fileData.content) {
    currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
  } else {
    const blobRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/git/blobs/${fileSha}`,
      { headers }
    );
    const blobData = await blobRes.json();
    currentContent = Buffer.from(blobData.content, "base64").toString("utf-8");
  }

  const posts = JSON.parse(currentContent);

  // 3. Add new post at the beginning
  posts.unshift(newPost);

  // 4. Commit updated file
  const updateRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/posts.json`,
    {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `New post: ${(newPost.message as string || "").substring(0, 50)}...`,
        content: Buffer.from(JSON.stringify(posts, null, 2)).toString("base64"),
        sha: fileSha,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json();
    throw new Error(`GitHub commit failed: ${JSON.stringify(err)}`);
  }

  return await updateRes.json();
}

// Category mapping
const CATEGORIES: Record<string, { slug: string; name: string; nameEn: string; emoji: string; description: string }> = {
  mysteries: { slug: "mysteries", name: "අභිරහස්", nameEn: "Mysteries", emoji: "🔍", description: "Unsolved cases, mysterious disappearances, unexplained events" },
  "true-crime": { slug: "true-crime", name: "සැබෑ අපරාධ", nameEn: "True Crime", emoji: "🔪", description: "Murders, criminal investigations, forensic cases" },
  historical: { slug: "historical", name: "ඉතිහාසය", nameEn: "Historical Events", emoji: "📜", description: "Civil rights, historical figures, wars, significant events" },
  geopolitics: { slug: "geopolitics", name: "භූ දේශපාලනය", nameEn: "Geopolitics", emoji: "🌍", description: "International politics, current affairs, diplomacy" },
  psychology: { slug: "psychology", name: "මනෝවිද්‍යාව", nameEn: "Psychology", emoji: "🧠", description: "Human behavior, social experiments, psychological phenomena" },
  other: { slug: "other", name: "වෙනත්", nameEn: "Other", emoji: "📰", description: "Other interesting stories" },
};

export async function POST(req: NextRequest) {
  // Auth check
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get("x-admin-password");
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, category, imageUrl, videoUrl, postToFb } = await req.json();

    if (!message || !category) {
      return NextResponse.json({ error: "Message and category are required" }, { status: 400 });
    }

    const categoryInfo = CATEGORIES[category] || CATEGORIES.other;
    let fbPostId = null;
    let fbImageUrl = imageUrl || null;

    // 1. Post to Facebook if requested
    if (postToFb) {
      try {
        const fbResult = await postToFacebook(message, imageUrl || undefined);
        fbPostId = fbResult.id || fbResult.post_id;
      } catch (err) {
        console.error("Facebook post failed:", err);
        // Continue even if FB fails — still publish to website
      }
    }

    // 2. Create post object
    const postId = fbPostId || `${FB_PAGE_ID}_${Date.now()}`;
    const attachmentData: Record<string, unknown>[] = [];
    if (fbImageUrl) {
      attachmentData.push({ media: { image: { src: fbImageUrl } } });
    }
    if (videoUrl) {
      attachmentData.push({ url: videoUrl });
    }

    const newPost = {
      id: postId,
      message,
      created_time: new Date().toISOString(),
      full_picture: fbImageUrl,
      attachments: attachmentData.length > 0
        ? { data: attachmentData }
        : undefined,
      category,
      categoryInfo,
    };

    // 3. Commit to GitHub (triggers Vercel deploy)
    await updatePostsOnGitHub(newPost);

    return NextResponse.json({
      success: true,
      postId,
      fbPosted: postToFb && fbPostId ? true : false,
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
