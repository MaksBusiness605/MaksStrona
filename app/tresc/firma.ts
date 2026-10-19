// PLIK: app/tresc/firma.ts · DANE FIRMY · jedno źródło dla stopki, regulaminu i polityki prywatności

/* ═══════════════════════════════════════════════════════════════════════
   DANE FIRMY

   Działalność nierejestrowana: imię i nazwisko, adres do korespondencji,
   bez NIP i REGON. Po rejestracji firmy dopisz NIP i REGON.
   Te same dane pokazuje stopka na każdej stronie, regulamin
   i polityka prywatności. Zmieniasz tutaj, zmienia się wszędzie.

   Przepisy wymagają, żeby na stronie było widać: kto sprzedaje (imię,
   nazwisko i nazwę firmy), adres, NIP i adres e-mail do kontaktu.
   ═══════════════════════════════════════════════════════════════════════ */

export const FIRMA = {
  /** Nazwa handlowa, którą widzi klient. */
  marka: "Maks Treningi",
  /** Kto sprzedaje. Działalność bez rejestracji w CEIDG: imię i nazwisko. */
  nazwa: "Maksymilian Lehman",
  wlasciciel: "Maksymilian Lehman",
  /** Adres do korespondencji (tu klient może wysłać np. odstąpienie od umowy). */
  adres: "ul. Piotrkowska 157A, 90-440 Łódź",
  /** Działalność nierejestrowana: bez NIP i REGON. Puste pola znikają
      ze stopki, regulaminu, polityki i maili. Po założeniu firmy wpisz. */
  nip: "",
  regon: "",
  email: "maksymilian.lehman.treningi@gmail.com",
  telefon: "666 222 699",
  telefonHref: "tel:+48666222699",
  /** Adres strony bez ukośnika na końcu. */
  strona: "https://www.trenerlodz.pl",
  /** Miejsce treningów stacjonarnych. */
  sala: "Just GYM, ul. Piotrkowska 157A, Łódź",
} as const;

/** Wersja dokumentów. Zmieniasz regulamin albo politykę: zmień datę. */
export const DATA_DOKUMENTOW = "18.10.2026";

/** „Maksymilian Lehman, ul. Piotrkowska 157A, 90-440 Łódź” i NIP/REGON,
    tylko jeśli są wpisane. Do regulaminu, polityki i stopki. */
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