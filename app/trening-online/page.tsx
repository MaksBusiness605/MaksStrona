// PLIK: app/trening-online/page.tsx · STRONA /trening-online · trening przez kamerę (100 / 260 / 400 zł)
import type { Metadata } from "next";
import {
  Benefits,
  CaseStudies,
  CennikWybor,
  Differentiators,
  Faq,
  Footer,
  Header,
  HeroShot,
  IconStrip,
  Lokalizacja,
  OdZakupu,
  PainCenter,
  Stats,
  StickyCta,
  Team,
  Zobowiazania,
} from "@/app/components/sections";
import { ZDJECIA, blok, kadr, zBlokami } from "@/app/tresc/zdjecia";

/** Wszystkie pliki graficzne tej strony. Podmieniasz je w
    app/tresc/zdjecia.ts, klucz `coachingOnline`. */
const Z = ZDJECIA.coachingOnline;

export const metadata: Metadata = {
  title: "Trening 1:1 online przez kamerę od 100 zł · Maks Treningi",
  description:
    "Trening personalny online przez kamerę: widzę Twoją serię i poprawiam technikę w trakcie, nie tydzień później. Pojedynczy trening 100 zł, pakiety 260 i 400 zł. Bez abonamentu, termin ustalamy w 24 h po zakupie.",
};

/* ═══════════════════════════════════════════════════════════════════════
   TREŚĆ · tutaj edytujesz wszystkie teksty tej strony

   CO ZMIENIŁO SIĘ W TEJ WERSJI
   · CASE_STUDIES: druga historia to Jarosław (wyciskanie 100 → 140 kg,
     treningi 5 → 3 w tygodniu). Opis pisany pod tę stronę: treningi
     przez kamerę na jego siłowni, korekta w trakcie serii, nagrania,
     do których wraca. Zdjęcie: wyciskanie na ławce, wspólne dla trzech
     stron (stała PRZYPADEK2 w zdjecia.ts).
   · Sekcja nadal stoi za flagą POKAZ_PLACEHOLDERY. Szczegóły historii
     Jarosława (wiek, kontekst, liczba treningów online, czas) są do
     potwierdzenia z nim. Jeśli trenował z Tobą na sali, a nie przez
     kamerę, ten opis jest nieprawdziwy: wtedy weź opis ze strony
     stacjonarnej i dopisz w `kontekst`, że to treningi na sali.

   POPRZEDNIA WERSJA
   · TEAM: prawdziwe imię i nazwisko oraz opis „kim jestem" przeniesiony
     ze strony stacjonarnej (poprawione literówki i polskie znaki).
     Pierwszy akapit o kamerze zostaje, bo to strona online.
   · JEDNA STRONA, JEDEN PRODUKT. Strona sprzedaje wyłącznie trening
     przez kamerę (100 / 260 / 400 zł). Prowadzenie sprzedaje strona
     /produkty.
   · Ten sam układ co strona stacjonarna:
       HERO z trzema warunkami pod przyciskiem (`reassurance`),
       <OdZakupu> z osią czasu i kontaktem telefon → SMS → e-mail,
       <CennikWybor> z przełącznikiem „Ile treningów?",
       <Zobowiazania> jako finalne CTA, bez zwrotów i darmowych sesji.
   · Kolejność: najpierw dowód i mechanizm, potem „czym to się różni od
     YouTube", potem jak kupić i gdzie trenujemy, cennik, trener, FAQ,
     gwarancja.
   · PAIN bez czasowników w czasie przeszłym, żeby czytał się tak samo
     dla kobiety i mężczyzny.

   CO ZOSTAJE BEZ ZMIAN
   · Brak terminu w 14 dni = zwrot. To zabezpieczenie płacenia z góry,
     nie gwarancja zadowolenia: treningu, który się nie odbył, i tak
     nie można zatrzymać.
   · Zwrot za niewykorzystane sesje z pakietu, z tego samego powodu.
   · <Lokalizacja> w trybie `silownie` z regulaminami sieci.

   ZANIM OPUBLIKUJESZ, sprawdź:
   1. KOSZYK: podpięty do Stripe (/api/stripe/platnosc). Na produkcji
      ustaw klucz sk_live_ i webhook w panelu Stripe.
   2. Zdjęcia w app/tresc/zdjecia.ts, klucz `coachingOnline`: nazwy
      plików SVG przy korzyściach i zdjęcie do hero.
   3. CZYM PROWADZISZ ROZMOWĘ. FAQ i krok 3 mówią „link do rozmowy
      wideo, bez zakładania konta". Jeśli używasz aplikacji, która
      wymaga konta (np. Teams), zmień oba zdania.
   4. CASE_STUDIES: obie historie wypełnione, pola `czas` w nawiasach.
      Historia Marysi pochodzi z treningów na sali: jeśli strona online
      ma ją pokazywać, warto to zaznaczyć w `kontekst`. Historię
      Jarosława potwierdź z nim i weź zgodę na piśmie, potem zdejmij flagę.
   5. STATS: liczba 500 musi być tą samą liczbą co `proof` w hero.
   6. Ankieta po zakupie musi pytać o: miejsce treningu i klub, sprzęt,
      kontuzje, cel, dni i godziny, kanał kontaktu, godziny kontaktu.
   7. Regulaminy siłowni w LOKALIZACJA: przegląd raz na kwartał.

   ⚠ FORMATOWANIE
   W copy nie ma myślników pauzowych ani półpauz. Łączymy przecinkiem,
   dwukropkiem albo słowem „i".
   ═══════════════════════════════════════════════════════════════════════ */

