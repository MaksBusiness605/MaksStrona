// PLIK: app/tresc/zdjecia.ts · ZDJĘCIA · wszystkie grafiki trzech stron (poprawka zBlokami pod npm run build)
import type { StaticImageData } from "next/image";

import ktoprowadzi from "@/public/KtoProwadzi.jpeg";

/* Zdjęcia strony /trening-stacjonarny. Leżą w /public, tak samo jak
   KtoProwadzi.jpeg — jeśli przeniesiesz je do podkatalogu, popraw ścieżki.
   stacjonarny2 i stacjonarny3 stoją dziś w sekcji dowodu jako `poster`
   bez pliku wideo: kafel pokazuje wtedy sam kadr, bez przycisku play.

   Korzyści na wszystkich trzech stronach to pliki SVG w /public,
   podawane ścieżką w cudzysłowie, nie importem. Import .svg zależy od
   konfiguracji Nexta (przy SVGR zwraca komponent, nie obrazek), a sama
   ścieżka działa zawsze.

   stacjonarny4.png i stacjonarny5.png nie są dziś nigdzie użyte. Gdy
   będą potrzebne, dopisz import i wstaw zmienną w pole `plik`. */
import stacjonarny2 from "@/public/stacjonarny2.png";
import stacjonarny3 from "@/public/stacjonarny3.png";

export type Zrodlo = string | StaticImageData;

/** Pojedynczy kadr. Bez `plik` na stronie zostaje brief. */
export type Foto = {
  /** Import z /public, ścieżka w cudzysłowie albo `makieta(…)`. */
  plik?: Zrodlo;
  /** Co widać na zdjęciu. Pusty string dla zdjęć dekoracyjnych. */
  alt: string;
  /** Zamówienie dla fotografa. Widoczne, dopóki nie ma pliku. */
  brief: string;
};

/**
 * Opinia wideo. Bez `plik` i bez `poster` zostaje ciemny kafel z briefem.
 * Sam `poster` bez `plik` wyświetla zdjęcie — tak stoją dziś opinia1
 * i opinia2, dopóki nie ma nagrań.
 *
 * Uwaga: .mp4 podajesz ścieżką w cudzysłowie, nie importem — Next nie
 * ma domyślnego loadera dla wideo. `poster` to zwykłe zdjęcie, więc tam
 * import działa normalnie.
 */
export type Nagranie = {
  /** Ścieżka do pliku wideo, np. "/wideo/opinia-1.mp4". */
  plik?: string;
  /** Klatka z twarzą w trakcie mówienia. Bez niej kafel jest czarny. */
  poster?: Zrodlo;
  /** Plik .vtt, jeśli napisy nie są wypalone w obrazie. */
  napisy?: string;
  /** Zamówienie nagrania. Widoczne, dopóki nie ma pliku. */
  brief: string;
};

/* ─────────────────────────────────────────────────────── MAKIETY
   SVG rysowany w locie i zapisany jako data URI. Zero plików, zero
   requestów, działa w każdym <img src>.

   Trzy proporcje odpowiadają temu, co przycinają komponenty:
   PION 0,786 (hero, autor) · POZIOM 1,272 (korzyści, historie) ·
   SZEROKI 2,285 (tło domknięcia).

   `ciemna` odwraca kolory — używamy jej tam, gdzie zdjęcie idzie pod
   biały tekst na 25 % krycia, żeby od razu było widać, jak się zachowa.

   `motyw` wybiera rysunek sceny. Rysunki żyją w stałej MOTYWY niżej,
   w układzie współrzędnych 200 × 120, i są skalowane na środek kadru.
   Dopisanie nowego motywu to jedna pozycja w tym obiekcie.
   ─────────────────────────────────────────────────────────────────── */

const PROPORCJE = {
  pion: [800, 1018],
  poziom: [1272, 1000],
  szeroki: [1600, 700],
} as const;

type Proporcja = keyof typeof PROPORCJE;

/**
 * Rysunki scen. Układ współrzędnych 200 × 120, linie bez wypełnienia.
 * `stroke="currentColor"` dziedziczy kolor z grupy, więc ten sam motyw
 * działa na jasnym i na ciemnym tle. Klasa "a" oznacza element w kolorze
 * akcentu: zawsze jeden na rysunek, ten, o który w sekcji chodzi.
 */
