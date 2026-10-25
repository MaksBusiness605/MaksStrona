// PLIK: app/trening-stacjonarny/page.tsx · STRONA /trening-stacjonarny · Just GYM Łódź (150 / 420 / 650 zł)
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/JsonLd";
import { faq, metaStrony, usluga } from "@/app/lib/seo";
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
    app/tresc/zdjecia.ts, nie tutaj. */
const Z = ZDJECIA.stacjonarny;

export const metadata: Metadata = metaStrony({
  tytul: "Trener personalny Łódź Centrum, trening 1 na 1 od 150 zł | Maks Treningi",
  opis:
    "Trener personalny w Łodzi: trening jeden na jeden w Just GYM przy Piotrkowskiej 157A. Korekta techniki na żywo, zapis obciążeń po każdej sesji. Sesja 150 zł, pakiety 3 i 5 sesji, termin w 24 h.",
  sciezka: "/trening-stacjonarny",
});

/* ═══════════════════════════════════════════════════════════════════════
   TREŚĆ — tutaj edytujesz wszystkie teksty tej strony

   CO ZMIENIŁO SIĘ W TEJ WERSJI
   · CASE_STUDIES: druga historia to Jarosław (wyciskanie 100 → 140 kg,
     treningi 5 → 3 w tygodniu). Opis `zmiana` i `wynik` pisany pod tę
     stronę: pięć sesji na sali, asekuracja, sesja kontrolna. Na stronie
     online i produktów ta sama osoba ma opis pod tamten produkt.
     Zdjęcie: wyciskanie na ławce, teraz wspólne dla trzech stron
     (stała PRZYPADEK2 w zdjecia.ts).
   · Sekcja nadal stoi za flagą POKAZ_PLACEHOLDERY. Szczegóły historii
     Jarosława (wiek, kontekst, liczba sesji, czas) są do potwierdzenia
     z nim. Gdy potwierdzi i da zgodę na piśmie, zdejmij flagę.

   POPRZEDNIA WERSJA
   · TEAM i pierwsza historia w CASE_STUDIES: poprawione literówki,
     polskie znaki i interpunkcja. Ten sam tekst stoi na stronie online
     i na stronie produktów, więc zmieniasz go we wszystkich trzech.
   · CASE_STUDIES: „stworzyliśmy dietę" zamienione na „proste zasady
     jedzenia", bo FAQ mówi „nie układam jadłospisów".
   · GWARANCJA BEZ PIENIĘDZY. Wypadła obietnica „brak progresu = kolejne
     sesje na mój koszt". Zamiast niej sekcja <Zobowiazania> z czterema
     rzeczami, które klient sprawdzi sam po pierwszej godzinie. Obietnica
     stała w pięciu miejscach i zniknęła ze wszystkich: HERO, ICON_STRIP,
     cennik (lead, pakiet 3, trust), FAQ „A jeśli nic się nie zmieni?".
   · HERO: zamiast akapitu pod przyciskiem trzy krótkie warunki
     (`reassurance`). Czyta się je w sekundę, tuż przed kliknięciem.
   · OD ZAKUPU DO PIERWSZEJ SERII: nowy komponent <OdZakupu>, cztery kroki
     zamiast trzech (płatność i ankieta rozdzielone), pod nimi kolejność
     kontaktu telefon → SMS → e-mail i to, co klient ustawia w ankiecie.
     Oś czasu, opis w sections.tsx.
   · FINALNE CTA to gwarancja (<Zobowiazania> z id="rezerwacja").
     <Urgency> wypadła, limit osób (MAX_OSOB) stoi w zdaniu pod
     przyciskiem.
   · <Team> ma pełny odstęp od góry (`odstepGora`).
   · StickyCta na telefonie ma dopisek, że termin ustalamy po zakupie.

   CO ZOSTAJE BEZ ZMIAN
   · Brak terminu w 14 dni = zwrot całości. To nie gwarancja zadowolenia,
     tylko zabezpieczenie płacenia z góry. Usługi, która się nie odbyła,
     i tak trzeba zwrócić, więc ta obietnica nic nie kosztuje, a zdejmuje
     największy strach przed kliknięciem „Kup".
   · Niewykorzystane sesje z pakietu nie są zwracane (poza ustawowym odstąpieniem w 14 dni).
   · Jedna strona, jeden cel: brak linków do innych podstron.
   · Trenujemy wyłącznie w Just GYM, ul. Piotrkowska 157A.

   ZASADY, KTÓRYCH TRZYMAJ SIĘ PRZY DOPISYWANIU
   · Każda sekcja buduje jedno przekonanie z łańcucha: hero + PAIN →
     „to nie brak silnej woli", BENEFITS → „będę wiedzieć, czy robię
     progres", DIFFERENTIATORS → „darmowy content tego nie da",
     ZOBOWIĄZANIA (finał) → „spróbowanie kosztuje mnie mniej niż kolejny
     rok". Sekcja, która nie buduje żadnego z nich, nie powinna tu być.
   · Rodzaj gramatyczny: nagłówki i główne akapity bez czasowników
     w czasie przeszłym, żeby czytały się tak samo dla kobiety i mężczyzny.
   · Cennik: 150 zł za sesję, pakiety 3 i 5. Model „ustawiam ruchy
     i wypuszczam", nie „prowadzę Cię przez miesiące".

   ZANIM OPUBLIKUJESZ, sprawdź:
   1. CASE_STUDIES: obie historie wypełnione, pola `czas` w nawiasach.
      Historię Jarosława potwierdź z nim słowo w słowo (zwłaszcza cytat
      i liczbę sesji), weź zgodę na piśmie i dopiero wtedy zdejmij flagę
      POKAZ_PLACEHOLDERY.
   2. Przyciski prowadzą prosto do płatności Stripe (KOSZYK niżej). Po
      płatności: /dziekujemy z przyciskiem ankiety i mail z webhooka.
      Na produkcji: klucz sk_live_ i webhook w panelu Stripe.
   3. ANKIETA musi naprawdę pytać o to, co obiecuje sekcja zakupu:
      kontuzje, staż, cel, dni i godziny treningu, kanał kontaktu
      (telefon / tylko SMS / tylko e-mail) i godziny kontaktu.
   4. Mail z potwierdzeniem i linkiem do ankiety musi wychodzić
      automatycznie zaraz po płatności (krok 1).
   5. MAX_OSOB musi być prawdziwe.
   6. ZOBOWIĄZANIA obiecują cztery rzeczy. Każdą musisz robić przy
      każdym kliencie, bo to jedyne, czym ta gwarancja się broni.
   7. `dowod` w ZOBOWIĄZANIACH: wpisz tylko prawdziwe liczby z kart.
   8. +40 kg w STATS: trzymaj pod ręką karty, z których to policzyłeś.
   9. Zostałe [nawiasy]: sprzęt sali.
   ═══════════════════════════════════════════════════════════════════════ */

