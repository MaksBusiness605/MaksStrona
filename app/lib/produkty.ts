/* ═══════════════════════════════════════════════════════════════════════
   KATALOG PRODUKTÓW · jedno źródło prawdy dla płatności

   Z tego pliku korzystają: platnosc.ts (tworzy płatność), webhook.ts
   (wysyła maile) i /dziekujemy (pokazuje, co dalej). Strona
   /zamowienie też powinna brać nazwy i ceny stąd:
     import { znajdzProdukt, cena } from "@/app/_stripe/produkty";
   Next nie pozwala eksportować danych z pliku strony, dlatego katalog
   stoi tutaj, a nie w page.tsx.

   CENY W GROSZACH. 150 zł to 15000. Zmieniasz cenę tutaj, a potem
   w tekstach na stronie (cennik, FAQ, hero), bo tamte są pisane ręcznie.
   ═══════════════════════════════════════════════════════════════════════ */

export type Rodzaj = "stacjonarny" | "online" | "ebook" | "plan" | "prowadzenie";

export type Produkt = {
  id: IdProduktu;
  /** Nazwa na stronie płatności, w mailu i na /dziekujemy. */
  nazwa: string;
  /** Krótki opis pod nazwą na stronie płatności Stripe. */
  opis: string;
  cenaGrosze: number;
  rodzaj: Rodzaj;
  /** true = płatność co miesiąc (subskrypcja), false = jednorazowa. */
  cykliczny: boolean;
  /** Czy dzwonisz po zakupie. Wtedy Stripe pyta o numer telefonu. */
  telefon: boolean;
  /** Strona produktu: tu wraca klient, gdy przerwie płatność. */
  strona: string;
};

const KATALOG = {
  "stacjonarny-1": {
    nazwa: "Pojedyncza sesja",
    opis: "Trening personalny 60 min · Just GYM, Piotrkowska 157A, Łódź",
    cenaGrosze: 15000,
    rodzaj: "stacjonarny",
    cykliczny: false,
    telefon: true,
    strona: "/trening-stacjonarny",
  },
  "stacjonarny-3": {
    nazwa: "Pakiet 3 sesji",
    opis: "3 × trening personalny 60 min · Just GYM, Łódź · bez daty ważności",
    cenaGrosze: 42000,
    rodzaj: "stacjonarny",
    cykliczny: false,
    telefon: true,
    strona: "/trening-stacjonarny",
  },
  "stacjonarny-5": {
    nazwa: "Pakiet 5 sesji",
    opis: "5 × trening personalny 60 min · Just GYM, Łódź · bez daty ważności",
    cenaGrosze: 65000,
    rodzaj: "stacjonarny",
    cykliczny: false,
    telefon: true,
    strona: "/trening-stacjonarny",
  },
  "online-1": {
    nazwa: "Pojedynczy trening online",
    opis: "Trening 1:1 przez kamerę, 60 min",
    cenaGrosze: 10000,
    rodzaj: "online",
    cykliczny: false,
    telefon: true,
    strona: "/coaching-online",
  },
  "online-3": {
    nazwa: "Pakiet 3 treningów online",
    opis: "3 × trening 1:1 przez kamerę · ważność 8 tygodni",
    cenaGrosze: 26000,
    rodzaj: "online",
    cykliczny: false,
    telefon: true,
    strona: "/coaching-online",
  },
  "online-5": {
    nazwa: "Pakiet 5 treningów online",
    opis: "5 × trening 1:1 przez kamerę · ważność 12 tygodni",
    cenaGrosze: 40000,
    rodzaj: "online",
    cykliczny: false,
    telefon: true,
    strona: "/coaching-online",
  },
  ebook: {
    nazwa: "E-book",
    opis: "Zasady układania treningu, wideo do ćwiczeń i arkusz progresji",
    cenaGrosze: 9900,
    rodzaj: "ebook",
    cykliczny: false,
    telefon: false,
    strona: "/produkty",
  },
  plan: {
    nazwa: "Indywidualny plan",
    opis: "Plan na 12 tygodni pod Twoją ankietę, gotowy w 72 h",
    cenaGrosze: 24900,
    rodzaj: "plan",
    cykliczny: false,
    telefon: true,
    strona: "/produkty",
  },
  prowadzenie: {
    nazwa: "Prowadzenie",
    opis: "Plan, check-in co 7 dni i korekty w trakcie miesiąca · rezygnujesz kiedy chcesz",
    cenaGrosze: 34900,
    rodzaj: "prowadzenie",
    cykliczny: true,
    telefon: true,
    strona: "/produkty",
  },
} as const satisfies Record<string, Omit<Produkt, "id">>;

export type IdProduktu = keyof typeof KATALOG;

export const ID_PRODUKTOW = Object.keys(KATALOG) as IdProduktu[];

/** Bezpieczne wyszukanie: zwraca undefined dla wszystkiego spoza katalogu. */
export function znajdzProdukt(id: unknown): Produkt | undefined {
  if (typeof id !== "string" || !Object.prototype.hasOwnProperty.call(KATALOG, id)) return undefined;
  const k = id as IdProduktu;
  return { id: k, ...KATALOG[k] };
}

/** 15000 → "150 zł", 24950 → "249,50 zł". */
export function cena(grosze: number): string {
  const zl = grosze / 100;
  return `${Number.isInteger(zl) ? zl : zl.toFixed(2).replace(".", ",")} zł`;
}

/** Numer zamówienia czytelny przez telefon, np. MT-LX4K2P9A. */
export function noweZamowienie(): string {
  const czesc = Date.now().toString(36).toUpperCase().slice(-5);
  const los = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `MT-${czesc}${los}`;
}

export const TELEFON = "537 483 233";
export const TELEFON_HREF = "tel:+48537483233";