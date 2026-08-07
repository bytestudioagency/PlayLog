import type { LibraryStats } from "@/lib/games";
import { PLATFORM_LABELS, RATINGS, STATUS_LABELS, STATUSES } from "@/lib/types";
import { RATING_BADGE, STATUS_TEXT } from "./GameCard";

function Bar({ fraction, className = "bg-red" }: { fraction: number; className?: string }) {
  return (
    <div className="h-1.5 w-full bg-raised">
      <div
        className={`h-full ${className}`}
        style={{ width: `${Math.max(0, Math.min(1, fraction)) * 100}%` }}
      />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line bg-panel p-5">
      <h3 className="font-display text-sm uppercase tracking-wide text-mut">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border border-line bg-panel p-5">
      <h3 className="font-display text-sm uppercase tracking-wide text-mut">{label}</h3>
      <p className="mt-3 truncate font-display text-3xl leading-none" title={value}>
        {value}
      </p>
      <p className="mt-1.5 text-xs text-faint">{sub}</p>
    </div>
  );
}

export function StatsPanel({ stats }: { stats: LibraryStats }) {
  const maxPlatformHours = Math.max(1, ...stats.hoursByPlatform.map((p) => p.hours));
  const maxRatingCount = Math.max(1, ...RATINGS.map((r) => stats.ratingCounts[r]));
  const maxMonthCount = Math.max(1, ...stats.gamesByMonth.map((m) => m.count));
  const hasMonthData = stats.gamesByMonth.some((m) => m.count > 0);

  return (
    <div className="fade-up mt-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Tile
          label="Most played"
          value={stats.mostPlayedGame ? stats.mostPlayedGame.title : "—"}
          sub={stats.mostPlayedGame ? `${stats.mostPlayedGame.hours} hrs logged` : "No hours logged yet"}
        />
        <Tile
          label="Avg hours / game"
          value={String(stats.averageHours)}
          sub={`across ${stats.totalGames} ${stats.totalGames === 1 ? "game" : "games"}`}
        />
        <Tile
          label="Drop rate"
          value={`${stats.dropRate}%`}
          sub={`of ${stats.completedCount + stats.statusCounts.dropped} decided games`}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Completion">
          <p className="font-display text-5xl leading-none">
            {stats.completionRate}
            <span className="text-2xl text-faint">%</span>
          </p>
          <div className="mt-3">
            <Bar fraction={stats.completionRate / 100} className="bg-green" />
          </div>
          <p className="mt-2 text-xs text-faint" style={{ fontVariantNumeric: "tabular-nums" }}>
            {stats.completedCount} of {stats.totalGames} completed
          </p>
          <ul className="mt-4 space-y-1.5">
            {STATUSES.map((s) => (
              <li key={s} className="flex items-center justify-between gap-2 text-xs">
                <span className={`font-semibold uppercase tracking-wide ${STATUS_TEXT[s]}`}>
                  {STATUS_LABELS[s]}
                </span>
                <span className="text-faint" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {stats.statusCounts[s]}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Hours by platform">
          {stats.hoursByPlatform.length === 0 ? (
            <p className="text-sm text-faint">No hours logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.hoursByPlatform.map(({ platform, hours }) => (
                <li key={platform}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-semibold text-fg">{PLATFORM_LABELS[platform]}</span>
                    <span className="text-faint" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {hours} hrs
                    </span>
                  </div>
                  <Bar fraction={hours / maxPlatformHours} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Rating spread">
          {stats.ratedCount === 0 ? (
            <p className="text-sm text-faint">No ratings yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {RATINGS.map((r) => {
                const count = stats.ratingCounts[r];
                return (
                  <li key={r} className="flex items-center gap-3">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center font-display text-sm ${RATING_BADGE[r]}`}
                    >
                      {r}
                    </span>
                    <Bar fraction={count / maxRatingCount} />
                    <span
                      className="w-5 shrink-0 text-right text-xs text-faint"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Games logged, last 6 months">
          {!hasMonthData ? (
            <p className="text-sm text-faint">Nothing logged in the last 6 months.</p>
          ) : (
            <div className="flex h-28 items-end justify-between gap-3">
              {stats.gamesByMonth.map((m) => (
                <div key={m.month} className="flex h-full flex-1 flex-col items-center gap-1.5">
                  <span
                    className="text-xs text-faint"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {m.count}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full bg-red"
                      style={{
                        height: m.count > 0 ? `${Math.max(6, (m.count / maxMonthCount) * 100)}%` : 0,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
