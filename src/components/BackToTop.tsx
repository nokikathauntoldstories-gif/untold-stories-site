"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-7 right-7 z-40 w-10 h-10 bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950 rounded-xl shadow-lg shadow-gold-500/15 flex items-center justify-center transition-all duration-700 hover:shadow-gold-500/30 hover:scale-110 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
      </svg>
    </button>
  );
}
