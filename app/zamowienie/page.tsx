import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/app/components/sections";

/* ═══════════════════════════════════════════════════════════════════════
   /zamowienie?produkt=<id> · CAŁA KASA W JEDNYM PLIKU

   Tu prowadzi każdy przycisk „Kup…” na trzech stronach. Bez parametru
   albo z nieznanym `produkt` strona pokazuje pakiet 3 sesji na sali
   (stała DOMYSLNY).

   Strona tłumaczy, jak wygląda proces, zbiera dane i ankietę
   i wysyła do płatności.
   Po płatności kupujący ląduje na /dziekujemy (drugi plik).

   Co jest w tym pliku, od góry:
   1. PRODUKTY: ceny, proces, pytania ankiety. Tu zmieniasz treść.
   2. zamow(): akcja serwera, która sprawdza formularz, wysyła Ci maila
      z zamówieniem i przekierowuje do płatności.
   3. Strona: proces, formularz, podsumowanie z przyciskiem.
   4. CSS na dole pliku.

   ⚠ PŁATNOŚCI. Każdy produkt ma pole `platnosc`: link do płatności
   z panelu operatora (Przelewy24, PayU, tpay i Stripe dają takie linki).
   W panelu operatora ustaw adres powrotu na
   /dziekujemy?produkt=<id tego produktu>.
   Dopóki `platnosc` jest pusty:
   · lokalnie (npm run dev) formularz przechodzi od razu na /dziekujemy
     z dopiskiem demo, żebyś mógł przeklikać cały proces,
   · na produkcji (także preview na Vercelu) kupujący widzi komunikat,
     że płatności są chwilowo niedostępne. Inaczej ludzie dostawaliby
     „dziękuję” bez zapłaty.

   ⚠ MAIL Z ZAMÓWIENIEM. Dane z formularza przychodzą do Ciebie mailem
   przez Resend (resend.com, darmowy próg wystarcza). W zmiennych
   środowiskowych ustaw RESEND_API_KEY i ZAMOWIENIA_EMAIL (Twój adres).
   Bez nich zamówienie ląduje tylko w logach serwera.

   ⚠ Zgoda na rozpoczęcie usługi przed upływem 14 dni i regulamin:
   brzmienie sprawdź z prawnikiem. Strony /regulamin
   i /polityka-prywatnosci trzeba utworzyć.

   ⚠ KONTAKT PO ZAKUPIE: telefon w ciągu 24 h w dni robocze przy każdym
   produkcie poza e-bookiem (tam nie zbieramy numeru). Ta sama obietnica
   stoi w procesach niżej i na /dziekujemy. Strony z ofertą mówią
   jeszcze o SMS-ie z terminami: ujednolić.

   ⚠ Copy nie używa myślników pauzowych, tak jak strona online.
   ═══════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: "Zamówienie · Maks Treningi",
  robots: { index: false, follow: false },
};

const TELEFON = "537 483 233";
const TELEFON_HREF = "tel:+48537483233";

/* ─────────────────────────────────────────────────────── 1 · PRODUKTY */

type Rodzaj = "stacjonarny" | "online" | "ebook" | "plan" | "prowadzenie";

type Pole = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "date";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
};

type Krok = { kiedy: string; co: string; opis: string };

type Produkt = {
  nazwa: string;
  rodzaj: Rodzaj;
  cena: number;
  cyklicznie?: boolean;
  opis: string;
  zawiera: string[];
  gwarancja?: string;
  proces: Krok[];
  ankieta: Pole[];
  strona: { href: string; nazwa: string };
  /** Link do płatności od operatora. Pusty = płatności niepodpięte. */
  platnosc: string;
};

const STAZ: Pole = {
  name: "staz",
  label: "Jak długo trenujesz?",
  type: "select",
  required: true,
  options: ["Dopiero zaczynam", "Do roku", "Od roku do trzech lat", "Ponad trzy lata"],
};

const KONTUZJE: Pole = {
  name: "kontuzje",
  label: "Kontuzje, bóle, ograniczenia",
  type: "textarea",
  placeholder: "Na przykład: kolano po skręceniu w 2024, siedząca praca, ból lędźwi przy martwym ciągu",
  hint: "Zostaw puste, jeśli nic Ci nie dolega. Plan układam wokół tego, co tu wpiszesz.",
};

const ANKIETA_STACJONARNA: Pole[] = [
  STAZ,
  KONTUZJE,
  {
    name: "godziny",
    label: "Jakie godziny Ci pasują?",
    type: "textarea",
    required: true,
    placeholder: "Na przykład: poniedziałki i środy po 17",
    hint: "Prowadzę sesje od poniedziałku do piątku, po południu i wieczorami.",
  },
  { name: "cel", label: "Na czym Ci najbardziej zależy?", type: "textarea", placeholder: "Jednym, dwoma zdaniami" },
];

