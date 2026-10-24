// PLIK: app/dziekujemy/page.tsx · STRONA /dziekujemy · powrót klienta po płatności Stripe
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/app/components/sections";
import { TELEFON, TELEFON_HREF, znajdzProdukt, type IdProduktu } from "@/app/lib/produkty";
import { stripe, trybPokazowy } from "@/app/lib/klient";
import { linkDoAnkiety } from "@/app/lib/maile";
import { linkDoEbooka, maEbooka } from "@/app/lib/ebook";
import { ZdarzenieZakupu } from "@/app/components/ZdarzenieZakupu";

/* ═══════════════════════════════════════════════════════════════════════
   /dziekujemy?session_id=<id sesji Stripe> · W JEDNYM PLIKU

   Tu wraca kupujący ze Stripe (adres ustawia /api/platnosc). Strona
   sama pyta Stripe o sesję, więc produkt i numer zamówienia biorą się
   z płatności, nie z adresu, który każdy może wpisać ręcznie.

   Trzy stany:
   · opłacone      BLIK, karta i większość płatności: pełna strona,
   · w toku        Przelewy24 albo przelew, bank jeszcze potwierdza:
                   ta sama strona, krok „Płatność" nieodhaczony,
   · niepotwierdzone  brak sesji albo nieznana sesja: krótka informacja
                   i telefon, bez kroków.
   Bez klucza Stripe w trybie deweloperskim działa ?produkt=…&demo=1.

   Kolejność na stronie:
   1. potwierdzenie i numer zamówienia,
   2. telefon w ciągu 24 h, z przyciskiem „Zapisz numer”,
   3. cały proces krok po kroku i lista „na pierwszy trening”,
   4. przypomnienie na dole: trzy rzeczy w skrócie.

   CO ZMIENIŁO SIĘ W TEJ WERSJI
   · ANKIETA PO PŁATNOŚCI: krok „Ankieta” nie jest już odhaczony, stoi
     zaraz po płatności, a nad telefonem jest przycisk „Wypełnij ankietę”
     (link z ANKIETA_URL i numerem zamówienia). Bez ANKIETA_URL przycisk
     się nie pokazuje, a krok mówi, że link jest w mailu.
   · Nazwy i ceny z app/lib/produkty.ts zamiast osobnej listy.
   · Weryfikacja płatności przez Stripe.
   · Wypadła gwarancja „+20 kg albo kolejne na mój koszt”. Tej obietnicy
     nie ma już na żadnej stronie sprzedażowej, a klient po zapłacie nie
     może zobaczyć innych warunków niż przed. Zamiast niej to samo, co
     obiecują strony: przy treningach zobowiązania i zwrot przy braku
     terminu w 14 dni. „30 dni na zwrot” wypadło: obowiązuje regulamin
     (14 dni na odstąpienie, dopóki usługa nie jest wykonana).

   ⚠ Obietnica „telefon w ciągu 24 h w dni robocze” stoi też na
   stronach produktów, na /zamowienie i w mailu z webhooka. Zmieniasz
   ją, zmień wszędzie.
   ═══════════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: "Dziękuję · Maks Treningi",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Wizytówka do zapisania w kontaktach jednym kliknięciem. */
const VCARD = `data:text/vcard;charset=utf-8,${encodeURIComponent(
  ["BEGIN:VCARD", "VERSION:3.0", "FN:Maks Treningi", "ORG:Maks Treningi", "TEL;TYPE=CELL:+48666222699", "END:VCARD"].join("\r\n"),
)}`;

type Krok = { kiedy: string; co: string; opis: string; zrobione?: boolean };

type PoZakupie = {
  trening: boolean;
  /** Co obiecuję. Jedno, dwa zdania, te same co na stronie produktu. */
  gwarancja: string;
  /** Co zapisywać, żeby było z czym porównać. */
  pomiar?: string;
  kroki: Krok[];
  przygotuj: string[];
  strona: { href: string; nazwa: string };
};

/* ─────────────────────────────────────────────────────── KROKI */

