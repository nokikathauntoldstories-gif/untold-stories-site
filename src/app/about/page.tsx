import { Metadata } from "next";
import Link from "next/link";
import { getCategoryStats } from "@/lib/posts";

export const metadata: Metadata = {
  title: "අපි ගැන - About Us",
  description:
    "නොකී කතා - Untold Stories පිටුව ගැන දැනගන්න. ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය පිළිබඳ කතා.",
};

export default function AboutPage() {
  const stats = getCategoryStats();
  const totalStories = stats.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-400">මුල් පිටුව</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">අපි ගැන</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-6">
        අපි ගැන
      </h1>

      <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-loose">
        <p>
          <strong className="text-gold-400">නොකී කතා - Untold Stories</strong> යනු
          ලෝකයේ විවිධ රටවල සිදුවූ අභිරහස් සිදුවීම්, සැබෑ අපරාධ, ඓතිහාසික
          සිදුවීම් සහ භූ දේශපාලන විශ්ලේෂණ සිංහල භාෂාවෙන් ඔබ වෙත ගෙන එන
          ශ්‍රී ලංකාවේ ප්‍රමුඛතම සිංහල කතා පිටුවයි.
        </p>

        <p>
          අපගේ අරමුණ වන්නේ ලෝකයේ සැඟවුණු කතා, නොකියූ සත්‍ය සිදුවීම් සහ
          ආකර්ශනීය ඉතිහාසය සිංහල පාඨකයන් වෙත ගෙන ඒමයි. සෑම කතාවක්ම
          පර්යේෂණාත්මක ලෙස ලියැවී ඇති අතර, එහි සත්‍යතාව සහතික කිරීම සඳහා
          විශ්වසනීය මූලාශ්‍ර භාවිතා කරනු ලැබේ.
        </p>

        <div className="bg-navy-900 border border-navy-700 rounded-xl p-6 my-8">
          <h2 className="text-gold-400 font-semibold text-xl mb-4">
            සංඛ්‍යාලේඛන
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-400">{totalStories}</p>
              <p className="text-gray-400 text-sm">මුළු කතා</p>
            </div>
            {stats.map(({ category, count }) => (
              <div key={category.slug} className="text-center">
                <p className="text-2xl font-bold text-gray-200">{count}</p>
                <p className="text-gray-400 text-sm">
                  {category.emoji} {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-gold-400 font-semibold text-xl">
          සම්බන්ධ වන්න
        </h2>
        <p>
          අපගේ Facebook පිටුව අනුගමනය කරන්න:
        </p>
        <a
          href="https://www.facebook.com/UntoldStoriesLK"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-navy-800 border border-navy-600 px-6 py-3 rounded-xl text-gold-400 hover:border-gold-500/50 transition-colors"
        >
          📘 නොකී කතා - Untold Stories
        </a>

        <p className="text-gray-500 text-sm mt-8">
          විමසීම් සඳහා: අපගේ Facebook පිටුවට පණිවිඩයක් එවන්න.
        </p>
      </div>
    </div>
  );
}