const ANKIETA_ONLINE: Pole[] = [
  {
    name: "gdzie",
    label: "Gdzie trenujesz?",
    type: "select",
    required: true,
    options: ["W domu", "Just GYM", "Zdrofit", "CityFit", "McFit", "Inna siłownia"],
  },
  {
    name: "klub",
    label: "Inna siłownia: nazwa i miasto",
    type: "text",
    placeholder: "Na przykład: Fitness Park, Kraków",
    hint: "Tylko przy „Inna siłownia”. Przeczytam regulamin klubu przed pierwszą sesją.",
  },
  {
    name: "sprzet",
    label: "Jaki masz sprzęt?",
    type: "textarea",
    placeholder: "Na przykład: pełna siłownia albo mata, gumy i dwa hantle",
  },
  STAZ,
  KONTUZJE,
  {
    name: "godziny",
    label: "Jakie godziny Ci pasują?",
    type: "textarea",
    required: true,
    placeholder: "Na przykład: wtorki i czwartki po 18",
  },
];

const ANKIETA_PLANU: Pole[] = [
  {
    name: "dni",
    label: "Ile dni w tygodniu realnie trenujesz?",
    type: "select",
    required: true,
    options: ["2", "3", "4", "5"],
    hint: "Tyle, ile utrzymasz w zwykłym tygodniu, nie w idealnym.",
  },
  {
    name: "dlugosc",
    label: "Ile trwa jeden trening?",
    type: "select",
    required: true,
    options: ["30 minut", "45 minut", "60 minut", "90 minut"],
  },
  {
    name: "miejsce",
    label: "Gdzie trenujesz?",
    type: "select",
    required: true,
    options: ["Siłownia", "Dom z minimalnym sprzętem", "Jedno i drugie"],
  },
  {
    name: "sprzet",
    label: "Jaki masz sprzęt?",
    type: "textarea",
    placeholder: "Na przykład: pełna siłownia albo dwa hantle po 10 kg i guma",
  },
  STAZ,
  KONTUZJE,
  {
    name: "pora",
    label: "O której zwykle trenujesz?",
    type: "select",
    required: true,
    options: ["Rano", "W ciągu dnia", "Wieczorem", "Różnie"],
  },
  {
    name: "odpadasz",
    label: "W którym momencie wcześniej odpadałaś albo odpadałeś?",
    type: "textarea",
    required: true,
    placeholder: "Na przykład: w trzecim tygodniu, kiedy przyszedł wyjazd służbowy",
    hint: "Od tej odpowiedzi zależy najwięcej. Plan ma przetrwać dokładnie ten moment.",
  },
  {
    name: "data",
    label: "Masz datę w kalendarzu?",
    type: "date",
    hint: "Wesele, wakacje, zawody. Plan liczę wstecz od niej. Możesz zostawić puste.",
  },
];

const PLATNOSC: Krok = {
  kiedy: "Zaraz potem",
  co: "Płatność",
  opis: "BLIK, karta albo Google Pay na stronie operatora płatności. Potwierdzenie przychodzi mailem od razu.",
};

const PROCES_STACJONARNY: Krok[] = [
  {
    kiedy: "Teraz, 3 minuty",
    co: "Dane i krótka ankieta",
    opis: "Kontuzje, staż i godziny, które Ci pasują. Na tej podstawie proponuję termin.",
  },
  PLATNOSC,
  {
    kiedy: "W ciągu 24 h w dni robocze",
    co: "Telefon ode mnie",
    opis: `Dzwonię z numeru ${TELEFON}. Ustalamy termin pierwszej sesji, a dojście dostajesz SMS-em.`,
  },
  {
    kiedy: "Na sali, 60 minut",
    co: "Pierwsza sesja",
    opis: "Just GYM, Piotrkowska 157A, przy Stajni Jednorożców. Wejście na salę w cenie. Po sesji dostajesz kartę obciążeń.",
  },
];

const PROCES_ONLINE: Krok[] = [
  {
    kiedy: "Teraz, 3 minuty",
    co: "Dane i krótka ankieta",
    opis: "Gdzie trenujesz, jaki masz sprzęt i jakie godziny Ci pasują. Jeśli to siłownia spoza listy, czytam jej regulamin przed pierwszą sesją.",
  },
  PLATNOSC,
  {
    kiedy: "W ciągu 24 h w dni robocze",
    co: "Telefon ode mnie",
    opis: `Dzwonię z numeru ${TELEFON}. Ustalamy termin, a link do rozmowy wideo dostajesz SMS-em. Nic nie instalujesz poza tym, co wskażę.`,
  },
  {
    kiedy: "Trening, 60 minut",
    co: "Sesja przez kamerę",
    opis: "Telefon z boku, Ty robisz swoje serie, ja poprawiam w trakcie. Tego samego dnia dostajesz notatkę i nagrania.",
  },
];

const STACJONARNY = { href: "/trening-stacjonarny", nazwa: "Trening personalny w Łodzi" };
const ONLINE = { href: "/coaching-online", nazwa: "Trening online przez kamerę" };
const PLANY = { href: "/produkty", nazwa: "Plany treningowe" };

const G_STAC = "+20 kg w martwym ciągu po trzech sesjach albo kolejne prowadzę na swój koszt, aż będzie.";
const G_ONL = "+20 kg w martwym ciągu po trzech treningach albo kolejne prowadzę na swój koszt, aż będzie.";

