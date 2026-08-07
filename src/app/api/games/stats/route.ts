import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchLibraryStats } from "@/lib/games";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await fetchLibraryStats(session.user.id);
    return NextResponse.json(stats);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not load stats" },
      { status: 500 }
    );
  }
}
