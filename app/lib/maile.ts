// PLIK: app/lib/maile.ts · MAILE · treść maili i SMS-ów (wygląd maila do klienta: szablon-potwierdzenia.ts)
import { TELEFON, type Produkt } from "./produkty";

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
  tytul: "Odezwę się w ciągu 24 godzin",
  opis: `W dni robocze, tak jak zaznaczysz w ankiecie. Dzwonię z numeru ${TELEFON}: zapisz go, żeby nie odrzucić połączenia. Jeśli nie odbierzesz, napiszę SMS-a.`,
};

const ZAMOWIENIE = (p: Produkt, numer: string, kwota: string) => [
  { etykieta: "Produkt", wartosc: p.nazwa },
  { etykieta: "Kwota", wartosc: `${kwota}${p.cykliczny ? " / miesiąc" : ""}` },
  { etykieta: "Numer zamówienia", wartosc: numer },
];

export function potwierdzenie(p: Produkt, numer: string, kwota: string, imie: string): Potwierdzenie {
  const dzieki = imie ? `Dzięki, ${imie}!` : "Dziękuję!";
  const zamowienie = ZAMOWIENIE(p, numer, kwota);

  switch (p.rodzaj) {
    case "stacjonarny":
      return {
        zajawka: "Płatność przyjęta. Pierwszy krok: ankieta, 3 minuty.",
        naglowek: `${dzieki} Do zobaczenia na sali.`,
        wstep: "Płatność przyjęta. Poniżej masz wszystko, co wydarzy się do pierwszego treningu.",
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokAnkieta(numer),
          KROK_TELEFON,
          {
            tytul: "Pierwsza sesja",
            opis: "Ustalimy termin, a potwierdzenie z adresem przyjdzie SMS-em i mailem.",
          },
        ],
        wskazowki: {
          tytul: "Gdzie i co zabrać",
          linie: [
            "Just GYM, ul. Piotrkowska 157A, Łódź (budynek HiPiotrkowska, przy Stajni Jednorożców).",
            "Wejście na salę masz w cenie.",
            "Strój, buty na zmianę, woda i ręcznik.",
          ],
        },
        gwarancje: [BRAK_TERMINU, ODSTAPIENIE],
      };

    case "online":
      return {
        zajawka: "Płatność przyjęta. Pierwszy krok: ankieta, 3 minuty.",
        naglowek: `${dzieki} Zaczynamy.`,
        wstep: "Płatność przyjęta. Poniżej masz wszystko, co wydarzy się do pierwszego treningu.",
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokAnkieta(numer),
          KROK_TELEFON,
          {
            tytul: "Pierwszy trening",
            opis: "Ustalimy termin, a link do rozmowy wideo przyjdzie SMS-em i mailem. Otwierasz go na telefonie.",
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
        wstep: "Płatność przyjęta. Dostęp jest bezterminowy i działa na telefonie.",
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          process.env.EBOOK_URL
            ? {
                tytul: "Otwórz e-booka",
                opis: "Zapisz ten mail albo dodaj link do zakładek. Dostęp się nie kończy.",
                przycisk: { etykieta: "Otwórz e-booka", url: process.env.EBOOK_URL },
              }
            : {
                tytul: "Link do e-booka",
                opis: "Wyślę go osobnym mailem w ciągu kilku minut. Sprawdź też Spam i Oferty.",
              },
        ],
        gwarancje: [
          "Jeśli w ciągu 30 dni przejdziesz na plan indywidualny albo prowadzenie, cenę e-booka odliczam w całości.",
        ],
      };

    case "plan":
      return {
        zajawka: "Płatność przyjęta. Pierwszy krok: ankieta, 3 minuty.",
        naglowek: `${dzieki} Rozpisuję Twój plan.`,
        wstep: "Płatność przyjęta. Tak wygląda droga do planu na 12 tygodni.",
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokAnkieta(numer),
          { ...KROK_TELEFON, opis: `${KROK_TELEFON.opis} Kilka minut rozmowy o ankiecie.` },
          {
            tytul: "Plan w ciągu 72 godzin",
            opis: "Plan na 12 tygodni z nagraniem omówienia, w którym tłumaczę, co i dlaczego.",
          },
        ],
        gwarancje: [ODSTAPIENIE],
      };

    case "prowadzenie": {
      const portal = process.env.CUSTOMER_PORTAL_URL;
      return {
        zajawka: "Płatność przyjęta. Pierwszy krok: ankieta, 3 minuty.",
        naglowek: `${dzieki} Od teraz jestem w Twoim narożniku.`,
        wstep: "Płatność przyjęta. Tak wygląda pierwszy tydzień prowadzenia.",
        zamowienie,
        kroki: [
          KROK_PLATNOSC,
          krokAnkieta(numer),
          { ...KROK_TELEFON, tytul: "Rozmowa diagnostyczna" },
          {
            tytul: "Plan na pierwszy miesiąc",
            opis: "Dostajesz go w ciągu 72 godzin od rozmowy. Potem co tydzień sprawdzamy postępy i poprawiamy plan.",
          },
        ],
        gwarancje: [
          "Płatność odnawia się automatycznie co miesiąc.",
          portal
            ? "Rezygnacja w każdej chwili, bez kar: logujesz się adresem e-mail z zakupu. Kolejne płatności stają od razu, a prowadzenie trwa do końca opłaconego miesiąca."
            : "Rezygnacja w każdej chwili, bez kar: odpisz na tego maila. Kolejne płatności stają od razu, a prowadzenie trwa do końca opłaconego miesiąca.",
          ODSTAPIENIE,
        ],
        ...(portal ? { linkDodatkowy: { etykieta: "Zarządzaj prowadzeniem", url: portal } } : {}),
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
export function mailDoKlienta(p: Produkt, numer: string, kwota: string, imie: string): string {
  const t = potwierdzenie(p, numer, kwota, imie);
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
  linie.push("", `Pytania: ${TELEFON} albo odpisz na tego maila.`, "Maks Treningi");
  return linie.join("\n");
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

/** Pierwsza wersja, która mieści się w jednym SMS-ie, albo najkrótsza. */
function najkrotszaMieszczaca(wersje: string[]): string {
  const czyste = wersje.map((w) => doGsm(w.replace(/\s+/g, " ").trim()));
  return czyste.find((w) => w.length <= LIMIT_SMS) ?? czyste.reduce((a, b) => (b.length < a.length ? b : a));
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

export function smsDoKlienta(p: Produkt, numer: string, imie: string): string {
  const tel = TELEFON.replace(/\s/g, "");

  if (p.rodzaj === "ebook") {
    return najkrotszaMieszczaca([
      `${imie ? `${imie}, dziękuję` : "Dziękuję"} za zakup e-booka (zam. ${numer}). Link do materiałów jest w mailu, sprawdź też Spam i Oferty. Pytania: ${tel}`,
      `Dziękuję za zakup e-booka (${numer}). Link jest w mailu, sprawdź też Spam. Pytania: ${tel}`,
    ]);
  }

  const link = linkDoAnkiety(numer);
  const ankieta = link ? `Ankieta (3 min): ${link}` : "Link do ankiety masz w mailu.";
  const ankietaKrotko = link ? `Ankieta: ${link}` : "Ankieta jest w mailu.";

  return najkrotszaMieszczaca([
    `${imie ? `${imie}, dziękuję` : "Dziękuję"} za zakup: ${p.nazwa} (zam. ${numer}). ${ankieta} Odezwę się w 24 h w dni robocze z nr ${tel}.`,
    `${imie ? `${imie}, dziękuję` : "Dziękuję"} za zakup (zam. ${numer}). ${ankieta} Odezwę się w 24 h w dni robocze z nr ${tel}.`,
    `Dziękuję za zakup (${numer}). ${ankietaKrotko} Odezwę się w 24 h (dni robocze) z nr ${tel}.`,
    `Dziękuję za zakup (${numer}). ${ankietaKrotko} Odezwę się w 24 h z nr ${tel}.`,
  ]);
}

export function smsDoTrenera(p: Produkt, imieNazwisko: string, telefon: string, kwota: string): string {
  const tel = telefon || "brak tel.";
  return najkrotszaMieszczaca([
    `Nowe zamówienie: ${p.nazwa}, ${kwota}. ${imieNazwisko || "Klient"}, tel. ${tel}. Zadzwoń w 24 h. Szczegóły w mailu.`,
    `Zamówienie: ${p.nazwa}, ${kwota}. ${imieNazwisko || "Klient"}, ${tel}.`,
  ]);
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