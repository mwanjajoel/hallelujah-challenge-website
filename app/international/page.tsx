import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Int'l Guests",
  description:
    "Travelling to Nigeria for the Hallelujah Festival on Friday 30 October 2026 in Ikeja, Lagos. Registration details and guest FAQ.",
};

const EYEBROW = {
  margin: 0,
  font: "500 12px/1 var(--font-mono)",
  letterSpacing: ".14em",
  color: "var(--accent)",
} as const;

const BODY = {
  margin: 0,
  font: "400 clamp(17px, 1.5vw, 20px)/1.75 var(--font-sans)",
  color: "var(--fg-muted)",
  textWrap: "pretty",
} as const;

const FACTS: Array<[string, string]> = [
  ["When", "Friday, 30 October 2026 — an all-night vigil"],
  ["Where", "Ikeja, Lagos, Nigeria"],
  ["Admission", "Free to attend"],
  ["Nearest airport", "Murtala Muhammed International Airport (LOS)"],
];

const FAQ: Array<[string, string]> = [
  [
    "When is the Hallelujah Festival?",
    "Friday, 30 October 2026. It will be a vigil, and details regarding door opening and the commencement time will be released shortly.",
  ],
  ["Where is the Festival held?", "In Ikeja, Lagos, Nigeria."],
  [
    "Where is the closest airport to the venue?",
    "Murtala Muhammed International Airport (LOS), in Ikeja, Lagos, Nigeria.",
  ],
  [
    "Who can attend the Hallelujah Festival?",
    "The Festival is open to everyone. You do not need to be a member of a particular church or organisation to attend.",
  ],
  [
    "Is accommodation provided for international attendees?",
    "Accommodation is not provided as part of Festival registration. International attendees will need to make their own arrangements. Recommended hotels will be shared with registered international attendees.",
  ],
  [
    "Is registration required?",
    "The international registration category is strictly for attendees travelling to Nigeria from outside the country. Registration assists the team with planning, coordination and the provision of relevant information. Please look out for the registration link, which will go live in due course.",
  ],
  ["Is the Hallelujah Festival free?", "Yes. The Hallelujah Festival is completely free to attend."],
  [
    "What time should I arrive?",
    "Attendees are encouraged to arrive early to allow sufficient time for security checks and entry. Seating is first-come, first-served.",
  ],
  [
    "Does registration guarantee a visa or entry into Nigeria?",
    "No. Registration for the Festival does not guarantee a visa, or provide immigration assistance, visa approval or entry into Nigeria.",
  ],
  ["Will there be food and drinks?", "Yes, food and drinks will be available for purchase at the venue."],
  [
    "What if there is a medical emergency?",
    "Medical facilities and personnel will be available at the Festival to attend to immediate medical needs.",
  ],
  [
    "How can I get help if I need assistance?",
    "You can reach out via our social media pages, or email guests@hallelujahchallengelive.com for urgent enquiries.",
  ],
  [
    "Will the Festival be streamed online?",
    "Yes. The Hallelujah Festival will be streamed online through Nathaniel Bassey's official channels.",
  ],
];

export default function Page() {
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="int" />
      </div>

      <main>
        <Section aria-label="International attendee registration" width="text" glow="gold" glowAt="24% 12%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <p style={EYEBROW}>INTERNATIONAL ATTENDEE REGISTRATION</p>
            <Display as="h1" size="hero" style={{ maxWidth: "15ch" }}>
              Travelling in for the <Accent gold>Festival</Accent>
            </Display>
            <p style={{ ...BODY, maxWidth: "56ch" }}>
              If you&rsquo;re travelling to Nigeria to attend the Hallelujah Festival, we&rsquo;d love to welcome you.
              Please complete the international attendee registration form. This helps our team prepare for your
              arrival and keep you informed ahead of the Festival.
            </p>
          </Reveal>

          <Reveal index={1} style={{ marginTop: "clamp(32px, 4vw, 52px)" }}>
            <Card radius="lg" glow="blue" glowAt="88% 15%" style={{ padding: "clamp(26px, 3.6vw, 44px)" }}>
              <dl
                style={{
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
                  gap: "clamp(20px, 3vw, 36px)",
                }}
              >
                {FACTS.map(([k, v]) => (
                  <div key={k} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <dt style={{ ...EYEBROW, color: "var(--fg-muted)" }}>{k.toUpperCase()}</dt>
                    <dd style={{ margin: 0, font: "400 17px/1.5 var(--font-sans)", color: "var(--fg)" }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </Reveal>

          <Reveal index={2} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            <ArrowLink href="mailto:guests@hallelujahchallengelive.com" variant="gold" external>
              Register your visit
            </ArrowLink>
            <p style={{ ...BODY, fontSize: 15, maxWidth: "60ch" }}>
              This form is for attendees travelling to Nigeria from outside the country. Registering does not provide
              or guarantee a visa, visa approval, immigration assistance or entry into Nigeria. You are responsible for
              meeting all applicable entry and travel requirements.
            </p>
            <p style={{ ...BODY, fontSize: 15, maxWidth: "60ch" }}>
              For anything else about your visit or registration, get in touch at{" "}
              <a href="mailto:guests@hallelujahchallengelive.com" className="hc-t hc-footlink" style={{ color: "var(--accent)" }}>
                guests@hallelujahchallengelive.com
              </a>
              .
            </p>
          </Reveal>
        </Section>

        <Section aria-labelledby="faq-h" tight width="text">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "clamp(24px, 3vw, 40px)" }}>
            <p style={EYEBROW}>HAVE A QUESTION?</p>
            <Display id="faq-h" size="xl" style={{ maxWidth: "15ch" }}>
              International guest <Accent>FAQ</Accent>
            </Display>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQ.map(([q, a], i) => (
              <Reveal key={q} variant="sharpen" index={i % 6}>
                <details className="hc-faq">
                  <summary>
                    <span
                      aria-hidden="true"
                      style={{
                        font: "500 12px/1 var(--font-mono)",
                        color: "var(--accent)",
                        fontVariantNumeric: "tabular-nums",
                        flex: "none",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ flex: 1 }}>{q}</span>
                    <span aria-hidden="true" data-chev>
                      +
                    </span>
                  </summary>
                  <p>{a}</p>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal index={1} style={{ marginTop: "clamp(32px, 4vw, 52px)" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 2.4vw, 32px)",
                lineHeight: 1.35,
                color: "var(--fg)",
              }}
            >
              We are joyfully looking forward to welcoming you to Lagos, and sharing a beautiful night at the Hallelujah
              Festival. <Accent gold>God bless you.</Accent>
            </p>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
