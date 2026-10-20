/**
 * Session state for the Hallelujah Challenge broadcast.
 *
 * The programme commences at 11:59 PM WAT, which is 22:59 UTC, and runs for an
 * hour. Both the home page and the watch page derive their countdown and their
 * "live" badges from this.
 *
 * It used to assume a session every night in perpetuity: take today, set
 * 22:59, roll to tomorrow once that hour had passed. That is why the site
 * promised a broadcast on nights there was none — the October 2026 edition
 * ended on the 17th and the hero kept counting. The schedule now comes from
 * the edition calendar, and when no edition covers tonight the honest answer
 * is that nothing is scheduled rather than a number.
 */

import { START_UTC_HOUR, START_UTC_MINUTE, nextNight } from "./edition";

export type SessionMode = "auto" | "countdown" | "live";

export interface SessionState {
  /** True while a session is on air. */
  live: boolean;
  /** Milliseconds until the next session starts. Zero while live. */
  rem: number;
  /** False between editions, when there is no next session to count to. */
  scheduled: boolean;
}

const HOUR = 3600000;
const DAY = 86400000;

/** Tonight's 22:59 UTC, or tomorrow's once tonight's session has finished. */
function nextClockTime(now: number): number {
  const d = new Date(now);
  const t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), START_UTC_HOUR, START_UTC_MINUTE, 0);
  return now >= t + HOUR ? t + DAY : t;
}

export function session(now: number, mode: SessionMode = "auto"): SessionState {
  if (mode === "live") return { live: true, rem: 0, scheduled: true };

  // The override exists to demonstrate the countdown out of season, so it
  // ignores the calendar on purpose — otherwise it would show the very
  // off-season state it is there to get past.
  if (mode === "countdown") {
    let t = nextClockTime(now);
    if (now >= t) t += DAY;
    return { live: false, rem: Math.max(0, t - now), scheduled: true };
  }

  const t = nextNight(now);
  if (t === null) return { live: false, rem: 0, scheduled: false };

  return { live: now >= t, rem: Math.max(0, t - now), scheduled: true };
}

export const pad = (n: number) => String(n).padStart(2, "0");

/** Splits a remaining-millisecond count into zero-padded hh/mm/ss. */
export function countdown(rem: number) {
  const s = Math.floor(rem / 1000);
  return {
    hh: pad(Math.floor(s / 3600)),
    mm: pad(Math.floor((s % 3600) / 60)),
    ss: pad(s % 60),
  };
}

/**
 * Reads a `?session=live|countdown|auto` override off the URL so the live state
 * can be demonstrated outside the broadcast window. Always returns "auto" on
 * the server, which keeps the first client render matching the server HTML.
 */
export function sessionModeFromLocation(): SessionMode {
  if (typeof window === "undefined") return "auto";
  const v = new URLSearchParams(window.location.search).get("session");
  return v === "live" || v === "countdown" ? v : "auto";
}
