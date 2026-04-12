import Link from "next/link";
import { Post, getPostTitle, getPostExcerpt, getPostImage, isVideoPost, formatDate } from "@/lib/posts";

function getReadingTime(message?: string): number {
  if (!message) return 1;
  const words = message.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function StoryCard({ post }: { post: Post }) {
  const image = getPostImage(post);
  const title = getPostTitle(post);
  const excerpt = getPostExcerpt(post);
  const slug = post.id.replace(/\//g, '_');
  const readTime = getReadingTime(post.message);

  return (
    <Link href={`/story/${slug}`} className="group block h-full">
      <article className="card-glow bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden hover:border-gold-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/5 h-full flex flex-col hover:-translate-y-1">
        {image ? (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-navy-900/70 backdrop-blur-md text-xs px-2.5 py-1 rounded-lg text-gold-400 border border-gold-500/20 font-medium">
                {post.categoryInfo.emoji} {post.categoryInfo.name}
              </span>
            </div>

            {isVideoPost(post) && (
              <span className="absolute top-3 right-3 bg-red-500 text-xs px-2.5 py-1 rounded-lg text-white font-semibold flex items-center gap-1 shadow-lg shadow-red-500/30">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Video
              </span>
            )}

            {/* Reading time badge */}
            <div className="absolute bottom-3 right-3">
              <span className="bg-navy-900/70 backdrop-blur-md text-[10px] px-2 py-1 rounded-md text-gray-300 border border-navy-600/50">
                {readTime} min read
              </span>
            </div>
          </div>
        ) : (
          /* No image - show colored top bar */
          <div className="h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />
        )}

        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          {!image && (
            <span className="inline-flex self-start bg-navy-800 text-xs px-2.5 py-1 rounded-lg text-gold-400 border border-navy-600/50 mb-3 font-medium">
              {post.categoryInfo.emoji} {post.categoryInfo.name}
            </span>
          )}

          <h3 className="text-gray-100 font-semibold text-sm sm:text-[15px] leading-relaxed mb-2 group-hover:text-gold-400 transition-colors duration-200 line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-400/80 text-xs leading-relaxed mb-4 line-clamp-3 flex-1">
            {excerpt}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-navy-700/50">
            <time className="text-gray-500 text-xs">{formatDate(post.created_time)}</time>
            <span className="text-gold-400/60 text-xs group-hover:text-gold-400 transition-colors flex items-center gap-1">
              Read
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
