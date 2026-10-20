/**
 * The edition calendar.
 *
 * Hallelujah Challenge does not broadcast every night. The ministry's own
 * words are that the sessions are "held daily during designated periods every
 * year, as God leads the convener" — so a run of nights, then a gap of weeks
 * or months, then another run. Anything that counts down to "tonight" has to
 * know which of those two it is in.
 *
 * Only editions that could be verified against what the ministry publishes
 * are listed. October 2026 is here because each of its thirteen broadcasts is
 * a real video on the ministry's channel, titled Day 1 through Day 13, with
 * Day 1 uploaded on 5 October and Day 13 on the 17th. Earlier editions are
 * deliberately absent: their dates could not be confirmed, and a guessed date
 * in a calendar is worse than a short calendar.
 *
 * When the next edition is announced, add it here. Nothing else needs to
 * change: the session clock and the watch page both read this.
 */

const HOUR = 3600000;
const DAY = 86400000;

/** Sessions commence at 11:59 PM WAT, which is 22:59 UTC, and run an hour. */
export const START_UTC_HOUR = 22;
export const START_UTC_MINUTE = 59;

export interface Edition {
  label: string;
  /** Midnight UTC on the day of the first session. */
  start: number;
  /** YouTube ids, one per night, in broadcast order. */
  ids: string[];
}

export const EDITIONS: Edition[] = [
  {
    label: "October 2026 · The Lord Reigns",
    start: Date.UTC(2026, 9, 5),
    ids: [
      "-saBS2ggyi4", "Dvp9hyZW2Ys", "2Dxd2wwRLLc", "hUWaCZzU31U", "SN4z3UyvFVE",
      "18KAjo4RmVU", "adUtqYoDOw0", "i0O00TOi-Kw", "FmECe4ZcXB0", "CCDHi8mjfb4",
      "rkc184yQ-kM", "NyDXTX1ghK0", "h7quyM65iVk",
    ],
  },
];

/** The most recent edition — the one the watch page shows replays for. */
export const CURRENT = EDITIONS[EDITIONS.length - 1];

/** When the session on the `i`th night of an edition begins. */
export function nightStart(ed: Edition, i: number): number {
  return ed.start + i * DAY + START_UTC_HOUR * HOUR + START_UTC_MINUTE * 60000;
}

/**
 * The next session at or after `now`, or null when no edition covers it.
 * A session already under way counts as the next one, so a caller can tell
 * "on air" from "starts later" by comparing against `now`.
 */
export function nextNight(now: number): number | null {
  for (const ed of EDITIONS) {
    for (let i = 0; i < ed.ids.length; i++) {
      const t = nightStart(ed, i);
      if (now < t + HOUR) return t;
    }
  }
  return null;
}
