// PLIK: app/tresc/firma.ts · DANE FIRMY · sprzedawca (Jarosław Sitek) i trener (Maksymilian Lehman)

/* ═══════════════════════════════════════════════════════════════════════
   DANE FIRMY

   SPRZEDAWCA (nazwa, adres, email, telefon): Jarosław Sitek. Sprzedaje
   wszystkie usługi, przyjmuje płatności (Stripe na jego dane), wystawia
   rachunki i jest administratorem danych osobowych. Działalność
   nierejestrowana: bez NIP i REGON. Po rejestracji firmy dopisz NIP.

   TRENER (trener.*): Maksymilian Lehman. Prowadzi treningi i plany
   w imieniu sprzedawcy. Jego mail i telefon to kontakt w sprawie
   zamówień i terminów: na nie idą powiadomienia o zamówieniach,
   zgłoszenia z konkursu i z nich dzwonimy do klientów.

   Zmieniasz tutaj, zmienia się w stopce, regulaminach, politykach,
   mailach i SMS-ach.
   ═══════════════════════════════════════════════════════════════════════ */

export const FIRMA = {
  /** Nazwa handlowa, którą widzi klient. */
  marka: "Maks Treningi",

  /* ── SPRZEDAWCA ── */
  /** Kto sprzedaje. Działalność bez rejestracji w CEIDG: imię i nazwisko. */
  nazwa: "Jarosław Sitek",
  wlasciciel: "Jarosław Sitek",
  /** Adres do korespondencji: tu klient może wysłać odstąpienie
      i reklamację. Pokazuje się w stopce, regulaminach i politykach. */
  adres: "ul. Targowa 38/38, 90-043 Łódź",
  /** Działalność nierejestrowana: bez NIP i REGON. Puste pola znikają. */
  nip: "",
  regon: "",
  /** Kontakt ze sprzedawcą: dane osobowe, reklamacje, rachunki. */
  email: "jarositek@gmail.com",
  telefon: "537 483 233",
  telefonHref: "tel:+48537483233",

  /* ── TRENER ── */
  trener: {
    imie: "Maksymilian Lehman",
    /** Powiadomienia o zamówieniach i zgłoszenia z konkursu. */
    email: "maksymilian.lehman.treningi@gmail.com",
    /** Numer, z którego dzwonisz do klientów i piszesz SMS-y. */
    telefon: "666 222 699",
    telefonHref: "tel:+48666222699",
  },

  /** Adres strony bez ukośnika na końcu. */
  strona: "https://www.trenerlodz.pl",
  /** Miejsce treningów stacjonarnych. */
  sala: "Just GYM, ul. Piotrkowska 157A, Łódź",
} as const;

/** Wersja dokumentów. Zmieniasz regulamin albo politykę: zmień datę. */
export const DATA_DOKUMENTOW = "28.10.2026";

/** „Jarosław Sitek, ul. Targowa …” i NIP/REGON, tylko jeśli są wpisane.
    Do regulaminu, polityk i stopki. */
export function daneSprzedawcy(): string {
  return [
    FIRMA.nazwa,
    FIRMA.adres,
    FIRMA.nip ? `NIP ${FIRMA.nip}` : "",
    FIRMA.regon ? `REGON ${FIRMA.regon}` : "",
  ]
    .filter(Boolean)
    .join(", ");
}