const POKAZ_PLACEHOLDERY = process.env.NODE_ENV !== "production";

const CTA = "Kup pierwszy trening za 100 zł";
const TELEFON = "537 483 233";

/* Linki do płatności Stripe. Identyfikatory produktów i ceny są
   w app/lib/produkty.ts. Zmieniasz cenę tam, potem w tekstach tutaj. */
const KOSZYK = {
  jeden: "/api/stripe/platnosc?produkt=online-1",
  trzy: "/api/stripe/platnosc?produkt=online-3",
  piec: "/api/stripe/platnosc?produkt=online-5",
};

/* 1 · HERO ─────────────────────────────────────────────────────────────
   Nagłówek: wynik emocjonalny (koniec zgadywania), rama czasowa (jeden
   trening) i mechanizm (kamera, korekta w trakcie serii). Pod przyciskiem
   maksymalnie trzy warunki: ile i czego potrzebujesz, jak płacisz i kiedy
   termin, co jeśli terminu nie będzie.
   ─────────────────────────────────────────────────────────────────────── */

const HERO = {
  proof: "500 przeprowadzonych treningów 1:1",
  title:
    "Przestań zgadywać przy każdej serii. Jeden trening przez kamerę i wiesz, co poprawić",
  points: [
    "Popraw technikę na żywo i wyjdź z sesji z pewnością, że każda kolejna seria coś daje",
    "Dostań jasne kryterium, kiedy dokładać ciężar, i w końcu poczuj, że idziesz do przodu, a nie w kółko",
    "Zatrzymaj nagrania i notatkę na stałe, żeby wchodzić na siłownię wiedząc dokładnie, po co tam jesteś",
  ],
  reassurance: [
    "100 zł za 60 minut, wystarczy telefon",
    "BLIK, karta albo Przelewy24, termin w 24 h",
    "Brak terminu w 14 dni = zwrot całości",
  ],
};

/* 2 · PASEK ────────────────────────────────────────────────────────────
   Każdy element zdejmuje jedną obiekcję. Tylko o treningu przez kamerę.
   ─────────────────────────────────────────────────────────────────────── */

const ICON_STRIP = [
  "Termin ustalamy w 24 h po zakupie",
  "Telefon, SMS albo e-mail: wybierasz w ankiecie",
  "Korekta techniki na żywo, w trakcie serii",
  "Notatka i nagrania zostają u Ciebie",
  "W domu albo na Twojej siłowni",
  "Bez abonamentu i bez umowy",
  "Cała Polska i zagranica",
];

/* 3 · CASE STUDY ───────────────────────────────────────────────────────
   Te same dwie osoby co na stronie stacjonarnej (kadry wspólne
   w zdjecia.ts). Historia Jarosława opisana pod trening przez kamerę.
   Sekcja stoi za flagą POKAZ_PLACEHOLDERY, dopóki Jarosław nie
   potwierdzi swojej historii. Zgoda na piśmie.
   ─────────────────────────────────────────────────────────────────────── */

const CASE_STUDIES = {
  heading: "Dwie osoby rozpisane od pierwszej sesji",
  lead: "Punkt startu, co dokładnie zmieniliśmy i co pokazały karty obciążeń. Bez zdjęć sylwetki przed i po, same liczby, które da się sprawdzić.",
  note: "Historie publikowane za zgodą tych osób. Liczby pochodzą z ich kart obciążeń.",
  items: [
    {
      kto: "Marysia, 50 lat",
      kontekst: "redukcja, siedząca praca",
      tytul: "Od zera ruchu do czterech treningów w tygodniu i planów startowych",
      liczby: [
        { label: "Martwy ciąg", przed: "0 kg", po: "105 kg" },
        { label: "Przysiad", przed: "4 kg", po: "100 kg" },
        { label: "Treningi w tygodniu", przed: "0", po: "4" },
      ],
      start: "Siedzący tryb życia, zero regularnego ruchu i brak wiedzy o tym, jak jedzenie wpływa na samopoczucie i siłę.",
      zmiana: "Najpierw nauka ruchu i czucia własnego ciała, potem stała rutyna treningowa. Do tego kilka prostych zasad jedzenia, które pasują do zwykłego tygodnia, a nie wywracają go do góry nogami.",
      wynik: "Lepsza sylwetka i mobilność, ból zniknął z codziennego życia, a w planach są pierwsze zawody.",
      cytat: "Polubiłam siłownię.",
      czas: "[3 sesje regularnie · 8 tygodni]",
      ...blok(Z.przypadek1),
    },
    {
      kto: "Jarosław, 20 lat",
      kontekst: "rok treningu, zablokowany na 100 kg · plan i prowadzenie online",
      tytul: "Z setki, na której utknął, do 140 kg na ławce w rok",
      liczby: [
        { label: "Wyciskanie na ławce", przed: "100 kg", po: "140 kg" },
        { label: "Treningi w tygodniu", przed: "5", po: "3" },
      ],
      start: "Rok na siłowni i pięć treningów w tygodniu według planów, które sam sobie układał i zmieniał co kilka tygodni. Na 100 kg na ławce się zatrzymał i dalej nie szło.",
      zmiana: "Ułożyłem mu indywidualny plan i prowadziłem go na odległość. Nagrywał swoje serie i podsyłał mi filmiki, a ja poprawiałem mu technikę wyciskania i pokazywałem, jak trenować poprawnie. Każda poprawka szła od razu do kolejnego treningu.",
      wynik: "Rok po tym, jak utknął na setce, wyciska 140 kg. Na każdym treningu wie, co robi i po co.",
      cytat: "Myślałem, że setka to mój sufit, a ja po prostu sam sobie źle układałem plany.",
      czas: "[plan indywidualny + prowadzenie przez filmiki · 12 miesięcy]",
      ...blok(Z.przypadek2),
    },
  ],
};

