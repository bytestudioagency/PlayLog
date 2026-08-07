"use client";

import { useEffect, useRef, useState } from "react";
import {
  Game,
  GameStatus,
  Platform,
  PLATFORM_LABELS,
  PLATFORMS,
  Rating,
  RATINGS,
  STATUS_LABELS,
  STATUSES,
} from "@/lib/types";
import { RATING_BADGE } from "./GameCard";

const inputCls =
  "w-full border border-line bg-ink px-3 py-2.5 text-sm text-fg placeholder:text-faint focus:border-red focus:outline-none";
const labelCls = "block text-xs font-semibold uppercase tracking-wider text-faint";

export function GameDrawer({
  game,
  onClose,
  onSaved,
  onDeleted,
}: {
  game: Game | null; // null = add mode
  onClose: () => void;
  onSaved: (game: Game, isNew: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const isEdit = game !== null;

  const [title, setTitle] = useState(game?.title ?? "");
  const [timePlayed, setTimePlayed] = useState(
    game ? String(game.timePlayed) : ""
  );
  const [status, setStatus] = useState<GameStatus>(game?.status ?? "playing");
  const [rating, setRating] = useState<Rating | null>(game?.rating ?? null);
  const [platform, setPlatform] = useState<Platform>(game?.platform ?? "steam");
  const [customPlatformName, setCustomPlatformName] = useState(
    game?.customPlatformName ?? ""
  );
  const [imageUrl, setImageUrl] = useState<string | null>(game?.imageUrl ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(game?.imageUrl ?? null);
  const [imgFailed, setImgFailed] = useState(false);
  const [coverMode, setCoverMode] = useState<"upload" | "url">("upload");

  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, [onClose]);

  function pickFile(file: File | null) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImgFailed(false);
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreview(url);
      setImageUrl(null);
    } else {
      setPreview(null);
    }
  }

  function handleUrlChange(value: string) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImgFailed(false);
    setImageFile(null);
    const trimmed = value.trim();
    setImageUrl(trimmed || null);
    setPreview(trimmed || null);
  }

  function switchMode(mode: "upload" | "url") {
    setCoverMode(mode);
    setImgFailed(false);
  }

  function clearImage() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImgFailed(false);
    setImageFile(null);
    setImageUrl(null);
    setPreview(null);
  }

  function isValidHttpUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Give the game a title.");
      titleRef.current?.focus();
      return;
    }
    const hours = timePlayed.trim() === "" ? 0 : Number(timePlayed);
    if (!Number.isFinite(hours) || hours < 0) {
      setError("Time played must be a positive number of hours.");
      return;
    }
    if (imageUrl && !imageFile && !isValidHttpUrl(imageUrl)) {
      setError("Enter a valid image URL, starting with http:// or https://.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error ?? "Image upload failed");
        finalImageUrl = body.url;
      }

      const payload = {
        title: title.trim(),
        imageUrl: finalImageUrl,
        timePlayed: hours,
        status,
        rating,
        platform,
        customPlatformName:
          platform === "other" ? customPlatformName.trim() || null : null,
      };

      const res = await fetch(isEdit ? `/api/games/${game.id}` : "/api/games", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Could not save the game");
      onSaved(body.game, !isEdit);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/games/${game.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not delete the game");
      }
      onDeleted(game.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={isEdit ? `Edit ${game.title}` : "Add game"}>
      {/* overlay */}
      <div
        className="absolute inset-0 bg-ink/70"
        onClick={onClose}
        aria-hidden
      />

      {/* panel */}
      <div className="drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-panel shadow-drawer">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-3xl uppercase leading-none">
            {isEdit ? (
              <>Edit <span className="text-red-hot">game</span></>
            ) : (
              <>Add <span className="text-red-hot">game</span></>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center border border-line text-mut transition-colors hover:border-red hover:text-red-hot"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* cover */}
          <div className="flex gap-4">
            <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-ink">
              {preview && !imgFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div className="stripes-hot grid h-full place-items-center">
                  <span className="font-display text-2xl text-faint">?</span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2">
              <span className={labelCls}>Cover image</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => switchMode("upload")}
                  aria-pressed={coverMode === "upload"}
                  className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                    coverMode === "upload" ? "bg-red text-fg" : "bg-raised text-mut hover:text-fg"
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("url")}
                  aria-pressed={coverMode === "url"}
                  className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                    coverMode === "url" ? "bg-red text-fg" : "bg-raised text-mut hover:text-fg"
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}
                >
                  Paste link
                </button>
              </div>
              {coverMode === "upload" ? (
                <label className="cursor-pointer border border-line px-3 py-1.5 text-center text-sm font-semibold text-mut transition-colors hover:border-red hover:text-red-hot">
                  {preview ? "Replace image" : "Choose file"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="sr-only"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              ) : (
                <input
                  type="url"
                  value={imageUrl ?? ""}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://images.example.com/cover.jpg"
                  maxLength={2000}
                  className={inputCls}
                />
              )}
              {preview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-left text-xs text-faint underline underline-offset-2 hover:text-mut"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>

          {/* title */}
          <div>
            <label htmlFor="game-title" className={labelCls}>
              Title
            </label>
            <input
              id="game-title"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hades II"
              maxLength={200}
              className={`${inputCls} mt-1.5`}
            />
          </div>

          {/* time played */}
          <div>
            <label htmlFor="game-hours" className={labelCls}>
              Time played
            </label>
            <div className="relative mt-1.5">
              <input
                id="game-hours"
                type="number"
                min={0}
                step={0.5}
                inputMode="decimal"
                value={timePlayed}
                onChange={(e) => setTimePlayed(e.target.value)}
                placeholder="0"
                className={`${inputCls} pr-12`}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-xs font-semibold uppercase text-faint">
                hrs
              </span>
            </div>
          </div>

          {/* status */}
          <fieldset>
            <legend className={labelCls}>Status</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  aria-pressed={status === s}
                  className={`px-3.5 py-2 text-sm font-semibold transition-colors ${
                    status === s ? "bg-red text-fg" : "bg-raised text-mut hover:text-fg"
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </fieldset>

          {/* rating */}
          <fieldset>
            <legend className={labelCls}>Rating</legend>
            <div className="mt-1.5 flex gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(rating === r ? null : r)}
                  aria-pressed={rating === r}
                  title={rating === r ? "Click to clear rating" : `Rate ${r}`}
                  className={`grid h-10 w-10 place-items-center font-display text-lg transition-all ${
                    rating === r
                      ? `${RATING_BADGE[r]} scale-110`
                      : "bg-raised text-mut hover:text-fg"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-faint">
              {rating ? "Tap the same grade again to clear it." : "Optional. S is god-tier, E is a war crime."}
            </p>
          </fieldset>

          {/* platform */}
          <fieldset>
            <legend className={labelCls}>Platform</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  aria-pressed={platform === p}
                  className={`px-3.5 py-2 text-sm font-semibold transition-colors ${
                    platform === p ? "bg-red text-fg" : "bg-raised text-mut hover:text-fg"
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
            {platform === "other" && (
              <input
                type="text"
                value={customPlatformName}
                onChange={(e) => setCustomPlatformName(e.target.value)}
                placeholder="Platform name, e.g. Switch, Game Boy, Arcade"
                maxLength={100}
                className={`${inputCls} mt-2.5`}
              />
            )}
          </fieldset>

          {error && (
            <p className="border border-red-deep bg-ink px-3 py-2.5 text-sm text-red-hot" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* footer actions */}
        <div className="border-t border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-red px-6 py-3 font-display text-lg uppercase tracking-wide transition-colors hover:bg-red-hot disabled:cursor-wait disabled:opacity-60"
              style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add to library"}
            </button>
            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className={`px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${
                  confirmDelete
                    ? "bg-red-deep text-fg"
                    : "border border-line text-mut hover:border-red hover:text-red-hot"
                }`}
              >
                {confirmDelete ? "Confirm delete?" : "Delete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
