import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PlayLog handles your data: what we store, why, and what we never do with it.",
};

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy" accent="policy">
      <p>Last updated: August 7, 2026</p>

      <h2>What we collect</h2>
      <p>
        When you sign in with Google, we receive your <strong>name, email
        address and profile picture</strong>. That is the entire extent of the
        account data we hold. We never see your Google password.
      </p>
      <p>
        Everything else in PlayLog is data you enter yourself: game titles,
        cover images you upload, hours played, ratings, platforms and statuses.
      </p>

      <h2>How we use it</h2>
      <p>
        Your data is used for exactly one thing: showing you your own game
        library. Your library itself is never shown to anyone else, aside
        from the two share pages described below (see &quot;Sharing&quot;).
      </p>

      <h2>Sharing</h2>
      <p>
        PlayLog gives every account two share pages: a backlog page and a
        completed-games tier list, reachable from the Share menu on your
        dashboard. These pages exist at a fixed link (not indexed by search
        engines) and are viewable by anyone who has that link. Nothing else
        in your library, and no personal details beyond your display name,
        ever appears on a share page.
      </p>

      <h2>What we never do</h2>
      <p>
        We do not sell your data, share it with advertisers, or use it to train
        anything. There is no analytics profile of your gaming habits.
      </p>

      <h2>Cookies</h2>
      <p>
        PlayLog sets only the cookies required to keep you signed in. There are
        no tracking cookies, no third-party ad cookies, and no analytics
        scripts.
      </p>

      <h2>Storage</h2>
      <p>
        Data is stored with Supabase (Postgres and object storage). Uploaded
        cover images are stored in a storage bucket so they can be displayed in
        your library.
      </p>

      <h2>Deleting your data</h2>
      <p>
        Deleting a game removes it permanently. If you want your entire account
        and library erased, contact us via the <a href="/contact" className="underline hover:text-fg">contact page</a>{" "}
        and we will remove everything.
      </p>

      <h2>Exporting your data</h2>
      <p>
        You can download a copy of your entire library at any time from your
        dashboard, as CSV or JSON.
      </p>
    </PageShell>
  );
}
