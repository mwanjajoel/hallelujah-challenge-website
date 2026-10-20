import type { Metadata } from "next";
import WatchPage from "@/components/watch/WatchPage";

export const metadata: Metadata = {
  title: "Watch",
  description: "Watch the Hallelujah Challenge live every night at 11:59 PM WAT, and browse every replay.",
};

export default function Page() {
  return <WatchPage />;
}
