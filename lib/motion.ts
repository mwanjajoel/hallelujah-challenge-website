/**
 * The site's motion vocabulary, in one place.
 *
 * Three rules give the site its feel, and they are worth keeping even if the
 * numbers change:
 *
 *  1. One easing. Everything uses easeOutQuint — fast departure, long settle.
 *  2. Long durations. Entrances run near a second, hovers near half of one.
 *  3. Properties land at different moments. Opacity and blur resolve before the
 *     transform finishes, so an element is already readable while it is still
 *     coming to rest.
 *
 * Blur is the distinguishing one: fading and rising is ordinary, but sharpening
 * into focus is what actually reads as smooth. It is reserved for text and
 * cards — never full-bleed imagery, where it costs real frames.
 *
 * These values are mirrored as custom properties in `app/globals.css`; CSS owns
 * the declarative transitions, and this module serves the `motion` runtime.
 */

/** easeOutQuint. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DURATION = {
  /** Hovers and small state flips. */
  hover: 0.55,
  /** The standard entrance for opacity and blur. */
  enter: 0.9,
  /** Larger pieces, and anything carrying a headline. */
  enterSlow: 1.1,
  /** Transforms trail the fade so the settle is still visible. */
  transform: 1.4,
} as const;

/** Seconds between successive items in a staggered group. */
export const STAGGER = 0.11;

/** Delay for the nth item of a staggered group. */
export const stagger = (index: number, startDelay = 0) => startDelay + index * STAGGER;

/** The signature entrance, as `motion` keyframes. */
export const RISE = {
  opacity: [0, 1],
  filter: ["blur(12px)", "blur(0px)"],
  transform: ["translateY(24px) scale(0.97)", "translateY(0px) scale(1)"],
} as const;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
