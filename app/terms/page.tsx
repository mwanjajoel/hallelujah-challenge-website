import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The agreement between you and the Hallelujah Challenge.",
};

export default function Page() {
  return <LegalPage slug="terms" />;
}
