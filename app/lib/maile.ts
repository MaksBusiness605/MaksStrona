// PLIK: app/lib/maile.ts · MAILE · treść maili i SMS-ów (wygląd maila do klienta: szablon-potwierdzenia.ts)
import { TELEFON, type Produkt } from "./produkty";
import { FIRMA } from "@/app/tresc/firma";

/* ═══════════════════════════════════════════════════════════════════════
   TREŚĆ MAILI · tutaj edytujesz to, co dostaje klient i Ty

   Te same obietnice co na stronach i na /dziekujemy. Zmieniasz je tam,
   zmień też tutaj.
   ═══════════════════════════════════════════════════════════════════════ */

const powitanie = (imie: string) => `Dzień dobry${imie ? `, ${imie}` : ""},`;

const BRAK_TERMINU = "Jeśli w ciągu 14 dni nie znajdziemy wspólnego terminu, oddaję całą kwotę.";

/** Zgodnie z regulaminem, § 9. */
const ODSTAPIENIE =
  "Do czasu wykonania usługi możesz odstąpić od umowy w ciągu 14 dni od zakupu: wystarczy odpisać na tego maila. Szczegóły w regulaminie, § 9.";

/* ─────────────────────────────────────────────────────── POTWIERDZENIE
   Treść maila do klienta zapisana jako dane. Z tych samych danych
   powstają dwie wersje: ładny HTML (szablon-potwierdzenia.ts) i zwykły
   tekst (mailDoKlienta niżej). Tekst zmieniasz tutaj, raz, dla obu. */

export type Krok = {
  tytul: string;
  opis: string;
  /** Przycisk pod krokiem, np. ankieta albo e-book. */
  przycisk?: { etykieta: string; url: string };
  /** true = krok już zrobiony (płatność), pokazany z ptaszkiem. */
  zrobione?: boolean;
};

export type Potwierdzenie = {
  /** Krótki tekst widoczny w skrzynce obok tematu (preheader). */
  zajawka: string;
  naglowek: string;
  wstep: string;
  zamowienie: { etykieta: string; wartosc: string }[];
  kroki: Krok[];
  /** Ramka z praktycznymi informacjami, np. gdzie i co zabrać. */
  wskazowki?: { tytul: string; linie: string[] };
  /** Spokojnie: zwrot, odstąpienie, rezygnacja. */
  gwarancje: string[];
  /** Dodatkowy link pod gwarancjami, np. zarządzanie subskrypcją. */
  linkDodatkowy?: { etykieta: string; url: string };
};

const KROK_PLATNOSC: Krok = {
  tytul: "Płatność przyjęta",
  opis: "Wszystko się zgadza, nic więcej nie musisz robić w tej sprawie.",
  zrobione: true,
};

function krokAnkieta(numer: string): Krok {
  const link = linkDoAnkiety(numer);
  return {
    tytul: "Ankieta, 3 minuty",
    opis: link
      ? "Kontuzje, staż, cel, kiedy możesz trenować i jak wolisz kontakt. Dzięki niej pierwsza rozmowa jest krótka i konkretna. Nie zdążysz? Zapytam przy pierwszym kontakcie."
      : "Link do ankiety wyślę osobno w ciągu kilku minut. Kontuzje, staż, cel i kiedy możesz trenować.",
    ...(link ? { przycisk: { etykieta: "Wypełnij ankietę", url: link } } : {}),
  };
}

const KROK_TELEFON: Krok = {
  tytul: "Zadzwonię albo napiszę SMS-a w ciągu 24 godzin",
  opis: `W dni robocze, w godzinach z ankiety. Dzwonię z numeru ${TELEFON}: zapisz go, żeby nie odrzucić połączenia. Jeśli się nie dodzwonię, wyślę SMS-a z 2–3 wolnymi okienkami, a Ty odpiszesz, które pasuje.`,
};

/** Data zakupu po polsku, strefa Warszawy, np. „19.10.2026, 14:05”. */
const dataZakupu = () =>
  new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Obietnica kontaktu: przy usługach telefon w 24 h, przy e-booku odpowiedź na maila. */
