// STRONA: / · STRONA GŁÓWNA · rozdzielnia na trzy warianty (sala, online, plan)
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/JsonLd";
import { firma, faq, metaStrony } from "@/app/lib/seo";
import { CaseStudies, Footer, Header, Team } from "@/app/components/sections";
import { KONKURS, TELEFON, TELEFON_HREF, TRASY, dzienPL } from "@/app/lib/dane";
import { ZDJECIA, blok, kadr } from "@/app/tresc/zdjecia";

/** Zdjęcia historii i trenera: te same pliki co na podstronach. */
const Z = ZDJECIA.stacjonarny;

// Strona sprawdza datę konkursu, więc odświeżamy ją co godzinę.
export const revalidate = 3600;

export const metadata: Metadata = metaStrony({
  tytul: "Trener personalny Łódź i online | Maks Treningi",
  opis:
    "Trener personalny w Łodzi (Just GYM, Piotrkowska 157A) i online. Trening 1 na 1 od 150 zł, trening przez kamerę od 100 zł, plan treningowy pod Twój tydzień. Przestań zgadywać, czy trening coś daje.",
  sciezka: "/",
});

/* ═══════════════════════════════════════════════════════════════════════
   STRONA GŁÓWNA. Jedno zadanie: w kilka sekund wysłać człowieka do jednego
   z trzech wariantów. Nie sprzedaje sama, tylko kieruje.

   Język wizualny wzięty z podstron: grafitowe tło z siatką, limonkowe
   narożniki kadru (motyw kamery), numerowane kwadraty, taśma z faktami.

   Kolejność sekcji idzie za łańcuchem przekonań:
   hero (wybór) → diagnoza (1) → zasada pracy (2, 3, 5)
   → porównanie z ryzykiem (4, 6) → historie → trener → pytania → wybór
   jeszcze raz.

   CO ZMIENIŁO SIĘ W TEJ WERSJI
   · Wypadło „30 dni na zwrot” przy planie. Regulamin tego nie przewiduje,
     strona /produkty też już tego nie obiecuje. W porównaniu stoi teraz
     to, co mówi regulamin: 14 dni na odstąpienie, dopóki usługa nie jest
     wykonana, e-book bez zwrotu po otrzymaniu dostępu, prowadzenie bez
     umowy.
   · Sala i online: „brak terminu w 14 dni = zwrot całości”, tak samo jak
     na podstronach.
   · HISTORIE i TRENER to te same komponenty co na podstronach
     (<CaseStudies> i <Team>): zdjęcia, liczby przed i po, cytat, pełne
     bio. Treść jest skopiowana z /trening-stacjonarny. Sekcja historii
     stoi za flagą POKAZ_HISTORIE (true = widoczna, false = ukryta).
   · Taśma: dopisana płatność (BLIK, karta, Przelewy24).
   · Pytania: dopisane „Jak płacę i kiedy ustalamy termin?” i „Czy mogę
     się rozmyślić?”, bo to dwie najczęstsze blokady przed kliknięciem.
   ═══════════════════════════════════════════════════════════════════════ */

type Wariant = {
  nr: string;
  tryb: string;
  nazwa: string;
  kto: string;
  cena: string;
  cenaDopisek: string;
  href: string;
  cta: string;
  gdzie: string;
  technika: string;
  dalej: string;
  ryzyko: string;
  dlaKogo: string;
};

const WARIANTY: Wariant[] = [
  {
    nr: "1",
    tryb: "Na sali",
    nazwa: "Trening na sali w Łodzi",
    kto: "Jesteś w Łodzi i chcesz, żeby ktoś stał obok przy sztandze",
    cena: "150 zł",
    cenaDopisek: "60 minut jeden na jeden",
    href: TRASY.sala,
    cta: "Zobacz trening na sali",
    gdzie: "Just GYM, Piotrkowska 157A. Wejście na salę płatne osobno (karnet Just GYM).",
    technika: "Stoję obok i poprawiam w tej samej serii, także dłonią.",
    dalej: "3 sesje za 420 zł, 5 sesji za 650 zł. Bez daty ważności.",
    ryzyko: "Brak wspólnego terminu w 14 dni = zwrot całości.",
    dlaKogo: "Zaczynasz od zera albo chcesz asekuracji przy cięższych seriach.",
  },
  {
    nr: "2",
    tryb: "Online",
    nazwa: "Trening przez kamerę",
    kto: "Trenujesz w domu albo na swojej siłowni i nikt nie widzi Twoich serii",
    cena: "100 zł",
    cenaDopisek: "60 minut na żywo",
    href: TRASY.online,
    cta: "Zobacz trening online",
    gdzie: "W domu albo na Twojej siłowni, w całej Polsce. Wystarczy telefon na statywie.",
    technika: "Widzę serię na żywo i mówię w trakcie, co zmienić.",
    dalej: "3 treningi za 260 zł, 5 treningów za 400 zł.",
    ryzyko: "Brak wspólnego terminu w 14 dni = zwrot całości.",
    dlaKogo: "Nie mieszkasz w Łodzi albo masz już swoją siłownię i swój plan.",
  },
  {
    nr: "3",
    tryb: "Samodzielnie",
    nazwa: "Plan i prowadzenie",
    kto: "Chcesz trenować sam, ale z planem pod swój prawdziwy tydzień",
    cena: "249 zł",
    cenaDopisek: "plan na 12 tygodni, e-book od 99 zł",
    href: TRASY.plan,
    cta: "Zobacz plan",
    gdzie: "Gdziekolwiek trenujesz. Plan mailem i na telefonie, z nagraniem omówienia.",
    technika: "W planie ćwiczysz sam, według kryterium. W prowadzeniu analizuję Twoje nagrania dwa razy w miesiącu.",
    dalej: "Plan na 12 tygodni 249 zł, prowadzenie 349 zł miesięcznie, e-book 99 zł.",
    ryzyko: "14 dni na odstąpienie, dopóki nie dostaniesz planu. Prowadzenie bez umowy, kończysz z końcem miesiąca.",
    dlaKogo: "Wiesz, jak wykonać ćwiczenia, ale żaden plan nie przetrwał Twojego zwykłego tygodnia.",
  },
];

