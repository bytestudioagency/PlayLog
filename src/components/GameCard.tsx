"use client";

import { useState } from "react";
import { Game, platformName, STATUS_LABELS } from "@/lib/types";

export const RATING_BADGE: Record<string, string> = {
  S: "bg-gold text-ink",
  A: "bg-red text-fg",
  B: "bg-tier-b text-ink",
  C: "bg-tier-c text-ink",
  D: "bg-tier-d text-ink",
  E: "bg-tier-e text-fg",
};

export const STATUS_TEXT: Record<Game["status"], string> = {
  playing: "text-red-hot",
  completed: "text-green",
  dropped: "text-tier-e",
  backlog: "text-faint",
};

/** Deterministic hue from the title so placeholder covers vary but stay stable. */
export function titleHue(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % 360;
  return h;
}

export function GameCard({ game, onEdit }: { game: Game; onEdit: () => void }) {
  const hue = titleHue(game.title);
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(game.imageUrl) && !imgError;

  return (
    <button
      onClick={onEdit}
      className="group block w-full text-left"
      aria-label={`Edit ${game.title}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-panel">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.imageUrl!}
            alt={`${game.title} cover`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="flex h-full items-end p-4"
            style={{
              background: `linear-gradient(160deg, oklch(32% 0.08 ${hue}), oklch(17% 0.04 ${hue}))`,
            }}
          >
            <span className="font-display text-6xl uppercase leading-none opacity-25">
              {game.title.slice(0, 2)}
            </span>
          </div>
        )}
        {game.rating && (
          <span
            className={`absolute right-2 top-2 grid h-9 w-9 place-items-center font-display text-xl ${RATING_BADGE[game.rating]}`}
            aria-label={`Rated ${game.rating}`}
          >
            {game.rating}
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 border-2 border-red opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="pt-2.5">
        <h3 className="truncate font-semibold leading-snug">{game.title}</h3>
        <p className="mt-1 flex items-baseline justify-between gap-2 text-xs">
          <span className="truncate text-faint">
            {platformName(game)} · {game.timePlayed} hrs
          </span>
          <span className={`shrink-0 font-semibold uppercase tracking-wide ${STATUS_TEXT[game.status]}`}>
            {STATUS_LABELS[game.status]}
          </span>
        </p>
      </div>
    </button>
  );
}
