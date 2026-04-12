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
import ReadingProgress from "@/components/ReadingProgress";
import BackToTop from "@/components/BackToTop";

function getReadingTime(message?: string): number {
  if (!message) return 1;
  return Math.max(1, Math.ceil(message.split(/\s+/).length / 200));
}

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
  const readTime = getReadingTime(post.message);
  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.id !== post.id)
    .slice(0, 6);

  const paragraphs = (post.message || "")
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  const midPoint = Math.floor(paragraphs.length / 2);

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
      <ReadingProgress />
      <BackToTop />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Ad: Leaderboard */}
        <AdSlot type="leaderboard" className="mb-6" />

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gold-400 transition-colors">මුල් පිටුව</Link>
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
          <Link
            href={`/category/${post.category}`}
            className="hover:text-gold-400 transition-colors"
          >
            {post.categoryInfo.emoji} {post.categoryInfo.name}
          </Link>
        </nav>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold leading-snug mb-5">
          {title}
        </h1>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-navy-700/50">
          <span className="bg-navy-800 text-gold-400 text-xs px-3 py-1.5 rounded-lg border border-navy-600/50 font-medium">
            {post.categoryInfo.emoji} {post.categoryInfo.name}
          </span>
          <span className="text-gray-500 text-sm flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {formatDate(post.created_time)}
          </span>
          <span className="text-gray-500 text-sm flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {readTime} min read
          </span>
          <div className="ml-auto">
            <ShareButtons title={title} />
          </div>
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

        {/* Featured Image */}
        {!videoUrl && images[0] && (
          <div className="rounded-xl overflow-hidden mb-8 border border-navy-700/50 shadow-2xl shadow-navy-950/50">
            <img
              src={images[0]}
              alt={title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="mt-8 space-y-5">
          {paragraphs.map((para, i) => (
            <div key={i}>
              {i === 0 ? (
                <p className="text-gray-200 leading-loose text-base first-letter:text-3xl first-letter:font-bold first-letter:text-gold-400 first-letter:mr-1 first-letter:float-left whitespace-pre-line">
                  {para.trim()}
                </p>
              ) : (
                <p className="text-gray-200/90 leading-loose text-[15px] whitespace-pre-line">
                  {para.trim()}
                </p>
              )}
              {i === midPoint && <AdSlot type="in-article" />}
            </div>
          ))}
        </div>

        {/* Additional images */}
        {images.length > 1 && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            {images.slice(1).map((img, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-navy-700/50 shadow-lg">
                <img
                  src={img}
                  alt={`${title} - ${idx + 2}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Share again at bottom */}
        <div className="mt-10 pt-6 border-t border-navy-700/50 flex items-center justify-between">
          <span className="text-gray-500 text-sm">Share this story</span>
          <ShareButtons title={title} />
        </div>

        {/* AdSense: In-article bottom */}
        <AdSlot type="in-article" className="mt-8" />

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-6 bg-gold-500 rounded-full" />
              <h2 className="text-xl font-bold text-gold-400">
                ආශ්‍රිත කතා
              </h2>
              <div className="h-px flex-1 bg-navy-700/50" />
            </div>
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
