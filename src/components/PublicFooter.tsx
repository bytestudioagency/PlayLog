import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="mx-auto flex max-w-7xl justify-end gap-6 border-t border-line px-5 py-10 text-sm text-mut">
      <Link href="/privacy" className="transition-colors hover:text-fg">Privacy</Link>
      <Link href="/terms" className="transition-colors hover:text-fg">Terms</Link>
      <Link href="/contact" className="transition-colors hover:text-fg">Contact</Link>
    </footer>
  );
}
