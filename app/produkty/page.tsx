// PLIK: app/produkty/page.tsx · STRONA /produkty · e-book, plan indywidualny, prowadzenie
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
  OdZakupu,
  PainCenter,
  Stats,
  StickyCta,
  Team,
  Zobowiazania,
} from "@/app/components/sections";
import { ZDJECIA, blok, kadr, zBlokami } from "@/app/tresc/zdjecia";

/** Wszystkie pliki graficzne tej strony. Podmieniasz je w
    app/tresc/zdjecia.ts, klucz `produkty`. */
const Z = ZDJECIA.produkty;

export const metadata: Metadata = {
  title: "Plan treningowy pod Ciebie: e-book, plan indywidualny, prowadzenie | Maks Treningi",
  description:
    "E-book z zasadami, indywidualny plan treningowy albo prowadzenie miesięczne. Plan pisany pod Twój grafik, sprzęt i ograniczenia. Płatność BLIK-iem, kartą albo Przelewy24.",
};

/* ═══════════════════════════════════════════════════════════════════════
   TREŚĆ

   CO ZMIENIŁO SIĘ W TEJ WERSJI
   · BEZ „30 DNI NA ZWROT”. Obietnica zniknęła z HERO, ICON_STRIP,
     CENNIK.trust, FAQ, ZOBOWIAZANIA i StickyCta, bo regulamin jej nie
     przewiduje. Zostaje to, co mówi regulamin: 14 dni na odstąpienie,
     dopóki usługa nie jest wykonana (e-book: do chwili dostępu).
     Zostaje też odliczenie ceny e-booka przy przejściu wyżej w 30 dni:
     to rabat, nie zwrot.
   · Ten sam układ co strony treningów:
       <OdZakupu> z osią czasu i ikonami zamiast trzech kafli,
       <CennikWybor> z przełącznikiem „Który poziom?" zamiast trzech kart,
       <Zobowiazania> jako finalne CTA zamiast <Guarantee> i <FinalBand>.
   · GWARANCJA mówiła o „pakiecie trzech treningów" i „kolejnym treningu
     bez opłaty", czyli o innym produkcie, z placeholderem [48] z [50].
     Zamiast niej cztery zobowiązania, które klient sprawdzi sam.
   · „Policz, ile kosztował Cię ostatni rok" (dawne FinalBand i kotwica
     w cenniku) stoi teraz w leadzie finału, raz, zamiast dwa razy.
   · Placeholdery, które widać było na stronie: [link do płatności],
     [N] miejsc, [operator], [kontakt@...], [X] lat. Linki idą przez
     stałą KOSZYK, reszta wypadła albo dostała prawdziwą treść.
   · Obiekcje przy cenniku przeszły do FAQ (tam już były, dublowały się).
   · Bez myślników pauzowych w copy, jak na pozostałych stronach.

   CO ZOSTAJE
   · Drabina: e-book (wiedza) → plan (dopasowanie) → prowadzenie
     (dopasowanie i ktoś, kto patrzy). Każdy szczebel sprzedaje coś
     innego, nie większą paczkę tego samego.
   · Cena e-booka wraca jako rabat, gdy w 30 dni przechodzisz wyżej.

   ZANIM OPUBLIKUJESZ, sprawdź:
   1. KOSZYK: podpięty do Stripe. Ankieta jest PO płatności (link na
      /dziekujemy i w mailu, zmienna ANKIETA_URL). Stąd zmienione teksty
      w ZAKUP, przy planie w cenniku i w FAQ „Co dostaję po zakupie”.
   2. Zdjęcia: app/tresc/zdjecia.ts, klucz `produkty`. Hero nie ma
      pliku, więc pokazuje brief.
   3. CASE_STUDIES to placeholdery z sali, sekcja stoi za flagą. Dla tej
      strony najmocniejszy dowód to dwie osoby z tym samym celem i dwoma
      różnymi planami: pokazuje, że plan naprawdę powstaje z ankiety.
   4. Prowadzenie: jeśli ma limit miejsc, dopisz go w `note`, ale tylko
      prawdziwy.
   ═══════════════════════════════════════════════════════════════════════ */

