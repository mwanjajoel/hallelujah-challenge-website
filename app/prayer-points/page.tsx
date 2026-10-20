import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Display, { Accent } from "@/components/ui/Display";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Prayer Points",
  description: "The prayer guide for the October 2026 edition of the Hallelujah Challenge.",
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

/** Each section pairs the ministry's own prayer lines with its scriptures. */
const SECTIONS: Array<{ letter: string; title: string; scriptures: string; lines: string[] }> = [
  {
    letter: "A",
    title: "Thanksgiving",
    scriptures: "Psalm 136; Psalm 92",
    lines: [
      "Father, in the name of Jesus, we thank You for Your goodness and faithfulness, and for Your marvellous works throughout every edition of the Hallelujah Challenge, from its inception in 2017 until this present day.",
      "Father, we thank You for the salvation of souls and for the finished work of Jesus Christ on the cross.",
      "Father, we thank You for every vessel You have used in previous editions. We give You all the glory for their lives, service, sacrifices and obedience.",
    ],
  },
  {
    letter: "B",
    title: "The blood of Jesus",
    scriptures: "Revelation 12:11; Hebrews 12:24",
    lines: [
      "Father, in the name of Jesus, we come by the blood of Jesus.",
      "Father, we plead the blood of Jesus over the entire event, every vessel and every instrument that will be used throughout every night of this edition.",
      "Father, let the power in the blood of Jesus be released every night of the Hallelujah Challenge.",
    ],
  },
  {
    letter: "C",
    title: "The Holy Spirit, the breath of God",
    scriptures: "Job 33:4; Ezekiel 37:9; Isaiah 32:15; Acts 1:8; Acts 2:1–4",
    lines: [
      "Father, in the name of Jesus, let there be a mighty move of Your Spirit throughout and after this event.",
      "Father, because it is the Spirit who gives life, we ask for the breath of God upon every session, every song, every prayer and every prophetic utterance.",
      "Father, we declare that the gifts of the Spirit will manifest in full measure, with precision and power.",
      "Father, we declare an outpouring of Your Spirit upon every participant of this edition.",
    ],
  },
  {
    letter: "D",
    title: "Mercy",
    scriptures: "Psalm 90:14; Psalm 85:7; Psalm 102:13",
    lines: [
      "Father, in this edition and in this season, satisfy us early with Your mercy, that we may rejoice and be glad all our days.",
      "Father, show us Your mercy and grant us Your salvation.",
      "Father, arise and have mercy upon us, for the time to favour us — yes, the set time — has come.",
      "Father, let Your mercy break forth in this edition, speaking powerfully into the lives of Your people.",
    ],
  },
  {
    letter: "E",
    title: "The fire of God",
    scriptures: "Acts 2:3–4",
    lines: ["Father, in the name of Jesus, let Your fire fall every night of this edition."],
  },
  {
    letter: "F",
    title: "Healing stream",
    scriptures: "Ezekiel 47:8–10",
    lines: ["Father, in the name of Jesus, let Your healing stream flow every night of this edition."],
  },
  {
    letter: "G",
    title: "Signs and wonders",
    scriptures: "Acts 4:16; Acts 5:12; Acts 10:38",
    lines: [
      "Father, we call forth testimonies, notable miracles, signs and wonders; deliverances and breakthroughs like never seen before; and diverse and multiple healings.",
    ],
  },
  {
    letter: "H",
    title: "Salvation of souls",
    scriptures: "Acts 2:47; 2 Corinthians 4:3–4; Acts 2:41; Acts 4:4",
    lines: [
      "Father, we call forth a massive harvest of souls in this edition of the Hallelujah Challenge.",
      "Father, let multitudes encounter Jesus Christ, receive salvation and become established in the faith.",
    ],
  },
  {
    letter: "I",
    title: "Anointing for the ministers",
    scriptures: "Acts 4:33; Psalm 92:10; Luke 3:16",
    lines: [
      "Father, we call forth fresh fire, fresh oil, great grace and power for every minister in this edition.",
      "Father, let every minister serve under the fullness of Your Spirit, with grace, accuracy, boldness and power.",
    ],
  },
];

const READING = [
  ["Day 1", "Psalm 92, Acts 1"],
  ["Day 2", "Psalm 7, Acts 2 & 3"],
  ["Day 3", "Psalm 95, Acts 4 & 5"],
  ["Day 4", "Psalm 136, Acts 6 & 7"],
  ["Day 5", "Psalm 28, Acts 8"],
];

