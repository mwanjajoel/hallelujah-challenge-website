/**
 * Session state for the nightly Hallelujah Challenge broadcast.
 *
 * The programme commences at 11:59 PM WAT, which is 22:59 UTC, and runs for an
 * hour. Both the home page and the watch page derive their countdown and their
 * "live" badges from this.
 */

export type SessionMode = "auto" | "countdown" | "live";

export interface SessionState {
  /** True while tonight's session is on air. */
  live: boolean;
  /** Milliseconds until the next session starts. Zero while live. */
  rem: number;
}

const HOUR = 3600000;
const DAY = 86400000;

export function session(now: number, mode: SessionMode = "auto"): SessionState {
  if (mode === "live") return { live: true, rem: 0 };

  const d = new Date(now);
  let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 22, 59, 0);
  if (now >= t + HOUR) t += DAY;

  let live = now >= t;
  if (live && mode === "countdown") {
    t += DAY;
    live = false;
  }

  return { live, rem: Math.max(0, t - now) };
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
