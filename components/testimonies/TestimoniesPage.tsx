"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import raw from "@/content/live/testimonies.json";

/**
 * The real archive, extracted from the ministry's own blog at
 * hallelujahchallengelive.com/blog — 110 testimonies, verbatim, with the
 * post each one came from.
 *
 * This replaced twelve invented testimonies that had stood here: made-up
 * quotes attributed to made-up people in named countries. One of them was a
 * real person's words from the live home page re-attributed to a different
 * name. Nothing on this page is written by us now; it is quoted, and every
 * card links back to its source so a reader can check.
 *
 * The live posts carry no country, and their categories could not be read
 * reliably (the blog's category listings paginate client-side, so only the
 * first seven of each are reachable). So neither is shown. The filters that
 * used to offer them are gone rather than filled with guesses.
 */
interface Testimony {
  slug: string;
  title: string;
  date: string;
  url: string;
  /** The name the writer signed off with, where they signed one. */
  signature: string;
  body: string[];
}

const TESTIMONIES = raw as Testimony[];

/** How many to show before the reader asks for more. */
const PAGE = 12;

const FIELD: CSSProperties = {
  minHeight: 52,
  padding: "0 16px",
  borderRadius: "var(--r-sm)",
  background: "#fff",
  border: "1px solid #cfc7b5",
  color: "var(--ink)",
  font: "400 17px/1 var(--font-sans)",
};

const FIELD_LABEL: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  font: "500 15px/1.3 var(--font-sans)",
};

const EYEBROW: CSSProperties = {
  margin: 0,
  font: "500 12px/1 var(--font-mono)",
  letterSpacing: ".14em",
};

