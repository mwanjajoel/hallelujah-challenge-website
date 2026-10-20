"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const H_MS = 8000;
const EASE = [0.2, 0.7, 0.2, 1] as const;

const LABELS = [
  "The Lord reigns",
  "A mountain of praise and worship",
  "Creating a world of Hallelujah",
  "Healed from back pain",
];

const HERO_POSTER =
  "https://static.wixstatic.com/media/e178bc_74952a632df64354bc7e4c52e9a97409f000.jpg/v1/fill/w_2560,h_1440,al_c,q_90,enc_auto/hc-hero-poster.jpg";

type MotionModule = typeof import("motion");

/**
 * The design hides inactive slides with `visibility` on a delayed transition.
 * That transitions an inherited property, and Chromium then leaves descendants
 * stuck at `hidden` when a slide is reactivated, so the incoming slide renders
 * blank. `inert` takes inactive slides out of hit-testing, focus and the
 * accessibility tree with no inherited transition, and the opacity crossfade
 * is unchanged.
 */
const slideStyle = (active: boolean): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  opacity: active ? 1 : 0,
  zIndex: active ? 2 : 1,
  transition: "opacity 900ms ease-out",
});

const PAD_WIDE = "clamp(48px,6cqw,80px) clamp(20px,5cqw,64px) clamp(170px,15cqw,200px)";

const bgLayer = (url: string): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  background: `#141829 url(${url}) center/cover no-repeat`,
});

const ctaGold: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  minHeight: 54,
  padding: "0 30px",
  borderRadius: 999,
  background: "#D4A64A",
  color: "#0B0D17",
  font: "600 16px/1 Geist,sans-serif",
  textDecoration: "none",
};

const lineWrap: React.CSSProperties = { display: "block", overflow: "hidden", paddingBottom: ".08em" };

/** Restarts the dwell timer for the current slide. */
const restartDwell = (ref: { current: number }) => {
  ref.current = Date.now();
};

/** Resumes after a hover, leaving at least two seconds on the clock. */
const resumeDwell = (ref: { current: number }) => {
  const elapsed = Date.now() - ref.current;
  ref.current = Date.now() - Math.min(H_MS - 2000, elapsed);
};

interface Props {
  live: boolean;
  hh: string;
  mm: string;
  ss: string;
  timerLabel: string;
  width: number;
  /** True while a video modal is open — the design holds the carousel then. */
  blocked: boolean;
}

