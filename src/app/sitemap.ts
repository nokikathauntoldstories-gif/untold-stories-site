import { MetadataRoute } from "next";
import { getAllPosts, getAllCategories } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nokikatha.com";
  const posts = getAllPosts();
  const categories = getAllCategories();

  const storyUrls = posts.map((post) => ({
    url: `${baseUrl}/story/${post.id.replace(/\//g, "_")}`,
    lastModified: new Date(post.created_time),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryUrls = Object.keys(categories).map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...categoryUrls,
    ...storyUrls,
  ];
}