export default function TestimoniesPage() {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [width, setWidth] = useState(1280);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  // Searching the whole archive, title and body alike — with 110 of them,
  // scrolling is not a way to find the one about a visa or a job.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TESTIMONIES;
    return TESTIMONIES.filter(
      (t) => t.title.toLowerCase().includes(q) || t.body.join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  const list = matches.slice(0, shown);
  const cols = width < 700 ? 1 : width < 1060 ? 2 : 3;

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="testimonies" />
      </div>

      <main>
        {/* ------------------------------------------------------------ HERO */}
        <Section
          aria-label="Testimonies"
          width="text"
          className="hc-on-dark"
          style={{ background: "linear-gradient(180deg, #14172a 0%, #1a1630 40%, #3a2433 76%, #5e3530 100%)" }}
          innerStyle={{ textAlign: "center" }}
        >
          <div
            aria-hidden="true"
            className="hc-drift"
            style={{
              position: "absolute",
              inset: "40% -10% -30%",
              background: "radial-gradient(55% 70% at 50% 100%, rgba(224,138,79,.42), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <Reveal style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <p style={{ ...EYEBROW, color: "#E9B48C" }}>TESTIMONIES · THE MORNING AFTER</p>
            <Display as="h1" size="hero" style={{ maxWidth: "13ch" }}>
              His mercy endures <Accent>forever</Accent>
            </Display>
            <p style={{ ...EYEBROW, color: "var(--accent)" }}>PSALM 136:1</p>
            <ArrowLink href="#share" variant="cream">
              Share what God has done
            </ArrowLink>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------------ GRID */}
        <Section
          aria-labelledby="grid-h"
          tight
          style={{ background: "var(--bg)" }}
          // Full-bleed and behind the content. As a child it would be a
          // positioned element among static siblings, so it painted over the
          // filters and the first row of cards.
          backdrop={
            <div
              style={{
                position: "absolute",
                inset: "0 0 auto 0",
                height: "clamp(120px, 18vw, 240px)",
                background: "linear-gradient(180deg, #5e3530 0%, #2a1d2a 46%, transparent 100%)",
                opacity: 0.55,
              }}
            />
          }
        >
          <h2 id="grid-h" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            All testimonies
          </h2>

          <Reveal style={{ marginBottom: 26 }}>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                maxWidth: 420,
                font: "500 13px/1 var(--font-sans)",
                color: "var(--fg-muted)",
              }}
            >
              Search the testimonies
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShown(PAGE);
                }}
                placeholder="healing, visa, job, school fees…"
                className="hc-t hc-input"
                style={{
                  minHeight: 48,
                  padding: "0 14px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--surface)",
                  border: "1px solid var(--hairline-strong)",
                  color: "var(--fg)",
                  font: "400 16px/1 var(--font-sans)",
                }}
              />
            </label>
          </Reveal>

          <p aria-live="polite" style={{ margin: "0 0 20px", font: "400 15px/1 var(--font-sans)", color: "var(--fg-muted)" }}>
            Showing {list.length} of {matches.length} {matches.length === 1 ? "testimony" : "testimonies"}
          </p>

          <div style={{ columns: cols, columnGap: 16 }}>
            {list.map((t, i) => (
              <Reveal
                key={t.slug}
                variant="sharpen"
                index={i % 6}
                style={{ breakInside: "avoid", marginBottom: 16 }}
              >
                <Card variant="cream" radius="md" style={{ padding: 28 }}>
                  <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-display)",
                        fontSize: 25,
                        lineHeight: 1.25,
                        fontWeight: 400,
                        textWrap: "pretty",
                      }}
                    >
                      {t.title}
                    </h3>
                    <blockquote style={{ margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {t.body.map((para, n) => (
                        <p key={n} style={{ margin: 0, font: "400 16px/1.65 var(--font-sans)", textWrap: "pretty" }}>
                          {para}
                        </p>
                      ))}
                    </blockquote>
                    <figcaption style={{ font: "600 15px/1.4 var(--font-sans)" }}>
                      {t.signature && <span>&mdash; {t.signature}</span>}
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noopener"
                        className="hc-t"
                        style={{
                          display: "block",
                          marginTop: 8,
                          font: "500 13px/1 var(--font-sans)",
                          color: "var(--on-panel)",
                          opacity: 0.7,
                          textUnderlineOffset: 4,
                        }}
                      >
                        Read on hallelujahchallengelive.com
                      </a>
                    </figcaption>
                  </figure>
                </Card>
              </Reveal>
            ))}
          </div>

          {shown < matches.length && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE)}
                className="hc-t hc-pill-outline"
                style={{
                  minHeight: 54,
                  padding: "0 30px",
                  borderRadius: "var(--r-pill)",
                  border: "1px solid var(--hairline-strong)",
                  background: "transparent",
                  color: "var(--fg)",
                  font: "600 16px/1 var(--font-sans)",
                  cursor: "pointer",
                }}
              >
                Show more testimonies
              </button>
            </div>
          )}

          {list.length === 0 && (
            <p
              style={{
                margin: 0,
                padding: 40,
                border: "1px dashed var(--hairline-strong)",
                borderRadius: "var(--r-md)",
                textAlign: "center",
                color: "var(--fg-muted)",
              }}
            >
              Nothing matches that search. Try a single word — healing, visa, job.
            </p>
          )}

          <p style={{ margin: "24px 0 0", font: "400 14px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
            Testimonies are personal accounts of faith, published by the ministry on its own blog and quoted
            here in full.
          </p>
        </Section>

        {/* ----------------------------------------------------------- SHARE */}
        <Section id="share" aria-labelledby="share-h" tone="cream" width="text" style={{ scrollMarginTop: 80 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "clamp(36px, 6vw, 76px)",
            }}
          >
            <Reveal style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ ...EYEBROW, color: "var(--panel-muted)" }}>SHARE YOUR TESTIMONY</p>
              <Display id="share-h" size="lg">
                What has <Accent>God done?</Accent>
              </Display>
              <p style={{ margin: 0, font: "400 18px/1.65 var(--font-sans)", color: "var(--panel-muted)", textWrap: "pretty" }}>
                Tell it in your own words. We may share your story to encourage others; we will only use your first
                name and country.
              </p>
            </Reveal>

            <Reveal index={1}>
              {!sent ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
                      gap: 16,
                    }}
                  >
                    <label style={FIELD_LABEL}>
                      First name
                      <input type="text" required autoComplete="given-name" className="hc-t hc-input-dark" style={FIELD} />
                    </label>
                    <label style={FIELD_LABEL}>
                      Country
                      <input type="text" required autoComplete="country-name" className="hc-t hc-input-dark" style={FIELD} />
                    </label>
                  </div>

                  <label style={FIELD_LABEL}>
                    Category
                    <select className="hc-t hc-input-dark" style={{ ...FIELD, padding: "0 14px" }} defaultValue="Healing">
                      {["Healing", "Family", "Career", "Visa", "Finances", "Salvation", "Other"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>

                  <label style={FIELD_LABEL}>
                    Your testimony
                    <textarea
                      required
                      rows={6}
                      placeholder="Tell it in your own words."
                      className="hc-t hc-input-dark"
                      style={{
                        padding: "14px 16px",
                        borderRadius: "var(--r-sm)",
                        background: "#fff",
                        border: "1px solid #cfc7b5",
                        color: "var(--ink)",
                        font: "400 17px/1.6 var(--font-sans)",
                        resize: "vertical",
                      }}
                    />
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      font: "400 16px/1.5 var(--font-sans)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      style={{ width: 22, height: 22, marginTop: 2, accentColor: "var(--on-panel)", flex: "none" }}
                    />
                    I agree that the Hallelujah Challenge may share my testimony with my first name and country.
                  </label>

                  <button
                    type="submit"
                    className="hc-t hc-pill-dark"
                    style={{
                      alignSelf: "flex-start",
                      minHeight: 52,
                      padding: "0 30px",
                      borderRadius: "var(--r-pill)",
                      border: 0,
                      background: "var(--on-panel)",
                      color: "var(--panel)",
                      font: "600 16px/1 var(--font-sans)",
                      cursor: "pointer",
                    }}
                  >
                    Send my testimony
                  </button>
                </form>
              ) : (
                <div
                  role="status"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    padding: 32,
                    borderRadius: "var(--r-md)",
                    background: "#fff",
                    border: "1px solid #e5dfd2",
                  }}
                >
                  <Display size="sm">Thank you for testifying.</Display>
                  <p style={{ margin: 0, font: "400 17px/1.6 var(--font-sans)", color: "var(--panel-muted)" }}>
                    Our team reads every testimony. Keep praising.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
