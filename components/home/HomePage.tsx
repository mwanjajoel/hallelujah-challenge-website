"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { mount as mountShader, type ShaderHandle } from "@/lib/hcShader";
import { countdown, session } from "@/lib/session";
import { useNow, useSessionMode } from "@/lib/useSessionClock";
import { useElementWidth } from "@/lib/useElementWidth";
import HeroSlider from "./HeroSlider";
import VideoModal from "./VideoModal";
import { type OpenVideo, VIDS, videoTitle } from "./videos";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const GALLERY = [
  "https://static.wixstatic.com/media/e178bc_9c4ea1afa58c4409a0e40740a4bc966b~mv2.jpg/v1/fill/w_1400,h_1100,al_c,q_90,enc_auto/DSC09945.jpg",
  "https://static.wixstatic.com/media/e178bc_d7e064dfa947410ba37c38e07e598a02~mv2.jpg/v1/fill/w_800,h_560,al_c,q_90,enc_auto/DSC00851.jpg",
  "https://static.wixstatic.com/media/e178bc_715f49ff8b114ba49e5c51355943bb4d~mv2.jpg/v1/fill/w_800,h_1100,al_c,q_90,enc_auto/DSC03162.jpg",
  "https://static.wixstatic.com/media/e178bc_5d0c5c6531da4fdeb0a5ac1ac3fd6ce5~mv2.jpg/v1/fill/w_800,h_560,al_c,q_90,enc_auto/DSC03192.jpg",
  "https://static.wixstatic.com/media/e178bc_afe198aca8994dec8029d557b7c47a6c~mv2.jpg/v1/fill/w_1400,h_560,al_c,q_90,enc_auto/DSC03171.jpg",
  "https://static.wixstatic.com/media/e178bc_088a3b49f0fa4f8788f131d629f28f9f~mv2.jpeg/v1/fill/w_800,h_560,al_c,q_90,enc_auto/hc-feb-2026-day-1.jpeg",
];

const tile = (url: string): React.CSSProperties => ({
  width: "100%",
  height: "100%",
  background: `#141829 url(${url}) center/cover no-repeat`,
  transition: "transform 900ms cubic-bezier(.2,.7,.2,1)",
});

const pill = (url: string, width: number): React.CSSProperties => ({
  display: "inline-block",
  verticalAlign: "middle",
  width,
  height: ".82em",
  margin: "0 .1em",
  borderRadius: 999,
  background: `#262B40 url(${url}) center/cover no-repeat`,
});