/* Ankieta jest PO płatności (wariant A): ten krok nie jest odhaczony. */
const ANKIETA_TERAZ: Krok = {
  kiedy: "Teraz · 3 minuty",
  co: "Ankieta",
  opis: "Kontuzje, staż, cel, kiedy możesz trenować i jak mam się kontaktować. Link masz niżej i w mailu z potwierdzeniem. Nie zdążysz? Zapytam przy pierwszym kontakcie.",
};

const PLATNOSC_ZROBIONA: Krok = {
  kiedy: "Zrobione",
  co: "Płatność",
  opis: "Potwierdzenie z numerem zamówienia idzie na Twój e-mail. Sprawdź też folder Oferty i Spam.",
  zrobione: true,
};

const PLATNOSC_W_TOKU: Krok = {
  kiedy: "W toku",
  co: "Płatność",
  opis: "Bank jeszcze ją potwierdza, zwykle to kwestia minut. Gdy dojdzie, przyjdzie mail z potwierdzeniem.",
};

const telefon = (opis: string): Krok => ({
  kiedy: "W ciągu 24 h w dni robocze",
  co: "Telefon albo SMS ode mnie",
  opis: `Dzwonię z numeru ${TELEFON}. ${opis} Jeśli się nie dodzwonię, piszę SMS-a z 2–3 wolnymi okienkami, a Ty odpisujesz, które pasuje.`,
});

const krokiStacjonarne = (pakiet: boolean): Krok[] => [
  PLATNOSC_ZROBIONA,
  ANKIETA_TERAZ,
  telefon("Ustalamy termin pierwszej sesji i dopytuję o to, co jest w ankiecie."),
  {
    kiedy: "Zaraz po rozmowie",
    co: "SMS z terminem i dojściem",
    opis: "Just GYM, ul. Piotrkowska 157A, budynek HiPiotrkowska, przy Stajni Jednorożców.",
  },
  {
    kiedy: "W dniu sesji, 60 minut",
    co: "Trening na sali",
    opis: "Wejście na salę nie jest w cenie sesji: potrzebujesz karnetu albo jednorazowego wejścia do Just GYM. Po sesji dostajesz kartę obciążeń.",
  },
  ...(pakiet
    ? [
        {
          kiedy: "Po trzeciej sesji",
          co: "Karta pierwsza obok trzeciej",
          opis: "Kładziemy obok siebie karty z pierwszej i trzeciej sesji. Jeśli coś stoi, mówię dokładnie co i dlaczego.",
        },
      ]
    : []),
];

const krokiOnline = (pakiet: boolean): Krok[] => [
  PLATNOSC_ZROBIONA,
  ANKIETA_TERAZ,
  telefon("Ustalamy termin i sprawdzamy, czy u Ciebie na siłowni albo w domu da się ustawić telefon z boku."),
  {
    kiedy: "Zaraz po rozmowie",
    co: "SMS z terminem",
    opis: "Trening prowadzimy na komunikatorze, który wolisz: Messenger, WhatsApp albo Discord. Ustalamy to przy pierwszym kontakcie.",
  },
  {
    kiedy: "W dniu treningu, 60 minut",
    co: "Sesja przez kamerę",
    opis: "Połącz się pięć minut wcześniej, ustawiamy telefon razem. Tego samego dnia dostajesz notatkę i nagrania.",
  },
  ...(pakiet
    ? [
        {
          kiedy: "Po trzecim treningu",
          co: "Nagranie pierwsze obok trzeciego",
          opis: "Porównujemy nagrania i notatki z pierwszego i trzeciego treningu. Jeśli coś stoi, mówię dokładnie co i dlaczego.",
        },
      ]
    : []),
];

const PRZYGOTUJ_STACJONARNY = [
  "Wygodny strój i buty z płaską podeszwą",
  "Woda i mały ręcznik",
  "Zalecenia od fizjoterapeuty, jeśli je masz",
  "Dziesięć minut zapasu na wejście i przebranie się",
];

