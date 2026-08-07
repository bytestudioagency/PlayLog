import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { fetchGamesPage, fetchLibraryStats, type LibraryStats } from "@/lib/games";
import { Logo } from "@/components/Logo";
import { GamesView } from "@/components/GamesView";
import type { Game } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let initialGames: Game[] = [];
  let initialTotal = 0;
  let initialStats: LibraryStats = {
    totalGames: 0,
    totalHours: 0,
    completedCount: 0,
    completionRate: 0,
    statusCounts: { playing: 0, completed: 0, dropped: 0, backlog: 0 },
    hoursByPlatform: [],
    ratingCounts: { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 },
    ratedCount: 0,
    averageHours: 0,
    dropRate: 0,
    mostPlayedGame: null,
    gamesByMonth: [],
  };
  let loadError: string | null = null;
  try {
    const [gamesPage, stats] = await Promise.all([
      fetchGamesPage(session.user.id, {}),
      fetchLibraryStats(session.user.id),
    ]);
    initialGames = gamesPage.games;
    initialTotal = gamesPage.total;
    initialStats = stats;
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Could not load your library. Check the Supabase configuration.";
  }

  const user = session.user;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
        <GamesView
          initialGames={initialGames}
          initialTotal={initialTotal}
          initialStats={initialStats}
          loadError={loadError}
          userId={session.user.id}
          siteUrl={siteUrl}
        />
      </main>
    </div>
  );
}
