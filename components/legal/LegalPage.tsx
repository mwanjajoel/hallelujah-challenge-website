import fs from "node:fs";
import path from "node:path";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

export type LegalSlug = "privacy" | "terms" | "cookies";

type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "li"; text: string }
  | { kind: "p"; text: string };

/** A numbered, shouting line is a section heading: "4. USER-GENERATED CONTENT". */
const isSectionHeading = (l: string) => /^\d+\.\s/.test(l) && l === l.toUpperCase();
/** A decimal-numbered line is a sub-heading: "1.1. Personal Information". */
const isSubHeading = (l: string) => /^\d+\.\d+\.?\s/.test(l);
const isBullet = (l: string) => /^[••\-–]\s/.test(l);

/**
 * Reads the policy text captured from the live site and classifies it.
 *
 * The text lives in content/legal/*.txt verbatim rather than inline here, so
 * the wording is exactly what is published and can be re-extracted when the
 * ministry updates it — nobody has to retype a policy by hand.
 */
function readLegal(slug: LegalSlug) {
  const file = path.join(process.cwd(), "content", "legal", `${slug}.txt`);
  const lines = fs.readFileSync(file, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);

  const title = lines[0] ?? "";
  let updated: string | null = null;
  const blocks: Block[] = [];

  for (const line of lines.slice(1)) {
    if (/^last updated/i.test(line)) {
      updated = line;
    } else if (isSectionHeading(line)) {
      blocks.push({ kind: "h2", text: line });
    } else if (isSubHeading(line)) {
      blocks.push({ kind: "h3", text: line });
    } else if (isBullet(line)) {
      blocks.push({ kind: "li", text: line.replace(/^[••\-–]\s*/, "") });
    } else {
      blocks.push({ kind: "p", text: line });
    }
  }

  return { title, updated, blocks };
}

/** Title case a shouting heading, keeping the leading number. */
function softenHeading(text: string) {
  const m = text.match(/^(\d+\.)\s*(.*)$/);
  const body = (m ? m[2] : text)
    .toLowerCase()
    .replace(/\b([a-z])/g, (c) => c.toUpperCase())
    .replace(/\b(And|Or|Of|The|To|A|An|For|In|On|With)\b/g, (w) => w.toLowerCase());
  return { number: m ? m[1] : null, body: body.charAt(0).toUpperCase() + body.slice(1) };
}

const META = {
  privacy: { eyebrow: "LEGAL", lead: "How we collect, use and protect your information." },
  terms: { eyebrow: "LEGAL", lead: "The agreement between you and the Hallelujah Challenge." },
  cookies: { eyebrow: "LEGAL", lead: "How cookies and similar technologies are used here." },
} as const;

const OTHERS: Record<LegalSlug, Array<[string, string]>> = {
  privacy: [["Terms and Conditions", "/terms"], ["Cookies Policy", "/cookies"]],
  terms: [["Privacy Policy", "/privacy"], ["Cookies Policy", "/cookies"]],
  cookies: [["Privacy Policy", "/privacy"], ["Terms and Conditions", "/terms"]],
};

export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const { title, updated, blocks } = readLegal(slug);
  const meta = META[slug];
  const heading = softenHeading(title);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader />
      </div>

      <main>
        <Section aria-label={title} width="narrow" glow="gold" glowAt="30% 8%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(18px, 2.4vw, 28px)" }}>
            <p style={{ margin: 0, font: "500 12px/1 var(--font-mono)", letterSpacing: ".14em", color: "var(--accent)" }}>
              {meta.eyebrow}
            </p>
            <Display as="h1" size="xl">
              {heading.body.split(" ").slice(0, -1).join(" ")}{" "}
              <Accent gold>{heading.body.split(" ").slice(-1)}</Accent>
            </Display>
            <p
              style={{
                margin: 0,
                maxWidth: "48ch",
                font: "400 clamp(17px, 1.5vw, 20px)/1.7 var(--font-sans)",
                color: "var(--fg-muted)",
                textWrap: "pretty",
              }}
            >
              {meta.lead}
            </p>
            {updated && (
              <p style={{ margin: 0, font: "500 12px/1 var(--font-mono)", letterSpacing: ".08em", color: "var(--fg-muted)" }}>
                {updated.toUpperCase()}
              </p>
            )}
          </Reveal>
        </Section>

        <Section aria-label={`${title} body`} tight width="narrow">
          <Reveal variant="sharpen">
            <article style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {blocks.map((b, i) => {
                if (b.kind === "h2") {
                  const h = softenHeading(b.text);
                  return (
                    <h2
                      key={i}
                      style={{
                        margin: "clamp(30px, 4vw, 48px) 0 14px",
                        display: "flex",
                        gap: 14,
                        alignItems: "baseline",
                        font: "400 clamp(22px, 2.3vw, 32px)/1.25 var(--font-display)",
                        color: "var(--fg)",
                      }}
                    >
                      {h.number && (
                        <span aria-hidden="true" style={{ font: "500 13px/1 var(--font-mono)", color: "var(--accent)", flex: "none" }}>
                          {h.number}
                        </span>
                      )}
                      {h.body}
                    </h2>
                  );
                }
                if (b.kind === "h3") {
                  return (
                    <h3
                      key={i}
                      style={{
                        margin: "22px 0 6px",
                        font: "600 16px/1.45 var(--font-sans)",
                        color: "var(--fg)",
                        letterSpacing: ".005em",
                      }}
                    >
                      {b.text}
                    </h3>
                  );
                }
                if (b.kind === "li") {
                  return (
                    <p
                      key={i}
                      style={{
                        margin: "6px 0",
                        paddingLeft: 22,
                        position: "relative",
                        font: "400 16px/1.75 var(--font-sans)",
                        color: "var(--fg-muted)",
                        textWrap: "pretty",
                      }}
                    >
                      <span aria-hidden="true" style={{ position: "absolute", left: 2, color: "var(--accent)" }}>
                        &middot;
                      </span>
                      {b.text}
                    </p>
                  );
                }
                return (
                  <p
                    key={i}
                    style={{
                      margin: "8px 0",
                      font: "400 16px/1.8 var(--font-sans)",
                      color: "var(--fg-muted)",
                      textWrap: "pretty",
                    }}
                  >
                    {b.text}
                  </p>
                );
              })}
            </article>
          </Reveal>

          <Reveal
            index={1}
            style={{
              marginTop: "clamp(40px, 5vw, 64px)",
              paddingTop: 26,
              borderTop: "1px solid var(--line)",
              display: "flex",
              flexWrap: "wrap",
              gap: "14px 30px",
            }}
          >
            {OTHERS[slug].map(([label, href]) => (
              <ArrowLink key={href} href={href}>
                {label}
              </ArrowLink>
            ))}
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