export default function HeroSlider({ live, hh, mm, ss, timerLabel, width, blocked }: Props) {
  const [h, setH] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const motionRef = useRef<MotionModule | null>(null);
  const hT0 = useRef(0);
  const reduce = useRef(false);
  const pointerX = useRef<number | null>(null);

  const narrow = width < 760;
  const artBasis = narrow ? "100%" : "34%";
  const artMax = narrow ? "150px" : width < 1100 ? "300px" : "440px";
  const tabText = narrow ? "none" : "inline";

  const play = (v: HTMLVideoElement | null) => {
    if (!v) return;
    try {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } catch {
      /* autoplay refused */
    }
  };

  const enterSlide = useCallback((index: number, first: boolean) => {
    const M = motionRef.current;
    const root = heroRef.current;
    if (!M || !root) return;
    const s = root.querySelector<HTMLElement>(`[data-slide="${index}"]`);
    if (!s) return;

    const { animate, stagger } = M;
    const bg = s.querySelector<HTMLElement>("[data-bg]");
    if (bg) animate(bg, { transform: ["scale(1.06)", "scale(1)"] }, { duration: 7, ease: EASE });

    const lines = s.querySelectorAll<HTMLElement>("[data-line]");
    if (lines.length) {
      animate(
        lines,
        { transform: ["translateY(110%)", "translateY(0%)"] },
        { duration: 1.1, ease: EASE, delay: stagger(0.09, { startDelay: first ? 0.15 : 0.35 }) },
      );
    }

    const fades = s.querySelectorAll<HTMLElement>("[data-fade]");
    if (fades.length) {
      animate(
        fades,
        { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0px)"] },
        { duration: 0.7, ease: "easeOut", delay: stagger(0.08, { startDelay: first ? 0.45 : 0.6 }) },
      );
    }
  }, []);

  // Load the motion runtime and play the opening slide.
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hT0.current = Date.now();
    if (reduce.current || document.visibilityState !== "visible") return;

    let cancelled = false;
    import("motion")
      .then((m) => {
        if (cancelled) return;
        motionRef.current = m;
        enterSlide(0, true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enterSlide]);

  // Auto-advance, and the elapsed fraction that drives the tab progress bars.
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      if (!hold && !paused && !blocked && !reduce.current && now - hT0.current >= H_MS) {
        hT0.current = now;
        setH((p) => (p + 1) % 4);
        setElapsed(0);
      } else {
        setElapsed(Math.min(1, (now - hT0.current) / H_MS));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [hold, paused, blocked]);

  // Slide changes re-run the entrance animation and steer the hero video.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!reduce.current) enterSlide(h, false);
    const v = videoRef.current;
    if (!v) return;
    if (h === 0 && !paused) play(v);
    else v.pause();
  }, [h, paused, enterSlide]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else if (h === 0) play(v);
  }, [paused, h]);

  useEffect(() => {
    if (blocked) videoRef.current?.pause();
  }, [blocked]);

  const goTo = (i: number) => {
    setH(i);
    restartDwell(hT0);
    setElapsed(0);
  };
  const go = (d: number) => goTo((h + d + 4) % 4);

  const setVideo = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (!el) return;
    // React does not reliably emit the muted attribute, and Chrome blocks
    // autoplay without it.
    el.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try {
        el.pause();
      } catch {
        /* no-op */
      }
    }
  };

  return (
    <section
      ref={heroRef}
      aria-label="Hallelujah Challenge"
      aria-roledescription="carousel"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => {
        setHold(false);
        resumeDwell(hT0);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onPointerDown={(e) => {
        pointerX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (pointerX.current == null) return;
        const dx = e.clientX - pointerX.current;
        pointerX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
      style={{
        position: "relative",
        // clip, not hidden: the decorative glow below bleeds past the right
        // edge, and overflow:hidden would make the hero a scroll container
        // that jumps 144px whenever one of its controls takes focus.
        overflow: "clip",
        height: "clamp(720px,100svh,980px)",
        background: "#0B0D17",
        touchAction: "pan-y",
      }}
    >
      {/* ---------------------------------------------------------------- 01 */}
      <article data-slide="0" aria-roledescription="slide" aria-label={LABELS[0]} aria-hidden={h !== 0} inert={h !== 0} style={slideStyle(h === 0)}>
        <div
          data-bg=""
          style={{
            position: "absolute",
            inset: 0,
            background: `#0B0D17 url(${HERO_POSTER}) center/cover no-repeat`,
          }}
        >
          <video
            ref={setVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            poster={HERO_POSTER}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source
              src="https://video.wixstatic.com/video/e178bc_74952a632df64354bc7e4c52e9a97409/1080p/mp4/file.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(11,13,23,.94) 0%,rgba(11,13,23,.78) 45%,rgba(14,20,60,.55) 100%),linear-gradient(0deg,#0B0D17 0%,rgba(11,13,23,0) 40%)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-10%",
            top: "5%",
            width: "70%",
            height: "90%",
            background:
              "radial-gradient(closest-side,rgba(40,62,170,.55),rgba(40,62,170,.15) 55%,transparent 75%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(40px,5cqw,72px) clamp(20px,5cqw,64px) clamp(170px,15cqw,200px)",
            display: "flex",
            flexWrap: "wrap-reverse",
            alignItems: "center",
            alignContent: "center",
            gap: "clamp(16px,4cqw,64px)",
          }}
        >
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                maxWidth: "16ch",
                fontFamily: "Geist,sans-serif",
                fontSize: "clamp(30px,4.6cqw,64px)",
                lineHeight: 1.06,
                letterSpacing: "-.04em",
              }}
            >
              <span style={lineWrap}>
                <span data-line="" style={{ display: "block", fontWeight: 300 }}>
                  The Lord reigns,
                </span>
              </span>
              <span style={lineWrap}>
                <span data-line="" style={{ display: "block", fontWeight: 300 }}>
                  Let the peoples tremble!
                </span>
              </span>
              <span style={lineWrap}>
                <span data-line="" style={{ display: "block", fontWeight: 200, color: "#E9E3D6" }}>
                  He dwells between the cherubim -
                </span>
              </span>
              <span style={lineWrap}>
                <span data-line="" style={{ display: "block", fontWeight: 200, color: "#D4A64A" }}>
                  Let the earth be moved.....
                </span>
              </span>
            </h2>

            <div data-fade="" style={{ marginTop: "clamp(28px,3.6cqw,44px)" }}>
              <p
                style={{
                  margin: "0 0 14px",
                  font: "500 12px/1 'Geist Mono',monospace",
                  letterSpacing: ".08em",
                  color: "#A9AEC2",
                }}
              >
                Commencing at 11:59 PM
              </p>
              {!live && (
                <p
                  role="timer"
                  aria-label={timerLabel}
                  style={{
                    margin: 0,
                    font: "100 clamp(48px,7cqw,104px)/.9 Geist,sans-serif",
                    letterSpacing: "-.05em",
                    color: "#D4A64A",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {hh}
                  <span style={{ color: "rgba(212,166,74,.4)" }}>:</span>
                  {mm}
                  <span style={{ color: "rgba(212,166,74,.4)" }}>:</span>
                  {ss}
                </p>
              )}
              {live && (
                <a
                  href="https://www.youtube.com/@NathanielBasseyMain/streams"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    borderRadius: 6,
                    background: "#C62F2F",
                    color: "#FFFFFF",
                    font: "700 14px/1 Geist,sans-serif",
                    letterSpacing: ".02em",
                    textDecoration: "none",
                  }}
                >
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFFFFF" }} />
                  Watch Live
                </a>
              )}
            </div>

            <div data-fade="" style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 14 }}>
              <Link
                href="/watch"
                className="hc-pill-gold"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  minHeight: 54,
                  padding: "0 30px",
                  borderRadius: 999,
                  background: "#D4A64A",
                  color: "#0B0D17",
                  font: "600 16px/1 Geist,sans-serif",
                  textDecoration: "none",
                  transition: "background 300ms ease-out,box-shadow 500ms ease-out",
                }}
              >
                Watch Live <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#about"
                className="hc-pill-outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 54,
                  padding: "0 28px",
                  borderRadius: 999,
                  border: "1px solid rgba(246,241,231,.4)",
                  color: "#F6F1E7",
                  font: "500 16px/1 Geist,sans-serif",
                  textDecoration: "none",
                  backdropFilter: "blur(6px)",
                }}
              >
                About
              </a>
            </div>
          </div>

          <div data-fade="" style={{ flex: `0 1 ${artBasis}`, display: "flex", justifyContent: "center" }}>
            <img
              src="/assets/hc-theme-the-lord-reigns.png"
              alt="The Lord Reigns, October 2026 theme"
              width={654}
              height={626}
              style={{
                width: "100%",
                maxWidth: artMax,
                height: "auto",
                display: "block",
                filter:
                  "drop-shadow(0 30px 60px rgba(0,0,0,.55)) drop-shadow(0 0 40px rgba(60,90,220,.25))",
              }}
            />
          </div>
        </div>
      </article>

      {/* ---------------------------------------------------------------- 02 */}
      <article data-slide="1" aria-roledescription="slide" aria-label={LABELS[1]} aria-hidden={h !== 1} inert={h !== 1} style={slideStyle(h === 1)}>
        <div
          data-bg=""
          role="img"
          aria-label="Hallelujah Challenge gathering"
          style={bgLayer(
            "https://static.wixstatic.com/media/e178bc_9c4ea1afa58c4409a0e40740a4bc966b~mv2.jpg/v1/fill/w_2560,h_1440,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/DSC09945.jpg",
          )}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(11,13,23,.9) 0%,rgba(11,13,23,.6) 50%,rgba(11,13,23,.15) 100%),linear-gradient(0deg,#0B0D17 0%,rgba(11,13,23,0) 38%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: PAD_WIDE,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              maxWidth: "12ch",
              fontFamily: "Geist,sans-serif",
              fontSize: "clamp(44px,7.6cqw,104px)",
              lineHeight: 1.02,
              letterSpacing: "-.045em",
            }}
          >
            <span style={lineWrap}>
              <span data-line="" style={{ display: "block", fontWeight: 300 }}>
                A mountain of
              </span>
            </span>
            <span style={lineWrap}>
              <span data-line="" style={{ display: "block", fontWeight: 200, color: "#E9E3D6" }}>
                praise and worship
              </span>
            </span>
          </h2>
          <p
            data-fade=""
            style={{
              margin: "26px 0 0",
              maxWidth: "34em",
              color: "#C9CCD9",
              fontSize: "clamp(17px,1.6cqw,20px)",
              lineHeight: 1.6,
              textWrap: "pretty",
            }}
          >
            Hallelujah Challenge has become a mountain of high praises, fervent prayer, heartfelt worship,
            deliverance, breakthroughs, miracles, and signs.
          </p>
          <div data-fade="" style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a href="#about" className="hc-pill-gold" style={ctaGold}>
              About <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </article>

      {/* ---------------------------------------------------------------- 03 */}
      <article data-slide="2" aria-roledescription="slide" aria-label={LABELS[2]} aria-hidden={h !== 2} inert={h !== 2} style={slideStyle(h === 2)}>
        <div
          data-bg=""
          role="img"
          aria-label="Hallelujah Challenge gathering"
          style={bgLayer(
            "https://static.wixstatic.com/media/e178bc_5d0c5c6531da4fdeb0a5ac1ac3fd6ce5~mv2.jpg/v1/fill/w_2560,h_1440,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/DSC03192.jpg",
          )}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(11,13,23,.9) 0%,rgba(11,13,23,.6) 50%,rgba(11,13,23,.15) 100%),linear-gradient(0deg,#0B0D17 0%,rgba(11,13,23,0) 38%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: PAD_WIDE,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              maxWidth: "14ch",
              fontFamily: "Geist,sans-serif",
              fontSize: "clamp(40px,7cqw,96px)",
              lineHeight: 1.02,
              letterSpacing: "-.04em",
            }}
          >
            <span style={lineWrap}>
              <span data-line="" style={{ display: "block", fontWeight: 300 }}>
                Creating a world
              </span>
            </span>
            <span style={lineWrap}>
              <span data-line="" style={{ display: "block", fontWeight: 200, color: "#D4A64A" }}>
                of Hallelujah
              </span>
            </span>
          </h2>
          <p
            data-fade=""
            style={{
              margin: "26px 0 0",
              maxWidth: "34em",
              color: "#C9CCD9",
              fontSize: "clamp(17px,1.6cqw,20px)",
              lineHeight: 1.6,
              textWrap: "pretty",
            }}
          >
            We&rsquo;re grateful for the opportunity to make a difference and inspire lives worldwide through the
            grace of Jesus.
          </p>
          <div data-fade="" style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a href="#creating" className="hc-pill-gold" style={ctaGold}>
              More <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </article>

      {/* ---------------------------------------------------------------- 04 */}
      <article data-slide="3" aria-roledescription="slide" aria-label={LABELS[3]} aria-hidden={h !== 3} inert={h !== 3} style={slideStyle(h === 3)}>
        <div
          data-bg=""
          role="img"
          aria-label="Hallelujah Challenge gathering"
          style={bgLayer(
            "https://static.wixstatic.com/media/e178bc_d7e064dfa947410ba37c38e07e598a02~mv2.jpg/v1/fill/w_2560,h_1440,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/DSC00851.jpg",
          )}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(11,13,23,.92) 0%,rgba(30,18,24,.62) 55%,rgba(11,13,23,.2) 100%),linear-gradient(0deg,#0B0D17 0%,rgba(11,13,23,0) 38%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: PAD_WIDE,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            data-fade=""
            style={{
              margin: "0 0 28px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              font: "500 12px/1.4 'Geist Mono',monospace",
              letterSpacing: ".08em",
              color: "#F2C48A",
            }}
          >
            <span aria-hidden="true" style={{ width: 32, height: 1, background: "#F2C48A" }} />
            Healed from back pain
          </p>
          <h2
            style={{
              margin: 0,
              maxWidth: "13ch",
              fontFamily: "Geist,sans-serif",
              fontSize: "clamp(40px,7cqw,96px)",
              lineHeight: 1.04,
              letterSpacing: "-.04em",
            }}
          >
            <span style={lineWrap}>
              <span data-line="" style={{ display: "block", fontWeight: 300 }}>
                I reside in the USA,
              </span>
            </span>
            <span style={lineWrap}>
              <span data-line="" style={{ display: "block", fontWeight: 200, color: "#E9E3D6" }}>
                and God healed me.
              </span>
            </span>
          </h2>
          <p
            data-fade=""
            style={{
              margin: "26px 0 0",
              display: "flex",
              alignItems: "center",
              gap: 12,
              font: "600 15px/1 'Geist Mono',monospace",
              letterSpacing: ".1em",
              color: "#F6F1E7",
            }}
          >
            <span aria-hidden="true" style={{ width: 24, height: 1, background: "#F2C48A" }} />
            Olu
          </p>
          <div data-fade="" style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Link href="/testimonies" className="hc-pill-gold" style={ctaGold}>
              Read More Testimonies <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </article>

      {/* ------------------------------------------------------------ controls */}
      <div style={{ position: "absolute", zIndex: 5, left: 0, right: 0, bottom: 0 }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px,5cqw,64px) 28px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: "18px 28px",
          }}
        >
          <div
            role="tablist"
            aria-label="Slides"
            style={{
              flex: "1 1 420px",
              display: "grid",
              gridTemplateColumns: "repeat(4,minmax(0,1fr))",
              gap: 14,
            }}
          >
            {LABELS.map((label, i) => {
              const on = i === h;
              return (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-label={label}
                  onClick={() => goTo(i)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: 10,
                    minHeight: 52,
                    padding: "10px 0 0",
                    background: "transparent",
                    border: 0,
                    color: "#F6F1E7",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      display: "block",
                      height: 2,
                      background: "rgba(246,241,231,.22)",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: on ? `${Math.round(elapsed * 100)}%` : i < h ? "100%" : "0%",
                        background: "#D4A64A",
                        transition: on ? "width 1000ms linear" : "none",
                      }}
                    />
                  </span>
                  <span
                    style={{
                      display: "flex",
                      gap: 10,
                      font: "500 12px/1.25 'Geist Mono',monospace",
                      letterSpacing: ".03em",
                      color: on ? "#F6F1E7" : "#A9AEC2",
                    }}
                  >
                    <span>0{i + 1}</span>
                    <span style={{ display: tabText }}>{label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="hc-circle"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid #262B40",
                background: "rgba(20,24,41,.7)",
                color: "#F6F1E7",
                font: "400 16px/1 Geist,sans-serif",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="hc-circle"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid #262B40",
                background: "rgba(20,24,41,.7)",
                color: "#F6F1E7",
                font: "400 16px/1 Geist,sans-serif",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              →
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? "Play" : "Pause"}
              className="hc-circle-muted"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid #262B40",
                background: "rgba(20,24,41,.7)",
                color: "#F6F1E7",
                font: "400 11px/1 Geist,sans-serif",
                letterSpacing: "1px",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              {paused ? "▶" : "❚❚"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
