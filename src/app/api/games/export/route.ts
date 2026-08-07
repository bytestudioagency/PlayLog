import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin, rowToGame } from "@/lib/supabase";
import { platformName, STATUS_LABELS, type Game } from "@/lib/types";

function csvField(value: string | number): string {
  const str = String(value);
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function toCsv(games: Game[]): string {
  const header = ["Title", "Platform", "Status", "Rating", "Time played (hrs)", "Added on", "Image URL"];
  const rows = games.map((g) => [
    g.title,
    platformName(g),
    STATUS_LABELS[g.status],
    g.rating ?? "",
    g.timePlayed,
    g.createdAt.slice(0, 10),
    g.imageUrl ?? "",
  ]);
  return [header, ...rows].map((row) => row.map(csvField).join(",")).join("\r\n");
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = new URL(req.url).searchParams.get("format") === "csv" ? "csv" : "json";

  const { data, error } = await supabaseAdmin()
    .from("games")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const games = (data ?? []).map(rowToGame) as Game[];
  const date = new Date().toISOString().slice(0, 10);

  if (format === "csv") {
    return new NextResponse(toCsv(games), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="playlog-export-${date}.csv"`,
      },
    });
  }

  const jsonGames = games.map((g) => {
    const { id: _id, customPlatformName: _customPlatformName, ...rest } = g;
    return { ...rest, platform: platformName(g) };
  });

  return new NextResponse(JSON.stringify(jsonGames, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="playlog-export-${date}.json"`,
    },
  });
}
