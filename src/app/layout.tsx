import type { Metadata } from "next";
import { Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const ADSENSE_CLIENT_ID = "ca-pub-9816831671391733";

const sinhalaFont = Noto_Sans_Sinhala({
  variable: "--font-sinhala",
  subsets: ["sinhala", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "නොකී කතා - Untold Stories | ලෝකයේ නොකියූ කතා",
    template: "%s | නොකී කතා - Untold Stories",
  },
  description:
    "ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය සහ භූ දේශපාලනය පිළිබඳ නොකියූ කතා. Untold stories of mysteries, true crime, history and geopolitics in Sinhala.",
  keywords: [
    "නොකී කතා",
    "untold stories",
    "අභිරහස්",
    "සැබෑ අපරාධ",
    "ඉතිහාසය",
    "sinhala stories",
    "mystery sinhala",
  ],
  openGraph: {
    title: "නොකී කතා - Untold Stories",
    description: "ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය සහ භූ දේශපාලනය පිළිබඳ නොකියූ කතා.",
    type: "website",
    locale: "si_LK",
    siteName: "නොකී කතා - Untold Stories",
  },
  twitter: {
    card: "summary_large_image",
    title: "නොකී කතා - Untold Stories",
    description: "ලෝකයේ අභිරහස්, සැබෑ අපරාධ, ඉතිහාසය සහ භූ දේශපාලනය පිළිබඳ නොකියූ කතා.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="si" className={`${sinhalaFont.variable} h-full antialiased`}>
      <head>
        {/* Google AdSense — literal script tag so it appears in the SSR HTML
            that Google's verifier fetches (next/script afterInteractive only
            injects after hydration, which the verifier can't see). */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
      </head>
      <body className="min-h-full flex flex-col ambient-glow">
        <Header />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
