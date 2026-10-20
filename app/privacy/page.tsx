import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the Hallelujah Challenge collects, uses and protects your information.",
};

export default function Page() {
  return <LegalPage slug="privacy" />;
}