const PRODUKTY: Record<string, Produkt> = {
  "stacjonarny-1": {
    nazwa: "Pojedyncza sesja",
    rodzaj: "stacjonarny",
    cena: 150,
    opis: "60 minut jeden na jeden w Just GYM przy Piotrkowskiej.",
    zawiera: [
      "Korekta techniki na żywo, w trakcie serii",
      "Zapis obciążeń i notatka po treningu",
      "Wejście na salę bez osobnego karnetu",
    ],
    proces: PROCES_STACJONARNY,
    ankieta: ANKIETA_STACJONARNA,
    strona: STACJONARNY,
    platnosc: "",
  },
  "stacjonarny-3": {
    nazwa: "Pakiet 3 sesji",
    rodzaj: "stacjonarny",
    cena: 420,
    opis: "Trzy sesje po 60 minut, 140 zł za sesję, bez daty ważności.",
    zawiera: [
      "Przysiad, martwy ciąg i wyciskanie ustawione do końca",
      "Plan na dni bez sesji i karta obciążeń",
      "Kontakt na wiadomości między treningami",
    ],
    gwarancja: G_STAC,
    proces: PROCES_STACJONARNY,
    ankieta: ANKIETA_STACJONARNA,
    strona: STACJONARNY,
    platnosc: "",
  },
  "stacjonarny-5": {
    nazwa: "Pakiet 5 sesji",
    rodzaj: "stacjonarny",
    cena: 650,
    opis: "Pięć sesji po 60 minut, 130 zł za sesję, bez daty ważności.",
    zawiera: [
      "Wszystko z pakietu trzech",
      "Praca wokół ograniczenia: plecy, kolano, bark",
      "Plan na osiem tygodni po ostatniej sesji",
    ],
    gwarancja: G_STAC,
    proces: PROCES_STACJONARNY,
    ankieta: ANKIETA_STACJONARNA,
    strona: STACJONARNY,
    platnosc: "",
  },
  "online-1": {
    nazwa: "Pojedynczy trening online",
    rodzaj: "online",
    cena: 100,
    opis: "60 minut 1:1 przez kamerę, w domu albo na Twojej siłowni.",
    zawiera: [
      "Korekta techniki w trakcie serii",
      "Kryterium, kiedy dokładać ciężar",
      "Notatka i nagrania tego samego dnia",
    ],
    proces: PROCES_ONLINE,
    ankieta: ANKIETA_ONLINE,
    strona: ONLINE,
    platnosc: "",
  },
  "online-3": {
    nazwa: "Pakiet 3 treningów online",
    rodzaj: "online",
    cena: 260,
    opis: "Trzy treningi przez kamerę, 87 zł za trening, ważność 8 tygodni.",
    zawiera: [
      "Plan trzech sesji: co poprawiamy i w jakiej kolejności",
      "Zadanie między sesjami",
      "Kontakt na wiadomości między treningami",
    ],
    gwarancja: G_ONL,
    proces: PROCES_ONLINE,
    ankieta: ANKIETA_ONLINE,
    strona: ONLINE,
    platnosc: "",
  },
  "online-5": {
    nazwa: "Pakiet 5 treningów online",
    rodzaj: "online",
    cena: 400,
    opis: "Pięć treningów przez kamerę, 80 zł za trening, ważność 12 tygodni.",
    zawiera: [
      "Wszystko z pakietu trzech",
      "Rozpisany tydzień między sesjami",
      "Plan na osiem tygodni po ostatniej sesji",
    ],
    gwarancja: G_ONL,
    proces: PROCES_ONLINE,
    ankieta: ANKIETA_ONLINE,
    strona: ONLINE,
    platnosc: "",
  },
  ebook: {
    nazwa: "E-book",
    rodzaj: "ebook",
    cena: 99,
    opis: "Zasady, według których układam plany. Dostęp od razu.",
    zawiera: [
      "Jak zbudować tydzień pod liczbę dni, którą masz",
      "Kryterium progresji i protokół tygodnia, który się nie udał",
      "Arkusz progresji do wypełniania",
    ],
    proces: [
      { kiedy: "Teraz, minuta", co: "Imię i e-mail", opis: "Na ten adres wysyłam link do panelu. Bez ankiety." },
      PLATNOSC,
      {
        kiedy: "Od razu po płatności",
        co: "Link do panelu",
        opis: "E-book, wideo do ćwiczeń i arkusz progresji. Dostęp bezterminowy, działa na telefonie.",
      },
    ],
    ankieta: [],
    strona: PLANY,
    platnosc: "",
  },
  plan: {
    nazwa: "Indywidualny plan",
    rodzaj: "plan",
    cena: 249,
    opis: "Plan na 12 tygodni napisany po Twojej ankiecie. Gotowy w 72 h.",
    zawiera: [
      "Plan pod Twoje dni, sprzęt i ograniczenia",
      "Nagranie: dlaczego Twój plan wygląda właśnie tak",
      "Wersja awaryjna każdego treningu na 25 minut",
    ],
    gwarancja: "+20 kg w martwym ciągu w 12 tygodni albo drugi cykl piszę bez opłaty.",
    proces: [
      {
        kiedy: "Teraz, 8 minut",
        co: "Ankieta",
        opis: "Dni, sprzęt, staż, kontuzje i moment, w którym wcześniej odpadasz. Od niej zależy, jak wygląda plan.",
      },
      PLATNOSC,
      {
        kiedy: "W ciągu 24 h w dni robocze",
        co: "Telefon ode mnie",
        opis: `Dzwonię z numeru ${TELEFON}. Kilka minut rozmowy o tym, co napisałaś albo napisałeś w ankiecie.`,
      },
      {
        kiedy: "Do 72 godzin",
        co: "Plan w panelu",
        opis: "Plan na 12 tygodni, wideo do ćwiczeń i pięciominutowe nagranie, w którym tłumaczę każdą decyzję.",
      },
      {
        kiedy: "Przez 12 tygodni",
        co: "Arkusz progresji",
        opis: "Wpisujesz ciężary po każdym treningu. Arkusz pokazuje, czy idziesz do przodu.",
      },
    ],
    ankieta: ANKIETA_PLANU,
    strona: PLANY,
    platnosc: "",
  },
  prowadzenie: {
    nazwa: "Prowadzenie",
    rodzaj: "prowadzenie",
    cena: 349,
    cyklicznie: true,
    opis: "Plan indywidualny i cotygodniowa korekta. Rozliczenie miesiąc do miesiąca.",
    zawiera: [
      "Check-in co 7 dni z moją odpowiedzią",
      "Trzy rozmowy w miesiącu i analiza techniki z nagrań",
      "Korekta planu w trakcie miesiąca",
    ],
    gwarancja: "+20 kg w martwym ciągu w 3 miesiące albo kolejny miesiąc na mój koszt.",
    proces: [
      {
        kiedy: "Teraz, 8 minut",
        co: "Ankieta",
        opis: "Ta sama co przy planie indywidualnym. Od niej zaczyna się plan i pierwsza rozmowa.",
      },
      {
        kiedy: "Zaraz potem",
        co: "Płatność cykliczna",
        opis: "Pierwszy miesiąc płacisz teraz, kolejne pobierają się automatycznie. Rezygnujesz z końcem opłaconego miesiąca, bez kar.",
      },
      {
        kiedy: "W ciągu 24 h w dni robocze",
        co: "Telefon ode mnie",
        opis: `Dzwonię z numeru ${TELEFON}. Ustalamy termin rozmowy diagnostycznej i dopytuję o ankietę.`,
      },
      {
        kiedy: "Do 72 godzin",
        co: "Plan w panelu",
        opis: "Plan na pierwszy miesiąc, wideo do ćwiczeń i nagranie z omówieniem.",
      },
      {
        kiedy: "Co 7 dni",
        co: "Check-in i korekta",
        opis: "Wysyłasz krótki raport, ja odpisuję i poprawiam plan w trakcie, nie na koniec miesiąca.",
      },
    ],
    ankieta: ANKIETA_PLANU,
    strona: PLANY,
    platnosc: "",
  },
};