const PRZYGOTUJ_ONLINE = [
  "Telefon na statywie albo stabilnie oparty, z boku pod kątem 45 stopni",
  "Jedna słuchawka w uchu, żeby słyszeć korektę w trakcie serii",
  "Dwa metry wolnej podłogi albo miejsce na swojej siłowni",
  "Naładowany telefon albo ładowarka w zasięgu kabla",
];

const STACJONARNY = { href: "/trening-stacjonarny", nazwa: "Trening personalny w Łodzi" };
const ONLINE = { href: "/coaching-online", nazwa: "Trening online przez kamerę" };
const PLANY = { href: "/produkty", nazwa: "Plany treningowe" };

const BRAK_TERMINU = "Jeśli w ciągu 14 dni nie znajdziemy wspólnego terminu, oddaję całą kwotę.";
/** Zgodnie z regulaminem, § 9. */
const ODSTAPIENIE = "Do czasu wykonania usługi możesz odstąpić od umowy w ciągu 14 dni: wystarczy odpisać na mail z potwierdzeniem.";

const stac = (pakiet: boolean): PoZakupie => ({
  trening: true,
  gwarancja: pakiet
    ? `Po trzeciej sesji kładziemy kartę pierwszą obok trzeciej i mówię wprost, co idzie, a co stoi. ${BRAK_TERMINU}`
    : `Po sesji mówię wprost, ile sesji potrzebujesz. Jeśli wystarczy ta jedna, usłyszysz to ode mnie. ${BRAK_TERMINU}`,
  pomiar: "Karta obciążeń z każdej sesji zostaje u Ciebie.",
  kroki: krokiStacjonarne(pakiet),
  przygotuj: PRZYGOTUJ_STACJONARNY,
  strona: STACJONARNY,
});

const onl = (pakiet: boolean): PoZakupie => ({
  trening: true,
  gwarancja: pakiet
    ? `Po trzecim treningu kładziemy nagranie pierwsze obok trzeciego i mówię wprost, co idzie, a co stoi. ${BRAK_TERMINU}`
    : `Po treningu mówię wprost, ile treningów potrzebujesz. Jeśli wystarczy ten jeden, usłyszysz to ode mnie. ${BRAK_TERMINU}`,
  pomiar: "Notatka i nagrania z każdego treningu zostają u Ciebie.",
  kroki: krokiOnline(pakiet),
  przygotuj: PRZYGOTUJ_ONLINE,
  strona: ONLINE,
});

