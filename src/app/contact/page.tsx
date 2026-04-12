import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - අප හා සම්බන්ධ වන්න",
  description: "නොකී කතා - Untold Stories සමඟ සම්බන්ධ වන්න. ඔබේ අදහස්, යෝජනා සහ විමසීම් අපට එවන්න.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="breadcrumb mb-10">
        <Link href="/">මුල් පිටුව</Link>
        <svg className="separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
        <span className="text-gray-400">Contact Us</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-2 tracking-tight">Contact Us</h1>
      <p className="text-gray-600 text-sm mb-10 font-medium">අප හා සම්බන්ධ වන්න</p>

      <div className="space-y-8 text-gray-400 text-[14px] leading-relaxed">
        <p>
          නොකී කතා - Untold Stories වෙබ් අඩවිය සම්බන්ධයෙන් ඔබට කිසියම් ප්‍රශ්නයක්,
          යෝජනාවක් හෝ ප්‍රතිපෝෂණයක් ඇත්නම්, කරුණාකර පහත ක්‍රමවේද හරහා අප හා
          සම්බන්ධ වන්න.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/UntoldStoriesLK"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card group"
          >
            <span className="text-3xl mb-4 block">📘</span>
            <h3 className="text-gold-400 font-semibold text-[15px] mb-1.5 group-hover:text-gold-300 transition-colors duration-300">Facebook</h3>
            <p className="text-gray-600 text-[12px] leading-relaxed">
              අපගේ Facebook පිටුවට පණිවිඩයක් එවන්න. අපි ඉක්මනින් ප්‍රතිචාර දක්වන්නෙමු.
            </p>
            <p className="text-gold-500/60 text-[12px] mt-3 font-medium">@UntoldStoriesLK</p>
          </a>

          {/* Email */}
          <a
            href="mailto:nokikathauntoldstories@gmail.com"
            className="contact-card group"
          >
            <span className="text-3xl mb-4 block">📧</span>
            <h3 className="text-gold-400 font-semibold text-[15px] mb-1.5 group-hover:text-gold-300 transition-colors duration-300">Email</h3>
            <p className="text-gray-600 text-[12px] leading-relaxed">
              විද්‍යුත් තැපැල් මගින් අප හා සම්බන්ධ වන්න.
            </p>
            <p className="text-gold-500/60 text-[12px] mt-3 font-medium">nokikathauntoldstories@gmail.com</p>
          </a>
        </div>

        <div className="glass-card rounded-2xl p-7">
          <h2 className="text-gold-400 font-semibold text-base mb-5">නිතර අසන ප්‍රශ්න (FAQ)</h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-gray-300 font-medium text-[14px] mb-1.5">ඔබේ කතා වල මූලාශ්‍ර මොනවාද?</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                අපි ජාත්‍යන්තර ප්‍රවෘත්ති මාධ්‍ය, පර්යේෂණ ලේඛන, නිල වාර්තා සහ විශ්වසනීය
                මූලාශ්‍ර භාවිතා කරමින් අපගේ කතා සකස් කරමු.
              </p>
            </div>

            <div className="gradient-line" />

            <div>
              <h3 className="text-gray-300 font-medium text-[14px] mb-1.5">මට කතා යෝජනා කළ හැකිද?</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                ඔව්! ඔබට අපගේ Facebook පිටුවට පණිවිඩයක් එවා කතා යෝජනා කළ හැක.
                අපි සෑම යෝජනාවක්ම සලකා බලමු.
              </p>
            </div>

            <div className="gradient-line" />

            <div>
              <h3 className="text-gray-300 font-medium text-[14px] mb-1.5">අන්තර්ගතය නැවත ප්‍රකාශ කළ හැකිද?</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                අපගේ අන්තර්ගතය ප්‍රකාශන හිමිකම් වලින් ආරක්ෂිතය. කරුණාකර නැවත ප්‍රකාශ
                කිරීමට පෙර අපගෙන් අවසර ලබා ගන්න. සබැඳි බෙදා ගැනීම සාදරයෙන් පිළිගනිමු.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-7">
          <h2 className="text-gold-400 font-semibold text-base mb-3">ව්‍යාපාරික විමසීම්</h2>
          <p className="text-gray-600 text-[13px] mb-4 leading-relaxed">
            වෙළඳ ප්‍රචාරණ, සහයෝගීතා, හෝ ව්‍යාපාරික අවස්ථා සම්බන්ධයෙන් කරුණාකර
            විද්‍යුත් තැපැල් මගින් අප හා සම්බන්ධ වන්න:
          </p>
          <a
            href="mailto:nokikathauntoldstories@gmail.com"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-[13px] transition-colors duration-300"
          >
            📧 nokikathauntoldstories@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