const POKAZ_PLACEHOLDERY = process.env.NODE_ENV !== "production";

const CTA = "Zobacz trzy poziomy";

/** Cel przycisków nad cennikiem. <CennikWybor> renderuje id="oferty". */
const CEL = "#oferty";

/* Linki do płatności Stripe. Prowadzenie to płatność co miesiąc
   (subskrypcja), reszta jednorazowo. Ceny w app/lib/produkty.ts. */
const KOSZYK = {
  ebook: "/api/stripe/platnosc?produkt=ebook",
  plan: "/api/stripe/platnosc?produkt=plan",
  prowadzenie: "/api/stripe/platnosc?produkt=prowadzenie",
};

/* 1 · HERO ─────────────────────────────────────────────────────────────
   Nagłówek nie obiecuje sylwetki, tylko koniec zgadywania. Pod przyciskiem
   trzy warunki: ile, co jeśli nie pasuje, co zostaje.
   ─────────────────────────────────────────────────────────────────────── */

const HERO = {
  proof: "500 przeprowadzonych treningów 1:1",
  title: "Plan napisany pod Twój tydzień, nie pod idealny scenariusz",
  points: [
    "Progresja z kryterium: wiesz, kiedy dołożyć ciężar, a kiedy zostać",
    "Wideo do ćwiczeń z Twojego planu, nie biblioteka stu ruchów",
    "Wersja awaryjna treningu na dzień, w którym masz 25 minut",
  ],
  reassurance: ["Od 99 zł", "BLIK, karta albo Przelewy24", "Materiały zostają u Ciebie"],
};

/* 2 · PASEK ─────────────────────────────────────────────────────────── */

const ICON_STRIP = [
  "E-book: dostęp od razu",
  "Plan pod Twój sprzęt i grafik",
  "Wideo do każdego ćwiczenia",
  "Kryterium progresji, nie „słuchaj ciała”",
  "Bez liczenia kalorii",
  "Wersja awaryjna na 25 minut",
  "Płatność BLIK-iem, kartą albo Przelewy24",
  "Działa na telefonie",
];

/* 3 · CASE STUDY ───────────────────────────────────────────────────────
   Te same dwie historie co na stronach treningów, za flagą. Zobacz punkt 3
   w „Zanim opublikujesz": na tej stronie lepiej zadziała inny dowód.
   ─────────────────────────────────────────────────────────────────────── */

const CASE_STUDIES = {
  heading: "Dwie osoby rozpisane od pierwszego tygodnia",
  lead: "Punkt startu, co dokładnie zmieniliśmy i co pokazały arkusze. Bez zdjęć sylwetki przed i po, same liczby, które da się sprawdzić.",
  note: "Historie publikowane za zgodą tych osób. Liczby pochodzą z ich arkuszy.",
  items: [
    {
      kto: "[Imię], [wiek] lat",
      kontekst: "[np. redukcja, siedząca praca]",
      tytul: "[Jedno zdanie efektu: co się zmieniło i po ilu tygodniach]",
      liczby: [
        { label: "Martwy ciąg", przed: "[..] kg", po: "[..] kg" },
        { label: "Przysiad", przed: "[..] kg", po: "[..] kg" },
        { label: "Treningi w tygodniu", przed: "[..]", po: "[..]" },
      ],
      start: "[Z czym przyszła: ile trenowała, co próbowała wcześniej i na czym się kończyło.]",
      zmiana: "[Jak wyglądał jej plan po ankiecie i dlaczego właśnie tak.]",
      wynik: "[Co pokazał arkusz po ośmiu tygodniach. Jedna rzecz poza liczbami.]",
      cytat: "[Jedno zdanie tej osoby, słowo w słowo]",
      czas: "[plan indywidualny · 8 tygodni]",
      ...blok(Z.przypadek1),
    },
    {
      kto: "[Imię], [wiek] lat",
      kontekst: "[np. powrót po kontuzji kolana]",
      tytul: "[Jedno zdanie efektu: co się zmieniło i po ilu tygodniach]",
      liczby: [
        { label: "Przysiad", przed: "[..] kg", po: "[..] kg" },
        { label: "Ból w trakcie", przed: "[..]/10", po: "[..]/10" },
      ],
      start: "[Z czym przyszedł: uraz, zalecenia fizjoterapeuty, czego się bał.]",
      zmiana: "[Jak plan omijał ograniczenie i kiedy wrócił ciężar.]",
      wynik: "[Gdzie jest dziś: ciężar, samodzielny trening.]",
      cytat: "[Jedno zdanie tej osoby, słowo w słowo]",
      czas: "[prowadzenie · 3 miesiące]",
      ...blok(Z.przypadek2),
    },
  ],
};

