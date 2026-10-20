import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  href: string;
  /** Pill buttons for primary actions; "text" for the quieter inline links. */
  variant?: "text" | "gold" | "cream" | "outline";
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: CSSProperties;
  className?: string;
  "aria-label"?: string;
}

const BASE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  fontFamily: "var(--font-sans)",
  whiteSpace: "nowrap",
};

const PILL: CSSProperties = {
  minHeight: 54,
  padding: "0 30px",
  borderRadius: "var(--r-pill)",
  font: "600 16px/1 var(--font-sans)",
  justifyContent: "center",
};

/** A link whose arrow slides on hover — the site's standard call to action. */
export default function ArrowLink({
  children,
  href,
  variant = "text",
  external = false,
  onClick,
  style,
  className,
  ...rest
}: Props) {
  const skin: CSSProperties =
    variant === "gold"
      ? { ...PILL, background: "var(--accent)", color: "var(--bg)" }
      : variant === "cream"
        ? { ...PILL, background: "var(--cream)", color: "var(--ink)" }
        : variant === "outline"
          ? { ...PILL, border: "1px solid var(--hairline-strong)", color: "var(--fg)" }
          : {
              minHeight: 44,
              color: "var(--accent)",
              font: "500 16px/1 var(--font-sans)",
              textUnderlineOffset: 5,
            };

  const hoverClass =
    variant === "gold"
      ? "hc-pill-gold"
      : variant === "cream"
        ? "hc-pill-cream"
        : variant === "outline"
          ? "hc-pill-outline"
          : "";

  const cls = ["hc-t", "hc-arrow", hoverClass, className].filter(Boolean).join(" ");
  const body = (
    <>
      {children}
      <span data-mark aria-hidden="true">
        →
      </span>
    </>
  );
  const css = { ...BASE, ...skin, ...style };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cls} style={css} onClick={onClick} {...rest}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} style={css} onClick={onClick} {...rest}>
      {body}
    </Link>
  );
}
