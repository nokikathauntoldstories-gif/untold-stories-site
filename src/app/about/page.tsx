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
          2025 වසරේ ආරම්භ කළ, ලෝකයේ අභිරහස් සිදුවීම්, සැබෑ අපරාධ, ඓතිහාසික
          සිදුවීම්, සහ භූ දේශපාලන විශ්ලේෂණ සිංහල භාෂාවෙන් ගෙන එන ස්වාධීන
          ඩිජිටල් ප්‍රකාශන වේදිකාවකි. අද වන විට {totalStories}+ කතා පවතින
          අතර, මාසිකව මිලියනයකට අධික පාඨක ප්‍රජාවකට අප සේවය සපයමු.
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
          අපගේ අරමුණ
        </h2>
        <p>
          ලෝකයේ සැඟවුණු සත්‍ය කතා සිංහල පාඨකයින් වෙත නිවැරදිව, ආකර්ශනීයව,
          සහ වගකීමෙන් ගෙන ඒම අපගේ මූලික පරමාර්ථයයි.
        </p>

        <h2 className="section-accent text-gold-400 font-semibold text-base">
          අපගේ කර්තෘ කණ්ඩායම
        </h2>
        <p>
          නොකී කතා ආරම්භ කළේ <strong className="text-gold-400">කසුන්</strong> විසිනි.
          දත්ත විශ්ලේෂණය, පරීක්ෂණ ක්‍රමවේද, සහ දිගුකාලීන විමර්ශන පසුබිමක්
          සහිත කර්තෘවරයෙකු වශයෙන්, සෑම කතාවක්ම පහත සඳහන් සංස්කරණ ක්‍රියාවලිය
          හරහා පමණක් ප්‍රකාශයට පත් කරනු ලැබේ.
        </p>

        <h2 className="section-accent text-gold-400 font-semibold text-base">
          අපගේ සංස්කරණ ක්‍රියාවලිය
        </h2>
        <ul className="space-y-3 list-none pl-0">
          <li className="flex gap-3">
            <span className="text-gold-400 flex-shrink-0 mt-1">•</span>
            <span>
              <strong className="text-gray-300">මූලාශ්‍ර තහවුරු කිරීම</strong> — අවම
              වශයෙන් ස්වාධීන මූලාශ්‍ර 2-3 කින් සිදුවීම් සත්‍ය බව තහවුරු කරනු ලැබේ
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold-400 flex-shrink-0 mt-1">•</span>
            <span>
              <strong className="text-gray-300">විශ්වසනීය මූලාශ්‍ර පමණයි</strong> — Reuters,
              BBC, AP, ඉතිහාස පර්යේෂණ ලේඛන, අධිකරණ වාර්තා, සහ පිළිගත්
              පොත්පත් භාවිතා කරයි
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold-400 flex-shrink-0 mt-1">•</span>
            <span>
              <strong className="text-gray-300">සංස්කාරක සමාලෝචනය</strong> — ප්‍රකාශනයට
              පෙර සෑම කතාවක්ම නිරවද්‍යතාවය සහ සංවේදීතාව සඳහා පරීක්ෂා කරයි
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold-400 flex-shrink-0 mt-1">•</span>
            <span>
              <strong className="text-gray-300">නිවැරදි කිරීම්</strong> — වැරදි
              හඳුනාගත් විට වහා නිවැරදි කරනු ලබයි
            </span>
          </li>
        </ul>

        <h2 className="section-accent text-gold-400 font-semibold text-base">
          අන්තර්ගත ප්‍රතිපත්තිය
        </h2>
        <p>
          සත්‍ය අපරාධ සහ සංවේදී මාතෘකා ආවරණය කරන විට, අපි ශෝකාකුල සිදුවීම්වල
          වින්දිතයින්ට ගරු කරමින්, අනවශ්‍ය ග්‍රැෆික් විස්තර මග හරිමින්, සහ
          අධ්‍යාපනික වටිනාකම මතම අවධානය යොමු කරමු.
        </p>

        <h2 className="section-accent text-gold-400 font-semibold text-base">
          සම්බන්ධ වන්න
        </h2>
        <ul className="space-y-2 list-none pl-0">
          <li>
            📧 විද්‍යුත් තැපෑල:{" "}
            <a
              href="mailto:nokikathauntoldstories@gmail.com"
              className="text-gold-400 hover:text-gold-300 transition-colors"
            >
              nokikathauntoldstories@gmail.com
            </a>
          </li>
          <li>
            📘 Facebook:{" "}
            <a
              href="https://www.facebook.com/UntoldStoriesLK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors"
            >
              @UntoldStoriesLK
            </a>
          </li>
          <li>📍 පදිංචිය: ඕස්ට්‍රේලියාව</li>
        </ul>

        <a
          href="https://www.facebook.com/UntoldStoriesLK"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-navy-800/30 border border-navy-700/30 px-6 py-3.5 rounded-xl text-gold-400 hover:border-gold-500/20 hover:text-gold-300 transition-all duration-300 mt-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          නොකී කතා - Untold Stories
        </a>

        {/* English section */}
        <div className="mt-16 pt-10 border-t border-navy-700/40">
          <h2 className="text-2xl font-bold text-gradient-gold mb-6 tracking-tight">
            About Us
          </h2>
          <div className="space-y-5 text-gray-500 leading-[1.9] text-[14.5px]">
            <p>
              <strong className="text-gold-400">Nokikatha — Untold Stories</strong> is
              an independent Sinhala-language digital publication covering world
              mysteries, true crime, history, and geopolitics. Founded by Kasun
              in 2025, we publish thoroughly researched stories drawn from
              verified international sources including Reuters, BBC, AP,
              academic research, court records, and published works. Every
              story passes through a multi-source verification and editorial
              review process before publication.
            </p>
            <p>
              We are committed to responsible storytelling — covering sensitive
              topics with respect for victims, avoiding gratuitous detail, and
              prioritizing educational and historical context.
            </p>
            <ul className="space-y-1.5 list-none pl-0 pt-2">
              <li>
                Contact:{" "}
                <a
                  href="mailto:nokikathauntoldstories@gmail.com"
                  className="text-gold-400 hover:text-gold-300 transition-colors"
                >
                  nokikathauntoldstories@gmail.com
                </a>{" "}
                /{" "}
                <a
                  href="mailto:admin@nokikatha.com"
                  className="text-gold-400 hover:text-gold-300 transition-colors"
                >
                  admin@nokikatha.com
                </a>
              </li>
              <li>
                Follow:{" "}
                <a
                  href="https://www.facebook.com/UntoldStoriesLK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 transition-colors"
                >
                  facebook.com/UntoldStoriesLK
                </a>
              </li>
              <li>Based in: Australia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
