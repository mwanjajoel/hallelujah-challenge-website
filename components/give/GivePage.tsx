"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

type Currency = "NGN" | "USD" | "GBP" | "EUR";

const CURRENCIES: Record<Currency, [symbol: string, amounts: number[]]> = {
  NGN: ["₦", [5000, 10000, 25000, 50000]],
  USD: ["$", [10, 25, 50, 100]],
  GBP: ["£", [10, 25, 50, 100]],
  EUR: ["€", [10, 25, 50, 100]],
};

const CURRENCY_LABELS: Record<Currency, string> = {
  NGN: "Naira ₦",
  USD: "US Dollar $",
  GBP: "Pound £",
  EUR: "Euro €",
};

interface AccountRow {
  id: string;
  k: string;
  v: string;
  copyable: boolean;
}

const ACCOUNTS: Array<{ title: string; rows: AccountRow[] }> = [
  {
    title: "NAIRA (NGN)",
    rows: [
      { id: "ngn-b", k: "Bank", v: "[Bank name]", copyable: false },
      { id: "ngn-n", k: "Account number", v: "0000000000", copyable: true },
    ],
  },
  {
    title: "US DOLLAR (USD) DOMICILIARY",
    rows: [
      { id: "usd-b", k: "Bank", v: "[Bank name]", copyable: false },
      { id: "usd-n", k: "Account number", v: "0000000000", copyable: true },
      { id: "usd-s", k: "SWIFT / BIC", v: "[SWIFTCODE]", copyable: true },
    ],
  },
  {
    title: "POUND STERLING (GBP)",
    rows: [
      { id: "gbp-n", k: "Account number", v: "00000000", copyable: true },
      { id: "gbp-s", k: "Sort code", v: "00-00-00", copyable: true },
    ],
  },
];

const WHERE = [
  ["Streams and data", "Broadcasting every night, and free data for Hallelujans who cannot afford it."],
  ["Team and ministers", "Care for the musicians, crew and ministers who serve through the night."],
  ["Welfare and outreach", "Support for people in need and outreach in the cities we visit."],
];

const EYEBROW: CSSProperties = {
  margin: 0,
  font: "500 12px/1 var(--font-mono)",
  letterSpacing: ".14em",
  color: "var(--accent)",
};

const LEGEND: CSSProperties = { padding: 0, marginBottom: 10, font: "500 15px/1 var(--font-sans)" };

/** A ?monthly link lands on the monthly-partner tab. Read as an external
    store so the server render and the hydrating render agree. */
const noopSubscribe = () => () => {};
const monthlyInUrl = () => /monthly/.test(window.location.search);
const monthlyOnServer = () => false;

const selected = (sel: boolean) => ({
  background: sel ? "var(--fg)" : "transparent",
  color: sel ? "var(--bg)" : "var(--fg)",
  borderColor: sel ? "var(--fg)" : "var(--line)",
});