export default function Page() {
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <SiteHeader active="prayerpoints" />
      </div>

      <main>
        <Section aria-label="Prayer focus" width="text" glow="ember" glowAt="30% 10%">
          <Reveal style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.6vw, 32px)" }}>
            <p style={EYEBROW}>OCTOBER 2026 EDITION</p>
            <Display as="h1" size="hero" style={{ maxWidth: "12ch" }}>
              Prayer <Accent gold>focus</Accent>
            </Display>
            <p style={{ ...BODY, maxWidth: "52ch" }}>
              The prayer guide for this edition. Scriptures are given by reference so you can read them in your own
              translation.
            </p>
          </Reveal>

          <Reveal index={1} style={{ marginTop: "clamp(28px, 4vw, 44px)" }}>
            <Card radius="lg" style={{ padding: "clamp(24px, 3.4vw, 40px)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px, 4vw, 56px)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ ...EYEBROW, color: "var(--fg-muted)" }}>PRAYING IN SPIRITUAL TONGUES</p>
                  <p style={{ margin: 0, font: "400 clamp(26px, 3vw, 40px)/1 var(--font-display)", color: "var(--accent)" }}>
                    25 minutes
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ ...EYEBROW, color: "var(--fg-muted)" }}>PRAYING WITH UNDERSTANDING</p>
                  <p style={{ margin: 0, font: "400 clamp(26px, 3vw, 40px)/1 var(--font-display)", color: "var(--accent)" }}>
                    35 minutes
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        </Section>

        <Section aria-labelledby="guide-h" tight width="text">
          <Reveal style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
            <Display id="guide-h" size="xl" style={{ maxWidth: "16ch" }}>
              The <Accent>prayer guide</Accent>
            </Display>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SECTIONS.map((s, i) => (
              <Reveal key={s.letter} variant="sharpen" index={i % 5}>
                <Card radius="md" style={{ padding: "clamp(22px, 3vw, 34px)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                      <span
                        aria-hidden="true"
                        style={{ font: "400 26px/1 var(--font-display)", color: "var(--accent)", flex: "none" }}
                      >
                        {s.letter}
                      </span>
                      <h3 style={{ margin: 0, font: "400 clamp(21px, 2.1vw, 30px)/1.25 var(--font-display)", flex: 1 }}>
                        {s.title}
                      </h3>
                    </div>
                    <p style={{ ...EYEBROW, color: "var(--fg-muted)", letterSpacing: ".06em" }}>{s.scriptures}</p>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                      {s.lines.map((line) => (
                        <li
                          key={line.slice(0, 40)}
                          style={{
                            display: "flex",
                            gap: 12,
                            font: "400 16px/1.7 var(--font-sans)",
                            color: "var(--fg-dim)",
                            textWrap: "pretty",
                          }}
                        >
                          <span aria-hidden="true" style={{ color: "var(--accent)", flex: "none" }}>
                            &middot;
                          </span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal index={1} style={{ marginTop: 20 }}>
            <Card radius="md" style={{ padding: "clamp(22px, 3vw, 32px)", border: "1px dashed var(--hairline-strong)", background: "transparent" }}>
              <p style={{ ...BODY, fontSize: 15 }}>
                A further section on supernatural strength, and the remainder of the reading plan, are still to be
                supplied by the ministry &mdash; they are incomplete on the current site too.
              </p>
            </Card>
          </Reveal>
        </Section>

        <Section aria-labelledby="read-h" tight width="text">
          <Reveal style={{ marginBottom: "clamp(22px, 3vw, 36px)" }}>
            <Display id="read-h" size="lg">
              Bible <Accent>reading plan</Accent>
            </Display>
          </Reveal>
          <Reveal variant="sharpen">
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column" }}>
              {READING.map(([day, text]) => (
                <li
                  key={day}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px 24px",
                    padding: "18px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span style={{ ...EYEBROW, minWidth: 70 }}>{day.toUpperCase()}</span>
                  <span style={{ font: "400 18px/1.4 var(--font-sans)", color: "var(--fg)" }}>{text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={1} style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <ArrowLink href="/watch" variant="gold">
              Watch live
            </ArrowLink>
            <ArrowLink href="/ask-room" variant="outline">
              Join the Ask Room
            </ArrowLink>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
