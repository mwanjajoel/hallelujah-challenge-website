"use client";

import { useEffect, useState, type CSSProperties } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

const RAW: Array<[quote: string, name: string, country: string, cat: string]> = [
  ["I reside in the USA, and God healed me.", "Grace", "USA", "Healing"],
  ["After seven years of waiting, our son was born during the June edition.", "Adaeze", "Nigeria", "Family"],
  ["My visa was refused twice. I praised every night of the challenge, and this month it was approved.", "Kwame", "Ghana", "Visa"],
  ["I lost my job in March. On Day 9 I received an offer letter.", "Tunde", "United Kingdom", "Career"],
  ["We cleared a debt our family had carried for four years.", "Wanjiru", "Kenya", "Finances"],
  ["I came for the music. On the third night I gave my life to Jesus.", "Daniel", "Canada", "Salvation"],
  ["My mother and I had not spoken in two years. Now we join at 11:59 together.", "Ruth", "South Africa", "Family"],
  ["The doctors were cautious. We kept praising. My scan came back clear.", "Ifeoma", "Ireland", "Healing"],
  ["I was promoted after four years in the same role. I dressed like my miracle every night.", "Chinedu", "Nigeria", "Career"],
  ["Our study visas came through in the same week.", "Esi", "Ghana", "Visa"],
  ["My husband, who never prayed, now sets the alarm for 11:59.", "Amaka", "USA", "Salvation"],
  ["A business I had given up on received its first big contract.", "Joseph", "Tanzania", "Finances"],
];

const TESTIMONIES = RAW.map(([quote, name, country, cat]) => ({
  quote,
  name,
  country,
  cat,
  catUpper: cat.toUpperCase(),
}));

const CATS = ["All", "Healing", "Family", "Career", "Visa", "Finances", "Salvation"];
const COUNTRIES = ["All countries", ...[...new Set(TESTIMONIES.map((t) => t.country))].sort()];

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
  const [cat, setCat] = useState("All");
  const [country, setCountry] = useState("All countries");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [width, setWidth] = useState(1280);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  const list = TESTIMONIES.filter(
    (t) => (cat === "All" || t.cat === cat) && (country === "All countries" || t.country === country),
  );
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

          <Reveal
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 16,
              marginBottom: 26,
            }}
          >
            <div role="group" aria-label="Filter by category" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATS.map((c) => {
                const sel = cat === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    aria-pressed={sel}
                    className="hc-t hc-pill-outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      minHeight: 44,
                      padding: "0 18px",
                      borderRadius: "var(--r-pill)",
                      border: "1px solid " + (sel ? "var(--panel)" : "var(--hairline-strong)"),
                      background: sel ? "var(--panel)" : "transparent",
                      color: sel ? "var(--on-panel)" : "var(--fg)",
                      font: "500 15px/1 var(--font-sans)",
                      cursor: "pointer",
                    }}
                  >
                    {sel && <span aria-hidden="true">&#10003;</span>}
                    {c}
                  </button>
                );
              })}
            </div>

            <label
              style={{ display: "flex", flexDirection: "column", gap: 6, font: "500 13px/1 var(--font-sans)", color: "var(--fg-muted)" }}
            >
              Country
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="hc-t hc-input"
                style={{
                  minHeight: 48,
                  minWidth: 200,
                  padding: "0 14px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--surface)",
                  border: "1px solid var(--hairline-strong)",
                  color: "var(--fg)",
                  font: "500 16px/1 var(--font-sans)",
                }}
              >
                {COUNTRIES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </Reveal>

          <p aria-live="polite" style={{ margin: "0 0 20px", font: "400 15px/1 var(--font-sans)", color: "var(--fg-muted)" }}>
            Showing {list.length} {list.length === 1 ? "testimony" : "testimonies"}
          </p>

          <div style={{ columns: cols, columnGap: 16 }}>
            {list.map((t, i) => (
              <Reveal
                key={t.name + t.country + t.cat}
                variant="sharpen"
                index={i % 6}
                style={{ breakInside: "avoid", marginBottom: 16 }}
              >
                <Card variant="cream" radius="md" style={{ padding: 28 }}>
                  <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
                    <span
                      style={{
                        alignSelf: "flex-start",
                        padding: "5px 10px",
                        borderRadius: "var(--r-pill)",
                        background: "#E08A4F",
                        color: "var(--ink)",
                        font: "500 11px/1 var(--font-mono)",
                        letterSpacing: ".06em",
                      }}
                    >
                      {t.catUpper}
                    </span>
                    <blockquote
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-display)",
                        fontSize: 25,
                        lineHeight: 1.3,
                        textWrap: "pretty",
                      }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption
                      style={{ display: "flex", alignItems: "center", gap: 12, font: "600 15px/1.3 var(--font-sans)" }}
                    >
                      <span aria-hidden="true" style={{ width: 24, height: 1, background: "#B8892F" }} />
                      {t.name}, {t.country}
                    </figcaption>
                  </figure>
                </Card>
              </Reveal>
            ))}
          </div>

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
              No testimonies here yet. Yours could be the first.
            </p>
          )}

          <p style={{ margin: "24px 0 0", font: "400 14px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
            Testimonies are personal accounts of faith, shared with permission.
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
                  <span aria-hidden="true" style={{ width: 48, height: 1, background: "#B8892F" }} />
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
