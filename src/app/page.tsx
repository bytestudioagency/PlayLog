import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { DashboardMock } from "@/components/DashboardMock";

const features = [
  {
    n: "01",
    title: "Log your hours",
    body: "Every game gets a running clock. Add your time played in hours and watch your real gaming history build up, not the one your memory invented.",
  },
  {
    n: "02",
    title: "Grade S to E",
    body: "Forget 10-point scales with seven unused numbers. PlayLog uses arcade tier grades: S for the unforgettable, E for the regrettable.",
  },
  {
    n: "03",
    title: "Every platform",
    body: "Steam, Epic, PlayStation, Xbox, GOG, Ubisoft, plus a custom slot for everything else, from retro handhelds to that emulator you don't talk about.",
  },
  {
    n: "04",
    title: "Status that sticks",
    body: "Playing, Completed, Dropped, or To be played. Four honest states that keep your backlog visible instead of buried in a storefront library.",
  },
];

const marqueeItems = [
  "HOURS LOGGED",
  "S–E RATINGS",
  "BACKLOG CONTROL",
  "EVERY PLATFORM",
  "YOUR LIBRARY",
];

export default async function LandingPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <div className="overflow-x-clip">
      {/* ---- nav ---- */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Logo />
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-mut transition-colors hover:text-fg sm:block"
            >
              Features
            </a>
            <Link
              href={signedIn ? "/dashboard" : "/login"}
              className="border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-red hover:text-red-hot"
            >
              {signedIn ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* ---- hero ---- */}
        <section className="relative flex min-h-svh flex-col justify-center pt-16">
          {/* red diagonal slab */}
          <div
            aria-hidden
            className="absolute -right-40 top-0 hidden h-full w-[46rem] bg-red-deep lg:block"
            style={{ clipPath: "polygon(38% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div
            aria-hidden
            className="stripes absolute -right-40 top-0 hidden h-full w-[46rem] opacity-40 lg:block"
            style={{ clipPath: "polygon(30% 0, 39% 0, 1% 100%, -8% 100%)" }}
          />

          <div className="relative mx-auto w-full max-w-7xl px-5 py-24">
            <p className="fade-up mb-6 inline-block bg-red px-3 py-1 font-display text-sm tracking-[0.25em] uppercase">
              Your personal game tracker
            </p>
            <h1 className="fade-up font-display uppercase leading-[0.92] tracking-tight text-[clamp(3.6rem,11vw,9rem)]" style={{ animationDelay: "80ms" }}>
              Track every
              <br />
              <span className="text-red-hot">game</span> you{" "}
              <span className="text-outline">play</span>
            </h1>
            <p className="fade-up mt-8 max-w-[46ch] text-lg leading-[1.65] text-mut" style={{ animationDelay: "160ms" }}>
              Hours, ratings, platforms, backlog: one library for everything
              you&apos;ve played and everything you swear you&apos;ll get to.
            </p>
            <div className="fade-up mt-10 flex flex-wrap items-center gap-6" style={{ animationDelay: "240ms" }}>
              <Link
                href={signedIn ? "/dashboard" : "/login"}
                className="bg-red px-8 py-4 font-display text-xl uppercase tracking-wide transition-colors hover:bg-red-hot"
                style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)" }}
              >
                {signedIn ? "Go to dashboard" : "Sign in with Google"}
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-mut transition-colors hover:text-fg"
              >
                See what it tracks
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
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>

          {/* marquee band */}
          <div className="relative -mx-4 -rotate-2 border-y-2 border-red-deep bg-red py-3">
            <div className="marquee-track" aria-hidden>
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center">
                  {marqueeItems.map((item) => (
                    <span
                      key={`${copy}-${item}`}
                      className="px-6 font-display text-lg uppercase tracking-[0.2em] whitespace-nowrap"
                    >
                      {item} <span className="pl-6 text-red-deep">★</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- features ---- */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-28">
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-none">
            What it <span className="text-red-hot">tracks</span>
          </h2>
          <div className="mt-14">
            {features.map((f) => (
              <article
                key={f.n}
                className="group grid gap-4 border-t border-line py-10 last:border-b sm:grid-cols-[8rem_1fr] lg:grid-cols-[8rem_20rem_1fr] lg:gap-10"
              >
                <span
                  aria-hidden
                  className="font-display text-6xl leading-none text-faint transition-colors group-hover:text-red-hot"
                >
                  {f.n}
                </span>
                <h3 className="font-display text-3xl uppercase leading-tight">
                  {f.title}
                </h3>
                <p className="max-w-[52ch] leading-[1.65] text-mut">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---- about ---- */}
        <section id="about" className="mx-auto max-w-7xl px-5 pb-28">
          <div className="grid overflow-hidden lg:grid-cols-[2fr_3fr]">
            <div className="clip-slash-r relative bg-red p-10 sm:p-14">
              <div className="stripes-hot absolute inset-x-0 bottom-0 h-10" aria-hidden />
              <h2 className="font-display text-[clamp(2.6rem,5vw,4.2rem)] uppercase leading-[0.95]">
                Your shelf.
                <br />
                Your scores.
              </h2>
            </div>
            <div className="bg-panel p-10 sm:p-14">
              <p className="max-w-[60ch] text-lg leading-[1.7]">
                PlayLog is a trophy shelf for your whole gaming life. Sign in
                with Google and start logging. No setup, no friend feeds, no
                algorithm deciding what you should play next.
              </p>
              <p className="mt-6 max-w-[60ch] leading-[1.7] text-mut">
                Your library is private and tied to your account. Filter by
                status or platform, sort by hours, rating or title, and edit
                any entry from a single drawer. That&apos;s it: a tracker that
                stays out of the way of actually playing.
              </p>
            </div>
          </div>
        </section>

        {/* ---- share & export ---- */}
        <section className="mx-auto max-w-7xl px-5 pb-28">
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-none">
            Beyond <span className="text-red-hot">tracking</span>
          </h2>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="clip-slab relative overflow-hidden bg-panel p-10 sm:p-12">
              <div className="stripes-hot absolute inset-x-0 top-0 h-8" aria-hidden />
              <p className="font-display text-sm uppercase tracking-[0.25em] text-red-hot">
                Share pages
              </p>
              <h3 className="mt-3 font-display text-3xl uppercase leading-tight">
                Show off your shelf
              </h3>
              <p className="mt-4 max-w-[46ch] leading-[1.65] text-mut">
                Turn on a public backlog page or an S–E tier list of
                everything you&apos;ve completed. Both are off by default:
                flip one on from the dashboard and get a link, no account
                needed to view it.
              </p>
            </div>

            <div className="clip-slab relative overflow-hidden bg-red p-10 sm:p-12">
              <div className="stripes absolute inset-x-0 top-0 h-8 opacity-30" aria-hidden />
              <p className="font-display text-sm uppercase tracking-[0.25em]">
                Export anytime
              </p>
              <h3 className="mt-3 font-display text-3xl uppercase leading-tight">
                Own your data
              </h3>
              <p className="mt-4 max-w-[46ch] leading-[1.65]">
                Download your whole library as JSON or CSV whenever you want.
                No asking permission, no waiting on a support ticket. It&apos;s
                yours.
              </p>
            </div>
          </div>
        </section>

        {/* ---- preview ---- */}
        <section className="border-y border-line bg-panel py-28">
          <div className="mx-auto max-w-7xl px-5">
            <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-none">
              The <span className="text-red-hot">dashboard</span>
            </h2>
            <p className="mt-4 max-w-[52ch] leading-[1.65] text-mut">
              Big covers, tier grades and hour counts at a glance. Filter by
              status or platform, sort however you like.
            </p>
            <div className="mt-12">
              <DashboardMock />
            </div>
          </div>
        </section>
      </main>

      {/* ---- footer ---- */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-faint">
            Track every game you play.
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-mut">
          <Link href="/privacy" className="transition-colors hover:text-fg">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-fg">
            Terms
          </Link>
          <Link href="/contact" className="transition-colors hover:text-fg">
            Contact
          </Link>
        </nav>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PlayLog",
            applicationCategory: "GameApplication",
            description:
              "Personal game tracker: log hours, rate games S to E, and manage your backlog across every platform.",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