/* Historie (case study) widoczne wszędzie, także na produkcji. Ukryć: false. */
const POKAZ_PLACEHOLDERY = true;

const CTA = "Kup trening za 150 zł";
const TELEFON = "666 222 699";
const TELEFON_HREF = "tel:+48666222699";

/* Linki do płatności Stripe. Identyfikatory produktów i ceny są
   w app/lib/produkty.ts. Przyciski poza cennikiem kupują jedną sesję. */
const KOSZYK = {
  jeden: "/api/stripe/platnosc?produkt=stacjonarny-1",
  trzy: "/api/stripe/platnosc?produkt=stacjonarny-3",
  piec: "/api/stripe/platnosc?produkt=stacjonarny-5",
};

/** Cel wszystkich przycisków poza cennikiem. */
const REZERWACJA = KOSZYK.jeden;

/** TODO: prawdziwa liczba osób, które prowadzisz jednocześnie. */
const MAX_OSOB = 30;

/* 1 · HERO + ZDJĘCIE ───────────────────────────────────────────────────
   Pod przyciskiem maksymalnie trzy krótkie warunki zamiast akapitu. Każdy
   zdejmuje jedną wątpliwość tuż przed kliknięciem: ile kosztuje, jak
   płacę i kiedy termin, co jeśli terminu nie będzie. Bez gwarancji wyniku: ta siedzi
   w sekcji 11, gdzie ma miejsce na konkret.
   ─────────────────────────────────────────────────────────────────────── */

const HERO = {
  proof: "Trener personalny Łódź · Just GYM, Piotrkowska 157A",
  title: "Ćwiczysz miesiącami i nikt Ci jeszcze nie powiedział, co robisz źle",
  points: [
    "Poprawiam ustawienie w tej samej serii, w której się psuje — nie tydzień później, z nagrania",
    "Cała godzina jeden na jeden, bez dzielenia sesji na dwie osoby",
    "Po każdym treningu zapis obciążeń: wiesz, czy jest progres, zamiast zgadywać",
  ],
  reassurance: [
    "150 zł za 60 minut jeden na jeden",
    "BLIK, karta albo Przelewy24, termin w 24 h",
    "Brak terminu w 14 dni = zwrot całości",
  ],
};

/* 2 · PASEK ────────────────────────────────────────────────────────────
   Każdy element zdejmuje jedną obiekcję z listy, nie opisuje usługi.
   ─────────────────────────────────────────────────────────────────────── */

const ICON_STRIP = [
  "Płatność online, termin ustalamy w 24 h",
  "Termin ustalamy telefonicznie albo SMS-em",
  "Sesje jeden na jeden",
  "Korekta techniki na żywo",
  "Zapis obciążeń po każdej sesji",
  "Pakiety bez daty ważności",
  "Just GYM, Piotrkowska 157A, przy Stajni Jednorożców",
];