const TASMA = [
  "Kryterium progresji zamiast „słuchaj ciała”",
  "Zapis obciążeń po każdej sesji",
  "Odpisuję w 24 h w dni robocze",
  "Trening na sali w Łodzi",
  "Trening przez kamerę w całej Polsce",
  "Plan pod liczbę dni, które naprawdę masz",
  "Płatność BLIK-iem, kartą albo Przelewy24",
];

const CYKL = [
  { kiedy: "Poniedziałek", co: "Nowy plan z internetu, cztery treningi w tygodniu" },
  { kiedy: "Tydzień 2", co: "Robisz trzy z czterech, bo tyle masz czasu" },
  { kiedy: "Tydzień 5", co: "Ciężary stoją i nie wiesz, dlaczego" },
  { kiedy: "Znowu poniedziałek", co: "Zaczynasz od nowa i obwiniasz siebie" },
];

/* Historie: te same co na /trening-stacjonarny. Włączone wszędzie,
   także na produkcji. Ukryć: ustaw false. */
const POKAZ_HISTORIE = true;

const CASE_STUDIES = {
  heading: "Dwie osoby, dwa różne punkty startu",
  lead: "Punkt startu, co dokładnie zmieniliśmy i co pokazały karty obciążeń. Bez zdjęć sylwetki przed i po, same liczby, które da się sprawdzić.",
  note: "Historie publikowane za zgodą tych osób. Liczby pochodzą z ich kart obciążeń.",
  items: [
    {
      kto: "Marysia, 50 lat",
      kontekst: "redukcja, siedząca praca · trening na sali",
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
      wynik: "Rok po tym, jak utknął na setce, wyciska 140 kg, trenując trzy razy w tygodniu zamiast pięciu. Na każdym treningu wie, co robi i po co.",
      cytat: "Myślałem, że setka to mój sufit, a ja po prostu sam sobie źle układałem plany.",
      czas: "plan indywidualny + prowadzenie przez filmiki · 12 miesięcy",
      ...blok(Z.przypadek2),
    },
  ],
};

/* Kto prowadzi: to samo bio co na podstronach. */
const TEAM = {
  heading: "Kto prowadzi",
  name: "Maksymilian Lehman",
  role: "Trener personalny · Just GYM, Piotrkowska 157A, Łódź i online",
  paragraphs: [
    "Pracuję z ludźmi o różnym poziomie zaawansowania i w bardzo różnym wieku. Prowadzę zarówno treningi pod cele sportowe, jak i treningi prozdrowotne. Nie boję się pracy z osobami po kontuzjach i wiem, kiedy trzeba skorzystać z pomocy fizjoterapeuty albo ortopedy.",
    "Pierwszy raz przyszedłem na siłownię 9 lat temu. Zaczynałem od pustej sztangi i nie potrafiłem podciągnąć się na drążku. Próbowałem treningu kulturystycznego i kalisteniki, aż odkryłem trójbój siłowy. Największą motywacją okazały się dla mnie wyniki w przysiadzie, wyciskaniu i martwym ciągu.",
    "Jestem pasjonatem i zawodnikiem trójboju siłowego, ale na co dzień pracuję z lekarzami, informatykami, sportowcami, kobietami po ciąży i osobami, które dopiero zaczynają.",
  ],
};

