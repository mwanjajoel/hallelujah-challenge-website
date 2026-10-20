"use client";

import { useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const RAW: Array<[quote: string, name: string, country: string, cat: string]> = [
  ["I reside in the USA, and God healed me.", "Grace", "USA", "Healing"],
  ["After seven years of waiting, our son was born during the June edition.", "Adaeze", "Nigeria", "Family"],
  [
    "My visa was refused twice. I praised every night of the challenge, and this month it was approved.",
    "Kwame",
    "Ghana",
    "Visa",
  ],
  ["I lost my job in March. On Day 9 I received an offer letter.", "Tunde", "United Kingdom", "Career"],
  ["We cleared a debt our family had carried for four years.", "Wanjiru", "Kenya", "Finances"],
  ["I came for the music. On the third night I gave my life to Jesus.", "Daniel", "Canada", "Salvation"],
  ["My mother and I had not spoken in two years. Now we join at 11:59 together.", "Ruth", "South Africa", "Family"],
  ["The doctors were cautious. We kept praising. My scan came back clear.", "Ifeoma", "Ireland", "Healing"],
  [
    "I was promoted after four years in the same role. I dressed like my miracle every night.",
    "Chinedu",
    "Nigeria",
    "Career",
  ],
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

const FIELD: React.CSSProperties = {
  minHeight: 52,
  padding: "0 16px",
  borderRadius: 12,
  background: "#FFFFFF",
  border: "1px solid #cfc7b5",
  color: "#141829",
  font: "400 17px/1 Geist,sans-serif",
};

const FIELD_LABEL: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  font: "500 15px/1.3 Geist,sans-serif",
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
    <div
      style={{
        containerType: "inline-size",
        background: "#0B0D17",
        color: "#F6F1E7",
        fontFamily: "Geist,system-ui,sans-serif",
        fontSize: "clamp(16px,1.5cqw,18px)",
        lineHeight: 1.6,
        minHeight: "100vh",
      }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 50, display: "block" }}>
        <SiteHeader active="testimonies" />
      </div>

      <main>
        <section
          style={{
            position: "relative",
            overflow: "clip",
            background: "linear-gradient(180deg,#0B0D17 0%,#1a1630 40%,#3a2433 75%,#5e3530 100%)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "80%",
              background: "radial-gradient(ellipse 55% 70% at 50% 100%,rgba(224,138,79,.4),transparent 70%)",
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: 1280,
              margin: "0 auto",
              padding: "clamp(72px,10cqw,128px) clamp(20px,5cqw,64px) clamp(56px,7cqw,88px)",
            }}
          >
            <p
              style={{
                margin: "0 0 18px",
                font: "500 12px/1 'Geist Mono',monospace",
                letterSpacing: ".06em",
                color: "#E9B48C",
              }}
            >
              TESTIMONIES · THE MORNING AFTER
            </p>
            <h1
              style={{
                margin: 0,
                maxWidth: "14ch",
                font: "300 clamp(44px,7cqw,96px)/1.04 Geist,sans-serif",
                letterSpacing: "-.015em",
                textWrap: "balance",
              }}
            >
              His mercy endures <em style={{ fontStyle: "normal", fontWeight: 200 }}>forever.</em>
            </h1>
            <p
              style={{
                margin: "18px 0 0",
                font: "500 12px/1 'Geist Mono',monospace",
                letterSpacing: ".06em",
                color: "#D4A64A",
              }}
            >
              PSALM 136:1
            </p>
            <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a
                href="#share"
                className="hc-pill-cream"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 52,
                  padding: "0 26px",
                  borderRadius: 999,
                  background: "#FBF8F2",
                  color: "#141829",
                  font: "600 16px/1 Geist,sans-serif",
                  textDecoration: "none",
                }}
              >
                Share what God has done
              </a>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="grid-h"
          style={{ background: "linear-gradient(180deg,#5e3530 0%,#2a1d2a 30%,#0B0D17 100%)" }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 clamp(20px,5cqw,64px) clamp(80px,10cqw,128px)",
            }}
          >
            <h2
              id="grid-h"
              style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}
            >
              All testimonies
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 16,
                padding: "28px 0",
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
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        minHeight: 44,
                        padding: "0 18px",
                        borderRadius: 999,
                        border: `1px solid ${sel ? "#FBF8F2" : "rgba(246,241,231,.4)"}`,
                        background: sel ? "#FBF8F2" : "rgba(11,13,23,.3)",
                        color: sel ? "#141829" : "#F6F1E7",
                        font: "500 15px/1 Geist,sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      {sel && <span aria-hidden="true">✓</span>}
                      {c}
                    </button>
                  );
                })}
              </div>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  font: "500 13px/1 Geist,sans-serif",
                  color: "#F3D9C5",
                }}
              >
                Country
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{
                    minHeight: 48,
                    minWidth: 200,
                    padding: "0 14px",
                    borderRadius: 12,
                    background: "rgba(11,13,23,.5)",
                    border: "1px solid rgba(246,241,231,.4)",
                    color: "#F6F1E7",
                    font: "500 16px/1 Geist,sans-serif",
                  }}
                >
                  {COUNTRIES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p aria-live="polite" style={{ margin: "0 0 20px", font: "400 15px/1 Geist,sans-serif", color: "#F3D9C5" }}>
              Showing {list.length} {list.length === 1 ? "testimony" : "testimonies"}
            </p>

            <div style={{ columns: cols, columnGap: 16 }}>
              {list.map((t) => (
                <figure
                  key={`${t.name}-${t.country}-${t.cat}`}
                  style={{
                    breakInside: "avoid",
                    margin: "0 0 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    padding: 28,
                    borderRadius: 18,
                    background: "#FBF8F2",
                    color: "#141829",
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "5px 10px",
                      borderRadius: 999,
                      background: "#E08A4F",
                      color: "#141829",
                      font: "500 11px/1 'Geist Mono',monospace",
                      letterSpacing: ".06em",
                    }}
                  >
                    {t.catUpper}
                  </span>
                  <blockquote style={{ margin: 0, font: "400 22px/1.4 Geist,sans-serif", textWrap: "pretty" }}>
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption
                    style={{ display: "flex", alignItems: "center", gap: 12, font: "600 15px/1.3 Geist,sans-serif" }}
                  >
                    <span aria-hidden="true" style={{ width: 24, height: 1, background: "#B8892F" }} />
                    {t.name}, {t.country}
                  </figcaption>
                </figure>
              ))}
            </div>

            {list.length === 0 && (
              <p
                style={{
                  margin: 0,
                  padding: 40,
                  border: "1px dashed rgba(246,241,231,.3)",
                  borderRadius: 18,
                  textAlign: "center",
                  color: "#F3D9C5",
                }}
              >
                No testimonies here yet. Yours could be the first.
              </p>
            )}

            <p style={{ margin: "24px 0 0", font: "400 14px/1.5 Geist,sans-serif", color: "#A9AEC2" }}>
              Testimonies are personal accounts of faith, shared with permission.
            </p>
          </div>
        </section>

        <section
          id="share"
          aria-labelledby="share-h"
          style={{ background: "#FBF8F2", color: "#141829", scrollMarginTop: 80 }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "clamp(80px,10cqw,128px) clamp(20px,5cqw,64px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))",
              gap: "clamp(40px,6cqw,80px)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p
                style={{
                  margin: 0,
                  font: "500 12px/1 'Geist Mono',monospace",
                  letterSpacing: ".06em",
                  color: "#5a5f73",
                }}
              >
                SHARE YOUR TESTIMONY
              </p>
              <h2
                id="share-h"
                style={{ margin: 0, font: "300 clamp(36px,4.6cqw,56px)/1.08 Geist,sans-serif", letterSpacing: "-.01em" }}
              >
                What has God done?
              </h2>
              <p style={{ margin: 0, font: "400 18px/1.65 Geist,sans-serif", color: "#262B40", textWrap: "pretty" }}>
                Tell it in your own words. We may share your story to encourage others; we will only use your first
                name and country.
              </p>
            </div>

            {!sent && (
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
                    gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))",
                    gap: 16,
                  }}
                >
                  <label style={FIELD_LABEL}>
                    First name
                    <input type="text" required autoComplete="given-name" className="hc-input-dark" style={FIELD} />
                  </label>
                  <label style={FIELD_LABEL}>
                    Country
                    <input type="text" required autoComplete="country-name" className="hc-input-dark" style={FIELD} />
                  </label>
                </div>

                <label style={FIELD_LABEL}>
                  Category
                  <select className="hc-input-dark" style={{ ...FIELD, padding: "0 14px" }} defaultValue="Healing">
                    <option>Healing</option>
                    <option>Family</option>
                    <option>Career</option>
                    <option>Visa</option>
                    <option>Finances</option>
                    <option>Salvation</option>
                    <option>Other</option>
                  </select>
                </label>

                <label style={FIELD_LABEL}>
                  Your testimony
                  <textarea
                    required
                    rows={6}
                    placeholder="Tell it in your own words."
                    className="hc-input-dark"
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "#FFFFFF",
                      border: "1px solid #cfc7b5",
                      color: "#141829",
                      font: "400 17px/1.6 Geist,sans-serif",
                      resize: "vertical",
                    }}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    font: "400 16px/1.5 Geist,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    style={{ width: 22, height: 22, marginTop: 2, accentColor: "#141829", flex: "none" }}
                  />
                  I agree that the Hallelujah Challenge may share my testimony with my first name and country.
                </label>

                <button
                  type="submit"
                  className="hc-pill-dark"
                  style={{
                    alignSelf: "flex-start",
                    minHeight: 52,
                    padding: "0 30px",
                    borderRadius: 999,
                    border: 0,
                    background: "#141829",
                    color: "#FBF8F2",
                    font: "600 16px/1 Geist,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Send my testimony
                </button>
              </form>
            )}

            {sent && (
              <div
                role="status"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  padding: 32,
                  borderRadius: 18,
                  background: "#FFFFFF",
                  border: "1px solid #e5dfd2",
                }}
              >
                <span aria-hidden="true" style={{ width: 48, height: 1, background: "#B8892F" }} />
                <p style={{ margin: 0, font: "300 28px/1.3 Geist,sans-serif" }}>Thank you for testifying.</p>
                <p style={{ margin: 0, font: "400 17px/1.6 Geist,sans-serif", color: "#262B40" }}>
                  Our team reads every testimony. Keep praising.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