/* 3 · CASE STUDY — dwie historie zamiast opinii ─────────────────────
   Marysia: początkująca, redukcja. Jarosław: zaawansowany, który stał
   w miejscu. Dwa różne punkty startu dowodzą dwóch różnych rzeczy.
   Sekcja stoi za flagą POKAZ_PLACEHOLDERY, dopóki Jarosław nie
   potwierdzi swojej historii. Zgoda na piśmie.
   Cztery pytania do podopiecznego:
   1. Co robiłaś przed naszymi treningami i na czym się to kończyło?
   2. Czego się bałaś albo co Cię blokowało przed pierwszą sesją?
   3. Co zmieniło się jako pierwsze, jeszcze zanim zobaczyłaś to w lustrze?
   4. Co powiedziałabyś komuś, kto się waha?
   ─────────────────────────────────────────────────────────────────────── */

const CASE_STUDIES = {
  heading: "Dwie osoby z tej sali, rozpisane od pierwszej sesji",
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
      czas: "3 sesje regularnie · 8 tygodni",
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
      czas: "plan indywidualny + prowadzenie przez filmiki · 12 miesięcy",
      ...blok(Z.przypadek2),
    },
  ],
};

/* 4 · NAJWIĘKSZY BÓL ─────────────────────────────────────────────────── */

const PAIN = {
  title: "Nie poprawisz czegoś, czego nie widzisz",
  body: "Ćwiczysz od miesięcy i nadal nie wiesz, czy robisz to dobrze. Nagranie z telefonu pokazuje jeden kąt i jedno powtórzenie. Nie pokaże Ci, że kolano ucieka dopiero w dziewiątym. Myślisz wtedy, że problem jest w planie albo w Tobie. Zwykle jest w jednym ruchu, który powtarzasz z tym samym błędem od lat, bo nikt nigdy nie stał obok. Na sali widać to od pierwszej serii.",
};

/* 5 · TRZY KORZYŚCI ──────────────────────────────────────────────────── */

const BENEFITS = [
  {
    eyebrow: "Korekta w czasie rzeczywistym",
    title: "Błąd poprawiony w serii, a nie w komentarzu pod filmem",
    body: "Stoję obok przy każdym powtórzeniu. Widzę, kiedy technika zaczyna się sypać ze zmęczenia, i przerywam serię, zanim zamieni się to w nawyk. Część ustawień sprawdza się dłonią, nie okiem — tego nie da się przekazać przez ekran. Dzięki asekuracji wchodzisz też na ciężary, na które sam nie wszedłbyś ze strachu.",
  },
  {
    eyebrow: "Dowód, a nie wrażenie",
    title:
      "Po ośmiu tygodniach nie zastanawiasz się, czy coś się zmieniło — sprawdzasz to",
    body: "Każda sesja kończy się zapisem: obciążenia, powtórzenia, jedna rzecz do poprawy na następny raz. Po dwóch miesiącach masz kartę, na której widać, co poszło w górę, a co stoi. Nie musisz opierać się na tym, jak się dzisiaj czujesz w lustrze, ani czekać do wagi w poniedziałek.",
  },
  {
    eyebrow: "Wyjście na swoje",
    title: "Celem jest to, żebyś przestał mnie potrzebować",
    body: "Nie sprzedaję zależności od trenera i dlatego nie mam pakietów na dwadzieścia sesji. Trzy albo pięć godzin wystarczy, żeby ustawić ruchy, na których stoi cały trening. Potem wracasz na salę sam, z kartą obciążeń i z zasadą, kiedy dokładać ciężar. Jeśli po kilku miesiącach coś się posypie, przychodzisz na jedną sesję kontrolną zamiast kupować wszystko od nowa.",
  },
];

/* 6 · LICZBY ─────────────────────────────────────────────────────────── */

const STATS = {
  heading: "Liczby z grafiku i z kart obciążeń",
  lead: "Każdą z nich da się sprawdzić: sesje są w kalendarzu, ciężary na kartach, które zostają u podopiecznych.",
  items: [
    {
      value: "500",
      label: "sesji jeden na jeden poprowadzonych osobiście",
      note: "Policzone z kalendarza, nie oszacowane",
      icon: "sesje" as const,
    },
    {
      value: "+40 kg",
      label: "średni wzrost w martwym ciągu po pakiecie 3 sesji",
      note: "Z kart obciążeń: pierwsza vs trzecia sesja",
      icon: "progres" as const,
    },
    {
      value: "4 lata",
      label: "pracy na jednej sali: Just GYM przy Piotrkowskiej w Łodzi",
      icon: "sala" as const,
    },
  ],
};

/* 7 · SZEŚĆ RZECZY ───────────────────────────────────────────────────── */

