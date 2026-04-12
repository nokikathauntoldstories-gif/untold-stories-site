"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "මුල් පිටුව", exact: true },
  { href: "/category/mysteries", label: "🔍 අභිරහස්", exact: false },
  { href: "/category/true-crime", label: "🔪 සැබෑ අපරාධ", exact: false },
  { href: "/category/historical", label: "📜 ඉතිහාසය", exact: false },
  { href: "/category/geopolitics", label: "🌍 භූ දේශපාලනය", exact: false },
  { href: "/category/psychology", label: "🧠 මනෝවිද්‍යාව", exact: false },
  { href: "/about", label: "අපි ගැන", exact: false },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-950/95 backdrop-blur-xl border-b border-navy-700/80 shadow-lg shadow-navy-950/50"
          : "bg-navy-900/80 backdrop-blur-sm border-b border-navy-700/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-500 to-gold-400 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/40 transition-shadow">
              <span className="text-navy-950 font-bold text-sm">NK</span>
            </div>
            <div>
              <h1 className="text-gold-400 font-bold text-lg leading-tight group-hover:text-gold-300 transition-colors">
                නොකී කතා
              </h1>
              <p className="text-gray-500 text-[10px] leading-tight tracking-wider uppercase">
                Untold Stories
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActive(item)
                    ? "text-gold-400 bg-gold-500/10 font-medium"
                    : "text-gray-400 hover:text-gray-200 hover:bg-navy-800/50"
                }`}
              >
                {item.label}
                {isActive(item) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-gold-400 rounded-lg hover:bg-navy-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="lg:hidden pb-4 border-t border-navy-700/50 pt-3 space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  isActive(item)
                    ? "text-gold-400 bg-gold-500/10 font-medium"
                    : "text-gray-300 hover:text-gold-400 hover:bg-navy-800/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
