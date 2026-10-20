/* ═══════════════════════════════════════════════════════════════════════
   JEDNO ŹRÓDŁO PRAWDY dla danych, które powtarzają się na wielu stronach.
   Dziś każda podstrona ma własne liczby (500 treningów / 0 treningów,
   4 lata / 0 lata). Tu wpisujesz raz, a strony biorą stąd.

   Zasada: liczba wpisana jako null NIE pojawia się na stronie wcale.
   Lepiej nie pokazać nic niż pokazać „0 lata" albo „[X] z [Y]".
   ═══════════════════════════════════════════════════════════════════════ */

export const TELEFON = "666 222 699";
export const TELEFON_HREF = "tel:+48666222699";

export const TRENER = {
  imie: "Maks", // TODO: pełne imię i nazwisko, jeśli chcesz je pokazywać
  foto: null as string | null, // TODO: ścieżka do zdjęcia z /public, np. "/trener.jpg"
};

// TODO: wpisz tylko to, co możesz pokazać w kalendarzu albo w notatkach.
export const LICZBY = {
  treningi: null as number | null, // treningi 1:1 przeprowadzone osobiście
  lata: null as number | null, // lata pracy jako trener
};

export const TRASY = {
  sala: "/trening-stacjonarny",
  online: "/trening-online",
  plan: "/produkty",
  konkurs: "/konkurs",
};

// +01:00 = czas zimowy (zmiana czasu w 2026: 25 października).
export const KONKURS = {
  koniec: new Date("2026-10-31T23:59:00+01:00"),
  wyniki: new Date("2026-11-07T12:00:00+01:00"),
  wartosc: "420 zł",
};

export const dataPL = (d: Date) =>
  `${d.toLocaleDateString("pl-PL", { day: "numeric", month: "long", timeZone: "Europe/Warsaw" })}, godz. ${d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" })}`;

export const dzienPL = (d: Date) =>
  d.toLocaleDateString("pl-PL", { day: "numeric", month: "long", timeZone: "Europe/Warsaw" });

export const lataPL = (n: number) => {
  if (n === 1) return "rok";
  const r10 = n % 10, r100 = n % 100;
  return r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14) ? "lata" : "lat";
};