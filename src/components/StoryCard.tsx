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
      <article className="story-card h-full flex flex-col">
        {image ? (
          <div className="relative aspect-[16/10] img-zoom">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

            {/* Category badge */}
            <div className="absolute top-3.5 left-3.5">
              <span className="badge-premium text-[10px] px-2.5 py-1 rounded-lg font-medium tracking-wide">
                {post.categoryInfo.emoji} {post.categoryInfo.name}
              </span>
            </div>

            {/* Video badge */}
            {isVideoPost(post) && (
              <span className="absolute top-3.5 right-3.5 bg-red-500/90 backdrop-blur-sm text-[10px] px-2 py-1 rounded-lg text-white font-semibold flex items-center gap-1 shadow-lg shadow-red-500/20">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Video
              </span>
            )}

            {/* Reading time */}
            <div className="absolute bottom-3 right-3">
              <span className="bg-navy-950/50 backdrop-blur-md text-[9px] px-2 py-0.5 rounded-md text-gray-400 border border-white/[0.05] font-medium">
                {readTime} min
              </span>
            </div>
          </div>
        ) : (
          <div className="h-[3px] bg-gradient-to-r from-gold-500/80 via-gold-300 to-gold-500/80" />
        )}

        <div className="p-5 flex-1 flex flex-col">
          {!image && (
            <span className="badge-premium inline-flex self-start text-[10px] px-2.5 py-1 rounded-lg mb-3 font-medium tracking-wide">
              {post.categoryInfo.emoji} {post.categoryInfo.name}
            </span>
          )}

          <h3 className="text-gray-200 font-semibold text-[15px] leading-relaxed mb-2 group-hover:text-gold-300 transition-colors duration-500 line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-600 text-[13px] leading-relaxed mb-4 line-clamp-2 flex-1">
            {excerpt}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-navy-700/25">
            <time className="text-gray-700 text-[11px] font-medium">{formatDate(post.created_time)}</time>
            <span className="text-gold-500/40 text-[11px] group-hover:text-gold-400 transition-all duration-500 flex items-center gap-1.5 font-medium">
              කියවන්න
              <svg className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
