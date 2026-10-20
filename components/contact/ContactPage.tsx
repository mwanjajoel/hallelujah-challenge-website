"use client";

import { useState, type CSSProperties } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

const EYEBROW: CSSProperties = {
  margin: 0,
  font: "500 12px/1 var(--font-mono)",
  letterSpacing: ".14em",
  color: "var(--accent)",
};

const FIELD: CSSProperties = {
  minHeight: 52,
  padding: "0 16px",
  borderRadius: "var(--r-sm)",
  background: "var(--bg)",
  border: "1px solid var(--line)",
  color: "var(--fg)",
  font: "400 17px/1 var(--font-sans)",
};

const FIELD_LABEL: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  font: "500 15px/1.3 var(--font-sans)",
};

const ADDRESSES: Array<[string, string, string]> = [
  ["General enquiries", "info@hallelujahchallengelive.com", "Anything about the Challenge, the app, or the team."],
  ["International guests", "guests@hallelujahchallengelive.com", "Travelling to Nigeria for the Festival."],
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="contact" />
      </div>

      <main>
        <Section aria-label="Contact" width="text" glow="blue" glowAt="26% 12%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <Display as="h1" size="hero" style={{ maxWidth: "12ch" }}>
              Contact <Accent gold>Us</Accent>
            </Display>
          </Reveal>
        </Section>

        <Section aria-label="Contact details and form" tight width="text">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "clamp(24px, 4vw, 48px)",
              alignItems: "start",
            }}
          >
            <Reveal style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {ADDRESSES.map(([label, email, note], i) => (
                <Card key={email} radius="md" glow={i === 0 ? "gold" : null} glowAt="10% 0%" style={{ padding: 28 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <p style={{ ...EYEBROW, color: "var(--fg-muted)" }}>{label.toUpperCase()}</p>
                    <a
                      href={`mailto:${email}`}
                      className="hc-t hc-footlink"
                      style={{
                        font: "400 clamp(18px, 1.8vw, 23px)/1.4 var(--font-sans)",
                        color: "var(--fg)",
                        textUnderlineOffset: 5,
                        wordBreak: "break-word",
                      }}
                    >
                      {email}
                    </a>
                    <p style={{ margin: 0, font: "400 15px/1.6 var(--font-sans)", color: "var(--fg-muted)" }}>{note}</p>
                  </div>
                </Card>
              ))}
            </Reveal>

            <Reveal index={1}>
              <Card radius="lg" style={{ padding: "clamp(24px, 3.4vw, 40px)" }}>
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
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
                        gap: 16,
                      }}
                    >
                      <label style={FIELD_LABEL}>
                        First name
                        <input type="text" required autoComplete="given-name" className="hc-t hc-input" style={FIELD} />
                      </label>
                      <label style={FIELD_LABEL}>
                        Last name
                        <input type="text" required autoComplete="family-name" className="hc-t hc-input" style={FIELD} />
                      </label>
                    </div>
                    <label style={FIELD_LABEL}>
                      Email
                      <input type="email" required autoComplete="email" className="hc-t hc-input" style={FIELD} />
                    </label>
                    <label style={FIELD_LABEL}>
                      Write a message
                      <textarea
                        required
                        rows={6}
                        className="hc-t hc-input"
                        style={{
                          padding: "14px 16px",
                          borderRadius: "var(--r-sm)",
                          background: "var(--bg)",
                          border: "1px solid var(--line)",
                          color: "var(--fg)",
                          font: "400 17px/1.6 var(--font-sans)",
                          resize: "vertical",
                        }}
                      />
                    </label>
                    <button
                      type="submit"
                      className="hc-t hc-pill-gold"
                      style={{
                        alignSelf: "flex-start",
                        minHeight: 54,
                        padding: "0 30px",
                        borderRadius: "var(--r-pill)",
                        border: 0,
                        background: "var(--accent-fill)",
                        color: "var(--on-accent)",
                        font: "600 16px/1 var(--font-sans)",
                        cursor: "pointer",
                      }}
                    >
                      Submit
                    </button>
                    <p style={{ margin: 0, font: "400 14px/1.5 var(--font-sans)", color: "var(--fg-muted)" }}>
                      Not yet connected to a mailbox. Until it is, please write to the address alongside.
                    </p>
                  </form>
                ) : (
                  <div role="status" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Display size="sm">Thanks for submitting!</Display>
                    <p style={{ margin: 0, font: "400 17px/1.6 var(--font-sans)", color: "var(--fg-muted)" }}>
                      Nothing has been sent yet &mdash; this form still needs connecting to a mailbox. Please write to
                      info@hallelujahchallengelive.com in the meantime.
                    </p>
                  </div>
                )}
              </Card>
            </Reveal>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
