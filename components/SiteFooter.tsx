import Link from "next/link";

const LINK: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  minHeight: 40,
  color: "#F6F1E7",
  textDecoration: "none",
  font: "400 16px/1.3 Geist,sans-serif",
};

const LEGAL: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  padding: "0 10px",
  color: "#A9AEC2",
  font: "400 14px/1 Geist,sans-serif",
  textDecoration: "none",
};

export default function SiteFooter() {
  return (
    <footer
      style={{
        position: "relative",
        background: "#0B0D17",
        color: "#F6F1E7",
        fontFamily: "Geist,system-ui,sans-serif",
        borderTop: "1px solid #262B40",
        overflow: "clip",
        containerType: "inline-size",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9cqw,120px) clamp(20px,5cqw,64px) 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))",
            gap: 36,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img
              src="/assets/hc-logo.png"
              alt="Hallelujah Challenge"
              width={217}
              height={90}
              style={{ height: 56, width: "auto", alignSelf: "flex-start" }}
            />
            <img
              src="/assets/hc-theme-the-lord-reigns.png"
              alt="The Lord Reigns"
              width={654}
              height={626}
              loading="lazy"
              style={{ width: 120, height: "auto", display: "block" }}
            />
          </div>

          <nav aria-label="Footer" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Link href="/" className="hc-footlink" style={LINK}>
              Home
            </Link>
            <a href="#" className="hc-footlink" style={LINK}>
              Int
            </a>
            <a href="#" className="hc-footlink" style={LINK}>
              New Converts
            </a>
            <Link href="/#about" className="hc-footlink" style={LINK}>
              About
            </Link>
            <Link href="/testimonies" className="hc-footlink" style={LINK}>
              Testimonies
            </Link>
          </nav>

          <nav aria-label="Footer more" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Link href="/watch" className="hc-footlink" style={LINK}>
              Watch Live
            </Link>
            <Link href="/give" className="hc-footlink" style={LINK}>
              Partnership/Giving
            </Link>
            <a href="#" className="hc-footlink" style={LINK}>
              Ask Room Prayers
            </a>
            <a href="#" className="hc-footlink" style={LINK}>
              Prayer Points
            </a>
            <a href="#" className="hc-footlink" style={LINK}>
              Contact
            </a>
          </nav>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a
              href="mailto:info@hallelujahchallengelive.com"
              className="hc-footlink"
              style={{
                font: "400 16px/1.5 Geist,sans-serif",
                color: "#F6F1E7",
                textUnderlineOffset: 4,
                wordBreak: "break-word",
              }}
            >
              info@hallelujahchallengelive.com
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: "1px solid #262B40",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0, font: "400 14px/1.5 Geist,sans-serif", color: "#A9AEC2" }}>
            ©2026 by Hallelujah Challenge Gospel Music Initiative
          </p>
          <nav aria-label="Legal" style={{ display: "flex", gap: 4 }}>
            <a href="#" className="hc-legallink" style={LEGAL}>
              Privacy Policy
            </a>
            <a href="#" className="hc-legallink" style={LEGAL}>
              Cookies
            </a>
            <a href="#" className="hc-legallink" style={LEGAL}>
              Terms And Conditions
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
