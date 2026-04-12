import Link from "next/link";
import { Post, getPostTitle, getPostExcerpt, getPostImage, formatDate } from "@/lib/posts";

export default function StoryCard({ post }: { post: Post }) {
  const image = getPostImage(post);
  const title = getPostTitle(post);
  const excerpt = getPostExcerpt(post);
  const slug = post.id.replace(/\//g, '_');

  return (
    <Link href={`/story/${slug}`} className="group block">
      <article className="bg-navy-900 border border-navy-700 rounded-xl overflow-hidden hover:border-gold-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5 h-full flex flex-col">
        {image && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
            <span className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full text-gold-400 border border-gold-500/20">
              {post.categoryInfo.emoji} {post.categoryInfo.name}
            </span>
          </div>
        )}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-gray-100 font-semibold text-sm leading-relaxed mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-3 flex-1">
            {excerpt}
          </p>
          <time className="text-gray-500 text-xs">{formatDate(post.created_time)}</time>
        </div>
      </article>
    </Link>
  );
}
