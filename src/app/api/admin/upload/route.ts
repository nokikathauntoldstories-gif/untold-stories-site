import { NextRequest, NextResponse } from "next/server";
import { commitImageToGitHub } from "@/lib/github";

// Why not Vercel Blob anymore: the free tier caps bandwidth at 10GB/mo
// and pauses the service for 30 days on exceed — breaking both uploads
// AND image reads site-wide. Instead we commit images straight to the
// repo at public/uploads/YYYY-MM/<name>, and serve them through jsDelivr
// (a free CDN that proxies GitHub with aggressive caching). No bandwidth
// meter, no suspension risk.
//
// Size constraint: Vercel serverless request bodies are capped at 4.5MB,
// so the admin page compresses images client-side (max 1920px, JPEG q85)
// before uploading. A compressed phone photo is typically 200-800 KB.

export const runtime = "nodejs";

function sanitizeFilename(name: string): string {
  // Strip path separators and keep a simple name. Preserve extension.
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
  return base || "image";
}

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get("x-admin-password");
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "Only images are accepted. For videos, paste a YouTube URL into the Video field.",
        },
        { status: 400 }
      );
    }

    // 4MB safety cap — client should have already compressed below this.
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: `Image too large after compression (${(
            file.size / 1024 / 1024
          ).toFixed(1)}MB). Try a smaller source image.`,
        },
        { status: 413 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());

    // public/uploads/YYYY-MM/<timestamp>-<name>
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    const safeName = sanitizeFilename(file.name);
    const path = `public/uploads/${yearMonth}/${now.getTime()}-${safeName}`;

    const url = await commitImageToGitHub(
      path,
      buf,
      `chore(admin): upload image ${yearMonth}/${safeName}`
    );

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
