// PLIK: app/lib/seo.ts · SEO · metadane stron (tytuł, opis, canonical, Open Graph) i dane strukturalne (JSON-LD)
import type { Metadata } from "next";
import { ID_PRODUKTOW, znajdzProdukt, type Rodzaj } from "./produkty";
import { FIRMA } from "@/app/tresc/firma";

/* ═══════════════════════════════════════════════════════════════════════
   SEO

   1. metaStrony(): tytuł, opis, adres kanoniczny i podgląd linku
      (Facebook, Messenger, WhatsApp) dla każdej podstrony.
   2. Dane strukturalne (JSON-LD), które czyta Google:
      · firma()   → kto, gdzie, telefon, ceny (strona główna),
      · usluga()  → usługa z cenami (każda podstrona oferty),
      · faq()     → pytania i odpowiedzi.
   Wstawia je komponent <JsonLd /> (app/components/JsonLd.tsx).

   PROFILE W SIECI: wpisz linki do SPOLECZNOSCI, gdy założysz profil
   Google, Instagram albo Facebook. Google łączy je wtedy z firmą.
   ═══════════════════════════════════════════════════════════════════════ */

export const ADRES_STRONY = (process.env.SITE_URL || FIRMA.strona).replace(/\/+$/, "");

/** Linki do profili firmy, np. "https://www.instagram.com/makstreningi". */
const SPOLECZNOSCI: string[] = [];

/** Miejsce treningów stacjonarnych: to samo co w wizytówce Google. */
const SALA = {
  nazwa: "Just GYM",
  ulica: "ul. Piotrkowska 157A",
  kod: "90-440",
  miasto: "Łódź",
};

export function metaStrony(m: { tytul: string; opis: string; sciezka: string }): Metadata {
  return {
    title: m.tytul,
    description: m.opis,
    alternates: { canonical: m.sciezka },
    openGraph: {
      title: m.tytul,
      description: m.opis,
      url: m.sciezka,
      siteName: FIRMA.marka,
      locale: "pl_PL",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: m.tytul, description: m.opis },
  };
}

const zlote = (grosze: number) => (grosze / 100).toFixed(2);
const ID_FIRMY = `${ADRES_STRONY}/#firma`;
const ID_TRENERA = `${ADRES_STRONY}/#trener`;

/** Firma i trener. Na stronie głównej. */
export function firma() {
  const ceny = ID_PRODUKTOW.map((id) => znajdzProdukt(id)!.cenaGrosze);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "SportsActivityLocation"],
        "@id": ID_FIRMY,
        name: `${FIRMA.marka}: trener personalny Łódź`,
        alternateName: FIRMA.marka,
        description:
          "Treningi personalne jeden na jeden w Just GYM przy Piotrkowskiej w Łodzi, treningi online przez kamerę, indywidualne plany treningowe i prowadzenie.",
        url: ADRES_STRONY,
        image: `${ADRES_STRONY}/opengraph-image.png`,
        logo: `${ADRES_STRONY}/logo-znak.svg`,
        telephone: `+48${FIRMA.trener.telefon.replace(/\D/g, "")}`,
        email: FIRMA.trener.email,
        priceRange: `${Math.min(...ceny) / 100}–${Math.max(...ceny) / 100} zł`,
        currenciesAccepted: "PLN",
        paymentAccepted: "BLIK, karta płatnicza, Przelewy24",
        address: {
          "@type": "PostalAddress",
          streetAddress: `${SALA.ulica} (${SALA.nazwa})`,
          postalCode: SALA.kod,
          addressLocality: SALA.miasto,
          addressRegion: "łódzkie",
          addressCountry: "PL",
        },
        areaServed: [
          { "@type": "City", name: "Łódź" },
          { "@type": "Country", name: "Polska" },
        ],
        employee: { "@id": ID_TRENERA },
        ...(SPOLECZNOSCI.length ? { sameAs: SPOLECZNOSCI } : {}),
      },
      {
        "@type": "Person",
        "@id": ID_TRENERA,
        name: FIRMA.trener.imie,
        jobTitle: "Trener personalny",
        worksFor: { "@id": ID_FIRMY },
        knowsAbout: ["trening siłowy", "trójbój siłowy", "technika przysiadu", "martwy ciąg", "trening personalny"],
      },
    ],
  };
}

const NAZWY_USLUG: Record<"sala" | "online" | "plan", { nazwa: string; typ: string; rodzaje: Rodzaj[]; obszar: object }> = {
  sala: {
    nazwa: "Trening personalny w Łodzi",
    typ: "Trening personalny",
    rodzaje: ["stacjonarny"],
    obszar: { "@type": "City", name: "Łódź" },
  },
  online: {
    nazwa: "Trening personalny online przez kamerę",
    typ: "Trening personalny online",
    rodzaje: ["online"],
    obszar: { "@type": "Country", name: "Polska" },
  },
  plan: {
    nazwa: "Indywidualny plan treningowy i prowadzenie",
    typ: "Plan treningowy",
    rodzaje: ["plan", "prowadzenie", "ebook"],
    obszar: { "@type": "Country", name: "Polska" },
  },
};

/** Usługa z cenami wszystkich wariantów. */
export function usluga(rodzaj: "sala" | "online" | "plan", sciezka: string) {
  const u = NAZWY_USLUG[rodzaj];
  const produkty = ID_PRODUKTOW.map((id) => znajdzProdukt(id)!).filter((p) => u.rodzaje.includes(p.rodzaj));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: u.nazwa,
    serviceType: u.typ,
    url: `${ADRES_STRONY}${sciezka}`,
    provider: { "@id": ID_FIRMY },
    areaServed: u.obszar,
    offers: produkty.map((p) => ({
      "@type": "Offer",
      name: p.nazwa,
      price: zlote(p.cenaGrosze),
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      url: `${ADRES_STRONY}${sciezka}`,
    })),
  };
}

/** Pytania i odpowiedzi. Przyjmuje {q, a} albo {p, o} (strona główna). */
export function faq(pytania: ({ q: string; a: string } | { p: string; o: string })[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pytania.map((x) => {
      const [pytanie, odpowiedz] = "q" in x ? [x.q, x.a] : [x.p, x.o];
      return { "@type": "Question", name: pytanie, acceptedAnswer: { "@type": "Answer", text: odpowiedz } };
    }),
  };
}
