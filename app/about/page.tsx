import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hallelujah Challenge is an hour-long online praise programme unto the Lord, convened by Pastor Nathaniel Bassey since 2017.",
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
        <SiteHeader active="about" />
      </div>

      <main>
        <Section aria-label="About" width="text" glow="blue" glowAt="20% 12%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <p style={EYEBROW}>ABOUT</p>
            <Display as="h1" size="hero" style={{ maxWidth: "13ch" }}>
              The Hallelujah <Accent gold>Challenge</Accent>
            </Display>
            <p style={{ ...BODY, maxWidth: "56ch" }}>
              Hallelujah Challenge is an hour-long online praise programme unto the Lord. The sessions of praise are
              held daily during designated periods every year, as God leads the convener, Pastor Nathaniel Bassey.
              Commencing at 11:59 PM, it features sessions of passionate praise and prayer.
            </p>
          </Reveal>
        </Section>

        <Section aria-labelledby="story-h" tight width="text">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <Display id="story-h" size="lg" style={{ maxWidth: "18ch" }}>
              It began in a <Accent>living room</Accent>
            </Display>
            <p style={BODY}>
              The Challenge first held in 2017, from 1 to 30 June, following the #tongueschallenge that had run before
              it. It all started from an Instagram Live video by Nathaniel Bassey, streaming praise and worship from
              his living room. That initial praise session went on to attract tens of thousands around the world,
              joining online to praise God together.
            </p>
            <p style={BODY}>
              Editions of the Hallelujah Challenge often, though not always, end with a Festival held at a physical
              venue. It features a time of praise, intercessory prayer, and many testimonies.
            </p>
            <p style={BODY}>
              Hallelujah Challenge has become a mountain of high praises, fervent prayer, heartfelt worship,
              deliverance, breakthroughs, miracles and signs.
            </p>
          </Reveal>
        </Section>

        <Section aria-labelledby="why-h" tight width="text">
          <Reveal index={0} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <p style={EYEBROW}>WHY WE GATHER</p>
            <Display id="why-h" size="lg" style={{ maxWidth: "20ch" }}>
              The inspiration of the Challenge is the <Accent gold>praise of God</Accent>
            </Display>
            <p style={BODY}>
              As it is in the scriptures, when believers gather together to offer praise, God is provoked to do more.
              Testimonies arise, and judgment is rendered upon the enemy. No surprise, then, that the key scripture of
              the Challenge is Acts 16:25&ndash;26 &mdash; Paul and Silas praying and singing praises at midnight, and
              the foundations of the prison shaken, every door opened and every band loosed.
            </p>
          </Reveal>

          <Reveal index={1} style={{ marginTop: "clamp(32px, 4vw, 52px)" }}>
            <Card radius="lg" glow="gold" glowAt="12% 0%" style={{ padding: "clamp(28px, 4vw, 48px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p style={{ ...EYEBROW, color: "var(--ember)" }}>SINCE 2017</p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(23px, 2.6vw, 38px)",
                    lineHeight: 1.33,
                    color: "var(--fg)",
                  }}
                >
                  Every edition of the Hallelujah Challenge has been confirmed with testimonies, many so shocking that
                  they are hard to share publicly. <Accent gold>God be praised for His marvellous works.</Accent>
                </p>
                <ArrowLink href="/testimonies">Read the testimonies</ArrowLink>
              </div>
            </Card>
          </Reveal>
        </Section>

        <Section aria-label="Join tonight" tight width="text">
          <Reveal style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <ArrowLink href="/watch" variant="gold">
              Watch live
            </ArrowLink>
            <ArrowLink href="/prayer-points" variant="outline">
              Tonight&rsquo;s prayer points
            </ArrowLink>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
