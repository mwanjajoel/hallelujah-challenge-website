"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Marquee, { Chip } from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { mount as mountShader, type ShaderHandle } from "@/lib/hcShader";
import { countdown, session } from "@/lib/session";
import { useNow, useSessionMode } from "@/lib/useSessionClock";
import Hero from "./Hero";
import VideoModal from "./VideoModal";
import { type OpenVideo, VIDS, videoTitle } from "./videos";

const W = "https://static.wixstatic.com/media/";

const GALLERY = [
  W + "e178bc_9c4ea1afa58c4409a0e40740a4bc966b~mv2.jpg/v1/fill/w_1400,h_1100,al_c,q_90,enc_auto/DSC09945.jpg",
  W + "e178bc_d7e064dfa947410ba37c38e07e598a02~mv2.jpg/v1/fill/w_800,h_560,al_c,q_90,enc_auto/DSC00851.jpg",
  W + "e178bc_715f49ff8b114ba49e5c51355943bb4d~mv2.jpg/v1/fill/w_800,h_1100,al_c,q_90,enc_auto/DSC03162.jpg",
  W + "e178bc_5d0c5c6531da4fdeb0a5ac1ac3fd6ce5~mv2.jpg/v1/fill/w_800,h_560,al_c,q_90,enc_auto/DSC03192.jpg",
  W + "e178bc_afe198aca8994dec8029d557b7c47a6c~mv2.jpg/v1/fill/w_1400,h_560,al_c,q_90,enc_auto/DSC03171.jpg",
  W + "e178bc_088a3b49f0fa4f8788f131d629f28f9f~mv2.jpeg/v1/fill/w_800,h_560,al_c,q_90,enc_auto/hc-feb-2026-day-1.jpeg",
];

const CREATING_POSTER =
  W + "e178bc_c8afc65f02014fd985ef729ac3fd673df000.jpg/v1/fill/w_1560,h_1308,al_c,q_90,enc_auto/hc-creating.jpg";

const CREATING_VIDEO =
  "https://video.wixstatic.com/video/e178bc_c8afc65f02014fd985ef729ac3fd673d/1080p/mp4/file.mp4";

const EYEBROW: CSSProperties = {
  margin: 0,
  font: "500 12px/1 var(--font-mono)",
  letterSpacing: ".14em",
  color: "var(--accent)",
};

const MONO_SMALL: CSSProperties = {
  font: "500 11px/1 var(--font-mono)",
  letterSpacing: ".08em",
  color: "var(--fg-muted)",
};

/** A photograph set inline into a running headline, opening as it reveals. */
function Pill({ url, width, index }: { url: string; width: number; index: number }) {
  return (
    <span
      data-pill
      role="img"
      aria-label="Hallelujah Challenge gathering"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        height: "0.74em",
        margin: "0 .12em",
        borderRadius: "var(--r-pill)",
        background: "var(--surface) url(" + url + ") center/cover no-repeat",
        ["--w" as string]: width + "px",
        ["--pi" as string]: index,
      }}
    />
  );
}

