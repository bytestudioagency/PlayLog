import { GameInput, PLATFORMS, RATINGS, STATUSES } from "./types";

export function parseGameInput(body: unknown): GameInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title || title.length > 200) return null;

  const timePlayed = Number(b.timePlayed);
  if (!Number.isFinite(timePlayed) || timePlayed < 0 || timePlayed > 100000) {
    return null;
  }

  const status = b.status;
  if (!STATUSES.includes(status as never)) return null;

  const rating = b.rating ?? null;
  if (rating !== null && !RATINGS.includes(rating as never)) return null;

  const platform = b.platform;
  if (!PLATFORMS.includes(platform as never)) return null;

  let customPlatformName =
    typeof b.customPlatformName === "string" ? b.customPlatformName.trim() : null;
  if (platform !== "other") customPlatformName = null;
  if (customPlatformName && customPlatformName.length > 100) return null;

  const imageUrlRaw = typeof b.imageUrl === "string" ? b.imageUrl.trim() : "";
  let imageUrl: string | null = null;
  if (imageUrlRaw) {
    if (imageUrlRaw.length > 2000) return null;
    try {
      const parsed = new URL(imageUrlRaw);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    } catch {
      return null;
    }
    imageUrl = imageUrlRaw;
  }

  return {
    title,
    imageUrl,
    timePlayed: Math.round(timePlayed * 10) / 10,
    status: status as GameInput["status"],
    rating: (rating as GameInput["rating"]) ?? null,
    platform: platform as GameInput["platform"],
    customPlatformName: customPlatformName || null,
  };
}

export function gameInputToRow(input: GameInput) {
  return {
    title: input.title,
    image_url: input.imageUrl,
    time_played: input.timePlayed,
    status: input.status,
    rating: input.rating,
    platform: input.platform,
    custom_platform_name: input.customPlatformName,
  };
}
