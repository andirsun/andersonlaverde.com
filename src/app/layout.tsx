import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CursorGlow from "@/components/CursorGlow";
import { langScript } from "@/lib/lang";

export const metadata: Metadata = {
  metadataBase: new URL("https://andersonlaverde.com"),
  // "./" resolves against each route's own path, so every page declares itself
  // on the apex domain as canonical (www and preview hosts are duplicates).
  alternates: { canonical: "./" },
  title: {
    default: "Anderson Laverde — Software Engineer",
    template: "%s — Anderson Laverde",
  },
  description:
    "Software engineer at Streamline since 2021 — full-stack, Growth technical lead, now AI Advocate.",
  openGraph: {
    type: "website",
    url: "https://andersonlaverde.com",
    siteName: "Anderson Laverde",
  },
  twitter: { card: "summary_large_image" },
};

// Self-hosted at build time; both are variable fonts, so every weight comes from one file.
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

const themeScript = `(function(){var t=localStorage.getItem("al-theme")==="light"?"light":"dark";document.documentElement.setAttribute("data-theme",t);})();`;
// Color palette the visitor picked (café is the default and has no attribute). Before paint, like the theme.
const paletteScript = `(function(){try{if(localStorage.getItem("al-palette")==="mint")document.documentElement.setAttribute("data-palette","mint");}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + paletteScript + langScript }} />
      </head>
      <body>
        <CursorGlow />
        <Header />
        {children}
      </body>
    </html>
  );
}
