"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { countdown, session } from "@/lib/session";
import { useNow, useSessionMode } from "@/lib/useSessionClock";

/**
 * Appears once the hero has scrolled away.
 *
 * Showing it immediately put a second countdown directly beneath the hero's
 * own, which read as a duplicate rather than a convenience — most obviously on
 * a phone, where the two sat together on the first screen.
 */
function useShowAfterHero() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const check = () => setShown(window.scrollY > window.innerHeight * 0.65);
    const raf = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
    };
  }, []);

  return shown;
}

/**
 * The persistent bar along the bottom of every page.
 *
 * It answers the one question every visitor arrives with — when is tonight's
 * session — without them having to scroll back to the hero. It lives outside
 * `<main>` because `<main>` carries `container-type: inline-size`, which would
 * make it the containing block for anything fixed inside it.
 */
export default function StickyBar() {
  const now = useNow();
  const mode = useSessionMode();
  const shown = useShowAfterHero();

  const { live, rem, scheduled } =
    now === null ? { live: false, rem: 0, scheduled: true } : session(now, mode);
  const { hh, mm, ss } = now === null ? { hh: "--", mm: "--", ss: "--" } : countdown(rem);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60,
        display: "flex",
        justifyContent: "center",
        padding: "0 var(--gutter) clamp(14px, 2vw, 24px)",
        pointerEvents: "none",
      }}
    >
      <div
        className="hc-t"
        // inert rather than a visibility transition: transitioning an
        // inherited property leaves descendants stale in Chromium, which is
        // what blanked the hero slides before they were reworked.
        inert={!shown}
        style={{
          pointerEvents: shown ? "auto" : "none",
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(14px)",
          transition: "opacity var(--d-enter) var(--ease), transform var(--d-transform) var(--ease)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(12px, 2vw, 22px)",
          padding: "9px 9px 9px 22px",
          borderRadius: "var(--r-pill)",
          background: "var(--glass)",
          border: "1px solid var(--hairline)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 18px 50px -20px rgba(0,0,0,.8)",
          maxWidth: "100%",
        }}
      >
        {live ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              font: "500 12px/1 var(--font-mono)",
              letterSpacing: ".08em",
              color: "var(--fg)",
              whiteSpace: "nowrap",
            }}
          >
            <span
              className="hc-breathe"
              aria-hidden="true"
              style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--live)" }}
            />
            ON AIR NOW
          </span>
        ) : !scheduled ? (
          /* Between editions. The bar still belongs here — the replays are
             worth the trip — but it cannot promise a session tonight. */
          <span
            style={{
              font: "500 12px/1 var(--font-mono)",
              letterSpacing: ".08em",
              color: "var(--fg-muted)",
              whiteSpace: "nowrap",
            }}
          >
            BETWEEN EDITIONS
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: 10,
              font: "500 12px/1 var(--font-mono)",
              letterSpacing: ".08em",
              color: "var(--fg-muted)",
              whiteSpace: "nowrap",
            }}
          >
            <span className="hc-hide-sm">TONIGHT AT 11:59 PM</span>
            <span
              suppressHydrationWarning
              style={{
                font: "500 14px/1 var(--font-mono)",
                color: "var(--accent)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: ".02em",
              }}
            >
              {hh}:{mm}:{ss}
            </span>
          </span>
        )}

        <Link
          href="/watch"
          className="hc-t hc-pill-gold"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            minHeight: 42,
            padding: "0 20px",
            borderRadius: "var(--r-pill)",
            background: live ? "var(--live)" : "var(--accent)",
            color: live ? "#fff" : "var(--bg)",
            font: "600 14px/1 var(--font-sans)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {scheduled ? "Watch live" : "Watch replays"}
        </Link>
      </div>
    </div>
  );
}
