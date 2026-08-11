import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PlayLog | Track every game you play",
    short_name: "PlayLog",
    description:
      "Personal game tracker: log hours, rate games S to E, and manage your backlog across every platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#191313",
    theme_color: "#d92c2c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