/* 4 · NAJWIĘKSZY BÓL ───────────────────────────────────────────────────
   Przenosi winę z człowieka na niedopasowanie planu.
   ─────────────────────────────────────────────────────────────────────── */

const PAIN = {
  title: "Plan nie przestał działać. On nigdy nie był napisany pod Ciebie",
  body: "Pobierasz PDF ułożony pod cztery treningi w tygodniu i robisz trzy, bo tyle masz. Po miesiącu ciężary stoją i nie wiesz, czy to normalne, czy coś psujesz. Nie ma zasady, kiedy dokładać. Nie ma wersji ćwiczenia, którego nie zrobisz na swoim sprzęcie. Nie ma nic na tydzień, w którym zachorujesz. Więc zaczynasz od poniedziałku, znowu, i za którymś razem uznajesz, że problem jest w Tobie.",
};

/* 5 · TRZY KORZYŚCI ────────────────────────────────────────────────────
   Dopasowanie → dowód progresu → odporność na realne życie. Grafiki SVG
   w zdjecia.ts, w tej samej kolejności.
   ─────────────────────────────────────────────────────────────────────── */

const BENEFITS = [
  {
    eyebrow: "Ankieta, nie formularz z imieniem",
    title: "Plan zaczyna się od Twoich ograniczeń, nie od modelowego tygodnia",
    body: "Dni w tygodniu, długość sesji, sprzęt, staż, kontuzje, godzina treningu i jedno pytanie, od którego najwięcej zależy: w którym momencie wcześniej odpadasz. Na tej podstawie powstaje plan, a do niego nagranie, w którym tłumaczę, dlaczego wygląda właśnie tak.",
  },
  {
    eyebrow: "Progresja z kryterium",
    title: "Po ośmiu tygodniach nie zastanawiasz się, czy coś się zmieniło",
    body: "Każdy tydzień ma zapisaną zasadę: co musi się wydarzyć, żeby w kolejnym dołożyć, i kiedy zostajesz przy tym samym. Arkusz zbiera obciążenia, więc progres jest czymś, co sprawdzasz, a nie czymś, w co masz wierzyć.",
  },
  {
    eyebrow: "Plan odporny na tydzień, który się nie udał",
    title: "Choroba i wyjazd nie kasują cyklu",
    body: "Do każdego ćwiczenia są dwa zamienniki pod inny sprzęt i pod ograniczoną ruchomość. Do każdego treningu wersja na 25 minut. Do trzech opuszczonych treningów gotowy protokół powrotu: wracasz do punktu sprzed przerwy, a nie do poniedziałku i do początku.",
  },
];

/* 6 · LICZBY ──────────────────────────────────────────────────────────
   Pierwsza liczba musi być tą samą liczbą co `proof` w hero.
   ─────────────────────────────────────────────────────────────────────── */

