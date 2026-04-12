"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    FB?: {
      XFBML: { parse: (el?: HTMLElement) => void };
      init: (params: Record<string, unknown>) => void;
    };
    fbAsyncInit?: () => void;
  }
}

export default function FacebookVideoEmbed({ videoUrl }: { videoUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Facebook SDK if not already loaded
    if (!document.getElementById("facebook-jssdk")) {
      window.fbAsyncInit = function () {
        window.FB?.init({
          xfbml: true,
          version: "v25.0",
        });
      };
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/si_LK/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.FB) {
      // SDK already loaded, just parse the new embed
      window.FB.XFBML.parse(containerRef.current || undefined);
    }

    // Re-parse when FB SDK loads
    const interval = setInterval(() => {
      if (window.FB && containerRef.current) {
        window.FB.XFBML.parse(containerRef.current);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [videoUrl]);

  return (
    <div ref={containerRef} className="my-6">
      <div
        className="fb-video"
        data-href={videoUrl}
        data-width="auto"
        data-show-text="false"
        data-allowfullscreen="true"
      />
      {/* Fallback link */}
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
      >
        ▶ Facebook හි වීඩියෝව බලන්න
      </a>
    </div>
  );
}
