import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin, rowToGame } from "@/lib/supabase";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicGameTile } from "@/components/PublicGameTile";
import type { Game } from "@/lib/types";

export const metadata: Metadata = {
  title: "Backlog",
  robots: { index: false, follow: false },
};

type Params = { params: Promise<{ id: string }> };

export default async function PublicBacklogPage({ params }: Params) {
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
    .eq("status", "backlog")
    .order("created_at", { ascending: false });

  const games = (gameRows ?? []).map(rowToGame) as Game[];
  const displayName = userRow.name ?? "This player";

  return (
    <div className="min-h-svh">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-12">
        <h1 className="mt-2 font-display text-5xl uppercase leading-none sm:text-6xl">
          {displayName}&apos;s <span className="text-red-hot">
            Backlog
          </span>
        </h1>

        {games.length === 0 ? (
          <p className="mt-16 font-display text-4xl uppercase leading-none text-faint">
            Nothing queued right now.
          </p>
        ) : (
          <ul className="mt-10 grid list-none grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-5 gap-y-8">
            {games.map((game) => (
              <li key={game.id}>
                <PublicGameTile game={game} showHours={false} />
              </li>
            ))}
          </ul>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
