import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin, rowToGame } from "@/lib/supabase";
import { parseGameInput, gameInputToRow } from "@/lib/validate";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const input = parseGameInput(await req.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ error: "Invalid game data" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("games")
    .update(gameInputToRow(input))
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ game: rowToGame(data) });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const { error } = await supabaseAdmin()
    .from("games")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
