import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The short, readable rules for using PlayLog.",
};

export default function TermsPage() {
  return (
    <PageShell title="Terms of" accent="service">
      <p>Last updated: August 2, 2026</p>

      <h2>The service</h2>
      <p>
        PlayLog is a personal game tracker. You sign in with Google, log the
        games you play, and that&apos;s the deal. The service is provided free
        of charge, as-is, without warranties of any kind.
      </p>

      <h2>Your account</h2>
      <p>
        You are responsible for the content you add to your library. Don&apos;t
        upload images you don&apos;t have the right to use, and don&apos;t use
        the service for anything unlawful.
      </p>

      <h2>Your content</h2>
      <p>
        Everything you log remains yours. We claim no ownership over your
        library data or uploaded images, and we only store them to show them
        back to you.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep PlayLog online and your data safe, but we can&apos;t
        guarantee uninterrupted service. Keep your own notes on anything you
        truly cannot afford to lose.
      </p>

      <h2>Changes</h2>
      <p>
        If these terms change in a way that matters, we&apos;ll note the new
        date at the top of this page. Continued use after a change means you
        accept the updated terms.
      </p>
    </PageShell>
  );
}