/** Produkt, który pokazujemy, gdy link nie wskazuje żadnego albo
    wskazuje nieistniejący: /zamowienie bez parametru to pakiet 3 sesji
    na sali. */
const DOMYSLNY = "stacjonarny-3";

const znajdz = (id?: string) =>
  id && Object.prototype.hasOwnProperty.call(PRODUKTY, id) ? PRODUKTY[id] : undefined;

const zl = (kwota: number) => `${kwota.toLocaleString("pl-PL")} zł`;

function polaKontaktu(rodzaj: Rodzaj): Pole[] {
  const imie: Pole = { name: "imie", label: "Imię", type: "text", required: true };
  const email: Pole = {
    name: "email",
    label: "E-mail",
    type: "email",
    required: true,
    hint: rodzaj === "ebook" ? "Na ten adres przyjdzie link do e-booka." : "Na ten adres przyjdzie potwierdzenie.",
  };
  if (rodzaj === "ebook") return [imie, email];
  return [
    imie,
    email,
    {
      name: "telefon",
      label: "Telefon",
      type: "tel",
      required: true,
      placeholder: "np. 600 100 200",
      hint: "Na ten numer dzwonię w ciągu 24 h w dni robocze. Tylko w sprawie terminów i planu.",
    },
  ];
}

function zgodaNaStart(rodzaj: Rodzaj) {
  return rodzaj === "ebook"
    ? "Chcę dostać e-book od razu. Wiem, że po jego dostarczeniu tracę prawo odstąpienia od umowy."
    : "Chcę, żeby usługa zaczęła się przed upływem 14 dni od zakupu. Wiem, że po jej pełnym wykonaniu tracę prawo odstąpienia od umowy, a jeśli odstąpię wcześniej, płacę za część już wykonaną.";
}

/* ─────────────────────────────────────────────────────── 2 · AKCJA */

