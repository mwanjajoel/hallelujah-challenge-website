import type { Metadata } from "next";
import StickyBar from "@/components/StickyBar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hallelujah Challenge",
    template: "%s | Hallelujah Challenge",
  },
  description:
    "Hallelujah Challenge is an hour-long online praise programme unto the Lord, convened by Pastor Nathaniel Bassey and commencing at 11:59 PM.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint. Without this the page
            renders light and then flips, which is worse than no toggle at all.
            Light is the default, so only an explicit "dark" sets anything. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('hc-theme')==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}})()",
          }}
        />
        {/* The faces are declared in globals.css and served from this origin.
            They are not loaded through next/font because the styles name
            "Geist" and "Geist Mono" literally in many inline `font:`
            shorthands, and next/font would rename the families.

            The two faces that paint first are preloaded: Instrument Serif
            carries every h1, and Geist carries the body. Without this the
            browser only discovers them part-way through parsing the
            stylesheet. The italic and the mono are left to be found normally,
            since neither appears above the fold. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/instrumentserif-normal.woff2"
          crossOrigin=""
        />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/geist-normal.woff2" crossOrigin="" />
      </head>
      <body>
        {children}
        <StickyBar />
      </body>
    </html>
  );
}
