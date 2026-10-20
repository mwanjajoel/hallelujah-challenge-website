import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "@/components/ui/Reveal";

const PRIMARY: Array<[string, string]> = [
  ["About", "/about"],
  ["Watch Live", "/watch"],
  ["Testimonies", "/testimonies"],
  ["Partnership", "/give"],
];

const SECONDARY: Array<[string, string]> = [
  ["Prayer Points", "/prayer-points"],
  ["Ask Room", "/ask-room"],
  ["Int'l Guests", "/international"],
  ["Contact", "/contact"],
];

const SERIF_LINK: CSSProperties = {
  display: "block",
  padding: "7px 0",
  color: "var(--fg)",
  textDecoration: "none",
  fontFamily: "var(--font-display)",
  fontSize: "clamp(22px, 2.4vw, 30px)",
  lineHeight: 1.25,
};

const SMALL_LINK: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 36,
  color: "var(--fg-muted)",
  font: "400 15px/1.3 var(--font-sans)",
  textDecoration: "none",
};

const LEGAL: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "0 10px",
  color: "var(--fg-muted)",
  font: "400 14px/1 var(--font-sans)",
  textDecoration: "none",
};

/**
 * The footer closes the page with the name set as large as it will go.
 *
 * The wordmark is clipped by the section rather than scaled to fit — letting
 * it run past the edge is what gives it presence, and `overflow: clip` keeps
 * that from creating a scroll container.
 */
export default function SiteFooter() {
  return (
    <footer
      style={{
        position: "relative",
        overflow: "clip",
        background: "var(--bg)",
        color: "var(--fg)",
        borderTop: "1px solid var(--line)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "auto -10% -30% -10%",
          height: "70%",
          background: "radial-gradient(50% 100% at 50% 100%, var(--glow-gold), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "var(--max)",
          margin: "0 auto",
          padding: "clamp(64px, 8vw, 110px) var(--gutter) 0",
        }}
      >
        <Reveal
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "clamp(32px, 5vw, 72px)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: "1 1 240px" }}>
            <img
              src="/assets/hc-logo.png"
              alt="Hallelujah Challenge"
              width={217}
              height={90}
              style={{ height: 52, width: "auto", alignSelf: "flex-start" }}
            />
            <a
              href="mailto:info@hallelujahchallengelive.com"
              className="hc-t hc-footlink"
              style={{
                font: "400 16px/1.5 var(--font-sans)",
                color: "var(--fg)",
                textUnderlineOffset: 4,
                wordBreak: "break-word",
              }}
            >
              info@hallelujahchallengelive.com
            </a>
            <p style={{ margin: 0, font: "500 12px/1 var(--font-mono)", letterSpacing: ".08em", color: "var(--accent)" }}>
              COMMENCING AT 11:59 PM
            </p>
          </div>

          <nav aria-label="Footer" style={{ flex: "0 1 auto" }}>
            {PRIMARY.map(([label, href]) => (
              <Link key={label} href={href} className="hc-t hc-footlink" style={SERIF_LINK}>
                {label}
              </Link>
            ))}
          </nav>

          <nav
            aria-label="Footer more"
            style={{ flex: "0 1 auto", display: "flex", flexDirection: "column", gap: 2 }}
          >
            {SECONDARY.map(([label, href]) => (
              <Link key={label} href={href} className="hc-t hc-footlink" style={SMALL_LINK}>
                {label}
              </Link>
            ))}
          </nav>
        </Reveal>

        <div
          style={{
            marginTop: "clamp(40px, 5vw, 64px)",
            paddingTop: 22,
            borderTop: "1px solid var(--line)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0, font: "400 14px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
            ©2026 by Hallelujah Challenge Gospel Music Initiative
          </p>
          <nav aria-label="Legal" style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <a href="#" className="hc-t hc-legallink" style={LEGAL}>
              Privacy Policy
            </a>
            <a href="#" className="hc-t hc-legallink" style={LEGAL}>
              Cookies
            </a>
            <a href="#" className="hc-t hc-legallink" style={LEGAL}>
              Terms And Conditions
            </a>
          </nav>
        </div>
      </div>

      {/* The wordmark. Deliberately oversized and clipped at the baseline. */}
      <Reveal
        aria-hidden="true"
        style={{
          position: "relative",
          marginTop: "clamp(24px, 4vw, 48px)",
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 15.5vw, 260px)",
          lineHeight: 0.82,
          letterSpacing: "-0.05em",
          whiteSpace: "nowrap",
          userSelect: "none",
          marginBottom: "-0.16em",
        }}
      >
        <span style={{ color: "var(--fg)" }}>Hallelujah </span>
        <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Challenge</em>
      </Reveal>
    </footer>
  );
}