const KONTAKT_24H = (p: Produkt) =>
  p.telefon ? "W ciągu 24 godzin (dni robocze) zadzwonię albo napiszę SMS-a z terminami" : "Na pytania odpowiadam w ciągu 24 godzin";

const ZAMOWIENIE = (p: Produkt, numer: string, kwota: string) => [
  { etykieta: "Produkt", wartosc: p.nazwa },
  { etykieta: "Kwota", wartosc: `${kwota}${p.cykliczny ? " / miesiąc" : ""}` },
  { etykieta: "Numer zamówienia", wartosc: numer },
  { etykieta: "Data", wartosc: dataZakupu() },
  { etykieta: "Kontakt", wartosc: `${KONTAKT_24H(p)}. Tel. ${TELEFON}, ${FIRMA.trener.email}` },
];

/** Krok z przyciskiem do e-booka. Przy planie i prowadzeniu e-book jest w pakiecie. */
function krokEbook(link: string | undefined, wPakiecie: boolean): Krok {
  return link
    ? {
        tytul: wPakiecie ? "E-book w pakiecie, już teraz" : "Pobierz e-booka",
        opis: wPakiecie
          ? "Zanim dostaniesz plan, możesz przeczytać zasady, na których go układam. Link działa bezterminowo."
          : "PDF otwiera się na telefonie i na komputerze. Link działa bezterminowo: zapisz ten mail, żeby pobrać go ponownie.",
        przycisk: { etykieta: "Pobierz e-booka (PDF)", url: link },
      }
    : {
        tytul: "Link do e-booka",
        opis: "Wyślę go osobnym mailem w ciągu kilku minut. Sprawdź też Spam i Oferty.",
      };
}

/** linkEbook: link z app/lib/ebook.ts (linkDoEbooka). Bez niego mail
    mówi, że link przyjdzie osobno. */
