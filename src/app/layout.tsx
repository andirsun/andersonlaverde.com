import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import CursorGlow from "@/components/CursorGlow";
import { langScript } from "@/lib/lang";

export const metadata: Metadata = {
  metadataBase: new URL("https://andersonlaverde.com"),
  title: {
    default: "Anderson Laverde — Software Engineer",
    template: "%s — Anderson Laverde",
  },
  description:
    "Software engineer at Streamline since 2021 — full-stack, Growth technical lead, now AI Advocate. Based in Lisbon.",
  openGraph: {
    type: "website",
    url: "https://andersonlaverde.com",
    siteName: "Anderson Laverde",
  },
  twitter: { card: "summary_large_image" },
};

const themeScript = `(function(){var t=localStorage.getItem("al-theme")==="light"?"light":"dark";document.documentElement.setAttribute("data-theme",t);})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript + langScript }} />
      </head>
      <body>
        <div className="scanlines" />
        <CursorGlow />
        <Header />
        {children}
      </body>
    </html>
  );
}