/* 4 · NAJWIĘKSZY BÓL ───────────────────────────────────────────────────
   Oś: „nikt nigdy nie widział, jak trenujesz". Zdejmuje winę z człowieka
   i przenosi ją na brak drugiej osoby, która widzi serię.
   ─────────────────────────────────────────────────────────────────────── */

const PAIN = {
  title: "To nie słaba wola. Po prostu nikt nigdy nie widział, jak trenujesz",
  body: "Film pokazuje, jak przysiad ma wyglądać. Nie pokazuje, że przy trzecim powtórzeniu zaokrąglasz plecy, a ciężar od miesięcy jest za lekki, żeby cokolwiek zmienić. Tego nie widzi nikt, łącznie z Tobą, więc problem zaczyna wyglądać, jakby był w Tobie. Jedna sesja przez kamerę to zamyka: robisz swoje serie, ja poprawiam w trakcie.",
};

/* 5 · TRZY KORZYŚCI ────────────────────────────────────────────────────
   Dowodzą trzech obietnic z hero, po kolei. Grafiki SVG w zdjecia.ts.
   ─────────────────────────────────────────────────────────────────────── */

const BENEFITS = [
  {
    eyebrow: "Korekta w trakcie serii",
    title: "Ktoś wreszcie patrzy na Twoje powtórzenia, a nie na Twój opis treningu",
    body: "Telefon stoi z boku, Ty robisz swoje serie, a ja mówię w trakcie, co zmienić. Poprawkę widać już w następnym powtórzeniu, a na koniec sprawdzam, czy została do ostatniej serii. Nie czekasz tygodnia na odpowiedź pod nagraniem: wiesz to wtedy, kiedy sztanga jest jeszcze w rękach.",
  },
  {
    eyebrow: "Ciężar i progres",
    title: "Wyjdź z jasną zasadą, kiedy dokładać ciężar, i przestań zgadywać, czy idziesz do przodu",
    body: "Ciężary i tempo ustawiamy pod Twój dzisiejszy poziom, nie pod liczby przepisane z internetu. Dostajesz konkretne kryterium: co musi się wydarzyć, żeby w kolejnym tygodniu dołożyć, a kiedy zostać przy tym samym. Od tej sesji progres jest czymś, co sprawdzasz, a nie czymś, w co masz wierzyć.",
  },
  {
    eyebrow: "Co zostaje po sesji",
    title: "Zatrzymaj nagrania i notatkę na stałe, żeby następny trening zrobić sam, bez zgadywania",
    body: "Tego samego dnia dostajesz na piśmie trzy rzeczy do poprawy i nagrania swoich kluczowych ćwiczeń. Wracasz do nich za tydzień i za miesiąc, kiedy nikt nie stoi obok. Płacisz za jedną godzinę, a zostaje Ci warsztat, którego używasz przy każdym kolejnym treningu.",
  },
];

/* 6 · LICZBY ──────────────────────────────────────────────────────────
   Pierwsza liczba musi być tą samą liczbą co `proof` w hero.
   ─────────────────────────────────────────────────────────────────────── */

const STATS = {
  heading: "Liczby z kalendarza i z notatek po sesjach",
  lead: "Każdą z nich da się sprawdzić: sesje są w kalendarzu, ciężary w notatkach, które zostają u podopiecznych.",
  items: [
    {
      value: "500",
      label: "treningów 1:1 poprowadzonych osobiście",
      note: "Policzone z kalendarza, nie oszacowane",
      icon: "sesje" as const,
    },
    {
      value: "+40 kg",
      label: "średni wzrost w martwym ciągu po trzech treningach",
      note: "Z kart obciążeń: pierwsza sesja i trzecia sesja",
      icon: "progres" as const,
    },
    {
      value: "4 lata",
      label: "pracy jako trener personalny",
      icon: "ciezar" as const,
    },
  ],
};

