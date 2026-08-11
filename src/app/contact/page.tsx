import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PlayLog team: feedback, bugs, or data requests.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell title="Contact" accent="us">
      <p>
        Found a bug, want a feature, or need your account deleted? We read
        everything.
      </p>
      <p>
        Email us at{" "}
        <a
          href="mailto:sohailatwork10@gmail.com"
          className="font-semibold text-fg underline decoration-red decoration-2 underline-offset-4 hover:text-red-hot"
        >
          sohailatwork10@gmail.com
        </a>{" "}
        and we&apos;ll get back to you as soon as we can.
      </p>
      <p>
        For data deletion requests, send the email from the Google account you
        use to sign in so we can verify it&apos;s really you.
      </p>
    </PageShell>
  );
}
