// PLIK: app/robots.ts · SEO · co Google może indeksować, pod /robots.txt
import type { MetadataRoute } from "next";
import { ADRES_STRONY } from "@/app/lib/seo";

/* Strony po zakupie, ankieta, płatności i API nie mają trafiać do Google. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dziekujemy", "/ankieta", "/zamowienie"],
      },
    ],
    sitemap: `${ADRES_STRONY}/sitemap.xml`,
    host: ADRES_STRONY,
  };
}
