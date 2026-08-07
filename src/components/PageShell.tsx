import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "./Logo";

export async function PageShell({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <div className="min-h-svh">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Logo />
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-mut transition-colors hover:text-fg"
            >
              Home
            </Link>
            <Link
              href={signedIn ? "/dashboard" : "/login"}
              className="border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-red hover:text-red-hot"
            >
              {signedIn ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-16">
        <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)] uppercase leading-none">
          {title} <span className="text-red-hot">{accent}</span>
        </h1>
        <div className="prose-playlog mt-10 max-w-[68ch] space-y-5 leading-[1.7] text-mut [&_h2]:pt-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:text-fg [&_strong]:text-fg">
          {children}
        </div>
      </main>
      <footer className="mx-auto flex max-w-7xl justify-end gap-6 border-t border-line px-5 py-10 text-sm text-mut">
        <Link href="/privacy" className="transition-colors hover:text-fg">Privacy</Link>
        <Link href="/terms" className="transition-colors hover:text-fg">Terms</Link>
        <Link href="/contact" className="transition-colors hover:text-fg">Contact</Link>
      </footer>
    </div>
  );
}
