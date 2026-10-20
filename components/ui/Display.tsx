import type { CSSProperties, ElementType, ReactNode } from "react";

type Size = "hero" | "xl" | "lg" | "md" | "sm";

/**
 * The display scale. Line height tightens and tracking goes further negative
 * as the size grows, which is what keeps very large serif settings from
 * looking loose.
 */
const SIZE: Record<Size, CSSProperties> = {
  hero: { fontSize: "clamp(52px, 9.5vw, 144px)", lineHeight: 0.95, letterSpacing: "-0.045em" },
  xl: { fontSize: "clamp(40px, 6.5vw, 104px)", lineHeight: 0.98, letterSpacing: "-0.035em" },
  lg: { fontSize: "clamp(34px, 4.6vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.03em" },
  md: { fontSize: "clamp(27px, 3.2vw, 46px)", lineHeight: 1.12, letterSpacing: "-0.02em" },
  sm: { fontSize: "clamp(22px, 2.2vw, 32px)", lineHeight: 1.2, letterSpacing: "-0.015em" },
};

interface Props {
  children: ReactNode;
  size?: Size;
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/** Display type, set in the serif. Italic is the accent — see `Accent`. */
export default function Display({ children, size = "lg", as: Tag = "h2", id, className, style }: Props) {
  return (
    <Tag
      id={id}
      className={className}
      style={{
        margin: 0,
        fontFamily: "var(--font-display)",
        fontWeight: 400,
        textWrap: "balance",
        ...SIZE[size],
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * The emphasised span inside a headline. Italic does the work; colour is
 * optional and should stay rare, or it stops reading as emphasis.
 */
export function Accent({
  children,
  gold = false,
  style,
}: {
  children: ReactNode;
  gold?: boolean;
  style?: CSSProperties;
}) {
  return <em style={{ fontStyle: "italic", color: gold ? "var(--accent)" : "inherit", ...style }}>{children}</em>;
}
