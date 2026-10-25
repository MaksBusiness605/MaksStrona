// PLIK: app/sitemap.ts · SEO · mapa strony dla Google pod /sitemap.xml
import type { MetadataRoute } from "next";
import { ADRES_STRONY } from "@/app/lib/seo";

/* Nowa podstrona do pokazania w Google: dopisz ją tutaj.
   priority: 1 = najważniejsza; changeFrequency: jak często się zmienia. */
const STRONY: { sciezka: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { sciezka: "/", priority: 1, changeFrequency: "weekly" },
  { sciezka: "/trening-stacjonarny", priority: 0.9, changeFrequency: "monthly" },
  { sciezka: "/trening-online", priority: 0.8, changeFrequency: "monthly" },
  { sciezka: "/produkty", priority: 0.8, changeFrequency: "monthly" },
  { sciezka: "/ile-kosztuje-trener-personalny-lodz", priority: 0.8, changeFrequency: "monthly" },
  { sciezka: "/konkurs", priority: 0.5, changeFrequency: "weekly" },
  { sciezka: "/regulamin", priority: 0.2, changeFrequency: "yearly" },
  { sciezka: "/konkurs/regulamin", priority: 0.2, changeFrequency: "yearly" },
  { sciezka: "/polityka-prywatnosci", priority: 0.2, changeFrequency: "yearly" },
  { sciezka: "/polityka-cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const teraz = new Date();
  return STRONY.map((s) => ({
    url: `${ADRES_STRONY}${s.sciezka === "/" ? "" : s.sciezka}`,
    lastModified: teraz,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));
}
