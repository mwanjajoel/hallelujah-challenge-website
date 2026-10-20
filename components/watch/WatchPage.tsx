"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { countdown, pad, session } from "@/lib/session";
import { useNow, useSessionMode } from "@/lib/useSessionClock";

const PLATFORMS: Array<[name: string, handle: string]> = [
  ["YouTube", "Nathaniel Bassey Main"],
  ["Facebook", "Nathaniel Bassey"],
  ["Instagram Live", "@nathanielblow"],
  ["Mixlr audio", "Audio stream, low data"],
  ["HC App", "Official HC app"],
];

interface Edition {
  label: string;
  start: number;
  days: number;
  ids?: string[];
}

const EDITIONS: Record<string, Edition> = {
  oct26: {
    label: "October 2026 · The Lord Reigns",
    start: Date.UTC(2026, 9, 5),
    days: 13,
    ids: [
      "-saBS2ggyi4", "Dvp9hyZW2Ys", "2Dxd2wwRLLc", "hUWaCZzU31U", "SN4z3UyvFVE",
      "18KAjo4RmVU", "adUtqYoDOw0", "i0O00TOi-Kw", "FmECe4ZcXB0", "CCDHi8mjfb4",
      "rkc184yQ-kM", "NyDXTX1ghK0", "h7quyM65iVk",
    ],
  },
  jun26: { label: "June 2026", start: Date.UTC(2026, 5, 1), days: 26 },
  jan26: { label: "January 2026", start: Date.UTC(2026, 0, 6), days: 26 },
  oct25: { label: "October 2025", start: Date.UTC(2025, 9, 6), days: 26 },
};

const SELECT: CSSProperties = {
  minHeight: 48,
  padding: "0 14px",
  borderRadius: "var(--r-sm)",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  color: "var(--fg)",
  font: "500 16px/1 var(--font-sans)",
};

const LABEL: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  font: "500 13px/1 var(--font-sans)",
  color: "var(--fg-muted)",
};

const EYEBROW: CSSProperties = {
  margin: 0,
  font: "500 12px/1 var(--font-mono)",
  letterSpacing: ".14em",
  color: "var(--accent)",
};

