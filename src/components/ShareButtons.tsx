"use client";

import { useEffect, useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-sm">බෙදාගන්න:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 bg-navy-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
        aria-label="Share on Facebook"
      >
        <span className="text-sm">📘</span>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 bg-navy-700 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors"
        aria-label="Share on X"
      >
        <span className="text-sm">𝕏</span>
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 bg-navy-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
        aria-label="Share on WhatsApp"
      >
        <span className="text-sm">💬</span>
      </a>
    </div>
  );
}