const DIFFERENTIATORS = {
  heading: "Sześć rzeczy, których nie da Ci karnet ani aplikacja",
  items: [
    {
      title: "Ustawienie sprawdzone dłonią",
      body: "Część błędów widać dopiero z boku i z dotyku. Poprawiam je na miejscu, w tej samej serii, zamiast opisywać w wiadomości tydzień później.",
    },
    {
      title: "Progresja zapisana po sesji",
      body: "Ciężary, powtórzenia i jedna rzecz do poprawy — na papierze. Po dwóch miesiącach masz dowód, a nie wrażenie.",
    },
    {
      title: "Sprzęt, którego nie masz w domu",
      body: "Sala ma szeroką strefę wolnych ciężarów, strefę maszyn i miejsce do ćwiczeń funkcjonalnych. Plan idzie pod ten sprzęt, więc nie robimy wersji zastępczych działających w połowie.",
    },
    {
      title: "Rozgrzewka pod ten konkretny trening",
      body: "Inna przed dniem nóg, inna przed górą, dobrana do tego, co dziś Ci nie domyka. Nie jedna lista na wszystko.",
    },
    {
      title: "Plan na tydzień, który się nie udał",
      body: "Choroba, wyjazd i trzy opuszczone treningi mają swój scenariusz. Wracasz do miejsca, w którym byłaś, a nie do poniedziałku i do początku.",
    },
    {
      title: "Wyjście na trening samodzielny",
      body: "Celem jest to, żebyś w pewnym momencie nie musiał mnie potrzebować. Mówię wprost, kiedy ten moment nadchodzi, zamiast przedłużać współpracę.",
    },
  ],
};

/* 8 · OD ZAKUPU DO PIERWSZEJ SERII ─────────────────────────────────────
   Zadanie: człowiek płaci za godzinę, której jeszcze nie widzi. Każde
   „a co potem?" musi mieć odpowiedź, zanim padnie.

   Cztery kroki, bo płatność i ankieta to dwie różne czynności. KISS:
   jedno zdanie na krok i jeden konkret pod kreską. Szczegóły kontaktu
   stoją w bloku pod krokami, nie w krokach.

   Kanały kontaktu (telefon, SMS, e-mail) są rozpisane w kroku 3.
   Wyjście awaryjne „nic nie przyszło w 24 h, zadzwoń" stoi w FAQ.
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
      details: [
        "Od razu mail z potwierdzeniem i linkiem do ankiety",
      ],
    },
    {
      meta: "Zaraz po zakupie · 3 minuty",
      icon: "ankieta" as const,
      title: "Wypełniasz ankietę",
      body: "Kontuzje, staż, cel, kiedy możesz trenować i jak mam się kontaktować.",
      details: [
        "Wolisz bez rozmowy? Zaznacz w ankiecie, że wolisz SMS-y",
        "Nie zdążysz? Zapytam przy pierwszym kontakcie",
      ],
    },
    {
      meta: "Do 24 h w dni robocze",
      icon: "termin" as const,
      title: "Dzwonię albo piszę SMS-a z terminami",
      body: "Zwykle dzwonię, żeby szybko ustalić godzinę. Jeśli się nie dodzwonię, wysyłam SMS-a z kilkoma wolnymi okienkami. Potwierdzenie terminu z adresem przychodzi SMS-em.",
      details: [
        `Dzwonię z numeru ${TELEFON}, w godzinach z ankiety. Zapisz go, żeby nie odrzucić połączenia`,
        "Nie odbierzesz albo wolisz bez rozmowy? Dostajesz SMS-a z 2–3 wolnymi okienkami i odpisujesz, które pasuje",
        "Brak terminu w 14 dni = zwrot całości",
      ],
    },
    {
      meta: "Na sali · 60 minut",
      icon: "sala" as const,
      title: "Trenujesz, ja poprawiam",
      body: "Weź strój, buty na zmianę i wodę. Resztę biorę na siebie.",
      details: [
        "Po sesji karta z obciążeniami, zostaje u Ciebie",
      ],
    },
  ],
  ctaNote: "Zakup zajmuje dwie minuty. Godzinę wybierasz dopiero wtedy, gdy się odezwę.",
};

/* 8b · LOKALIZACJA ───────────────────────────────────────────────────── */

const LOKALIZACJA = {
  eyebrow: "Jedno miejsce, bez wyjątków",
  heading: "Trening personalny w centrum Łodzi: wyłącznie w Just GYM przy Piotrkowskiej",
  lead: "Nie dojeżdżam do domów i nie zmieniam sal. Każda sesja odbywa się na tej samej sali i na tym samym sprzęcie, więc to, co ustawimy w poniedziałek, sprawdzamy w czwartek w identycznych warunkach.",
  mapa: {
    address: "ul. Piotrkowska 157A, Łódź",
    details: [
      "Budynek HiPiotrkowska, tuż przy Stajni Jednorożców, czyli węźle tramwajowym Piotrkowska Centrum na skrzyżowaniu Piotrkowskiej i al. Mickiewicza",
      "Dojazd tramwajem z większości dzielnic Łodzi: Śródmieście, Polesie, Górna, Widzew, Bałuty, Retkinia",
      "Sala 1800 m², pełna strefa wolnych ciężarów",
      "Wejście na salę nie jest w cenie sesji: potrzebujesz karnetu albo jednorazowego wejścia do Just GYM",
    ],
    query: "Just GYM Łódź Piotrkowska 157A",
  },
};

