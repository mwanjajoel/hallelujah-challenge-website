"use client";

import { useEffect, useRef } from "react";
import { type OpenVideo, videoTitle } from "./videos";

/**
 * Rendered as a sibling of <main>, never inside it: <main> carries
 * container-type:inline-size, which would become the containing block for this
 * position:fixed overlay and break the full-screen backdrop.
 */
export default function VideoModal({ video, onClose }: { video: OpenVideo; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const title = videoTitle(video.day);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.querySelector<HTMLButtonElement>("[data-close]")?.focus();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    import("motion")
      .then(({ animate }) => {
        if (cancelled) return;
        const backdrop = root.querySelector<HTMLElement>("[data-backdrop]");
        const panel = root.querySelector<HTMLElement>("[data-panel]");
        if (backdrop) animate(backdrop, { opacity: [0, 1] }, { duration: 0.4 });
        if (panel) {
          animate(
            panel,
            { opacity: [0, 1], transform: ["translateY(24px) scale(.97)", "translateY(0px) scale(1)"] },
            { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "grid", placeItems: "center", padding: 20 }}
    >
      <div
        data-backdrop=""
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(11,13,23,.88)", backdropFilter: "blur(10px)" }}
      />
      <div
        data-panel=""
        style={{ position: "relative", width: "min(1100px,100%)", display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <p
            style={{
              margin: 0,
              font: "500 12px/1.3 'Geist Mono',monospace",
              letterSpacing: ".06em",
              color: "#D4A64A",
            }}
          >
            {title}
          </p>
          <button
            type="button"
            data-close=""
            onClick={onClose}
            aria-label="Close"
            className="hc-circle"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid #262B40",
              background: "#141829",
              color: "#F6F1E7",
              font: "400 18px/1 Geist,sans-serif",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            aspectRatio: "16/9",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #262B40",
            background: "#000",
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
