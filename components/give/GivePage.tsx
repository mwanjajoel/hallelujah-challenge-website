"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

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

const selected = (sel: boolean) => ({
  background: sel ? "#F6F1E7" : "transparent",
  color: sel ? "#0B0D17" : "#F6F1E7",
  borderColor: sel ? "#F6F1E7" : "#262B40",
});

const LEGEND: React.CSSProperties = { padding: 0, marginBottom: 10, font: "500 15px/1 Geist,sans-serif" };

const WHERE_ITEM: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  paddingTop: 24,
  borderTop: "1px solid #262B40",
};

const WHERE_H: React.CSSProperties = { margin: 0, font: "600 18px/1.3 Geist,sans-serif" };

/** A ?monthly link lands on the monthly-partner tab. Read as an external
    store so the server render and the hydrating render agree. */
const noopSubscribe = () => () => {};
const monthlyInUrl = () => /monthly/.test(window.location.search);
const monthlyOnServer = () => false;
const WHERE_P: React.CSSProperties = { margin: 0, font: "400 16px/1.55 Geist,sans-serif", color: "#A9AEC2" };

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
  const cta = `Give ${fmt(amount)}${monthly ? " monthly" : ""}`;

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
        <SiteHeader active="give" />
      </div>

      <main>
        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(56px,8cqw,104px) clamp(20px,5cqw,64px) clamp(40px,5cqw,64px)",
          }}
        >
          <p
            style={{
              margin: "0 0 18px",
              font: "500 12px/1 'Geist Mono',monospace",
              letterSpacing: ".06em",
              color: "#D4A64A",
            }}
          >
            PARTNER WITH WHAT GOD IS DOING
          </p>
          <h1
            style={{
              margin: 0,
              maxWidth: "18ch",
              font: "300 clamp(40px,6cqw,80px)/1.05 Geist,sans-serif",
              letterSpacing: "-.015em",
              textWrap: "balance",
            }}
          >
            Your seed keeps the stream free.
          </h1>
          <p style={{ margin: "24px 0 0", maxWidth: "36em", color: "#A9AEC2", textWrap: "pretty" }}>
            It keeps the festivals open and the team cared for. Give online below, or transfer directly using the
            account details. No sign-up needed.
          </p>
        </section>

        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px,5cqw,64px) clamp(72px,9cqw,112px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            aria-labelledby="online-h"
            style={{
              padding: "clamp(24px,3.4cqw,40px)",
              borderRadius: 20,
              background: "#141829",
              border: "1px solid #262B40",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <h2 id="online-h" style={{ margin: 0, font: "400 28px/1.2 Geist,sans-serif" }}>
              Give online
            </h2>

            <div
              role="radiogroup"
              aria-label="How often"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 4,
                padding: 4,
                borderRadius: 999,
                background: "#0B0D17",
                border: "1px solid #262B40",
              }}
            >
              {([["Give once", false], ["Monthly partner", true]] as const).map(([label, m]) => (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={monthly === m}
                  onClick={() => setMonthlyChoice(m)}
                  style={{
                    minHeight: 48,
                    borderRadius: 999,
                    border: 0,
                    background: monthly === m ? "#262B40" : "transparent",
                    color: monthly === m ? "#F6F1E7" : "#A9AEC2",
                    font: "600 15px/1 Geist,sans-serif",
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
                      style={{
                        minHeight: 44,
                        padding: "0 18px",
                        borderRadius: 999,
                        border: `1px solid ${s.borderColor}`,
                        background: s.background,
                        color: s.color,
                        font: "500 15px/1 Geist,sans-serif",
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 8 }}>
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
                      style={{
                        minHeight: 56,
                        borderRadius: 12,
                        border: `1px solid ${s.borderColor}`,
                        background: s.background,
                        color: s.color,
                        font: "600 17px/1 Geist,sans-serif",
                        fontVariantNumeric: "tabular-nums",
                        cursor: "pointer",
                      }}
                    >
                      {fmt(n)}
                    </button>
                  );
                })}
              </div>
              <label
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  font: "500 15px/1 Geist,sans-serif",
                }}
              >
                Or another amount ({sym})
                <input
                  type="number"
                  min={1}
                  inputMode="decimal"
                  placeholder="Enter amount"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="hc-input"
                  style={{
                    minHeight: 52,
                    padding: "0 16px",
                    borderRadius: 12,
                    background: "#0B0D17",
                    border: "1px solid #262B40",
                    color: "#F6F1E7",
                    font: "400 17px/1 Geist,sans-serif",
                  }}
                />
              </label>
            </fieldset>

            <button
              type="submit"
              className="hc-pill-gold"
              style={{
                minHeight: 56,
                borderRadius: 999,
                border: 0,
                background: "#D4A64A",
                color: "#0B0D17",
                font: "600 17px/1 Geist,sans-serif",
                cursor: "pointer",
              }}
            >
              {cta}
            </button>

            {submitted && (
              <p role="status" style={{ margin: 0, font: "400 15px/1.5 Geist,sans-serif" }}>
                ✓ Thank you. You would now continue to [payment provider] to complete your gift securely.
              </p>
            )}

            <p style={{ margin: 0, font: "400 14px/1.5 Geist,sans-serif", color: "#A9AEC2" }}>
              Secure payment by [payment provider]. Monthly partnership can be paused or cancelled at any time.
            </p>
          </form>

          <section aria-labelledby="acct-h" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                padding: "clamp(24px,3.4cqw,40px)",
                borderRadius: 20,
                background: "#141829",
                border: "1px solid rgba(212,166,74,.55)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <h2 id="acct-h" style={{ margin: "0 0 4px", font: "400 28px/1.2 Geist,sans-serif" }}>
                Account details
              </h2>
              <p style={{ margin: "0 0 16px", font: "400 15px/1.5 Geist,sans-serif", color: "#A9AEC2" }}>
                Account name for all transfers:{" "}
                <strong style={{ color: "#F6F1E7", fontWeight: 600 }}>
                  Hallelujah Challenge Gospel Music Initiative
                </strong>
              </p>

              {ACCOUNTS.map((ac) => (
                <div
                  key={ac.title}
                  style={{
                    padding: "18px 0",
                    borderTop: "1px solid #262B40",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      font: "500 12px/1 'Geist Mono',monospace",
                      letterSpacing: ".06em",
                      color: "#D4A64A",
                    }}
                  >
                    {ac.title}
                  </p>
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
                        <span style={{ font: "400 13px/1.3 Geist,sans-serif", color: "#A9AEC2" }}>{r.k}</span>
                        <span
                          style={{
                            font: "500 18px/1.3 Geist,sans-serif",
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
                          aria-label={`Copy ${r.k}`}
                          className="hc-circle"
                          style={{
                            minHeight: 44,
                            minWidth: 92,
                            padding: "0 16px",
                            borderRadius: 999,
                            border: "1px solid #262B40",
                            background: "#0B0D17",
                            color: "#F6F1E7",
                            font: "500 14px/1 Geist,sans-serif",
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

              <p style={{ margin: "8px 0 0", font: "400 14px/1.5 Geist,sans-serif", color: "#A9AEC2" }}>
                Account numbers shown are placeholders until confirmed by the ministry.
              </p>
            </div>

            <div
              role="note"
              style={{
                padding: "20px 24px",
                borderRadius: 14,
                border: "1px solid #262B40",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <p style={{ margin: 0, font: "600 15px/1.4 Geist,sans-serif" }}>We never ask for money by DM.</p>
              <p style={{ margin: 0, font: "400 15px/1.5 Geist,sans-serif", color: "#A9AEC2" }}>
                Only give through this page or the official HC app. If someone messages you asking for money in our
                name, please report the account.
              </p>
            </div>
          </section>
        </section>

        <section
          aria-labelledby="where-h"
          style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5cqw,64px) clamp(72px,9cqw,112px)" }}
        >
          <h2 id="where-h" style={{ margin: "0 0 32px", font: "300 clamp(28px,3.4cqw,40px)/1.15 Geist,sans-serif" }}>
            Where your seed goes
          </h2>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
              gap: "clamp(24px,3cqw,40px)",
            }}
          >
            <li style={WHERE_ITEM}>
              <span
                aria-hidden="true"
                style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #D4A64A" }}
              />
              <h3 style={WHERE_H}>Streams and data</h3>
              <p style={WHERE_P}>
                Broadcasting every night, and free data for Hallelujans who cannot afford it.
              </p>
            </li>
            <li style={WHERE_ITEM}>
              <span aria-hidden="true" style={{ width: 24, height: 24, border: "1.5px solid #D4A64A" }} />
              <h3 style={WHERE_H}>Team and ministers</h3>
              <p style={WHERE_P}>Care for the musicians, crew and ministers who serve through the night.</p>
            </li>
            <li style={WHERE_ITEM}>
              <span
                aria-hidden="true"
                style={{
                  width: 20,
                  height: 20,
                  margin: 3,
                  border: "1.5px solid #D4A64A",
                  transform: "rotate(45deg)",
                }}
              />
              <h3 style={WHERE_H}>Welfare and outreach</h3>
              <p style={WHERE_P}>Support for people in need and outreach in the cities we visit.</p>
            </li>
          </ul>
          <p style={{ margin: "40px 0 0", font: "400 20px/1.5 Geist,sans-serif" }}>
            We do not receive tithes. They belong to your local church.
          </p>
        </section>

        <section aria-labelledby="letter-h" style={{ background: "#FBF8F2", color: "#141829" }}>
          <article
            style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(80px,10cqw,128px) clamp(20px,5cqw,40px)" }}
          >
            <p
              style={{
                margin: "0 0 18px",
                font: "500 12px/1 'Geist Mono',monospace",
                letterSpacing: ".06em",
                color: "#5a5f73",
              }}
            >
              ACCOUNTABILITY LETTER
            </p>
            <h2 id="letter-h" style={{ margin: "0 0 32px", font: "300 clamp(32px,4cqw,48px)/1.12 Geist,sans-serif" }}>
              To every partner
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                font: "400 18px/1.75 Geist,sans-serif",
                color: "#262B40",
              }}
            >
              <p
                style={{
                  margin: 0,
                  padding: "12px 16px",
                  border: "1px dashed #a39a86",
                  borderRadius: 8,
                  font: "400 14px/1.5 'Geist Mono',ui-monospace,monospace",
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
                <a
                  href="mailto:info@hallelujahchallengelive.com"
                  style={{ color: "#141829", textUnderlineOffset: 4 }}
                >
                  info@hallelujahchallengelive.com
                </a>
                .
              </p>
              <p style={{ margin: "12px 0 0", font: "400 22px/1.4 Geist,sans-serif", color: "#141829" }}>[Signature]</p>
              <p style={{ margin: 0, font: "500 15px/1.4 Geist,sans-serif", color: "#141829" }}>
                For the Hallelujah Challenge team
              </p>
            </div>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
