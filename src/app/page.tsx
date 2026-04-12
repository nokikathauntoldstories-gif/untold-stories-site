import StoryCard from "@/components/StoryCard";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";
import { getAllPosts, getCategoryStats, getPostTitle, getPostExcerpt, getPostImage } from "@/lib/posts";

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

  // Featured stories (top 3 with images, only on page 1 with no filter)
  const featuredPosts = !filterCategory && currentPage === 1
    ? allPostsUnfiltered.filter(p => getPostImage(p)).slice(0, 3)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Section */}
      <section className="hero-gradient relative rounded-2xl overflow-hidden mb-8">
        {/* Floating decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-dot" style={{ top: '15%', left: '10%', animationDelay: '0s' }} />
          <div className="floating-dot" style={{ top: '60%', left: '80%', animationDelay: '2s' }} />
          <div className="floating-dot" style={{ top: '30%', left: '60%', animationDelay: '4s' }} />
          <div className="floating-dot" style={{ top: '75%', left: '25%', animationDelay: '1s' }} />
          <div className="floating-dot" style={{ top: '45%', left: '90%', animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 text-center py-12 sm:py-16 px-6">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-300 text-xs tracking-wide">
                කතා {allPostsUnfiltered.length}+ | Auto-updated
              </span>
            </div>
          </div>

          <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-gold mb-3 tracking-tight">
            නොකී කතා
          </h1>
          <p className="animate-fade-up-delay-2 text-lg sm:text-xl text-gray-300/80 mb-2 font-light">
            Untold Stories
          </p>
          <p className="animate-fade-up-delay-3 text-gray-400/70 max-w-xl mx-auto text-sm leading-relaxed">
            ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය සහ භූ දේශපාලනය පිළිබඳ
            ඔබ නොදන්නා කතා එකතුව
          </p>
        </div>
      </section>

      {/* Featured Stories - only on homepage page 1 */}
      {featuredPosts.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
            <h2 className="text-gold-400 text-sm font-semibold tracking-widest uppercase">
              Featured
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main featured */}
            <Link
              href={`/story/${featuredPosts[0].id.replace(/\//g, '_')}`}
              className="md:col-span-2 group relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[2/1]"
            >
              <img
                src={getPostImage(featuredPosts[0])!}
                alt={getPostTitle(featuredPosts[0])}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <span className="inline-block bg-gold-500/90 text-navy-950 text-xs font-semibold px-2.5 py-1 rounded-md mb-3">
                  {featuredPosts[0].categoryInfo.emoji} {featuredPosts[0].categoryInfo.name}
                </span>
                <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl leading-snug group-hover:text-gold-300 transition-colors line-clamp-2">
                  {getPostTitle(featuredPosts[0])}
                </h3>
                <p className="text-gray-300/70 text-sm mt-2 line-clamp-2 hidden sm:block">
                  {getPostExcerpt(featuredPosts[0])}
                </p>
              </div>
            </Link>

            {/* Side featured */}
            <div className="flex flex-col gap-4">
              {featuredPosts.slice(1, 3).map((fp) => (
                <Link
                  key={fp.id}
                  href={`/story/${fp.id.replace(/\//g, '_')}`}
                  className="group relative rounded-xl overflow-hidden flex-1 min-h-[160px]"
                >
                  <img
                    src={getPostImage(fp)!}
                    alt={getPostTitle(fp)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block bg-gold-500/80 text-navy-950 text-[10px] font-semibold px-2 py-0.5 rounded mb-2">
                      {fp.categoryInfo.emoji} {fp.categoryInfo.name}
                    </span>
                    <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-gold-300 transition-colors line-clamp-2">
                      {getPostTitle(fp)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad: Leaderboard */}
      <AdSlot type="leaderboard" className="mb-8" />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
            !filterCategory
              ? "bg-gold-500 text-navy-950 border-gold-500 font-semibold shadow-lg shadow-gold-500/20"
              : "border-navy-600 text-gray-300 hover:border-gold-500/50 hover:text-gold-400"
          }`}
        >
          සියල්ල ({allPostsUnfiltered.length})
        </Link>
        {categoryStats.map(({ category, count }) => (
          <Link
            key={category.slug}
            href={`/?category=${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
              filterCategory === category.slug
                ? "bg-gold-500 text-navy-950 border-gold-500 font-semibold shadow-lg shadow-gold-500/20"
                : "border-navy-600 text-gray-300 hover:border-gold-500/50 hover:text-gold-400"
            }`}
          >
            {category.emoji} {category.name} ({count})
          </Link>
        ))}
      </div>

      {/* Section heading */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-gray-200 font-semibold text-lg">
          {filterCategory
            ? categoryStats.find(c => c.category.slug === filterCategory)?.category.name || "කතා"
            : "සියලුම කතා"}
        </h2>
        <div className="h-px flex-1 bg-navy-700" />
        <span className="text-gray-500 text-sm">{allPosts.length} results</span>
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div key={post.id} style={{ animationDelay: `${i * 0.05}s` }} className="animate-fade-up">
                <StoryCard post={post} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              {currentPage > 1 && (
                <Link
                  href={`/?page=${currentPage - 1}${filterCategory ? `&category=${filterCategory}` : ""}`}
                  className="px-5 py-2.5 bg-navy-800 border border-navy-600 text-gray-300 rounded-xl hover:border-gold-500/50 hover:text-gold-400 text-sm transition-all"
                >
                  ← පෙර
                </Link>
              )}

              {/* Page numbers */}
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
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                      pageNum === currentPage
                        ? "bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20"
                        : "bg-navy-800 border border-navy-600 text-gray-400 hover:border-gold-500/50 hover:text-gold-400"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {currentPage < totalPages && (
                <Link
                  href={`/?page=${currentPage + 1}${filterCategory ? `&category=${filterCategory}` : ""}`}
                  className="px-5 py-2.5 bg-navy-800 border border-navy-600 text-gray-300 rounded-xl hover:border-gold-500/50 hover:text-gold-400 text-sm transition-all"
                >
                  ඊළඟ →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - desktop only */}
        <aside className="hidden xl:block w-72 shrink-0 space-y-6">
          <AdSlot type="sidebar" />

          <div className="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-xl p-5">
            <h3 className="text-gold-400 font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gold-500 rounded-full" />
              ප්‍රවර්ග
            </h3>
            <ul className="space-y-1">
              {categoryStats.map(({ category, count }) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex justify-between text-sm text-gray-300 hover:text-gold-400 transition-colors py-2 px-3 rounded-lg hover:bg-navy-800/50"
                  >
                    <span>{category.emoji} {category.name}</span>
                    <span className="text-gray-500 bg-navy-800 px-2 py-0.5 rounded-full text-xs">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-xl p-5">
            <h3 className="text-gold-400 font-semibold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-gold-500 rounded-full" />
              අපි ගැන
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              ලෝකයේ විවිධ රටවල සිදුවූ අභිරහස්, සැබෑ අපරාධ සහ ඓතිහාසික
              සිදුවීම් පිළිබඳ කතා ඔබ වෙත ගෙන එන &quot;නොකී කතා&quot; පිටුව.
            </p>
            <a
              href="https://www.facebook.com/UntoldStoriesLK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-gold-400 hover:text-gold-300 bg-navy-800 px-4 py-2 rounded-lg border border-navy-600 hover:border-gold-500/30 transition-all"
            >
              Facebook →
            </a>
          </div>

          <AdSlot type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
