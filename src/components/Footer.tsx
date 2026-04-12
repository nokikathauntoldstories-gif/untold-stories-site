"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative mt-24">
      {/* Top gradient separator */}
      <div className="gradient-line" />

      {/* Ad slot */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="ad-slot h-[90px]">Ad Space - Footer Banner (728x90)</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-gold-200 via-gold-400 to-gold-500 rounded-xl flex items-center justify-center">
                <span className="text-navy-950 font-bold text-[13px]">NK</span>
              </div>
              <div>
                <h3 className="text-gold-300 font-bold text-base leading-tight">නොකී කතා</h3>
                <p className="text-gray-700 text-[9px] tracking-[0.25em] uppercase">Untold Stories</p>
              </div>
            </div>
            <p className="text-gray-600 text-[13px] leading-relaxed max-w-sm">
              ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය සහ භූ දේශපාලනය පිළිබඳ
              නොකියූ කතා ඔබ වෙත ගෙන එන ශ්‍රී ලංකාවේ ප්‍රමුඛතම සිංහල කතා පිටුව.
            </p>
            <a
              href="https://www.facebook.com/UntoldStoriesLK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mt-6 text-[12px] text-gray-500 hover:text-gold-400 bg-navy-800/30 px-4 py-2.5 rounded-xl border border-navy-700/30 hover:border-gold-500/15 transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Follow on Facebook
            </a>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="text-gray-400 font-semibold text-[11px] tracking-[0.2em] uppercase mb-6">ප්‍රවර්ග</h4>
            <ul className="space-y-3.5">
              <li><Link href="/category/mysteries" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">අභිරහස්</Link></li>
              <li><Link href="/category/true-crime" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">සැබෑ අපරාධ</Link></li>
              <li><Link href="/category/historical" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">ඉතිහාසය</Link></li>
              <li><Link href="/category/geopolitics" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">භූ දේශපාලනය</Link></li>
              <li><Link href="/category/psychology" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">මනෝවිද්‍යාව</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="text-gray-400 font-semibold text-[11px] tracking-[0.2em] uppercase mb-6">සම්බන්ධ වන්න</h4>
            <ul className="space-y-3.5">
              <li><Link href="/about" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">අපි ගැන</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">සම්බන්ධ වන්න</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="text-gray-400 font-semibold text-[11px] tracking-[0.2em] uppercase mb-6">නීතිමය</h4>
            <ul className="space-y-3.5">
              <li><Link href="/privacy" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-gold-400 text-[13px] transition-colors duration-300 hover-underline">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-7">
          <div className="gradient-line mb-7" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-700 text-[11px] font-medium">
              &copy; {new Date().getFullYear()} නොකී කතා - Untold Stories. සියලුම හිමිකම් ඇවිරිණි.
            </p>
            <div className="flex items-center gap-6 text-gray-700 text-[11px] font-medium">
              <Link href="/about" className="hover:text-gray-400 transition-colors duration-300">About</Link>
              <Link href="/contact" className="hover:text-gray-400 transition-colors duration-300">Contact</Link>
              <Link href="/privacy" className="hover:text-gray-400 transition-colors duration-300">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-400 transition-colors duration-300">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