const STATS = {
  heading: "Liczby, na których stoi ta metodyka",
  lead: "Każdą z nich da się sprawdzić: sesje są w kalendarzu, ciężary na kartach obciążeń, które zostają u podopiecznych.",
  items: [
    {
      value: "500",
      label: "treningów 1:1 poprowadzonych osobiście",
      note: "Plany są zapisem tych sesji, nie szablonem z internetu",
      icon: "sesje" as const,
    },
    {
      value: "+40 kg",
      label: "średni wzrost w martwym ciągu po trzech sesjach",
      note: "Z kart obciążeń: pierwsza i trzecia sesja",
      icon: "progres" as const,
    },
    {
      value: "4 lata",
      label: "pracy jako trener personalny",
      icon: "ciezar" as const,
    },
  ],
};

/* 7 · SZEŚĆ RZECZY ─────────────────────────────────────────────────── */

const DIFFERENTIATORS = {
  heading: "Sześć rzeczy, których nie zrobi darmowy plan z internetu",
  items: [
    {
      title: "Kryterium progresji",
      body: "Konkretna zasada, kiedy dokładać ciężar, a kiedy zostać. Nie „słuchaj swojego ciała”.",
    },
    {
      title: "Protokół tygodnia, który się nie udał",
      body: "Choroba, wyjazd i trzy opuszczone treningi mają gotowy scenariusz powrotu. Bez zaczynania od poniedziałku.",
    },
    {
      title: "Zamienniki ćwiczeń",
      body: "Dwa warianty każdego ruchu: pod inny sprzęt i pod ograniczenie w barku, kolanie albo plecach.",
    },
    {
      title: "Wersja na 25 minut",
      body: "Każdy trening ma skróconą wersję na dzień, w którym masz pół godziny zamiast półtorej.",
    },
    {
      title: "Jedzenie bez liczenia",
      body: "Karta talerza i zasady, które działają bez wagi kuchennej, aplikacji i kurczaka z ryżem przez tydzień.",
    },
    {
      title: "Aktualizacje bez dopłat",
      body: "Gdy poprawiam materiał, dostajesz nową wersję. Kupujesz raz, nie co edycję.",
    },
  ],
};

/* 8 · OD ANKIETY DO PIERWSZEGO TRENINGU ────────────────────────────────
   Oś czasu z ikonami, jak na stronach treningów. Trzy kroki, bo tyle ma
   ten produkt. Różnice między poziomami stoją w konkretach pod krokami.
   ─────────────────────────────────────────────────────────────────────── */

const ZAKUP = {
  heading: "Od ankiety do pierwszego treningu",
  lead: "Plan powstaje z Twoich odpowiedzi, więc zaraz po płatności jest ankieta. E-book dostajesz od razu.",
  steps: [
    {
      meta: "Dziś · 2 minuty",
      icon: "platnosc" as const,
      title: "Płacisz BLIK-iem, kartą albo Przelewy24",
      body: "Od razu mail z potwierdzeniem, a przy planie i prowadzeniu z linkiem do ankiety.",
      details: ["E-book: bez ankiety, dostęp od razu po płatności"],
    },
    {
      meta: "Zaraz po zakupie · 8 minut",
      icon: "ankieta" as const,
      title: "Wypełniasz ankietę",
      body: "Dni, sprzęt, staż, kontuzje i moment, w którym wcześniej odpadasz.",
      details: ["Nie zdążysz od razu? Link zostaje w mailu"],
    },
    {
      meta: "Do 72 godzin",
      icon: "karta" as const,
      title: "Dostajesz plan i nagranie",
      body: "Plan w panelu, wideo do każdego ćwiczenia i pięć minut nagrania: dlaczego Twój plan wygląda właśnie tak.",
      details: ["Mail z linkiem do panelu, działa na telefonie"],
    },
    {
      meta: "Przez cały cykl",
      icon: "sala" as const,
      title: "Trenujesz i zapisujesz",
      body: "Wpisujesz ciężary, a arkusz pokazuje, czy idziesz do przodu.",
      details: ["Prowadzenie: check-in co 7 dni i moja odpowiedź, nie automat"],
    },
  ],
  ctaNote: "Nie wiesz, który poziom? Zadzwoń: 537 483 233. Powiem też wtedy, gdy wystarczy najtańszy.",
};

