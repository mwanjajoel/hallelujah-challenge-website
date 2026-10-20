import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Hallelujah Challenge team.",
};

export default function Page() {
  return <ContactPage />;
}
