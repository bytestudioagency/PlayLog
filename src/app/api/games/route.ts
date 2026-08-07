import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin, rowToGame } from "@/lib/supabase";
import { parseGameInput, gameInputToRow } from "@/lib/validate";
import { fetchGamesPage, type SortKey } from "@/lib/games";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  try {
    const result = await fetchGamesPage(session.user.id, {
      status: url.searchParams.get("status"),
      platform: url.searchParams.get("platform"),
      q: url.searchParams.get("q"),
      sort: url.searchParams.get("sort") as SortKey | null,
      page: Number(url.searchParams.get("page") ?? "1"),
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not load games" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = parseGameInput(await req.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ error: "Invalid game data" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("games")
    .insert({ ...gameInputToRow(input), user_id: session.user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ game: rowToGame(data) }, { status: 201 });
}