/* 9 · CENNIK ───────────────────────────────────────────────────────────
   <CennikWybor>: przełącznik „Który poziom?" i panel jednego poziomu.
   Domyślnie otwarty plan indywidualny (`featured`). Wspólne dla trzech
   poziomów stoi raz, w panelu, różnice w „Tylko w tym wariancie".
   ─────────────────────────────────────────────────────────────────────── */

const CENNIK = {
  heading: "Trzy poziomy, jedna metodyka",
  lead: "E-book daje zasady, plan przekłada je na Twój tydzień, prowadzenie dokłada kogoś, kto co tydzień patrzy. Cenę e-booka odliczam w całości, gdy w 30 dni przechodzisz wyżej.",
  wyborLabel: "Który poziom?",
  wspolneLabel: "Na każdym poziomie",
  wspolne: [
    { ikona: "korekta" as const, tekst: "Kryterium progresji zamiast „słuchaj ciała”" },
    { ikona: "karta" as const, tekst: "Arkusz progresji do wypełniania" },
    { ikona: "czas" as const, tekst: "Protokół tygodnia, który się nie udał" },
    { ikona: "termin" as const, tekst: "Dostęp bezterminowy, działa na telefonie" },
  ],
  items: [
    {
      name: "E-book",
      krotko: "E-book",
      stawka: "jednorazowo",
      lead: "Zasady, według których układam plany, spisane tak, żeby dało się ułożyć trening samodzielnie.",
      price: "99 zł",
      note: "Jednorazowo · dostęp od razu",
      includes: [
        "Jak zbudować tydzień pod liczbę dni, którą realnie masz",
        "Technika sześciu ruchów bazowych z wideo i listą błędów",
        "Karta talerza i porcje mierzone dłonią, bez liczenia kalorii",
      ],
      outcome: "Wiesz, według jakiej zasady układać tydzień i kiedy dokładać ciężar.",
      href: KOSZYK.ebook,
      cta: "Kup e-book",
      microcopy: "Cenę odliczam w całości, gdy w 30 dni przejdziesz wyżej.",
    },
    {
      name: "Indywidualny plan",
      krotko: "Plan",
      stawka: "jednorazowo",
      lead: "Plan na 12 tygodni napisany po Twojej ankiecie: pod Twoje dni, sprzęt, poziom i ograniczenia.",
      price: "249 zł",
      note: "Jednorazowo · plan gotowy w 72 h",
      includes: [
        "Plan na 12 tygodni pod wyniki Twojej ankiety",
        "Nagranie „dlaczego Twój plan wygląda właśnie tak”, 5 minut",
        "Wideo do ćwiczeń z planu, z dwoma zamiennikami",
        "Wersja awaryjna każdego treningu na 25 minut",
        "Plan liczony wstecz od Twojej daty, jeśli masz coś w kalendarzu",
        "Wszystko z e-booka",
      ],
      outcome: "Przestajesz zgadywać: masz jedną ścieżkę ułożoną pod tydzień, który faktycznie masz.",
      href: KOSZYK.plan,
      cta: "Kup plan",
      microcopy: "Po płatności ankieta na 8 minut, plan w ciągu 72 h.",
      featured: true,
      ribbon: "Najczęściej wybierany",
    },
    {
      name: "Prowadzenie",
      krotko: "Prowadzenie",
      stawka: "miesięcznie",
      lead: "Plan indywidualny i ktoś, kto co tydzień sprawdza, czy idziesz do przodu, i poprawia po drodze.",
      price: "349 zł",
      note: "Miesięcznie · bez umowy na czas określony",
      includes: [
        "Wszystko z planu indywidualnego",
        "Check-in co 7 dni z moją odpowiedzią, nie automatem",
        "Trzy rozmowy w miesiącu: diagnoza, technika, korekta planu",
        "Analiza techniki z Twojego nagrania dwa razy w miesiącu",
        "Korekta planu w trakcie miesiąca, nie tylko na jego koniec",
      ],
      outcome: "Nie odpadasz po trzech tygodniach, bo ktoś zauważa, kiedy przestajesz.",
      href: KOSZYK.prowadzenie,
      cta: "Zacznij prowadzenie",
      microcopy: "Rezygnujesz z końcem opłaconego miesiąca, bez kar.",
    },
  ],
  trust: [
    "Płatność BLIK-iem, kartą albo Przelewy24",
    "Prowadzenie bez umowy na czas określony",
    "Faktura na firmę albo osobę prywatną",
  ],
};

