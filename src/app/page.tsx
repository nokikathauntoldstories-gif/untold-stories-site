import StoryCard from "@/components/StoryCard";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";
import { getAllPosts, getCategoryStats } from "@/lib/posts";

const POSTS_PER_PAGE = 24;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const filterCategory = params.category || null;

  let allPosts = getAllPosts();
  if (filterCategory) {
    allPosts = allPosts.filter((p) => p.category === filterCategory);
  }

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const posts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const categoryStats = getCategoryStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero */}
      <section className="text-center py-10 mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-400 mb-3">
          නොකී කතා
        </h1>
        <p className="text-xl text-gray-300 mb-1">Untold Stories</p>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය සහ භූ දේශපාලනය පිළිබඳ
          ඔබ නොදන්නා කතා එකතුව
        </p>
      </section>

      {/* Ad: Leaderboard */}
      <AdSlot type="leaderboard" className="mb-8" />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${
            !filterCategory
              ? "bg-gold-500 text-navy-950 border-gold-500 font-semibold"
              : "border-navy-600 text-gray-300 hover:border-gold-500/50 hover:text-gold-400"
          }`}
        >
          සියල්ල ({getAllPosts().length})
        </Link>
        {categoryStats.map(({ category, count }) => (
          <Link
            key={category.slug}
            href={`/?category=${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              filterCategory === category.slug
                ? "bg-gold-500 text-navy-950 border-gold-500 font-semibold"
                : "border-navy-600 text-gray-300 hover:border-gold-500/50 hover:text-gold-400"
            }`}
          >
            {category.emoji} {category.name} ({count})
          </Link>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <StoryCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {currentPage > 1 && (
                <Link
                  href={`/?page=${currentPage - 1}${filterCategory ? `&category=${filterCategory}` : ""}`}
                  className="px-4 py-2 bg-navy-800 border border-navy-600 text-gray-300 rounded-lg hover:border-gold-500/50 text-sm"
                >
                  ← පෙර
                </Link>
              )}
              <span className="text-gray-400 text-sm px-4">
                පිටුව {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/?page=${currentPage + 1}${filterCategory ? `&category=${filterCategory}` : ""}`}
                  className="px-4 py-2 bg-navy-800 border border-navy-600 text-gray-300 rounded-lg hover:border-gold-500/50 text-sm"
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

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-5">
            <h3 className="text-gold-400 font-semibold mb-3">ප්‍රවර්ග</h3>
            <ul className="space-y-2">
              {categoryStats.map(({ category, count }) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex justify-between text-sm text-gray-300 hover:text-gold-400 transition-colors"
                  >
                    <span>{category.emoji} {category.name}</span>
                    <span className="text-gray-500">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-5">
            <h3 className="text-gold-400 font-semibold mb-3">අපි ගැන</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              ලෝකයේ විවිධ රටවල සිදුවූ අභිරහස්, සැබෑ අපරාධ සහ ඓතිහාසික
              සිදුවීම් පිළිබඳ කතා ඔබ වෙත ගෙන එන &quot;නොකී කතා&quot; පිටුව.
            </p>
            <a
              href="https://www.facebook.com/UntoldStoriesLK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-gold-400 hover:text-gold-300"
            >
              📘 Facebook පිටුව →
            </a>
          </div>

          <AdSlot type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