/* 9 · CENNIK ───────────────────────────────────────────────────────────
   <CennikWybor>: wybierasz liczbę sesji, ciemny panel pokazuje tylko ten
   wariant. Domyślnie otwarty pakiet 3 sesji (`featured`). Wspólne rzeczy
   stoją w panelu po lewej, różnice po prawej. Chcesz wrócić do rzędów?
   Podmień <CennikWybor> na <CennikRzedy>, dane pasują do obu.

   Przekreślone ceny są uczciwe: 450 i 750 to dokładnie tyle, ile
   zapłacisz, kupując te same sesje pojedynczo. Kontakt po zakupie jest
   w pasku wspólnym, więc lead mówi tylko o tym, czym różnią się warianty.
   ─────────────────────────────────────────────────────────────────────── */

const CENNIK = {
  heading: "Cennik",
  lead: "Każda sesja wygląda tak samo. Różni się tylko cena za godzinę i to, na ile z góry się umawiasz.",
  wspolne: [
    { ikona: "czas" as const, tekst: "60 minut jeden na jeden" },
    { ikona: "sala" as const, tekst: "Wejście na salę płatne osobno (karnet Just GYM)" },
    { ikona: "karta" as const, tekst: "Karta obciążeń po każdej sesji" },
    { ikona: "termin" as const, tekst: "Termin ustalamy w 24 h po zakupie" },
  ],
  items: [
    {
      name: "Pojedyncza sesja",
      krotko: "1 sesja",
      stawka: "150 zł / sesja",
      lead: "Masz już plan i chcesz sprawdzić jedno, dwa ćwiczenia albo przychodzisz nieregularnie.",
      price: "150 zł",
      note: "60 minut",
      outcome: "Wychodzisz wiedząc, co psuje się w jednym ruchu i jak to poprawić samemu.",
      href: KOSZYK.jeden,
      cta: "Kup sesję",
    },
    {
      name: "Pakiet 3 sesji",
      krotko: "3 sesje",
      stawka: "140 zł / sesja",
      lead: "Trzy główne ruchy. Tyle zwykle trzeba, żeby przestały się sypać przy zmęczeniu.",
      price: "420 zł",
      oldPrice: "450 zł",
      save: "Taniej o 30 zł",
      note: "140 zł za sesję · bez daty ważności",
      includes: [
        "Po jednym ruchu na sesję: przysiad, martwy ciąg, wyciskanie",
        "Plan na dni bez sesji",
        "Po trzeciej sesji karta pierwsza obok trzeciej",
        "Kontakt na wiadomości między treningami",
      ],
      outcome: "Wiesz, co robisz w trzech ćwiczeniach, na których stoi cały trening.",
      href: KOSZYK.trzy,
      cta: "Kup pakiet",
      featured: true,
      ribbon: "Najczęściej wybierany",
    },
    {
      name: "Pakiet 5 sesji",
      krotko: "5 sesji",
      stawka: "130 zł / sesja",
      lead: "Wracasz po przerwie albo po kontuzji i chcesz wyjść z tego z własnym warsztatem.",
      price: "650 zł",
      oldPrice: "750 zł",
      save: "Taniej o 100 zł",
      note: "130 zł za sesję · najniższa cena za godzinę",
      includes: [
        "Wszystko z pakietu trzech",
        "Praca wokół ograniczenia: plecy, kolano, bark albo siedząca praca",
        "Rozpisany tydzień między sesjami",
        "Plan na osiem tygodni po ostatniej sesji",
      ],
      outcome: "Trenujesz sam i wiesz, kiedy dołożyć ciężar.",
      href: KOSZYK.piec,
      cta: "Kup pakiet",
    },
  ],
  trust: [
    "Brak terminu w 14 dni — pełny zwrot",
    "Pakiety bez daty ważności",
    "Rachunek na życzenie",
  ],
};

/* 10 · KTO PROWADZI ────────────────────────────────────────────────────
   Ten sam opis stoi na stronie online i na stronie produktów.
   ─────────────────────────────────────────────────────────────────────── */

const TEAM = {
  heading: "Kto prowadzi sesje",
  name: "Maksymilian Lehman",
  role: "Trener personalny · Just GYM, Piotrkowska 157A, Łódź",
  paragraphs: [
    "Pracuję z ludźmi o różnym poziomie zaawansowania i w bardzo różnym wieku. Prowadzę zarówno treningi pod cele sportowe, jak i treningi prozdrowotne. Nie boję się pracy z osobami po kontuzjach i wiem, kiedy trzeba skorzystać z pomocy fizjoterapeuty albo ortopedy.",
    "Pierwszy raz przyszedłem na siłownię 9 lat temu. Zaczynałem od pustej sztangi i nie potrafiłem podciągnąć się na drążku. Próbowałem treningu kulturystycznego i kalisteniki, aż odkryłem trójbój siłowy. Największą motywacją okazały się dla mnie wyniki w przysiadzie, wyciskaniu i martwym ciągu.",
    "Jestem pasjonatem i zawodnikiem trójboju siłowego, ale na co dzień pracuję z lekarzami, informatykami, sportowcami, kobietami po ciąży i osobami, które dopiero zaczynają.",
  ],
};