/* 7 · SZEŚĆ RÓŻNIC ─────────────────────────────────────────────────────
   Obiekcja „mam to za darmo na YouTube". Każdy kafel to rzecz, której
   film i PDF nie zrobią z definicji, bo nikt nie patrzy na Twoją serię.
   Stoi przed cennikiem, bo tam ta obiekcja pada.
   ─────────────────────────────────────────────────────────────────────── */

const DIFFERENTIATORS = {
  heading: "Sześć rzeczy, których nie da Ci film ani gotowy plan",
  items: [
    {
      title: "Ktoś widzi Twoją trzecią serię",
      body: "Film pokazuje wzorcowy przysiad. Nie widzi, że przy trzecim powtórzeniu zaokrąglasz plecy, a kolano ucieka do środka. Sam tego nie wyłapiesz, bo w trakcie serii patrzysz w podłogę.",
    },
    {
      title: "Zasada, kiedy dołożyć ciężar",
      body: "Nie „słuchaj swojego ciała”, tylko warunek: co musi się wydarzyć w tym tygodniu, żeby w kolejnym dołożyć. Bez tego przez pół roku dźwigasz to samo.",
    },
    {
      title: "Ciężar pod Twój dzisiejszy poziom",
      body: "Liczby z planu są pisane pod kogoś innego. Na sesji ustawiamy ciężar i tempo pod to, co dziś realnie robisz czysto.",
    },
    {
      title: "Plan pod sprzęt, który masz",
      body: "Gumy i dwa hantle w domu albo pełna siłownia: ćwiczenia dobieramy pod to, co stoi obok Ciebie, a nie pod studio z filmu.",
    },
    {
      title: "Pytanie zadane w trakcie",
      body: "Nie piszesz komentarza pod filmem i nie czekasz na odpowiedź. Pytasz w przerwie między seriami i od razu sprawdzamy to w kolejnej.",
    },
    {
      title: "Nagrania, do których wracasz",
      body: "Po sesji masz nagrania swoich serii i notatkę. Za miesiąc porównasz, co się zmieniło, zamiast polegać na pamięci.",
    },
  ],
};

/* 8 · OD ZAKUPU DO PIERWSZEJ SERII ─────────────────────────────────────
   Oś czasu jak na stronie stacjonarnej. Jedna ikona na krok, na osi.
   ─────────────────────────────────────────────────────────────────────── */

const ZAKUP = {
  heading: "Od zakupu do pierwszej serii",
  lead: "Nie wybierasz teraz godziny. Termin ustalamy razem po zakupie.",
  steps: [
    {
      meta: "Dziś · 2 minuty",
      icon: "platnosc" as const,
      title: "Płacisz BLIK-iem, kartą albo Przelewy24",
      body: "Bez wybierania terminu.",
      details: ["Od razu mail z potwierdzeniem i linkiem do ankiety"],
    },
    {
      meta: "Zaraz po zakupie · 3 minuty",
      icon: "ankieta" as const,
      title: "Wypełniasz ankietę",
      body: "Gdzie trenujesz, jaki masz sprzęt, kontuzje, cel i jak mam się kontaktować.",
      details: [
        "Trenujesz na siłowni? Sprawdzę jej regulamin przed sesją",
        "Wolisz bez rozmowy? Zaznacz tylko SMS albo tylko e-mail",
      ],
    },
    {
      meta: "Do 24 h w dni robocze",
      icon: "termin" as const,
      title: "Odzywam się i ustalamy termin",
      body: "Proponuję 2–3 wolne godziny, Ty wybierasz jedną. Potwierdzenie z linkiem do rozmowy dostajesz SMS-em i mailem.",
      details: [
        `Telefon: dzwonię z numeru ${TELEFON} w godzinach z ankiety`,
        "SMS: jeśli nie odbierzesz, propozycja terminów przychodzi od razu",
        "E-mail: to samo na piśmie, żeby nic nie zginęło",
        "Brak terminu w 14 dni = zwrot całości",
      ],
    },
    {
      meta: "Trening · 60 minut",
      icon: "kamera" as const,
      title: "Trenujesz, ja poprawiam",
      body: "Telefon na statywie z boku, Ty robisz swoje serie, a ja mówię w trakcie, co zmienić.",
      details: ["Tego samego dnia notatka i nagrania. Zostają u Ciebie"],
    },
  ],
  ctaNote: "Zakup zajmuje dwie minuty. Godzinę wybierasz dopiero wtedy, gdy się odezwę.",
};

/* 8b · GDZIE TRENUJEMY ────────────────────────────────────────────────
   <Lokalizacja> w trybie `silownie`. Stan regulaminów: wrzesień 2026.
   · Zdrofit: wolno nagrywać własny trening, nikt inny nie może być
     rozpoznawalny w kadrze. Zakaz filmowania komercyjnego.
   · CityFit: zakaz filmowania w celach komercyjnych bez zgody sieci.
   · McFit: nie wolno utrwalać wizerunku innych klubowiczów bez zgody.
   · Just GYM: zakaz działalności trenerskiej na sali bez licencji.
     Sesja przez kamerę tego nie dotyczy, bo trener nie jest na sali.
   Ostatnia pozycja listy zawsze musi być „Inna siłownia".
   ─────────────────────────────────────────────────────────────────────── */