/* 10 · KTO TO NAPISAŁ ──────────────────────────────────────────────── */

const TEAM = {
  heading: "Kto to napisał",
  name: "Maksymilian Lehman",
  role: "Trener personalny · 4 lata praktyki",
  paragraphs: [
    "Te plany nie powstały przy biurku. To zapis tego, co robię z podopiecznymi na sali, uporządkowany tak, żeby dało się to wykonać bez mojej obecności, i napisany pod konkretną osobę, a nie pod średnią.",
    "Pracuję z ludźmi o różnym poziomie zaawansowania i w bardzo różnym wieku. Prowadzę zarówno treningi pod cele sportowe, jak i treningi prozdrowotne. Nie boję się pracy z osobami po kontuzjach i wiem, kiedy trzeba skorzystać z pomocy fizjoterapeuty albo ortopedy.",
    "Pierwszy raz przyszedłem na siłownię 9 lat temu. Zaczynałem od pustej sztangi i nie potrafiłem podciągnąć się na drążku. Próbowałem treningu kulturystycznego i kalisteniki, aż odkryłem trójbój siłowy. Największą motywacją okazały się dla mnie wyniki w przysiadzie, wyciskaniu i martwym ciągu.",
    "Jestem pasjonatem i zawodnikiem trójboju siłowego, ale na co dzień pracuję z lekarzami, informatykami, sportowcami, kobietami po ciąży i osobami, które dopiero zaczynają.",
  ],
};

/* 11 · FAQ ─────────────────────────────────────────────────────────────
   Najpierw to, co blokuje wybór poziomu, potem zaufanie, na końcu
   warunki i uczciwe „dla kogo to nie jest".
   ─────────────────────────────────────────────────────────────────────── */