const MOTYWY = {
  /** Sztanga z zaznaczonym punktem korekty. */
  sztanga: `
<line x1="14" y1="64" x2="186" y2="64"/>
<rect x="34" y="38" width="12" height="52" rx="3"/>
<rect x="50" y="46" width="8" height="36" rx="2"/>
<rect x="154" y="38" width="12" height="52" rx="3"/>
<rect x="142" y="46" width="8" height="36" rx="2"/>
<g class="a"><path d="M100 22v20"/><path d="M92 36l8 8 8-8"/></g>`,

  /** Sztanga plus łuk pokazujący prowadzenie ruchu dłonią. */
  korekta: `
<line x1="14" y1="74" x2="186" y2="74"/>
<rect x="34" y="50" width="12" height="48" rx="3"/>
<rect x="154" y="50" width="12" height="48" rx="3"/>
<path d="M60 26q40-14 80 0"/>
<g class="a"><path d="M100 18v16"/><circle cx="100" cy="42" r="6"/></g>`,

  /** Telefon z otwartym planem, oparty o sztangę. */
  telefon: `
<line x1="10" y1="96" x2="190" y2="96"/>
<rect x="76" y="14" width="48" height="86" rx="7"/>
<path d="M86 34h28M86 46h28M86 58h20"/>
<g class="a"><path d="M86 72h28"/><path d="M86 84h16"/></g>`,

  /** Telefon na statywie i linia widzenia do sztangi. */
  statyw: `
<rect x="24" y="24" width="30" height="48" rx="4"/>
<path d="M39 72v10M39 82l-16 26M39 82l16 26M39 82v26"/>
<line x1="120" y1="78" x2="188" y2="78"/>
<rect x="132" y="60" width="9" height="36" rx="2"/>
<rect x="170" y="60" width="9" height="36" rx="2"/>
<g class="a"><path stroke-dasharray="7 7" d="M58 52h56"/><path d="M106 46l8 6-8 6"/></g>`,

  /** Arkusz progresji: tabela ze słupkami rosnącymi w prawo. */
  arkusz: `
<rect x="16" y="12" width="168" height="96" rx="5"/>
<path d="M16 34h168M16 58h168M16 82h168M64 12v96M112 12v96"/>
<g class="a"><path d="M126 100V88M144 100V74M162 100V58"/></g>`,

  /** Ankieta wejściowa: pola do zaznaczenia. */
  ankieta: `
<rect x="30" y="8" width="140" height="104" rx="6"/>
<rect x="44" y="26" width="14" height="14" rx="3"/><path d="M68 33h58"/>
<rect x="44" y="52" width="14" height="14" rx="3"/><path d="M68 59h74"/>
<rect x="44" y="78" width="14" height="14" rx="3"/><path d="M68 85h44"/>
<g class="a"><path d="M47 59l4 4 7-8"/></g>`,

  /** Check-in i odpowiedź: dwa kafle rozmowy. */
  czat: `
<path d="M16 16h104v36H40l-12 12V52H16z"/>
<g class="a"><path d="M184 60H80v36h80l12 12V96h12z"/></g>
<path d="M32 30h72M32 40h48"/>`,

  /** Kadr wideo z analizą techniki. */
  wideo: `
<rect x="18" y="14" width="164" height="92" rx="5"/>
<path d="M92 46l26 14-26 14z"/>
<g class="a"><path d="M40 92l22-30 24 14"/><circle cx="62" cy="62" r="5"/></g>`,

  /** Notatka po treningu: trzy rzeczy do poprawy. */
  notatka: `
<rect x="46" y="8" width="108" height="104" rx="5"/>
<path d="M78 34h54M78 60h54M78 86h36"/>
<g class="a"><path d="M62 30h8v8h-8zM62 56h8v8h-8zM62 82h8v8h-8z"/></g>`,

  /** Kąt do ćwiczeń w domu: mata i hantle. */
  dom: `
<path d="M44 84h114l-24 22H20z"/>
<line x1="62" y1="52" x2="104" y2="52"/>
<rect x="52" y="40" width="12" height="24" rx="3"/>
<rect x="102" y="40" width="12" height="24" rx="3"/>
<g class="a"><line x1="128" y1="66" x2="160" y2="66"/><rect x="120" y="56" width="10" height="20" rx="3"/><rect x="158" y="56" width="10" height="20" rx="3"/></g>`,

  /** Stojak w pustej sali: tło pod tekst. */
  stojak: `
<path d="M40 110V20M160 110V20M28 110h24M148 110h24"/>
<line x1="20" y1="40" x2="180" y2="40"/>
<rect x="52" y="22" width="11" height="36" rx="3"/>
<rect x="137" y="22" width="11" height="36" rx="3"/>
<g class="a"><path d="M40 62h120"/></g>`,

  /** Wzrost obciążeń: prosty wykres. */
  wykres: `
<path d="M24 14v92h156"/>
<path d="M40 88l34-18 30 12 34-30 26-14"/>
<g class="a"><circle cx="164" cy="38" r="7"/><path d="M164 52v40"/></g>`,
} as const;

type Motyw = keyof typeof MOTYWY;