const PO_ZAKUPIE: Record<IdProduktu, PoZakupie> = {
  "stacjonarny-1": stac(false),
  "stacjonarny-3": stac(true),
  "stacjonarny-5": stac(true),
  "online-1": onl(false),
  "online-3": onl(true),
  "online-5": onl(true),
  ebook: {
    trening: false,
    gwarancja: "Dostęp jest bezterminowy, działa na telefonie, a aktualizacje dostajesz bez dopłat. Jeśli w ciągu 30 dni przejdziesz na plan albo prowadzenie, cenę e-booka odliczam w całości.",
    kroki: [
      PLATNOSC_ZROBIONA,
      {
        kiedy: "Teraz",
        co: "Pobierasz e-booka",
        opis: "Przycisk wyżej na tej stronie, a ten sam link masz w mailu z potwierdzeniem. PDF działa na telefonie i na komputerze, link bezterminowo.",
      },
      {
        kiedy: "Przez 30 dni",
        co: "Cena e-booka wraca przy przejściu wyżej",
        opis: "Jeśli w tym czasie kupisz plan indywidualny albo prowadzenie, odliczam 99 zł w całości.",
      },
    ],
    przygotuj: [
      "Zacznij od rozdziału o budowie tygodnia, zanim otworzysz ćwiczenia",
      "Wydrukuj arkusz progresji z Segmentu 06 albo przepisz go do notatek w telefonie",
      "Wpisz ciężary już z pierwszego treningu, żeby było z czym porównać",
    ],
    strona: PLANY,
  },
  plan: {
    trening: false,
    gwarancja: `Plan gotowy w 72 godziny od ankiety, z nagraniem, w którym tłumaczę każdą decyzję. ${ODSTAPIENIE}`,
    pomiar: "Wpisuj ciężary do arkusza od pierwszego tygodnia.",
    kroki: [
      PLATNOSC_ZROBIONA,
      ANKIETA_TERAZ,
      telefon("Kilka minut rozmowy o ankiecie, żeby plan nie opierał się na domysłach."),
      {
        kiedy: "Do 72 godzin",
        co: "Plan i nagranie w panelu",
        opis: "Plan na 12 tygodni i pięciominutowe nagranie, w którym tłumaczę każdą decyzję.",
      },
      {
        kiedy: "Pierwszy tydzień",
        co: "Pierwszy wpis w arkuszu",
        opis: "Ciężary z pierwszego tygodnia to punkt odniesienia. Bez nich nie ma czego porównać.",
      },
      {
        kiedy: "Po 12 tygodniach",
        co: "Porównanie w arkuszu",
        opis: "Pierwszy tydzień obok dwunastego: widać, co poszło w górę, a co stoi.",
      },
    ],
    przygotuj: [
      "Zaplanuj w kalendarzu dni treningowe na najbliższy tydzień",
      "Obejrzyj nagranie z omówieniem planu, zanim zaczniesz",
      "Wpisuj ciężary do arkusza od pierwszego treningu",
    ],
    strona: PLANY,
  },
  prowadzenie: {
    trening: false,
    gwarancja: `Check-in co 7 dni z moją odpowiedzią, nie automatem. Płacisz miesiąc do miesiąca i rezygnujesz kiedy chcesz: SMS-em, telefonicznie (${TELEFON}) albo mailem. Kolejne płatności zatrzymuję, a prowadzenie trwa do końca opłaconego miesiąca.`,
    pomiar: "Wpisuj ciężary do arkusza, na nich opiera się każda korekta planu.",
    kroki: [
      PLATNOSC_ZROBIONA,
      ANKIETA_TERAZ,
      telefon("Ustalamy termin rozmowy diagnostycznej i dopytuję o ankietę."),
      {
        kiedy: "Do 72 godzin",
        co: "Plan w panelu",
        opis: "Plan na pierwszy miesiąc i nagranie z omówieniem.",
      },
      {
        kiedy: "Co 7 dni",
        co: "Check-in i korekta",
        opis: "Krótki raport z tygodnia. Odpisuję osobiście i poprawiam plan w trakcie, nie na koniec miesiąca.",
      },
    ],
    przygotuj: [
      "Zanotuj ciężary z ostatniego treningu, jeśli trenujesz",
      "Nagraj z boku jedną serię przysiadu albo martwego ciągu, przyda się w rozmowie",
      "Wybierz stały dzień tygodnia na check-in",
    ],
    strona: PLANY,
  },
};

/* ─────────────────────────────────────────────────────── STAN PŁATNOŚCI */

type Stan = "oplacone" | "w-toku" | "niepotwierdzone";

async function sprawdzPlatnosc(sp: SP): Promise<{ stan: Stan; id?: string; numer?: string; kwota?: number; demo: boolean }> {
  const sesja = typeof sp.session_id === "string" ? sp.session_id : undefined;

  if (sesja && stripe) {
    try {
      const s = await stripe.checkout.sessions.retrieve(sesja);
      const stan: Stan =
        s.payment_status === "paid" || s.payment_status === "no_payment_required"
          ? "oplacone"
          : s.status === "complete"
            ? "w-toku"
            : "niepotwierdzone";
      return { stan, id: s.metadata?.produkt, numer: s.client_reference_id ?? undefined, kwota: (s.amount_total ?? 0) / 100, demo: false };
    } catch {
      return { stan: "niepotwierdzone", demo: false };
    }
  }

  if (trybPokazowy && sp.demo === "1") {
    return { stan: "oplacone", id: typeof sp.produkt === "string" ? sp.produkt : undefined, numer: "MT-DEMO", demo: true };
  }

  return { stan: "niepotwierdzone", demo: false };
}