const FAQ = [
  {
    q: "Który poziom wybrać?",
    a: "Chcesz najpierw zrozumieć zasady i ułożyć trening samodzielnie: e-book. Masz za sobą gotowe plany i wiesz, że problem jest w dopasowaniu: plan indywidualny. Odpadasz nie z powodu planu, tylko dlatego, że nikt nie zauważa, kiedy przestajesz: prowadzenie. Nie wiesz? Zadzwoń albo opisz mi swój ostatni miesiąc. Powiem też wtedy, gdy wystarczy najtańszy.",
  },
  {
    q: "Po co płacić, skoro wszystko jest na YouTube?",
    a: "Na YouTube jest wszystko i dlatego nic z tego nie układa się w jeden tydzień. Nie płacisz za kolejną porcję wiedzy, tylko za usunięcie decyzji: ile dni, w jakiej kolejności, kiedy dokładać ciężar i co zrobić, gdy wypadnie Ci tydzień.",
  },
  {
    q: "Kupiłam już plany i żadnego nie dokończyłam. Czemu tym razem ma być inaczej?",
    a: "Bo tamte zakładały tydzień, którego nie masz. Ten zaczyna się od pytania, ile realnie możesz trenować, i przetrwa chory tydzień i wyjazd. A w prowadzeniu ktoś zauważa, kiedy przestajesz, czego nie zastąpi żaden PDF.",
  },
  {
    q: "Co dokładnie dostaję po zakupie?",
    a: "Przy e-booku mail z linkiem do panelu od razu po płatności. Przy planie i prowadzeniu zaraz po płatności ankieta, a plan w ciągu 72 godzin od jej wypełnienia, razem z nagraniem, w którym tłumaczę każdą decyzję. W panelu jest plan, arkusz progresji i wideo do ćwiczeń. Dostęp jest bezterminowy i działa na telefonie.",
  },
  {
    q: "Czy prowadzenie to abonament? Jak zrezygnować?",
    a: "Płacisz miesiąc do miesiąca i rezygnujesz, kiedy chcesz: współpraca kończy się z ostatnim dniem opłaconego okresu, bez kar i bez wypowiedzenia. Plan, nagrania i arkusz zostają u Ciebie. Nie zadzwonię z ofertą zniżki, żeby Cię zatrzymać.",
  },
  {
    q: "Czy potrzebuję siłowni?",
    a: "Nie. E-book pokazuje, jak zbudować tydzień w trzech wariantach: siłownia, dom z minimalnym sprzętem, wyjazd. W planie i prowadzeniu wariant dobieram od razu pod to, co masz.",
  },
  {
    q: "Czy muszę liczyć kalorie?",
    a: "Nie. Dostajesz kartę talerza, porcje mierzone dłonią i gotowe zestawy z listą zakupów. Bez wagi kuchennej, bez aplikacji i bez tygodnia na kurczaku z ryżem. Nie jestem dietetykiem i nie układam jadłospisów leczniczych: jeśli Twój przypadek tego wymaga, powiem wprost.",
  },
  {
    q: "Mam kontuzję albo siedzącą pracę.",
    a: "Napisz o tym w ankiecie. Plan powstaje wokół tego ograniczenia, nie obok niego. Jeśli etap wymaga jeszcze pracy z fizjoterapeutą, powiem to, zamiast sprzedawać plan.",
  },
  {
    q: "Nie chcę zrobić się „za duża” od ciężarów.",
    a: "Nie zbudujesz przypadkiem sylwetki kulturystki, to wymaga lat pracy i jedzenia ustawionego pod ten jeden cel. Trening siłowy przy normalnym jedzeniu zwykle zmniejsza obwody. Jeśli chcesz mniej pracy nad konkretną partią, zaznacz to w ankiecie.",
  },
  {
    q: "Mam wesele albo wakacje za kilka miesięcy.",
    a: "Podaj tę datę w ankiecie, a plan policzę wstecz od niej. Nie obiecam liczby kilogramów w terminie, bo nikt uczciwy tego nie zrobi. Napiszę natomiast wprost, co realnie da się w tym czasie zmienić.",
  },
  {
    q: "Czy mogę się rozmyślić?",
    a: "Tak, dopóki usługa nie została wykonana: masz na to 14 dni od zakupu. Wystarczy odpisać na maila z potwierdzeniem. Przy planie liczy się moment, w którym dostajesz gotowy plan, a przy prowadzeniu płacisz tylko za dni, które już minęły. E-booka nie da się zwrócić po otrzymaniu dostępu, bo materiały są już u Ciebie. Szczegóły w regulaminie, § 9.",
  },
  {
    q: "Czy dostanę fakturę?",
    a: "Tak, na firmę albo osobę prywatną. Napisz w odpowiedzi na mail z potwierdzeniem dane do faktury, a wyślę ją w ciągu kilku dni.",
  },
  {
    q: "Dla kogo to nie jest?",
    a: "Jeśli trenujesz od lat, technikę masz poukładaną i szukasz wyłącznie rozpiski, e-book Ci wystarczy, a wyższe poziomy będą zbędnym kosztem. Jeśli szukasz planu na pięć kilogramów w dwa tygodnie, nie napiszę takiego i nie będę udawać, że się da.",
  },
];

/* 12 · FINALNE CTA — ZOBOWIĄZANIA ──────────────────────────────────────
   Lead niesie dawne „Policz, ile kosztował Cię ostatni rok": porównanie
   do kosztu bezczynności, nie do cennika konkurencji. Cztery
   zobowiązania z momentem sprawdzenia, ostatnie to rezygnacja z prowadzenia.
   ─────────────────────────────────────────────────────────────────────── */

