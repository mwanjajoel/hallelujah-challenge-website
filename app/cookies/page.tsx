import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: "How cookies and similar technologies are used on this site.",
};

export default function Page() {
  return <LegalPage slug="cookies" />;
}
