"use client";

import Link from "next/link";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
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

const SELECT: React.CSSProperties = {
  minHeight: 48,
  padding: "0 14px",
  borderRadius: 12,
  background: "#141829",
  border: "1px solid #262B40",
  color: "#F6F1E7",
  font: "500 16px/1 Geist,sans-serif",
};

const LABEL: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  font: "500 13px/1 Geist,sans-serif",
  color: "#A9AEC2",
};

const CARD: React.CSSProperties = {
  padding: 28,
  borderRadius: 18,
  background: "#141829",
  border: "1px solid #262B40",
  display: "flex",
  flexDirection: "column",
  gap: 16,
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
    now === null ? "Tonight's session countdown" : `Tonight's session begins in ${+hh} hours, ${+mm} minutes`;

  // Fraction of the run-up elapsed; drives how high the horizon line sits.
  const p = now === null ? 0 : live ? 1 : Math.min(1, Math.max(0, 1 - rem / (6 * 3600000)));
  const horizonBottom = `${(6 + p * 30).toFixed(1)}%`;

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
    const dur = `${Math.floor(secs / 3600)}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`;
    const date = dt
      .toLocaleDateString("en-GB", { month: "short", day: "numeric", timeZone: "UTC" })
      .replace(/(\d+) (\w+)/, "$2 $1");
    const id = ed.ids?.[i];
    return {
      day: d,
      date,
      dur: id ? "YOUTUBE" : dur,
      href: id ? `https://www.youtube.com/watch?v=${id}` : "https://www.youtube.com/@NathanielBasseyMain/streams",
      bg: id
        ? `#161a2b url(https://i.ytimg.com/vi/${id}/hqdefault.jpg) center/100% auto no-repeat`
        : "repeating-linear-gradient(135deg,#161a2b 0 10px,#121524 10px 20px)",
      alt: `Replay for Day ${d}, ${ed.label}`,
    };
  }).reverse();

  const replays = day === "all" ? all : all.filter((r) => String(r.day) === day);
  const [platformName, platformHandle] = PLATFORMS[platform];

  return (
    <div
      style={{
        containerType: "inline-size",
        background: "#0B0D17",
        color: "#F6F1E7",
        fontFamily: "Geist,system-ui,sans-serif",
        fontSize: "clamp(16px,1.5cqw,18px)",
        lineHeight: 1.6,
        minHeight: "100vh",
      }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 50, display: "block" }}>
        <SiteHeader active="watch" live={live} />
      </div>

      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(32px,4cqw,56px) clamp(20px,5cqw,64px) clamp(80px,10cqw,128px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 12px",
                font: "500 12px/1 'Geist Mono',monospace",
                letterSpacing: ".06em",
                color: "#D4A64A",
              }}
            >
              OCTOBER 2026 · THE LORD REIGNS · DAY 15 OF 26
            </p>
            <h1 style={{ margin: 0, font: "300 clamp(36px,5cqw,64px)/1.05 Geist,sans-serif", letterSpacing: "-.015em" }}>
              Watch
            </h1>
          </div>
          <p style={{ margin: 0, color: "#A9AEC2", fontSize: 16 }}>
            Every night at 11:59 PM WAT · <strong style={{ color: "#F6F1E7", fontWeight: 600 }}>{localTime}</strong>{" "}
            where you are
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
          <div style={{ flex: "2 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              role="region"
              aria-label="Live player"
              style={{
                position: "relative",
                aspectRatio: "16/9",
                borderRadius: 18,
                overflow: "hidden",
                background: "#141829",
                border: "1px solid #262B40",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(135deg,#151929 0 12px,#11142200 12px 24px),#121524",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 50% 120%,rgba(224,138,79,.25),transparent 60%),linear-gradient(180deg,rgba(11,13,23,.2),rgba(11,13,23,.75))",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  font: "11px/1.4 'Geist Mono',ui-monospace,monospace",
                  color: "rgba(169,174,194,.7)",
                }}
              >
                [ {platformName} embed · poster still ]
              </span>

              {live && (
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
                      background: "#C62F2F",
                      color: "#FFFFFF",
                      font: "500 13px/1 'Geist Mono',monospace",
                      letterSpacing: ".06em",
                    }}
                  >
                    <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#FFFFFF" }} />
                    LIVE NOW
                  </span>
                  <button
                    type="button"
                    aria-label="Play live stream"
                    className="hc-pill-gold"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 88,
                      height: 88,
                      borderRadius: "50%",
                      border: 0,
                      background: "#D4A64A",
                      color: "#0B0D17",
                      font: "400 28px/1 Geist,sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    ▶
                  </button>
                </>
              )}

              {!live && (
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
                  <p
                    style={{
                      margin: 0,
                      font: "500 12px/1 'Geist Mono',monospace",
                      letterSpacing: ".06em",
                      color: "#A9AEC2",
                    }}
                  >
                    TONIGHT&apos;S SESSION BEGINS IN
                  </p>
                  <p
                    aria-hidden="true"
                    style={{
                      margin: 0,
                      font: "300 clamp(48px,8cqw,104px)/1 Geist,sans-serif",
                      fontVariantNumeric: "tabular-nums",
                      color: "#D4A64A",
                      letterSpacing: "-.02em",
                    }}
                  >
                    {hh}:{mm}:{ss}
                  </p>
                  <Link
                    href="/#app"
                    className="hc-pill-outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      minHeight: 44,
                      padding: "0 22px",
                      borderRadius: 999,
                      border: "1px solid rgba(246,241,231,.4)",
                      color: "#F6F1E7",
                      font: "500 15px/1 Geist,sans-serif",
                      textDecoration: "none",
                    }}
                  >
                    Remind me 15 minutes before
                  </Link>
                </div>
              )}

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: horizonBottom,
                  height: 1,
                  background:
                    "linear-gradient(90deg,transparent,#D4A64A 30%,#F2D898 50%,#D4A64A 70%,transparent)",
                  boxShadow: "0 0 20px 1px rgba(212,166,74,.45)",
                  transition: "bottom 700ms ease-out",
                }}
              />
            </div>

            <div role="tablist" aria-label="Choose a platform" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PLATFORMS.map(([name], i) => {
                const sel = platform === i;
                return (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={sel}
                    onClick={() => setPlatform(i)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      minHeight: 44,
                      padding: "0 18px",
                      borderRadius: 999,
                      border: `1px solid ${sel ? "#F6F1E7" : "#262B40"}`,
                      background: sel ? "#F6F1E7" : "#141829",
                      color: sel ? "#0B0D17" : "#F6F1E7",
                      font: "500 15px/1 Geist,sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    {sel && <span aria-hidden="true">✓</span>}
                    {name}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: "16px 20px",
                borderRadius: 12,
                background: "#141829",
                border: "1px solid #262B40",
              }}
            >
              <p style={{ margin: 0, font: "400 16px/1.5 Geist,sans-serif", color: "#A9AEC2" }}>
                Now showing: <strong style={{ color: "#F6F1E7", fontWeight: 600 }}>{platformName}</strong> ·{" "}
                {platformHandle}
              </p>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 44,
                  font: "500 15px/1 Geist,sans-serif",
                  textUnderlineOffset: 5,
                }}
              >
                Open in {platformName} →
              </a>
            </div>
          </div>

          <aside style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <section aria-labelledby="audio-h" style={CARD}>
              <span
                style={{
                  alignSelf: "flex-start",
                  padding: "5px 10px",
                  borderRadius: 999,
                  border: "1px solid #A9AEC2",
                  color: "#A9AEC2",
                  font: "500 11px/1 'Geist Mono',monospace",
                  letterSpacing: ".06em",
                }}
              >
                LOW DATA
              </span>
              <h2 id="audio-h" style={{ margin: 0, font: "400 26px/1.2 Geist,sans-serif" }}>
                Low on data? Listen to the audio stream.
              </h2>
              <p style={{ margin: 0, font: "400 16px/1.55 Geist,sans-serif", color: "#A9AEC2" }}>
                Audio only on Mixlr. It uses far less data than video and keeps playing with your screen off.
              </p>
              <button
                type="button"
                onClick={() => setAudio((a) => !a)}
                aria-pressed={audio}
                className="hc-pill-tint"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  minHeight: 52,
                  borderRadius: 999,
                  border: "1px solid #D4A64A",
                  background: "transparent",
                  color: "#F6F1E7",
                  font: "600 16px/1 Geist,sans-serif",
                  cursor: "pointer",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 12, color: "#D4A64A" }}>
                  {audio ? "❚❚" : "▶"}
                </span>
                {audio ? "Pause audio" : "Listen to audio only"}
              </button>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 44,
                  font: "500 15px/1 Geist,sans-serif",
                  textUnderlineOffset: 5,
                }}
              >
                Get free data (Nigeria) →
              </a>
            </section>

            <section
              aria-labelledby="tonight-h"
              style={{
                ...CARD,
                background: "radial-gradient(ellipse at 0% 0%,rgba(59,42,107,.8),#141829 75%)",
              }}
            >
              <p
                id="tonight-h"
                style={{
                  margin: 0,
                  font: "500 12px/1 'Geist Mono',monospace",
                  letterSpacing: ".06em",
                  color: "#A9AEC2",
                }}
              >
                TONIGHT · HE SITS ENTHRONED
              </p>
              <span aria-hidden="true" style={{ width: 40, height: 1, background: "#D4A64A" }} />
              <blockquote style={{ margin: 0, font: "300 22px/1.4 Geist,sans-serif" }}>
                The LORD reigns; let the peoples tremble! He dwells between the cherubim; let the earth be moved!
              </blockquote>
              <p
                style={{
                  margin: 0,
                  font: "500 12px/1 'Geist Mono',monospace",
                  letterSpacing: ".06em",
                  color: "#D4A64A",
                }}
              >
                PSALM 99:1
              </p>
              {/* TODO: no prayer-points section exists yet; links to the home page. */}
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 44,
                  font: "500 15px/1 Geist,sans-serif",
                  textUnderlineOffset: 5,
                }}
              >
                Tonight&apos;s prayer points →
              </Link>
            </section>
          </aside>
        </div>

        {/* -------------------------------------------------------- ARCHIVE */}
        <section
          id="archive"
          aria-labelledby="arch-h"
          style={{
            marginTop: "clamp(72px,9cqw,112px)",
            paddingTop: "clamp(48px,6cqw,72px)",
            borderTop: "1px solid #262B40",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  font: "500 12px/1 'Geist Mono',monospace",
                  letterSpacing: ".06em",
                  color: "#A9AEC2",
                }}
              >
                REPLAYS ARCHIVE
              </p>
              <h2 id="arch-h" style={{ margin: 0, font: "300 clamp(32px,4.2cqw,52px)/1.08 Geist,sans-serif" }}>
                Every night, kept.
              </h2>
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
                <select value={day} onChange={(e) => setDay(e.target.value)} style={{ ...SELECT, minWidth: 140 }}>
                  <option value="all">All days</option>
                  {Array.from({ length: ed.days }, (_, i) => (
                    <option key={i} value={String(i + 1)}>
                      Day {i + 1}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <p aria-live="polite" style={{ margin: "0 0 20px", font: "400 15px/1 Geist,sans-serif", color: "#A9AEC2" }}>
            {replays.length} {replays.length === 1 ? "replay" : "replays"} · {ed.label}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,250px),1fr))",
              gap: "24px 20px",
            }}
          >
            {replays.map((r) => (
              <a
                key={`${edition}-${r.day}`}
                href={r.href}
                target="_blank"
                rel="noopener"
                style={{ display: "flex", flexDirection: "column", gap: 12, color: "#F6F1E7", textDecoration: "none" }}
              >
                <div
                  role="img"
                  aria-label={r.alt}
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid #262B40",
                    background: r.bg,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      padding: "4px 8px",
                      borderRadius: 5,
                      background: "rgba(11,13,23,.85)",
                      font: "600 12px/1 Geist,sans-serif",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {r.dur}
                  </span>
                </div>
                <p style={{ margin: 0, font: "500 15px/1.3 Geist,sans-serif", fontVariantNumeric: "tabular-nums" }}>
                  Day {r.day} · {r.date} · <span style={{ color: "#A9AEC2" }}>{r.dur}</span>
                </p>
              </a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
