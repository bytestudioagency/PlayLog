export const STATUSES = ["playing", "completed", "dropped", "backlog"] as const;
export type GameStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<GameStatus, string> = {
  playing: "Playing",
  completed: "Completed",
  dropped: "Dropped",
  backlog: "To be played",
};

export const RATINGS = ["S", "A", "B", "C", "D", "E"] as const;
export type Rating = (typeof RATINGS)[number];

export const PLATFORMS = [
  "steam",
  "epic",
  "gog",
  "ubisoft",
  "playstation",
  "xbox",
  "other",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  steam: "Steam",
  epic: "Epic",
  gog: "GOG",
  ubisoft: "Ubisoft",
  playstation: "PlayStation",
  xbox: "Xbox",
  other: "Other",
};

export interface Game {
  id: string;
  title: string;
  imageUrl: string | null;
  timePlayed: number;
  status: GameStatus;
  rating: Rating | null;
  platform: Platform;
  customPlatformName: string | null;
  createdAt: string;
}

export interface GameInput {
  title: string;
  imageUrl: string | null;
  timePlayed: number;
  status: GameStatus;
  rating: Rating | null;
  platform: Platform;
  customPlatformName: string | null;
}

export function platformName(game: Pick<Game, "platform" | "customPlatformName">): string {
  return game.platform === "other" && game.customPlatformName
    ? game.customPlatformName
    : PLATFORM_LABELS[game.platform];
}