async function zamow(formData: FormData) {
  "use server";

  const t = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const id = znajdz(t("produkt")) ? t("produkt") : DOMYSLNY;
  const produkt = PRODUKTY[id];

  const wroc = (blad: string) =>
    redirect(`/zamowienie?produkt=${id}&blad=${encodeURIComponent(blad)}#platnosc`);

  // Pole-pułapka wypełnione: bot. Udajemy sukces, niczego nie wysyłamy.
  if (t("www")) redirect(`/dziekujemy?produkt=${id}`);

  const brak = [...polaKontaktu(produkt.rodzaj), ...produkt.ankieta]
    .filter((p) => p.required && !t(p.name))
    .map((p) => p.label);
  if (brak.length) wroc(`Uzupełnij: ${brak.join(", ")}.`);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t("email"))) wroc("Adres e-mail wygląda na niepełny.");
  if (produkt.rodzaj !== "ebook" && t("telefon").replace(/\D/g, "").length < 9)
    wroc("Numer telefonu ma mniej niż 9 cyfr.");
  if (t("zgodaRegulamin") !== "tak" || t("zgodaStart") !== "tak") wroc("Zaznacz obie wymagane zgody.");
  if (produkt.cyklicznie && t("zgodaCykliczna") !== "tak") wroc("Zaznacz zgodę na płatność co miesiąc.");
  if (t("nip") && t("nip").replace(/\D/g, "").length !== 10) wroc("NIP ma mieć 10 cyfr.");

  if (!produkt.platnosc && process.env.NODE_ENV === "production") {
    wroc(`Płatności online są chwilowo niedostępne. Zadzwoń: ${TELEFON}, zapiszę Cię ręcznie.`);
  }

  const numer = `MT-${Date.now().toString(36).toUpperCase()}`;

  // Mail z zamówieniem do Ciebie. Wszystkie pola formularza, po kolei.
  const wiersze: string[] = [`Zamówienie ${numer}`, `Produkt: ${produkt.nazwa} (${zl(produkt.cena)})`, ""];
  formData.forEach((v, k) => {
    if (typeof v === "string" && v.trim() && !k.startsWith("$") && k !== "www" && k !== "produkt") {
      wiersze.push(`${k}: ${v.trim()}`);
    }
  });
  const tresc = wiersze.join("\n");

  if (process.env.RESEND_API_KEY && process.env.ZAMOWIENIA_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.ZAMOWIENIA_OD ?? "Zamówienia <onboarding@resend.dev>",
          to: process.env.ZAMOWIENIA_EMAIL,
          reply_to: t("email"),
          subject: `${numer} · ${produkt.nazwa} · ${t("imie")}`,
          text: tresc,
        }),
      });
    } catch (e) {
      console.error("[zamówienie] mail nie wyszedł", numer, e);
    }
  } else {
    console.info("[zamówienie]\n" + tresc);
  }

  if (produkt.platnosc) redirect(produkt.platnosc);
  redirect(`/dziekujemy?produkt=${id}&zamowienie=${numer}&demo=1`);
}

/* ─────────────────────────────────────────────────────── 3 · STRONA */

type SP = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const zLinku = typeof sp.produkt === "string" ? sp.produkt : undefined;
  const id = znajdz(zLinku) ? (zLinku as string) : DOMYSLNY;
  const produkt = PRODUKTY[id];
  const blad = typeof sp.blad === "string" ? sp.blad : undefined;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="zm">
        <Gora wstecz={produkt.strona} />
        <main className="zm-wnetrze">
          <Kasa id={id} produkt={produkt} blad={blad} />
        </main>
      </div>
      <Footer />
    </>
  );
}

function Gora({ wstecz }: { wstecz?: { href: string; nazwa: string } }) {
  const etapy = ["Dane i ankieta", "Płatność", "Gotowe"];
  return (
    <header className="zm-gora">
      <div className="zm-gora-wnetrze">
        <span className="zm-marka">Maks Treningi</span>
        {wstecz && (
          <Link href={wstecz.href} className="zm-wstecz">
            Wróć do strony: {wstecz.nazwa}
          </Link>
        )}
      </div>
      <ol className="zm-postep" aria-label="Etapy zamówienia">
        {etapy.map((e, i) => (
          <li key={e} className={i === 0 ? "zm-etap zm-etap-aktywny" : "zm-etap"} aria-current={i === 0 ? "step" : undefined}>
            {e}
          </li>
        ))}
      </ol>
    </header>
  );
}