export default function WatchPage() {
  const now = useNow();
  const mode = useSessionMode();
  const [platform, setPlatform] = useState(0);
  const [audio, setAudio] = useState(false);
  const [edition, setEdition] = useState("oct26");
  const [day, setDay] = useState("all");

  const { live, rem } = now === null ? { live: false, rem: 0 } : session(now, mode);
  const { hh, mm, ss } = now === null ? { hh: "--", mm: "--", ss: "--" } : countdown(rem);
  const timerLabel =
    now === null ? "Tonight's session countdown" : "Tonight's session begins in " + +hh + " hours, " + +mm + " minutes";

  // Locale- and timezone-dependent, so it only renders once mounted.
  const localTime =
    now === null
      ? "—"
      : new Date(Date.UTC(2026, 9, 20, 22, 59)).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        });

  const ed = EDITIONS[edition];

  const all = Array.from({ length: ed.days }, (_, i) => {
    const d = i + 1;
    const dt = new Date(ed.start + i * 86400000);
    const secs = 5200 + ((d * 7919 + ed.days * 31) % 1700);
    const dur = Math.floor(secs / 3600) + ":" + pad(Math.floor((secs % 3600) / 60)) + ":" + pad(secs % 60);
    const date = dt
      .toLocaleDateString("en-GB", { month: "short", day: "numeric", timeZone: "UTC" })
      .replace(/(\d+) (\w+)/, "$2 $1");
    const id = ed.ids?.[i];
    return {
      day: d,
      date,
      dur: id ? "YOUTUBE" : dur,
      href: id ? "https://www.youtube.com/watch?v=" + id : "https://www.youtube.com/@NathanielBasseyMain/streams",
      bg: id
        ? "var(--surface) url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg) center/cover no-repeat"
        : "repeating-linear-gradient(135deg, #161a2b 0 10px, #121524 10px 20px)",
      alt: "Replay for Day " + d + ", " + ed.label,
    };
  }).reverse();

  const replays = day === "all" ? all : all.filter((r) => String(r.day) === day);
  const [platformName, platformHandle] = PLATFORMS[platform];

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="watch" />
      </div>

      <main>
        {/* ---------------------------------------------------------- PLAYER */}
        <Section aria-label="Watch" tight glow="blue" glowAt="50% 0%">
          <Reveal
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={EYEBROW}>OCTOBER 2026 &#183; THE LORD REIGNS &#183; DAY 15 OF 26</p>
              <Display as="h1" size="xl">
                Watch <Accent gold>live</Accent>
              </Display>
            </div>
            <p style={{ margin: 0, color: "var(--fg-muted)", font: "400 16px/1.5 var(--font-sans)" }}>
              Every night at 11:59 PM WAT &#183;{" "}
              <strong suppressHydrationWarning style={{ color: "var(--fg)", fontWeight: 600 }}>
                {localTime}
              </strong>{" "}
              where you are
            </p>
          </Reveal>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
            <div style={{ flex: "2 1 540px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              <Reveal>
                <Card radius="lg" role="region" aria-label="Live player" style={{ aspectRatio: "16/9" }}>
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "repeating-linear-gradient(135deg, #151929 0 12px, rgba(17,20,34,0) 12px 24px), #121524",
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(ellipse at 50% 120%, var(--glow-ember), transparent 60%), linear-gradient(180deg, rgba(11,13,23,.2), rgba(11,13,23,.75))",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      right: 16,
                      top: 16,
                      font: "400 11px/1.4 var(--font-mono)",
                      color: "var(--fg-muted)",
                    }}
                  >
                    [ {platformName} embed &#183; poster still ]
                  </span>

                  {live ? (
                    <>
                      <span
                        style={{
                          position: "absolute",
                          left: 16,
                          top: 16,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "7px 12px",
                          borderRadius: 6,
                          background: "var(--live)",
                          color: "#fff",
                          font: "500 13px/1 var(--font-mono)",
                          letterSpacing: ".06em",
                        }}
                      >
                        <span className="hc-breathe" aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
                        LIVE NOW
                      </span>
                      <button
                        type="button"
                        aria-label="Play live stream"
                        className="hc-t hc-pill-gold"
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%,-50%)",
                          width: 86,
                          height: 86,
                          borderRadius: "50%",
                          border: 0,
                          background: "var(--accent-fill)",
                          color: "var(--on-accent)",
                          font: "400 26px/1 var(--font-sans)",
                          cursor: "pointer",
                        }}
                      >
                        &#9654;
                      </button>
                    </>
                  ) : (
                    <div
                      role="timer"
                      aria-label={timerLabel}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 14,
                        textAlign: "center",
                        padding: 20,
                      }}
                    >
                      <p style={{ ...EYEBROW, color: "var(--fg-muted)" }}>TONIGHT&rsquo;S SESSION BEGINS IN</p>
                      <p
                        aria-hidden="true"
                        suppressHydrationWarning
                        style={{
                          margin: 0,
                          font: "400 clamp(44px, 8vw, 100px)/1 var(--font-display)",
                          fontVariantNumeric: "tabular-nums",
                          color: "var(--accent)",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {hh}:{mm}:{ss}
                      </p>
                      <Link
                        href="/#app"
                        className="hc-t hc-pill-outline"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          minHeight: 44,
                          padding: "0 22px",
                          borderRadius: "var(--r-pill)",
                          border: "1px solid var(--hairline-strong)",
                          color: "var(--fg)",
                          font: "500 15px/1 var(--font-sans)",
                          textDecoration: "none",
                        }}
                      >
                        Remind me 15 minutes before
                      </Link>
                    </div>
                  )}

                </Card>
              </Reveal>

              <Reveal index={1} role="tablist" aria-label="Choose a platform" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PLATFORMS.map(([name], i) => {
                  const sel = platform === i;
                  return (
                    <button
                      key={name}
                      type="button"
                      role="tab"
                      aria-selected={sel}
                      onClick={() => setPlatform(i)}
                      className="hc-t hc-pill-outline"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        minHeight: 44,
                        padding: "0 18px",
                        borderRadius: "var(--r-pill)",
                        border: "1px solid " + (sel ? "var(--fg)" : "var(--line)"),
                        background: sel ? "var(--fg)" : "var(--surface)",
                        color: sel ? "var(--bg)" : "var(--fg)",
                        font: "500 15px/1 var(--font-sans)",
                        cursor: "pointer",
                      }}
                    >
                      {sel && <span aria-hidden="true">&#10003;</span>}
                      {name}
                    </button>
                  );
                })}
              </Reveal>

              <Reveal index={2}>
                <Card radius="md" style={{ padding: "16px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <p style={{ margin: 0, font: "400 16px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
                      Now showing: <strong style={{ color: "var(--fg)", fontWeight: 600 }}>{platformName}</strong> &#183;{" "}
                      {platformHandle}
                    </p>
                    <ArrowLink href="#">Open in {platformName}</ArrowLink>
                  </div>
                </Card>
              </Reveal>
            </div>

            <aside style={{ flex: "1 1 310px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              <Reveal index={1}>
                <Card radius="lg" aria-labelledby="audio-h" style={{ padding: 28 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 10px",
                        borderRadius: "var(--r-pill)",
                        border: "1px solid var(--fg-muted)",
                        color: "var(--fg-muted)",
                        font: "500 11px/1 var(--font-mono)",
                        letterSpacing: ".06em",
                      }}
                    >
                      LOW DATA
                    </span>
                    <Display id="audio-h" size="sm">
                      Low on data? Listen to the audio stream.
                    </Display>
                    <p style={{ margin: 0, font: "400 16px/1.55 var(--font-sans)", color: "var(--fg-muted)" }}>
                      Audio only on Mixlr. It uses far less data than video and keeps playing with your screen off.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAudio((a) => !a)}
                      aria-pressed={audio}
                      className="hc-t hc-pill-tint"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        minHeight: 52,
                        borderRadius: "var(--r-pill)",
                        border: "1px solid var(--accent)",
                        background: "transparent",
                        color: "var(--fg)",
                        font: "600 16px/1 var(--font-sans)",
                        cursor: "pointer",
                      }}
                    >
                      <span aria-hidden="true" style={{ fontSize: 12, color: "var(--accent)" }}>
                        {audio ? "❚❚" : "▶"}
                      </span>
                      {audio ? "Pause audio" : "Listen to audio only"}
                    </button>
                    <ArrowLink href="#">Get free data (Nigeria)</ArrowLink>
                  </div>
                </Card>
              </Reveal>

              <Reveal index={2}>
                <Card radius="lg" glow="blue" glowAt="0% 0%" aria-labelledby="tonight-h" style={{ padding: 28 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <p id="tonight-h" style={{ ...EYEBROW, color: "var(--fg-muted)" }}>
                      TONIGHT &#183; HE SITS ENTHRONED
                    </p>
                    <blockquote
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-display)",
                        fontSize: 24,
                        lineHeight: 1.35,
                      }}
                    >
                      The LORD reigns; let the peoples tremble! He dwells between the cherubim; let the earth be moved!
                    </blockquote>
                    <p style={{ ...EYEBROW }}>PSALM 99:1</p>
                    {/* TODO: no prayer-points page exists yet; links home. */}
                    <ArrowLink href="/">Tonight&rsquo;s prayer points</ArrowLink>
                  </div>
                </Card>
              </Reveal>
            </aside>
          </div>
        </Section>

        {/* --------------------------------------------------------- ARCHIVE */}
        <Section id="archive" aria-labelledby="arch-h" tight>
          <Reveal
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              marginBottom: 28,
              paddingTop: "clamp(28px, 4vw, 48px)",
              borderTop: "1px solid var(--line)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ ...EYEBROW, color: "var(--fg-muted)" }}>REPLAYS ARCHIVE</p>
              <Display id="arch-h" size="lg">
                Every night, <Accent>kept</Accent>
              </Display>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <label style={LABEL}>
                Edition
                <select
                  value={edition}
                  onChange={(e) => {
                    setEdition(e.target.value);
                    setDay("all");
                  }}
                  className="hc-t hc-input"
                  style={{ ...SELECT, minWidth: 220 }}
                >
                  {Object.entries(EDITIONS).map(([id, e]) => (
                    <option key={id} value={id}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={LABEL}>
                Day
                <select value={day} onChange={(e) => setDay(e.target.value)} className="hc-t hc-input" style={{ ...SELECT, minWidth: 140 }}>
                  <option value="all">All days</option>
                  {Array.from({ length: ed.days }, (_, i) => (
                    <option key={i} value={String(i + 1)}>
                      Day {i + 1}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Reveal>

          <p aria-live="polite" style={{ margin: "0 0 20px", font: "400 15px/1 var(--font-sans)", color: "var(--fg-muted)" }}>
            {replays.length} {replays.length === 1 ? "replay" : "replays"} &#183; {ed.label}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 248px), 1fr))",
              gap: "24px 20px",
            }}
          >
            {replays.map((r, i) => (
              <Reveal key={edition + "-" + r.day} variant="sharpen" index={i % 8}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener"
                  className="hc-zoom-host hc-t"
                  style={{ display: "flex", flexDirection: "column", gap: 12, color: "var(--fg)", textDecoration: "none" }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      borderRadius: "var(--r-sm)",
                      overflow: "clip",
                      border: "1px solid var(--hairline)",
                    }}
                  >
                    <div className="hc-zoom" role="img" aria-label={r.alt} style={{ position: "absolute", inset: 0, background: r.bg }} />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        bottom: 10,
                        padding: "4px 8px",
                        borderRadius: 5,
                        background: "rgba(11,13,23,.85)",
                        font: "600 12px/1 var(--font-sans)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.dur}
                    </span>
                  </div>
                  <p style={{ margin: 0, font: "500 15px/1.3 var(--font-sans)", fontVariantNumeric: "tabular-nums" }}>
                    Day {r.day} &#183; {r.date} &#183; <span style={{ color: "var(--fg-muted)" }}>{r.dur}</span>
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