const LOKALIZACJA = {
  eyebrow: "Gdzie trenujemy",
  heading: "Sprawdź, czy trenujemy na Twojej siłowni",
  lead: "Sesja przez kamerę działa w domu i na większości siłowni sieciowych. Warunek jest wszędzie ten sam: w kadrze jesteś tylko Ty, a z sali niczego nie publikujemy.",
  silownie: {
    label: "Zaznacz, gdzie trenujesz",
    items: [
      {
        nazwa: "W domu",
        status: "tak" as const,
        warunek: "Wystarczy mata, dwa metry wolnej podłogi i telefon na statywie. Ćwiczenia idą pod sprzęt, który masz, nawet jeśli to gumy i dwa hantle.",
      },
      {
        nazwa: "Just GYM",
        status: "tak" as const,
        warunek: "Regulamin zabrania prowadzenia treningów na sali bez licencji trenera, ale ja nie jestem na sali, a Ty trenujesz dla siebie. Telefon z boku, tylko Ty w kadrze.",
      },
      {
        nazwa: "Zdrofit",
        status: "tak" as const,
        warunek: "Wolno nagrywać własny trening, pod warunkiem że nikt inny nie jest rozpoznawalny w kadrze. Ustawiamy telefon tak, żeby łapał Twoją serię, a nie salę.",
      },
      {
        nazwa: "CityFit",
        status: "tak" as const,
        warunek: "Regulamin zakazuje filmowania w celach komercyjnych bez zgody sieci. Z sali niczego nie publikujemy, kamera patrzy tylko na Ciebie.",
      },
      {
        nazwa: "McFit",
        status: "tak" as const,
        warunek: "Nie wolno nagrywać innych klubowiczów bez ich zgody. Telefon stoi z boku i łapie wyłącznie Twoje powtórzenia.",
      },
      {
        nazwa: "Inna siłownia",
        status: "sprawdz" as const,
        warunek: "Część mniejszych klubów zakazuje każdego nagrywania. Wpisz nazwę klubu w ankiecie po zakupie: przeczytam regulamin, zanim ustalimy termin. Jeśli się nie da, wybierzemy inne miejsce albo oddam pieniądze.",
      },
    ],
    note: "Stan regulaminów: wrzesień 2026. Regulaminy się zmieniają, więc przed pierwszą sesją i tak sprawdzam Twój klub. Na sesji: słuchawki w uszach, telefon z boku pod kątem 45 stopni.",
  },
};

/* 9 · CENNIK ───────────────────────────────────────────────────────────
   <CennikWybor>: przełącznik „Ile treningów?" i panel jednego wariantu.
   Domyślnie otwarty pakiet 3 (`featured`). Przekreślone ceny są uczciwe:
   300 i 500 zł to tyle, ile kosztują te same treningi kupione osobno.
   ─────────────────────────────────────────────────────────────────────── */

const CENNIK = {
  heading: "Cennik",
  lead: "Każdy trening wygląda tak samo. Różni się tylko cena za godzinę i to, na ile z góry się umawiasz.",
  wspolneLabel: "W każdym treningu",
  wyborLabel: "Ile treningów?",
  wspolne: [
    { ikona: "czas" as const, tekst: "60 minut na żywo, tylko Ty i ja" },
    { ikona: "korekta" as const, tekst: "Korekta techniki w trakcie serii" },
    { ikona: "karta" as const, tekst: "Notatka i nagrania tego samego dnia" },
    { ikona: "termin" as const, tekst: "Termin ustalamy w 24 h po zakupie" },
  ],
  items: [
    {
      name: "Pojedynczy trening",
      krotko: "1 trening",
      stawka: "100 zł / trening",
      lead: "Masz już plan, ale nie masz pewności, czy robisz ćwiczenia poprawnie.",
      price: "100 zł",
      note: "60 minut",
      includes: [
        "Ciężary i tempo pod Twój dzisiejszy poziom",
        "Kryterium, kiedy dołożyć ciężar, a kiedy zostać",
      ],
      outcome: "Wiesz dokładnie, co poprawiasz w kolejnym treningu i dlaczego.",
      href: KOSZYK.jeden,
      cta: "Kup trening",
    },
    {
      name: "Pakiet 3 treningów",
      krotko: "3 treningi",
      stawka: "87 zł / trening",
      lead: "Przysiad, martwy ciąg i wyciskanie. Tyle zwykle trzeba, żeby poprawka została w głowie.",
      price: "260 zł",
      oldPrice: "300 zł",
      save: "Taniej o 40 zł",
      note: "87 zł za trening · ważność 8 tygodni",
      includes: [
        "Plan trzech sesji: co poprawiamy i w jakiej kolejności",
        "Zadanie między sesjami, żeby poprawka weszła w nawyk",
        "Kontakt na wiadomości między treningami",
      ],
      outcome: "Trzy główne boje zrobione na tyle poprawnie, żeby trenować je bez asysty.",
      href: KOSZYK.trzy,
      cta: "Kup pakiet",
      featured: true,
      ribbon: "Najczęściej wybierany",
    },
    {
      name: "Pakiet 5 treningów",
      krotko: "5 treningów",
      stawka: "80 zł / trening",
      lead: "Wracasz po przerwie albo po kontuzji i chcesz wyjść z tego z własnym warsztatem.",
      price: "400 zł",
      oldPrice: "500 zł",
      save: "Taniej o 100 zł",
      note: "80 zł za trening · ważność 12 tygodni",
      includes: [
        "Wszystko z pakietu trzech",
        "Praca wokół ograniczenia: plecy, kolano, bark albo siedząca praca",
        "Rozpisany tydzień, który robisz sam między sesjami",
        "Plan na osiem tygodni po ostatniej sesji",
      ],
      outcome: "Umiesz sam ułożyć i poprowadzić swój tydzień treningowy.",
      href: KOSZYK.piec,
      cta: "Kup pakiet",
    },
  ],
  trust: [
    "Brak terminu w 14 dni — pełny zwrot",
    "Zwrot za niewykorzystane sesje",
    "Bez abonamentu i bez umowy",
  ],
};