export default function HomePage() {
  const now = useNow();
  const mode = useSessionMode();
  const [video, setVideo] = useState<OpenVideo | null>(null);

  const storyIo = useRef<IntersectionObserver | null>(null);
  const shader = useRef<ShaderHandle | null>(null);

  const { live, rem } = now === null ? { live: false, rem: 0 } : session(now, mode);
  const { hh, mm, ss } = now === null ? { hh: "--", mm: "--", ss: "--" } : countdown(rem);
  const timerLabel = now === null ? "Countdown to tonight's session" : +hh + " hours, " + +mm + " minutes";

  const storyVideoRef = useCallback((el: HTMLVideoElement | null) => {
    storyIo.current?.disconnect();
    storyIo.current = null;
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
    storyIo.current = io;
  }, []);

  const dawnCanvasRef = useCallback((el: HTMLCanvasElement | null) => {
    shader.current?.destroy();
    shader.current = null;
    if (!el) return;
    shader.current = mountShader(el, "dawn", { godrays: false, stars: 0, rays: 0.35 });
  }, []);

  useEffect(
    () => () => {
      storyIo.current?.disconnect();
      shader.current?.destroy();
    },
    [],
  );

  const videos = VIDS.slice()
    .reverse()
    .map(([id, day]) => ({
      id,
      day,
      yt: "https://www.youtube.com/watch?v=" + id,
      img: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg",
      title: videoTitle(day),
    }));

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="home" />
      </div>

      <main>
        <Hero live={live} hh={hh} mm={mm} ss={ss} timerLabel={timerLabel} />

        {/* A slow ambient strip, so the page has a pulse before the reading starts. */}
        <div style={{ padding: "clamp(8px, 2vw, 20px) 0 clamp(24px, 4vw, 48px)" }}>
          <Marquee aria-label="This edition" duration={80}>
            {["PSALM 99:1", "THE LORD REIGNS", "OCTOBER 2026", "11:59 PM WAT", "PRAISE", "PRAYER", "WORSHIP",
              "DELIVERANCE", "BREAKTHROUGHS", "MIRACLES", "SIGNS", "TESTIMONIES"].map((t, i) => (
              <Chip key={t} tone={i % 4 === 0 ? "accent" : "line"}>
                {t}
              </Chip>
            ))}
          </Marquee>
        </div>

        {/* ------------------------------------------------------------ ABOUT */}
        <Section id="about" aria-label="About" width="text" glow="blue" glowAt="18% 12%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(22px, 2.8vw, 36px)" }}>
            <p style={EYEBROW}>WHAT IT IS</p>
            <Display size="lg" style={{ maxWidth: "20ch" }}>
              An hour of praise unto the Lord, <Accent>every night</Accent>.
            </Display>
            <p
              style={{
                margin: 0,
                maxWidth: "58ch",
                font: "400 clamp(17px, 1.5vw, 20px)/1.7 var(--font-sans)",
                color: "var(--fg-muted)",
                textWrap: "pretty",
              }}
            >
              Hallelujah Challenge is an hour-long online praise program unto the Lord. The sessions are held daily
              during designated periods every year, as God leads the convener, Pastor Nathaniel Bassey. Commencing at
              11:59 PM, it features sessions of passionate praise and prayer.
            </p>
          </Reveal>

          <Reveal
            as="p"
            index={1}
            style={{
              margin: "clamp(44px, 6vw, 84px) 0 0",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4.2vw, 64px)",
              lineHeight: 1.24,
              letterSpacing: "-0.025em",
              color: "var(--fg)",
            }}
          >
            Hallelujah Challenge has become a mountain of high praises,{" "}
            <Pill url={GALLERY[4]} width={148} index={0} /> fervent prayer, heartfelt worship,{" "}
            <Pill url={GALLERY[2]} width={118} index={1} /> deliverance, breakthroughs, miracles,{" "}
            <Pill url={GALLERY[5]} width={130} index={2} /> <Accent gold>and signs.</Accent>
          </Reveal>
        </Section>

        {/* ---------------------------------------------------------- GALLERY */}
        <Section aria-labelledby="mountain-h" tight>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "clamp(26px, 4vw, 50px)" }}>
            <p style={EYEBROW}>THE GATHERING</p>
            <Display id="mountain-h" size="xl" style={{ maxWidth: "16ch" }}>
              A mountain of <Accent>praise and worship</Accent>
            </Display>
          </Reveal>

          <Reveal
            variant="sharpen"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gridAutoRows: "clamp(168px, 19vw, 248px)",
              gridAutoFlow: "dense",
              gap: 14,
            }}
          >
            {GALLERY.map((url, i) => (
              <div
                key={url}
                className="hc-zoom-host"
                style={{
                  gridColumn: i === 0 || i === 4 ? "span 2" : undefined,
                  gridRow: i === 0 || i === 2 ? "span 2" : undefined,
                  borderRadius: "var(--r-md)",
                  overflow: "clip",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div
                  className="hc-zoom"
                  role="img"
                  aria-label="Hallelujah Challenge gathering"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "var(--surface) url(" + url + ") center/cover no-repeat",
                  }}
                />
              </div>
            ))}
          </Reveal>
        </Section>

        {/* --------------------------------------------------------- CREATING */}
        <Section id="creating" aria-labelledby="creating-h" glow="blue" glowAt="82% 50%">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "clamp(28px, 4vw, 64px)",
              alignItems: "center",
            }}
          >
            <Reveal>
              <Card radius="lg" style={{ aspectRatio: "520/440", border: "1px solid rgba(212,166,74,.3)" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--surface) url(" + CREATING_POSTER + ") center/cover no-repeat",
                  }}
                >
                  <video
                    ref={storyVideoRef}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    poster={CREATING_POSTER}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  >
                    <source src={CREATING_VIDEO} type="video/mp4" />
                  </video>
                </div>
              </Card>
            </Reveal>

            <Reveal index={1} style={{ display: "flex", flexDirection: "column", gap: "clamp(18px, 2.2vw, 28px)" }}>
              <p style={EYEBROW}>THE HEART OF IT</p>
              <Display id="creating-h" size="lg" style={{ maxWidth: "13ch" }}>
                Creating a world of <Accent gold>Hallelujah</Accent>
              </Display>
              <p
                style={{
                  margin: 0,
                  maxWidth: "34em",
                  font: "400 clamp(17px, 1.5vw, 20px)/1.65 var(--font-sans)",
                  color: "var(--fg-muted)",
                }}
              >
                We&rsquo;re grateful for the opportunity to make a difference and inspire lives worldwide through the
                grace of Jesus.
              </p>
              <ArrowLink href="/testimonies">See what God has done</ArrowLink>
            </Reveal>
          </div>
        </Section>

        {/* -------------------------------------------------------- TESTIMONY */}
        <Section
          id="testimonies"
          aria-labelledby="test-h"
          width="narrow"
          className="hc-on-dark"
          style={{ background: "#100e1f" }}
          backdrop={
            <>
              <canvas
                ref={dawnCanvasRef}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, var(--bg) 0%, rgba(11,13,23,0) 26%, rgba(11,13,23,.5) 100%)",
                }}
              />
            </>
          }
        >
          <Reveal as="figure" style={{ margin: 0, display: "flex", flexDirection: "column", gap: 28 }}>
            <p id="test-h" style={{ ...EYEBROW, color: "var(--ember)", display: "flex", alignItems: "center", gap: 14 }}>
              <span aria-hidden="true" style={{ width: 30, height: 1, background: "var(--ember)" }} />
              HEALED FROM BACK PAIN
            </p>
            <blockquote
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(23px, 2.7vw, 40px)",
                lineHeight: 1.32,
                letterSpacing: "-0.015em",
                color: "var(--cream)",
                textWrap: "pretty",
              }}
            >
              I stumbled on the program during the HC in October 2023 while in back pain. Pastor Nathaniel kept saying
              God was healing lower back pain. I knew and believed it was me, because God led me to HC.{" "}
              <Accent gold>I reside in the USA, and God healed me.</Accent>
            </blockquote>
            <figcaption
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                font: "600 14px/1 var(--font-mono)",
                letterSpacing: ".14em",
                color: "var(--cream)",
              }}
            >
              <span aria-hidden="true" style={{ width: 30, height: 1, background: "var(--ember)" }} />
              OLU
            </figcaption>
          </Reveal>
          <Reveal index={1} style={{ marginTop: 42 }}>
            <ArrowLink href="/testimonies" variant="cream">
              Read more testimonies
            </ArrowLink>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------------ WATCH */}
        <Section id="watch" aria-labelledby="watch-h" tight innerStyle={{ paddingLeft: 0, paddingRight: 0 }}>
          <Reveal
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              padding: "0 var(--gutter)",
              marginBottom: "clamp(24px, 3vw, 40px)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={EYEBROW}>EVERY NIGHT, KEPT</p>
              <Display id="watch-h" size="xl">
                Watch <Accent gold>live</Accent>
              </Display>
            </div>
            <ArrowLink href="/watch" variant="outline">
              All replays
            </ArrowLink>
          </Reveal>

          <Reveal variant="sharpen">
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: "4px var(--gutter) 14px",
                display: "flex",
                gap: 20,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollPaddingLeft: "var(--gutter)",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--line) transparent",
              }}
            >
              {videos.map((v) => (
                <li key={v.id} style={{ flex: "0 0 clamp(260px, 29vw, 350px)", scrollSnapAlign: "start" }}>
                  <a
                    href={v.yt}
                    onClick={(e) => {
                      e.preventDefault();
                      setVideo({ id: v.id, day: v.day });
                    }}
                    className="hc-zoom-host hc-t"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      color: "var(--fg)",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "16/9",
                        borderRadius: "var(--r-md)",
                        overflow: "clip",
                        border: "1px solid var(--hairline)",
                      }}
                    >
                      <div
                        className="hc-zoom-lg"
                        role="img"
                        aria-label={v.title}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "var(--surface) url(" + v.img + ") center/cover no-repeat",
                        }}
                      />
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 14,
                          bottom: 14,
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          background: "var(--accent-fill)",
                          color: "var(--on-accent)",
                          display: "grid",
                          placeItems: "center",
                          font: "400 13px/1 var(--font-sans)",
                        }}
                      >
                        &#9654;
                      </span>
                    </div>
                    <h3
                      style={{
                        margin: 0,
                        font: "500 13px/1.45 var(--font-mono)",
                        letterSpacing: ".03em",
                        color: "var(--fg-muted)",
                      }}
                    >
                      {v.title}
                    </h3>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>

        {/* --------------------------------------------------------- PARTNERS */}
        <Section aria-labelledby="partners-h" tone="cream" tight>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(28px, 5vw, 72px)" }}>
            <Reveal style={{ flex: "1 1 260px" }}>
              <Display id="partners-h" size="lg">
                Our <Accent>partners</Accent>
              </Display>
            </Reveal>
            <Reveal
              index={1}
              style={{ flex: "2 1 480px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "22px 36px" }}
            >
              {/* Served locally rather than from the Wix CDN: the originals
                  were 1.4MB between them and often had not arrived by the time
                  the section scrolled into view. */}
              <img
                src="/assets/hc-partners.webp"
                alt="Partners of the Hallelujah Challenge"
                width={1240}
                height={569}
                loading="lazy"
                style={{ flex: "2 1 340px", width: "100%", maxWidth: 620, height: "auto", display: "block" }}
              />
              <img
                src="/assets/hc-partner-konga.webp"
                alt="Konga, partner of the Hallelujah Challenge"
                width={580}
                height={358}
                loading="lazy"
                style={{ flex: "1 1 190px", width: "100%", maxWidth: 290, height: "auto", display: "block", borderRadius: 12 }}
              />
            </Reveal>
          </div>
        </Section>

        {/* -------------------------------------------------------------- APP */}
        <Section id="app" aria-labelledby="app-h" glow="gold" glowAt="78% 50%">
          <Reveal>
            <Card radius="xl" glow="blue" glowAt="85% 18%" style={{ padding: "clamp(30px, 5vw, 68px)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(28px, 5vw, 72px)" }}>
                <div style={{ flex: "2 1 420px", display: "flex", flexDirection: "column", gap: 28 }}>
                  <p style={EYEBROW}>TAKE IT WITH YOU</p>
                  <Display id="app-h" size="lg" style={{ maxWidth: "14ch" }}>
                    Download the <Accent gold>HC mobile app</Accent>
                  </Display>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 26px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.hallelujahchallengelive&hl=en"
                        className="hc-t"
                        style={{ display: "inline-flex", minHeight: 44, alignItems: "center" }}
                      >
                        <img
                          src={W + "e178bc_954cc9e88e4a4b58a3f34bc65fd0bbf8~mv2.png/v1/crop/x_37,y_28,w_585,h_185/fill/w_432,h_138,al_c,q_90,enc_auto/google-play.png"}
                          alt="Get it on Google Play"
                          width={144}
                          height={46}
                          style={{ height: 50, width: "auto", display: "block" }}
                        />
                      </a>
                      <span style={MONO_SMALL}>UPDATE AVAILABLE</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      <a
                        href="https://apps.apple.com/us/app/hallelujah-challenge/id6744338877"
                        className="hc-t"
                        style={{ display: "inline-flex", minHeight: 44, alignItems: "center" }}
                      >
                        <img
                          src={W + "8120e4_ad65c59337e34eea9987568661953426~mv2.png/v1/fill/w_375,h_123,al_c,q_90,enc_auto/app-store.png"}
                          alt="Download on the App Store"
                          width={125}
                          height={41}
                          style={{ height: 50, width: "auto", display: "block" }}
                        />
                      </a>
                      <span style={MONO_SMALL}>AVAILABLE SOON</span>
                    </div>
                  </div>
                </div>
                <div style={{ flex: "1 1 240px", display: "flex", justifyContent: "center" }}>
                  <img
                    src="/assets/hc-theme-the-lord-reigns.png"
                    alt=""
                    aria-hidden="true"
                    width={654}
                    height={626}
                    loading="lazy"
                    className="hc-float"
                    style={{ width: "100%", maxWidth: 250, height: "auto", display: "block" }}
                  />
                </div>
              </div>
            </Card>
          </Reveal>
        </Section>
      </main>

      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}

      <SiteFooter />
    </>
  );
}
