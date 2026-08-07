import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-5">
      <div
        aria-hidden
        className="absolute -left-32 top-0 h-full w-96 bg-red-deep opacity-60"
        style={{ clipPath: "polygon(0 0, 100% 0, 40% 100%, 0 100%)" }}
      />
      <div
        aria-hidden
        className="stripes absolute -right-24 bottom-0 h-64 w-96 opacity-30 -rotate-12"
      />

      <div className="relative w-full max-w-sm border border-line bg-panel p-10">
        <Logo />
        <h1 className="mt-8 font-display text-4xl uppercase leading-none">
          Press <span className="text-red-hot">start</span>
        </h1>
        <p className="mt-3 leading-[1.65] text-mut">
          Sign in with your Google account to open your library. Your log is
          private and only visible to you.
        </p>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full bg-red px-6 py-3.5 font-display text-lg uppercase tracking-wide transition-colors hover:bg-red-hot cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
          >
            Sign in with Google
          </button>
        </form>
        <p className="mt-6 text-xs leading-relaxed text-faint">
          By signing in you agree to the{" "}
          <a href="/terms" className="underline hover:text-mut">Terms</a> and{" "}
          <a href="/privacy" className="underline hover:text-mut">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}