/* 10 · KTO PROWADZI ────────────────────────────────────────────────── */

const TEAM = {
  heading: "Kto prowadzi treningi",
  name: "Maksymilian Lehman",
  role: "Trener personalny · 4 lata praktyki",
  paragraphs: [
    "Treningi prowadzę przez kamerę ustawioną z boku, z tą samą uwagą, jaką dostajesz przy sztandze. Sam prowadzę sesje i sam odpisuję na wiadomości. Nie ma tu asystenta ani automatu, który generuje plan.",
    "Pracuję z ludźmi o różnym poziomie zaawansowania i w bardzo różnym wieku. Prowadzę zarówno treningi pod cele sportowe, jak i treningi prozdrowotne. Nie boję się pracy z osobami po kontuzjach i wiem, kiedy trzeba skorzystać z pomocy fizjoterapeuty albo ortopedy.",
    "Pierwszy raz przyszedłem na siłownię 9 lat temu. Zaczynałem od pustej sztangi i nie potrafiłem podciągnąć się na drążku. Próbowałem treningu kulturystycznego i kalisteniki, aż odkryłem trójbój siłowy. Największą motywacją okazały się dla mnie wyniki w przysiadzie, wyciskaniu i martwym ciągu.",
    "Jestem pasjonatem i zawodnikiem trójboju siłowego, ale na co dzień pracuję z lekarzami, informatykami, sportowcami, kobietami po ciąży i osobami, które dopiero zaczynają.",
  ],
};

/* 11 · FAQ ─────────────────────────────────────────────────────────────
   Tylko o treningu przez kamerę. Kolejność: czy to działa online →
   termin → siłownia → czym rozmawiamy → poprzednie porażki → czas →
   cena → YouTube → sprzęt i wstyd → segmenty szczególne → odwołanie.
   ─────────────────────────────────────────────────────────────────────── */

