import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - අප හා සම්බන්ධ වන්න",
  description: "නොකී කතා - Untold Stories සමඟ සම්බන්ධ වන්න. ඔබේ අදහස්, යෝජනා සහ විමසීම් අපට එවන්න.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-400">මුල් පිටුව</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">Contact Us</span>
      </nav>

      <h1 className="text-3xl font-bold text-gold-400 mb-2">Contact Us</h1>
      <p className="text-gray-400 text-sm mb-8">අප හා සම්බන්ධ වන්න</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <p>
          නොකී කතා - Untold Stories වෙබ් අඩවිය සම්බන්ධයෙන් ඔබට කිසියම් ප්‍රශ්නයක්,
          යෝජනාවක් හෝ ප්‍රතිපෝෂණයක් ඇත්නම්, කරුණාකර පහත ක්‍රමවේද හරහා අප හා
          සම්බන්ධ වන්න.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/UntoldStoriesLK"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-navy-900 border border-navy-700 rounded-xl p-6 hover:border-gold-500/50 transition-colors group"
          >
            <span className="text-3xl mb-3 block">📘</span>
            <h3 className="text-gold-400 font-semibold mb-1 group-hover:text-gold-300">Facebook</h3>
            <p className="text-gray-400 text-xs">
              අපගේ Facebook පිටුවට පණිවිඩයක් එවන්න. අපි ඉක්මනින් ප්‍රතිචාර දක්වන්නෙමු.
            </p>
            <p className="text-gold-400 text-xs mt-2">@UntoldStoriesLK</p>
          </a>

          {/* Email */}
          <a
            href="mailto:nokikathauntoldstories@gmail.com"
            className="bg-navy-900 border border-navy-700 rounded-xl p-6 hover:border-gold-500/50 transition-colors group"
          >
            <span className="text-3xl mb-3 block">📧</span>
            <h3 className="text-gold-400 font-semibold mb-1 group-hover:text-gold-300">Email</h3>
            <p className="text-gray-400 text-xs">
              විද්‍යුත් තැපැල් මගින් අප හා සම්බන්ධ වන්න.
            </p>
            <p className="text-gold-400 text-xs mt-2">nokikathauntoldstories@gmail.com</p>
          </a>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
          <h2 className="text-gold-400 font-semibold text-lg mb-4">නිතර අසන ප්‍රශ්න (FAQ)</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-gray-200 font-medium mb-1">ඔබේ කතා වල මූලාශ්‍ර මොනවාද?</h3>
              <p className="text-gray-400">
                අපි ජාත්‍යන්තර ප්‍රවෘත්ති මාධ්‍ය, පර්යේෂණ ලේඛන, නිල වාර්තා සහ විශ්වසනීය
                මූලාශ්‍ර භාවිතා කරමින් අපගේ කතා සකස් කරමු.
              </p>
            </div>

            <div>
              <h3 className="text-gray-200 font-medium mb-1">මට කතා යෝජනා කළ හැකිද?</h3>
              <p className="text-gray-400">
                ඔව්! ඔබට අපගේ Facebook පිටුවට පණිවිඩයක් එවා කතා යෝජනා කළ හැක.
                අපි සෑම යෝජනාවක්ම සලකා බලමු.
              </p>
            </div>

            <div>
              <h3 className="text-gray-200 font-medium mb-1">අන්තර්ගතය නැවත ප්‍රකාශ කළ හැකිද?</h3>
              <p className="text-gray-400">
                අපගේ අන්තර්ගතය ප්‍රකාශන හිමිකම් වලින් ආරක්ෂිතය. කරුණාකර නැවත ප්‍රකාශ
                කිරීමට පෙර අපගෙන් අවසර ලබා ගන්න. සබැඳි බෙදා ගැනීම සාදරයෙන් පිළිගනිමු.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
          <h2 className="text-gold-400 font-semibold text-lg mb-3">ව්‍යාපාරික විමසීම්</h2>
          <p className="text-gray-400 mb-3">
            වෙළඳ ප්‍රචාරණ, සහයෝගීතා, හෝ ව්‍යාපාරික අවස්ථා සම්බන්ධයෙන් කරුණාකර
            විද්‍යුත් තැපැල් මගින් අප හා සම්බන්ධ වන්න:
          </p>
          <a
            href="mailto:nokikathauntoldstories@gmail.com"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300"
          >
            📧 nokikathauntoldstories@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
