import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service role key. Auth is enforced by
 * NextAuth in the API routes; RLS stays enabled on the table so the anon key
 * has no access at all.
 */
export function supabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars"
      );
    }
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export const GAME_IMAGES_BUCKET = "game-images";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToGame(row: any) {
  return {
    id: row.id as string,
    title: row.title as string,
    imageUrl: (row.image_url ?? null) as string | null,
    timePlayed: Number(row.time_played ?? 0),
    status: row.status,
    rating: row.rating ?? null,
    platform: row.platform,
    customPlatformName: (row.custom_platform_name ?? null) as string | null,
    createdAt: row.created_at as string,
  };
}
