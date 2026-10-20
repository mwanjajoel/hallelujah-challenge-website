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
import { CURRENT } from "@/lib/edition";
import { countdown, session } from "@/lib/session";
import { useNow, useSessionMode } from "@/lib/useSessionClock";

const STREAMS_URL = "https://www.youtube.com/@NathanielBasseyMain/streams";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.hallelujahchallengelive&hl=en";

/**
 * Where the session can actually be watched.
 *
 * Facebook, Instagram Live and a Mixlr audio stream were listed here too,
 * with handles. Nothing the ministry publishes mentions any of them: there
 * is not one facebook.com, instagram.com or mixlr.com link anywhere on
 * hallelujahchallengelive.com. Telling someone to go and watch somewhere
 * there may be nothing to watch is worse than a shorter list, so the list is
 * the two destinations that could be confirmed — the channel the live site
 * itself links to, and the app on Google Play.
 */
const PLATFORMS: Array<[name: string, handle: string, url: string]> = [
  ["YouTube", "Nathaniel Bassey Main", STREAMS_URL],
  ["HC App", "Official HC app", PLAY_STORE_URL],
];

/** The newest session in the current edition — its thumbnail is the player's
    artwork, so the panel shows the real broadcast rather than a mock-up. */
/* The player panel keeps its dark poster and scrim in both themes, so what
   sits on it cannot use --fg or --fg-muted: in light mode those are dark ink
   and vanish. (The "remind me" link had been doing exactly that.) */
const ON_PLAYER = "rgba(255,255,255,.96)";
const ON_PLAYER_DIM = "rgba(255,255,255,.66)";
const ON_PLAYER_LINE = "rgba(255,255,255,.38)";