export function potwierdzenie(p: Produkt, numer: string, kwota: string, imie: string, linkEbook?: string): Potwierdzenie {
  const dzieki = imie ? `Dzięki, ${imie}!` : "Dziękuję!";
  const zamowienie = ZAMOWIENIE(p, numer, kwota);

  switch (p.rodzaj) {
    case "stacjonarny":
      return {
        zajawka: "Płatność przyjęta. Kontakt w 24 h, a pierwszy krok to ankieta (3 min).",
        naglowek: `${dzieki} Do zobaczenia na sali.`,
        wstep: `Płatność przyjęta. W ciągu 24 godzin (dni robocze) zadzwonię z numeru ${TELEFON} albo napiszę SMS-a z wolnymi terminami. Poniżej masz wszystko, co wydarzy się do pierwszego treningu.`,
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokAnkieta(numer),
          KROK_TELEFON,
          {
            tytul: "Pierwsza sesja",
            opis: "Ustalimy termin, a potwierdzenie z adresem przyjdzie SMS-em.",
          },
        ],
        wskazowki: {
          tytul: "Gdzie i co zabrać",
          linie: [
            "Just GYM, ul. Piotrkowska 157A, Łódź (budynek HiPiotrkowska, przy Stajni Jednorożców).",
            "Wejście na salę nie jest w cenie sesji: potrzebujesz karnetu albo jednorazowego wejścia do Just GYM.",
            "Strój, buty na zmianę, woda i ręcznik.",
          ],
        },
        gwarancje: [BRAK_TERMINU, ODSTAPIENIE],
      };

    case "online":
      return {
        zajawka: "Płatność przyjęta. Kontakt w 24 h, a pierwszy krok to ankieta (3 min).",
        naglowek: `${dzieki} Zaczynamy.`,
        wstep: `Płatność przyjęta. W ciągu 24 godzin (dni robocze) zadzwonię z numeru ${TELEFON} albo napiszę SMS-a z wolnymi terminami. Poniżej masz wszystko, co wydarzy się do pierwszego treningu.`,
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokAnkieta(numer),
          KROK_TELEFON,
          {
            tytul: "Pierwszy trening",
            opis: "Ustalimy termin i komunikator, który wolisz: Messenger, WhatsApp albo Discord. Potwierdzenie terminu przyjdzie SMS-em.",
          },
        ],
        wskazowki: {
          tytul: "Jak się przygotować",
          linie: [
            "Statyw albo coś, o co oprzesz telefon z boku, tak żebym widział całą sylwetkę.",
            "Słuchawki, żebyś słyszał mnie przy ćwiczeniach.",
            "Trochę wolnego miejsca na podłodze.",
          ],
        },
        gwarancje: [BRAK_TERMINU, ODSTAPIENIE],
      };

    case "ebook":
      return {
        zajawka: "Płatność przyjęta. Twój e-book jest gotowy.",
        naglowek: `${dzieki} E-book jest Twój.`,
        wstep: `Płatność przyjęta. E-book w PDF jest gotowy do pobrania, dostęp jest bezterminowy. Masz pytanie? Odpisz na tego maila, odpowiadam w ciągu 24 godzin.`,
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokEbook(linkEbook, false),
        ],
        gwarancje: [
          "Jeśli w ciągu 30 dni przejdziesz na plan indywidualny albo prowadzenie, cenę e-booka odliczam w całości.",
        ],
      };

    case "plan":
      return {
        zajawka: "Płatność przyjęta. Kontakt w 24 h, a pierwszy krok to ankieta (3 min).",
        naglowek: `${dzieki} Rozpisuję Twój plan.`,
        wstep: `Płatność przyjęta. W ciągu 24 godzin (dni robocze) zadzwonię z numeru ${TELEFON} albo napiszę SMS-a z wolnymi terminami. Tak wygląda droga do planu na 12 tygodni.`,
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokAnkieta(numer),
          ...(linkEbook ? [krokEbook(linkEbook, true)] : []),
          { ...KROK_TELEFON, opis: `${KROK_TELEFON.opis} Kilka minut rozmowy o ankiecie.` },
          {
            tytul: "Plan w ciągu 72 godzin",
            opis: "Plan na 12 tygodni z nagraniem omówienia, w którym tłumaczę, co i dlaczego.",
          },
        ],
        gwarancje: [ODSTAPIENIE],
      };

    case "prowadzenie": {
      return {
        zajawka: "Płatność przyjęta. Kontakt w 24 h, a pierwszy krok to ankieta (3 min).",
        naglowek: `${dzieki} Od teraz jestem w Twoim narożniku.`,
        wstep: `Płatność przyjęta. W ciągu 24 godzin (dni robocze) zadzwonię z numeru ${TELEFON} albo napiszę SMS-a z wolnymi terminami. Tak wygląda pierwszy tydzień prowadzenia.`,
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokAnkieta(numer),
          ...(linkEbook ? [krokEbook(linkEbook, true)] : []),
          { ...KROK_TELEFON, tytul: "Rozmowa diagnostyczna" },
          {
            tytul: "Plan na pierwszy miesiąc",
            opis: "Dostajesz go w ciągu 72 godzin od rozmowy. Potem co tydzień sprawdzamy postępy i poprawiamy plan.",
          },
        ],
        gwarancje: [
          "Płatność odnawia się automatycznie co miesiąc.",
          `Rezygnacja w każdej chwili, bez kar: napisz SMS-a, zadzwoń (${TELEFON}) albo odpisz na tego maila. Kolejne płatności zatrzymuję, a prowadzenie trwa do końca opłaconego miesiąca.`,
          ODSTAPIENIE,
        ],
      };
    }
  }
}

/** Link do ankiety z numerem zamówienia, żebyś wiedział, czyja to ankieta.
    Bez ANKIETA_URL zwraca undefined i mail mówi, że link przyjdzie osobno. */
export function linkDoAnkiety(numer: string): string | undefined {
  const url = process.env.ANKIETA_URL;
  if (!url) return undefined;
  return `${url}${url.includes("?") ? "&" : "?"}zamowienie=${encodeURIComponent(numer)}`;
}

/** Wersja tekstowa tego samego maila: dla programów pocztowych bez HTML
    i dla filtrów antyspamowych. Wysyłana razem z HTML-em. */
