import type { CSSProperties, ReactNode } from "react";

type Radius = "xl" | "lg" | "md" | "sm";

const RADIUS: Record<Radius, string> = {
  xl: "var(--r-xl)",
  lg: "var(--r-lg)",
  md: "var(--r-md)",
  sm: "var(--r-sm)",
};

interface Props {
  children: ReactNode;
  radius?: Radius;
  /** Glass sits over whatever is behind it; solid is opaque surface. */
  variant?: "glass" | "solid" | "cream";
  /** A radial bleed inside the card, behind its content. */
  glow?: "gold" | "blue" | "ember" | null;
  glowAt?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  role?: string;
}

/**
 * A surface. Glass is the default because translucency over the page's own
 * glows is what gives the layout depth — a flat fill kills it.
 */
export default function Card({
  children,
  radius = "md",
  variant = "glass",
  glow = null,
  glowAt = "0% 0%",
  className,
  style,
  ...rest
}: Props) {
  const skin: CSSProperties =
    variant === "glass"
      ? { background: "var(--glass)", border: "1px solid var(--hairline)", backdropFilter: "blur(14px)" }
      : variant === "cream"
        ? { background: "var(--panel)", color: "var(--on-panel)", border: "1px solid var(--hairline)" }
        : { background: "var(--surface)", border: "1px solid var(--line)" };

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "clip", borderRadius: RADIUS[radius], ...skin, ...style }}
      {...rest}
    >
      {glow && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: `radial-gradient(70% 70% at ${glowAt}, var(--glow-${glow}), transparent 72%)`,
            pointerEvents: "none",
          }}
        />
      )}
      {/* height:100% matters: this wrapper is the containing block for any
          absolutely positioned child, and without it a card whose children are
          all absolute (a player, a video) collapses the wrapper to zero height,
          so `inset: 0` resolves against nothing and the content spills out of
          the top. Against an auto-height card this resolves to auto, so
          ordinary cards are unaffected. */}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  );
}