const LATEST_ID = "h7quyM65iVk";
const LATEST_POSTER = `https://i.ytimg.com/vi/${LATEST_ID}/maxresdefault.jpg`;

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
  const [day, setDay] = useState("all");

  const { live, rem, scheduled } =
    now === null ? { live: false, rem: 0, scheduled: true } : session(now, mode);
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

  const ed = CURRENT;

  // Each tile is one real broadcast. There used to be a runtime here too,
  // printed as "1:28:43" and the like — but it was `5200 + ((day * 7919 +
  // days * 31) % 1700)` seconds, a hash dressed up as a fact. A duration we
  // do not have is not shown.
  const all = ed.ids.map((id, i) => {
    const d = i + 1;
    const dt = new Date(ed.start + i * 86400000);
    const date = dt
      .toLocaleDateString("en-GB", { month: "short", day: "numeric", timeZone: "UTC" })
      .replace(/(\d+) (\w+)/, "$2 $1");
    return {
      day: d,
      date,
      href: "https://www.youtube.com/watch?v=" + id,
      bg: "var(--surface) url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg) center/cover no-repeat",
      alt: "Replay for Day " + d + ", " + ed.label,
    };
  }).reverse();

  const replays = day === "all" ? all : all.filter((r) => String(r.day) === day);
  const [platformName, platformHandle, platformUrl] = PLATFORMS[platform];

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
              {/* Was "DAY 15 OF 26". The edition ran thirteen nights, and its last was
                  17 October, so both halves of that were wrong. Counted from the
                  broadcasts themselves rather than written down again. */}
              <p style={EYEBROW}>
                OCTOBER 2026 &#183; THE LORD REIGNS &#183; {ed.ids.length} NIGHTS
              </p>
              <Display as="h1" size="xl">
                Watch <Accent gold>live</Accent>
              </Display>
            </div>
            <p style={{ margin: 0, color: "var(--fg-muted)", font: "400 16px/1.5 var(--font-sans)" }}>
              {scheduled ? (
                <>
                  Every night at 11:59 PM WAT &#183;{" "}
                  <strong suppressHydrationWarning style={{ color: "var(--fg)", fontWeight: 600 }}>
                    {localTime}
                  </strong>{" "}
                  where you are
                </>
              ) : (
                <>
                  Sessions run at 11:59 PM WAT &#183;{" "}
                  <strong suppressHydrationWarning style={{ color: "var(--fg)", fontWeight: 600 }}>
                    {localTime}
                  </strong>{" "}
                  where you are, through the nights of an edition
                </>
              )}
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
                      background: `#121524 url(${LATEST_POSTER}) center/cover no-repeat`,
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(60% 70% at 50% 50%, rgba(11,13,23,.88), rgba(11,13,23,.72) 70%), linear-gradient(180deg, rgba(11,13,23,.7), rgba(11,13,23,.88))",
                      backdropFilter: "blur(3px)",
                    }}
                  />
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
                      <a
                        href={STREAMS_URL}
                        target="_blank"
                        rel="noopener"
                        aria-label="Play live stream"
                        className="hc-t hc-pill-gold"
                        style={{
                          display: "grid",
                          placeItems: "center",
                          textDecoration: "none",
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
                      </a>
                    </>
                  ) : !scheduled ? (
                    /* No edition is running, so there is no time to show.
                       The panel points at the thirteen nights that exist
                       rather than counting to a night that does not. */
                    <div
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
                      <p style={{ ...EYEBROW, color: ON_PLAYER_DIM }}>NO SESSION TONIGHT</p>
                      <p
                        style={{
                          margin: 0,
                          maxWidth: "24ch",
                          font: "400 clamp(21px, 2.4vw, 32px)/1.35 var(--font-display)",
                          color: ON_PLAYER,
                        }}
                      >
                        The {ed.label.split(" \u00b7 ")[0]} edition has ended.
                      </p>
                      <a
                        href={STREAMS_URL}
                        target="_blank"
                        rel="noopener"
                        className="hc-t hc-pill-outline"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          minHeight: 44,
                          padding: "0 22px",
                          borderRadius: "var(--r-pill)",
                          border: "1px solid " + ON_PLAYER_LINE,
                          color: ON_PLAYER,
                          font: "500 15px/1 var(--font-sans)",
                          textDecoration: "none",
                        }}
                      >
                        All {ed.ids.length} nights on YouTube
                      </a>
                    </div>
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
                      <p style={{ ...EYEBROW, color: ON_PLAYER_DIM }}>TONIGHT&rsquo;S SESSION BEGINS IN</p>
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
                          border: "1px solid " + ON_PLAYER_LINE,
                          color: ON_PLAYER,
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
                    {platformUrl && (
                      <ArrowLink href={platformUrl} external>
                        Open in {platformName}
                      </ArrowLink>
                    )}
                  </div>
                </Card>
              </Reveal>
            </div>

            <aside style={{ flex: "1 1 310px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              <Reveal index={1}>
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
              <p style={{ ...LABEL, gap: 8 }}>
                Edition
                <span style={{ font: "600 16px/1.4 var(--font-sans)", color: "var(--fg)" }}>{ed.label}</span>
                <a
                  href={STREAMS_URL}
                  target="_blank"
                  rel="noopener"
                  className="hc-t"
                  style={{ font: "500 14px/1 var(--font-sans)", color: "var(--accent)", textUnderlineOffset: 4 }}
                >
                  Earlier editions on YouTube
                </a>
              </p>
              <label style={LABEL}>
                Day
                <select value={day} onChange={(e) => setDay(e.target.value)} className="hc-t hc-input" style={{ ...SELECT, minWidth: 140 }}>
                  <option value="all">All days</option>
                  {Array.from({ length: ed.ids.length }, (_, i) => (
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
              <Reveal key={r.day} variant="sharpen" index={i % 8}>
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
                      {"Day " + r.day}
                    </span>
                  </div>
                  <p style={{ margin: 0, font: "500 15px/1.3 var(--font-sans)", fontVariantNumeric: "tabular-nums" }}>
                    Day {r.day} &#183; {r.date}
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
