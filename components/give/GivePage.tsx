"use client";

import { useState, type CSSProperties } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

/**
 * Wording here is verbatim from the Partnership & Stewardship page on
 * hallelujahchallengelive.com/partnership.
 *
 * That page renders its content inside an embedded Wix widget rather than in
 * the page itself, which is why it reads as empty from the page markup. The
 * source is content/live/give.txt.
 */

const EYEBROW: CSSProperties = {
  margin: 0,
  font: "500 12px/1 var(--font-mono)",
  letterSpacing: ".14em",
  color: "var(--accent)",
};

const BODY: CSSProperties = {
  margin: 0,
  font: "400 clamp(17px, 1.5vw, 20px)/1.75 var(--font-sans)",
  color: "var(--fg-muted)",
  textWrap: "pretty",
};

const PILLARS: Array<[string, string]> = [
  ["100% Gospel Impact", "Production, gear, technology & indigent welfare"],
  ["Zero Tithes Policy", "Tithes belong strictly to your home local church"],
  ["Pure & Voluntary", "No coercion, pressure, or private solicitation"],
  ["Global Open Access", "Broadcast 100% free to believers in 100+ nations"],
];

const USES: Array<[string, string, string?]> = [
  [
    "Facilitating the HC & Year-Round Operations",
    "Production venues, 4K multi-cam broadcast gear, musical instruments, team sustenance, robust streaming bandwidth, personnel remuneration, and critical administrative operations.",
  ],
  [
    "Team Honorarium & Volunteer Welfare",
    "Supporting the dedicated production crew: videographers, sound engineers, screen mappers, graphic designers, photographers, web managers, Zoom & prayer facilitators, security, and Guest Ministers.",
    "*Explicitly exclusive of Pastor Nathaniel Bassey.",
  ],
  [
    "Kingdom Creatives & Worship Platforms",
    "Directly encouraging and equipping emerging psalmists, gospel artists, and kingdom worship altars dedicated to advancing sincere, scriptural praise across the nations.",
  ],
  [
    "Christ-Centred Corporate Social Responsibility (CSR)",
    "Demonstrating tangible Christ-like compassion through welfare for the underprivileged, clearance of medical bills for the sick, and societal benevolence under the injunction to “do good to all men”.",
  ],
];

/** The verified giving channels, in the order the portal lists them. */
const CHANNELS: Array<[label: string, href: string]> = [
  ["Bank Account Details", "https://www.hallelujahchallengelive.com/giving-hc"],
  ["Payaza", "https://give.payaza.africa/hallelujahchallenge/feb2026"],
  ["Flutterwave Card Payment", "https://flutterwave.com/pay/hallelujahchallenge"],
  ["Flutterwave Account Number", "https://www.hallelujahchallengelive.com/flutter-giving-hc"],
  ["Squad by HabariPay", "https://pay.squadco.com/link/hallelujahchallenge"],
];

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

