import type { CSSProperties, ReactNode } from "react";

type Tone = "dark" | "cream";
type Width = "wide" | "default" | "text" | "narrow";

const WIDTH: Record<Width, string> = {
  wide: "var(--max-wide)",
  default: "var(--max)",
  text: "var(--col-wide)",
  narrow: "var(--col)",
};

interface Props {
  children: ReactNode;
  id?: string;
  tone?: Tone;
  width?: Width;
  /** Shorter vertical rhythm, for sections that sit against a neighbour. */
  tight?: boolean;
  /** A radial colour bleed behind the content. */
  glow?: "gold" | "blue" | "ember" | null;
  glowAt?: string;
  className?: string;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * A page section: vertical rhythm, max width, gutters, and an optional glow.
 *
 * The glow is `overflow: clip` rather than `hidden` — it bleeds past the edge
 * by design, and `hidden` would make the section a scroll container that jumps
 * sideways whenever something inside it takes focus.
 */
export default function Section({
  children,
  id,
  tone = "dark",
  width = "default",
  tight = false,
  glow = null,
  glowAt = "50% 0%",
  className,
  style,
  innerStyle,
  ...rest
}: Props) {
  const pad = tight ? "var(--pad-y-sm)" : "var(--pad-y)";

  return (
    <section
      id={id}
      className={className}
      style={{
        position: "relative",
        overflow: "clip",
        background: tone === "cream" ? "var(--cream)" : "transparent",
        color: tone === "cream" ? "var(--ink)" : "var(--fg)",
        ...style,
      }}
      {...rest}
    >
      {glow && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-20% -10%",
            background: `radial-gradient(60% 55% at ${glowAt}, var(--glow-${glow}), transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          maxWidth: WIDTH[width],
          margin: "0 auto",
          padding: `${pad} var(--gutter)`,
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </section>
  );
}
