import StoryCard from "@/components/StoryCard";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";
import { getAllPosts, getCategoryStats, getPostTitle, getPostExcerpt, getPostImage, formatDate } from "@/lib/posts";

const POSTS_PER_PAGE = 24;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const filterCategory = params.category || null;

  const allPostsUnfiltered = getAllPosts();
  let allPosts = allPostsUnfiltered;
  if (filterCategory) {
    allPosts = allPosts.filter((p) => p.category === filterCategory);
  }

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const posts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const categoryStats = getCategoryStats();

  // Featured stories (top 4 with images, only on page 1 with no filter)
  const featuredPosts = !filterCategory && currentPage === 1
    ? allPostsUnfiltered.filter(p => getPostImage(p)).slice(0, 4)
    : [];

  const heroPost = featuredPosts[0];
  const sideFeatures = featuredPosts.slice(1, 4);

  return (
    <div className="noise-overlay">
      {/* HERO - Cinematic featured story section */}
      {heroPost && (
        <section className="relative mb-16">
          {/* Background image with cinematic overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={getPostImage(heroPost)!}
              alt=""
              className="w-full h-full object-cover scale-110 blur-xl opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/80 to-navy-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-transparent to-navy-950/60" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            {/* Top bar */}
            <div className="flex items-center justify-between py-8 sm:py-10">
              <div className="inline-flex items-center gap-2.5 bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-full px-4 py-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-live" />
                <span className="text-gray-500 text-[11px] tracking-wider font-medium uppercase">
                  කතා {allPostsUnfiltered.length}+
                </span>
              </div>
            </div>

            {/* Hero content - featured story + side stories */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 pb-14">
              {/* Main hero story */}
              <Link
                href={`/story/${heroPost.id.replace(/\//g, '_')}`}
                className="lg:col-span-3 group relative rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[460px] img-zoom"
              >
                <img
                  src={getPostImage(heroPost)!}
                  alt={getPostTitle(heroPost)}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">
                  <span className="inline-block bg-gold-500/90 backdrop-blur-sm text-navy-950 text-[10px] font-bold px-3 py-1.5 rounded-lg mb-4 uppercase tracking-widest">
                    {heroPost.categoryInfo.emoji} {heroPost.categoryInfo.name}
                  </span>
                  <h2 className="text-white font-bold text-xl sm:text-2xl md:text-[2.2rem] leading-snug group-hover:text-gold-200 transition-colors duration-700 line-clamp-3 mb-3">
                    {getPostTitle(heroPost)}
                  </h2>
                  <p className="text-gray-400/70 text-sm line-clamp-2 max-w-lg hidden sm:block leading-relaxed">
                    {getPostExcerpt(heroPost)}
                  </p>
                  <div className="flex items-center gap-5 mt-5">
                    <time className="text-gray-600 text-[11px] font-medium">{formatDate(heroPost.created_time)}</time>
                    <span className="text-gold-400/70 text-[11px] font-medium group-hover:text-gold-300 flex items-center gap-2 transition-all duration-500">
                      කියවන්න
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>

              {/* Side stories stack */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                {sideFeatures.map((fp, i) => (
                  <Link
                    key={fp.id}
                    href={`/story/${fp.id.replace(/\//g, '_')}`}
                    className="group relative rounded-xl overflow-hidden flex-1 min-h-[120px] flex"
                  >
                    {/* Thumbnail */}
                    <div className="w-28 sm:w-32 flex-shrink-0 relative overflow-hidden img-zoom">
                      <img
                        src={getPostImage(fp)!}
                        alt={getPostTitle(fp)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex-1 bg-navy-900/50 backdrop-blur-xl p-4 flex flex-col justify-center border border-white/[0.03] border-l-0 rounded-r-xl group-hover:bg-navy-800/40 transition-all duration-500">
                      <span className="text-gold-500/50 text-[9px] font-semibold uppercase tracking-widest mb-1.5">
                        {fp.categoryInfo.emoji} {fp.categoryInfo.nameEn}
                      </span>
                      <h3 className="text-gray-300 font-semibold text-[13px] leading-snug group-hover:text-gold-300 transition-colors duration-500 line-clamp-2 mb-2">
                        {getPostTitle(fp)}
                      </h3>
                      <time className="text-gray-700 text-[10px] font-medium">{formatDate(fp.created_time)}</time>
                    </div>
                    {/* Number badge */}
                    <div className="absolute top-2.5 left-2.5 number-badge">
                      <span>{i + 2}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Non-hero fallback */}
      {!heroPost && (
        <section className="hero-gradient relative rounded-2xl overflow-hidden mb-12 mx-4 sm:mx-6">
          <div className="relative z-10 text-center py-20 sm:py-24 px-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gradient-gold mb-4 tracking-tight">නොකී කතා</h1>
            <p className="text-lg text-gray-500 mb-2 font-light tracking-wide">Untold Stories</p>
            <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
              ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය සහ භූ දේශපාලනය පිළිබඳ ඔබ නොදන්නා කතා එකතුව
            </p>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Ad: Leaderboard */}
        <AdSlot type="leaderboard" className="mb-12" />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          <Link
            href="/"
            className={`tag-pill ${!filterCategory ? "active" : ""}`}
          >
            සියල්ල ({allPostsUnfiltered.length})
          </Link>
          {categoryStats.map(({ category, count }) => (
            <Link
              key={category.slug}
              href={`/?category=${category.slug}`}
              className={`tag-pill ${filterCategory === category.slug ? "active" : ""}`}
            >
              {category.emoji} {category.name} ({count})
            </Link>
          ))}
        </div>

        {/* Section heading */}
        <div className="flex items-center gap-4 mb-8">
          <div className="section-accent">
            <h2 className="text-gray-300 font-semibold text-base tracking-tight">
              {filterCategory
                ? categoryStats.find(c => c.category.slug === filterCategory)?.category.name || "කතා"
                : "සියලුම කතා"}
            </h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-navy-700/40 to-transparent" />
          <span className="text-gray-700 text-[11px] font-medium tracking-wider uppercase">{allPosts.length} results</span>
        </div>

        <div className="flex gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <div key={post.id} style={{ animationDelay: `${i * 0.03}s` }} className="animate-fade-up">
                  <StoryCard post={post} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                {currentPage > 1 && (
                  <Link
                    href={`/?page=${currentPage - 1}${filterCategory ? `&category=${filterCategory}` : ""}`}
                    className="px-5 py-2.5 bg-navy-900/40 border border-navy-700/30 text-gray-500 rounded-xl hover:border-gold-500/20 hover:text-gold-400 text-sm transition-all duration-300"
                  >
                    &larr; පෙර
                  </Link>
                )}

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <Link
                      key={pageNum}
                      href={`/?page=${pageNum}${filterCategory ? `&category=${filterCategory}` : ""}`}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        pageNum === currentPage
                          ? "bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950 shadow-lg shadow-gold-500/15"
                          : "bg-navy-900/40 border border-navy-700/30 text-gray-600 hover:border-gold-500/20 hover:text-gold-400"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={`/?page=${currentPage + 1}${filterCategory ? `&category=${filterCategory}` : ""}`}
                    className="px-5 py-2.5 bg-navy-900/40 border border-navy-700/30 text-gray-500 rounded-xl hover:border-gold-500/20 hover:text-gold-400 text-sm transition-all duration-300"
                  >
                    ඊළඟ &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - desktop only */}
          <aside className="hidden xl:block w-72 shrink-0 space-y-6">
            <AdSlot type="sidebar" />

            <div className="glass-card rounded-2xl p-6">
              <h3 className="section-accent text-gold-400 font-semibold text-[13px] mb-5 tracking-tight">
                ප්‍රවර්ග
              </h3>
              <ul className="space-y-0.5">
                {categoryStats.map(({ category, count }) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex justify-between text-[13px] text-gray-500 hover:text-gold-400 transition-all duration-300 py-2.5 px-3.5 rounded-xl hover:bg-white/[0.02] group"
                    >
                      <span>{category.emoji} {category.name}</span>
                      <span className="text-gray-700 bg-navy-800/40 px-2.5 py-0.5 rounded-full text-[10px] font-medium group-hover:text-gold-400 group-hover:bg-gold-500/10 transition-all duration-300">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="section-accent text-gold-400 font-semibold text-[13px] mb-4 tracking-tight">
                අපි ගැන
              </h3>
              <p className="text-gray-600 text-[12px] leading-relaxed">
                ලෝකයේ විවිධ රටවල සිදුවූ අභිරහස්, සැබෑ අපරාධ සහ ඓතිහාසික
                සිදුවීම් පිළිබඳ කතා ඔබ වෙත ගෙන එන &quot;නොකී කතා&quot; පිටුව.
              </p>
              <a
                href="https://www.facebook.com/UntoldStoriesLK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-[12px] text-gray-500 hover:text-gold-400 bg-navy-800/30 px-4 py-2.5 rounded-xl border border-navy-700/30 hover:border-gold-500/15 transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
            </div>

            <AdSlot type="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