const FAQ = [
  {
    q: "Nie wiem, czy dobrze wykonuję ćwiczenia. Da się to naprawdę poprawić przez kamerę?",
    a: "Tak, i to jest główny powód, dla którego treningi online w ogóle mają sens. Widzę serię na żywo z boku, mówię w trakcie, co poprawić, i sprawdzam, czy poprawka została do końca sesji. To dokładnie ta jedna rzecz, której nie da Ci żaden film ani PDF.",
  },
  {
    q: "Płacę z góry. Jak ustalamy termin?",
    a: `Po płatności od razu dostajesz maila z potwierdzeniem i linkiem do krótkiej ankiety. W ankiecie wybierasz, jak mam się kontaktować (telefon, tylko SMS albo tylko e-mail) i o której. W ciągu 24 h w dni robocze dzwonię z numeru ${TELEFON}. Jeśli nie odbierzesz, dostajesz SMS i maila z dwiema, trzema wolnymi godzinami. Jeśli w ciągu 14 dni nie znajdziemy wspólnego terminu, oddaję całą kwotę. A jeśli do 24 h nic nie przyjdzie, zadzwoń: to znaczy, że coś zgubiło się po mojej stronie.`,
  },
  {
    q: "Czy mogę trenować online na swojej siłowni?",
    a: "Zwykle tak. Regulaminy dużych sieci, w tym Zdrofit, CityFit, McFit i Just GYM, pozwalają nagrywać własny trening, o ile nikt inny nie jest rozpoznawalny w kadrze i nic nie jest publikowane w celach komercyjnych. Część małych klubów zakazuje każdego nagrywania, dlatego pytam w ankiecie, gdzie trenujesz, i czytam regulamin Twojego klubu przed pierwszą sesją.",
  },
  {
    // TODO: dopasuj do narzędzia, którego używasz.
    q: "Czym prowadzimy rozmowę? Muszę coś instalować?",
    a: "Link do rozmowy wideo dostajesz w potwierdzeniu terminu, SMS-em i mailem. Otwierasz go na telefonie, bez zakładania konta. Przyda się statyw albo cokolwiek, o co oprzesz telefon z boku, i słuchawki.",
  },
  {
    q: "Kupiłem już plan i go nie dokończyłem. Czemu tym razem ma być inaczej?",
    a: "Plan mówi, co robić. Nie mówi, jak to robisz, i nie zauważa, że od miesięcy powtarzasz ten sam błąd. Na sesji widzę Twoją serię i wychodzisz z konkretem na piśmie: co poprawiasz i kiedy dokładasz ciężar. To zmienia się w porównaniu z każdym planem z internetu.",
  },
  {
    q: "Nie mam silnej woli. Zawsze odpuszczam po dwóch tygodniach.",
    a: "Ludzie rzadko odpuszczają dlatego, że są słabi. Odpuszczają, kiedy nie widzą efektów i nie wiedzą, czy robią dobrze. Po sesji masz kryterium, które mówi, czy idziesz do przodu, więc nie musisz wierzyć, że to działa: sprawdzasz to.",
  },
  {
    q: "Nie mam czasu trenować kilka razy w tygodniu.",
    a: "Trening przez kamerę to jedna godzina, bez dojazdu. Resztę tygodnia robisz sam, tyle dni, ile realnie masz. Przy dwóch treningach w tygodniu efekty przychodzą wolniej i mówię o tym wprost, zamiast obiecywać to samo co przy czterech.",
  },
  {
    q: "Ile to kosztuje?",
    a: "Pojedynczy trening 100 zł, pakiet trzech 260 zł (87 zł za trening), pakiet pięciu 400 zł (80 zł za trening). Bez abonamentu i bez umowy. Za niewykorzystane sesje z pakietu zwracam pieniądze.",
  },
  {
    q: "Znajdę darmowe treningi na YouTube. Po co mam płacić?",
    a: "Darmowe treningi działają i nie będę udawał, że jest inaczej. Brakuje Ci nie ćwiczeń, tylko kogoś, kto zobaczy, jak je wykonujesz. Płacisz za tę jedną rzecz.",
  },
  {
    q: "Trenuję w domu i mam tylko gumy albo dwa hantle.",
    a: "To wystarczy na start i na kilka miesięcy progresu. Ćwiczenia dobieram pod sprzęt, który faktycznie masz. Jeśli w którymś momencie sprzęt zacznie ograniczać efekty, powiem o tym wprost i podam, co dokupić za najmniejsze pieniądze.",
  },
  {
    q: "Wstydzę się siłowni, bo nie wiem, co tam robić.",
    a: "Możemy zacząć w domu i przenieść się na siłownię dopiero wtedy, kiedy będziesz wiedzieć, po co tam wchodzisz i co robisz w jakiej kolejności. Przy treningu przez kamerę nikt poza mną Cię nie widzi.",
  },
  {
    q: "Czy będę musiał liczyć każdą kalorię?",
    a: "Nie. Sesja jest o technice i ciężarze. Jeśli zapytasz, podpowiem kilka prostych zasad, które działają bez wagi kuchennej, ale nie układam jadłospisów.",
  },
  {
    q: "Nie chcę zrobić się „za duża” od ciężarów.",
    a: "Nie zbudujesz przypadkiem sylwetki kulturystki. Trening siłowy przy Twoim jedzeniu zwykle sprawia, że obwody się zmniejszają, a ciało robi się jędrniejsze, nie większe. Jeśli mimo to chcesz mniej pracy nad konkretną partią, wystarczy to powiedzieć.",
  },
  {
    q: "Mam 45 lat i wrażenie, że wszystkie te oferty są robione dla dwudziestolatków.",
    a: "Różnica nie polega na tym, że dostajesz łatwiejszy trening, tylko na tym, że inaczej dobieramy objętość i tempo dokładania ciężaru. Więcej uwagi idzie na stawy i regenerację. Jeśli dochodzą leki albo diagnoza wpływająca na trening, napisz o tym w ankiecie.",
  },
  {
    q: "Mam kontuzję, bóle pleców albo siedzącą pracę.",
    a: "Napisz o tym w ankiecie. Część rzeczy da się obejść doborem ćwiczeń. Przy świeżym urazie albo diagnozie wymagającej rehabilitacji powiem wprost, że najpierw fizjoterapeuta, a trening poczeka.",
  },
  {
    q: "Co, jeśli będę musiał odwołać umówiony trening?",
    a: "Odwołanie do 12 godzin przed terminem nic nie kosztuje, przekładamy sesję na inny dzień. Pakiet trzech ma ważność 8 tygodni, pakiet pięciu 12 tygodni, więc jest zapas na chorobę albo wyjazd.",
  },
  {
    q: "Dla kogo to nie jest?",
    a: "Jeśli chcesz schudnąć 5 kg w dwa tygodnie, to nie jest oferta dla Ciebie. Jeśli trenujesz od lat i szukasz drobnej korekty, wystarczy jeden trening. Jeśli potrzebujesz, żeby ktoś fizycznie stał obok i asekurował każde powtórzenie, kamera tego nie zastąpi i powiem Ci to wprost.",
  },
];

