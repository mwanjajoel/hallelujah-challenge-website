"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

type Variant = "rise" | "sharpen";

interface Props {
  children: ReactNode;
  /** "rise" travels and blurs; "sharpen" is lighter, for dense groups. */
  variant?: Variant;
  /** Position within a staggered group. Each step adds --stagger seconds. */
  index?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * Reveals its children once they scroll into view.
 *
 * Content starts hidden, so the failure modes matter more than the animation:
 * anything already on screen at mount reveals immediately rather than waiting
 * for an observer callback, a browser without IntersectionObserver reveals
 * everything at once, and a safety timer catches the case where the observer
 * exists but never fires. Reduced motion is handled in CSS, which forces the
 * end state rather than merely disabling the transition.
 */
export default function Reveal({
  children,
  variant = "rise",
  index = 0,
  as: Tag = "div",
  className = "",
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    // threshold 0 rather than a fraction: a section taller than the viewport
    // can never reach a fractional threshold, and would never reveal.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    // Observing reports the current state on its own, so anything already on
    // screen at mount reveals without a separate measurement here.
    io.observe(el);

    // Failsafe: never leave content permanently invisible.
    const t = setTimeout(() => setShown(true), 8000);

    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [shown]);

  const cls = [variant === "rise" ? "hc-reveal" : "hc-sharpen", className].filter(Boolean).join(" ");

  return (
    <Tag
      ref={ref}
      className={cls}
      data-in={shown ? "true" : "false"}
      style={{ ...style, ["--i" as string]: index }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