export function mailDoKlienta(p: Produkt, numer: string, kwota: string, imie: string, linkEbook?: string): string {
  const t = potwierdzenie(p, numer, kwota, imie, linkEbook);
  const linie: string[] = [powitanie(imie), "", t.wstep, ""];

  for (const z of t.zamowienie) linie.push(`${z.etykieta}: ${z.wartosc}`);
  linie.push("", "CO DALEJ");
  t.kroki.forEach((k, i) => {
    linie.push(`${i + 1}. ${k.tytul}${k.zrobione ? " ✓" : ""}`, k.opis);
    if (k.przycisk) linie.push(`${k.przycisk.etykieta}: ${k.przycisk.url}`);
    linie.push("");
  });
  if (t.wskazowki) linie.push(t.wskazowki.tytul.toUpperCase(), ...t.wskazowki.linie, "");
  linie.push("SPOKOJNIE", ...t.gwarancje);
  if (t.linkDodatkowy) linie.push(`${t.linkDodatkowy.etykieta}: ${t.linkDodatkowy.url}`);
  linie.push("", `Pytania: ${TELEFON}, ${FIRMA.trener.email} albo odpisz na tego maila.`, "Maks Treningi");
  return linie.join("\n");
}

type DaneDoTrenera = {
  numer: string;
  email?: string;
  imieNazwisko: string;
  telefon: string;
  kwota: string;
  panel: string;
  /** Rabat z kodu promocyjnego (np. z konkursu), jeśli był. */
  rabat?: string;
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
    ...(d.rabat ? [`Rabat z kodu:    ${d.rabat} (kod promocyjny, np. z konkursu)`] : []),
    "",
    p.telefon
      ? `Obietnica na stronie: telefon w ciągu 24 h w dni robocze. ${BRAK_TERMINU}`
      : "Produkt bez telefonu. Sprawdź, czy link do e-booka wyszedł.",
    "",
    "PŁATNOŚĆ W STRIPE",
    d.panel,
  ].join("\n");
}

/* ─────────────────────────────────────────────────────── TREŚĆ SMS
   Jeden SMS to 160 znaków bez polskich liter. Polskie litery są
   zamieniane na łacińskie przed wysyłką (wyslij-sms.ts), bo jedna „ą”
   zmniejsza limit do 70 znaków i SMS kosztuje 3 razy więcej.

   Każdy SMS ma kilka wersji, od najpełniejszej do najkrótszej. Wychodzi
   pierwsza, która mieści się w jednym SMS-ie (160 znaków). Długi link
   do ankiety albo długie imię nie podwoją więc kosztu.

   Nazwy „Maks Treningi” nie dopisujemy: pokazuje ją pole nadawcy. */

/** Limit jednego SMS-a w alfabecie GSM (bez polskich znaków). */
export const LIMIT_SMS = 160;
/** Limit dwóch części (2 × 153). Potwierdzenie zakupu ma wszystkie
    podstawowe dane, więc idzie w 2 częściach: około 0,37 zł za SMS. */
export const LIMIT_SMS_2 = 306;

/** Pierwsza wersja, która mieści się w limicie, albo najkrótsza. */
function najkrotszaMieszczaca(wersje: string[], limit = LIMIT_SMS): string {
  const czyste = wersje.map((w) => doGsm(w.replace(/\s+/g, " ").trim()));
  return czyste.find((w) => w.length <= limit) ?? czyste.reduce((a, b) => (b.length < a.length ? b : a));
}

/** Zamienia polskie litery i typograficzne znaki na zwykłe, żeby SMS
    był w alfabecie GSM (160 znaków na część zamiast 70). */
export function doGsm(s: string): string {
  const mapa: Record<string, string> = {
    ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
    Ą: "A", Ć: "C", Ę: "E", Ł: "L", Ń: "N", Ó: "O", Ś: "S", Ź: "Z", Ż: "Z",
    "„": '"', "”": '"', "“": '"', "’": "'", "–": "-", "—": "-", "·": "-", "…": "...", "\u00a0": " ",
  };
  return s.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”“’–—·…\u00a0]/g, (z) => mapa[z] ?? z);
}

/** SMS do klienta po zakupie: dane zamówienia, informacja, że potwierdzenie
    czeka w mailu, i kontakt w 24 h. */