const PYTANIA = [
  {
    p: "Nigdy nie byłem na siłowni. Od czego zacząć?",
    o: "Od treningu na sali, jeśli jesteś w Łodzi. Przy pierwszych ciężarach najwięcej daje ktoś, kto stoi obok i asekuruje. Jeśli jesteś poza Łodzią, trening przez kamerę też zadziała: telefon stoi z boku, a ja mówię w trakcie serii, co poprawić.",
  },
  {
    p: "Jak płacę i kiedy ustalamy termin?",
    o: "Płacisz online BLIK-iem, kartą albo Przelewy24, bez wybierania godziny. Zaraz potem dostajesz maila z krótką ankietą, a w ciągu 24 h w dni robocze dzwonię albo piszę SMS-a z kilkoma wolnymi okienkami i ustalamy termin. Jeśli w 14 dni nie znajdziemy wspólnej godziny, oddaję całą kwotę. E-book dostajesz od razu po płatności.",
  },
  {
    p: "Nie mam czasu trenować cztery razy w tygodniu.",
    o: "Nie musisz. Plan zaczyna się od liczby dni, które realnie masz, a nie od idealnego tygodnia. Do każdego treningu w planie jest też wersja na 25 minut.",
  },
  {
    p: "Kupiłem już kilka planów i żadnego nie skończyłem.",
    o: "Tamte zakładały tydzień, którego nie masz. Ten zaczyna się od pytania, w którym momencie wcześniej odpadałeś, i ma gotowy protokół na chorobę, wyjazd i opuszczone treningi.",
  },
  {
    p: "Nie chcę zrobić się „za duża” od ciężarów.",
    o: "Od kilku treningów siłowych w tygodniu nie urośniesz przypadkiem. Ciężar dobieramy pod Twój cel, a nie pod rekord.",
  },
  {
    p: "Czy muszę liczyć kalorie?",
    o: "Nie musisz, ale polecam. Liczenie kalorii bardzo ułatwia sprawę: widzisz czarno na białym, ile naprawdę jesz, zamiast zgadywać, dlaczego waga stoi. Spróbuj przez tydzień: wpisuj wszystko do aplikacji, np. Fitatu albo MyFitnessPal. Po tygodniu wiesz o swoim jedzeniu więcej niż po roku zgadywania, a potem sam decydujesz, czy liczysz dalej. Nie jestem dietetykiem i nie układam jadłospisów leczniczych: jeśli Twój przypadek tego wymaga, powiem wprost.",
  },
  {
    p: "Czy mogę się rozmyślić?",
    o: "Tak, w ciągu 14 dni od zakupu, dopóki usługa nie została wykonana: wystarczy odpisać na maila z potwierdzeniem. Niewykorzystane sesje z pakietu nie podlegają zwrotowi. Wyjątek to e-book: po otrzymaniu dostępu nie da się go zwrócić, bo materiały są już u Ciebie. Szczegóły w regulaminie.",
  },
];

