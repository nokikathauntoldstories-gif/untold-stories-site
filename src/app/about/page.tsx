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
      <nav className="breadcrumb mb-10">
        <Link href="/">මුල් පිටුව</Link>
        <svg className="separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
        <span className="text-gray-400">අපි ගැන</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-10 tracking-tight">
        අපි ගැන
      </h1>

      <div className="space-y-7 text-gray-500 leading-[1.95] text-[15px]">
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

        {/* Stats */}
        <div className="glass-card rounded-2xl p-8 my-12">
          <h2 className="section-accent text-gold-400 font-semibold text-base mb-7">
            සංඛ්‍යාලේඛන
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="stat-card">
              <p className="text-3xl font-bold text-gradient-gold">{totalStories}</p>
              <p className="text-gray-600 text-[12px] mt-1.5 font-medium">මුළු කතා</p>
            </div>
            {stats.map(({ category, count }) => (
              <div key={category.slug} className="stat-card">
                <p className="text-2xl font-bold text-gray-300">{count}</p>
                <p className="text-gray-600 text-[12px] mt-1.5 font-medium">
                  {category.emoji} {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="section-accent text-gold-400 font-semibold text-base">
          සම්බන්ධ වන්න
        </h2>
        <p>
          අපගේ Facebook පිටුව අනුගමනය කරන්න:
        </p>
        <a
          href="https://www.facebook.com/UntoldStoriesLK"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-navy-800/30 border border-navy-700/30 px-6 py-3.5 rounded-xl text-gold-400 hover:border-gold-500/20 hover:text-gold-300 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          නොකී කතා - Untold Stories
        </a>

        <p className="text-gray-700 text-[13px] mt-10 font-medium">
          විමසීම් සඳහා: අපගේ Facebook පිටුවට පණිවිඩයක් එවන්න.
        </p>
      </div>
    </div>
  );
}