export function smsDoKlienta(p: Produkt, numer: string, imie: string, kwota: string, email?: string): string {
  const tel = TELEFON.replace(/\s/g, "");
  const dzieki = imie ? `${imie}, dziękuję za zakup!` : "Dziękuję za zakup!";
  const cena = `${kwota}${p.cykliczny ? "/mies." : ""}`;
  const mail = email ? `Potwierdzenie wysłałem na ${email}` : "Potwierdzenie wysłałem mailem";
  const mailKrotko = email ? `Szczegóły w mailu (${email})` : "Szczegóły w mailu";

  if (p.rodzaj === "ebook") {
    return najkrotszaMieszczaca([
      `${dzieki} ${p.nazwa}, ${cena}, zam. ${numer}. ${mail}, jest w nim link do pobrania PDF. Sprawdź też Spam i Oferty. Pytania? Odpowiadam w 24 h: ${tel}, ${FIRMA.trener.email}`,
      `${dzieki} ${p.nazwa}, ${cena}, zam. ${numer}. ${mail}, jest w nim link do PDF (sprawdź też Spam). Pytania? Odpowiadam w 24 h: ${tel}`,
      `${dzieki} E-book, ${cena}, zam. ${numer}. ${mailKrotko}, link do PDF. Pytania: ${tel}`,
    ], LIMIT_SMS_2);
  }

  const link = linkDoAnkiety(numer);
  const ankieta = link ? ` Ankieta (3 min): ${link}` : " Link do ankiety jest w mailu.";

  return najkrotszaMieszczaca([
    `${dzieki} ${p.nazwa}, ${cena}, zam. ${numer}. ${mail} (sprawdź też Spam).${ankieta} W 24 h (dni robocze) zadzwonię z nr ${tel} albo napiszę SMS z terminami. Pytania: ${FIRMA.trener.email}`,
    `${dzieki} ${p.nazwa}, ${cena}, zam. ${numer}. ${mail} (sprawdź też Spam).${ankieta} W 24 h (dni robocze) zadzwonię z nr ${tel} albo napiszę SMS z terminami.`,
    `${dzieki} ${p.nazwa}, ${cena}, zam. ${numer}. ${mailKrotko}.${ankieta} W 24 h zadzwonię z nr ${tel} albo napiszę SMS.`,
    `Dziękuję za zakup (${numer}, ${cena}). ${mailKrotko}. W 24 h zadzwonię z nr ${tel} albo napiszę SMS.`,
  ], LIMIT_SMS_2);
}

/** SMS do Ciebie (SMS_TRENERA): przyszło zamówienie, pełne dane są na Gmailu. */
export function smsDoTrenera(p: Produkt, imieNazwisko: string, telefon: string, kwota: string, numer = "", email = ""): string {
  const tel = telefon || "brak tel.";
  const kto = imieNazwisko || "Klient";
  const doKiedy = p.telefon ? "Zadzwoń w 24 h." : "Sprawdź, czy wyszedł link do e-booka.";
  return najkrotszaMieszczaca([
    `Nowe zamówienie! Pełne dane czekają na Gmailu (${FIRMA.trener.email}). ${p.nazwa}, ${kwota}${p.cykliczny ? "/mies." : ""}, zam. ${numer}. Klient: ${kto}, tel. ${tel}${email ? `, ${email}` : ""}. ${doKiedy}`,
    `Nowe zamówienie, szczegóły na Gmailu. ${p.nazwa}, ${kwota}, zam. ${numer}. ${kto}, tel. ${tel}. ${doKiedy}`,
    `Zamówienie: ${p.nazwa}, ${kwota}. ${kto}, ${tel}. Szczegóły na Gmailu.`,
  ], LIMIT_SMS_2);
}

/** SMS po nieudanej płatności (Przelewy24 odrzucony przez bank). */
export function smsNieudana(p: Produkt | undefined): string {
  return najkrotszaMieszczaca([
    `Bank nie potwierdził płatności za: ${p?.nazwa ?? "zamówienie"}. Pieniądze nie zostały pobrane. Spróbuj jeszcze raz albo zadzwoń: ${TELEFON.replace(/\s/g, "")}`,
    `Płatność nie doszła, pieniądze nie zostały pobrane. Pytania: ${TELEFON.replace(/\s/g, "")}`,
  ]);
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