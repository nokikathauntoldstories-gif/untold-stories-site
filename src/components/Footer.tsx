import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-700 mt-12">
      {/* AdSense: Footer ad slot */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="ad-slot h-[90px]">Ad Space - Footer Banner (728x90)</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-gold-400 font-bold text-lg mb-3">
              📖 නොකී කතා - Untold Stories
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය සහ භූ දේශපාලනය පිළිබඳ
              නොකියූ කතා ඔබ වෙත ගෙන එන ශ්‍රී ලංකාවේ ප්‍රමුඛතම සිංහල
              කතා පිටුව.
            </p>
          </div>

          <div>
            <h4 className="text-gold-400 font-semibold mb-3">ප්‍රවර්ග</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/mysteries" className="text-gray-400 hover:text-gold-300 transition-colors">🔍 අභිරහස්</Link></li>
              <li><Link href="/category/true-crime" className="text-gray-400 hover:text-gold-300 transition-colors">🔪 සැබෑ අපරාධ</Link></li>
              <li><Link href="/category/historical" className="text-gray-400 hover:text-gold-300 transition-colors">📜 ඉතිහාසය</Link></li>
              <li><Link href="/category/geopolitics" className="text-gray-400 hover:text-gold-300 transition-colors">🌍 භූ දේශපාලනය</Link></li>
              <li><Link href="/category/psychology" className="text-gray-400 hover:text-gold-300 transition-colors">🧠 මනෝවිද්‍යාව</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 font-semibold mb-3">සම්බන්ධ වන්න</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.facebook.com/UntoldStoriesLK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-300 transition-colors"
                >
                  📘 Facebook පිටුව
                </a>
              </li>
              <li><Link href="/about" className="text-gray-400 hover:text-gold-300 transition-colors">📄 අපි ගැන</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-gold-300 transition-colors">📧 සම්බන්ධ වන්න</Link></li>
            </ul>

            <h4 className="text-gold-400 font-semibold mt-6 mb-3">නීතිමය</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-400 hover:text-gold-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-gold-300 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-8 pt-6 text-center text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} නොකී කතා - Untold Stories. සියලුම හිමිකම් ඇවිරිණි.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
