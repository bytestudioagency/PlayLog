"use client";

import { useState } from "react";
import { Game, platformName } from "@/lib/types";
import { RATING_BADGE, titleHue } from "./GameCard";

export function PublicGameTile({
  game,
  showHours = true,
}: {
  game: Game;
  showHours?: boolean;
}) {
  const hue = titleHue(game.title);
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(game.imageUrl) && !imgError;

  return (
    <div className="w-full text-left">
      <div className="relative aspect-[3/4] overflow-hidden bg-panel">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.imageUrl!}
            alt={`${game.title} cover`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
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
      </div>
      <div className="pt-2.5">
        <h3 className="truncate font-semibold leading-snug">{game.title}</h3>
        <p className="mt-1 truncate text-xs text-faint">
          {platformName(game)}
          {showHours && ` · ${game.timePlayed} hrs`}
        </p>
      </div>
    </div>
  );
}
