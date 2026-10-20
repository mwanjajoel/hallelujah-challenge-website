"use client";

import { useCallback } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import Display, { Accent } from "@/components/ui/Display";

const POSTER =
  "https://static.wixstatic.com/media/e178bc_74952a632df64354bc7e4c52e9a97409f000.jpg/v1/fill/w_2560,h_1440,al_c,q_90,enc_auto/hc-hero-poster.jpg";
const VIDEO = "https://video.wixstatic.com/video/e178bc_74952a632df64354bc7e4c52e9a97409/1080p/mp4/file.mp4";

interface Props {
  live: boolean;
  hh: string;
  mm: string;
  ss: string;
  timerLabel: string;
}

/**
 * The hero.
 *
 * This replaces the four-slide carousel the original design carried. Three of
 * its four slides repeated sections that appear further down the page, so the
 * carousel was asking visitors to wait through content they were about to
 * scroll past. What is left is the one thing only the hero can say: the theme,
 * the verse behind it, and when tonight's session begins.
 */
export default function Hero({ live, hh, mm, ss, timerLabel }: Props) {
  const setVideo = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    // React does not reliably emit the muted attribute, and Chrome blocks
    // autoplay without it.
    el.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try {
        el.pause();
      } catch {
        /* nothing to do */
      }
      return;
    }
    const p = el.play();
    if (p && p.catch) p.catch(() => {});
  }, []);

  return (
    <section
      aria-label="Hallelujah Challenge"
      className="hc-on-dark"
      style={{
        position: "relative",
        overflow: "clip",
        minHeight: "min(94svh, 940px)",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "clamp(56px, 8vw, 110px) var(--gutter) clamp(72px, 10vw, 130px)",
      }}
    >
      {/* Backdrop: footage, then enough gradient to keep text legible. */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `#0B0D17 url(${POSTER}) center/cover no-repeat` }}>
        <video
          ref={setVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(70% 60% at 50% 42%, rgba(11,13,23,.55), rgba(11,13,23,.92) 72%), linear-gradient(180deg, rgba(11,13,23,.92), rgba(11,13,23,.55) 42%, var(--bg) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="hc-drift"
        style={{
          position: "absolute",
          inset: "-10% -20% 20%",
          background: "radial-gradient(45% 45% at 62% 30%, var(--glow-blue), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(20px, 2.6vw, 34px)",
          maxWidth: "var(--col-wide)",
        }}
      >
        <p
          className="hc-reveal"
          data-in="true"
          style={{
            margin: 0,
            font: "500 12px/1 var(--font-mono)",
            letterSpacing: ".14em",
            color: "var(--accent)",
          }}
        >
          OCTOBER 2026 EDITION
        </p>

        {/* The theme artwork carries the "The Lord reigns" line, so the
            headline beneath it continues the verse rather than repeating it. */}
        <img
          src="/assets/hc-theme-the-lord-reigns.png"
          alt="The Lord Reigns — October 2026 theme"
          width={654}
          height={626}
          className="hc-float"
          style={{
            width: "clamp(190px, 26vw, 360px)",
            height: "auto",
            display: "block",
            filter: "drop-shadow(0 30px 70px rgba(0,0,0,.6)) drop-shadow(0 0 60px rgba(60,90,220,.25))",
          }}
        />

        <Display as="h1" size="hero" style={{ maxWidth: "15ch" }}>
          Let the peoples <Accent gold>tremble</Accent>
        </Display>

        <p
          style={{
            margin: 0,
            maxWidth: "46ch",
            font: "400 clamp(17px, 1.5vw, 21px)/1.6 var(--font-sans)",
            color: "var(--fg-dim)",
            textWrap: "pretty",
          }}
        >
          He dwells between the cherubim — let the earth be moved. An hour of praise unto the Lord, every night at
          11:59 PM.
        </p>

        {/* Countdown, or the live badge once the session is on air. */}
        {live ? (
          <p
            role="status"
            style={{
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 22px",
              borderRadius: "var(--r-pill)",
              background: "var(--live)",
              color: "#fff",
              font: "700 15px/1 var(--font-sans)",
              letterSpacing: ".02em",
            }}
          >
            <span
              className="hc-breathe"
              aria-hidden="true"
              style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff" }}
            />
            On air now
          </p>
        ) : (
          <p
            role="timer"
            aria-label={timerLabel}
            suppressHydrationWarning
            style={{
              margin: 0,
              font: "400 clamp(44px, 7.5vw, 104px)/0.9 var(--font-display)",
              letterSpacing: "-0.03em",
              color: "var(--accent)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {hh}
            <span style={{ color: "rgba(212,166,74,.35)" }}>:</span>
            {mm}
            <span style={{ color: "rgba(212,166,74,.35)" }}>:</span>
            {ss}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          <ArrowLink href="/watch" variant="gold">
            Watch live
          </ArrowLink>
          <ArrowLink href="#about" variant="outline">
            About the Challenge
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