export default function HomePage() {
  const [rootWidth, rootRef] = useElementWidth();
  const [video, setVideo] = useState<OpenVideo | null>(null);
  const now = useNow();
  const mode = useSessionMode();

  const rootEl = useRef<HTMLDivElement | null>(null);
  const storyVideoIo = useRef<IntersectionObserver | null>(null);
  const shader = useRef<ShaderHandle | null>(null);

  const { live, rem } = now === null ? { live: false, rem: 0 } : session(now, mode);
  const { hh, mm, ss } = now === null ? { hh: "--", mm: "--", ss: "--" } : countdown(rem);
  const timerLabel = now === null ? "Countdown to tonight's session" : `${+hh} hours, ${+mm} minutes`;

  // --- scroll-reveal motion ------------------------------------------------
  const setRoot = useCallback(
    (el: HTMLDivElement | null) => {
      rootRef(el);
      rootEl.current = el;
    },
    [rootRef],
  );

  useEffect(() => {
    const el = rootEl.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.visibilityState !== "visible") return;

    let cancelled = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;

    import("motion")
      .then(({ animate, inView }) => {
        if (cancelled) return;

        el.querySelectorAll<HTMLElement>("main [data-reveal]").forEach((n) => {
          if (n.getBoundingClientRect().top < window.innerHeight * 0.9) return;
          n.style.opacity = "0";
          n.style.transform = "translateY(24px)";
          inView(
            n,
            () => {
              animate(n, { opacity: 1, transform: "translateY(0px)" }, { duration: 0.8, ease: EASE });
            },
            { amount: 0.12 },
          );
        });

        el.querySelectorAll<HTMLElement>("[data-pill]").forEach((p, k) => {
          const w = p.style.width;
          p.dataset.w = w;
          p.style.width = "0px";
          inView(
            p,
            () => {
              animate(p, { width: w }, { duration: 1, ease: EASE, delay: 0.15 + k * 0.12 });
            },
            { amount: 0.5 },
          );
        });

        // Safety net: if inView never fires, show everything anyway.
        fallback = setTimeout(() => {
          el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((n) => {
            if (n.style.opacity === "0") {
              n.style.opacity = "1";
              n.style.transform = "none";
            }
          });
          el.querySelectorAll<HTMLElement>("[data-pill]").forEach((p) => {
            if (p.dataset.w && p.style.width === "0px") p.style.width = p.dataset.w;
          });
        }, 12000);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, []);

  // --- the "creating a world" story video plays only while in view ---------
  const storyVideoRef = useCallback((el: HTMLVideoElement | null) => {
    storyVideoIo.current?.disconnect();
    storyVideoIo.current = null;
    if (!el) return;
    el.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const p = el.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    storyVideoIo.current = io;
  }, []);

  useEffect(() => () => storyVideoIo.current?.disconnect(), []);

  // --- the testimony section's WebGL dawn ----------------------------------
  const dawnCanvasRef = useCallback((el: HTMLCanvasElement | null) => {
    shader.current?.destroy();
    shader.current = null;
    if (!el) return;
    shader.current = mountShader(el, "dawn", { godrays: false, stars: 0, rays: 0.35 });
  }, []);

  useEffect(() => () => shader.current?.destroy(), []);

  const span2 = rootWidth >= 900 ? "span 2" : "auto";

  const videos = VIDS.slice()
    .reverse()
    .map(([id, day]) => ({
      id,
      day,
      yt: `https://www.youtube.com/watch?v=${id}`,
      img: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      title: videoTitle(day),
    }));

  return (
    <div
      ref={setRoot}
      style={{
        background: "#0B0D17",
        color: "#F6F1E7",
        fontFamily: "Geist,system-ui,sans-serif",
        fontSize: "clamp(16px,1.5cqw,18px)",
        lineHeight: 1.6,
        minHeight: "100vh",
      }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 50, display: "block" }}>
        <SiteHeader active="home" live={live} />
      </div>

      <main style={{ containerType: "inline-size" }}>
        <h1 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Hallelujah Challenge
        </h1>

        <HeroSlider
          live={live}
          hh={hh}
          mm={mm}
          ss={ss}
          timerLabel={timerLabel}
          width={rootWidth}
          blocked={video !== null}
        />

        {/* ---------------------------------------------------------- ABOUT */}
        <section id="about" aria-label="About" style={{ position: "relative", overflow: "clip" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-20%",
              top: "-10%",
              width: "70%",
              height: "80%",
              background: "radial-gradient(closest-side,rgba(40,62,170,.22),transparent 70%)",
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: 1280,
              margin: "0 auto",
              padding: "clamp(96px,12cqw,160px) clamp(20px,5cqw,64px) clamp(72px,9cqw,120px)",
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(40px,6cqw,96px)",
            }}
          >
            <div
              data-reveal=""
              style={{
                flex: "1 1 280px",
                maxWidth: 420,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <img
                src="/assets/hc-theme-the-lord-reigns.png"
                alt=""
                aria-hidden="true"
                width={654}
                height={626}
                loading="lazy"
                style={{
                  width: 160,
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 16px 30px rgba(0,0,0,.5))",
                }}
              />
              <p style={{ margin: 0, font: "400 17px/1.7 Geist,sans-serif", color: "#A9AEC2", textWrap: "pretty" }}>
                Hallelujah Challenge is an hour-long online praise program unto the Lord. The sessions of praise are
                held daily during designated periods every year, as God leads the convener, Pastor Nathaniel Bassey.
                Commencing at 11:59 PM, it features sessions of passionate praise and prayer.
              </p>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 44,
                  font: "500 16px/1 Geist,sans-serif",
                  textUnderlineOffset: 5,
                }}
              >
                About →
              </a>
            </div>

            <p
              data-reveal=""
              style={{
                flex: "2 1 520px",
                margin: 0,
                font: "300 clamp(32px,4.6cqw,62px)/1.2 Geist,sans-serif",
                letterSpacing: "-.035em",
                color: "#F6F1E7",
              }}
            >
              Hallelujah Challenge has become a mountain of high praises,{" "}
              <span
                data-pill=""
                role="img"
                aria-label="Hallelujah Challenge gathering"
                style={pill(
                  "https://static.wixstatic.com/media/e178bc_afe198aca8994dec8029d557b7c47a6c~mv2.jpg/v1/fill/w_480,h_160,al_c,q_90,enc_auto/DSC03171.jpg",
                  160,
                )}
              />{" "}
              <span style={{ fontWeight: 200, color: "#E9E3D6" }}>fervent prayer, heartfelt worship,</span>{" "}
              <span
                data-pill=""
                role="img"
                aria-label="Hallelujah Challenge gathering"
                style={pill(
                  "https://static.wixstatic.com/media/e178bc_715f49ff8b114ba49e5c51355943bb4d~mv2.jpg/v1/fill/w_560,h_160,al_c,q_90,enc_auto/DSC03162.jpg",
                  190,
                )}
              />{" "}
              deliverance, breakthroughs, miracles,{" "}
              <span
                data-pill=""
                role="img"
                aria-label="Hallelujah Challenge gathering"
                style={pill(
                  "https://static.wixstatic.com/media/e178bc_088a3b49f0fa4f8788f131d629f28f9f~mv2.jpeg/v1/fill/w_400,h_160,al_c,q_90,enc_auto/hc-feb-2026-day-1.jpeg",
                  130,
                )}
              />{" "}
              <span style={{ color: "#D4A64A" }}>and signs.</span>
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------- GALLERY */}
        <section aria-labelledby="mountain-h" style={{ padding: "0 0 clamp(96px,12cqw,152px)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5cqw,64px)" }}>
            <h2
              id="mountain-h"
              data-reveal=""
              style={{
                margin: "0 0 clamp(32px,4cqw,56px)",
                paddingTop: "clamp(40px,5cqw,64px)",
                borderTop: "1px solid #262B40",
                font: "300 clamp(44px,8.4cqw,132px)/.98 Geist,sans-serif",
                letterSpacing: "-.055em",
              }}
            >
              A mountain of praise <span style={{ fontWeight: 100, color: "#D4A64A" }}>and worship</span>
            </h2>
            <div
              data-reveal=""
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))",
                gridAutoRows: "clamp(180px,20cqw,260px)",
                gridAutoFlow: "dense",
                gap: 12,
              }}
            >
              <div
                className="hc-zoom-host"
                style={{ gridColumn: span2, gridRow: "span 2", borderRadius: 18, overflow: "hidden" }}
              >
                <div className="hc-zoom" role="img" aria-label="Hallelujah Challenge gathering" style={tile(GALLERY[0])} />
              </div>
              <div className="hc-zoom-host" style={{ borderRadius: 18, overflow: "hidden" }}>
                <div className="hc-zoom" role="img" aria-label="Hallelujah Challenge gathering" style={tile(GALLERY[1])} />
              </div>
              <div className="hc-zoom-host" style={{ gridRow: "span 2", borderRadius: 18, overflow: "hidden" }}>
                <div className="hc-zoom" role="img" aria-label="Hallelujah Challenge gathering" style={tile(GALLERY[2])} />
              </div>
              <div className="hc-zoom-host" style={{ borderRadius: 18, overflow: "hidden" }}>
                <div className="hc-zoom" role="img" aria-label="Hallelujah Challenge gathering" style={tile(GALLERY[3])} />
              </div>
              <div className="hc-zoom-host" style={{ gridColumn: span2, borderRadius: 18, overflow: "hidden" }}>
                <div className="hc-zoom" role="img" aria-label="Hallelujah Challenge gathering" style={tile(GALLERY[4])} />
              </div>
              <div className="hc-zoom-host" style={{ borderRadius: 18, overflow: "hidden" }}>
                <div className="hc-zoom" role="img" aria-label="HC Feb 2026 Day 1" style={tile(GALLERY[5])} />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- CREATING */}
        <section
          id="creating"
          aria-labelledby="creating-h"
          style={{ background: "linear-gradient(180deg,#0B0D17 0%,#0e1330 50%,#0B0D17 100%)" }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "clamp(96px,12cqw,152px) clamp(20px,5cqw,64px)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "clamp(40px,6cqw,96px)",
            }}
          >
            <div
              data-reveal=""
              style={{
                flex: "1 1 380px",
                position: "relative",
                aspectRatio: "520/436",
                borderRadius: "999px 999px 22px 22px",
                overflow: "hidden",
                border: "1px solid rgba(212,166,74,.35)",
                background:
                  "#141829 url(https://static.wixstatic.com/media/e178bc_c8afc65f02014fd985ef729ac3fd673df000.jpg/v1/fill/w_1560,h_1308,al_c,q_90,enc_auto/hc-creating.jpg) center/cover no-repeat",
              }}
            >
              <video
                ref={storyVideoRef}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                poster="https://static.wixstatic.com/media/e178bc_c8afc65f02014fd985ef729ac3fd673df000.jpg/v1/fill/w_1560,h_1308,al_c,q_90,enc_auto/hc-creating.jpg"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              >
                <source
                  src="https://video.wixstatic.com/video/e178bc_c8afc65f02014fd985ef729ac3fd673d/1080p/mp4/file.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <div data-reveal="" style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 28 }}>
              <h2
                id="creating-h"
                style={{ margin: 0, font: "300 clamp(40px,5.6cqw,80px)/1 Geist,sans-serif", letterSpacing: "-.045em" }}
              >
                CREATING A WORLD{" "}
                <span style={{ display: "block", fontWeight: 100, color: "#D4A64A" }}>OF HALLELUJAH</span>
              </h2>
              <p
                style={{
                  margin: 0,
                  maxWidth: "30em",
                  font: "400 clamp(18px,1.7cqw,21px)/1.6 Geist,sans-serif",
                  color: "#C9CCD9",
                }}
              >
                We&rsquo;re grateful for the opportunity to make a difference and inspire lives worldwide through the
                grace of Jesus.
              </p>
              <a
                href="#"
                className="hc-pill-outline-gold"
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  minHeight: 52,
                  padding: "0 28px",
                  borderRadius: 999,
                  border: "1px solid rgba(246,241,231,.4)",
                  color: "#F6F1E7",
                  font: "500 16px/1 Geist,sans-serif",
                  textDecoration: "none",
                }}
              >
                More <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ TESTIMONY */}
        <section
          id="testimonies"
          aria-labelledby="test-h"
          style={{ position: "relative", overflow: "clip", background: "#100e1f" }}
        >
          <canvas
            ref={dawnCanvasRef}
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg,#0B0D17 0%,rgba(11,13,23,0) 30%)",
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: 1100,
              margin: "0 auto",
              padding: "clamp(104px,13cqw,168px) clamp(20px,5cqw,64px) clamp(96px,12cqw,152px)",
            }}
          >
            <figure data-reveal="" style={{ margin: 0, display: "flex", flexDirection: "column", gap: 32 }}>
              <p
                id="test-h"
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  font: "500 13px/1.4 'Geist Mono',monospace",
                  letterSpacing: ".08em",
                  color: "#F2C48A",
                }}
              >
                <span aria-hidden="true" style={{ width: 32, height: 1, background: "#F2C48A" }} />
                HEALED FROM BACK PAIN
              </p>
              <blockquote
                style={{
                  margin: 0,
                  font: "300 clamp(24px,2.7cqw,38px)/1.4 Geist,sans-serif",
                  letterSpacing: "-.02em",
                  color: "#FBF8F2",
                  textWrap: "pretty",
                  textShadow: "0 2px 30px rgba(11,13,23,.5)",
                }}
              >
                I stumbled on the program during the HC in October 2023 while in back pain. I joined, and Pastor
                Nathaniel kept saying God was healing lower back pain. I knew and believed it was me because God led me
                to HC. <span style={{ color: "#F2C48A", fontWeight: 400 }}>I reside in the USA, and God healed me.</span>{" "}
                He has enabled me to join even the February edition and the Perfected Praise I saw on the first day, and
                I believe unprecedented marvels will manifest in my life. Thanks for honoring the call and your humble
                dedication.
              </blockquote>
              <figcaption
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  font: "600 15px/1 'Geist Mono',monospace",
                  letterSpacing: ".12em",
                  color: "#FBF8F2",
                }}
              >
                <span aria-hidden="true" style={{ width: 32, height: 1, background: "#F2C48A" }} />
                OLU
              </figcaption>
            </figure>
            <div data-reveal="" style={{ marginTop: 48 }}>
              <Link
                href="/testimonies"
                className="hc-pill-cream"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  minHeight: 54,
                  padding: "0 28px",
                  borderRadius: 999,
                  background: "#FBF8F2",
                  color: "#141829",
                  font: "600 16px/1 Geist,sans-serif",
                  textDecoration: "none",
                }}
              >
                Read More Testimonies <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- WATCH LIVE */}
        <section id="watch" aria-labelledby="watch-h" style={{ padding: "0 0 clamp(96px,12cqw,152px)" }}>
          <div
            data-reveal=""
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "clamp(80px,10cqw,128px) clamp(20px,5cqw,64px) 32px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
            }}
          >
            <h2
              id="watch-h"
              style={{ margin: 0, font: "300 clamp(44px,7cqw,104px)/.95 Geist,sans-serif", letterSpacing: "-.05em" }}
            >
              WATCH <span style={{ fontWeight: 100, color: "#D4A64A" }}>LIVE</span>
            </h2>
            <a
              href="https://www.youtube.com/@NathanielBasseyMain/streams"
              target="_blank"
              rel="noopener"
              className="hc-pill-outline-gold"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minHeight: 48,
                padding: "0 22px",
                borderRadius: 999,
                border: "1px solid #262B40",
                color: "#F6F1E7",
                font: "500 15px/1 Geist,sans-serif",
                textDecoration: "none",
              }}
            >
              More <span aria-hidden="true">→</span>
            </a>
          </div>

          <div data-reveal="" style={{ maxWidth: 1280, margin: "0 auto" }}>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: "4px clamp(20px,5cqw,64px) 12px",
                display: "flex",
                gap: 20,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollPaddingLeft: "clamp(20px,5cqw,64px)",
                scrollbarWidth: "thin",
                scrollbarColor: "#262B40 transparent",
              }}
            >
              {videos.map((v) => (
                <li key={v.id} style={{ flex: "0 0 clamp(270px,30cqw,360px)", scrollSnapAlign: "start" }}>
                  <a
                    href={v.yt}
                    onClick={(e) => {
                      e.preventDefault();
                      setVideo({ id: v.id, day: v.day });
                    }}
                    className="hc-zoom-host"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      color: "#F6F1E7",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "16/9",
                        borderRadius: 14,
                        overflow: "hidden",
                        border: "1px solid #262B40",
                      }}
                    >
                      <div
                        className="hc-zoom-lg"
                        role="img"
                        aria-label={v.title}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `#161a2b url(${v.img}) center/100% auto no-repeat`,
                          transition: "transform 900ms cubic-bezier(.2,.7,.2,1)",
                        }}
                      />
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 14,
                          bottom: 14,
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: "#D4A64A",
                          color: "#0B0D17",
                          display: "grid",
                          placeItems: "center",
                          font: "400 14px/1 Geist,sans-serif",
                          pointerEvents: "none",
                        }}
                      >
                        ▶
                      </span>
                    </div>
                    <h3
                      style={{
                        margin: 0,
                        font: "500 13px/1.45 'Geist Mono',monospace",
                        letterSpacing: ".03em",
                        color: "#F6F1E7",
                      }}
                    >
                      {v.title}
                    </h3>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- PARTNERS */}
        <section aria-labelledby="partners-h" style={{ background: "#FBF8F2", color: "#141829" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "clamp(88px,11cqw,144px) clamp(20px,5cqw,64px)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "clamp(32px,5cqw,80px)",
            }}
          >
            <h2
              id="partners-h"
              data-reveal=""
              style={{
                flex: "1 1 280px",
                margin: 0,
                font: "300 clamp(44px,6cqw,88px)/.95 Geist,sans-serif",
                letterSpacing: "-.05em",
              }}
            >
              Our <span style={{ fontWeight: 100 }}>Partners</span>
            </h2>
            <div
              data-reveal=""
              style={{
                flex: "2 1 520px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "24px 40px",
              }}
            >
              <img
                src="https://static.wixstatic.com/media/8120e4_e6f2a031e79e46eaa070348f0d4adfe4~mv2.png/v1/crop/x_320,y_345,w_1950,h_895/fill/w_1688,h_778,al_c,q_90,enc_auto/hc-partners.png"
                alt="Our Partners"
                loading="lazy"
                style={{ flex: "2 1 360px", width: "100%", maxWidth: 640, height: "auto", display: "block" }}
              />
              <img
                src="https://static.wixstatic.com/media/8120e4_ab407cca53d5439fb8ebbd81347849ea~mv2.png/v1/crop/x_524,y_310,w_917,h_566/fill/w_918,h_531,al_c,q_90,enc_auto/HC-Oct-2026-WEB-konga.png"
                alt="Our Partners"
                loading="lazy"
                style={{
                  flex: "1 1 200px",
                  width: "100%",
                  maxWidth: 306,
                  height: "auto",
                  display: "block",
                  borderRadius: 12,
                }}
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ MOBILE APP */}
        <section
          id="app"
          aria-labelledby="app-h"
          style={{ position: "relative", overflow: "clip", background: "#0B0D17" }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              right: "-10%",
              top: 0,
              width: "60%",
              height: "100%",
              background: "radial-gradient(closest-side,rgba(40,62,170,.28),transparent 70%)",
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: 1280,
              margin: "0 auto",
              padding: "clamp(96px,12cqw,152px) clamp(20px,5cqw,64px)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "clamp(40px,6cqw,96px)",
            }}
          >
            <div data-reveal="" style={{ flex: "2 1 520px", display: "flex", flexDirection: "column", gap: 36 }}>
              <h2
                id="app-h"
                style={{ margin: 0, font: "300 clamp(44px,6.6cqw,96px)/1 Geist,sans-serif", letterSpacing: "-.05em" }}
              >
                Download The <span style={{ fontWeight: 100, color: "#D4A64A" }}>HC Mobile App</span>
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 28px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.hallelujahchallengelive&hl=en"
                    style={{ display: "inline-flex", minHeight: 44, alignItems: "center" }}
                  >
                    <img
                      src="https://static.wixstatic.com/media/e178bc_954cc9e88e4a4b58a3f34bc65fd0bbf8~mv2.png/v1/crop/x_37,y_28,w_585,h_185/fill/w_432,h_138,al_c,q_90,enc_auto/google-play.png"
                      alt="Get it on Google Play"
                      width={144}
                      height={46}
                      style={{ height: 52, width: "auto", display: "block" }}
                    />
                  </a>
                  <span
                    style={{ font: "500 12px/1 'Geist Mono',monospace", letterSpacing: ".06em", color: "#A9AEC2" }}
                  >
                    Update Available
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a
                    href="https://apps.apple.com/us/app/hallelujah-challenge/id6744338877"
                    style={{ display: "inline-flex", minHeight: 44, alignItems: "center" }}
                  >
                    <img
                      src="https://static.wixstatic.com/media/8120e4_ad65c59337e34eea9987568661953426~mv2.png/v1/fill/w_375,h_123,al_c,q_90,enc_auto/app-store.png"
                      alt="Download on the App Store"
                      width={125}
                      height={41}
                      style={{ height: 52, width: "auto", display: "block" }}
                    />
                  </a>
                  <span
                    style={{ font: "500 12px/1 'Geist Mono',monospace", letterSpacing: ".06em", color: "#A9AEC2" }}
                  >
                    Available soon
                  </span>
                </div>
              </div>
            </div>
            <div data-reveal="" style={{ flex: "1 1 280px", display: "flex", justifyContent: "center" }}>
              <img
                src="/assets/hc-logo.png"
                alt="Hallelujah Challenge"
                width={217}
                height={90}
                loading="lazy"
                style={{ width: "100%", maxWidth: 320, height: "auto", display: "block" }}
              />
            </div>
          </div>
        </section>
      </main>

      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}

      <SiteFooter />
    </div>
  );
}
