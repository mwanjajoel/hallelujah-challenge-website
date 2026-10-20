import type { Metadata } from "next";
import GivePage from "@/components/give/GivePage";

export const metadata: Metadata = {
  title: "Give",
  description: "Partner with the Hallelujah Challenge. Give online, or transfer directly using the account details.",
};

export default function Page() {
  return <GivePage />;
}
