// PLIK: app/lib/maile.ts · STRIPE · treść maili do klienta i do trenera po zakupie
import { TELEFON, type Produkt } from "./produkty";

/* ═══════════════════════════════════════════════════════════════════════
   TREŚĆ MAILI · tutaj edytujesz to, co dostaje klient i Ty

   Te same obietnice co na stronach i na /dziekujemy. Zmieniasz je tam,
   zmień też tutaj.
   ═══════════════════════════════════════════════════════════════════════ */

const powitanie = (imie: string) => `Dzień dobry${imie ? `, ${imie}` : ""},`;

const TELEFON_W_24H = `W ciągu 24 godzin w dni robocze odezwę się tak, jak zaznaczysz w ankiecie. Jeśli dzwonię, to z numeru ${TELEFON}: zapisz go w kontaktach, żeby nie odrzucić połączenia. Jeśli nie odbierzesz, napiszę SMS-a.`;

const BRAK_TERMINU = "Jeśli w ciągu 14 dni nie znajdziemy wspólnego terminu, oddaję całą kwotę.";

const ZWROT_30 = "Zwrot w ciągu 30 dni: odpisz na tego maila jednym zdaniem.";

/** Co dalej, osobno dla każdego rodzaju produktu. */
const CO_DALEJ: Record<Produkt["rodzaj"], () => string[]> = {
  stacjonarny: () => [
    TELEFON_W_24H,
    "Ustalimy termin pierwszej sesji. Potwierdzenie z adresem przyjdzie SMS-em i mailem.",
    "",
    "Gdzie: Just GYM, ul. Piotrkowska 157A, Łódź (budynek HiPiotrkowska, przy Stajni Jednorożców). Wejście na salę masz w cenie.",
    "Weź strój, buty na zmianę, wodę i ręcznik.",
    "",
    BRAK_TERMINU,
  ],
  online: () => [
    TELEFON_W_24H,
    "Ustalimy termin, a link do rozmowy wideo przyjdzie SMS-em i mailem. Otwierasz go na telefonie.",
    "",
    "Przygotuj statyw albo coś, o co oprzesz telefon z boku, i słuchawki.",
    "",
    BRAK_TERMINU,
  ],
  ebook: () => [
    process.env.EBOOK_URL
      ? `Twój dostęp: ${process.env.EBOOK_URL}`
      : "Link do panelu z e-bookiem wyślę osobnym mailem w ciągu kilku minut.",
    "Dostęp jest bezterminowy i działa na telefonie.",
    "",
    "Jeśli w ciągu 30 dni przejdziesz na plan indywidualny albo prowadzenie, cenę e-booka odliczam w całości.",
    ZWROT_30,
  ],
  plan: () => [
    TELEFON_W_24H,
    "Kilka minut rozmowy o ankiecie, a plan na 12 tygodni z nagraniem omówienia dostaniesz w ciągu 72 godzin.",
    "",
    ZWROT_30,
  ],
  prowadzenie: () => [
    TELEFON_W_24H,
    "Ustalimy termin rozmowy diagnostycznej. Plan na pierwszy miesiąc dostaniesz w ciągu 72 godzin.",
    "",
    "Płatność odnawia się co miesiąc. Rezygnujesz kiedy chcesz, współpraca kończy się z ostatnim dniem opłaconego miesiąca.",
    ZWROT_30,
  ],
};

/** Link do ankiety z numerem zamówienia, żebyś wiedział, czyja to ankieta.
    Bez ANKIETA_URL zwraca undefined i mail mówi, że link przyjdzie osobno. */
export function linkDoAnkiety(numer: string): string | undefined {
  const url = process.env.ANKIETA_URL;
  if (!url) return undefined;
  return `${url}${url.includes("?") ? "&" : "?"}zamowienie=${encodeURIComponent(numer)}`;
}

export function mailDoKlienta(p: Produkt, numer: string, kwota: string, imie: string): string {
  /* Ankieta po płatności: dla wszystkiego poza e-bookiem. */
  const link = linkDoAnkiety(numer);
  const ankieta =
    p.rodzaj === "ebook"
      ? []
      : [
          "PIERWSZY KROK: ankieta, 3 minuty",
          link
            ? link
            : "Link do ankiety wyślę osobno w ciągu kilku minut.",
          "Kontuzje, staż, cel, kiedy możesz trenować i jak mam się kontaktować (telefon, tylko SMS albo tylko e-mail). Nie zdążysz? Zapytam przy pierwszym kontakcie.",
          "",
        ];
  return [
    powitanie(imie),
    "",
    `dziękuję za zakup: ${p.nazwa} (${kwota}${p.cykliczny ? " miesięcznie" : ""}).`,
    `Numer zamówienia: ${numer}`,
    "",
    ...ankieta,
    ...CO_DALEJ[p.rodzaj](),
    "",
    `Pytania: ${TELEFON}`,
    "Maks Treningi",
  ].join("\n");
}

type DaneDoTrenera = {
  numer: string;
  email?: string;
  imieNazwisko: string;
  telefon: string;
  kwota: string;
  panel: string;
};

/* Mail na Twój adres służbowy (MAIL_TRENERA w .env.local). Dane klienta
   na górze, żeby od razu dało się zadzwonić. */
export function mailDoTrenera(p: Produkt, d: DaneDoTrenera): string {
  return [
    "DANE KLIENTA",
    `Imię i nazwisko: ${d.imieNazwisko || "nie podano"}`,
    `E-mail:          ${d.email ?? "nie podano"}`,
    `Telefon:         ${d.telefon || "nie podano"}`,
    "",
    "ZAMÓWIENIE",
    `Produkt:         ${p.nazwa}`,
    `Kwota:           ${d.kwota}${p.cykliczny ? " miesięcznie" : ""}`,
    `Numer:           ${d.numer}`,
    "",
    p.telefon
      ? `Obietnica na stronie: telefon w ciągu 24 h w dni robocze. ${BRAK_TERMINU}`
      : "Produkt bez telefonu. Sprawdź, czy link do e-booka wyszedł.",
    "",
    `Płatność w panelu Stripe: ${d.panel}`,
  ].join("\n");
}

export function mailNieudana(p: Produkt | undefined, imie: string): string {
  return [
    powitanie(imie),
    "",
    `bank nie potwierdził płatności za: ${p?.nazwa ?? "zamówienie"}. Pieniądze nie zostały pobrane.`,
    "Możesz spróbować jeszcze raz ze strony albo zadzwonić, to przejdziemy przez to razem.",
    "",
    `Telefon: ${TELEFON}`,
    "Maks Treningi",
  ].join("\n");
}