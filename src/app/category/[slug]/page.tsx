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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gold-400">මුල් පිටුව</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{category.emoji} {category.name}</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-4 block">{category.emoji}</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-2">
          {category.name}
        </h1>
        <p className="text-gray-300 text-lg mb-1">{category.nameEn}</p>
        <p className="text-gray-400 text-sm">{category.description}</p>
        <p className="text-gray-500 text-sm mt-2">
          කතා {posts.length}ක්
        </p>
      </div>

      <AdSlot type="leaderboard" className="mb-8" />

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <StoryCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">මෙම ප්‍රවර්ගයේ කතා හමු නොවීය.</p>
        </div>
      )}
    </div>
  );
}
