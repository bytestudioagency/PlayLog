import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "./Logo";

export async function PublicHeader() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Logo />
        <Link
          href={signedIn ? "/dashboard" : "/login"}
          className="border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-red hover:text-red-hot"
        >
          {signedIn ? "Dashboard" : "Sign in"}
        </Link>
      </div>
    </header>
  );
}
