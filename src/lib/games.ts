import { supabaseAdmin, rowToGame } from "@/lib/supabase";
import { Game, GameStatus, Platform, PLATFORMS, Rating, RATINGS, STATUSES } from "@/lib/types";

export const GAMES_PAGE_SIZE = 20;

export type SortKey = "recent" | "hours" | "rating" | "title";

export interface GamesQuery {
  status?: string | null;
  platform?: string | null;
  q?: string | null;
  sort?: SortKey | null;
  page?: number | null;
}

export interface GamesPage {
  games: Game[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchGamesPage(
  userId: string,
  params: GamesQuery
): Promise<GamesPage> {
  const pageSize = GAMES_PAGE_SIZE;
  const page = params.page && params.page >= 1 ? Math.floor(params.page) : 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin()
    .from("games")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (params.status && STATUSES.includes(params.status as GameStatus)) {
    query = query.eq("status", params.status);
  }
  if (params.platform && PLATFORMS.includes(params.platform as Platform)) {
    query = query.eq("platform", params.platform);
  }
  const q = params.q?.trim();
  if (q) {
    // escape ILIKE wildcards so a literal % or _ in the search doesn't act as one
    const escaped = q.replace(/[%_]/g, (c) => `\\${c}`);
    query = query.ilike("title", `%${escaped}%`);
  }

  switch (params.sort) {
    case "hours":
      query = query.order("time_played", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "rating":
      query = query.order("rating_rank", { ascending: true }).order("created_at", { ascending: false });
      break;
    case "title":
      query = query.order("title", { ascending: true }).order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw new Error(error.message);

  return {
    games: (data ?? []).map(rowToGame) as Game[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export interface LibraryStats {
  totalGames: number;
  totalHours: number;
  completedCount: number;
  completionRate: number; // 0-100, rounded, share of the library marked completed
  statusCounts: Record<GameStatus, number>;
  hoursByPlatform: { platform: Platform; hours: number }[]; // sorted desc, zero-hour platforms omitted
  ratingCounts: Record<Rating, number>;
  ratedCount: number;
  averageHours: number; // rounded to 1 decimal, 0 when the library is empty
  dropRate: number; // 0-100, rounded, dropped / (completed + dropped); 0 when neither exists
  mostPlayedGame: { title: string; hours: number } | null; // null when the library is empty or nothing has logged hours
  gamesByMonth: { month: string; label: string; count: number }[]; // last 6 calendar months, oldest first, zero-filled
}

export async function fetchLibraryStats(userId: string): Promise<LibraryStats> {
  const { data, error } = await supabaseAdmin()
    .from("games")
    .select("title, time_played, status, platform, rating, created_at")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as {
    title: string;
    time_played: number;
    status: GameStatus;
    platform: Platform;
    rating: Rating | null;
    created_at: string;
  }[];

  const statusCounts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<GameStatus, number>;
  const hoursByPlatformMap = Object.fromEntries(PLATFORMS.map((p) => [p, 0])) as Record<Platform, number>;
  const ratingCounts = Object.fromEntries(RATINGS.map((r) => [r, 0])) as Record<Rating, number>;

  let totalHours = 0;
  let mostPlayedGame: { title: string; hours: number } | null = null;
  for (const row of rows) {
    const hours = Number(row.time_played ?? 0);
    totalHours += hours;
    statusCounts[row.status]++;
    hoursByPlatformMap[row.platform] += hours;
    if (row.rating) ratingCounts[row.rating]++;
    if (hours > 0 && (mostPlayedGame === null || hours > mostPlayedGame.hours)) {
      mostPlayedGame = { title: row.title, hours: Math.round(hours) };
    }
  }

  const hoursByPlatform = PLATFORMS.map((platform) => ({
    platform,
    hours: Math.round(hoursByPlatformMap[platform]),
  }))
    .filter((p) => p.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const totalGames = rows.length;
  const completedCount = statusCounts.completed;
  const ratedCount = RATINGS.reduce((sum, r) => sum + ratingCounts[r], 0);
  const droppedCount = statusCounts.dropped;
  const decidedCount = completedCount + droppedCount;

  const now = new Date();
  const monthBuckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      count: 0,
    };
  });
  const monthIndex = new Map(monthBuckets.map((b, i) => [b.key, i]));
  for (const row of rows) {
    if (!row.created_at) continue;
    const d = new Date(row.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const idx = monthIndex.get(key);
    if (idx !== undefined) monthBuckets[idx].count++;
  }
  const gamesByMonth = monthBuckets.map(({ key, label, count }) => ({ month: key, label, count }));

  return {
    averageHours: totalGames ? Math.round((totalHours / totalGames) * 10) / 10 : 0,
    dropRate: decidedCount ? Math.round((droppedCount / decidedCount) * 100) : 0,
    mostPlayedGame,
    gamesByMonth,
    totalGames,
    totalHours: Math.round(totalHours),
    completedCount,
    completionRate: totalGames ? Math.round((completedCount / totalGames) * 100) : 0,
    statusCounts,
    hoursByPlatform,
    ratingCounts,
    ratedCount,
  };
}
