import { NextRequest, NextResponse } from "next/server";
import postsData from "@/data/posts.json";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get("x-admin-password");
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";

  let filtered = postsData as Record<string, unknown>[];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) =>
      ((p.message as string) || "").toLowerCase().includes(q)
    );
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const posts = filtered.slice(start, start + limit).map((p) => ({
    id: p.id,
    message: ((p.message as string) || "").substring(0, 200),
    category: p.category,
    categoryInfo: p.categoryInfo,
    created_time: p.created_time,
    full_picture: p.full_picture,
  }));

  return NextResponse.json({ posts, total, page, totalPages });
}
