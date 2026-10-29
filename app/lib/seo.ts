// PLIK: app/lib/seo.ts · SEO · metadane stron (tytuł, opis, canonical, Open Graph) i dane strukturalne (JSON-LD)
import type { Metadata } from "next";
import { ID_PRODUKTOW, znajdzProdukt, type Rodzaj } from "./produkty";
import { FIRMA, profile } from "@/app/tresc/firma";

/* ═══════════════════════════════════════════════════════════════════════
   SEO

   1. metaStrony(): tytuł, opis, adres kanoniczny i podgląd linku
      (Facebook, Messenger, WhatsApp) dla każdej podstrony.
   2. Dane strukturalne (JSON-LD), które czyta Google:
      · firma()   → kto, gdzie, telefon, ceny (strona główna),
      · usluga()  → usługa z cenami (każda podstrona oferty),
      · faq()     → pytania i odpowiedzi.
   Wstawia je komponent <JsonLd /> (app/components/JsonLd.tsx).

   PROFILE W SIECI: linki do Instagrama i Facebooka wpisujesz w
   app/tresc/firma.ts → PROFILE. Google łączy je wtedy z firmą.
   ═══════════════════════════════════════════════════════════════════════ */

export const ADRES_STRONY = (process.env.SITE_URL || FIRMA.strona).replace(/\/+$/, "");

/** Linki do profili (Instagram, Facebook) z app/tresc/firma.ts → PROFILE. */
const SPOLECZNOSCI: string[] = profile().map((p) => p.url);

/** Miejsce treningów stacjonarnych: to samo co w wizytówce Google. */
const SALA = {
  nazwa: "Just GYM",
  ulica: "ul. Piotrkowska 157A",
  kod: "90-440",
  miasto: "Łódź",
  /* Współrzędne Piotrkowskiej 157 (mapa.targeo.pl). Po założeniu wizytówki
     Google możesz je podmienić na dokładne z pinezki. */
  szerokosc: 51.75974,
  dlugosc: 19.45778,
};

/** Dzielnice i osiedla Łodzi: obszar, z którego dojeżdżają klienci. */
const DZIELNICE_LODZI = ["Śródmieście", "Polesie", "Górna", "Widzew", "Bałuty", "Retkinia", "Teofilów", "Chojny", "Stoki"];

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
          "Trener personalny w Łodzi: treningi personalne jeden na jeden w Just GYM przy ul. Piotrkowskiej 157A (centrum Łodzi, przystanek Piotrkowska Centrum), treningi online przez kamerę, indywidualne plany treningowe i prowadzenie.",
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
        geo: { "@type": "GeoCoordinates", latitude: SALA.szerokosc, longitude: SALA.dlugosc },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SALA.nazwa} ${SALA.ulica} ${SALA.miasto}`)}`,
        areaServed: [
          { "@type": "City", name: "Łódź", sameAs: "https://pl.wikipedia.org/wiki/%C5%81%C3%B3d%C5%BA" },
          ...DZIELNICE_LODZI.map((d) => ({ "@type": "Place", name: `${d}, Łódź` })),
          { "@type": "Country", name: "Polska" },
        ],
        knowsLanguage: "pl",
        employee: { "@id": ID_TRENERA },
        ...(SPOLECZNOSCI.length ? { sameAs: SPOLECZNOSCI } : {}),
      },
      {
        "@type": "Person",
        "@id": ID_TRENERA,
        name: FIRMA.trener.imie,
        jobTitle: "Trener personalny w Łodzi",
        workLocation: { "@id": ID_FIRMY },
        worksFor: { "@id": ID_FIRMY },
        knowsAbout: ["trening siłowy", "trójbój siłowy", "technika przysiadu", "martwy ciąg", "trening personalny"],
      },
    ],
  };
}

const NAZWY_USLUG: Record<"sala" | "online" | "plan", { nazwa: string; typ: string; rodzaje: Rodzaj[]; obszar: object }> = {
  sala: {
    nazwa: "Trener personalny Łódź: trening personalny 1 na 1 w centrum Łodzi",
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

/** Artykuł poradnikowy (np. ceny trenera w Łodzi). */
export function artykul(a: { tytul: string; opis: string; sciezka: string; data: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.tytul,
    description: a.opis,
    url: `${ADRES_STRONY}${a.sciezka}`,
    mainEntityOfPage: `${ADRES_STRONY}${a.sciezka}`,
    datePublished: a.data,
    dateModified: a.data,
    inLanguage: "pl-PL",
    image: `${ADRES_STRONY}/opengraph-image.png`,
    author: { "@id": ID_TRENERA },
    publisher: { "@id": ID_FIRMY },
    about: { "@type": "Thing", name: "Trener personalny Łódź" },
    spatialCoverage: { "@type": "City", name: "Łódź" },
  };
}

/** Okruszki: Strona główna › strona. */
export function okruszki(lista: { nazwa: string; sciezka: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ nazwa: "Strona główna", sciezka: "/" }, ...lista].map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.nazwa,
      item: `${ADRES_STRONY}${x.sciezka === "/" ? "" : x.sciezka}`,
    })),
  };
}
