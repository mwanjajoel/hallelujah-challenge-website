import type { Metadata } from "next";
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
    <html lang="en">
      <head>
        {/* Loaded as a stylesheet link rather than through next/font: the design
            names "Geist" and "Geist Mono" literally in several hundred inline
            `font:` shorthands, and next/font would rename the families. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@400..600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
