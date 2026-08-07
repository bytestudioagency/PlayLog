import Image from "next/image";
import { GamepadIcon } from "./Logo";

/** Static CSS mock of the dashboard used on the landing page preview. */

const mockGames = [
  { title: "Elden Ring", platform: "PlayStation", hours: 142, rating: "S", img: "/eldenring.png" },
  { title: "RDR 2", platform: "Steam", hours: 118, rating: "A", img: "/rdr2.jpg" },
  { title: "Jedi: Fallen Order", platform: "Epic", hours: 34, rating: "B", img: "/star-wars-jedi-fallen-order.jpg" },
  { title: "Alan Wake", platform: "GOG", hours: 20, rating: "A", img: "/alanwake.jpg" },
];

const ratingColor: Record<string, string> = {
  S: "bg-gold text-ink",
  A: "bg-red",
  B: "bg-tier-b text-ink",
  C: "bg-raised text-mut",
};

const mockLabel = "text-[10px] font-semibold uppercase tracking-wider text-faint";
const mockChip = "px-2 py-0.5 text-[10px] font-semibold";
const chipClip = { clipPath: "polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" };

export function DashboardMock() {
  return (
    <div
      aria-hidden
      className="relative select-none overflow-hidden border border-line bg-ink shadow-drawer"
    >
      {/* topbar */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2">
          <span
            className="grid h-6 w-6 place-items-center bg-red"
            style={{ clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)" }}
          >
            <GamepadIcon className="h-3.5 w-3.5 -translate-x-px" />
          </span>
          <span className="font-display text-sm uppercase tracking-wide">
            Play<span className="text-red-hot">Log</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-faint">314 hrs logged</span>
          <span className="h-6 w-6 rounded-full bg-raised" />
        </div>
      </div>

      {/* filter row */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        {["All", "Playing", "Completed", "Dropped", "To be played"].map((f, i) => (
          <span
            key={f}
            className={`px-3 py-1 text-xs font-semibold ${
              i === 0 ? "bg-red" : "bg-raised text-mut"
            }`}
            style={chipClip}
          >
            {f}
          </span>
        ))}
        <span className="ml-auto hidden px-3 py-1 text-xs text-faint sm:block">
          Sort: Time played ▾
        </span>
      </div>

      {/* game grid */}
      <div className="grid grid-cols-2 gap-4 px-5 pb-6 sm:grid-cols-4">
        {mockGames.map((g) => (
          <div key={g.title} className="bg-panel">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={g.img}
                alt={`${g.title} cover`}
                fill
                sizes="(max-width: 640px) 50vw, 300px"
                className="object-cover"
              />
              <span
                className={`absolute right-2 top-2 grid h-8 w-8 place-items-center font-display text-lg ${ratingColor[g.rating]}`}
              >
                {g.rating}
              </span>
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-semibold">{g.title}</p>
              <p className="mt-1 text-xs text-faint">
                {g.platform} · {g.hours} hrs
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* edit drawer, mirroring the real one */}
      <div className="absolute inset-y-0 right-0 hidden w-72 flex-col border-l border-line bg-panel shadow-drawer lg:flex">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="font-display text-xl uppercase leading-none">
            Edit <span className="text-red-hot">game</span>
          </p>
          <span className="grid h-7 w-7 place-items-center border border-line text-xs text-mut">
            ✕
          </span>
        </div>

        <div className="flex-1 space-y-2.5 overflow-hidden px-4 py-3">
          {/* cover */}
          <div className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-ink">
              <Image
                src="/alanwake.jpg"
                alt="Alan Wake cover"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <span className={mockLabel}>Cover image</span>
              <div className="flex gap-1">
                <span className="bg-red px-2 py-0.5 text-[10px] font-semibold" style={chipClip}>
                  Upload
                </span>
                <span className="bg-raised px-2 py-0.5 text-[10px] font-semibold text-mut" style={chipClip}>
                  Paste link
                </span>
              </div>
              <span className="border border-line px-2.5 py-1 text-center text-[11px] font-semibold text-mut">
                Replace image
              </span>
            </div>
          </div>

          {/* title */}
          <div>
            <span className={mockLabel}>Title</span>
            <div className="mt-1 border border-red bg-ink px-2.5 py-1 text-xs">
              Alan Wake
            </div>
          </div>

          {/* time played */}
          <div>
            <span className={mockLabel}>Time played</span>
            <div className="mt-1 flex items-center justify-between border border-line bg-ink px-2.5 py-1 text-xs">
              <span>20</span>
              <span className="text-[9px] font-semibold uppercase text-faint">hrs</span>
            </div>
          </div>

          {/* status */}
          <div>
            <span className={mockLabel}>Status</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {["Playing", "Completed", "Dropped", "To be played"].map((s) => (
                <span
                  key={s}
                  className={`${mockChip} ${
                    s === "Completed" ? "bg-red" : "bg-raised text-mut"
                  }`}
                  style={chipClip}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* rating */}
          <div>
            <span className={mockLabel}>Rating</span>
            <div className="mt-1 flex gap-1.5">
              {["S", "A", "B", "C", "D", "E"].map((r) => (
                <span
                  key={r}
                  className={`grid h-6 w-6 place-items-center font-display text-sm ${
                    r === "A" ? "bg-red" : "bg-raised text-mut"
                  }`}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* platform */}
          <div>
            <span className={mockLabel}>Platform</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {["Steam", "Epic", "GOG", "Ubisoft", "PlayStation", "Xbox", "Other"].map((p) => (
                <span
                  key={p}
                  className={`${mockChip} ${
                    p === "GOG" ? "bg-red" : "bg-raised text-mut"
                  }`}
                  style={chipClip}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-line px-4 py-3">
          <span
            className="flex-1 bg-red py-1.5 text-center font-display text-sm uppercase tracking-wide"
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}
          >
            Save changes
          </span>
          <span className="border border-line px-2.5 py-1.5 text-[11px] font-semibold text-mut">
            Delete
          </span>
        </div>
      </div>
    </div>
  );
}