/* ─────────────────────────────────────────────────────── STRONA */

type SP = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { stan, id, numer, kwota, demo } = await sprawdzPlatnosc(sp);
  const katalog = stan === "niepotwierdzone" ? undefined : znajdzProdukt(id);
  const produkt = katalog ? { ...PO_ZAKUPIE[katalog.id], nazwa: katalog.nazwa, telefon: katalog.telefon } : undefined;
  const kroki = produkt
    ? produkt.kroki.map((k) => (stan === "w-toku" && k === PLATNOSC_ZROBIONA ? PLATNOSC_W_TOKU : k))
    : [];
  const pierwszyOtwarty = kroki.findIndex((k) => !k.zrobione);
  const ankieta = katalog && katalog.rodzaj !== "ebook" && numer ? linkDoAnkiety(numer, katalog) : undefined;
  /* E-book (także w planie i prowadzeniu): przycisk tylko przy opłaconej
     sesji. Link i tak sprawdza płatność w Stripe przy każdym pobraniu. */
  const sesja = typeof sp.session_id === "string" ? sp.session_id : demo ? "demo" : undefined;
  const ebook = stan === "oplacone" && sesja && maEbooka(katalog) ? linkDoEbooka(sesja) : undefined;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* Zakup do GA4 i Meta Pixel (tylko przy zgodzie z banera). */}
      {stan === "oplacone" && !demo && sesja && katalog && (
        <ZdarzenieZakupu id={sesja} numer={numer} wartosc={kwota ?? 0} produkt={katalog.id} nazwa={katalog.nazwa} />
      )}
      <div className="zm">
        <header className="zm-gora">
          <div className="zm-gora-wnetrze">
            <span className="zm-marka">Maks Treningi</span>
            {produkt && (
              <Link href={produkt.strona.href} className="zm-wstecz">
                Wróć do strony: {produkt.strona.nazwa}
              </Link>
            )}
          </div>
          <ol className="zm-postep" aria-label="Etapy zamówienia">
            <li className={stan === "oplacone" ? "zm-etap zm-etap-zrobiony" : "zm-etap zm-etap-aktywny"}>Płatność</li>
            <li
              className={stan === "oplacone" ? "zm-etap zm-etap-aktywny" : "zm-etap"}
              aria-current={stan === "oplacone" ? "step" : undefined}
            >
              Ankieta
            </li>
            <li className="zm-etap">Termin</li>
          </ol>
        </header>

        <main className="zm-wnetrze">
          {demo && (
            <p className="zm-demo">
              Tryb pokazowy: brak klucza Stripe, więc zakup przeszedł tu bez zapłaty. Na produkcji ta ścieżka jest
              wyłączona.
            </p>
          )}

          {!produkt ? (
            /* niepotwierdzone */
            <>
              <div className="zm-naglowek">
                <h1>Nie widzę jeszcze potwierdzenia płatności</h1>
                <p>
                  Jeśli płatność przeszła, mail z potwierdzeniem przyjdzie w ciągu kilku minut. Jeśli nie przyjdzie
                  w ciągu godziny albo coś poszło nie tak, zadzwoń: <a href={TELEFON_HREF}>{TELEFON}</a>. Pieniądze nie
                  przepadną.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 1 · potwierdzenie */}
              <div className="zm-naglowek zm-potwierdzenie">
                <span className="zm-znak" aria-hidden="true" />
                <div>
                  <h1>{stan === "w-toku" ? "Dziękuję, czekamy jeszcze na bank" : "Dziękuję, zamówienie przyjęte"}</h1>
                  <p>
                    {stan === "w-toku"
                      ? `${produkt.nazwa}. Bank jeszcze potwierdza płatność. Gdy dojdzie, przyjdzie mail, a niżej masz wszystko, co dzieje się dalej.`
                      : `${produkt.nazwa}. Potwierdzenie przychodzi na Twój e-mail, a niżej masz wszystko, co dzieje się dalej.`}
                  </p>
                  {numer && (
                    <p className="zm-numer">
                      Numer zamówienia: <strong>{numer}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* 1a · e-book do pobrania (e-book, plan, prowadzenie) */}
              {ebook && (
                <section className="zm-telefon" aria-labelledby="ebook">
                  <div>
                    <h2 id="ebook">
                      {katalog?.rodzaj === "ebook" ? "Twój e-book jest gotowy" : "E-book w pakiecie, już teraz"}
                    </h2>
                    <p>
                      „Plan Bez Zgadywania” w PDF. Ten sam link masz w mailu z potwierdzeniem i działa bezterminowo,
                      więc pobierzesz go ponownie na każdym urządzeniu.
                    </p>
                  </div>
                  <a href={ebook} className="zm-przycisk zm-przycisk-waski">
                    Pobierz e-booka (PDF)
                  </a>
                </section>
              )}

              {/* 1b · ankieta po płatności (poza e-bookiem) */}
              {ankieta && (
                <section className="zm-telefon" aria-labelledby="ankieta">
                  <div>
                    <h2 id="ankieta">Teraz ankieta, 3 minuty</h2>
                    <p>
                      Dzięki niej wiem, z czym przychodzisz i jak się z Tobą kontaktować. Ten sam link masz w mailu,
                      więc możesz wypełnić ją też później.
                    </p>
                  </div>
                  <a href={ankieta} className="zm-przycisk zm-przycisk-waski">
                    Wypełnij ankietę
                  </a>
                </section>
              )}

              {/* 2 · telefon w 24 h */}
              {produkt.telefon && (
                <section className="zm-telefon" aria-labelledby="telefon">
                  <div>
                    <h2 id="telefon">Zadzwonię do Ciebie w ciągu 24 godzin</h2>
                    <p>
                      W dni robocze, z numeru <strong>{TELEFON}</strong>. Zapisz go teraz w kontaktach, żeby nie
                      odrzucić połączenia od nieznanego numeru. Jeśli nie odbierzesz, napiszę SMS-a i zadzwonię jeszcze
                      raz.
                    </p>
                  </div>
                  <a href={VCARD} download="maks-treningi.vcf" className="zm-przycisk zm-przycisk-waski">
                    Zapisz numer w kontaktach
                  </a>
                </section>
              )}

              {/* 3 · cały proces */}
              <div className="zm-uklad">
                <div>
                  <section className="zm-blok" aria-labelledby="proces">
                    <h2 id="proces">Cały proces, krok po kroku</h2>
                    <p className="zm-podtytul">
                      {stan === "w-toku"
                        ? "Gdy bank potwierdzi płatność, dalej nic nie musisz robić, dopóki się nie odezwę."
                        : produkt.trening || produkt.telefon
                          ? "Płatność masz za sobą. Wypełnij jeszcze ankietę, a potem nic nie musisz robić, dopóki się nie odezwę."
                          : "Płatność masz za sobą. Dalej nic nie musisz robić."}
                    </p>
                    <ol className="zm-os">
                      {kroki.map((k, i) => (
                        <li
                          key={k.co}
                          className={
                            k.zrobione ? "zm-krok zm-krok-zrobiony" : i === pierwszyOtwarty ? "zm-krok zm-krok-teraz" : "zm-krok"
                          }
                        >
                          <span className="zm-kiedy">{k.kiedy}</span>
                          <span className="zm-co">{k.co}</span>
                          <p className="zm-opis">{k.opis}</p>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="zm-blok" aria-labelledby="przygotuj">
                    <h2 id="przygotuj">{produkt.trening ? "Na pierwszy trening" : "Na początek"}</h2>
                    <ul className="zm-lista-jasna" style={{ marginTop: 16 }}>
                      {produkt.przygotuj.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <aside className="zm-boczna">
                  <section className="zm-podsumowanie" aria-labelledby="zamowione">
                    <h2 id="zamowione">Zamówione</h2>
                    <p className="zm-nazwa">{produkt.nazwa}</p>
                    <p className="zm-gwarancja" style={{ marginTop: 16 }}>
                      <strong>Moja gwarancja</strong>
                      {produkt.gwarancja}
                    </p>
                    <p className="zm-metody">
                      {produkt.telefon
                        ? "Coś się nie zgadza albo chcesz zmienić termin? Zadzwoń albo napisz SMS-a z numerem zamówienia."
                        : "Link nie przyszedł w ciągu godziny? Zadzwoń albo napisz SMS-a z numerem zamówienia."}
                    </p>
                    <a href={TELEFON_HREF} className="zm-przycisk">
                      Zadzwoń: {TELEFON}
                    </a>
                  </section>
                </aside>
              </div>

              {/* 4 · ostateczne przypomnienie */}
              <section className="zm-koniec" aria-labelledby="koniec">
                <h2 id="koniec">Zanim zamkniesz tę stronę</h2>
                <ol className="zm-trzy">
                  {produkt.telefon ? (
                    <li>
                      <strong>Odbierz telefon.</strong> Dzwonię w ciągu 24 h w dni robocze z numeru {TELEFON}. To od
                      tej rozmowy zależy termin.
                    </li>
                  ) : (
                    <li>
                      <strong>Sprawdź skrzynkę.</strong> Link do e-booka przychodzi w ciągu kilku minut, czasem do
                      folderu Oferty albo Spam.
                    </li>
                  )}
                  <li>
                    <strong>{produkt.telefon ? "Sprawdź skrzynkę." : "Zapisz arkusz."}</strong>{" "}
                    {produkt.telefon
                      ? "Potwierdzenie z numerem zamówienia już tam jest albo zaraz przyjdzie, czasem do folderu Oferty albo Spam."
                      : "Skopiuj arkusz progresji do siebie i wpisuj ciężary od pierwszego treningu."}
                  </li>
                  <li>
                    {produkt.pomiar ? (
                      <>
                        <strong>Zapisuj ciężary.</strong> {produkt.pomiar} Bez zapisu nie ma czego porównać.
                      </>
                    ) : (
                      <>
                        <strong>Masz pytanie?</strong> Dzwoń albo pisz na {TELEFON}. Odpisuję w 24 h w dni robocze.
                      </>
                    )}
                  </li>
                </ol>
                <p className="zm-koniec-link">
                  <Link href={produkt.strona.href}>Wróć do strony: {produkt.strona.nazwa}</Link>
                </p>
              </section>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────────────── CSS
   Ten sam co w app/zamowienie/page.tsx, plus trzy bloki tej strony:
   .zm-telefon, .zm-krok-zrobiony i .zm-koniec. Zmieniasz kolory tam,
   zmień też tutaj. */

const CSS = `
.zm{--grafit:#14181d;--limonka:#d2f34c;--mgla:#edeff2;--szary:#5f6672;--linia:#d6dae0;--bialy:#fff;background:var(--mgla);color:var(--grafit);font-family:inherit;min-height:100vh}
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
.zm-naglowek{max-width:44rem;margin-bottom:28px}
.zm-naglowek h1{font-size:clamp(1.75rem,1.2rem + 2.2vw,2.6rem);line-height:1.12;letter-spacing:-.01em;margin:0 0 12px}
.zm-naglowek p{font-size:1.05rem;line-height:1.55;color:var(--szary);margin:0}
.zm-naglowek a{color:var(--grafit);font-weight:700;white-space:nowrap}
.zm-telefon{background:var(--grafit);color:var(--bialy);border-radius:14px;padding:26px 24px;margin:0 0 32px;display:grid;gap:18px;border-left:6px solid var(--limonka)}
@media (min-width:760px){.zm-telefon{grid-template-columns:minmax(0,1fr) auto;align-items:center;padding:30px 32px;gap:32px}}
.zm-telefon h2{font-size:clamp(1.3rem,1.1rem + 1vw,1.75rem);line-height:1.2;margin:0 0 8px}
.zm-telefon p{margin:0;color:#c9ced6;line-height:1.55;max-width:40rem}
.zm-telefon strong{color:var(--bialy);white-space:nowrap}
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
.zm-krok-zrobiony::before{content:"✓";background:var(--mgla);color:var(--szary)}
.zm-krok-zrobiony .zm-kiedy,.zm-krok-zrobiony .zm-co{color:var(--szary)}
.zm-kiedy{display:block;font-weight:700;font-size:.95rem;margin-bottom:2px}
.zm-co{display:block;font-size:.95rem;margin-bottom:4px}
.zm-opis{margin:0;color:var(--szary);font-size:.93rem;line-height:1.5;max-width:36rem}
.zm-podsumowanie{background:var(--grafit);color:var(--bialy);border-radius:14px;padding:28px 24px}
.zm-podsumowanie h2{font-size:1rem;font-weight:600;color:#c9ced6;margin:0 0 14px}
.zm-nazwa{font-size:1.4rem;font-weight:700;line-height:1.2;margin:0 0 6px}
.zm-lista-jasna{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.zm-lista-jasna li{position:relative;padding-left:24px;line-height:1.5}
.zm-lista-jasna li::before{content:"";position:absolute;left:3px;top:.5em;width:9px;height:5px;border-left:2px solid var(--grafit);border-bottom:2px solid var(--grafit);transform:rotate(-45deg)}
.zm-gwarancja{border:1.5px solid var(--limonka);border-radius:10px;padding:14px 16px;margin:0 0 20px;font-size:.92rem;line-height:1.5}
.zm-gwarancja strong{display:block;color:var(--limonka);margin-bottom:2px}
.zm-metody{font-size:.85rem;color:#c9ced6;line-height:1.5;margin:0 0 18px}
.zm-przycisk{font:inherit;font-weight:700;font-size:1.05rem;width:100%;border:0;border-radius:12px;padding:16px 20px;background:var(--limonka);color:var(--grafit);cursor:pointer;text-align:center;text-decoration:none;display:inline-block}
.zm-przycisk:hover{background:#c3e53a}
.zm-przycisk:focus-visible{outline:3px solid var(--bialy);outline-offset:3px}
.zm-przycisk-waski{width:auto;white-space:nowrap}
@media (max-width:759px){.zm-przycisk-waski{width:100%;white-space:normal}}
.zm-koniec{margin-top:40px;background:var(--bialy);border-radius:14px;padding:28px 24px;border-top:6px solid var(--limonka)}
@media (min-width:640px){.zm-koniec{padding:32px}}
.zm-koniec h2{font-size:1.3rem;margin:0 0 18px}
.zm-trzy{margin:0;padding:0;list-style:none;display:grid;gap:16px;counter-reset:trzy}
@media (min-width:860px){.zm-trzy{grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}}
.zm-trzy li{counter-increment:trzy;line-height:1.5;color:var(--szary);font-size:.95rem}
.zm-trzy li::before{content:counter(trzy);display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--grafit);color:var(--limonka);font-weight:700;font-size:.85rem;margin-bottom:10px}
.zm-trzy strong{display:block;color:var(--grafit);font-size:1rem;margin-bottom:2px}
.zm-koniec-link{margin:22px 0 0;font-size:.9rem}
.zm-koniec-link a{color:var(--grafit);font-weight:600}
.zm-potwierdzenie{display:flex;gap:16px;align-items:flex-start}
.zm-znak{flex:none;width:52px;height:52px;border-radius:50%;background:var(--limonka);display:grid;place-items:center}
.zm-znak::before{content:"";width:20px;height:10px;border-left:3.5px solid var(--grafit);border-bottom:3.5px solid var(--grafit);transform:translateY(-3px) rotate(-45deg)}
.zm-numer strong{white-space:nowrap}
.zm-numer{display:inline-block;margin-top:14px;background:var(--bialy);border-radius:8px;padding:8px 12px;font-size:.92rem}
.zm-demo{background:#fff7d6;border-radius:10px;padding:12px 14px;font-size:.88rem;line-height:1.5;margin:0 0 24px}
@media (prefers-reduced-motion:no-preference){.zm-przycisk{transition:background-color .12s ease}}
`;
