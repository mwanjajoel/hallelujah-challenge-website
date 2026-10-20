"use client";

import Link from "next/link";
import { useState } from "react";
import { useElementWidth } from "@/lib/useElementWidth";

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
  ["Int", "#", "int"],
  ["New Converts", "#", "newconverts"],
  ["About", "/#about", "about"],
  ["Testimonies", "/testimonies", "testimonies"],
  ["Watch Live", "/watch", "watch"],
  ["Partnership/Giving", "/give", "give"],
  ["Ask Room Prayers", "#", "askroom"],
  ["Prayer Points", "#", "prayerpoints"],
  ["Contact", "#", "contact"],
];

const DESKTOP_KEYS: NavKey[] = ["about", "testimonies", "watch", "askroom", "prayerpoints", "contact"];

export default function SiteHeader({ active = "home", live = false }: { active?: NavKey; live?: boolean }) {
  const [width, rootRef] = useElementWidth();
  const [open, setOpen] = useState(false);

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
    <div ref={rootRef} style={{ fontFamily: "Geist,system-ui,sans-serif" }}>
      {live && (
        <Link
          href="/watch"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            minHeight: 36,
            padding: "6px 16px",
            background: "#C62F2F",
            color: "#FFFFFF",
            font: "500 13px/1.2 'Geist Mono',monospace",
            letterSpacing: ".06em",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#FFFFFF",
              boxShadow: "0 0 0 4px rgba(255,255,255,.25)",
              flex: "none",
            }}
          />
          <span>Watch Live</span>
        </Link>
      )}

      <header
        style={{
          background: "rgba(11,13,23,.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid #262B40",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(16px,4cqw,40px)",
            height: 72,
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          {mobile && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              style={{
                minHeight: 44,
                minWidth: 44,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0 16px 0 12px",
                background: "transparent",
                border: "1px solid #262B40",
                borderRadius: 999,
                color: "#F6F1E7",
                font: "500 14px/1 Geist,sans-serif",
                cursor: "pointer",
              }}
            >
              <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "block", width: 16, height: 1.5, background: "#F6F1E7" }} />
                <span style={{ display: "block", width: 16, height: 1.5, background: "#F6F1E7" }} />
                <span style={{ display: "block", width: 10, height: 1.5, background: "#F6F1E7" }} />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          )}

          <Link
            href="/"
            aria-label="Hallelujah Challenge, home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              color: "#F6F1E7",
              minHeight: 44,
            }}
          >
            <img
              src="/assets/hc-logo.png"
              alt="Hallelujah Challenge"
              width={217}
              height={90}
              style={{ height: 46, width: "auto", display: "block" }}
            />
          </Link>

          {!mobile && (
            <nav aria-label="Main" style={{ display: "flex", gap: 4, marginLeft: 12 }}>
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  aria-current={l.current}
                  className="hc-navlink"
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    minHeight: 44,
                    padding: "0 14px",
                    color: "#F6F1E7",
                    textDecoration: "none",
                    font: "500 15px/1 Geist,sans-serif",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  {l.label}
                  {l.active && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 14,
                        right: 14,
                        bottom: 6,
                        height: 1,
                        background: "#D4A64A",
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}

          <div style={{ flex: 1 }} />

          <a
            href="https://www.youtube.com/@NathanielBasseyMain/streams"
            target="_blank"
            rel="noopener"
            className="hc-pill-red"
            style={{
              whiteSpace: "nowrap",
              flex: "none",
              display: live ? "inline-flex" : "none",
              alignItems: "center",
              gap: 10,
              minHeight: 44,
              padding: "0 18px",
              borderRadius: 999,
              background: "#C62F2F",
              color: "#FFFFFF",
              font: "700 15px/1 Geist,sans-serif",
              textDecoration: "none",
              boxShadow: "0 0 0 4px rgba(198,47,47,.25)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FFFFFF",
                boxShadow: "0 0 0 3px rgba(255,255,255,.3)",
              }}
            />
            Live Now
          </a>

          <Link
            href="/give"
            className="hc-pill-gold"
            style={{
              whiteSpace: "nowrap",
              flex: "none",
              display: width >= 560 ? "inline-flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 44,
              padding: "0 24px",
              borderRadius: 999,
              background: "#D4A64A",
              color: "#0B0D17",
              font: "600 15px/1 Geist,sans-serif",
              textDecoration: "none",
              transition: "background 300ms ease-out",
            }}
          >
            Partnership/Giving
          </Link>
        </div>

        {menuOpen && (
          <div
            id="mobile-nav"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              padding: "12px 20px 32px",
              borderTop: "1px solid #262B40",
              minHeight: "calc(100vh - 72px)",
              background: "#0B0D17",
            }}
          >
            <nav aria-label="Main" style={{ display: "flex", flexDirection: "column" }}>
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  aria-current={l.current}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    minHeight: 64,
                    padding: "12px 0",
                    color: "#F6F1E7",
                    textDecoration: "none",
                    font: "300 36px/1.1 Geist,sans-serif",
                    borderBottom: "1px solid #262B40",
                  }}
                >
                  <span
                    style={{
                      font: "500 12px/1 Geist,sans-serif",
                      color: "#A9AEC2",
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
            <p
              style={{
                margin: 0,
                font: "500 12px/1 'Geist Mono',monospace",
                letterSpacing: ".06em",
                color: "#D4A64A",
              }}
            >
              Commencing at 11:59 PM
            </p>
          </div>
        )}
      </header>
    </div>
  );
}
