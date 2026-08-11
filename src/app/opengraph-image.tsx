import { ImageResponse } from "next/og";
import { OG_SIZE, OgImageElement } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "PlayLog | Track every game you play";

export default function Image() {
  return new ImageResponse(<OgImageElement />, size);
}
