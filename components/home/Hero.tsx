"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import Display, { Accent } from "@/components/ui/Display";

/* w_1600, not w_2560. It is a backdrop behind a scrim, and the larger crop was
   being fetched in full on a phone. */
const POSTER =
  "https://static.wixstatic.com/media/e178bc_74952a632df64354bc7e4c52e9a97409f000.jpg/v1/fill/w_1600,h_900,al_c,q_85,enc_auto/hc-hero-poster.jpg";
/* 480p, not 1080p. The footage plays behind the hero scrim at well under half
   opacity and is decorative; 1080p cost 2.28 MB against 469 MB-free kilobytes
   here, and it was the heaviest thing on the page by a factor of sixteen. */
const VIDEO = "https://video.wixstatic.com/video/e178bc_74952a632df64354bc7e4c52e9a97409/480p/mp4/file.mp4";

const W = "https://static.wixstatic.com/media/";
const FILL = "/v1/fill/w_2048,h_1152,al_c,q_85,enc_auto/";
/* The auditorium frame is a native 1920x1080 on the live site, so it is
   served at its own size rather than upscaled into the common fill. */
const FILL_HD = "/v1/fill/w_1920,h_1080,al_c,q_85,enc_auto/";

/**
 * The backdrop cycle. The opening frame is the footage; the rest are stills
 * from the gatherings. Each carries a description because the slide controls
 * name them — the images themselves are decorative behind the headline.
 *
 * Frames with words in them are not used here. A stage screen reading
 * "CONGRATULATIONS" sat in this cycle and competed with the headline set over
 * it, which is a fight the backdrop should never pick.
 */
const SLIDES: Array<{ label: string; image: string; video?: boolean }> = [
  { label: "Tonight's session", image: POSTER, video: true },
  {
    label: "A full auditorium",
    image: W + "e178bc_055d0eb7cb824141a2061fbdf61afdbff000.jpg" + FILL_HD + "hc-auditorium.jpg",
  },
  { label: "Hands raised in praise", image: W + "e178bc_afe198aca8994dec8029d557b7c47a6c~mv2.jpg" + FILL + "DSC03171.jpg" },
  { label: "The Festival", image: W + "e178bc_c8afc65f02014fd985ef729ac3fd673df000.jpg" + FILL + "hc-creating.jpg" },
  { label: "Worship through the night", image: W + "e178bc_5d0c5c6531da4fdeb0a5ac1ac3fd6ce5~mv2.jpg" + FILL + "DSC03192.jpg" },
];

