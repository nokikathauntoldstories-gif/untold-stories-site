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
  isDirectVideoFile,
  getYouTubeId,
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
  const url = `https://nokikatha.com/story/${id}`;

  // Route og:image through our own proxy (src/app/api/og-image/[postId]).
  // The proxy URL is stable and permanent, which matters because FB's
  // scraper caches og:image URLs for ~30 days and raw fbcdn.net links
  // expire within 24-48h via their oe= signature. Using our origin means
  // the cached link never goes stale.
  const images = getPostImages(post);
  const ogImage = images.length > 0
    ? `https://nokikatha.com/api/og-image/${id}`
    : null;

  const ogImages = ogImage
    ? [{ url: ogImage, secureUrl: ogImage, alt: title }]
    : [];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "si_LK",
      siteName: "නොකී කතා - Untold Stories",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Ad: Leaderboard */}
        <AdSlot type="leaderboard" className="mb-10" />

        {/* Breadcrumb */}
        <nav className="breadcrumb mb-8">
          <Link href="/">මුල් පිටුව</Link>
          <svg className="separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
          <Link href={`/category/${post.category}`}>
            {post.categoryInfo.emoji} {post.categoryInfo.name}
          </Link>
        </nav>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-gradient-gold leading-[1.3] mb-7 tracking-tight">
          {title}
        </h1>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-8">
          <span className="badge-premium text-[11px] px-3.5 py-1.5 rounded-lg font-medium">
            {post.categoryInfo.emoji} {post.categoryInfo.name}
          </span>
          <span className="text-gray-600 text-[13px] flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {formatDate(post.created_time)}
          </span>
          <span className="text-gray-600 text-[13px] flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {readTime} min read
          </span>
          <div className="ml-auto">
            <ShareButtons title={title} />
          </div>
        </div>

        <div className="divider-gold mb-10" />

        {/* Video: YouTube iframe, native <video> for direct files, or FB embed */}
        {videoUrl && (() => {
          const ytId = getYouTubeId(videoUrl);
          return (
            <div className="mb-10 rounded-2xl overflow-hidden border border-navy-700/40 bg-navy-900/40 p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-red-500 text-lg">&#9654;</span>
                <span className="text-gold-400 font-semibold text-[13px]">වීඩියෝව</span>
              </div>
              {ytId ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              ) : isDirectVideoFile(videoUrl) ? (
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-lg max-h-[520px] bg-black"
                />
              ) : (
                <FacebookVideoEmbed videoUrl={videoUrl} />
              )}
            </div>
          );
        })()}

        {/* Featured Image — object-contain so portraits/faces never get cropped */}
        {!videoUrl && images[0] && (
          <div className="image-frame mb-10 bg-navy-900/40 flex items-center justify-center">
            <img
              src={images[0]}
              alt={title}
              className="w-full max-h-[640px] object-contain"
            />
          </div>
        )}

        {/* Content */}
        <div className="article-content mt-10 space-y-7">
          {paragraphs.map((para, i) => (
            <div key={i}>
              <p className="text-gray-300/80 leading-[2.1] text-[15.5px] whitespace-pre-line">
                {para.trim()}
              </p>
              {i === midPoint && <AdSlot type="in-article" />}
            </div>
          ))}
        </div>

        {/* Additional images — object-contain so nothing gets cropped */}
        {images.length > 1 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.slice(1).map((img, idx) => (
              <div key={idx} className="image-frame bg-navy-900/40 flex items-center justify-center">
                <img
                  src={img}
                  alt={`${title} - ${idx + 2}`}
                  className="w-full max-h-80 object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Share again at bottom */}
        <div className="mt-14 pt-7">
          <div className="divider-gold mb-7" />
          <div className="flex items-center justify-between">
            <span className="text-gray-700 text-[13px] font-medium">මෙම කතාව බෙදාගන්න</span>
            <ShareButtons title={title} />
          </div>
        </div>

        {/* AdSense: In-article bottom */}
        <AdSlot type="in-article" className="mt-10" />

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="section-accent">
                <h2 className="text-lg font-bold text-gold-400 tracking-tight">
                  ආශ්‍රිත කතා
                </h2>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-navy-700/40 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