/* 13 · FINALNE CTA — GWARANCJA (ZOBOWIĄZANIA) ─────────────────────────
   Stoi na samym końcu z id="rezerwacja": tu prowadzi każdy przycisk.
   Przycisk kupuje jedną sesję (KOSZYK.jeden). Sekcja zostaje z id
   „rezerwacja", żeby stare linki z kotwicą dalej działały.

   Dawna sekcja <Urgency> wypadła. Jej jedyna treść, limit osób
   prowadzonych naraz, siedzi teraz w `note` pod przyciskiem, lżej.

   Bez zwrotu pieniędzy i bez darmowych sesji. Gwarancja stoi na czterech
   rzeczach, które klient sprawdzi sam już po pierwszej godzinie. Każdy
   punkt jest w Twojej kontroli, więc nie ma sporu o to, czy „był efekt".

   Punkt trzeci robi najwięcej: trener, który mówi „wystarczy Ci jedna
   sesja", przestaje brzmieć jak sprzedawca. Dla sceptyka to mocniejszy
   dowód uczciwości niż jakakolwiek obietnica zwrotu.

   `dowod`: jedno zdanie z kart, tylko prawdziwe liczby. Puste = ukryte.
   ─────────────────────────────────────────────────────────────────────── */

const ZOBOWIAZANIA = {
  eyebrow: "Moja gwarancja",
  title: "Z każdej sesji wychodzisz z konkretem, a nie z wrażeniem",
  body: "Nie obiecuję kilogramów w terminie, bo nikt uczciwy tego nie zrobi. Obiecuję cztery rzeczy, z których rozliczysz mnie sam.",
  points: [
    {
      ikona: "uwaga" as const,
      kiedy: "Na sesji",
      tytul: "Całe 60 minut patrzę tylko na Ciebie",
      opis: "Bez drugiej osoby w tym samym terminie i bez telefonu w ręku.",
    },
    {
      ikona: "karta" as const,
      kiedy: "Tego samego dnia",
      tytul: "Karta z ciężarami na piśmie",
      opis: "Z jedną rzeczą do poprawy. Zostaje u Ciebie.",
    },
    {
      ikona: "rozmowa" as const,
      kiedy: "Po 1. sesji",
      tytul: "Mówię wprost, ile sesji potrzebujesz",
      opis: "Jeśli wystarczy jedna, usłyszysz to ode mnie.",
    },
    {
      ikona: "progres" as const,
      kiedy: "Po 3. sesji",
      tytul: "Karta pierwsza obok trzeciej",
      opis: "Jeśli coś stoi, mówię dokładnie co i dlaczego.",
    },
  ],
  note: `Zakup zajmuje dwie minuty: BLIK, karta albo Przelewy24. Prowadzę maksymalnie ${MAX_OSOB} osób naraz, więc wieczorne godziny schodzą pierwsze.`,
  // TODO: np. "Z kart obciążeń: 48 z 50 osób po trzech sesjach dźwigało więcej niż na pierwszej."
  dowod: undefined as string | undefined,
};

/* 13 · FAQ ───────────────────────────────────────────────────────────── */

