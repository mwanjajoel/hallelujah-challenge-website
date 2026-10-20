import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Seconds for one full pass. Longer is calmer; this should feel ambient. */
  duration?: number;
  reverse?: boolean;
  /** Fade the track out at both edges instead of cutting it off. */
  fade?: boolean;
  gap?: number;
  style?: CSSProperties;
  "aria-label"?: string;
}

/**
 * A continuously scrolling row.
 *
 * The track is rendered twice and travels exactly -50%, so the loop is
 * seamless. Only the first copy is exposed to assistive technology; the second
 * is decorative duplication. The animation is suppressed under reduced motion
 * by the global rule, which leaves a readable static row.
 */
export default function Marquee({
  children,
  duration = 90,
  reverse = false,
  fade = true,
  gap = 14,
  style,
  ...rest
}: Props) {
  const track: CSSProperties = {
    display: "flex",
    gap,
    flex: "none",
    minWidth: "max-content",
    paddingRight: gap,
  };

  return (
    <div
      style={{
        overflow: "hidden",
        maskImage: fade ? "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" : undefined,
        WebkitMaskImage: fade ? "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" : undefined,
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: `hc-marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div style={track}>{children}</div>
        <div style={track} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/** The small rounded label used inside marquee rows. */
export function Chip({ children, tone = "line" }: { children: ReactNode; tone?: "line" | "accent" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 16px",
        borderRadius: "var(--r-pill)",
        border: `1px solid ${tone === "accent" ? "rgba(212,166,74,.45)" : "var(--hairline)"}`,
        background: tone === "accent" ? "var(--accent-soft)" : "var(--glass)",
        color: tone === "accent" ? "var(--accent-bright)" : "var(--fg-muted)",
        font: "500 13px/1 var(--font-mono)",
        letterSpacing: ".04em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
