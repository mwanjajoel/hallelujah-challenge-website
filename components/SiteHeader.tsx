"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { session } from "@/lib/session";
import { useElementWidth } from "@/lib/useElementWidth";
import { useNow, useSessionMode } from "@/lib/useSessionClock";

export type NavKey =
  | "home"
  | "int"
  | "newconverts"
  | "about"
  | "testimonies"
  | "watch"
  | "give"
  | "askroom"
  | "prayerpoints"
  | "contact";

/** Label, href, key. Order matters: the mobile sheet numbers them in sequence. */
const ALL: Array<[string, string, NavKey]> = [
  ["Home", "/", "home"],
  ["About", "/about", "about"],
  ["Watch Live", "/watch", "watch"],
  ["Testimonies", "/testimonies", "testimonies"],
  ["Prayer Points", "/prayer-points", "prayerpoints"],
  ["Ask Room", "/ask-room", "askroom"],
  ["Int'l Guests", "/international", "int"],
  ["Partnership/Giving", "/give", "give"],
  ["Contact", "/contact", "contact"],
];

const DESKTOP_KEYS: NavKey[] = ["about", "watch", "testimonies", "prayerpoints", "askroom", "contact"];

const NAV_LINK: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  minHeight: 42,
  padding: "0 14px",
  color: "var(--fg)",
  textDecoration: "none",
  font: "500 15px/1 var(--font-sans)",
  borderRadius: "var(--r-pill)",
  whiteSpace: "nowrap",
};

export default function SiteHeader({ active = "home" }: { active?: NavKey }) {
  const [width, rootRef] = useElementWidth();
  const [open, setOpen] = useState(false);
  // Sourced here rather than passed in, so the banner is correct on every page
  // rather than only the two that happened to thread the prop through.
  const now = useNow();
  const mode = useSessionMode();
  const { live } = now === null ? { live: false } : session(now, mode);

  const mobile = width < 1200;
  const links = (mobile ? ALL : ALL.filter((l) => DESKTOP_KEYS.includes(l[2]))).map(([label, href, k], i) => ({
    label,
    href,
    n: String(i + 1).padStart(2, "0"),
    active: k === active,
    current: k === active ? ("page" as const) : undefined,
  }));

  const menuOpen = mobile && open;

  return (
    <div ref={rootRef} style={{ fontFamily: "var(--font-sans)" }}>
      {/* Thin context strip, in place of the old live-only banner. */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          minHeight: 32,
          padding: "5px 16px",
          background: live ? "var(--live)" : "var(--surface)",
          borderBottom: "1px solid var(--line)",
          font: "500 11px/1.3 var(--font-mono)",
          letterSpacing: ".1em",
          textAlign: "center",
          color: live ? "#fff" : "var(--fg-muted)",
        }}
      >
        {live ? (
          <Link
            href="/watch"
            className="hc-t"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#fff", textDecoration: "none" }}
          >
            <span
              className="hc-breathe"
              aria-hidden="true"
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }}
            />
            ON AIR NOW · WATCH LIVE
          </Link>
        ) : (
          <span>AN HOUR OF PRAISE, NIGHTLY AT 11:59 PM WAT</span>
        )}
      </div>

      <header
        style={{
          background: "rgba(11,13,23,.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
            height: 72,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {mobile && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="hc-t hc-circle"
              style={{
                minHeight: 44,
                minWidth: 44,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0 16px 0 12px",
                background: "transparent",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-pill)",
                color: "var(--fg)",
                font: "500 14px/1 var(--font-sans)",
                cursor: "pointer",
              }}
            >
              <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "block", width: 16, height: 1.5, background: "var(--fg)" }} />
                <span style={{ display: "block", width: 16, height: 1.5, background: "var(--fg)" }} />
                <span style={{ display: "block", width: 10, height: 1.5, background: "var(--fg)" }} />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          )}

          <Link
            href="/"
            aria-label="Hallelujah Challenge, home"
            className="hc-t"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", minHeight: 44 }}
          >
            <img
              src="/assets/hc-logo.png"
              alt="Hallelujah Challenge"
              width={217}
              height={90}
              style={{ height: 42, width: "auto", display: "block" }}
            />
          </Link>

          {!mobile && (
            <nav aria-label="Main" style={{ display: "flex", gap: 2, marginLeft: 8 }}>
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  aria-current={l.current}
                  className="hc-t hc-navlink"
                  style={{ ...NAV_LINK, color: l.active ? "var(--accent)" : "var(--fg)" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          )}

          <div style={{ flex: 1 }} />

          <Link
            href="/give"
            className="hc-t hc-pill-gold"
            style={{
              whiteSpace: "nowrap",
              flex: "none",
              display: width >= 560 ? "inline-flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 42,
              padding: "0 22px",
              borderRadius: "var(--r-pill)",
              background: "var(--accent)",
              color: "var(--bg)",
              font: "600 15px/1 var(--font-sans)",
              textDecoration: "none",
            }}
          >
            Partner with us
          </Link>
        </div>

        {menuOpen && (
          <div
            id="mobile-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "16px var(--gutter) 36px",
              borderTop: "1px solid var(--line)",
              minHeight: "calc(100vh - 104px)",
              background: "var(--bg)",
            }}
          >
            <nav aria-label="Main" style={{ display: "flex", flexDirection: "column" }}>
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  aria-current={l.current}
                  onClick={() => setOpen(false)}
                  className="hc-t"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    minHeight: 62,
                    padding: "10px 0",
                    color: l.active ? "var(--accent)" : "var(--fg)",
                    textDecoration: "none",
                    fontFamily: "var(--font-display)",
                    fontSize: 34,
                    lineHeight: 1.1,
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span
                    style={{
                      font: "500 12px/1 var(--font-mono)",
                      color: "var(--fg-muted)",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: ".08em",
                    }}
                  >
                    {l.n}
                  </span>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
