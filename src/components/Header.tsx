"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "මුල් පිටුව", exact: true },
  { href: "/category/mysteries", label: "අභිරහස්", exact: false },
  { href: "/category/true-crime", label: "සැබෑ අපරාධ", exact: false },
  { href: "/category/historical", label: "ඉතිහාසය", exact: false },
  { href: "/category/geopolitics", label: "භූ දේශපාලනය", exact: false },
  { href: "/category/psychology", label: "මනෝවිද්‍යාව", exact: false },
  { href: "/category/other", label: "වෙනත්", exact: false },
  { href: "/about", label: "අපි ගැන", exact: false },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-navy-950/80 backdrop-blur-3xl border-b border-white/[0.04] shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-gold-200 via-gold-400 to-gold-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/15 group-hover:shadow-gold-500/30 transition-all duration-500 group-hover:scale-105">
                <span className="text-navy-950 font-bold text-[13px] tracking-tight">NK</span>
              </div>
            </div>
            <div>
              <h1 className="text-gold-300 font-bold text-[17px] leading-none group-hover:text-gold-200 transition-colors duration-300 tracking-tight">
                නොකී කතා
              </h1>
              <p className="text-gray-600 text-[9px] leading-tight tracking-[0.25em] uppercase font-medium mt-0.5">
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
                className={`relative px-3.5 py-2 text-[13px] rounded-lg transition-all duration-300 ${
                  isActive(item)
                    ? "text-gold-300 font-semibold"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
                }`}
              >
                {item.label}
                {isActive(item) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gradient-to-r from-gold-400/50 via-gold-400 to-gold-400/50 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gold-400 rounded-lg hover:bg-white/[0.03] transition-all duration-300"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            menuOpen ? "max-h-[400px] opacity-100 pb-5" : "max-h-0 opacity-0"
          }`}
        >
          <div className="gradient-line mb-3" />
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 text-sm rounded-xl transition-all duration-300 ${
                  isActive(item)
                    ? "text-gold-300 bg-gold-500/[0.06] font-medium"
                    : "text-gray-400 hover:text-gold-400 hover:bg-white/[0.02]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
