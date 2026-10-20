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
    "Hallelujah Challenge is an hour-long online praise program unto the Lord, convened by Pastor Nathaniel Bassey since 2017.",
};

const BODY = {
  margin: 0,
  font: "400 clamp(17px, 1.5vw, 20px)/1.75 var(--font-sans)",
  color: "var(--fg-muted)",
  textWrap: "pretty",
} as const;

/**
 * Wording here is verbatim from hallelujahchallengelive.com/about-6.
 *
 * It is reproduced as published, including "hold daily", "breakthrough",
 * "Hallenge Challenge" and "is to praise of God" — all of which read as slips
 * but are what the site says. Corrections belong with the ministry, not here.
 */
export default function Page() {
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="about" />
      </div>

      <main>
        <Section aria-label="About" width="text" glow="blue" glowAt="20% 12%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <Display as="h1" size="hero" style={{ maxWidth: "13ch" }}>
              The Hallelujah <Accent gold>Challenge</Accent>
            </Display>
            <p style={{ ...BODY, maxWidth: "56ch" }}>
              Hallelujah Challenge is an hour-long online praise program unto the Lord. The sessions of praise hold
              daily during designated periods every year, as God leads the convener, Pastor Nathaniel Bassey.
              Commencing at 11:59PM, it features sessions of passionate praise and prayer.
            </p>
            <p style={{ ...BODY, maxWidth: "56ch" }}>
              Hallelujah Challenge has become a mountain of high praises, fervent prayer, heartfelt worship,
              deliverance, breakthrough, miracles and signs.
            </p>
          </Reveal>
        </Section>

        <Section aria-label="How it began" tight width="text">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={BODY}>
              The Challenge first held in 2017 from June 1 - June 30, 2017 and followed the #tongueschallenge that held
              prior. It all started from an Instagram Live video by Nathaniel Bassey, streaming praise and worship from
              his living room. That initial praise session went on to attract tens of thousands around the world,
              joining online to praise God together.
            </p>
            <p style={BODY}>
              Editions of the Hallenge Challenge often (but not always) ends with a Festival, which holds at a physical
              venue. It features time of praise, intercession prayer and lots of testimonies.
            </p>
            <p style={BODY}>
              The primary inspiration of the Challenge is to praise of God. As it is in scriptures, when believers
              gather together to offer praise, God is provoked to do more. Testimonies arise and judgment is rendered
              upon the enemy. No surprise why the key scripture of the Challenge are:
            </p>
          </Reveal>

          <Reveal index={1} style={{ marginTop: "clamp(28px, 4vw, 44px)" }}>
            <Card radius="lg" glow="gold" glowAt="12% 0%" style={{ padding: "clamp(28px, 4vw, 48px)" }}>
              <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                <figcaption
                  style={{ font: "500 12px/1 var(--font-mono)", letterSpacing: ".14em", color: "var(--accent)" }}
                >
                  ACTS 16:25-26
                </figcaption>
                <blockquote
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(21px, 2.3vw, 32px)",
                    lineHeight: 1.38,
                    color: "var(--fg)",
                  }}
                >
                  25 And at midnight Paul and Silas prayed, and sang praises unto God: and the prisoners heard them.
                  26 And suddenly there was a great earthquake, so that the foundations of the prison were shaken: and
                  immediately all the doors were opened, and everyone&rsquo;s bands were loosed
                </blockquote>
              </figure>
            </Card>
          </Reveal>

          <Reveal index={2} style={{ marginTop: "clamp(28px, 4vw, 44px)" }}>
            <p style={BODY}>
              Since 2017, every edition of the Hallelujah Challenge has been confirmed with testimonies, many so
              shocking that they are hard to share publicly. God be praised for His marvelous works.
            </p>
          </Reveal>
        </Section>

        <Section aria-label="Join tonight" tight width="text">
          <Reveal style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <ArrowLink href="/watch" variant="gold">
              Watch Live
            </ArrowLink>
            <ArrowLink href="/testimonies" variant="outline">
              Read More Testimonies
            </ArrowLink>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
