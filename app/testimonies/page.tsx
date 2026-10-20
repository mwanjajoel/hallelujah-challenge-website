import type { Metadata } from "next";
import TestimoniesPage from "@/components/testimonies/TestimoniesPage";

export const metadata: Metadata = {
  title: "Testimonies",
  description: "His mercy endures forever. Testimonies from Hallelujans around the world.",
};

export default function Page() {
  return <TestimoniesPage />;
}
