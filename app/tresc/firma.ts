// PLIK: app/tresc/firma.ts · DANE FIRMY · jedno źródło dla stopki, regulaminu i polityki prywatności

/* ═══════════════════════════════════════════════════════════════════════
   DANE FIRMY

   ⚠ Wszystko w [nawiasach] uzupełnij danymi z CEIDG (biznes.gov.pl).
   Te same dane pokazuje stopka na każdej stronie, regulamin
   i polityka prywatności. Zmieniasz tutaj, zmienia się wszędzie.

   Przepisy wymagają, żeby na stronie było widać: kto sprzedaje (imię,
   nazwisko i nazwę firmy), adres, NIP i adres e-mail do kontaktu.
   ═══════════════════════════════════════════════════════════════════════ */

export const FIRMA = {
  /** Nazwa handlowa, którą widzi klient. */
  marka: "Maks Treningi",
  /** Pełna nazwa z CEIDG, np. „Maksymilian Lehman Maks Treningi". */
  nazwa: "[Maksymilian Lehman, nazwa firmy z CEIDG]",
  wlasciciel: "Maksymilian Lehman",
  /** Adres wpisany w CEIDG (adres do doręczeń). */
  adres: "[ulica i numer], [kod pocztowy] [miasto]",
  nip: "[NIP]",
  regon: "[REGON]",
  email: "[kontakt@twojadomena.pl]",
  telefon: "537 483 233",
  telefonHref: "tel:+48537483233",
  /** Adres strony bez ukośnika na końcu. */
  strona: "[https://twojadomena.pl]",
  /** Miejsce treningów stacjonarnych. */
  sala: "Just GYM, ul. Piotrkowska 157A, Łódź",
} as const;

/** Wersja dokumentów. Zmieniasz regulamin albo politykę: zmień datę. */
export const DATA_DOKUMENTOW = "[DD.MM.2026]";