const ZOBOWIAZANIA = {
  eyebrow: "Moja gwarancja",
  title: "Z tego planu rozliczysz mnie sam",
  body: "Policz, ile kosztował Cię ostatni rok: karnet z sześcioma wykorzystanymi wejściami, dwa plany z internetu, suplementy kupione po czyimś filmiku. Tutaj obiecuję cztery rzeczy, które sprawdzisz sam.",
  points: [
    {
      ikona: "czas" as const,
      kiedy: "Do 72 godzin",
      tytul: "Plan gotowy po ankiecie",
      opis: "Z nagraniem, w którym tłumaczę każdą decyzję.",
    },
    {
      ikona: "uwaga" as const,
      kiedy: "W planie",
      tytul: "Każde ćwiczenie pod Twój sprzęt",
      opis: "Z dwoma zamiennikami i wersją na 25 minut.",
    },
    {
      ikona: "rozmowa" as const,
      kiedy: "Po ankiecie",
      tytul: "Mówię wprost, który poziom Ci wystarczy",
      opis: "Jeśli wystarczy e-book, usłyszysz to ode mnie.",
    },
    {
      ikona: "tarcza" as const,
      kiedy: "W każdym miesiącu",
      tytul: "Prowadzenie bez umowy i bez kar",
      opis: "Rezygnujesz jednym kliknięciem, płatności stają od razu.",
    },
  ],
  note: "Od 99 zł. Cenę e-booka odliczam w całości, gdy w 30 dni przejdziesz wyżej.",
};

/* ═══════════════════════════════════════════════════════════════════════
   SKŁAD
   ═══════════════════════════════════════════════════════════════════════ */

export default function Page() {
  return (
    <>
      <Header cta={CTA} ctaHref={CEL} />

      <main>
        {/* 1 · hero */}
        <HeroShot {...HERO} {...kadr(Z.hero)} cta={CTA} ctaHref={CEL} />

        {/* 2 · pasek */}
        <IconStrip items={ICON_STRIP} tone="fog" />

        {/* 3 · dwie historie. Zdejmij flagę, gdy będą prawdziwe. */}
        {POKAZ_PLACEHOLDERY && <CaseStudies {...CASE_STUDIES} cta={CTA} ctaHref={CEL} />}

        {/* 4 · największy ból */}
        <PainCenter {...PAIN} cta={CTA} ctaHref={CEL} />

        {/* 5 · trzy korzyści */}
        <Benefits
          items={zBlokami(BENEFITS, [Z.korzysc1, Z.korzysc2, Z.korzysc3])}
          cta={CTA}
          ctaHref={CEL}
        />

        {/* 6 · liczby */}
        <Stats {...STATS} cta={CTA} ctaHref={CEL} />

        {/* 7 · sześć rzeczy */}
        <Differentiators {...DIFFERENTIATORS} cta={CTA} ctaHref={CEL} />

        {/* 8 · od ankiety do pierwszego treningu */}
        <OdZakupu {...ZAKUP} cta={CTA} ctaHref={CEL} />

        {/* 9 · cennik */}
        <CennikWybor {...CENNIK} />

        {/* 10 · kto to napisał */}
        <Team {...TEAM} {...kadr(Z.team)} cta={CTA} ctaHref={CEL} odstepGora />

        {/* 11 · pasek i faq */}
        <IconStrip items={ICON_STRIP} />
        <Faq heading="Pytania przed zakupem" items={FAQ} cta={CTA} ctaHref={CEL} />

        {/* 12 · finalne CTA */}
        <Zobowiazania {...ZOBOWIAZANIA} id="gwarancja" cta={CTA} ctaHref={CEL} />
      </main>

      <Footer />

      <StickyCta label={CTA} href={CEL} note="Od 99 zł · BLIK, karta albo Przelewy24" />
    </>
  );
}