import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Ask Room",
  description:
    "The Ask Room is the Hallelujah Challenge's group of volunteer intercessors, labouring in prayer and fasting before every session.",
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

export default function Page() {
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="askroom" />
      </div>

      <main>
        <Section aria-label="Ask Room" width="text" glow="ember" glowAt="50% 0%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <p style={EYEBROW}>ASK ROOM PRAYERS</p>
            <Display as="h1" size="hero" style={{ maxWidth: "14ch" }}>
              Welcome to the <Accent gold>Ask Room</Accent>
            </Display>
            <p style={{ ...BODY, maxWidth: "56ch" }}>
              Every Hallelujah Challenge session is heralded by intense prayer, fasting and, sometimes, praise.
              Sessions are also closed with thanksgiving because, in the words of the convener, Nathaniel Bassey,
              &ldquo;he who takes the glory, fights the battle&rdquo;.
            </p>
          </Reveal>
        </Section>

        <Section aria-labelledby="who-h" tight width="text">
          <Reveal>
            <Card radius="lg" glow="gold" glowAt="85% 10%" style={{ padding: "clamp(28px, 4vw, 52px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <Display id="who-h" size="md" style={{ maxWidth: "20ch" }}>
                  Volunteer intercessors, labouring in <Accent>prayer and fasting</Accent>
                </Display>
                <p style={BODY}>
                  We call that prayer group the Ask Room. It consists of volunteer intercessors who labour in the place
                  of prayer and fasting to implore heaven for the release of grace and power, and for abounding signs
                  and wonders to accompany every Hallelujah Challenge session.
                </p>
                <ArrowLink href="/contact" variant="gold">
                  Request to join the Ask Room
                </ArrowLink>
              </div>
            </Card>
          </Reveal>

          <Reveal index={1} style={{ marginTop: 28 }}>
            <p style={{ ...BODY, fontSize: 15 }}>
              Requests are read by the team. If you would rather write directly, the address is{" "}
              <a href="mailto:info@hallelujahchallengelive.com" className="hc-t hc-footlink" style={{ color: "var(--accent)" }}>
                info@hallelujahchallengelive.com
              </a>
              .
            </p>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