/* 12 · FINALNE CTA — GWARANCJA (ZOBOWIĄZANIA) ─────────────────────────
   Bez zwrotu pieniędzy i bez darmowych sesji. Cztery rzeczy z momentem
   sprawdzenia. Każdą musisz robić przy każdym kliencie.
   ─────────────────────────────────────────────────────────────────────── */

const ZOBOWIAZANIA = {
  eyebrow: "Moja gwarancja",
  title: "Z każdego treningu wychodzisz z konkretem, a nie z wrażeniem",
  body: "Nie obiecuję kilogramów w terminie, bo nikt uczciwy tego nie zrobi. Obiecuję cztery rzeczy, z których rozliczysz mnie sam.",
  points: [
    {
      ikona: "uwaga" as const,
      kiedy: "Na sesji",
      tytul: "Całe 60 minut patrzę tylko na Ciebie",
      opis: "Bez drugiej osoby na rozmowie i bez przełączania się między klientami.",
    },
    {
      ikona: "karta" as const,
      kiedy: "Tego samego dnia",
      tytul: "Notatka i nagrania na piśmie",
      opis: "Trzy rzeczy do poprawy. Zostają u Ciebie na stałe.",
    },
    {
      ikona: "rozmowa" as const,
      kiedy: "Po 1. treningu",
      tytul: "Mówię wprost, ile treningów potrzebujesz",
      opis: "Jeśli wystarczy jeden, usłyszysz to ode mnie.",
    },
    {
      ikona: "progres" as const,
      kiedy: "Po 3. treningu",
      tytul: "Nagranie pierwsze obok trzeciego",
      opis: "Jeśli coś stoi, mówię dokładnie co i dlaczego.",
    },
  ],
  note: "Zakup zajmuje dwie minuty: BLIK, karta albo Przelewy24. Termin ustalamy razem w 24 h w dni robocze.",
};

/* ═══════════════════════════════════════════════════════════════════════
   SKŁAD · kolejność sekcji na stronie
   Wszystkie przyciski prowadzą do koszyka pojedynczego treningu, poza
   cennikiem, gdzie każdy wariant ma swój link.
   ═══════════════════════════════════════════════════════════════════════ */

export default function Page() {
  return (
    <>
      <Header cta={CTA} ctaHref={KOSZYK.jeden} />

      <main>
        {/* 1 · hero */}
        <HeroShot {...HERO} cta={CTA} ctaHref={KOSZYK.jeden} {...kadr(Z.hero)} />

        {/* 2 · pasek */}
        <IconStrip items={ICON_STRIP} tone="fog" />

        {/* 3 · dwie historie. Zdejmij flagę, gdy Jarosław potwierdzi swoją. */}
        {POKAZ_PLACEHOLDERY && (
          <CaseStudies {...CASE_STUDIES} cta={CTA} ctaHref={KOSZYK.jeden} />
        )}

        {/* 4 · największy ból */}
        <PainCenter {...PAIN} cta={CTA} ctaHref={KOSZYK.jeden} />

        {/* 5 · trzy korzyści */}
        <Benefits
          items={zBlokami(BENEFITS, [Z.korzysc1, Z.korzysc2, Z.korzysc3])}
          cta={CTA}
          ctaHref={KOSZYK.jeden}
        />

        {/* 6 · liczby */}
        <Stats {...STATS} cta={CTA} ctaHref={KOSZYK.jeden} />

        {/* 7 · sześć różnic: odpowiedź na „mam to za darmo" */}
        <Differentiators {...DIFFERENTIATORS} cta={CTA} ctaHref={KOSZYK.jeden} />

        {/* 8 · od zakupu do pierwszej serii */}
        <OdZakupu {...ZAKUP} cta={CTA} ctaHref={KOSZYK.jeden} />

        {/* 8b · gdzie trenujemy */}
        <Lokalizacja {...LOKALIZACJA} cta={CTA} ctaHref={KOSZYK.jeden} />

        {/* 9 · cennik */}
        <CennikWybor {...CENNIK} />

        {/* 10 · kto prowadzi */}
        <Team {...TEAM} {...kadr(Z.team)} cta={CTA} ctaHref={KOSZYK.jeden} odstepGora />

        {/* 11 · pasek i faq */}
        <IconStrip items={ICON_STRIP} />
        <Faq
          heading="Pytania, które dostaję najczęściej"
          items={FAQ}
          cta={CTA}
          ctaHref={KOSZYK.jeden}
        />

        {/* 12 · finalne CTA: gwarancja */}
        <Zobowiazania {...ZOBOWIAZANIA} id="gwarancja" cta={CTA} ctaHref={KOSZYK.jeden} />
      </main>

      <Footer />

      <StickyCta label={CTA} href={KOSZYK.jeden} note="Termin ustalamy razem po zakupie" />
    </>
  );
}