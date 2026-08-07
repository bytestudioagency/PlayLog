import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin, rowToGame } from "@/lib/supabase";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicGameTile } from "@/components/PublicGameTile";
import { RATING_BADGE } from "@/components/GameCard";
import { RATINGS, type Game, type Rating } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tier list",
  robots: { index: false, follow: false },
};

type Params = { params: Promise<{ id: string }> };

export default async function PublicTierPage({ params }: Params) {
  const { id } = await params;

  const { data: userRow } = await supabaseAdmin()
    .from("users")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();

  if (!userRow) notFound();

  const { data: gameRows } = await supabaseAdmin()
    .from("games")
    .select("*")
    .eq("user_id", id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const games = (gameRows ?? []).map(rowToGame) as Game[];
  const displayName = userRow.name ?? "This player";

  const tiers: { rating: Rating; games: Game[] }[] = RATINGS.map((rating) => ({
    rating,
    games: games.filter((g) => g.rating === rating),
  }));
  const unranked = games.filter((g) => !g.rating);

  return (
    <div className="min-h-svh">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-12">
        <h1 className="mt-2 font-display text-5xl uppercase leading-none sm:text-6xl">
          {displayName}&apos;s <span className="text-red-hot">
            Tier list
          </span>
        </h1>
        <p className="mt-3 text-sm text-mut">
          {games.length} {games.length === 1 ? "game" : "games"} completed
        </p>

        {games.length === 0 ? (
          <p className="mt-16 font-display text-4xl uppercase leading-none text-faint">
            Nothing completed yet.
          </p>
        ) : (
          <div className="mt-10 space-y-3">
            {tiers.map(({ rating, games: tierGames }) => (
              <div
                key={rating}
                className="flex gap-4 border-t border-line py-4 first:border-t-0 first:pt-0"
              >
                <div
                  className={`grid h-16 w-16 shrink-0 place-items-center font-display text-4xl ${RATING_BADGE[rating]}`}
                >
                  {rating}
                </div>
                <div className="flex flex-1 flex-wrap gap-4">
                  {tierGames.length === 0 ? (
                    <p className="self-center text-sm text-faint">No games in this tier.</p>
                  ) : (
                    tierGames.map((game) => (
                      <div key={game.id} className="w-28">
                        <PublicGameTile game={game} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
            {unranked.length > 0 && (
              <div className="flex gap-4 border-t border-line py-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center bg-raised font-display text-xs uppercase text-faint">
                  N/A
                </div>
                <div className="flex flex-1 flex-wrap gap-4">
                  {unranked.map((game) => (
                    <div key={game.id} className="w-28">
                      <PublicGameTile game={game} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
