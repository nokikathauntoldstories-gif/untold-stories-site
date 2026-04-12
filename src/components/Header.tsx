"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "මුල් පිටුව" },
  { href: "/category/mysteries", label: "🔍 අභිරහස්" },
  { href: "/category/true-crime", label: "🔪 සැබෑ අපරාධ" },
  { href: "/category/historical", label: "📜 ඉතිහාසය" },
  { href: "/category/geopolitics", label: "🌍 භූ දේශපාලනය" },
  { href: "/category/psychology", label: "🧠 මනෝවිද්‍යාව" },
  { href: "/about", label: "අපි ගැන" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-navy-900/95 backdrop-blur-sm border-b border-navy-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h1 className="text-gold-400 font-bold text-lg leading-tight">
                නොකී කතා
              </h1>
              <p className="text-gray-400 text-xs leading-tight">
                Untold Stories
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-300 hover:text-gold-400 rounded-lg hover:bg-navy-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-gold-400"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <nav className="lg:hidden pb-4 border-t border-navy-700 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:text-gold-400 hover:bg-navy-800 rounded-lg"
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