export default function GivePage() {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="give" />
      </div>

      <main>
        {/* ------------------------------------------------------------ HERO */}
        <Section aria-label="Partnership and stewardship" width="text" glow="gold" glowAt="24% 14%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <p style={EYEBROW}>PARTNERSHIP &amp; STEWARDSHIP</p>
            <Display as="h1" size="hero" style={{ maxWidth: "16ch" }}>
              Want to partner <Accent gold>with us?</Accent>
            </Display>
            <p style={{ ...BODY, maxWidth: "52ch" }}>
              Do you want to give to the Hallelujah Challenge? Find helpful information and biblical stewardship
              principles below.
            </p>
          </Reveal>

          <Reveal index={1} style={{ marginTop: "clamp(30px, 4vw, 48px)" }}>
            <Card radius="lg" glow="ember" glowAt="88% 10%" style={{ padding: "clamp(26px, 3.6vw, 44px)" }}>
              <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ ...EYEBROW, color: "var(--fg-muted)" }}>KINGDOM SOWING &amp; PARTNERSHIP</p>
                <blockquote
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(21px, 2.3vw, 32px)",
                    lineHeight: 1.38,
                    color: "var(--fg)",
                  }}
                >
                  &ldquo;I thank my God... for your partnership in the gospel from the first day until now.&rdquo;
                </blockquote>
                <figcaption style={EYEBROW}>PHILIPPIANS 1:3-5</figcaption>
              </figure>
            </Card>
          </Reveal>
        </Section>

        {/* --------------------------------------------------------- PILLARS */}
        <Section aria-label="Our commitments" tight width="text">
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 232px), 1fr))",
              gap: "clamp(14px, 2vw, 20px)",
            }}
          >
            {PILLARS.map(([title, body], i) => (
              <Reveal as="li" key={title} variant="sharpen" index={i}>
                <Card radius="md" style={{ padding: 26, height: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <h2 style={{ margin: 0, font: "600 17px/1.35 var(--font-sans)", color: "var(--fg)" }}>{title}</h2>
                    <p style={{ margin: 0, font: "400 15px/1.6 var(--font-sans)", color: "var(--fg-muted)" }}>{body}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </ul>

          <Reveal index={1} style={{ marginTop: 20 }}>
            <Card radius="md" style={{ padding: "22px 26px", border: "1px solid rgba(192,39,45,.45)" }}>
              <p style={{ margin: 0, font: "400 15px/1.7 var(--font-sans)", color: "var(--fg-muted)" }}>
                <strong style={{ color: "var(--fg)", fontWeight: 600 }}>Fraud Protection Advisory:</strong> Please
                note that we do not solicit funds privately, via social media direct messages (DMs), or through agents
                or third parties. All official giving channels are published exclusively on our verified platforms.
              </p>
            </Card>
          </Reveal>
        </Section>

        {/* ---------------------------------------------------------- LETTER */}
        <Section aria-label="Letter" tone="cream" width="narrow">
          <Reveal as="article" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(24px, 2.6vw, 36px)" }}>
              Dear Beloved,
            </p>
            <p style={{ margin: 0, font: "400 18px/1.75 var(--font-sans)", color: "var(--panel-muted)" }}>
              Grace, peace, and love be multiplied to you in Jesus&rsquo; name. Amen.
            </p>
            <p style={{ margin: 0, font: "400 18px/1.75 var(--font-sans)", color: "var(--panel-muted)" }}>
              We are immensely grateful to the Lord for the privilege to gather globally in praise, worship, and
              fervent prayer. As a ministry committed to godly integrity and absolute biblical stewardship, we ensure
              that every contribution received is deployed strictly and transparently into advancing the gospel.
            </p>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------------ USES */}
        <Section aria-labelledby="uses-h" tight width="text">
          <Reveal style={{ marginBottom: "clamp(26px, 4vw, 44px)" }}>
            <Display id="uses-h" size="lg" style={{ maxWidth: "18ch" }}>
              How Contributions Are <Accent>Utilized</Accent>
            </Display>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {USES.map(([title, body, note], i) => (
              <Reveal key={title} variant="sharpen" index={i}>
                <Card radius="md" style={{ padding: "clamp(22px, 3vw, 32px)" }}>
                  <div style={{ display: "flex", gap: "clamp(14px, 2vw, 24px)", alignItems: "flex-start" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        font: "400 26px/1 var(--font-display)",
                        color: "var(--accent)",
                        flex: "none",
                        minWidth: 34,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <h3 style={{ margin: 0, font: "400 clamp(19px, 2vw, 26px)/1.3 var(--font-display)" }}>{title}</h3>
                      <p style={{ margin: 0, font: "400 16px/1.7 var(--font-sans)", color: "var(--fg-muted)" }}>
                        {body}
                      </p>
                      {note && (
                        <p style={{ margin: 0, font: "500 14px/1.6 var(--font-sans)", color: "var(--accent)" }}>
                          {note}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal index={1} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
            <Card radius="md" style={{ padding: "22px 26px", border: "1px solid rgba(212,166,74,.5)" }}>
              <p style={{ margin: 0, font: "400 16px/1.7 var(--font-sans)", color: "var(--fg-muted)" }}>
                <strong style={{ color: "var(--fg)", fontWeight: 600 }}>
                  Important Biblical Clarification on Tithes:
                </strong>{" "}
                The Hallelujah Challenge does not receive Tithes. Tithes belong strictly to the local church in which
                you are planted, discipled, and spiritually fed.
              </p>
            </Card>
            <p style={{ margin: 0, font: "400 15px/1.75 var(--font-sans)", color: "var(--fg-muted)" }}>
              By making donations to the Hallelujah Challenge (through the registered entity &ndash; Hallelujah
              Challenge Gospel Music Initiative), you are undertaking that you have read and understood the above and
              that you are making any donation voluntarily from your lawful income without any compulsion or
              solicitation from Pastor Nathaniel Bassey or any other person associated with the Hallelujah Challenge.
            </p>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------------ FORM */}
        <Section aria-labelledby="partner-h" tight width="narrow" glow="gold" glowAt="50% 100%">
          <Reveal>
            <Card radius="lg" style={{ padding: "clamp(26px, 3.6vw, 44px)" }}>
              {!submitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 22 }}
                >
                  <Display id="partner-h" size="md" style={{ maxWidth: "18ch" }}>
                    Partner with <Accent gold>Hallelujah Challenge</Accent>
                  </Display>
                  <p style={{ margin: 0, font: "400 16px/1.7 var(--font-sans)", color: "var(--fg-muted)" }}>
                    Please confirm your details and voluntary agreement below to access the official verified giving
                    channels.
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
                      gap: 16,
                    }}
                  >
                    <label style={FIELD_LABEL}>
                      First Name
                      <input type="text" required autoComplete="given-name" className="hc-t hc-input" style={FIELD} />
                    </label>
                    <label style={FIELD_LABEL}>
                      Email
                      <input type="email" required autoComplete="email" className="hc-t hc-input" style={FIELD} />
                    </label>
                  </div>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      font: "400 15px/1.65 var(--font-sans)",
                      color: "var(--fg-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      required
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      style={{ width: 22, height: 22, marginTop: 2, accentColor: "var(--accent-fill)", flex: "none" }}
                    />
                    I confirm that the seed/love offering I am giving to Hallelujah Challenge is from resources
                    legitimately earned by me and I am making this donation voluntarily to Hallelujah Challenge
                  </label>

                  <button
                    type="submit"
                    className="hc-t hc-pill-gold"
                    style={{
                      alignSelf: "flex-start",
                      minHeight: 54,
                      padding: "0 32px",
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
                </form>
              ) : (
                <div role="status" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <Display size="md">
                    Thank You for Your <Accent gold>Generous Heart!</Accent>
                  </Display>
                  <p style={{ margin: 0, font: "400 17px/1.7 var(--font-sans)", color: "var(--fg-muted)" }}>
                    We appreciate your partnership in advancing the gospel. Please select your preferred giving
                    channel below:
                  </p>

                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
                      gap: 12,
                    }}
                  >
                    {CHANNELS.map(([label, href]) => (
                      <li key={href}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener"
                          className="hc-t hc-arrow hc-pill-outline-gold"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            minHeight: 58,
                            padding: "0 22px",
                            borderRadius: "var(--r-sm)",
                            border: "1px solid var(--hairline-strong)",
                            background: "var(--bg)",
                            color: "var(--fg)",
                            font: "600 15px/1.3 var(--font-sans)",
                            textDecoration: "none",
                          }}
                        >
                          {label}
                          <span data-mark aria-hidden="true">
                            &rarr;
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </Reveal>

          <Reveal index={1} style={{ marginTop: 22 }}>
            <p style={{ margin: 0, font: "500 12px/1.6 var(--font-mono)", letterSpacing: ".06em", color: "var(--fg-muted)" }}>
              HALLELUJAH CHALLENGE GOSPEL MUSIC INITIATIVE &bull; VERIFIED OFFICIAL STEWARDSHIP
            </p>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