const SLIDE_MS = 6500;

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
  // The outgoing slide is tracked as well as the incoming one. A plain
  // crossfade — one layer to 0 while another comes up from 0 — leaves both
  // part-way at the midpoint, so the page colour shows between them and the
  // photography visibly pales for a second of every cycle. Holding the
  // outgoing frame opaque underneath and bringing the new one up on top of it
  // means there is never a gap for the background to come through.
  const [[prev, slide], setPair] = useState<[number, number]>([0, 0]);
  // The footage waits for an idle moment. It is the heaviest thing the hero
  // loads, and the first slide already shows its poster frame, so there is
  // nothing to look at in the meantime and nothing to gain from racing it
  // against the largest paint.
  const [settled, setSettled] = useState(false);
  const paused = useRef(false);
  const reduced = useRef(false);

  // Opacity only: transitioning visibility leaves descendants stale in
  // Chromium, which is what blanked the original carousel on this page.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;
    const id = setInterval(() => {
      if (!paused.current) setPair(([, cur]) => [cur, (cur + 1) % SLIDES.length]);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const idle = () => setSettled(true);
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(idle, { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(idle, 2500);
    return () => clearTimeout(t);
  }, []);

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

  // All five backdrops used to carry a background-image from the first render,
  // so the page opened five requests to a third-party CDN before it had
  // painted anything, for four pictures nobody could see yet. Only the slide
  // on screen, the one fading out and the one up next are fetched; the next
  // one is included so it is decoded before it has to appear. Derived rather
  // than remembered, which keeps it honest when the dots jump around, and the
  // browser cache makes coming back to a slide free.
  const wanted = [prev, slide, (slide + 1) % SLIDES.length];

  return (
    <section
      aria-label="Hallelujah Challenge"
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
      {/* The first backdrop is the largest contentful paint on this page, and
          it is a CSS background rather than an <img>, which the preload
          scanner does not look inside. Without this link the browser only
          discovered it after the stylesheet and layout: load delay measured
          3690 ms, 58% of LCP, for a 28 KB image. With it, load delay is
          168 ms. React hoists the link into the head. */}
      <link rel="preload" as="image" href={SLIDES[0].image} fetchPriority="high" />

      {/* Backdrop: a crossfading stack, then enough gradient to keep text
          legible. The footage is the first frame of the cycle. */}
      <div
        aria-hidden="true"
        // isolate: the layers below stack against each other so the incoming
        // frame covers the outgoing one. Without a stacking context here that
        // ordering escapes to the root and the backdrop paints over the
        // headline instead.
        style={{ position: "absolute", inset: 0, background: "var(--hero-bg)", isolation: "isolate" }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            style={{
              position: "absolute",
              inset: 0,
              background: wanted.includes(i) ? `url(${s.image}) center/cover no-repeat` : undefined,
              // The outgoing frame stays opaque but drops below the incoming
              // one, so the fade happens over a picture rather than over the
              // page.
              zIndex: i === slide ? 2 : i === prev ? 1 : 0,
              opacity: i === slide || i === prev ? "var(--hero-video)" : 0,
              transform: i === slide ? "scale(1.04)" : "scale(1)",
              transition: `opacity 1.6s var(--ease), transform ${SLIDE_MS + 1600}ms linear`,
            }}
          >
            {s.video && settled && (
              <video
                ref={setVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster={POSTER}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              >
                <source src={VIDEO} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--hero-scrim), var(--hero-base)",
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
        {/* The one eyebrow on the site that sits on photography rather than
            on the page, and the lightened veil no longer carries it. Gold on
            12px mono needs a surface of its own, so it borrows the glass the
            cards use — which already flips with the theme. */}
        <p
          className="hc-reveal"
          data-in="true"
          style={{
            margin: 0,
            padding: "8px 16px",
            borderRadius: "var(--r-pill)",
            background: "var(--glass)",
            border: "1px solid var(--hairline)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            font: "500 12px/1 var(--font-mono)",
            letterSpacing: ".14em",
            color: "var(--accent)",
          }}
        >
          OCTOBER 2026 EDITION
        </p>

        {/* The theme artwork carries the "The Lord reigns" line, so the
            headline beneath it continues the verse rather than repeating it. */}
        {/* This is the largest contentful paint on the home page, so its weight
            is the metric. It was a 1308x1252 lossless PNG at 912 KB, laid out
            at 360 CSS px or less — about twice the pixels it can ever show.
            720x689 WebP with alpha is 90 KB and identical on screen. The PNG
            stays in the repository as the source of record and is excluded
            from the deploy by public/.assetsignore. */}
        <img
          src="/assets/hc-theme-the-lord-reigns.webp"
          alt="The Lord Reigns — October 2026 theme"
          width={720}
          height={689}
          className="hc-float"
          style={{
            width: "clamp(190px, 26vw, 360px)",
            height: "auto",
            display: "block",
            filter: "var(--hero-art-shadow)",
          }}
        />

        <Display as="h1" size="hero" className="hc-hero-type" style={{ maxWidth: "17ch" }}>
          The Lord reigns, Let the peoples <Accent gold>tremble!</Accent>
        </Display>

        <p
          className="hc-hero-type"
          style={{
            margin: 0,
            maxWidth: "46ch",
            font: "400 clamp(17px, 1.5vw, 21px)/1.6 var(--font-sans)",
            /* Full ink rather than --fg-dim: the dimmed tone is calibrated
               for the page, and this line sits on photography. */
            color: "var(--fg)",
            textWrap: "pretty",
          }}
        >
          He dwells between the cherubim - Let the earth be moved.....
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
            className="hc-hero-type"
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

        {/* Slide controls. The images behind the headline are decorative, but
            the controls are not, so each is named and focusable. */}
        <div
          role="tablist"
          aria-label="Backdrop images"
          style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}
          onMouseEnter={() => {
            paused.current = true;
          }}
          onMouseLeave={() => {
            paused.current = false;
          }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.image}
              type="button"
              role="tab"
              aria-selected={i === slide}
              aria-label={s.label}
              title={s.label}
              onClick={() => setPair(([, cur]) => (cur === i ? [cur, cur] : [cur, i]))}
              className="hc-t"
              style={{
                width: i === slide ? 30 : 9,
                height: 9,
                padding: 0,
                borderRadius: "var(--r-pill)",
                border: 0,
                cursor: "pointer",
                background: i === slide ? "var(--accent-fill)" : "var(--hairline-strong)",
                transition: "width var(--d-hover) var(--ease), background-color var(--d-hover) var(--ease)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