export default function GivePage() {
  const monthlyDefault = useSyncExternalStore(noopSubscribe, monthlyInUrl, monthlyOnServer);
  const [monthlyChoice, setMonthlyChoice] = useState<boolean | null>(null);
  const monthly = monthlyChoice ?? monthlyDefault;

  const [cur, setCur] = useState<Currency>("NGN");
  const [amt, setAmt] = useState(1);
  const [custom, setCustom] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const copy = async (id: string, text: string) => {
    try {
      // writeText rejects rather than throwing when the clipboard permission
      // is denied, so the confirmation waits on the promise: the tick should
      // only appear when something was actually copied.
      await navigator.clipboard?.writeText(text);
    } catch {
      return;
    }
    setCopied(id);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 1800);
  };

  const [sym, list] = CURRENCIES[cur];
  const amount = custom ? Number(custom) : list[amt];
  const fmt = (n: number) => sym + Number(n || 0).toLocaleString("en-US");

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="give" />
      </div>

      <main>
        {/* ------------------------------------------------------------ HERO */}
        <Section aria-label="Partner with us" width="text" glow="gold" glowAt="22% 15%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <p style={EYEBROW}>PARTNER WITH WHAT GOD IS DOING</p>
            <Display as="h1" size="hero" style={{ maxWidth: "15ch" }}>
              Your seed keeps the stream <Accent gold>free</Accent>
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
              It keeps the festivals open and the team cared for. Give online below, or transfer directly using the
              account details. No sign-up needed.
            </p>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------------ GIVE */}
        <Section aria-label="Give" tight>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
              gap: 20,
              alignItems: "start",
            }}
          >
            <Reveal>
              <Card radius="lg" style={{ padding: "clamp(24px, 3.4vw, 40px)" }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  aria-labelledby="online-h"
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  <Display id="online-h" size="sm">
                    Give online
                  </Display>

                  <div
                    role="radiogroup"
                    aria-label="How often"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 4,
                      padding: 4,
                      borderRadius: "var(--r-pill)",
                      background: "var(--bg)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    {([["Give once", false], ["Monthly partner", true]] as const).map(([label, m]) => (
                      <button
                        key={label}
                        type="button"
                        role="radio"
                        aria-checked={monthly === m}
                        onClick={() => setMonthlyChoice(m)}
                        className="hc-t"
                        style={{
                          minHeight: 48,
                          borderRadius: "var(--r-pill)",
                          border: 0,
                          background: monthly === m ? "var(--line)" : "transparent",
                          color: monthly === m ? "var(--fg)" : "var(--fg-muted)",
                          font: "600 15px/1 var(--font-sans)",
                          cursor: "pointer",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <fieldset style={{ margin: 0, padding: 0, border: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    <legend style={LEGEND}>Currency</legend>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {(Object.keys(CURRENCIES) as Currency[]).map((k) => {
                        const sel = k === cur;
                        const s = selected(sel);
                        return (
                          <button
                            key={k}
                            type="button"
                            aria-pressed={sel}
                            onClick={() => {
                              setCur(k);
                              setAmt(1);
                              setCustom("");
                            }}
                            className="hc-t hc-pill-outline"
                            style={{
                              minHeight: 44,
                              padding: "0 18px",
                              borderRadius: "var(--r-pill)",
                              border: "1px solid " + s.borderColor,
                              background: s.background,
                              color: s.color,
                              font: "500 15px/1 var(--font-sans)",
                              cursor: "pointer",
                            }}
                          >
                            {CURRENCY_LABELS[k]}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset style={{ margin: 0, padding: 0, border: 0 }}>
                    <legend style={LEGEND}>Amount</legend>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(108px, 1fr))", gap: 8 }}>
                      {list.map((n, i) => {
                        const sel = !custom && i === amt;
                        const s = selected(sel);
                        return (
                          <button
                            key={n}
                            type="button"
                            aria-pressed={sel}
                            onClick={() => {
                              setAmt(i);
                              setCustom("");
                            }}
                            className="hc-t hc-pill-outline"
                            style={{
                              minHeight: 56,
                              borderRadius: "var(--r-sm)",
                              border: "1px solid " + s.borderColor,
                              background: s.background,
                              color: s.color,
                              font: "600 17px/1 var(--font-sans)",
                              fontVariantNumeric: "tabular-nums",
                              cursor: "pointer",
                            }}
                          >
                            {fmt(n)}
                          </button>
                        );
                      })}
                    </div>
                    <label style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, font: "500 15px/1 var(--font-sans)" }}>
                      Or another amount ({sym})
                      <input
                        type="number"
                        min={1}
                        inputMode="decimal"
                        placeholder="Enter amount"
                        value={custom}
                        onChange={(e) => setCustom(e.target.value)}
                        className="hc-t hc-input"
                        style={{
                          minHeight: 52,
                          padding: "0 16px",
                          borderRadius: "var(--r-sm)",
                          background: "var(--bg)",
                          border: "1px solid var(--line)",
                          color: "var(--fg)",
                          font: "400 17px/1 var(--font-sans)",
                        }}
                      />
                    </label>
                  </fieldset>

                  <button
                    type="submit"
                    className="hc-t hc-pill-gold"
                    style={{
                      minHeight: 56,
                      borderRadius: "var(--r-pill)",
                      border: 0,
                      background: "var(--accent)",
                      color: "var(--bg)",
                      font: "600 17px/1 var(--font-sans)",
                      cursor: "pointer",
                    }}
                  >
                    Give {fmt(amount)}
                    {monthly ? " monthly" : ""}
                  </button>

                  {submitted && (
                    <p role="status" style={{ margin: 0, font: "400 15px/1.5 var(--font-sans)" }}>
                      &#10003; Thank you. You would now continue to [payment provider] to complete your gift securely.
                    </p>
                  )}

                  <p style={{ margin: 0, font: "400 14px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
                    Secure payment by [payment provider]. Monthly partnership can be paused or cancelled at any time.
                  </p>
                </form>
              </Card>
            </Reveal>

            <Reveal index={1} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card radius="lg" style={{ padding: "clamp(24px, 3.4vw, 40px)", border: "1px solid rgba(212,166,74,.5)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Display id="acct-h" size="sm" style={{ marginBottom: 4 }}>
                    Account details
                  </Display>
                  <p style={{ margin: "0 0 16px", font: "400 15px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
                    Account name for all transfers:{" "}
                    <strong style={{ color: "var(--fg)", fontWeight: 600 }}>
                      Hallelujah Challenge Gospel Music Initiative
                    </strong>
                  </p>

                  {ACCOUNTS.map((ac) => (
                    <div
                      key={ac.title}
                      style={{ padding: "18px 0", borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 10 }}
                    >
                      <p style={{ ...EYEBROW, letterSpacing: ".08em" }}>{ac.title}</p>
                      {ac.rows.map((r) => (
                        <div
                          key={r.id}
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px 16px",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ font: "400 13px/1.3 var(--font-sans)", color: "var(--fg-muted)" }}>{r.k}</span>
                            <span
                              style={{
                                font: "500 18px/1.3 var(--font-sans)",
                                fontVariantNumeric: "tabular-nums",
                                letterSpacing: ".02em",
                              }}
                            >
                              {r.v}
                            </span>
                          </div>
                          {r.copyable && (
                            <button
                              type="button"
                              onClick={() => copy(r.id, r.v)}
                              aria-label={"Copy " + r.k}
                              className="hc-t hc-circle"
                              style={{
                                minHeight: 44,
                                minWidth: 92,
                                padding: "0 16px",
                                borderRadius: "var(--r-pill)",
                                border: "1px solid var(--line)",
                                background: "var(--bg)",
                                color: "var(--fg)",
                                font: "500 14px/1 var(--font-sans)",
                                cursor: "pointer",
                              }}
                            >
                              {copied === r.id ? "✓ Copied" : "Copy"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  <p style={{ margin: "8px 0 0", font: "400 14px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
                    Account numbers shown are placeholders until confirmed by the ministry.
                  </p>
                </div>
              </Card>

              <Card radius="md" variant="solid" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <p style={{ margin: 0, font: "600 15px/1.4 var(--font-sans)" }}>We never ask for money by DM.</p>
                  <p style={{ margin: 0, font: "400 15px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
                    Only give through this page or the official HC app. If someone messages you asking for money in our
                    name, please report the account.
                  </p>
                </div>
              </Card>
            </Reveal>
          </div>
        </Section>

        {/* ----------------------------------------------------------- WHERE */}
        <Section aria-labelledby="where-h" tight>
          <Reveal style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
            <Display id="where-h" size="lg">
              Where your <Accent>seed goes</Accent>
            </Display>
          </Reveal>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "clamp(20px, 3vw, 34px)",
            }}
          >
            {WHERE.map(([title, body], i) => (
              <Reveal as="li" key={title} variant="sharpen" index={i}>
                <Card radius="md" style={{ padding: 28, height: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <span
                      aria-hidden="true"
                      className="hc-float"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: i === 0 ? "50%" : i === 2 ? 4 : 0,
                        border: "1.5px solid var(--accent)",
                        transform: i === 2 ? "rotate(45deg)" : undefined,
                      }}
                    />
                    <h3 style={{ margin: 0, font: "600 18px/1.3 var(--font-sans)" }}>{title}</h3>
                    <p style={{ margin: 0, font: "400 16px/1.55 var(--font-sans)", color: "var(--fg-muted)" }}>{body}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </ul>
          <Reveal index={1} style={{ marginTop: 40 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1.3 }}>
              We do not receive tithes. <Accent>They belong to your local church.</Accent>
            </p>
          </Reveal>
        </Section>

        {/* ---------------------------------------------------------- LETTER */}
        <Section aria-labelledby="letter-h" tone="cream" width="narrow">
          <Reveal as="article">
            <p style={{ ...EYEBROW, color: "#5a5f73", marginBottom: 18 }}>ACCOUNTABILITY LETTER</p>
            <Display id="letter-h" size="lg" style={{ marginBottom: 32 }}>
              To every <Accent>partner</Accent>
            </Display>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, font: "400 18px/1.75 var(--font-sans)", color: "#2b3045" }}>
              <p
                style={{
                  margin: 0,
                  padding: "12px 16px",
                  border: "1px dashed #a39a86",
                  borderRadius: 8,
                  font: "400 14px/1.5 var(--font-mono)",
                  color: "#5a5f73",
                }}
              >
                [ Draft placeholder. Final letter to be supplied and signed by the ministry. ]
              </p>
              <p style={{ margin: 0 }}>Dear Hallelujan,</p>
              <p style={{ margin: 0 }}>
                Thank you for standing with us. Every gift is received with gratitude and handled with care, because it
                is given to God before it is given to us.
              </p>
              <p style={{ margin: 0 }}>
                Gifts are received by Hallelujah Challenge Gospel Music Initiative and used for the stream, the
                festivals, the team and our welfare work. We publish a summary of how funds were used after each
                edition.
              </p>
              <p style={{ margin: 0 }}>
                If you have a question about a gift, please write to{" "}
                <a href="mailto:info@hallelujahchallengelive.com" className="hc-t" style={{ color: "var(--ink)", textUnderlineOffset: 4 }}>
                  info@hallelujahchallengelive.com
                </a>
                .
              </p>
              <p style={{ margin: "12px 0 0", fontFamily: "var(--font-display)", fontSize: 24, color: "var(--ink)" }}>
                [Signature]
              </p>
              <p style={{ margin: 0, font: "500 15px/1.4 var(--font-sans)", color: "var(--ink)" }}>
                For the Hallelujah Challenge team
              </p>
            </div>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