function Kasa({ id, produkt, blad }: { id: string; produkt: Produkt; blad?: string }) {
  const cena = zl(produkt.cena);
  return (
    <>
      <div className="zm-naglowek">
        <h1>{produkt.nazwa}</h1>
        <p>
          {produkt.rodzaj === "ebook"
            ? "Podajesz imię i e-mail, płacisz, a link do e-booka przychodzi od razu."
            : "Wypełniasz krótką ankietę, płacisz i od tej chwili resztę biorę na siebie. Niżej masz cały proces krok po kroku."}
        </p>
      </div>

      <form action={zamow} className="zm-uklad">
        <input type="hidden" name="produkt" value={id} />

        <div>
          <section className="zm-blok" aria-labelledby="proces">
            <h2 id="proces">Jak to przebiega</h2>
            <p className="zm-podtytul">Od tej strony do pierwszego efektu. Jesteś w kroku pierwszym.</p>
            <ol className="zm-os">
              {produkt.proces.map((k, i) => (
                <li key={k.co} className={i === 0 ? "zm-krok zm-krok-teraz" : "zm-krok"}>
                  <span className="zm-kiedy">{k.kiedy}</span>
                  <span className="zm-co">{k.co}</span>
                  <p className="zm-opis">{k.opis}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="zm-blok" aria-labelledby="dane">
            <h2 id="dane">{produkt.ankieta.length ? "Twoje dane i ankieta" : "Twoje dane"}</h2>
            <p className="zm-podtytul">
              {produkt.ankieta.length
                ? "Pola z dopiskiem „wymagane” są potrzebne, żeby ruszyć. Resztę możesz dopisać później w wiadomości."
                : "Tylko tyle, żeby wysłać Ci link."}
            </p>

            <div className="zm-pola zm-pola-dwa">
              {polaKontaktu(produkt.rodzaj).map((p) => (
                <PoleFormularza key={p.name} pole={p} />
              ))}
            </div>

            {produkt.ankieta.length > 0 && (
              <>
                <hr className="zm-oddzielnik" />
                <h3 className="zm-ankieta">Ankieta</h3>
                <div className="zm-pola">
                  {produkt.ankieta.map((p) => (
                    <PoleFormularza key={p.name} pole={p} />
                  ))}
                </div>
              </>
            )}

            <hr className="zm-oddzielnik" />

            <details className="zm-faktura">
              <summary>Chcę fakturę na firmę</summary>
              <div className="zm-pola zm-pola-dwa">
                <PoleFormularza pole={{ name: "firma", label: "Nazwa firmy", type: "text" }} />
                <PoleFormularza pole={{ name: "nip", label: "NIP", type: "text", placeholder: "10 cyfr" }} />
                <PoleFormularza pole={{ name: "adres", label: "Adres firmy", type: "text" }} />
              </div>
            </details>

            {/* Pole-pułapka na boty. Człowiek go nie widzi. */}
            <div className="zm-ukryte" aria-hidden="true">
              <label>
                Strona www
                <input type="text" name="www" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
          </section>
        </div>

        <aside className="zm-boczna" id="platnosc">
          <section className="zm-podsumowanie" aria-labelledby="platnosc-tytul">
            <h2 id="platnosc-tytul">Płatność</h2>
            <p className="zm-nazwa">{produkt.nazwa}</p>
            <p className="zm-opis-produktu">{produkt.opis}</p>
            <ul className="zm-lista">
              {produkt.zawiera.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>

            {produkt.gwarancja && (
              <p className="zm-gwarancja">
                <strong>Gwarancja wyniku</strong>
                {produkt.gwarancja}
              </p>
            )}

            <div className="zm-suma">
              <span>Do zapłaty</span>
              <span className="zm-kwota">{cena}</span>
            </div>
            <p className="zm-okres">
              {produkt.cyklicznie ? "miesięcznie, rezygnujesz z końcem opłaconego miesiąca" : "jednorazowo, cena brutto"}
            </p>

            <fieldset className="zm-zgody">
              <legend className="zm-ukryte">Zgody</legend>
              <label className="zm-zgoda">
                <input type="checkbox" name="zgodaRegulamin" value="tak" required />
                <span>
                  Akceptuję <a href="/regulamin" target="_blank" rel="noreferrer">regulamin</a> i{" "}
                  <a href="/polityka-prywatnosci" target="_blank" rel="noreferrer">politykę prywatności</a>.{" "}
                  <span className="zm-wymagane">(wymagane)</span>
                </span>
              </label>
              <label className="zm-zgoda">
                <input type="checkbox" name="zgodaStart" value="tak" required />
                <span>
                  {zgodaNaStart(produkt.rodzaj)} <span className="zm-wymagane">(wymagane)</span>
                </span>
              </label>
              {produkt.cyklicznie && (
                <label className="zm-zgoda">
                  <input type="checkbox" name="zgodaCykliczna" value="tak" required />
                  <span>
                    Zgadzam się na automatyczne pobieranie {cena} co miesiąc do czasu rezygnacji.{" "}
                    <span className="zm-wymagane">(wymagane)</span>
                  </span>
                </label>
              )}
            </fieldset>

            <p className="zm-metody">
              Na następnym ekranie wybierasz sposób płatności: BLIK, karta, Google Pay albo Apple Pay.
            </p>

            {blad && (
              <p className="zm-blad" role="alert">
                {blad}
              </p>
            )}

            <button type="submit" className="zm-przycisk">
              Zapłać {cena}
            </button>
            <p className="zm-pod-przyciskiem">
              Przechodzisz na stronę operatora płatności. Po zapłacie wracasz tutaj i widzisz potwierdzenie.
            </p>
          </section>
          <p className="zm-kontakt">
            Pytanie przed zakupem? Zadzwoń: <a href={TELEFON_HREF}>{TELEFON}</a>
          </p>
        </aside>
      </form>
    </>
  );
}

function PoleFormularza({ pole }: { pole: Pole }) {
  const id = `pole-${pole.name}`;
  const opisId = pole.hint ? `${id}-opis` : undefined;
  const wspolne = { id, name: pole.name, required: pole.required, className: "zm-wejscie", "aria-describedby": opisId };

  let kontrolka;
  if (pole.type === "textarea") {
    kontrolka = <textarea {...wspolne} placeholder={pole.placeholder} rows={3} />;
  } else if (pole.type === "select") {
    kontrolka = (
      <select {...wspolne} defaultValue="">
        <option value="" disabled>
          Wybierz
        </option>
        {pole.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else {
    const auto: Record<string, string> = { imie: "given-name", email: "email", telefon: "tel" };
    kontrolka = (
      <input
        {...wspolne}
        type={pole.type}
        placeholder={pole.placeholder}
        autoComplete={auto[pole.name]}
        inputMode={pole.type === "tel" ? "tel" : undefined}
      />
    );
  }

  return (
    <div className="zm-pole">
      <label htmlFor={id} className="zm-etykieta">
        {pole.label} {pole.required && <span className="zm-wymagane">(wymagane)</span>}
      </label>
      {kontrolka}
      {pole.hint && (
        <p id={opisId} className="zm-podpowiedz">
          {pole.hint}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────── 4 · CSS
   Kolory z makiet w zdjecia.ts: grafit #14181D, limonka #D2F34C,
   mgła #EDEFF2. Krój dziedziczony z layoutu. Klasy z prefiksem zm-,
   żeby nie zderzyły się z resztą serwisu. Ten sam CSS stoi w
   app/dziekujemy/page.tsx: zmieniasz tu, zmień też tam. */

const CSS = `
.zm{--grafit:#14181d;--limonka:#d2f34c;--mgla:#edeff2;--szary:#5f6672;--linia:#d6dae0;--blad:#b42318;--bialy:#fff;background:var(--mgla);color:var(--grafit);font-family:inherit;min-height:100vh}
.zm *{box-sizing:border-box}
.zm-gora{background:var(--grafit);color:var(--bialy)}
.zm-gora-wnetrze{max-width:1120px;margin:0 auto;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.zm-marka{font-weight:700;font-size:1.05rem}
.zm-wstecz{color:#c9ced6;font-size:.9rem;text-decoration:underline;text-underline-offset:3px}
.zm-wstecz:hover{color:var(--bialy)}
.zm-postep{max-width:1120px;margin:0 auto;padding:0 24px 22px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;list-style:none}
.zm-etap{border-top:3px solid #3a414b;padding-top:10px;font-size:.85rem;color:#9aa1ac}
.zm-etap-aktywny{border-top-color:var(--limonka);color:var(--bialy);font-weight:600}
.zm-etap-zrobiony{border-top-color:var(--limonka);color:#c9ced6}
.zm-wnetrze{max-width:1120px;margin:0 auto;padding:40px 24px 72px}
.zm-naglowek{max-width:44rem;margin-bottom:32px}
.zm-naglowek h1{font-size:clamp(1.75rem,1.2rem + 2.2vw,2.6rem);line-height:1.12;letter-spacing:-.01em;margin:0 0 12px}
.zm-naglowek p{font-size:1.05rem;line-height:1.55;color:var(--szary);margin:0}
.zm-uklad{display:grid;gap:32px}
@media (min-width:960px){.zm-uklad{grid-template-columns:minmax(0,1.618fr) minmax(0,1fr);align-items:start;gap:40px}.zm-boczna{position:sticky;top:24px}}
.zm-blok{background:var(--bialy);border-radius:14px;padding:28px 24px}
.zm-blok+.zm-blok{margin-top:20px}
@media (min-width:640px){.zm-blok{padding:32px}}
.zm-blok h2{font-size:1.3rem;line-height:1.25;margin:0 0 6px}
.zm-podtytul{color:var(--szary);line-height:1.5;margin:0 0 24px;max-width:38rem}
.zm-os{list-style:none;margin:0;padding:0;counter-reset:krok}
.zm-krok{position:relative;padding:0 0 22px 40px;counter-increment:krok}
.zm-krok:last-child{padding-bottom:0}
.zm-krok::before{content:counter(krok);position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:var(--grafit);color:var(--limonka);font-size:.8rem;font-weight:700;display:grid;place-items:center}
.zm-krok::after{content:"";position:absolute;left:12px;top:30px;bottom:4px;width:2px;background:var(--linia)}
.zm-krok:last-child::after{display:none}
.zm-krok-teraz::before{background:var(--limonka);color:var(--grafit)}
.zm-kiedy{display:block;font-weight:700;font-size:.95rem;margin-bottom:2px}
.zm-co{display:block;font-size:.95rem;margin-bottom:4px}
.zm-opis{margin:0;color:var(--szary);font-size:.93rem;line-height:1.5;max-width:36rem}
.zm-pola{display:grid;gap:18px}
@media (min-width:640px){.zm-pola-dwa{grid-template-columns:repeat(2,minmax(0,1fr))}}
.zm-pole{display:grid;gap:6px;align-content:start;min-width:0}
.zm-etykieta{font-weight:600;font-size:.95rem}
.zm-wymagane{color:var(--szary);font-weight:400}
.zm-wejscie{font:inherit;font-size:1rem;color:var(--grafit);background:var(--bialy);border:1.5px solid var(--linia);border-radius:10px;padding:12px 14px;width:100%}
textarea.zm-wejscie{min-height:88px;resize:vertical;line-height:1.45}
.zm-wejscie:hover{border-color:#b6bcc5}
.zm-wejscie:focus-visible{outline:3px solid var(--limonka);outline-offset:1px;border-color:var(--grafit)}
.zm-podpowiedz{font-size:.85rem;color:var(--szary);line-height:1.45;margin:0}
.zm-oddzielnik{border:0;border-top:1px solid var(--linia);margin:26px 0}
.zm-ankieta{font-size:1.05rem;margin:0 0 14px}
.zm-faktura summary{cursor:pointer;font-weight:600;font-size:.95rem;margin-bottom:0}
.zm-faktura[open] summary{margin-bottom:18px}
.zm-faktura summary:focus-visible{outline:3px solid var(--limonka);outline-offset:3px;border-radius:4px}
.zm-zgody{display:grid;gap:14px;margin:0 0 18px;padding:0;border:0}
.zm-zgoda{display:grid;grid-template-columns:22px minmax(0,1fr);gap:12px;align-items:start;font-size:.92rem;line-height:1.5}
.zm-zgoda input{width:20px;height:20px;margin:2px 0 0;accent-color:var(--limonka)}
.zm-zgoda input:focus-visible{outline:3px solid var(--limonka);outline-offset:2px}
.zm-zgoda a{color:inherit;text-underline-offset:2px}
.zm-podsumowanie{background:var(--grafit);color:var(--bialy);border-radius:14px;padding:28px 24px}
.zm-podsumowanie h2{font-size:1rem;font-weight:600;color:#c9ced6;margin:0 0 14px}
.zm-podsumowanie .zm-wymagane{color:#9aa1ac}
.zm-nazwa{font-size:1.4rem;font-weight:700;line-height:1.2;margin:0 0 6px}
.zm-opis-produktu{color:#c9ced6;font-size:.93rem;line-height:1.5;margin:0 0 18px}
.zm-lista{list-style:none;padding:0;margin:0 0 20px;display:grid;gap:8px}
.zm-lista li,.zm-lista-jasna li{position:relative;padding-left:22px;font-size:.92rem;line-height:1.45}
.zm-lista li::before,.zm-lista-jasna li::before{content:"";position:absolute;left:2px;top:.5em;width:9px;height:5px;border-left:2px solid var(--limonka);border-bottom:2px solid var(--limonka);transform:rotate(-45deg)}
.zm-lista-jasna{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.zm-lista-jasna li{font-size:1rem;padding-left:24px}
.zm-lista-jasna li::before{border-color:var(--grafit)}
.zm-gwarancja{border:1.5px solid var(--limonka);border-radius:10px;padding:14px 16px;margin:0 0 20px;font-size:.92rem;line-height:1.5}
.zm-gwarancja strong{display:block;color:var(--limonka);margin-bottom:2px}
.zm-suma{display:flex;justify-content:space-between;align-items:baseline;gap:12px;border-top:1px solid #3a414b;padding-top:16px;margin-bottom:4px}
.zm-suma span:first-child{color:#c9ced6}
.zm-kwota{font-size:2rem;font-weight:700;letter-spacing:-.01em}
.zm-okres{font-size:.85rem;color:#c9ced6;text-align:right;margin:0 0 18px}
.zm-metody{font-size:.85rem;color:#c9ced6;line-height:1.5;margin:0 0 18px}
.zm-przycisk{font:inherit;font-weight:700;font-size:1.05rem;width:100%;border:0;border-radius:12px;padding:16px 20px;background:var(--limonka);color:var(--grafit);cursor:pointer;text-align:center;text-decoration:none;display:inline-block}
.zm-przycisk:hover{background:#c3e53a}
.zm-przycisk:focus-visible{outline:3px solid var(--bialy);outline-offset:3px}
.zm-pod-przyciskiem{font-size:.82rem;color:#9aa1ac;line-height:1.5;margin:12px 0 0}
.zm-blad{background:#fdecea;color:var(--blad);border-radius:10px;padding:12px 14px;font-size:.92rem;line-height:1.45;margin:0 0 14px}
.zm-kontakt{font-size:.9rem;color:var(--szary);margin-top:16px;line-height:1.5}
.zm-kontakt a{color:var(--grafit);font-weight:600}
.zm-ukryte{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.zm-potwierdzenie{display:flex;gap:16px;align-items:flex-start}
.zm-znak{flex:none;width:52px;height:52px;border-radius:50%;background:var(--limonka);display:grid;place-items:center}
.zm-znak::before{content:"";width:20px;height:10px;border-left:3.5px solid var(--grafit);border-bottom:3.5px solid var(--grafit);transform:translateY(-3px) rotate(-45deg)}
.zm-numer{display:inline-block;margin-top:14px;background:var(--bialy);border-radius:8px;padding:8px 12px;font-size:.92rem}
.zm-demo{background:#fff7d6;border-radius:10px;padding:12px 14px;font-size:.88rem;line-height:1.5;margin:0 0 24px}
@media (prefers-reduced-motion:no-preference){.zm-wejscie,.zm-przycisk{transition:border-color .12s ease,background-color .12s ease}}
`;  