import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllPosts,
  getPostById,
  getPostsByCategory,
  getPostTitle,
  getPostExcerpt,
  getPostImages,
  getVideoUrl,
  formatDate,
} from "@/lib/posts";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import StoryCard from "@/components/StoryCard";
import FacebookVideoEmbed from "@/components/FacebookVideoEmbed";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    id: post.id.replace(/\//g, "_"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const postId = id.replace(/_/g, "/");
  const altId = id;
  const post = getPostById(postId) || getPostById(altId);
  if (!post) return { title: "කතාව හමු නොවීය" };

  const title = getPostTitle(post);
  const description = getPostExcerpt(post, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "si_LK",
      images: post.full_picture ? [{ url: post.full_picture }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = id.replace(/_/g, "/");
  const altId = id;
  const post = getPostById(postId) || getPostById(altId);

  if (!post) notFound();

  const images = getPostImages(post);
  const title = getPostTitle(post);
  const videoUrl = getVideoUrl(post);
  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.id !== post.id)
    .slice(0, 6);

  // Split message into paragraphs
  const paragraphs = (post.message || "")
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  // Insert ad after every 3 paragraphs
  const midPoint = Math.floor(paragraphs.length / 2);

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: post.created_time,
    image: post.full_picture || undefined,
    author: {
      "@type": "Organization",
      name: "නොකී කතා - Untold Stories",
      url: "https://www.facebook.com/UntoldStoriesLK",
    },
    publisher: {
      "@type": "Organization",
      name: "නොකී කතා - Untold Stories",
    },
    inLanguage: "si",
    articleSection: post.categoryInfo.nameEn,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Ad: Leaderboard */}
        <AdSlot type="leaderboard" className="mb-6" />

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gold-400">මුල් පිටුව</Link>
          <span className="mx-2">/</span>
          <Link
            href={`/category/${post.category}`}
            className="hover:text-gold-400"
          >
            {post.categoryInfo.emoji} {post.categoryInfo.name}
          </Link>
        </nav>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-400 leading-relaxed mb-4">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="bg-navy-800 text-gold-400 text-xs px-3 py-1 rounded-full border border-gold-500/20">
            {post.categoryInfo.emoji} {post.categoryInfo.name}
          </span>
          <time className="text-gray-400 text-sm">
            {formatDate(post.created_time)}
          </time>
        </div>

        {/* Video Embed for Reels */}
        {videoUrl && (
          <div className="mb-8 rounded-xl overflow-hidden border border-navy-700 bg-navy-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-500 text-lg">▶</span>
              <span className="text-gold-400 font-semibold text-sm">වීඩියෝව</span>
            </div>
            <FacebookVideoEmbed videoUrl={videoUrl} />
          </div>
        )}

        {/* Featured Image (only show if not a video post, or as fallback) */}
        {!videoUrl && images[0] && (
          <div className="rounded-xl overflow-hidden mb-8 border border-navy-700">
            <img
              src={images[0]}
              alt={title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Share */}
        <ShareButtons title={title} />

        {/* Content */}
        <div className="mt-8 space-y-4">
          {paragraphs.map((para, i) => (
            <div key={i}>
              <p className="text-gray-200 leading-loose text-[15px] whitespace-pre-line">
                {para.trim()}
              </p>
              {i === midPoint && <AdSlot type="in-article" />}
            </div>
          ))}
        </div>

        {/* Additional images */}
        {images.length > 1 && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            {images.slice(1).map((img, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border border-navy-700">
                <img
                  src={img}
                  alt={`${title} - ${idx + 2}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Share again at bottom */}
        <div className="mt-8 pt-6 border-t border-navy-700">
          <ShareButtons title={title} />
        </div>

        {/* AdSense: In-article bottom */}
        <AdSlot type="in-article" className="mt-8" />

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gold-400 mb-6">
              ආශ්‍රිත කතා
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <StoryCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
