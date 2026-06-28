import type { ImageMetadata } from "astro";

import apartmentGrapevineFlat from "../assets/images/apt-grapevine-flat.png";
import apartmentQuietCorner from "../assets/images/apt-quiet-corner.png";
import apartmentSharedLadder from "../assets/images/apt-shared-ladder.png";
import apartmentPianoWindow from "../assets/images/apt-piano-window.png";
import apartmentStairwellCat from "../assets/images/apt-stairwell-cat.png";
import apartmentLongTable from "../assets/images/apt-long-table.png";
import meetTea from "../assets/images/meet-tea.png";
import hero from "../assets/images/hero.png";

export const images: Record<string, ImageMetadata> = {
  "apt-grapevine-flat": apartmentGrapevineFlat,
  "apt-quiet-corner": apartmentQuietCorner,
  "apt-shared-ladder": apartmentSharedLadder,
  "apt-piano-window": apartmentPianoWindow,
  "apt-stairwell-cat": apartmentStairwellCat,
  "apt-long-table": apartmentLongTable,
  "meet-tea": meetTea,
  hero,
};

export function getImage(key: string): ImageMetadata {
  const img = images[key];
  if (!img) throw new Error(`No image registered for key "${key}"`);
  return img;
}
