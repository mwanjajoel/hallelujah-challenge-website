"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks an element's width through a ResizeObserver.
 *
 * The design branches a handful of layout values on the measured width rather
 * than on media queries. There is no width on the server, so the initial value
 * is the design's own 1280px desktop assumption; the real width lands on mount.
 */
export function useElementWidth(initial = 1280) {
  const [width, setWidth] = useState(initial);
  const elRef = useRef<HTMLElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((el: HTMLElement | null) => {
    if (el === elRef.current) return;
    roRef.current?.disconnect();
    elRef.current = el;
    if (!el) return;

    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      if (w) setWidth((prev) => (prev === w ? prev : w));
    });
    ro.observe(el);
    roRef.current = ro;

    const w = Math.round(el.getBoundingClientRect().width);
    if (w) setWidth(w);
  }, []);

  useEffect(() => () => roRef.current?.disconnect(), []);

  return [width, ref] as const;
}
