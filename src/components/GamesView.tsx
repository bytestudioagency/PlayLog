"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Game,
  GameStatus,
  Platform,
  PLATFORM_LABELS,
  PLATFORMS,
  STATUS_LABELS,
  STATUSES,
} from "@/lib/types";
import Link from "next/link";
import type { LibraryStats } from "@/lib/games";
import { GameCard } from "./GameCard";
import { GameDrawer } from "./GameDrawer";

type SortKey = "recent" | "hours" | "rating" | "title";
type DrawerState = { mode: "add" } | { mode: "edit"; game: Game } | null;

const SORT_LABELS: Record<SortKey, string> = {
  recent: "Recently added",
  hours: "Time played",
  rating: "Rating",
  title: "Title",
};

const PAGE_SIZE = 20;

const TOOLBAR_ICON_BTN =
  "flex h-10 w-10 items-center justify-center text-mut transition-[color,background-color,transform] duration-150 ease-out hover:bg-raised hover:text-red-hot active:scale-[0.97] focus-visible:bg-raised focus-visible:text-red-hot focus-visible:outline-none";

function StatsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <line x1="5" y1="20" x2="5" y2="11" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="19" y1="20" x2="19" y2="14" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function GamesView({
  initialGames,
  initialTotal,
  initialStats,
  loadError,
  userId,
  siteUrl,
}: {
  initialGames: Game[];
  initialTotal: number;
  initialStats: LibraryStats;
  loadError: string | null;
  userId: string;
  siteUrl: string;
}) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [total, setTotal] = useState(initialTotal);
  const [stats, setStats] = useState<LibraryStats>(initialStats);
  const [statusFilter, setStatusFilter] = useState<GameStatus | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<DrawerState>(null);

  const isFirstRun = useRef(true);
  const requestIdRef = useRef(0);

  // debounce the search box; page reset lands together with the query update
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadPage = useCallback(
    async (targetPage: number) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setFetchError(null);
      try {
        const params = new URLSearchParams({ sort: sortBy, page: String(targetPage) });
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (platformFilter !== "all") params.set("platform", platformFilter);
        if (debouncedQuery) params.set("q", debouncedQuery);

        const res = await fetch(`/api/games?${params.toString()}`);
        const body = await res.json().catch(() => ({}));
        if (requestIdRef.current !== requestId) return; // superseded by a newer request
        if (!res.ok) throw new Error(body.error ?? "Could not load your library");
        setGames(body.games);
        setTotal(body.total);
      } catch (e) {
        if (requestIdRef.current === requestId) {
          setFetchError(e instanceof Error ? e.message : "Could not load your library");
        }
      } finally {
        if (requestIdRef.current === requestId) setLoading(false);
      }
    },
    [statusFilter, platformFilter, debouncedQuery, sortBy]
  );

  async function refreshStats() {
    try {
      const res = await fetch("/api/games/stats");
      if (!res.ok) return;
      setStats(await res.json());
    } catch {
      // stats are supplementary; ignore failures
    }
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    loadPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, platformFilter, debouncedQuery, sortBy, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtersActive =
    statusFilter !== "all" || platformFilter !== "all" || debouncedQuery !== "";

  function selectStatus(s: GameStatus | "all") {
    setStatusFilter(s);
    setPage(1);
  }
  function selectPlatform(p: Platform | "all") {
    setPlatformFilter(p);
    setPage(1);
  }
  function selectSort(k: SortKey) {
    setSortBy(k);
    setPage(1);
  }
  function clearFilters() {
    setStatusFilter("all");
    setPlatformFilter("all");
    setSearchInput("");
    setPage(1);
  }

  function handleSaved(_game: Game, _isNew: boolean) {
    setDrawer(null);
    loadPage(page);
    refreshStats();
  }

  function handleDeleted(_id: string) {
    setDrawer(null);
    const newTotal = Math.max(0, total - 1);
    const lastPossiblePage = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
    const nextPage = Math.min(page, lastPossiblePage);
    if (nextPage !== page) {
      setPage(nextPage);
    } else {
      loadPage(page);
    }
    refreshStats();
  }

  return (
    <>
      {/* title row */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-5xl uppercase leading-none sm:text-6xl">
            My <span className="text-red-hot">library</span>
          </h1>
          {stats.totalGames > 0 && (
            <p className="mt-3 text-sm text-mut" style={{ fontVariantNumeric: "tabular-nums" }}>
              <span className="font-semibold text-fg">{stats.totalGames}</span>{" "}
              {stats.totalGames === 1 ? "game" : "games"}
              {" · "}
              <span className="font-semibold text-fg">{stats.totalHours}</span> hrs logged
              {" · "}
              <span className="font-semibold text-fg">{stats.completedCount}</span> completed
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center divide-x divide-line border border-line">
            {stats.totalGames > 0 && (
              <Link
                href="/dashboard/stats"
                title="Stats"
                aria-label="Stats"
                className={TOOLBAR_ICON_BTN}
              >
                <StatsIcon />
              </Link>
            )}
            <ShareMenu userId={userId} siteUrl={siteUrl} />
            <ExportMenu />
          </div>
          <button
            onClick={() => setDrawer({ mode: "add" })}
            className="bg-red px-6 py-3 font-display text-lg uppercase tracking-wide transition-[background-color,transform] duration-150 ease-out hover:bg-red-hot active:scale-[0.97]"
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
          >
            + Add game
          </button>
        </div>
      </div>

      {(loadError || fetchError) && (
        <div className="mt-8 border border-red-deep bg-panel px-4 py-3 text-sm">
          <span className="font-display uppercase text-red-hot">Load error·</span>{" "}
          <span className="text-mut">{loadError ?? fetchError}</span>
        </div>
      )}

      {/* toolbar */}
      {stats.totalGames > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4 border-y border-line py-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {(["all", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => selectStatus(s)}
                aria-pressed={statusFilter === s}
                className={`px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-red text-fg"
                    : "bg-raised text-mut hover:text-fg"
                }`}
                style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
              >
                {s === "all" ? "All" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search your library"
                aria-label="Search your library"
                className="w-56 border border-line bg-panel py-1.5 pl-8 pr-3 text-sm text-fg placeholder:text-faint focus:border-red focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-mut">
              Platform
              <select
                value={platformFilter}
                onChange={(e) => selectPlatform(e.target.value as Platform | "all")}
                className="border border-line bg-panel px-2.5 py-1.5 text-sm font-medium text-fg focus:border-red focus:outline-none"
              >
                <option value="all">All</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-mut">
              Sort
              <select
                value={sortBy}
                onChange={(e) => selectSort(e.target.value as SortKey)}
                className="border border-line bg-panel px-2.5 py-1.5 text-sm font-medium text-fg focus:border-red focus:outline-none"
              >
                {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {SORT_LABELS[k]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {/* grid / empty states */}
      {stats.totalGames === 0 ? (
        <div className="mt-20 max-w-xl">
          <p className="font-display text-6xl uppercase leading-[0.95] text-faint sm:text-7xl">
            Nothing
            <br />
            logged <span className="text-red">yet</span>
          </p>
          <p className="mt-6 leading-[1.65] text-mut">
            Add the game you&apos;re playing right now: title, hours, a rating
            if you&apos;ve made up your mind. Your library builds from there.
          </p>
          <button
            onClick={() => setDrawer({ mode: "add" })}
            className="mt-8 bg-red px-6 py-3 font-display text-lg uppercase tracking-wide transition-colors hover:bg-red-hot"
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
          >
            Log your first game
          </button>
        </div>
      ) : games.length === 0 && !loading ? (
        <div className="mt-20 max-w-xl">
          <p className="font-display text-4xl uppercase text-faint">No games match</p>
          <p className="mt-4 text-mut">
            Nothing in your library fits that search or those filters.
          </p>
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="mt-6 border border-line px-4 py-2 text-sm font-semibold text-mut transition-colors hover:border-red hover:text-red-hot"
            >
              Clear search &amp; filters
            </button>
          )}
        </div>
      ) : (
        <>
          <ul
            aria-busy={loading}
            className={`mt-8 grid list-none grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-5 gap-y-8 transition-opacity ${
              loading ? "opacity-50" : "opacity-100"
            }`}
          >
            {games.map((game, i) => (
              <li key={game.id} className="fade-up" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
                <GameCard game={game} onEdit={() => setDrawer({ mode: "edit", game })} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="border border-line px-4 py-2 text-sm font-semibold text-mut transition-colors hover:border-red hover:text-red-hot disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-mut"
              >
                ← Prev
              </button>
              <span className="text-sm text-faint" style={{ fontVariantNumeric: "tabular-nums" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="border border-line px-4 py-2 text-sm font-semibold text-mut transition-colors hover:border-red hover:text-red-hot disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-mut"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {drawer && (
        <GameDrawer
          game={drawer.mode === "edit" ? drawer.game : null}
          onClose={() => setDrawer(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}

type ShareKind = "backlog" | "tier";

function ShareMenu({ userId, siteUrl }: { userId: string; siteUrl: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<ShareKind | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function share(kind: ShareKind) {
    const url = `${siteUrl}/u/${userId}/${kind}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // clipboard unavailable; nothing to fall back to
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const rows: { kind: ShareKind; label: string; desc: string }[] = [
    { kind: "backlog", label: "Backlog page", desc: "Your “To be played” list." },
    { kind: "tier", label: "Tier page", desc: "Completed games, S–E tier list." },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Share"
        aria-label="Share"
        className={TOOLBAR_ICON_BTN}
      >
        <ShareIcon />
      </button>
      {open && (
        <div className="popover-in absolute right-0 top-full z-10 mt-1 w-72 space-y-4 border border-line bg-panel p-4">
          {rows.map((row) => (
            <div
              key={row.kind}
              className="flex items-center justify-between gap-3 border-t border-line pt-4 first:border-t-0 first:pt-0"
            >
              <div>
                <p className="text-sm font-semibold">{row.label}</p>
                <p className="text-xs text-faint">{row.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => share(row.kind)}
                className="shrink-0 border border-line px-2.5 py-1.5 text-xs font-semibold text-mut transition-colors hover:border-red hover:text-red-hot"
              >
                {copied === row.kind ? "Copied!" : "Copy link"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Download"
        aria-label="Download"
        className={TOOLBAR_ICON_BTN}
      >
        <DownloadIcon />
      </button>
      {open && (
        <div className="popover-in absolute right-0 top-full z-10 mt-1 w-36 border border-line bg-panel">
          <a
            href="/api/games/export?format=csv"
            download
            onClick={() => setOpen(false)}
            className="block px-3.5 py-2 text-sm font-semibold text-mut transition-colors hover:bg-raised hover:text-red-hot"
          >
            CSV
          </a>
          <a
            href="/api/games/export?format=json"
            download
            onClick={() => setOpen(false)}
            className="block px-3.5 py-2 text-sm font-semibold text-mut transition-colors hover:bg-raised hover:text-red-hot"
          >
            JSON
          </a>
        </div>
      )}
    </div>
  );
}