function makieta(
  proporcja: Proporcja,
  tytul: string,
  podpis: string,
  motyw: Motyw,
  ciemna = false,
): string {
  const [w, h] = PROPORCJE[proporcja];
  const tlo = ciemna ? "#14181D" : "#EDEFF2";
  const linia = ciemna ? "#FFFFFF" : "#14181D";
  const tekst = ciemna ? "#FFFFFF" : "#14181D";
  const drugi = ciemna ? "#9AA1AC" : "#6B7280";
  const krycie = ciemna ? 0.1 : 0.07;
  const m = 34;
  const c = 46;
  const tp = Math.round(Math.min(w, h) * 0.062);
  const pp = Math.round(Math.min(w, h) * 0.032);
  const f = "Helvetica Neue, Arial, sans-serif";

  /* Rysunek zajmuje 52 % szerokości kadru i siedzi nad podpisem.
     Skala liczona z szerokości, bo każdy motyw jest szerszy niż wyższy. */
  const sw = w * 0.52;
  const sk = sw / 200;
  const sh = 120 * sk;
  const sx = (w - sw) / 2;
  const sy = h / 2 - sh / 2 - tp * 0.9;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><pattern id="k" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0v42" fill="none" stroke="${linia}" stroke-opacity="${krycie}" stroke-width="1"/></pattern><style>.a{stroke:#D2F34C}</style></defs>
<rect width="${w}" height="${h}" fill="${tlo}"/><rect width="${w}" height="${h}" fill="url(#k)"/>
<g fill="none" stroke="#D2F34C" stroke-width="6"><path d="M${m} ${m + c}V${m}h${c}"/><path d="M${w - m - c} ${m}h${c}v${c}"/><path d="M${m} ${h - m - c}V${h - m}h${c}"/><path d="M${w - m - c} ${h - m}h${c}v-${c}"/></g>
<g transform="translate(${sx} ${sy}) scale(${sk})" fill="none" stroke="${linia}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">${MOTYWY[motyw]}</g>
<text x="${w / 2}" y="${Math.round(h / 2 + tp * 0.8)}" text-anchor="middle" font-family="${f}" font-size="${tp}" font-weight="700" fill="${tekst}">${tytul}</text>
<text x="${w / 2}" y="${Math.round(h / 2 + tp * 2.1)}" text-anchor="middle" font-family="${f}" font-size="${pp}" letter-spacing="2" fill="${drugi}">${podpis}</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/* ═══════════════════════════════════════════════════════════════════════
   DWIE HISTORIE — wspólne dla wszystkich trzech stron

   Sekcja <CaseStudies> jest na każdej stronie 1:1 ta sama, więc kadry
   też są wspólne. Sloty przypadek1 i przypadek2 w każdym kluczu niżej
   wskazują na te dwie stałe. Podmieniasz plik tutaj, zmienia się
   wszędzie. Na zdjęciu ma być osoba z tej historii, w trakcie
   treningu na sali.
   ═══════════════════════════════════════════════════════════════════════ */

const PRZYPADEK1 = {
  plik: "/Opinia 1.jpg",
  alt: "[Imię] w górnej fazie martwego ciągu, sztanga z talerzami olimpijskimi",
  brief:
    "KADR poziomy 1,618, z boku, na wysokości sztangi. " +
    "W KADRZE: osoba z historii 1 w trakcie ćwiczenia, o którym mówi historia. Jeśli nie ma zgody na twarz, kadruj od barków w dół. " +
    "ŚWIATŁO: jak w pozostałych kadrach z sali, żeby historia nie wyglądała na wklejkę. " +
    "NIE: zdjęcia innej osoby niż opisana, zestawienia przed i po, kadru z lustra.",
} satisfies Foto;

const PRZYPADEK2 = {
  plik: stacjonarny3,
  alt: "[Imię] w trakcie treningu",
  brief:
    "KADR poziomy 1,618, z boku, na wysokości sztangi. " +
    "W KADRZE: osoba z historii 2 w trakcie ćwiczenia, o którym mówi historia. Jeśli nie ma zgody na twarz, kadruj od barków w dół. " +
    "ŚWIATŁO: jak w pozostałych kadrach z sali. " +
    "NIE: zdjęcia innej osoby niż opisana, zestawienia przed i po, kadru z lustra.",
} satisfies Foto;

/* ═══════════════════════════════════════════════════════════════════════
   TU PODPINASZ PLIKI

   Każdy brief ma ten sam układ i ta kolejność nie jest przypadkowa:
     KADR     · proporcja, wysokość kamery, ogniskowa, orientacja
     W KADRZE · co dokładnie widać, licząc od pierwszego planu
     ŚWIATŁO  · źródło i pora, żeby seria trzymała się kupy
     NIE      · czego w kadrze być nie może
   Ostatnia linia jest najważniejsza: to ona pilnuje, żeby nie wrócił
   stock i pozowana sylwetka.

   Brief zostaje w pliku także wtedy, gdy zdjęcie już jest — służy jako
   zamówienie na powtórkę, gdy będziesz podmieniać kadr.

   SEKCJA DWÓCH HISTORII (<CaseStudies>, pozycja 3) jest na każdej
   z trzech stron identyczna, więc sloty `przypadek1` i `przypadek2`
   wskazują wszędzie na wspólne stałe PRZYPADEK1 i PRZYPADEK2. Na
   stronie wchodzą przez `...blok(Z.przypadek1)` w elemencie `items`.
   Sloty `historia1–3` to zapas, żadna strona ich dziś nie używa.
   ═══════════════════════════════════════════════════════════════════════ */

export const ZDJECIA = {
  /* ─────────────────────────────────────────────────────────────────────
     1 · /trening-stacjonarny

     Podpięte pliki: hero = hero-stacjonarny.jpg, pierwsza historia =
     Opinia 1.jpg, druga = stacjonarny3, korzyści = korzysc1.svg,
     korzysc2.svg, korzysc3.svg.
     Sloty opinia1 i opinia2 zostają na wypadek powrotu do nagrań.
     ───────────────────────────────────────────────────────────────────── */
  stacjonarny: {
    hero: {
      plik: "/hero-stacjonarny.jpg",
      alt: "Asekuracja przy wyciskaniu na ławce: trener stoi nad sztangą, podopieczna w dolnej fazie ruchu",
      brief:
        "KADR pionowy 4:5, aparat na wysokości klatki piersiowej, z boku pod kątem 45°, ogniskowa 35–50 mm, podopieczny w kadrze od kolan w górę. " +
        "W KADRZE: podopieczny w dolnej fazie ruchu przy sztandze, dłoń trenera oparta o biodro albo łopatkę, twarz trenera skierowana na sztangę, nie w obiektyw. W tle prawdziwa sala: stojak, talerze, ktoś ćwiczący poza ostrością. " +
        "ŚWIATŁO: dzienne od okna z boku, bez lampy błyskowej, godzina, o której faktycznie prowadzisz sesje. " +
        "NIE: spojrzenia do obiektywu, uśmiechu na komendę, pustej sali z wyłączonym światłem, kciuka w górę, sprzętu, którego nie ma w Twojej siłowni.",
    } satisfies Foto,

    korzysc1: {
      plik: "/korzysc1.svg",
      alt: "Seria dziesięciu powtórzeń przerwana w ósmym, w którym psuje się technika",
      brief:
        "KADR poziomy 1,272, aparat nisko, na wysokości sztangi, dokładnie z boku, ogniskowa 35 mm. " +
        "W KADRZE: moment oderwania sztangi od podłogi, widoczna linia pleców i ustawienie bioder, trener kucnięty obok w trakcie mówienia. Sztanga obciążona realnym ciężarem, talerze poobijane. " +
        "ŚWIATŁO: dzienne, kontrowe zza okna daje czytelną linię pleców. " +
        "NIE: idealnie czystych talerzy, pasa i rękawiczek do zdjęcia, kadru z góry, który spłaszcza pozycję.",
    } satisfies Foto,

    korzysc2: {
      plik: "/korzysc2.svg",
      alt: "Karta obciążeń z pięciu sesji przysiadu: rosnący ciężar i notatka do poprawy",
      brief:
        "KADR poziomy 1,272, z góry, prostopadle do kartki, ogniskowa 50 mm, kartka wypełnia 80 % kadru. " +
        "W KADRZE: prawdziwa karta obciążeń z kilku sesji, widoczne daty, ciężary i odręczna notatka „do poprawy”. Obok długopis i róg telefonu jako kontekst, kartka położona na ławce albo na podłodze sali. " +
        "ŚWIATŁO: dzienne, rozproszone, bez odblasku na papierze; cień dłoni nie może padać na zapis. " +
        "NIE: pustej kratki, wydrukowanej ładnej tabeli, nazwiska podopiecznego w kadrze, biurka w domu zamiast sali.",
    } satisfies Foto,

    korzysc3: {
      plik: "/korzysc3.svg",
      alt: "Wykres ciężaru w kolejnych tygodniach: trzy tygodnie z trenerem, potem trening samodzielny",
      brief:
        "KADR poziomy 1,272, aparat z dystansu 4–5 m, na wysokości oczu, ogniskowa 50–85 mm, postać mała w kadrze. " +
        "W KADRZE: podopieczny ćwiczy sam na tej samej sali, trenera nie ma. Widać kartę obciążeń leżącą na stojaku albo telefon oparty o sztangę. Zwykły dzień, przypadkowi ludzie w tle. " +
        "ŚWIATŁO: dzienne, bez ustawiania; ziarno i lekka nieostrość są tu zaletą. " +
        "NIE: trenera w kadrze, pozowanej sylwetki, pustej sali sugerującej sesję po godzinach.",
    } satisfies Foto,

    team: {
      plik: ktoprowadzi,
      alt: "Trener poprawiający ustawienie łopatek przy wyciskaniu",
      brief:
        "KADR pionowy 4:5, aparat na wysokości ławki, z boku, ogniskowa 50 mm, trener w kadrze do pasa. " +
        "W KADRZE: Ty w trakcie pracy: dłoń na łopatce podopiecznego przy wyciskaniu, wzrok na sztandze. Ubranie robocze, w którym realnie prowadzisz sesje, bez logotypów obcych marek. " +
        "ŚWIATŁO: dzienne od okna, twarz doświetlona, tło o stopień ciemniejsze. " +
        "NIE: portretu ze skrzyżowanymi rękami, koszulki z certyfikatem, białego tła, retuszu skóry. To samo ujęcie idzie na stronę o mnie i do coachingu online — spójność buduje rozpoznawalność.",
    } satisfies Foto,

    /* Sloty historia1–3 zostają w zapasie. Sekcja dwóch historii używa
       przypadek1 i przypadek2 niżej. */
    historia1: {
      plik: makieta("poziom", "Historia 1", "PRACA NAD ĆWICZENIEM", "sztanga"),
      alt: "",
      brief:
        "KADR poziomy 1,272, z boku, na wysokości sztangi, ogniskowa 35 mm. " +
        "W KADRZE: dokładnie ten ruch, o którym mówi historia, w wykonaniu tej osoby, w trakcie sesji. Jeśli nie masz zgody na twarz, kadruj od barków w dół albo ustaw się od tyłu. " +
        "ŚWIATŁO: jak w pozostałych kadrach z sali, żeby historia nie wyglądała na wklejkę. " +
        "NIE: zdjęcia innej osoby niż opisana, zestawienia „przed i po” w bieliźnie, kadru z lustra.",
    } satisfies Foto,

    historia2: {
      plik: makieta("poziom", "Historia 2", "KARTA PROGRESJI", "arkusz"),
      alt: "",
      brief:
        "KADR poziomy 1,272, z góry, prostopadle, ogniskowa 50 mm. " +
        "W KADRZE: karta progresji albo zrzut arkusza z tej współpracy, widoczne obciążenia z pierwszej i ostatniej sesji. " +
        "ŚWIATŁO: rozproszone dzienne, bez odblasku. " +
        "NIE: danych osobowych, kwot, numeru telefonu, powiadomień na pasku systemowym.",
    } satisfies Foto,

    historia3: {
      plik: makieta("poziom", "Historia 3", "SAMODZIELNY TRENING", "wykres"),
      alt: "",
      brief:
        "KADR poziomy 1,272, z dystansu, ogniskowa 50–85 mm. " +
        "W KADRZE: osoba, która skończyła pakiet i trenuje dalej sama na tej samej sali. " +
        "ŚWIATŁO: dzienne, zwykła pora treningu. " +
        "NIE: trenera w kadrze, pozowania, sali innej niż Twoja.",
    } satisfies Foto,

    /* Zdjęcia do dwóch historii (<CaseStudies>, pozycja 3): wspólne
       dla wszystkich trzech stron, definicja przy PRZYPADEK1/2 wyżej. */
    przypadek1: PRZYPADEK1,
    przypadek2: PRZYPADEK2,

    /* Zdjęcia do recenzji (<Recenzje>, pozycja 8b). Kwadrat, twarz
       w kadrze, telefon wystarczy. Bez pliku karta pokazuje inicjały,
       więc zdjęcia dokładasz po jednym, w miarę jak spływają zgody. */
    recenzja1: {
      plik: "/opinie/opinia-1.jpg",
      alt: "[Imię] w trakcie martwego ciągu",
      brief:
        "KADR kwadratowy 1:1, twarz i barki, z boku albo z półprofilu, w sali, w której trenuje. " +
        "W KADRZE: ta sama osoba, której dotyczy recenzja, w trakcie treningu, nie w pozie do zdjęcia. " +
        "ŚWIATŁO: jakie jest na sali, telefon wystarczy. " +
        "NIE: awatara z mediów społecznościowych, stocku, zdjęcia innej osoby niż autor recenzji.",
    } satisfies Foto,

    /* Nagrań jeszcze nie ma, więc w obu slotach stoi sam `poster`.
       Kafel pokazuje wtedy zdjęcie bez przycisku play — nie ma czego
       odtworzyć. Gdy dojdzie nagranie, dopisujesz `plik:
       "/wideo/opinia-1.mp4"` i ten sam poster staje się klatką startową. */
    opinia1: {
      poster: stacjonarny2,
      brief:
        "NAGRANIE 30–60 s, kadr 4:5, telefon na statywie na wysokości oczu, na sali, na której trenujecie. Mikrofon krawatowy, jeśli masz. " +
        "KTO: kobieta w redukcji — tej perspektywy brakuje na całej stronie. " +
        "PYTANIE, jedno: co robiłaś przed naszymi treningami i co konkretnie zmieniło się po ośmiu tygodniach. Nie podsuwaj odpowiedzi. " +
        "MONTAŻ: w pierwszych trzech sekundach ma paść zmiana, napisy wypalone w środkowej części kadru, bez podkładu muzycznego. Zgoda na piśmie: strona i reklamy.",
    } satisfies Nagranie,

    opinia2: {
      poster: stacjonarny3,
      brief:
        "NAGRANIE 30–60 s, kadr 4:5, ten sam statyw i ta sama sala co w pierwszym. " +
        "KTO: inny punkt startu niż w nagraniu pierwszym — powrót po kontuzji albo pierwszy raz na siłowni. Dwie podobne historie dowodzą tego samego dwa razy. " +
        "PYTANIE: czego się bałaś przed pierwszą sesją i co okazało się inne. " +
        "MONTAŻ: bez scenariusza i bez drugiego podejścia, potknięcia zostawiaj. Zgoda na piśmie.",
    } satisfies Nagranie,
  },

  /* ─────────────────────────────────────────────────────────────────────
     2 · /produkty — e-book, plan indywidualny, prowadzenie
     ───────────────────────────────────────────────────────────────────── */
  produkty: {
    hero: {
      plik: makieta("pion", "Hero", "TELEFON Z PLANEM", "telefon"),
      alt: "Telefon z otwartym planem oparty o sztangę, obok kartka z ciężarami",
      brief:
        "KADR pionowy 4:5, aparat nisko, na wysokości sztangi, ogniskowa 35–50 mm, ostrość na ekranie telefonu. " +
        "W KADRZE: telefon z otwartym planem oparty o gryf, obok kartka z odręcznie zapisanymi ciężarami i długopis. Na ekranie widać realny plan z panelu, czytelne nazwy ćwiczeń i serie. W tle rozmyta sala. " +
        "ŚWIATŁO: dzienne od okna, ekran telefonu jaśniejszy o stopień od otoczenia, jasność podkręcona do maksimum przed zdjęciem. " +
        "NIE: pustego ekranu, makiety w Figmie, powiadomień, ręki trzymającej telefon, żadnej sylwetki w kadrze — ta strona sprzedaje plan, nie obecność trenera.",
    } satisfies Foto,

    korzysc1: {
      plik: "/produkty-1-ankieta-wejsciowa.svg",
      alt: "Ankieta wejściowa z pytaniem o moment, w którym wcześniej odpadasz",
      brief:
        "KADR poziomy 1,272, zrzut ekranu z telefonu albo z przeglądarki, dosunięty do treści, marginesy przycięte. " +
        "W KADRZE: prawdziwa ankieta wejściowa, widoczne co najmniej trzy konkretne pytania, w tym to o moment, w którym człowiek zwykle odpada. Jedno pole zaznaczone, żeby było widać, że to formularz, a nie obrazek. " +
        "ŚWIATŁO: nie dotyczy, zrzut robisz w jasnym motywie interfejsu. " +
        "NIE: grafiki udającej formularz, pól z danymi osobowymi, paska adresu z localhost, powiadomień systemowych.",
    } satisfies Foto,

    korzysc2: {
      plik: "/produkty-2-progresja-z-kryterium.svg",
      alt: "Arkusz progresji z pięciu tygodni i kolumną decyzji o ciężarze",
      brief:
        "KADR poziomy 1,272, zrzut ekranu arkusza, wycinek 6–8 wierszy, powiększenie na tyle, żeby liczby dało się przeczytać na telefonie. " +
        "W KADRZE: kolumny tygodni, wpisane obciążenia i widoczna komórka z kryterium progresji — to jedyna rzecz, która odróżnia ten plik od zwykłej tabelki. Zaznacz ją kolorem tła, nie strzałką w edytorze. " +
        "ŚWIATŁO: nie dotyczy. " +
        "NIE: pustego arkusza, przykładowych liczb typu 100/100/100, imienia kupującego w nagłówku.",
    } satisfies Foto,

    korzysc3: {
      plik: "/produkty-3-plan-odporny-na-przerwe.svg",
      alt: "Dwa zamienniki, wersja 25 minut i protokół powrotu po przerwie",
      brief:
        "KADR poziomy 1,272, aparat na wysokości pasa, z rogu pomieszczenia, ogniskowa 24–35 mm, żeby złapać ciasne wnętrze. " +
        "W KADRZE: realny kąt do ćwiczeń: mata, dwa hantle, guma na drzwiach, telefon oparty o ścianę. Może być mała siłownia osiedlowa. Bałagan wokół jest tu argumentem, nie wadą. " +
        "ŚWIATŁO: dzienne z okna, wieczorem lampa sufitowa — ma wyglądać jak mieszkanie, nie jak showroom. " +
        "NIE: garażowej siłowni z Instagrama, kompletu sprzętu w jednym kolorze, człowieka w kadrze.",
    } satisfies Foto,

    team: {
      plik: ktoprowadzi,
      alt: "Trener w trakcie korekty ćwiczenia na sali",
      brief:
        "KADR pionowy 4:5, ogniskowa 50 mm, trener w kadrze do pasa, wzrok na ćwiczącym. " +
        "W KADRZE: to samo ujęcie co na stronie stacjonarnej — dosłownie ten sam plik. Spójność między stronami buduje rozpoznawalność szybciej niż trzy różne portrety. " +
        "ŚWIATŁO: dzienne od okna. " +
        "NIE: nowego portretu tylko na tę stronę, białego tła, ujęcia w studiu.",
    } satisfies Foto,

    /** Tło ciemnej belki domykającej (<FinalBand>). Zdjęcie idzie na 25 %
        krycia pod tekstem, więc wybierz kadr bez ważnych detali i bez
        twarzy w środku. Makieta jest tu ciemna, żeby od razu było widać,
        jak zachowa się tekst na wierzchu. */
    domkniecie: {
      plik: makieta("szeroki", "Domknięcie", "TŁO · 25% KRYCIA", "stojak", true),
      alt: "",
      brief:
        "KADR szeroki 2,285, aparat na wysokości pasa, ogniskowa 35 mm, kompozycja pusta w środku — tam siada tekst. " +
        "W KADRZE: pusta sala po godzinach albo stojak z talerzami, dużo ciemnych płaszczyzn, mało detalu. Ciekawe rzeczy trzymaj przy krawędziach. " +
        "ŚWIATŁO: niskie, jedno źródło z boku, ekspozycja o stopień pod — zdjęcie i tak idzie na 25 % krycia. " +
        "NIE: twarzy, napisów, logotypów, jasnego środka kadru, na którym biały tekst przestanie być czytelny. To jedyny slot na całej stronie, w którym stock jest do obrony.",
    } satisfies Foto,

    /* Slot historia3 został w zapasie. Sekcja dwóch historii używa
       przypadek1 i przypadek2 niżej. */
    historia3: {
      plik: makieta("poziom", "Historia 3", "PORÓWNANIE CYKLI", "wykres"),
      alt: "",
      brief:
        "KADR poziomy 1,272, zrzut ekranu albo zdjęcie dwóch kart obok siebie. " +
        "W KADRZE: obciążenia z pierwszego i drugiego cyklu w jednym kadrze, tak żeby różnicę dało się zobaczyć bez czytania podpisu. " +
        "ŚWIATŁO: rozproszone, jeśli fotografujesz papier. " +
        "NIE: wykresu narysowanego w Canvie, liczb, których nie masz w pliku źródłowym.",
    } satisfies Foto,

    /* Zdjęcia do dwóch historii (<CaseStudies>, pozycja 3): wspólne
       dla wszystkich trzech stron, definicja przy PRZYPADEK1/2 wyżej. */
    przypadek1: PRZYPADEK1,
    przypadek2: PRZYPADEK2,

    opinia1: {
      brief:
        "NAGRANIE 30–60 s, kadr 4:5, telefon na statywie na wysokości oczu, w miejscu, w którym ta osoba trenuje. " +
        "KTO: kobieta, która wcześniej kupiła gotowy plan i utknęła. Domyka wątek z sekcji bólu jej głosem, nie Twoim. " +
        "PYTANIE: co próbowałaś wcześniej i co konkretnie zmieniło się po ośmiu tygodniach z planem pisanym pod Twój tydzień. " +
        "MONTAŻ: zmiana w pierwszych trzech sekundach, napisy wypalone, bez muzyki. Zgoda na piśmie: strona i reklamy.",
    } satisfies Nagranie,

    opinia2: {
      brief:
        "NAGRANIE 30–60 s, kadr 4:5, nagrywa się sama telefonem, tam gdzie trenuje. " +
        "KTO: osoba z nieregularnym grafikiem albo po dłuższej przerwie. " +
        "PYTANIE: dlaczego tym razem nie odpadłaś po trzech tygodniach. " +
        "MONTAŻ: bez scenariusza, bez drugiego podejścia. Zgoda na piśmie.",
    } satisfies Nagranie,
  },

  /* ─────────────────────────────────────────────────────────────────────
     3 · /coaching-online

     Sloty odpowiadają układowi tych samych komponentów co wyżej. Jeśli ta
     strona ma inne sekcje, dopisz albo skasuj pozycje — klucze są dowolne,
     liczy się tylko zgodność z wywołaniem w jej page.tsx. Jeśli używa
     <Hero> z formularzem zamiast <HeroShot>, slot `hero` zostaje nieużyty:
     tamten wariant nie ma zdjęcia w ogóle.

     ⚠ Strona online nie używa myślników pauzowych, także w briefach
     i opisach alt, bo w podglądzie są widoczne na stronie. Wyjątek:
     przypadek1 i przypadek2 to wspólne stałe ze strony stacjonarnej.
     ───────────────────────────────────────────────────────────────────── */
  coachingOnline: {
    hero: {
      plik: makieta("pion", "Hero", "NAGRYWANIE SERII", "statyw"),
      alt: "Podopieczny nagrywa serię telefonem na statywie",
      brief:
        "KADR pionowy 4:5, aparat za statywem i lekko z boku, ogniskowa 35 mm — widz ma zobaczyć dokładnie ten kadr, który widzi trener. " +
        "W KADRZE: telefon na statywie ustawiony z boku pod kątem 45°, w tle podopieczny w trakcie serii przysiadów, na ekranie telefonu widoczny obraz z kamery. Zwykła sala albo pokój z matą. " +
        "ŚWIATŁO: dzienne, ekran telefonu czytelny, bez odblasku okna na szkle. " +
        "NIE: laptopa z Zoomem na pierwszym planie, słuchawek studyjnych, pustego ekranu, kadru sugerującego, że to nagranie wysyłane po fakcie — tu chodzi o sesję na żywo.",
    } satisfies Foto,

    korzysc1: {
      plik: "/online-1-technika-na-zywo.svg",
      alt: "Dwie osie czasu: nagranie wysłane po treningu daje odpowiedź po siedmiu dniach, sesja na żywo po czterdziestu sekundach",
      brief:
        "KADR poziomy 1,272, zrzut ekranu z Twojego narzędzia do analizy, przycięty do samego obrazu. " +
        "W KADRZE: zatrzymana klatka z realnej sesji, na niej dwie, trzy linie korekty narysowane Twoją ręką — kąt w biodrze, tor sztangi. Ma wyglądać jak robocza notatka, nie jak infografika. " +
        "ŚWIATŁO: nie dotyczy. " +
        "NIE: twarzy bez zgody (zamaż), cudzego nagrania z internetu, grafiki z gotowego szablonu, zegara i nazwy komunikatora w rogu.",
    } satisfies Foto,

    korzysc2: {
      plik: "/online-2-ciezar-i-progres.svg",
      alt: "Zasada progresji: czyste serie to plus 2,5 kg, siadła seria to powtórzony tydzień",
      brief:
        "KADR poziomy 1,272, zrzut ekranu rozmowy, wycinek 4–6 wiadomości. " +
        "W KADRZE: check-in podopiecznego i Twoja odpowiedź — konkretna, z liczbą albo decyzją, bo to ona dowodzi, że po drugiej stronie jest człowiek, nie automat. Godziny zostaw, pokazują czas reakcji. " +
        "ŚWIATŁO: nie dotyczy. " +
        "NIE: imienia, awatara, numeru telefonu, rozmowy wyreżyserowanej na potrzeby zdjęcia, wiadomości dłuższej niż ekran.",
    } satisfies Foto,

    korzysc3: {
      plik: "/online-3-co-zostaje-po-sesji.svg",
      alt: "Notatka po sesji z trzema punktami do poprawy i dwa nagrania ćwiczeń",
      brief:
        "KADR poziomy 1,272, zrzut ekranu wiadomości albo dokumentu wysłanego po sesji. " +
        "W KADRZE: trzy ponumerowane rzeczy do poprawy, każda w jednym zdaniu, plus odnośnik do nagrania ćwiczenia. To jest produkt, który zostaje po sesji za 100 zł, więc musi być czytelny na telefonie. " +
        "ŚWIATŁO: nie dotyczy. " +
        "NIE: ściany tekstu, danych osobowych, notatki napisanej na potrzeby zdjęcia.",
    } satisfies Foto,

    team: {
      plik: ktoprowadzi,
      alt: "Trener w trakcie korekty ćwiczenia na sali",
      brief:
        "KADR pionowy 4:5, ogniskowa 50 mm, trener do pasa. " +
        "W KADRZE: to samo ujęcie co na dwóch pozostałych stronach, ten sam plik. Jeśli chcesz wariant pod online: Ty przy laptopie w trakcie sesji, na ekranie kadr z kamery podopiecznego, wzrok na ekranie. " +
        "ŚWIATŁO: dzienne od okna, ekran doświetlony. " +
        "NIE: pozowanego portretu, słuchawek gamingowych, ringlightu w kadrze, pustego pulpitu.",
    } satisfies Foto,

    domkniecie: {
      plik: makieta("pion", "Domknięcie", "KADR DO DOMKNIĘCIA", "stojak", true),
      alt: "",
      brief:
        "KADR pionowy 4:5 do <FinalRecap> albo szeroki 2,285 i ciemny do <FinalBand> — sprawdź, którego komponentu używa ta strona. " +
        "W KADRZE: ciemny, mało kontrastowy kadr bez twarzy: stojak, talerze, róg sali. Środek pusty, bo tam siada tekst. " +
        "ŚWIATŁO: jedno źródło z boku, ekspozycja o stopień pod. " +
        "NIE: jasnego środka, napisów, logotypów.",
    } satisfies Foto,

    /* Sloty historia1–3 zostają w zapasie. Sekcja dwóch historii używa
       przypadek1 i przypadek2 niżej. */
    historia1: {
      plik: makieta("poziom", "Historia 1", "DOWÓD PRACY", "wideo"),
      alt: "",
      brief:
        "KADR poziomy 1,272, zrzut ekranu z dwóch sesji obok siebie. " +
        "W KADRZE: ta sama osoba, ta sama pozycja w przysiadzie, sesja pierwsza i ósma. Jeśli nie masz kadrów, wstaw fragment rozpiski z zaznaczonym progresem ciężaru. " +
        "ŚWIATŁO: nie dotyczy, to materiał z sesji. " +
        "NIE: twarzy bez zgody, zestawienia sylwetkowego „przed i po”, cudzych nagrań.",
    } satisfies Foto,

    historia2: {
      plik: makieta("poziom", "Historia 2", "ZRZUT ARKUSZA", "arkusz"),
      alt: "",
      brief:
        "KADR poziomy 1,272, zrzut ekranu arkusza albo raportu tygodniowego. " +
        "W KADRZE: moment korekty planu w trakcie miesiąca — to jest rzecz, której gotowy plan nie zrobi. " +
        "ŚWIATŁO: nie dotyczy. " +
        "NIE: danych osobowych, kwot, powiadomień.",
    } satisfies Foto,

    historia3: {
      plik: makieta("poziom", "Historia 3", "TRENING SAMODZIELNY", "wykres"),
      alt: "",
      brief:
        "KADR poziomy 1,272, zdjęcie przysłane przez podopiecznego. " +
        "W KADRZE: osoba, która po cyklu online trenuje dalej sama, w swoim miejscu i na swoim sprzęcie. " +
        "ŚWIATŁO: jakie jest, telefon wystarczy — autentyczność bije jakość. " +
        "NIE: kadru wykonanego przez Ciebie, bo cała sekcja mówi o samodzielności.",
    } satisfies Foto,

    /* Zdjęcia do dwóch historii (<CaseStudies>, pozycja 3): wspólne
       dla wszystkich trzech stron, definicja przy PRZYPADEK1/2 wyżej. */
    przypadek1: PRZYPADEK1,
    przypadek2: PRZYPADEK2,

    opinia1: {
      brief:
        "NAGRANIE 30–60 s, kadr 4:5, nagrywa się sama telefonem tam, gdzie trenuje, na tym samym statywie co na sesjach. Wygląda prawdziwiej niż cokolwiek, co nagrasz Ty. " +
        "KTO: osoba, która była pewna, że przez kamerę się nie da. Zaczyna od tej obiekcji, kończy na konkrecie po pierwszej sesji. " +
        "PYTANIE: co myślałaś o treningu przez kamerę przed pierwszą sesją i co zmieniło się po niej. " +
        "MONTAŻ: zmiana w pierwszych trzech sekundach, napisy wypalone w środkowej części kadru. Zgoda na piśmie.",
    } satisfies Nagranie,

    opinia2: {
      brief:
        "NAGRANIE 30–60 s, kadr 4:5. " +
        "KTO: osoba, która wcześniej kupiła gotowy plan i go nie dokończyła. " +
        "ALTERNATYWA, mocniejsza: 20 sekund z realnej sesji — słychać Twoją korektę, następne powtórzenie jest lepsze. To jedyny materiał, który pokazuje mechanizm z hero, zamiast o nim mówić. Wtedy zmień `heading` sekcji, bo to już nie są słowa podopiecznych. " +
        "MONTAŻ: bez podkładu, bez drugiego podejścia. Zgoda na piśmie.",
    } satisfies Nagranie,
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════
   PRZEJŚCIÓWKI — zamieniają slot na propsy konkretnego komponentu

   Każdy komponent nazywa te same rzeczy inaczej (`image` / `src`,
   `alt` / `imageAlt`, `shot` / `brief`). Zamiast pamiętać, który jak,
   spreadujesz gotową funkcję.
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * Import daje obiekt { src, width, height }, a komponenty renderują zwykły
 * <img src={…}>, który potrzebuje stringa. Ta funkcja wyciąga z importu
 * `src`, string przepuszcza bez zmian, a pusty string i brak wartości
 * zamienia na `undefined` — inaczej <img src=""> zjadłby kadr.
 */
const sciezka = (v?: Zrodlo) =>
  typeof v === "string" ? (v.trim() ? v : undefined) : v?.src;

/**
 * <HeroShot> i <Team>: { image, imageAlt, shot }.
 * <HeroShot> od tej wersji renderuje `imageAlt`. <Team> tego propa nie ma
 * i bierze alt z imienia — nadmiarowe pole w spreadzie nie jest błędem
 * TypeScriptu, bo sprawdzanie nadmiarowych właściwości działa tylko na
 * literałach wpisanych wprost w JSX, nie na wyniku funkcji.
 */
export function kadr(f: Foto) {
  return { image: sciezka(f.plik), imageAlt: f.alt, shot: f.brief };
}

/** Element <Benefits> i element `items` w <CaseStudies>: { image, alt, shot }. */
export function blok(f: Foto) {
  return { image: sciezka(f.plik), alt: f.alt, shot: f.brief };
}

/** Element `items` w <Recenzje>: { foto, fotoAlt }. Kwadratowy portret. */
export function portret(f: Foto) {
  return { foto: sciezka(f.plik), fotoAlt: f.alt };
}

/** <FinalBand>: { image, imageAlt }. Zdjęcie w tle ciemnej belki. */
export function tlo(f: Foto) {
  return { image: sciezka(f.plik), imageAlt: f.alt };
}

/** Element `videos` w <Proof>: { src, poster, captions, brief }. */
export function nagranie(n: Nagranie) {
  return {
    src: sciezka(n.plik),
    poster: sciezka(n.poster),
    captions: n.napisy,
    brief: n.brief,
  };
}

/**
 * Zip dla trzech korzyści albo dla historii: bierze listę treści
 * i listę slotów w tej samej kolejności. Działa też dla jednej pozycji:
 *
 *   items={zBlokami(BENEFITS, [Z.korzysc1, Z.korzysc2, Z.korzysc3])}
 *   items={zBlokami([CASE], [Z.przypadek1])}
 */
export function zBlokami<T extends object>(items: T[], foty: Foto[]) {
  /* Każdy element dostaje image, alt i shot, także gdy brakuje dla niego
     zdjęcia. Bez tego `npm run build` zgłasza brak pola `shot`. */
  return items.map((it, i) => ({
    ...it,
    ...blok(foty[i] ?? { alt: "", brief: "" }),
  }));
}

/**
 * Zip dla nagrań w <Proof>: treść (imię, meta, cytat) zostaje w page.tsx,
 * pliki przychodzą stąd. Slot z samym `poster` daje kafel ze zdjęciem,
 * bez przycisku play — <Proof> rozpoznaje to po pustym `src`.
 *
 *   videos={zNagraniami(PROOF.videos, [Z.opinia1, Z.opinia2])}
 */
export function zNagraniami<T extends object>(
  videos: T[],
  nagrania: Nagranie[],
) {
  /* Jak w zBlokami: każdy element dostaje komplet pól, nawet bez nagrania. */
  return videos.map((v, i) => ({
    ...v,
    ...nagranie(nagrania[i] ?? { brief: "" }),
  }));
}

/* ═══════════════════════════════════════════════════════════════════════
   JAK PODPIĄĆ — wzór identyczny dla każdej z trzech stron

   Na górze page.tsx, pod importem sekcji:

     import { ZDJECIA, blok, kadr, tlo, zBlokami, zNagraniami } from "@/app/tresc/zdjecia";
     const Z = ZDJECIA.stacjonarny;      // albo .produkty / .coachingOnline

   W składzie:

     <HeroShot {...HERO} {...kadr(Z.hero)} split="rowno" cta={CTA} ctaHref={CEL} />

     <Proof
       {...PROOF}
       videos={zNagraniami(PROOF.videos, [Z.opinia1, Z.opinia2])}
       cta={CTA}
       ctaHref={CEL}
     />

     <Benefits
       items={zBlokami(BENEFITS, [Z.korzysc1, Z.korzysc2, Z.korzysc3])}
       cta={CTA}
       ctaHref={CEL}
     />

     // w danych <CaseStudies>, na końcu każdej historii:
     { kto: "…", …, czas: "…", ...blok(Z.przypadek1) }
     { kto: "…", …, czas: "…", ...blok(Z.przypadek2) }

     <Team {...TEAM} {...kadr(Z.team)} cta={CTA} ctaHref={CEL} />

     // w danych <Recenzje>, na pierwszej pozycji:
     { ...RECENZJA_1, ...portret(Z.recenzja1) }

     <FinalBand {...BAND} {...tlo(Z.domkniecie)} />       // tylko /produkty

   KOLEJNOŚĆ SPREADÓW MA ZNACZENIE. `{...kadr(…)}` musi stać PO
   `{...HERO}` i `{...TEAM}`, a `...blok(…)` na końcu obiektu historii —
   spread czytany jest od lewej, wygrywa to, co dalej. Odwrotna kolejność
   przywróci stary `shot` z obiektu treści.
   ═══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════
   GDY IMPORT NIE DZIAŁA

   · „Cannot find module '@/public/stacjonarny1.png'" → alias `@` nie
     wskazuje na katalog główny. Sprawdź `paths` w tsconfig.json: przy
     `"@/*": ["./*"]` ścieżka jest dobra, przy `"@/*": ["./src/*"]` pliki
     muszą leżeć w src/. W razie wątpliwości zadziała import względny:
     `import s1 from "../../public/stacjonarny1.png";`
   · „Cannot find module … or its corresponding type declarations" →
     brakuje next-env.d.ts w katalogu głównym. Powstaje sam przy
     `npm run dev`; jeśli go skasowano, wystarczy uruchomić dev raz.
   · Wielkość liter w nazwie pliku ma znaczenie na Linuksie (czyli na
     Vercelu), a na macOS i Windowsie nie. `stacjonarny1.png` musi być
     dokładnie tak nazwany w repo, inaczej lokalnie działa, a na
     produkcji kadr znika.
   · Spacja w nazwie pliku (`/Opinia 1.jpg`) działa w <img src>, ale
     bezpieczniej przemianować plik na `/opinia-1.jpg` i poprawić ścieżkę
     w stałej PRZYPADEK1.
   · Makiety to data URI w <img src>, więc `dangerouslyAllowSVG`
     z next.config ich nie dotyczy — to ustawienie działa wyłącznie
     na <Image> ze zdalnymi plikami.
   · Po dodaniu nowego pliku do /public czasem trzeba zrestartować dev
     server — Next nie zawsze łapie nowe assety w locie.
   ═══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════
   OPCJONALNY PATCH W sections.tsx

   Zdjęcia w <PainPoint> i <FinalRecap>. Oba przyjmują tylko `shot`
   i wołają `<Shot ratio="0.786" brief={shot} />`. Dopisz do propsów
   `image?: string; alt?: string;` i przekaż dalej:
   `<Shot ratio="0.786" brief={shot} src={image} alt={alt} />`.
   Wtedy działa na nich `blok()` tak samo jak na korzyściach.

   Dawny patch nr 1 (alt w hero) jest już wdrożony: <HeroShot> przyjmuje
   `imageAlt`, a `kadr()` go zwraca.
   ═══════════════════════════════════════════════════════════════════════ */