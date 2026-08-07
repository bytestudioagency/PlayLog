import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { fetchLibraryStats, type LibraryStats } from "@/lib/games";
import { Logo } from "@/components/Logo";
import { StatsPanel } from "@/components/StatsPanel";

export const metadata: Metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
};

export default async function StatsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let stats: LibraryStats | null = null;
  let loadError: string | null = null;
  try {
    stats = await fetchLibraryStats(session.user.id);
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Could not load your stats. Check the Supabase configuration.";
  }

  const user = session.user;

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full border border-line"
                />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-raised font-display">
                  {(user.name ?? "?").charAt(0)}
                </span>
              )}
              <span className="hidden text-sm font-medium text-mut sm:block">
                {user.name}
              </span>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="border border-line px-3 py-1.5 text-sm font-semibold text-mut transition-colors hover:border-red hover:text-red-hot"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-24 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl uppercase leading-none sm:text-6xl">
            Library <span className="text-red-hot">stats</span>
          </h1>
          <Link
            href="/dashboard"
            className="border border-line px-3.5 py-2 text-sm font-semibold text-mut transition-colors hover:border-red hover:text-red-hot"
          >
            Dashboard
          </Link>
        </div>

        {loadError && (
          <div className="mt-8 border border-red-deep bg-panel px-4 py-3 text-sm">
            <span className="font-display uppercase text-red-hot">Load error·</span>{" "}
            <span className="text-mut">{loadError}</span>
          </div>
        )}

        {stats && stats.totalGames === 0 && (
          <div className="mt-20 max-w-xl">
            <p className="font-display text-6xl uppercase leading-[0.95] text-faint sm:text-7xl">
              Nothing
              <br />
              to show <span className="text-red">yet</span>
            </p>
            <p className="mt-6 leading-[1.65] text-mut">
              Log a few games from your library and stats will show up here.
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-block bg-red px-6 py-3 font-display text-lg uppercase tracking-wide transition-colors hover:bg-red-hot"
              style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
            >
              Go to library
            </Link>
          </div>
        )}

        {stats && stats.totalGames > 0 && <StatsPanel stats={stats} />}
      </main>
    </div>
  );
}