const FAQ = [
  {
    q: "Gdzie w Łodzi odbywają się treningi?",
    a: "Just GYM, ul. Piotrkowska 157A w Łodzi, budynek HiPiotrkowska przy Stajni Jednorożców. Wejście na salę nie jest wliczone w cenę sesji: potrzebujesz karnetu albo jednorazowego wejścia do Just GYM. Trenuję wyłącznie tutaj: nie dojeżdżam do domów i nie prowadzę sesji w innych klubach, bo każdą poprawkę sprawdzamy potem na tym samym sprzęcie.",
  },
  {
    q: "Jak dojechać na trening do Just GYM w centrum Łodzi?",
    a: "Najbliższy przystanek to Piotrkowska Centrum przy Stajni Jednorożców, główny węzeł tramwajowy Łodzi. Z przystanku do Just GYM (Piotrkowska 157A, budynek HiPiotrkowska) dojdziesz w kilka minut. Tramwajem dojedziesz tu z większości dzielnic: Śródmieścia, Polesia, Górnej, Widzewa, Bałut czy Retkini. Dlatego trenują u mnie osoby z całej Łodzi, nie tylko z centrum.",
  },
  {
    q: "Płacę z góry. Jak ustalamy termin?",
    a: `Po płatności w ciągu minuty dostajesz maila z potwierdzeniem i linkiem do krótkiej ankiety. W ankiecie zaznaczasz, czy wolisz rozmowę, czy SMS-y, i o której mogę się odezwać. W ciągu 24 h w dni robocze dzwonię z numeru ${TELEFON}. Jeśli się nie dodzwonię, dostajesz SMS-a z dwoma, trzema wolnymi okienkami. Odpisujesz, które pasuje, a potwierdzenie z adresem przychodzi SMS-em. Jeśli w ciągu 14 dni nie znajdziemy wspólnego terminu, oddaję całą kwotę. A jeśli do 24 h nic nie przyjdzie, zadzwoń: to znaczy, że coś zgubiło się po mojej stronie.`,
  },
  {
    q: "A jeśli po tych sesjach nic się nie zmieni?",
    a: "Rozstrzyga karta obciążeń, nie wrażenie. Po trzeciej sesji kładziemy ją obok pierwszej. Jeśli coś stoi, mówię wprost, co i dlaczego: technika, regeneracja, jedzenie albo liczba treningów w tygodniu, i co z tym zrobić. Nie namawiam na kolejny pakiet, jeśli problem leży poza salą.",
  },
  {
    q: "Co, jeśli będę musiał odwołać trening?",
    a: "Odwołanie do 24 h przed — przekładamy na inny termin, bez kosztów i bez limitu. Później przełożę pierwszy raz bez pytań; przy kolejnych sesja przepada, bo tej godziny nie odsprzedam już nikomu. Choroba jest wyjątkiem: napisz, znajdziemy termin.",
  },
  {
    q: "Ile kosztuje trener personalny w Łodzi?",
    a: "W Łodzi pojedynczy trening personalny na siłowni kosztuje zwykle od 120 do 220 zł. U mnie pojedyncza sesja 150 zł, pakiet 3 sesji 420 zł (140 zł za godzinę), pakiet 5 sesji 650 zł (130 zł za godzinę). Ceny nie obejmują wejścia na salę: karnet albo jednorazowe wejście kupujesz w Just GYM. Pakiety nie mają daty ważności. Niewykorzystane sesje nie podlegają zwrotowi.",
  },
  {
    q: "Dlaczego pakiety są tak małe? Wszędzie sprzedają po dziesięć sesji.",
    a: "Bo trzy albo pięć godzin wystarczy, żeby ustawić ruchy, na których stoi cały trening. Pakiet na dziesięć sesji sprzedaje się dlatego, że jest wygodniejszy dla trenera, a nie dlatego, że tyle trzeba. Po naszych sesjach masz wracać na salę sam — jeśli za pół roku coś się posypie, przychodzisz na jedną sesję kontrolną zamiast kupować cykl od nowa.",
  },
  {
    q: "Mam pracę i dzieci. Nie mam czasu trenować kilka razy w tygodniu.",
    a: "Nasze sesje to jedna godzina w tygodniu przez trzy albo pięć tygodni — resztę robisz sam, wtedy, kiedy Ci pasuje, według krótkiego planu, który dostajesz po drodze. Nie buduję niczego, co wymaga sześciu treningów tygodniowo, bo taki plan i tak wypada po trzech tygodniach. Plan, który realnie wykonasz, da Ci więcej niż lepszy plan porzucony w połowie.",
  },
  {
    q: "Nigdy nie byłam na siłowni. Poradzę sobie?",
    a: "To najczęstszy punkt startu wśród moich podopiecznych. Pierwsze sesje to nauka ruchu z minimalnym obciążeniem — nie ma progu wejścia, do którego trzeba się wcześniej przygotować. Mówię, co robimy, ustawiam sprzęt i pilnuję techniki, więc nie musisz nic wiedzieć przed pierwszym wejściem.",
  },
  {
    q: "Wstydzę się siłowni i tego, że wszyscy widzą, że nie wiem, co robić.",
    a: "Na treningu personalnym nie jesteś sama pośrodku sali — masz obok siebie kogoś, kto prowadzi. Możemy zacząć w godzinach, w których na sali jest najmniej ludzi, i przez pierwsze tygodnie pracować w kącie z wolnymi ciężarami, bez sprzętu, przy którym trzeba się rozglądać. Po dwóch, trzech sesjach ten problem zwykle znika sam.",
  },
  {
    q: "Nie chcę zrobić się „za duża” od ciężarów.",
    a: "Nie zbudujesz przypadkiem sylwetki kulturystki — to wymaga lat pracy i jedzenia ustawionego pod ten jeden cel. Trening siłowy przy Twoim normalnym jedzeniu zwykle sprawia, że obwody się zmniejszają, a ciało robi się jędrniejsze, nie większe. Jeśli mimo to chcesz mniej pracy nad konkretną partią, wystarczy to powiedzieć na pierwszej sesji.",
  },
  {
    q: "Czy muszę liczyć kalorie?",
    a: "Nie musisz, ale polecam. Liczenie kalorii bardzo ułatwia sprawę: widzisz czarno na białym, ile naprawdę jesz, zamiast zgadywać, dlaczego waga stoi. Spróbuj przez tydzień: wpisuj wszystko do aplikacji, np. Fitatu albo MyFitnessPal. Po tygodniu wiesz o swoim jedzeniu więcej niż po roku zgadywania, a potem sam decydujesz, czy liczysz dalej. Nie jestem dietetykiem i nie układam jadłospisów leczniczych: jeśli Twój przypadek tego wymaga, powiem wprost.",
  },
  {
    q: "Mam kontuzję, bóle pleców albo siedzącą pracę.",
    a: "Napisz o tym w ankiecie po zakupie i przynieś zalecenia od fizjoterapeuty, jeśli je masz. Plan układamy wokół tego ograniczenia, nie obok niego. Jeśli etap wymaga jeszcze pracy gabinetowej, powiem to na pierwszej sesji i wrócimy do tematu później — nie sprzedam Ci pakietu w miejscu, w którym potrzebujesz kogoś innego.",
  },
  {
    q: "Kupiłem już plany i żadnego nie dokończyłem. Czemu tym razem ma być inaczej?",
    a: "Bo do tej pory nikt nie zauważył, kiedy odpuszczasz. Plan z internetu nie widzi, że nie pojawiłeś się przez dwa tygodnie, i nie widzi, że przez pół roku powtarzasz ten sam błąd. Umówiona godzina, druga osoba czekająca na sali i karta z obciążeniami rozwiązują dokładnie ten problem — i to jest jedyna rzecz, która się tu zmienia. Reszta wygląda tak samo jak wcześniej.",
  },
  {
    q: "Mam wesele/wakacje za kilka miesięcy. Zdążę?",
    a: "Powiedz o tej dacie na pierwszym treningu, bo zmienia ona kolejność pracy. Nie obiecam Ci konkretnej liczby kilogramów w konkretnym terminie — nikt uczciwy tego nie zrobi. Powiem natomiast na pierwszej sesji, co realnie da się zmienić w tym czasie, i ułożymy plan pod tę datę zamiast pod ogólny cel.",
  },
  {
    q: "Czy pakiet się przeterminuje, jeśli zrobię przerwę?",
    a: "Nie. Sesje z pakietu wykorzystujesz w swoim tempie, bez daty ważności. Jeśli wypadnie Ci miesiąc, wracasz do tej samej puli. Pieniędzy za niewykorzystane sesje nie zwracam, ale sesje czekają na Ciebie bez terminu.",
  },
  {
    q: "Dla kogo to nie jest?",
    a: "Jeśli nie jesteś w stanie regularnie dojeżdżać na Piotrkowską, ta współpraca się nie sprawdzi, bo cała metoda stoi na tej jednej sali. Jeśli trenujesz od lat, technikę masz poukładaną i szukasz wyłącznie planu — płacenie za moją obecność na sali jest zbędnym kosztem i powiem Ci to po pierwszej sesji. I jeśli szukasz kogoś, kto będzie krzyczał nad uchem i robił z treningu wyzwanie charakteru: to nie tutaj.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   SKŁAD — kolejność sekcji na stronie
   ═══════════════════════════════════════════════════════════════════════ */

export default function Page() {
  return (
    <>
      <JsonLd dane={[usluga("sala", "/trening-stacjonarny"), faq(FAQ)]} />
      <Header cta={CTA} ctaHref={REZERWACJA} />

      <main>
        {/* 1 · hero + zdjęcie */}
        <HeroShot
          proof={HERO.proof}
          title={HERO.title}
          proofInTitle
          points={HERO.points}
          reassurance={HERO.reassurance}
          cta={CTA}
          ctaHref={REZERWACJA}
          {...kadr(Z.hero)}
        />

        {/* 2 · pasek */}
        <IconStrip items={ICON_STRIP} tone="fog" />

        {/* 3 · dwie historie. Zdejmij flagę, gdy Jarosław potwierdzi swoją. */}
        {POKAZ_PLACEHOLDERY && (
          <CaseStudies {...CASE_STUDIES} cta={CTA} ctaHref={REZERWACJA} />
        )}

        {/* 4 · największy ból */}
        <PainCenter {...PAIN} cta={CTA} ctaHref={REZERWACJA} />

        {/* 5 · trzy korzyści */}
        <Benefits
          items={zBlokami(BENEFITS, [Z.korzysc1, Z.korzysc2, Z.korzysc3])}
          cta={CTA}
          ctaHref={REZERWACJA}
        />

        {/* 6 · liczby */}
        <Stats {...STATS} cta={CTA} ctaHref={REZERWACJA} />

        {/* 7 · sześć rzeczy */}
        <Differentiators {...DIFFERENTIATORS} cta={CTA} ctaHref={REZERWACJA} />

        {/* 8 · od zakupu do pierwszej serii + kolejność kontaktu */}
        <OdZakupu {...ZAKUP} cta={CTA} ctaHref={REZERWACJA} />

        {/* 8b · lokalizacja */}
        <Lokalizacja {...LOKALIZACJA} cta={CTA} ctaHref={REZERWACJA} />

        {/* 9 · cennik */}
        <CennikWybor {...CENNIK} />

        {/* 10 · kto prowadzi — pełny odstęp od góry pod szarym cennikiem */}
        <Team {...TEAM} {...kadr(Z.team)} cta={CTA} ctaHref={REZERWACJA} odstepGora />

        {/* 11 · pasek */}
        <IconStrip items={ICON_STRIP} />

        {/* 12 · faq */}
        <Faq
          heading="Pytania, które słyszę najczęściej"
          items={FAQ}
          cta={CTA}
          ctaHref={REZERWACJA}
        />

        {/* 13 · FINALNE CTA: gwarancja. Cel wszystkich przycisków. */}
        <Zobowiazania
          {...ZOBOWIAZANIA}
          id="rezerwacja"
          cta={CTA}
          ctaHref={REZERWACJA}
        />
      </main>

      <Footer />

      <StickyCta
        label={CTA}
        href={REZERWACJA}
        note="Termin ustalamy razem po zakupie"
      />
    </>
  );
}