function Strzalka() {
  return (
    <svg className="h-strzalka" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export default function Page() {
  const konkursTrwa = Date.now() < KONKURS.koniec.getTime();

  return (
    <>
      <style>{CSS}</style>
      <JsonLd dane={[firma(), faq(PYTANIA)]} />
      <Header cta="Wybierz, jak trenujesz" ctaKrotko="Wybierz trening" ctaHref="#wybor" />

      <main className="h">
        {konkursTrwa && (
          <a className="h-konkurs" href={TRASY.konkurs}>
            <span className="h-konkurs-znak" aria-hidden="true" />
            <span>
              Konkurs: wygraj trzy treningi na sali o wartości {KONKURS.wartosc}. Zgłoszenia do{" "}
              {dzienPL(KONKURS.koniec)}.
            </span>
            <span className="h-konkurs-link">Weź udział</span>
          </a>
        )}

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="h-hero h-siatka" aria-labelledby="h-tytul">
          <div className="h-w h-hero-uklad">
            <div className="h-hero-tekst">
              <h1 id="h-tytul" className="h-tytul">
                <span className="h-eyebrow h-eyebrow-h1">Trener personalny Łódź i online</span>
                Przestań zgadywać, czy Twój trening coś daje
              </h1>
              <p className="h-lead">
                Ćwiczysz regularnie, a ciało praktycznie się nie zmienia? Zwykle nie chodzi o silną wolę.
                Chodzi o plan, którego nikt nie dopasował do Twojego tygodnia, i o serie, których nikt
                nigdy nie widział.
              </p>
              <ul className="h-hero-fakty">
                <li>Kryterium, kiedy dołożyć ciężar</li>
                <li>Zapis, który zostaje u Ciebie</li>
                <li>Odpisuję w 24 h w dni robocze</li>
              </ul>
            </div>

            <nav id="wybor" className="h-trasa h-ramka" aria-labelledby="h-trasa-tytul">
              <div className="h-trasa-gora">
                <p id="h-trasa-tytul" className="h-trasa-tytul">Który opis pasuje do Ciebie?</p>
                <p className="h-trasa-sub">Trzy trasy, jedna metodyka. Wybierz swoją.</p>
              </div>
              <ul className="h-trasa-lista">
                {WARIANTY.map((w, i) => (
                  <li key={w.href} style={{ "--i": i } as React.CSSProperties}>
                    <a className="h-cel" href={w.href}>
                      <span className="h-nr" aria-hidden="true">{w.nr}</span>
                      <span className="h-cel-tresc">
                        <span className="h-cel-kto">{w.kto}</span>
                        <span className="h-cel-nazwa">{w.nazwa}</span>
                      </span>
                      <span className="h-cel-cena">{w.cena}</span>
                      <Strzalka />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="h-trasa-nie">
                Żaden nie pasuje? Zadzwoń albo napisz SMS:{" "}
                <a href={TELEFON_HREF}>{TELEFON}</a>. Powiem, co wybrać, także wtedy, gdy wystarczy
                najtańsza opcja.
              </p>
            </nav>
          </div>
        </section>

        {/* ── TAŚMA ────────────────────────────────────────────── */}
        <div className="h-tasma" aria-label="Najważniejsze fakty">
          <div className="h-tasma-tor">
            {[0, 1].map((kopia) => (
              <ul key={kopia} className="h-tasma-lista" aria-hidden={kopia === 1 || undefined}>
                {TASMA.map((t) => <li key={t}>{t}</li>)}
              </ul>
            ))}
          </div>
        </div>

        {/* ── DIAGNOZA ─────────────────────────────────────────── */}
        <section className="h-diagnoza" aria-labelledby="h-diag">
          <div className="h-w h-diag-uklad">
            <div>
              <p className="h-eyebrow h-eyebrow-ciemny">Dlaczego dotąd nie działało</p>
              <h2 id="h-diag" className="h-h2 h-h2-duzy">To nie Ty zawiodłeś. Zawiodło dopasowanie.</h2>
              <p className="h-diag-tekst">
                Oglądasz film o przysiadzie, ale nie widzisz, że przy ósmym powtórzeniu kolano ucieka Ci
                do środka. Nikt nigdy nie sprawdził ani Twojego tygodnia, ani Twojej serii. A to da się
                naprawić.
              </p>
            </div>

            <div className="h-cykl" role="img" aria-label="Cykl: nowy plan w poniedziałek, po dwóch tygodniach trzy treningi z czterech, po pięciu tygodniach ciężary stoją, znowu poniedziałek i start od nowa.">
              <p className="h-cykl-tytul">Znasz ten cykl?</p>
              <ol className="h-cykl-lista" aria-hidden="true">
                {CYKL.map((k, i) => (
                  <li key={k.kiedy} className={i === CYKL.length - 1 ? "h-cykl-ostatni" : undefined}>
                    <span className="h-cykl-kiedy">{k.kiedy}</span>
                    <span className="h-cykl-co">{k.co}</span>
                  </li>
                ))}
              </ol>
              <p className="h-cykl-wniosek">
                Brakuje nie silnej woli, tylko planu pod Twój tydzień i kogoś, kto widzi serię.
              </p>
            </div>
          </div>
        </section>

        {/* ── ZASADA PRACY (BENTO) ─────────────────────────────── */}
        <section className="h-metoda" aria-labelledby="h-met">
          <div className="h-w">
            <div className="h-naglowek-sekcji">
              <p className="h-eyebrow h-eyebrow-ciemny">Jedna metodyka</p>
              <h2 id="h-met" className="h-h2">Trzy sposoby, ta sama zasada pracy</h2>
            </div>

            <div className="h-bento">
              <article className="h-kafel h-kafel-ciemny h-siatka h-kafel-duzy">
                <div className="h-kafel-tekst">
                  <h3 className="h-h3">Kryterium zamiast przeczucia</h3>
                  <p>
                    Wiesz, co musi się wydarzyć w tym tygodniu, żeby w następnym dołożyć ciężar, a kiedy
                    zostać przy tym samym. Bez „słuchaj swojego ciała”.
                  </p>
                </div>
                <div className="h-decyzja" aria-hidden="true">
                  <div className="h-decyzja-pytanie">
                    Wszystkie trzy serie po 8 powtórzeń czysto?
                    <span>sprawdzasz to na ostatniej serii</span>
                  </div>
                  <div className="h-decyzja-galezie">
                    <div className="h-decyzja-tak">
                      <span className="h-decyzja-etykieta">Tak</span>
                      <strong>+2,5 kg</strong>
                      <span>w kolejnym tygodniu</span>
                    </div>
                    <div className="h-decyzja-nie">
                      <span className="h-decyzja-etykieta">Nie</span>
                      <strong>ten sam ciężar</strong>
                      <span>powtarzasz tydzień</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="h-kafel">
                <h3 className="h-h3">Zapis, który zostaje u Ciebie</h3>
                <p>
                  Karta obciążeń, notatka po sesji albo arkusz progresji. Po dwóch miesiącach sprawdzasz,
                  co poszło w górę, zamiast wierzyć, że coś się zmieniło.
                </p>
                <div className="h-karta-mini" aria-hidden="true">
                  <div className="h-karta-mini-gora"><span>Przykład zapisu</span><span>Przysiad</span></div>
                  {[["Tydz. 1", "40 kg", 40], ["Tydz. 3", "45 kg", 62], ["Tydz. 5", "50 kg", 84]].map(([t, kg, w]) => (
                    <div key={t as string} className="h-karta-mini-wiersz">
                      <span>{t}</span>
                      <span className="h-pasek"><span style={{ width: `${w}%` }} /></span>
                      <span className="h-kg">{kg}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="h-kafel">
                <h3 className="h-h3">Celem jest, żebyś umiał sam</h3>
                <p>
                  Nie sprzedaję zależności od trenera. Pracujemy tak długo, aż wiesz, co robisz i
                  dlaczego, a potem trenujesz bez asysty.
                </p>
                <div className="h-samodzielnie" aria-hidden="true">
                  <div className="h-kwadraty">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span key={i} className={i < 3 ? "h-kw-pelny" : "h-kw-pusty"} />
                    ))}
                  </div>
                  <div className="h-kwadraty-opis"><span>ze mną</span><span>sam, z kartą i zasadą</span></div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── PORÓWNANIE ───────────────────────────────────────── */}
        <section className="h-porownanie" id="porownanie" aria-labelledby="h-por">
          <div className="h-w">
            <div className="h-naglowek-sekcji h-naglowek-rzad">
              <div>
                <p className="h-eyebrow h-eyebrow-ciemny">Porównanie</p>
                <h2 id="h-por" className="h-h2">Porównaj i wybierz</h2>
              </div>
              <p className="h-podtytul">
                Każdy wariant zaczyna się od tego samego pytania: ile realnie masz czasu i gdzie
                trenujesz.
              </p>
            </div>

            <div className="h-karty">
              {WARIANTY.map((w) => (
                <article key={w.href} className="h-karta" aria-labelledby={`k-${w.nr}`}>
                  <div className="h-karta-gora">
                    <span className="h-nr" aria-hidden="true">{w.nr}</span>
                    <span className="h-karta-tryb">{w.tryb}</span>
                  </div>
                  <h3 id={`k-${w.nr}`} className="h-karta-nazwa">{w.nazwa}</h3>
                  <p className="h-karta-cena">
                    {w.cena}
                    <span>{w.cenaDopisek}</span>
                  </p>
                  <dl className="h-dl">
                    <div><dt>Gdzie</dt><dd>{w.gdzie}</dd></div>
                    <div><dt>Kto patrzy na technikę</dt><dd>{w.technika}</dd></div>
                    <div><dt>Pakiety</dt><dd>{w.dalej}</dd></div>
                    <div className="h-dl-ryzyko"><dt>Jeśli nie wyjdzie</dt><dd>{w.ryzyko}</dd></div>
                    <div><dt>Dla kogo</dt><dd>{w.dlaKogo}</dd></div>
                  </dl>
                  <a className="h-btn h-btn-ciemny" href={w.href}>{w.cta}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── HISTORIE: ten sam komponent co na podstronach ───── */}
        {POKAZ_HISTORIE && (
          <CaseStudies {...CASE_STUDIES} cta="Porównaj warianty" ctaHref="#porownanie" />
        )}

        {/* ── TRENER: ten sam komponent co na podstronach ──────── */}
        <Team {...TEAM} {...kadr(Z.team)} cta="Porównaj warianty" ctaHref="#porownanie" odstepGora />

        {/* ── PYTANIA ──────────────────────────────────────────── */}
        <section className="h-faq" aria-labelledby="h-pyt">
          <div className="h-w h-faq-uklad">
            <div className="h-faq-bok">
              <h2 id="h-pyt" className="h-h2">Zanim wybierzesz</h2>
              <p className="h-faq-nie">Nie ma Twojego pytania?</p>
              <a className="h-faq-tel" href={TELEFON_HREF}>{TELEFON}</a>
              <p className="h-drobne">Odpisuję w 24 h w dni robocze.</p>
            </div>
            <div className="h-faq-lista">
              {PYTANIA.map((q, i) => (
                <details key={q.p} className="h-pytanie" open={i === 0}>
                  <summary>
                    {q.p}
                    <span className="h-plus" aria-hidden="true" />
                  </summary>
                  <p>{q.o}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAŁ ────────────────────────────────────────────── */}
        <section className="h-final h-siatka" aria-labelledby="h-fin">
          <div className="h-w">
            <div className="h-final-karta h-ramka">
              <p className="h-eyebrow">Zanim zaczniesz kolejny poniedziałek</p>
              <h2 id="h-fin" className="h-h2 h-h2-duzy">Od czego zaczynasz?</h2>
              <div className="h-final-przyciski">
                {WARIANTY.map((w) => (
                  <a key={w.href} className="h-final-opcja" href={w.href}>
                    <span className="h-nr" aria-hidden="true">{w.nr}</span>
                    <span className="h-final-nazwa">{w.nazwa}</span>
                    <span className="h-final-cena">{w.cena}</span>
                    <Strzalka />
                  </a>
                ))}
              </div>
              <p className="h-final-tel">
                Nie wiesz? Zadzwoń: <a href={TELEFON_HREF}>{TELEFON}</a>. Jeśli wystarczy Ci najtańsza
                opcja, powiem to.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const CSS = `
.h{--g:#111820;--g2:#1A222C;--s:#D6FF3F;--s2:#C6F020;--m:#EDEFF2;--sl:#5F6A77;--l:#D8DDE3;--jas:#AAB3BE;color:var(--g);background:#fff}
.h *,.h *::before,.h *::after{box-sizing:border-box}
@layer base{:where(.h) a{color:inherit}}
.h-w{max-width:75rem;margin:0 auto;padding:0 clamp(1.1rem,4vw,2.5rem)}
.h p{line-height:1.6}
.h-drobne{margin:.75rem 0 0;font-size:.85rem;color:var(--sl)}

/* motywy wspólne */
.h-siatka{background-color:var(--g);background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:72px 72px;background-position:-1px -1px}
.h-ramka{--r:22px;background-image:
  linear-gradient(var(--s),var(--s)),linear-gradient(var(--s),var(--s)),
  linear-gradient(var(--s),var(--s)),linear-gradient(var(--s),var(--s)),
  linear-gradient(var(--s),var(--s)),linear-gradient(var(--s),var(--s)),
  linear-gradient(var(--s),var(--s)),linear-gradient(var(--s),var(--s));
  background-repeat:no-repeat;
  background-size:var(--r) 2px,2px var(--r),var(--r) 2px,2px var(--r),var(--r) 2px,2px var(--r),var(--r) 2px,2px var(--r);
  background-position:0 0,0 0,100% 0,100% 0,0 100%,0 100%,100% 100%,100% 100%}
.h-eyebrow{margin:0 0 1.1rem;color:var(--s);font-size:.75rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.h-eyebrow-ciemny{color:var(--sl)}
.h-eyebrow-h1{display:block;font-family:var(--font-sans);line-height:1.4}
.h-nr{display:inline-grid;place-items:center;width:1.75rem;height:1.75rem;flex:none;background:var(--s);color:var(--g);font-size:.8rem;font-weight:800}
.h-h2{margin:0;font-size:clamp(2rem,4.2vw,3.1rem);line-height:1.02;letter-spacing:-.035em;font-weight:800}
.h-h2-duzy{font-size:clamp(2.3rem,5.4vw,4rem)}
.h-h3{margin:0 0 .6rem;font-size:1.3rem;line-height:1.2;letter-spacing:-.015em;font-weight:800}
.h-naglowek-sekcji{margin-bottom:clamp(2rem,4vw,3rem);max-width:44rem}
.h-naglowek-rzad{max-width:none;display:grid;gap:1rem 3rem;align-items:end}
@media(min-width:56rem){.h-naglowek-rzad{grid-template-columns:1fr minmax(0,24rem)}}
.h-podtytul{margin:0;color:var(--sl);font-size:1.05rem}
.h-strzalka{flex:none;transition:transform .2s}

/* przyciski */
.h-btn{display:flex;justify-content:center;align-items:center;gap:.6rem;min-height:3.25rem;padding:.9rem 1.3rem;background:var(--s);color:var(--g)!important;font-weight:800;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;text-align:center;transition:background .15s}
.h-btn:hover{background:var(--s2)}
.h-btn-ciemny{background:var(--g);color:#fff!important}
.h-btn-ciemny:hover{background:#26303B}
.h a:focus-visible,.h summary:focus-visible{outline:3px solid var(--s);outline-offset:3px}
.h-porownanie a:focus-visible,.h-faq a:focus-visible,.h-faq summary:focus-visible,.h-trener a:focus-visible,.h-diagnoza a:focus-visible{outline-color:var(--g)}

/* pasek konkursu */
.h-konkurs{display:flex;flex-wrap:wrap;gap:.4rem 1rem;justify-content:center;align-items:center;padding:.75rem clamp(1rem,4vw,2.5rem);background:var(--s);color:var(--g);text-decoration:none;font-size:.9rem;font-weight:600;text-align:center}
.h-konkurs-znak{width:8px;height:8px;background:var(--g);animation:h-puls 1.6s ease-in-out infinite}
.h-konkurs-link{font-weight:800;text-decoration:underline;text-underline-offset:3px}
.h-konkurs:hover .h-konkurs-link{text-decoration-thickness:2px}
.h-konkurs:focus-visible{outline:3px solid var(--g)!important;outline-offset:-5px!important}
@keyframes h-puls{50%{opacity:.25}}

/* hero */
.h-hero{color:#fff;padding:clamp(3.25rem,8vw,6.5rem) 0 clamp(3.5rem,8vw,6.5rem)}
.h-hero-uklad{display:grid;gap:3rem;align-items:center}
@media(min-width:64rem){.h-hero-uklad{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:5rem}}
.h-tytul{margin:0 0 1.5rem;font-size:clamp(2.7rem,6.8vw,5.25rem);line-height:.98;letter-spacing:-.045em;font-weight:800;text-wrap:balance}
.h-lead{margin:0 0 2rem;max-width:34rem;font-size:1.15rem;color:#C9D0D8}
.h-hero-fakty{list-style:none;margin:0;padding:1.5rem 0 0;border-top:1px solid rgba(255,255,255,.12);display:flex;flex-wrap:wrap;gap:.75rem 1.75rem;font-size:.92rem;color:#DDE2E8}
.h-hero-fakty li{display:flex;align-items:center;gap:.6rem}
.h-hero-fakty li::before{content:"";width:7px;height:7px;background:var(--s)}

.h-trasa{padding:clamp(1.4rem,3vw,2rem);background-color:rgba(17,24,32,.72);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(2px)}
.h-trasa-gora{margin-bottom:1.25rem}
.h-trasa-tytul{margin:0;font-size:1.25rem;font-weight:800;letter-spacing:-.01em}
.h-trasa-sub{margin:.2rem 0 0;font-size:.9rem;color:var(--jas)}
.h-trasa-lista{list-style:none;margin:0;padding:0;display:grid;gap:.6rem}
.h-trasa-lista li{animation:h-wjazd .5s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(.15s + var(--i) * .09s)}
@keyframes h-wjazd{from{opacity:0;transform:translateY(10px)}}
.h-cel{display:grid;grid-template-columns:auto 1fr auto auto;gap:.9rem;align-items:center;padding:1rem;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.1);text-decoration:none;transition:background .15s,border-color .15s}
.h-cel:hover{background:rgba(214,255,63,.07);border-color:rgba(214,255,63,.55)}
.h-cel:hover .h-strzalka,.h-final-opcja:hover .h-strzalka{transform:translateX(3px)}
.h-cel .h-nr{align-self:start;margin-top:.1rem}
.h-cel-tresc{display:grid;gap:.25rem;min-width:0}
.h-cel-kto{color:var(--jas);font-size:.88rem;line-height:1.4}
.h-cel-nazwa{font-weight:800;font-size:1.1rem;line-height:1.2}
.h-cel-cena{color:var(--s);font-weight:800;font-size:1.05rem;white-space:nowrap}
.h-cel .h-strzalka{color:var(--s)}
@media(max-width:32rem){.h-cel{grid-template-columns:auto 1fr;row-gap:.5rem}.h-cel-cena{grid-column:2}.h-cel .h-strzalka{display:none}.h-konkurs-znak{display:none}}
.h-trasa-nie{margin:1.25rem 0 0;font-size:.88rem;color:var(--jas)}
.h-trasa-nie a{color:#fff;font-weight:700;text-underline-offset:3px}

/* taśma */
.h-tasma{overflow:hidden;background:#fff;border-bottom:1px solid var(--l);padding:.9rem 0}
.h-tasma-tor{display:flex;width:max-content;animation:h-tasma 45s linear infinite}
.h-tasma:hover .h-tasma-tor{animation-play-state:paused}
.h-tasma-lista{display:flex;list-style:none;margin:0;padding:0}
.h-tasma-lista li{display:flex;align-items:center;gap:1.4rem;padding-right:1.4rem;white-space:nowrap;font-size:.85rem;color:var(--sl)}
.h-tasma-lista li::after{content:"";width:5px;height:5px;background:var(--s);outline:1px solid var(--g)}
@keyframes h-tasma{to{transform:translateX(-50%)}}

/* diagnoza */
.h-diagnoza{padding:clamp(4rem,9vw,7rem) 0}
.h-diag-uklad{display:grid;gap:3rem;align-items:center}
@media(min-width:62rem){.h-diag-uklad{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:5rem}}
.h-diag-tekst{margin:1.5rem 0 0;max-width:34rem;font-size:1.15rem;color:#3B4550}
.h-cykl{background:var(--m);padding:clamp(1.5rem,3vw,2.25rem)}
.h-cykl-tytul{margin:0 0 1.25rem;font-weight:800;font-size:1.05rem}
.h-cykl-lista{list-style:none;margin:0;padding:0 0 0 1.75rem;position:relative}
.h-cykl-lista::before{content:"";position:absolute;left:6px;top:.5rem;bottom:.9rem;border-left:2px dashed #B8C0CA}
.h-cykl-lista li{position:relative;display:grid;gap:.15rem;padding-bottom:1.1rem}
.h-cykl-lista li::before{content:"";position:absolute;left:-1.75rem;top:.35rem;width:14px;height:14px;background:#fff;border:2px solid var(--g)}
.h-cykl-kiedy{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--sl)}
.h-cykl-co{font-weight:600}
.h-cykl-ostatni::before{background:var(--g)!important}
.h-cykl-ostatni .h-cykl-kiedy::after{content:" ↺";color:var(--g)}
.h-cykl-wniosek{margin:.5rem 0 0;padding:1rem 1.1rem;background:var(--g);color:#fff;font-weight:700;line-height:1.45;border-left:4px solid var(--s)}

/* bento */
.h-metoda{background:var(--m);padding:clamp(4rem,9vw,7rem) 0}
.h-bento{display:grid;gap:1rem}
@media(min-width:56rem){.h-bento{grid-template-columns:1.25fr 1fr;grid-template-rows:auto auto}.h-kafel-duzy{grid-row:span 2}}
.h-kafel{background-color:#fff;padding:clamp(1.5rem,3vw,2.25rem);display:flex;flex-direction:column}
.h-kafel p{margin:0;color:var(--sl)}
.h-kafel.h-kafel-ciemny{background-color:var(--g);color:#fff;justify-content:space-between;gap:2rem}
.h-kafel-ciemny p{color:#C9D0D8}
.h-kafel-duzy .h-h3{font-size:clamp(1.5rem,2.6vw,2rem)}

.h-decyzja{display:grid;gap:0;font-size:.9rem}
.h-decyzja-pytanie{position:relative;justify-self:center;text-align:center;padding:1rem 1.25rem;background:#fff;color:var(--g);font-weight:800;max-width:22rem;line-height:1.35}
.h-decyzja-pytanie span{display:block;margin-top:.2rem;font-weight:500;font-size:.8rem;color:var(--sl)}
.h-decyzja-galezie{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding-top:2.25rem}
.h-decyzja-galezie::before{content:"";position:absolute;top:0;left:25%;right:25%;height:1.25rem;border:2px solid rgba(255,255,255,.35);border-bottom:0}
.h-decyzja-galezie::after{content:"";position:absolute;top:-1px;left:50%;height:0;border-left:0}
.h-decyzja-tak,.h-decyzja-nie{display:grid;gap:.15rem;justify-items:center;text-align:center;padding:1rem .75rem}
.h-decyzja-tak{background:var(--s);color:var(--g)}
.h-decyzja-nie{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#fff}
.h-decyzja-etykieta{font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;opacity:.75}
.h-decyzja-tak strong,.h-decyzja-nie strong{font-size:1.35rem;letter-spacing:-.02em;line-height:1.15}
.h-decyzja-tak span:last-child,.h-decyzja-nie span:last-child{font-size:.8rem}

.h-karta-mini{margin-top:1.5rem;border:1px solid var(--l);font-size:.85rem}
.h-karta-mini-gora{display:flex;justify-content:space-between;padding:.6rem .8rem;background:var(--g);color:#fff;font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.h-karta-mini-gora span:last-child{color:var(--s)}
.h-karta-mini-wiersz{display:grid;grid-template-columns:4rem 1fr 3.5rem;gap:.75rem;align-items:center;padding:.6rem .8rem;border-top:1px solid var(--l);font-variant-numeric:tabular-nums}
.h-karta-mini-wiersz span:first-child{color:var(--sl)}
.h-pasek{height:8px;background:var(--m)}
.h-pasek span{display:block;height:100%;background:var(--g)}
.h-karta-mini-wiersz:last-child .h-pasek span{background:var(--s);outline:1px solid var(--g)}
.h-kg{font-weight:800;text-align:right}

.h-samodzielnie{margin-top:1.5rem}
.h-kwadraty{display:grid;grid-template-columns:repeat(10,1fr);gap:5px}
.h-kwadraty span{aspect-ratio:1}
.h-kw-pelny{background:var(--g)}
.h-kw-pusty{background:var(--s);opacity:.9}
.h-kwadraty-opis{display:flex;justify-content:space-between;margin-top:.5rem;font-size:.8rem;color:var(--sl);font-weight:600}

/* porównanie */
.h-porownanie{padding:clamp(4rem,9vw,7rem) 0}
.h-karty{display:grid;gap:1rem}
@media(min-width:64rem){.h-karty{grid-template-columns:repeat(3,minmax(0,1fr))}}
.h-karta{display:flex;flex-direction:column;border:1px solid var(--l);padding:clamp(1.4rem,3vw,1.9rem);transition:border-color .15s,box-shadow .15s}
.h-karta:hover{border-color:var(--g);box-shadow:0 24px 48px -32px rgba(17,24,32,.45)}
.h-karta-gora{display:flex;align-items:center;gap:.7rem;margin-bottom:1.25rem}
.h-karta-tryb{font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--sl)}
.h-karta-nazwa{margin:0;font-size:1.35rem;font-weight:800;letter-spacing:-.015em;line-height:1.15}
.h-karta-cena{margin:.8rem 0 1.4rem;font-size:2.8rem;font-weight:800;letter-spacing:-.045em;line-height:1}
.h-karta-cena span{display:block;margin-top:.4rem;font-size:.8rem;font-weight:600;letter-spacing:0;color:var(--sl)}
.h-dl{margin:0 0 1.5rem;flex:1}
.h-dl div{padding:.85rem 0;border-top:1px solid var(--l)}
.h-dl dt{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--sl);margin-bottom:.3rem}
.h-dl dd{margin:0;line-height:1.5;font-size:.95rem}
.h-dl-ryzyko dd{padding-left:.75rem;border-left:3px solid var(--s);font-weight:600}

/* pytania */
.h-faq{padding:0 0 clamp(4rem,9vw,7rem)}
.h-faq-uklad{display:grid;gap:2.5rem}
@media(min-width:56rem){.h-faq-uklad{grid-template-columns:minmax(0,20rem) minmax(0,1fr);gap:5rem}.h-faq-bok{position:sticky;top:2rem;align-self:start}}
.h-faq-nie{margin:2rem 0 .3rem;padding-top:1.5rem;border-top:1px solid var(--l);font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--sl)}
.h-faq-tel{font-size:1.9rem;font-weight:800;letter-spacing:-.03em;text-decoration:none}
.h-pytanie{border-top:1px solid var(--l)}
.h-pytanie:last-child{border-bottom:1px solid var(--l)}
.h-pytanie summary{display:flex;justify-content:space-between;align-items:center;gap:1.5rem;cursor:pointer;padding:1.25rem 0;font-weight:700;font-size:1.05rem;list-style:none}
.h-pytanie summary::-webkit-details-marker{display:none}
.h-plus{position:relative;flex:none;width:1.6rem;height:1.6rem;border:1px solid var(--l);transition:background .15s,border-color .15s}
.h-plus::before,.h-plus::after{content:"";position:absolute;left:50%;top:50%;width:10px;height:2px;background:var(--g);transform:translate(-50%,-50%)}
.h-plus::after{transform:translate(-50%,-50%) rotate(90deg);transition:transform .2s}
.h-pytanie[open] .h-plus{background:var(--s);border-color:var(--s)}
.h-pytanie[open] .h-plus::after{transform:translate(-50%,-50%) rotate(0)}
.h-pytanie p{margin:0 0 1.4rem;max-width:40rem;color:var(--sl)}

/* finał */
.h-final{color:#fff;padding:clamp(4rem,9vw,7rem) 0}
.h-final-karta{max-width:52rem;margin:0 auto;padding:clamp(2rem,5vw,3.5rem);text-align:center;background-color:rgba(17,24,32,.8)}
.h-final-przyciski{display:grid;gap:.6rem;margin:2rem 0 1.5rem;text-align:left}
.h .h-final-opcja{color:var(--g)}
.h-final-opcja{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:.75rem;align-items:center;padding:1rem 1.1rem;background:var(--s);color:var(--g);text-decoration:none;font-weight:800;transition:background .15s}
.h-final-opcja:hover{background:var(--s2)}
.h-final-opcja .h-nr{background:var(--g);color:var(--s)}
.h-final-nazwa{font-size:1.05rem}
.h-final-cena{white-space:nowrap}
.h-final-opcja:focus-visible{outline-color:#fff!important}
.h-final-tel{margin:0;color:var(--jas)}
.h-final-tel a{color:#fff;font-weight:700;text-underline-offset:3px}

@media(prefers-reduced-motion:reduce){
  .h *{animation:none!important;transition:none!important}
  .h-tasma-tor{width:auto}
  .h-tasma-lista{flex-wrap:wrap;justify-content:center;row-gap:.5rem;padding:0 1rem}
  .h-tasma-lista[aria-hidden]{display:none}
}
`;