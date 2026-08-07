import type { Metadata } from "next";
import { Anton, Barlow } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PlayLog | Track every game you play",
    template: "%s | PlayLog",
  },
  description:
    "PlayLog is your personal game tracker. Log hours, rate games S to E, and keep your backlog honest across Steam, Epic, PlayStation, Xbox, GOG, Ubisoft and more.",
  keywords: [
    "game tracker",
    "video game backlog",
    "game log",
    "track playtime",
    "game rating",
  ],
  openGraph: {
    title: "PlayLog | Track every game you play",
    description:
      "Log hours, rate games S to E, and keep your backlog honest across every platform you play on.",
    url: siteUrl,
    siteName: "PlayLog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayLog | Track every game you play",
    description:
      "Log hours, rate games S to E, and keep your backlog honest across every platform you play on.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${barlow.variable}`}>
      <body className="bg-ink text-fg font-body antialiased">{children}</body>
    </html>
  );
}
