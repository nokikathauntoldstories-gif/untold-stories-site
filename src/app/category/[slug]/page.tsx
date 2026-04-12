import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import StoryCard from "@/components/StoryCard";
import AdSlot from "@/components/AdSlot";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return Object.keys(categories).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = getAllCategories();
  const category = categories[slug];
  if (!category) return { title: "ප්‍රවර්ගය හමු නොවීය" };

  return {
    title: `${category.emoji} ${category.name} - ${category.nameEn}`,
    description: `${category.name} ප්‍රවර්ගයේ සියලුම කතා. ${category.description}`,
    openGraph: {
      title: `${category.emoji} ${category.name} | නොකී කතා`,
      description: `${category.name} ප්‍රවර්ගයේ සියලුම කතා.`,
      type: "website",
      locale: "si_LK",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = getAllCategories();
  const category = categories[slug];

  if (!category) notFound();

  const posts = getPostsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-10">
        <Link href="/">මුල් පිටුව</Link>
        <svg className="separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
        <span className="text-gray-400">{category.emoji} {category.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="category-banner rounded-2xl bg-navy-900/40 border border-navy-700/30 p-10 sm:p-14 text-center mb-14">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-800/60 to-navy-900/60 border border-navy-700/30 mb-6">
          <span className="text-3xl">{category.emoji}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-3 tracking-tight">
          {category.name}
        </h1>
        <p className="text-gray-500 text-base mb-1.5 font-light tracking-wider">{category.nameEn}</p>
        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">{category.description}</p>
        <div className="mt-5 inline-flex items-center gap-2 bg-navy-800/30 border border-navy-700/20 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
          <span className="text-gray-500 text-[11px] font-medium tracking-wider uppercase">කතා {posts.length}ක්</span>
        </div>
      </div>

      <AdSlot type="leaderboard" className="mb-12" />

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {posts.map((post, i) => (
          <div key={post.id} style={{ animationDelay: `${i * 0.03}s` }} className="animate-fade-up">
            <StoryCard post={post} />
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-28">
          <p className="text-gray-700 text-base">මෙම ප්‍රවර්ගයේ කතා හමු නොවීය.</p>
        </div>
      )}
    </div>
  );
}
