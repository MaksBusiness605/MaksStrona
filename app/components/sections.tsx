// PLIK: app/components/sections.tsx · KOMPONENTY STRON · nowa stopka z regulaminem i danymi firmy
"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  Check,
  ClipboardList,
  Clock,
  CreditCard,
  Dumbbell,
  Eye,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PhoneOff,
  Play,
  RotateCcw,
  ShieldCheck,
  Timer,
  TrendingUp,
  Video,
} from "lucide-react";
import { LeadForm } from "@/app/components/LeadForm";
import { FIRMA } from "@/app/tresc/firma";

/* ═══════════════════════════════════════════════════════════════════════
   SYSTEM · co się zmieniło w tej wersji

   1. SKALA ZŁOTEJ PROPORCJI (φ = 1,618). Wszystkie rozmiary tekstu,
      odstępy sekcji i podziały kolumn są wyprowadzone z jednej liczby.
      Skala typograficzna idzie krokiem √φ (1,272) dla tekstu i φ dla
      nagłówków, więc h1 : h2 : body układa się w 4,236 : 2,618 : 1 rem.
      Odstępy: 0,618 · 1 · 1,618 · 2,618 · 4,236 · 6,854 rem.

   2. TYPOGRAFIA PŁYNNA. Zamiast text-3xl sm:text-4xl wszędzie stoi
      clamp(). Nagłówek nie skacze na progu breakpointu, tylko rośnie
      razem z ekranem.

   3. PODZIAŁY KOLUMN. Hero i sekcja autora dzielą się 1,618fr / 1fr.
      Zdjęcia mają proporcje 1 : 1,272 (pion) i 1,272 : 1 (poziom).

   4. TELEFON. Przyciski są pełnej szerokości do 640 px i mają minimum
      52 px wysokości. Przyklejony pasek CTA na dole ekranu (StickyCta)
      i przyklejony nagłówek u góry z rozmyciem tła.

   5. ZDJĘCIA
      · <Shot> przyjmuje `src` i `alt`. Bez `src` pokazuje brief.
      · <Benefits> przyjmuje `image` / `alt` na każdym elemencie,
        opcjonalny `heading` i `tone` ("light" | "fog").
      · <Team> przyjmuje `image`.

   6. <Urgency>
      · scroll-mt-24, więc kotwica nie wchodzi pod przyklejony nagłówek.
      · `children`: slot na kalendarz z płatnością albo formularz.

   7. <Quotes>: opinie pisane i wideo w jednej siatce.

   8. <Proof>: same nagrania, maksymalnie dwa.
      · NOWE: nagranie bez pliku, ale z `poster`, pokazuje samo zdjęcie,
        bez przycisku play. Dopiero dopisanie `src` robi z kafla
        odtwarzacz. Bez pliku i bez postera zostaje ciemny kafel z briefem.

   9. <Stats> przyjmuje ikony "sesje", "progres", "sala", "ciezar"
      oraz stare "video", "clock", "return".

   10. <HeroShot>
       · NOWE: `split` wybiera podział kolumn na desktopie:
         "zloty" 1,618 : 1 (domyślny), "tekst" 2,618 : 1, "rowno" 1 : 1.
         Stary `titleWide` działa dalej i znaczy to samo co "tekst".
       · NOWE: `imageAlt` (renderowany na zdjęciu) i `imageRatio`
         (0.786 pion, 1 kwadrat, 1.272 poziom).

   11. DOSTĘPNOŚĆ. Widoczny focus na wszystkich linkach i przyciskach,
       respektowane prefers-reduced-motion, kontrast tekstu pomocniczego
       co najmniej white/60.

   12. <Lokalizacja> (NOWA). Jedna sekcja, dwa tryby:
       · `mapa`: adres, dojazd i mapa Google po prawej. Dla treningu
         stacjonarnego.
       · `silownie`: klient zaznacza swoją siłownię i od razu widzi, czy
         trenujemy tam przez kamerę i na jakich warunkach. Dla coachingu
         online.

   13. JEDNA STRONA, JEDEN CEL. <Header> nie ma menu, logo nie jest
       linkiem. <Footer> linkuje wyłącznie do dokumentów prawnych
       (regulamin, polityka prywatności) i pokazuje dane sprzedawcy
       z app/tresc/firma.ts. Żaden inny komponent nie linkuje dalej.

   14. <CaseStudies> (NOWA). Dwie historie zamiast opinii: kto, skąd
       startował, liczby przed i po, trzy etapy i jedno zdanie tej osoby.
       <Proof> zostaje w pliku, ale strony już go nie używają.

   15. <Recenzje> (NOWA). Trzy opinie zbudowane wokół dream outcome:
       nagłówkiem karty jest zdanie o stanie po, a nie nazwisko. Pierwsza
       karta ciemna, w stopce kwadratowe zdjęcie albo inicjały. Alternatywa dla <CaseStudies>, nie dodatek: obie
       naraz to dwa razy ten sam dowód.

   16. <OdZakupu> (NOWA). Następca <Steps> na stronach, gdzie płaci się
       z góry. Oś czasu jak rozkład jazdy (kiedy · kwadrat · co). Na
       desktopie nagłówek i przycisk przyklejone po lewej, oś po prawej.
       <Steps> zostaje dla pozostałych stron.

   17. <Zobowiazania> (NOWA). Gwarancja bez zwrotu pieniędzy i bez
       darmowych sesji: ciemny panel na pełną szerokość, obietnica
       po lewej, cztery zobowiązania z ikoną i momentem sprawdzenia
       („po 1. sesji") po prawej. <Guarantee> zostaje w pliku.

   18. <CennikRzedy> (NOWA). Druga wersja cennika: wspólne rzeczy raz,
       w pasku z ikonami, a warianty jako rzędy z samymi różnicami. Ceny
       stoją w jednej pionowej linii. <Offers> zostaje dla innych stron.

   19. <CennikWybor> (NOWA). Trzecia wersja cennika: wybierasz liczbę
       sesji, ciemny panel pokazuje tylko ten wariant. Domyślnie otwarty
       wariant wyróżniony. Dane jak w <CennikRzedy> plus `krotko`
       i `stawka` przy każdej opcji.

   WYMAGA: npm i lucide-react · tokeny grafit, sygnal, stal, mgla
   ═══════════════════════════════════════════════════════════════════════ */

/* ---------------------------------------------------------------- TOKENY */

/** Kontener treści. Jedna linijka zmienia szerokość całej strony. */
const WRAP = "mx-auto w-full max-w-[1352px] px-5 sm:px-8 lg:px-10";

/** Kolumna czystego tekstu. 1352 / φ ≈ 835 px. Krótka linia to decyzja. */
const WRAP_TEXT = "mx-auto w-full max-w-[52rem] px-5 sm:px-8";

/** Pion sekcji. Dolna granica pod telefon, górna to 6,854 rem = φ⁴. */
const PAD = "py-[clamp(3.5rem,8vw,6.854rem)]";
const PAD_LG = "py-[clamp(4rem,9.5vw,8.5rem)]";

/** Odstęp między kolumnami: 2,618 rem → 4,236 rem. */
const GAP = "gap-[clamp(2.618rem,5vw,4.236rem)]";

/** Skala typograficzna. Podkreślniki w clamp() są wymagane przez Tailwind. */
const T = {
  h1: "font-display text-[clamp(2.25rem,1.35rem_+_3.6vw,4.236rem)] leading-[1.02] tracking-[-0.025em] text-balance",
  h2: "font-display text-[clamp(1.875rem,1.4rem_+_1.9vw,2.618rem)] leading-[1.08] tracking-[-0.02em] text-balance",
  h3: "font-display text-[clamp(1.25rem,1.12rem_+_0.55vw,1.618rem)] leading-[1.18] tracking-[-0.012em]",
  lead: "text-[clamp(1.0625rem,1.01rem_+_0.28vw,1.272rem)] leading-[1.5] text-pretty",
  body: "text-[clamp(0.9375rem,0.91rem_+_0.14vw,1rem)] leading-[1.618] text-pretty",
  small: "text-[0.8125rem] leading-[1.55]",
};

/** Wspólny pierścień focusu. Bez tego strona nie przechodzi klawiaturą. */
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sygnal";

/** Focus do środka elementu: dla kafli stykających się krawędziami. */
const FOCUS_IN =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-sygnal focus-visible:[outline-offset:-4px]";

/* -------------------------------------------------------------- ELEMENTY */

/** Numerowany kwadrat — motyw przewodni marki (punkt na trasie). */
export function Waypoint({
  n,
  size = "md",
  dark = false,
}: {
  n: number | string;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}) {
  const s = {
    sm: "h-6 w-6 text-[11px]",
    md: "h-9 w-9 text-sm",
    lg: "h-14 w-14 text-lg",
  }[size];

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center font-display font-bold tnum ${s} ${
        dark ? "bg-grafit text-sygnal" : "bg-sygnal text-grafit"
      }`}
    >
      {n}
    </span>
  );
}

/** Przycisk. Pełna szerokość na telefonie, min. 52 px wysokości. */
export function Cta({
  children,
  href = "#oferty",
  variant = "signal",
  className = "",
  block = false,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "signal" | "graphite" | "onDark";
  className?: string;
  /** Wymusza pełną szerokość również na dużych ekranach. */
  block?: boolean;
}) {
  const styles = {
    signal: "bg-sygnal text-grafit hover:bg-grafit hover:text-sygnal",
    graphite: "bg-grafit text-white hover:bg-sygnal hover:text-grafit",
    onDark: "bg-sygnal text-grafit hover:bg-white",
  }[variant];

  return (
    <a
      href={href}
      className={`inline-flex min-h-[3.25rem] items-center justify-center px-7 py-4 text-center font-display text-[0.8125rem] font-bold uppercase leading-tight tracking-[0.09em] transition-colors duration-200 sm:text-sm ${
        block ? "w-full" : "w-full sm:w-auto"
      } ${styles} ${FOCUS} ${className}`}
    >
      {children}
    </a>
  );
}

/**
 * Zdjęcie albo placeholder. Z `src` renderuje kadr przycięty do proporcji,
 * bez `src` pokazuje brief dla fotografa.
 */
export function Shot({
  brief,
  ratio = "1.272",
  className = "",
  src,
  alt = "",
}: {
  brief: string;
  /** Proporcja jako liczba: 1.272 poziom, 0.786 pion. */
  ratio?: string;
  className?: string;
  /** Ścieżka w /public, np. "/zdjecia/korzysc-1.jpg". */
  src?: string;
  alt?: string;
}) {
  if (src) {
    return (
      <div
        style={{ aspectRatio: ratio }}
        className={`relative w-full overflow-hidden bg-mgla ${className}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative flex w-full items-center justify-center bg-mgla p-6 sm:p-8 ${className}`}
    >
      <Corners tone="light" />
      <p className="max-w-[34ch] text-center text-[0.8125rem] leading-relaxed text-stal">
        {brief}
      </p>
    </div>
  );
}

/** Narożniki celownika. Wizualny język produktu: ktoś patrzy przez kamerę. */
function Corners({ tone = "light" }: { tone?: "light" | "dark" | "signal" }) {
  const color = {
    light: "border-stal/40",
    dark: "border-white/30",
    signal: "border-sygnal",
  }[tone];
  const base = `pointer-events-none absolute h-3.5 w-3.5 ${color}`;

  return (
    <span aria-hidden="true">
      <span className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}

/* -------------------------------------------------------------- NAGŁÓWEK */

/* JEDNA STRONA, JEDEN CEL. Nagłówek i stopka nie linkują do innych
   podstron: bez menu, a logo nie prowadzi na stronę główną. Każde
   wyjście ze strony to człowiek, który nie kliknie „Kup". Jedyne linki
   wychodzące to regulamin i polityka prywatności w stopce, bo są
   wymagane. */

export function Header({
  cta,
  ctaHref = "#oferty",
  phone = "537 483 233",
  phoneHref = "tel:+48537483233",
}: {
  cta: string;
  ctaHref?: string;
  phone?: string;
  phoneHref?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-mgla bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
      {/* Płynne przewijanie i zapas pod przyklejonym nagłówkiem. */}
      <style>{`
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
        }
      `}</style>

      <div
        className={`${WRAP} flex items-center justify-between gap-3 py-3.5 sm:gap-4 sm:py-4`}
      >
        {/* Logo bez linku: kliknięcie nie wyprowadza ze strony. */}
        <div className="flex shrink-0 items-center gap-2.5">
          <Waypoint n="↑" size="sm" dark />
          <span className="font-display text-[0.9375rem] font-extrabold tracking-tight sm:text-base">
            Maks Treningi
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          {/* Na telefonie numer zwija się do ikony: miejsce idzie na CTA. */}
          <a
            href={phoneHref}
            aria-label={`Zadzwoń: ${phone}`}
            className={`flex h-11 w-11 items-center justify-center text-grafit sm:hidden ${FOCUS}`}
          >
            <Phone aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
          </a>
          <a
            href={phoneHref}
            className={`hidden text-sm font-semibold tnum underline underline-offset-4 sm:block ${FOCUS}`}
          >
            {phone}
          </a>

          <a
            href={ctaHref}
            className={`inline-flex min-h-[2.75rem] max-w-[11rem] items-center truncate bg-grafit px-4 py-2.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-white transition-colors hover:bg-sygnal hover:text-grafit sm:max-w-none sm:px-5 sm:text-xs ${FOCUS}`}
          >
            {cta}
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ HERO */

/** Delikatna siatka na grafitowym tle. Moduł 2,618 rem, wygaszana u dołu. */
function GraphiteGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:2.618rem_2.618rem] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
    />
  );
}

/** Hero z formularzem w prawej kolumnie. Zostaje dla innych stron. */
export function Hero({
  proof,
  title,
  lead,
  points,
  disclaimer,
  cta,
  formTitle,
  formLead,
  source,
}: {
  proof: string;
  title: string;
  lead: string;
  points: string[];
  disclaimer: string;
  cta: string;
  formTitle: string;
  formLead: string;
  source: string;
}) {
  return (
    <section
      id="formularz"
      className="relative isolate scroll-mt-24 overflow-hidden bg-grafit text-white"
    >
      <GraphiteGrid />

      <div
        className={`${WRAP} ${GAP} ${PAD_LG} grid items-center lg:grid-cols-[1fr_28.5rem]`}
      >
        <div>
          <p className="eyebrow text-sygnal">{proof}</p>

          <h1 className={`${T.h1} mt-5 max-w-[17ch]`}>{title}</h1>

          <p className={`${T.lead} mt-6 max-w-[46ch] text-white/70`}>{lead}</p>

          <ul className="mt-9 max-w-[46ch] space-y-3.5">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <Waypoint n={i + 1} size="sm" />
                <span className={`${T.body} pt-0.5 text-white/85`}>{p}</span>
              </li>
            ))}
          </ul>

          <Cta href="#pola" variant="onDark" className="mt-9 lg:hidden">
            {cta}
          </Cta>

          <p
            className={`${T.small} mt-8 max-w-[46ch] border-t border-white/15 pt-5 text-white/60`}
          >
            {disclaimer}
          </p>
        </div>

        <div id="pola" className="scroll-mt-24">
          <LeadForm
            source={source}
            title={formTitle}
            lead={formLead}
            ctaLabel={cta}
          />
        </div>
      </div>
    </section>
  );
}

/** Hero ze zdjęciem. Podział kolumn: złoty, szeroki tekst albo 50/50. */
export function HeroShot({
  proof,
  title,
  lead,
  points,
  reassurance,
  disclaimer,
  cta,
  ctaHref = "#oferty",
  shot,
  image,
  imageAlt = "",
  imageRatio = "0.786",
  titleWide = false,
  split,
}: {
  proof: string;
  title: string;
  /** Akapit pod nagłówkiem. Pomiń, jeśli same punkty wystarczą. */
  lead?: string;
  points: string[];
  /** Pasek zdejmujący wątpliwości pod przyciskiem. Ma pierwszeństwo przed `disclaimer`. */
  reassurance?: string[];
  disclaimer?: string;
  cta: string;
  ctaHref?: string;
  /** Brief dla fotografa. Pokazuje się, dopóki nie ma `image`. */
  shot: string;
  /** Ścieżka w /public, np. "/zdjecia/hero.jpg". */
  image?: string;
  /** Opis zdjęcia. Pusty string = kadr dekoracyjny. */
  imageAlt?: string;
  /** Proporcja kadru: 0.786 pion 4:5, 1 kwadrat, 1.272 poziom. */
  imageRatio?: string;
  /** Dawna nazwa dla split="tekst". Zostaje dla starszych stron. */
  titleWide?: boolean;
  /**
   * Podział kolumn na desktopie:
   * "zloty" 1,618 : 1 (domyślny) · "tekst" 2,618 : 1 · "rowno" 1 : 1.
   * Telefon bez zmian: jedna kolumna, zdjęcie pod tekstem.
   */
  split?: "zloty" | "tekst" | "rowno";
}) {
  const uklad = split ?? (titleWide ? "tekst" : "zloty");

  const kolumny = {
    zloty: "lg:grid-cols-[1.618fr_1fr]",
    tekst: "lg:grid-cols-[2.618fr_1fr]",
    rowno: "lg:grid-cols-2",
  }[uklad];

  /* Linia nagłówka rośnie razem z kolumną. */
  const liniaTytulu = {
    zloty: "",
    tekst: "lg:max-w-[24ch]",
    rowno: "lg:max-w-[18ch]",
  }[uklad];

  return (
    <section className="relative isolate overflow-hidden bg-grafit text-white">
      <GraphiteGrid />

      <div className={`${WRAP} ${GAP} ${PAD_LG} grid items-center ${kolumny}`}>
        <div>
          <p className="eyebrow text-sygnal">{proof}</p>

          <h1 className={`${T.h1} mt-5 max-w-[16ch] ${liniaTytulu}`}>{title}</h1>

          {lead && (
            <p className={`${T.lead} mt-6 max-w-[46ch] text-white/70`}>{lead}</p>
          )}

          <ul className="mt-9 max-w-[48ch] space-y-4">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <Waypoint n={i + 1} size="sm" />
                <span className={`${T.body} pt-0.5 text-white/85`}>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Cta href={ctaHref} variant="onDark">
              {cta}
            </Cta>
          </div>

          {reassurance?.length ? (
            <ul className="mt-8 flex max-w-[56ch] flex-col gap-y-2.5 border-t border-white/15 pt-5 sm:flex-row sm:flex-wrap sm:gap-x-7">
              {reassurance.map((r, i) => (
                <li
                  key={i}
                  className={`${T.small} flex items-center gap-2.5 text-white/60`}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 shrink-0 bg-sygnal"
                  />
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            disclaimer && (
              /* Warunki pod przyciskiem: cena, płatność, gwarancja. Czytane
                 tuż przed kliknięciem, więc idą w rozmiarze tekstu, nie
                 drobnym drukiem. Wróć na ${T.small}, jeśli mają zejść
                 na drugi plan. */
              <p
                className={`${T.body} mt-8 flex max-w-[56ch] items-start gap-3 border-t border-white/15 pt-5 text-white/70`}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 bg-sygnal"
                />
                {disclaimer}
              </p>
            )
          )}
        </div>

        {/* Zdjęcie w kadrze celownika: to samo, co widzi trener. */}
        <div className="relative">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              aria-hidden={imageAlt ? undefined : true}
              style={{ aspectRatio: imageRatio }}
              className="w-full object-cover"
            />
          ) : (
            <Shot ratio={imageRatio} brief={shot} />
          )}
          <span className="pointer-events-none absolute inset-0">
            <Corners tone="signal" />
          </span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- PRZYKLEJONY CTA */

/**
 * Pasek na dole ekranu telefonu. Pokazuje się po przewinięciu pierwszego
 * ekranu i chowa nad stopką, żeby nie zasłaniać domknięcia.
 */
export function StickyCta({
  label,
  href = "#oferty",
  note,
}: {
  label: string;
  href?: string;
  note?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const bottom =
        document.documentElement.scrollHeight - window.innerHeight - y;
      setShow(y > 640 && bottom > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-grafit/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 motion-reduce:transition-none md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Cta href={href} variant="onDark" block>
        {label}
      </Cta>
      {note && (
        <p className="mt-2 text-center text-[0.6875rem] leading-snug text-white/60">
          {note}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ PASEK PROOF */

export function ProofBar({ items }: { items: string[] }) {
  return (
    <section className="border-b border-mgla bg-white">
      <div
        className={`${WRAP} flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5`}
      >
        {items.map((i) => (
          <span key={i} className="eyebrow text-stal">
            {i}
          </span>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- BLOK PROBLEMU */

export function PainPoint({
  title,
  paragraphs,
  shot,
  cta,
  ctaHref = "#oferty",
}: {
  title: string;
  paragraphs: string[];
  shot: string;
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-white">
      <div
        className={`${WRAP} ${GAP} ${PAD_LG} grid items-center lg:grid-cols-[1.618fr_1fr]`}
      >
        <div className="max-w-[46ch]">
          <h2 className={T.h2}>{title}</h2>

          <div className={`${T.body} mt-6 space-y-4 text-stal`}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <Cta href={ctaHref} className="mt-9">
            {cta}
          </Cta>
        </div>

        <Shot ratio="0.786" brief={shot} />
      </div>
    </section>
  );
}

/** Problem wyśrodkowany, bez zdjęcia. Wąska kolumna celowo. */
export function PainCenter({
  title,
  body,
  cta,
  ctaHref = "#oferty",
}: {
  title: string;
  body: string;
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-white">
      <div className={`${WRAP_TEXT} ${PAD_LG} text-center`}>
        <h2 className={`${T.h2} mx-auto max-w-[26ch]`}>{title}</h2>

        <p className={`${T.lead} mx-auto mt-7 max-w-[58ch] text-stal`}>{body}</p>

        <div className="mt-9 flex justify-center">
          <Cta href={ctaHref}>{cta}</Cta>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- OPINIE
   · Pisane i wideo w jednej siatce 3 kolumn. Najlepiej 6 pozycji
     w szachownicę. Trzymaj liczbę podzielną przez 3.
   · `quote` pod nagraniem to jedno zdanie do przeczytania bez
     odtwarzania. Większość ludzi nie włączy dźwięku.
   ─────────────────────────────────────────────────────────────────────── */

export type QuoteItem =
  | {
      type?: "text";
      text: string;
      name: string;
      meta: string;
    }
  | {
      type: "video";
      name: string;
      meta: string;
      /** Brief nagrania. Pokazuje się, dopóki nie ma `src`. */
      brief: string;
      /** Jedno zdanie z nagrania, dosłownie. */
      quote?: string;
      /** Plik wideo, np. "/wideo/opinia-anna.mp4" albo URL z CDN. */
      src?: string;
      /** Klatka z twarzą — bez niej kafel jest czarny do kliknięcia. */
      poster?: string;
      /** Plik .vtt z napisami, jeśli nie są wypalone w obrazie. */
      captions?: string;
    };

/** Kadr 4:5 zaokrąglony do skali marki. Nagrywaj i eksportuj w 4:5. */
const VIDEO_RATIO = "0.786";

export function Quotes({
  heading,
  items,
  cta,
  ctaHref = "#oferty",
}: {
  heading: string;
  items: QuoteItem[];
  cta: string;
  ctaHref?: string;
}) {
  // Gra tylko jedno nagranie naraz.
  const pauseOthers = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const current = e.currentTarget;
    current
      .closest("section")
      ?.querySelectorAll("video")
      .forEach((v) => {
        if (v !== current) v.pause();
      });
  };

  return (
    <section className="bg-mgla">
      <div className={`${WRAP} ${PAD}`}>
        <h2 className={`${T.h2} max-w-[22ch]`}>{heading}</h2>

        {/* Telefon: jeden rząd przewijany w poziomie, kolejny kafel wystaje
            z prawej. Od md: zwykła siatka 3 kolumn. */}
        <div
          role="region"
          aria-label={heading}
          tabIndex={0}
          className={`mt-[clamp(2.618rem,5vw,4.236rem)] grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-px overflow-x-auto bg-stal/20 [scrollbar-width:none] sm:auto-cols-[56%] md:snap-none md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible ${FOCUS}`}
        >
          {items.map((q, i) =>
            q.type === "video" ? (
              <figure key={i} className="flex snap-start flex-col bg-white">
                <div
                  style={{ aspectRatio: VIDEO_RATIO }}
                  className="relative w-full overflow-hidden bg-grafit"
                >
                  {q.src ? (
                    <video
                      src={q.src}
                      poster={q.poster}
                      controls
                      preload="none"
                      playsInline
                      onPlay={pauseOthers}
                      aria-label={`Opinia wideo: ${q.name}`}
                      className="h-full w-full object-cover"
                    >
                      {q.captions && (
                        <track
                          kind="captions"
                          src={q.captions}
                          srcLang="pl"
                          label="Polski"
                          default
                        />
                      )}
                    </video>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center sm:p-8">
                      <Corners tone="signal" />
                      <span
                        aria-hidden="true"
                        className="flex h-14 w-14 items-center justify-center bg-sygnal text-grafit"
                      >
                        <Play
                          strokeWidth={2}
                          fill="currentColor"
                          className="h-5 w-5 translate-x-px"
                        />
                      </span>
                      <p className="max-w-[30ch] text-[0.8125rem] leading-relaxed text-white/60">
                        {q.brief}
                      </p>
                    </div>
                  )}
                </div>

                <figcaption className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  {q.quote && (
                    <p className={`${T.body} text-grafit`}>„{q.quote}”</p>
                  )}
                  <div className={q.quote ? "mt-5 border-t border-mgla pt-4" : ""}>
                    <p className="text-sm font-semibold">{q.name}</p>
                    <p className="eyebrow mt-1.5 text-stal">{q.meta}</p>
                  </div>
                </figcaption>
              </figure>
            ) : (
              <figure
                key={i}
                className="flex snap-start flex-col justify-between bg-white p-7 sm:p-8"
              >
                <blockquote className={`${T.body} text-grafit`}>
                  {q.text}
                </blockquote>
                <figcaption className="mt-7 border-t border-mgla pt-4">
                  <p className="text-sm font-semibold">{q.name}</p>
                  <p className="eyebrow mt-1.5 text-stal">{q.meta}</p>
                </figcaption>
              </figure>
            ),
          )}
        </div>

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] flex justify-center">
          <Cta href={ctaHref} variant="graphite">
            {cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- DOWÓD
   Same nagrania, maksymalnie dwa. Bez liczb i bez opinii pisanych.

   UKŁAD (desktop, kontener 1272 px treści) · 1 : 1,618
   ┌───────────────┬─────────────┬─────────────┐
   │ nagłówek      │             │             │
   │ lead          │  wideo 1    │  wideo 2    │
   │ nota          │  4:5        │  4:5        │
   │ [przycisk]    │             │             │
   └───────────────┴─────────────┴─────────────┘
       486 px          393 px        393 px

   Kafel ma trzy stany:
   · `src` → odtwarzacz z własnym przyciskiem play na posterze,
   · tylko `poster` → samo zdjęcie, bez play, bo nie ma czego odtworzyć,
   · nic → ciemny kafel z briefem nagrania.
   ─────────────────────────────────────────────────────────────────────── */

export type ProofVideo = {
  name: string;
  meta: string;
  /** Brief nagrania. Pokazuje się, dopóki nie ma `src` ani `poster`. */
  brief: string;
  /** Jedno zdanie z nagrania, dosłownie. */
  quote?: string;
  src?: string;
  /** Klatka z twarzą w trakcie mówienia. Bez `src` stoi jako zdjęcie. */
  poster?: string;
  /** Plik .vtt, jeśli napisy nie są wypalone w obrazie. */
  captions?: string;
};

export type ProofData = {
  heading: string;
  lead?: string;
  /** Krótka deklaracja uczciwości pod leadem. */
  note?: string;
  /** Jedno albo dwa nagrania. Kolejne są ignorowane. */
  videos: ProofVideo[];
};

/** Proporcja 4:5 zaokrąglona do skali marki. */
const PROOF_VIDEO_RATIO = "0.786";

/** Gra tylko jedno nagranie w obrębie sekcji. */
function pauseOtherVideos(e: React.SyntheticEvent<HTMLVideoElement>) {
  const current = e.currentTarget;
  current
    .closest("section")
    ?.querySelectorAll("video")
    .forEach((v) => {
      if (v !== current) v.pause();
    });
}

/** Kafel wideo z własnym przyciskiem play na posterze. */
function ProofVideoTile({ v }: { v: ProofVideo }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    ref.current?.play().catch(() => {});
  };

  return (
    <figure className="flex h-full flex-col bg-white">
      <div
        style={{ aspectRatio: PROOF_VIDEO_RATIO }}
        className="relative w-full overflow-hidden bg-grafit"
      >
        {v.src ? (
          <>
            <video
              ref={ref}
              src={v.src}
              poster={v.poster}
              preload="none"
              playsInline
              controls={started}
              onPlay={pauseOtherVideos}
              aria-label={`Opinia wideo: ${v.name}`}
              className="h-full w-full object-cover"
            >
              {v.captions && (
                <track kind="captions" src={v.captions} srcLang="pl" label="Polski" default />
              )}
            </video>

            {!started && (
              <button
                type="button"
                onClick={start}
                aria-label={`Odtwórz opinię: ${v.name}`}
                // Focus wewnątrz kadru: zwykły FOCUS ma offset na zewnątrz i zostałby
                // ucięty przez overflow-hidden.
                className="group absolute inset-0 flex items-center justify-center bg-grafit/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sygnal focus-visible:[outline-offset:-6px]"
              >
                <span className="flex h-12 w-12 items-center justify-center bg-sygnal text-grafit transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none sm:h-16 sm:w-16">
                  <Play aria-hidden="true" fill="currentColor" strokeWidth={2} className="h-5 w-5 translate-x-px" />
                </span>
              </button>
            )}
          </>
        ) : v.poster ? (
          /* Zdjęcie zamiast nagrania: brak przycisku play, bo nie ma czego
             odtworzyć. Kafel wygląda docelowo, sekcja da się już oceniać. */
          <img
            src={v.poster}
            alt={`${v.name}, ${v.meta}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center sm:p-6">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center bg-sygnal text-grafit sm:h-16 sm:w-16"
            >
              <Play fill="currentColor" strokeWidth={2} className="h-5 w-5 translate-x-px" />
            </span>
            <p className="max-w-[30ch] text-[0.75rem] leading-relaxed text-white/60 sm:text-[0.8125rem]">
              {v.brief}
            </p>
          </div>
        )}

        {!started && <Corners tone="signal" />}
      </div>

      <figcaption className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-6">
        {v.quote && (
          <p className="text-[0.8125rem] leading-[1.5] text-grafit text-pretty sm:text-[0.9375rem] sm:leading-[1.618]">
            „{v.quote}”
          </p>
        )}
        <div>
          <p className="text-sm font-semibold">{v.name}</p>
          <p className="eyebrow mt-1.5 text-stal">{v.meta}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Proof({
  heading,
  lead,
  note,
  videos,
  cta,
  ctaHref = "#oferty",
}: ProofData & { cta: string; ctaHref?: string }) {
  const shown = videos.slice(0, 2);
  const single = shown.length === 1;

  return (
    <section className="bg-mgla">
      <div
        className={`${WRAP} ${PAD} ${GAP} grid items-center lg:grid-cols-[1fr_1.618fr]`}
      >
        <div className="max-w-[46ch]">
          <h2 className={T.h2}>{heading}</h2>

          {lead && <p className={`${T.body} mt-5 text-stal`}>{lead}</p>}

          {note && (
            <p className={`${T.small} mt-[1.618rem] flex items-start gap-2.5 border-t border-stal/20 pt-5 text-stal`}>
              <ShieldCheck aria-hidden="true" strokeWidth={1.75} className="mt-px h-4 w-4 shrink-0" />
              {note}
            </p>
          )}

          {/* Desktop: przycisk pod tekstem. Telefon: pod nagraniami. */}
          <div className="mt-[2.618rem] hidden lg:block">
            <Cta href={ctaHref} variant="graphite">
              {cta}
            </Cta>
          </div>
        </div>

        <div
          className={`grid gap-px bg-stal/20 ${
            single ? "w-full max-w-[24rem] justify-self-center" : "grid-cols-2"
          }`}
        >
          {shown.map((v, i) => (
            <ProofVideoTile key={i} v={v} />
          ))}
        </div>

        <div className="lg:hidden">
          <Cta href={ctaHref} variant="graphite">
            {cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ CASE STUDY
   Dwie historie zamiast opinii. Opinia mówi „było super", case study
   pokazuje, co dokładnie się stało i po czym to widać.

   KAŻDA KARTA MA TEN SAM PORZĄDEK
   1. Kto i skąd startował: eyebrow, żeby czytelnik rozpoznał siebie.
   2. Tytuł: jeden efekt, konkretny.
   3. Liczby przed i po: dwie albo trzy, każda do sprawdzenia w notatkach.
   4. Trzy etapy: punkt startu, co zmieniliśmy, wynik. Efekt na końcu,
      bo wynik postawiony pierwszy czyta się jak reklama.
   5. Jedno zdanie tej osoby, dosłownie.
   6. Ile sesji i ile tygodni.

   UKŁAD · dwie karty obok siebie od lg, jedna pod drugą na telefonie.
   Zdjęcie na górze karty jest opcjonalne: bez `image` i bez `shot` karta
   zaczyna się od razu od tekstu. Więcej niż dwie pozycje są ignorowane,
   bo trzecia historia rozmywa dwie pierwsze.
   ─────────────────────────────────────────────────────────────────────── */

export type CaseStudy = {
  /** "Anna, 34 lata" */
  kto: string;
  /** "siedząca praca, pierwszy raz na siłowni" */
  kontekst: string;
  /** Jedno zdanie efektu. Konkret, nie przymiotnik. */
  tytul: string;
  /** Dwie albo trzy liczby przed i po. */
  liczby: { label: string; przed: string; po: string }[];
  /** Z czym przyszła ta osoba. */
  start: string;
  /** Co konkretnie zmieniliście. */
  zmiana: string;
  /** Co pokazały notatki i co zmieniło się poza liczbami. */
  wynik: string;
  /** Jedno zdanie tej osoby, słowo w słowo. */
  cytat?: string;
  /** "3 sesje · 8 tygodni" */
  czas: string;
  /** Zdjęcie na górze karty. */
  image?: string;
  alt?: string;
  /** Brief zdjęcia, widoczny, dopóki nie ma `image`. */
  shot?: string;
};

const KOLUMNY_LICZB: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

export function CaseStudies({
  heading,
  lead,
  note,
  items,
  cta,
  ctaHref = "#oferty",
}: {
  heading: string;
  lead?: string;
  /** Deklaracja zgody i źródła liczb, pod kartami. */
  note?: string;
  items: CaseStudy[];
  cta: string;
  ctaHref?: string;
}) {
  const shown = items.slice(0, 2);

  return (
    <section className="bg-mgla">
      <div className={`${WRAP} ${PAD}`}>
        <div className="max-w-[52ch]">
          <h2 className={T.h2}>{heading}</h2>
          {lead && <p className={`${T.body} mt-5 text-stal`}>{lead}</p>}
        </div>

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] grid items-stretch gap-6 lg:grid-cols-2">
          {shown.map((c, i) => {
            const etapy = [
              ["Punkt startu", c.start],
              ["Co zmieniliśmy", c.zmiana],
              ["Wynik", c.wynik],
            ];

            return (
              <article key={i} className="relative flex flex-col bg-white">
                {/* 1,43 zamiast 1,618: przy dwóch kartach w kontenerze
                    1272 px kadr ma ok. 624 px szerokości, więc zdjęcie
                    rośnie z ok. 386 do ok. 436 px wysokości. Wróć na
                    "1.618", jeśli ma być niższe. */}
                {(c.image || c.shot) && (
                  <Shot
                    ratio="1.43"
                    brief={c.shot ?? ""}
                    src={c.image}
                    alt={c.alt ?? c.kto}
                  />
                )}

                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <Waypoint n={i + 1} size="sm" />
                    <p className="eyebrow text-stal">
                      {c.kto} · {c.kontekst}
                    </p>
                  </div>

                  <h3 className={`${T.h3} mt-5`}>{c.tytul}</h3>

                  {/* Liczby przed i po. Przed: stal, po: grafit i duży krój. */}
                  <dl
                    className={`mt-7 grid gap-px bg-stal/20 ${
                      KOLUMNY_LICZB[Math.min(c.liczby.length, 3)] ?? ""
                    }`}
                  >
                    {c.liczby.map((l, j) => (
                      <div key={j} className="bg-mgla p-4 sm:p-5">
                        <dt className="eyebrow text-stal">{l.label}</dt>
                        <dd className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
                          <span className="font-display text-base font-semibold text-stal tnum">
                            {l.przed}
                          </span>
                          <span aria-hidden="true" className="text-stal">
                            →
                          </span>
                          <span className="sr-only">zmiana na</span>
                          <span className="font-display text-[clamp(1.5rem,1.3rem_+_0.8vw,1.875rem)] font-extrabold leading-none tracking-[-0.02em] tnum">
                            {l.po}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ol className="mt-7 space-y-5">
                    {etapy.map(([label, text], j) => (
                      <li
                        key={j}
                        className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr] sm:gap-5"
                      >
                        <p
                          className={`eyebrow pt-1 ${
                            j === 2 ? "text-grafit" : "text-stal"
                          }`}
                        >
                          {label}
                        </p>
                        <p
                          className={`${T.body} ${
                            j === 2 ? "font-semibold text-grafit" : "text-stal"
                          }`}
                        >
                          {text}
                        </p>
                      </li>
                    ))}
                  </ol>

                  {c.cytat && (
                    <blockquote
                      className={`${T.body} mt-7 border-l-4 border-sygnal pl-5 text-grafit`}
                    >
                      „{c.cytat}”
                    </blockquote>
                  )}

                  {/* mt-auto dociska stopkę do dołu, pt-7 trzyma odstęp,
                      gdy karta jest najwyższa w rzędzie. */}
                  <div className="mt-auto pt-7">
                    <p className="eyebrow border-t border-mgla pt-5 text-stal">
                      {c.czas}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {note && (
          <p className={`${T.small} mt-6 flex items-start gap-2.5 text-stal`}>
            <ShieldCheck
              aria-hidden="true"
              strokeWidth={1.75}
              className="mt-px h-4 w-4 shrink-0"
            />
            {note}
          </p>
        )}

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] flex justify-center">
          <Cta href={ctaHref} variant="graphite">
            {cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- RECENZJE
   Trzy recenzje, w których pierwsze, co widać, to stan po: „w końcu wiem,
   że idę do przodu", a nie „polecam, super trener".

   KARTA MA ODWRÓCONY PORZĄDEK względem typowej opinii:
   1. `wynik`  · dream outcome, jedno zdanie tej osoby, w pierwszej osobie.
                 To jest nagłówek i największy tekst na karcie.
   2. `tekst`  · dwa, trzy zdania: co było przedtem i co to zmieniło.
   3. `liczba` · jedna liczba, jeśli ją masz. Kotwiczy zdanie wyżej.
   4. `foto`, `kto` i `meta` · zdjęcie, imię, punkt startu i czas.

   ZDJĘCIE · kwadrat, twarz w kadrze, zrobione telefonem tam, gdzie ta
   osoba trenuje. Nie awatar z mediów społecznościowych i nie stock:
   stockowa twarz przy opinii kosztuje więcej, niż daje. Bez `foto`
   karta pokazuje inicjały, więc sekcja wygląda znośnie, dopóki nie
   zbierzesz zdjęć. Zgoda na wizerunek: razem ze zgodą na cytat.

   JAK WYCIĄGNĄĆ DREAM OUTCOME, a nie pochwałę
   · Pytanie, które je daje: „co zmieniło się jako pierwsze, jeszcze zanim
     zobaczyłaś to w lustrze". Odpowiedź prawie nigdy nie dotyczy wagi.
   · Zostaw słowa tej osoby. „Przestałam się zastanawiać, czy robię dobrze"
     sprzedaje, „profesjonalne podejście" nie sprzedaje nic.
   · Trzy karty to trzy różne outcome: pewność, dowód progresu, koniec
     wstydu albo samodzielność. Trzy razy to samo brzmi jak jedna opinia
     przepisana trzy razy.
   · Pierwsza karta jest ciemna, więc pada na nią wzrok. Wstaw tam
     outcome najbliższy obietnicy z hero.

   RÓŻNICA WOBEC <CaseStudies>: tam liczy się droga i liczby, tutaj sam
   stan po. Obie sekcje na jednej stronie to dwa razy ten sam dowód,
   więc wybierz jedną.

   ⚠ Nie wymyślaj recenzji. Zgoda na publikację imienia i cytatu: na piśmie.
   ─────────────────────────────────────────────────────────────────────── */

export type Recenzja = {
  /** Dream outcome w pierwszej osobie, słowami tej osoby. Nagłówek karty. */
  wynik: string;
  /** Dwa, trzy zdania: co było przedtem i co to zmieniło. */
  tekst: string;
  /** Jedna liczba z kart albo z arkusza, np. "+15 kg w martwym ciągu". */
  liczba?: string;
  /** Imię, ewentualnie wiek. */
  kto: string;
  /** Kwadratowe zdjęcie w /public, np. "/opinie/anna.jpg". */
  foto?: string;
  /** Opis zdjęcia. Domyślnie samo imię. */
  fotoAlt?: string;
  /** Punkt startu i czas, np. "pierwszy raz na siłowni · 8 tygodni". */
  meta: string;
};

/** Inicjały z imienia i nazwiska albo z samego imienia. */
function inicjaly(kto: string) {
  return kto
    .replace(/[^\p{L}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Recenzje({
  heading,
  lead,
  note,
  items,
  cta,
  ctaHref = "#oferty",
}: {
  heading: string;
  lead?: string;
  /** Deklaracja zgody pod kartami. */
  note?: string;
  /** Najlepiej trzy. Pierwsza jest wyróżniona. */
  items: Recenzja[];
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section id="opinie" className="scroll-mt-24 bg-mgla">
      <div className={`${WRAP} ${PAD}`}>
        <div className="max-w-[52ch]">
          <h2 className={T.h2}>{heading}</h2>
          {lead && <p className={`${T.body} mt-5 text-stal`}>{lead}</p>}
        </div>

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] grid gap-px bg-stal/20 md:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => {
            const dark = i === 0;

            return (
              <figure
                key={i}
                className={`relative flex flex-col p-7 sm:p-8 ${
                  dark ? "bg-grafit text-white" : "bg-white text-grafit"
                }`}
              >
                <Corners tone={dark ? "signal" : "light"} />

                <span
                  aria-hidden="true"
                  className="block h-1 w-10 shrink-0 bg-sygnal"
                />

                {/* Dream outcome: największy tekst na karcie. */}
                <blockquote
                  className={`${T.h3} mt-6 sm:text-[clamp(1.375rem,1.1rem_+_1vw,1.75rem)]`}
                >
                  „{r.wynik}”
                </blockquote>

                <p
                  className={`${T.body} mt-4 ${dark ? "text-white/75" : "text-stal"}`}
                >
                  {r.tekst}
                </p>

                {r.liczba && (
                  <p className="mt-6">
                    <span className="inline-block bg-sygnal px-2.5 py-1 font-display text-[0.9375rem] font-bold tnum text-grafit">
                      {r.liczba}
                    </span>
                  </p>
                )}

                <figcaption
                  className={`mt-auto flex items-center gap-4 border-t pt-5 ${
                    dark ? "border-white/20" : "border-mgla"
                  } ${r.liczba ? "mt-7" : "mt-8"}`}
                >
                  {r.foto ? (
                    <img
                      src={r.foto}
                      alt={r.fotoAlt ?? r.kto}
                      loading="lazy"
                      className="h-14 w-14 shrink-0 object-cover"
                    />
                  ) : (
                    /* Bez zdjęcia: inicjały, żeby stopka karty nie skakała. */
                    <span
                      aria-hidden="true"
                      className={`flex h-14 w-14 shrink-0 items-center justify-center font-display text-base font-bold ${
                        dark ? "bg-white/10 text-white/70" : "bg-mgla text-stal"
                      }`}
                    >
                      {inicjaly(r.kto)}
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{r.kto}</p>
                    <p
                      className={`eyebrow mt-1.5 ${dark ? "text-white/70" : "text-stal"}`}
                    >
                      {r.meta}
                    </p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {note && (
          <p className={`${T.small} mt-6 flex items-start gap-2.5 text-stal`}>
            <ShieldCheck
              aria-hidden="true"
              strokeWidth={1.75}
              className="mt-px h-4 w-4 shrink-0"
            />
            {note}
          </p>
        )}

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] flex justify-center">
          <Cta href={ctaHref} variant="graphite">
            {cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- LICZBY
   · Kadr celownika zamiast kart.
   · Pierwsza pozycja duża, na graficie. Pozostałe ciche, na bieli.
   · Jeden ruch na całą sekcję: liczby doliczają się raz przy wejściu w kadr.
   · Placeholder w nawiasie kwadratowym nie jest animowany.
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Ikony liczb. Nazwa mówi, co liczba mierzy. Stare klucze (video, clock,
 * return) zostają, bo używa ich strona coachingu online.
 */
const STAT_ICONS = {
  video: Video,
  clock: Timer,
  return: RotateCcw,
  sesje: CalendarCheck,
  progres: TrendingUp,
  sala: MapPin,
  ciezar: Dumbbell,
} as const;

export type StatIcon = keyof typeof STAT_ICONS;

export function Stats({
  heading,
  lead,
  items,
  cta,
  ctaHref = "#oferty",
}: {
  heading: string;
  lead?: string;
  items: {
    value: string;
    label: string;
    note?: string;
    icon?: StatIcon;
  }[];
  cta: string;
  ctaHref?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setProgress(1);
          return;
        }
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 900);
          setProgress(p);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const ICONS = STAT_ICONS;

  // Animuje pierwszą liczbę w stringu. Placeholdery zostawia w spokoju,
  // żeby nie wychodziło "NaN".
  const shown = (value: string) => {
    if (value.includes("[")) return value;
    const m = value.match(/^(.*?)(\d[\d\s.,]*)(.*)$/);
    if (!m) return value;
    const target = parseInt(m[2].replace(/\D/g, ""), 10);
    if (Number.isNaN(target)) return value;
    const eased = 1 - Math.pow(1 - progress, 3);
    return `${m[1]}${Math.round(target * eased).toLocaleString("pl-PL")}${m[3]}`;
  };

  return (
    <section ref={ref} className="bg-mgla">
      <div className={`${WRAP} ${PAD}`}>
        <h2 className={`${T.h2} max-w-[22ch]`}>{heading}</h2>

        {lead && (
          <p className={`${T.body} mt-4 max-w-[52ch] text-stal`}>{lead}</p>
        )}

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] grid gap-px bg-stal/20 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => {
            const featured = i === 0;
            const Icon = s.icon ? ICONS[s.icon] : null;

            return (
              <div
                key={i}
                className={`relative flex flex-col justify-between p-7 sm:p-8 ${
                  featured
                    ? "bg-grafit text-white sm:col-span-2"
                    : "bg-white text-grafit"
                }`}
              >
                <Corners tone={featured ? "signal" : "light"} />

                {Icon && (
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className={`h-5 w-5 ${featured ? "text-sygnal" : "text-stal"}`}
                  />
                )}

                <div className={Icon ? "mt-[4.236rem]" : ""}>
                  <p
                    className={`font-display font-extrabold tnum leading-[0.92] tracking-[-0.03em] ${
                      featured
                        ? "text-[clamp(3.4rem,2rem_+_5.6vw,4.75rem)]"
                        : "text-[clamp(2.618rem,1.9rem_+_2.6vw,3rem)]"
                    }`}
                  >
                    {shown(s.value)}
                  </p>

                  <p className={`${T.body} mt-3 max-w-[26ch] leading-snug`}>
                    {s.label}
                  </p>

                  {s.note && (
                    <p
                      className={`eyebrow mt-2.5 max-w-[30ch] ${
                        featured ? "text-white/70" : "text-stal"
                      }`}
                    >
                      {s.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] flex justify-center">
          <Cta href={ctaHref} variant="graphite">
            {cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- BENEFITY
   Obsługuje też historie klientów: z `heading` dostaje nagłówek sekcji,
   z tone="fog" szare tło.
   ─────────────────────────────────────────────────────────────────────── */

export function Benefits({
  heading,
  tone = "light",
  items,
  cta,
  ctaHref = "#oferty",
}: {
  /** Nagłówek sekcji nad blokami. Pomiń przy korzyściach. */
  heading?: string;
  tone?: "light" | "fog";
  items: {
    eyebrow: string;
    title: string;
    body: string;
    shot: string;
    /** Ścieżka w /public. Bez niej pokazuje się brief z `shot`. */
    image?: string;
    alt?: string;
  }[];
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section className={tone === "fog" ? "bg-mgla" : "bg-white"}>
      <div className={`${WRAP} ${PAD_LG}`}>
        {heading && (
          <h2 className={`${T.h2} mx-auto max-w-[24ch] text-center`}>
            {heading}
          </h2>
        )}

        <div
          className={`space-y-[clamp(3.5rem,8vw,6.854rem)] ${
            heading ? "mt-[clamp(2.618rem,5vw,4.236rem)]" : ""
          }`}
        >
          {items.map((b, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={i}
                className={`${GAP} grid items-center lg:grid-cols-2`}
              >
                <Shot
                  ratio="1.272"
                  brief={b.shot}
                  src={b.image}
                  alt={b.alt}
                  className={flip ? "lg:order-2" : ""}
                />

                <div className={`max-w-[46ch] ${flip ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3">
                    <Waypoint n={i + 1} size="sm" />
                    <p className="eyebrow text-stal">{b.eyebrow}</p>
                  </div>

                  {/* h3, gdy sekcja ma własny h2 — inaczej h2 jak dotąd. */}
                  {heading ? (
                    <h3
                      className={`${T.h3} mt-5 sm:text-[clamp(1.5rem,1.1rem_+_1.6vw,2rem)]`}
                    >
                      {b.title}
                    </h3>
                  ) : (
                    <h2
                      className={`${T.h3} mt-5 sm:text-[clamp(1.5rem,1.1rem_+_1.6vw,2rem)]`}
                    >
                      {b.title}
                    </h2>
                  )}

                  <p className={`${T.body} mt-4 text-stal`}>{b.body}</p>

                  <Cta href={ctaHref} className="mt-8">
                    {cta}
                  </Cta>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- TABELA PORÓWNAWCZA */

export function Comparison({
  heading,
  columns,
  rows,
}: {
  heading: string;
  columns: string[];
  rows: { point: string; values: boolean[] }[];
}) {
  return (
    <section className="bg-white">
      <div className={`${WRAP} pb-[clamp(3.5rem,8vw,6.854rem)]`}>
        <h2 className={`${T.h2} mx-auto max-w-[26ch] text-center`}>{heading}</h2>

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-[26%] p-4" />
                {columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`p-4 text-center align-bottom font-display text-xs font-bold uppercase tracking-[0.09em] ${
                      i === 0 ? "bg-grafit text-sygnal" : "text-stal"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.point} className="border-t border-mgla">
                  <th
                    scope="row"
                    className="p-4 text-left text-[15px] font-semibold"
                  >
                    {row.point}
                  </th>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={`p-4 text-center ${i === 0 ? "bg-grafit" : ""}`}
                    >
                      <span
                        className={
                          v
                            ? `inline-block h-4 w-4 ${i === 0 ? "bg-sygnal" : "bg-grafit"}`
                            : `inline-block h-4 w-4 border ${
                                i === 0 ? "border-white/30" : "border-stal/40"
                              }`
                        }
                      >
                        <span className="sr-only">{v ? "tak" : "nie"}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ TRZY KROKI
   · Przerywana trasa za kaflami, widoczna tylko w przerwach.
   · Ikona nie powtarza numeru: numer mówi, który to krok, ikona mówi,
     czym ten krok jest.
   · Padding kafla trzymany na stałe (p-7), bo od niego liczy się pozycja
     trasy: 28 px paddingu + 28 px połowy waypointu = 3,5 rem.
   ─────────────────────────────────────────────────────────────────────── */

export function Steps({
  heading,
  lead,
  items,
  cta,
  ctaHref = "#oferty",
}: {
  heading: string;
  lead?: string;
  items: {
    meta: string;
    title: string;
    body: string;
    icon?: "cart" | "video" | "note";
  }[];
  cta: string;
  ctaHref?: string;
}) {
  const ICONS = { cart: CreditCard, video: Video, note: FileText };

  return (
    <section className="bg-mgla">
      <div className={`${WRAP} ${PAD}`}>
        <h2 className={`${T.h2} mx-auto max-w-[22ch] text-center`}>{heading}</h2>

        {lead && (
          <p className={`${T.body} mx-auto mt-4 max-w-[54ch] text-center text-stal`}>
            {lead}
          </p>
        )}

        <ol className="relative mt-[clamp(2.618rem,5vw,4.236rem)] grid items-stretch gap-6 md:grid-cols-3">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-7 right-7 top-[3.5rem] hidden border-t border-dashed border-stal/40 md:block"
          />

          {items.map((s, i) => {
            const Icon = s.icon ? ICONS[s.icon] : null;

            return (
              <li key={i} className="relative h-full bg-white p-7">
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="absolute right-7 top-7 h-5 w-5 text-stal"
                  />
                )}

                <Waypoint n={i + 1} size="lg" />

                <p className="mt-6 font-display text-sm font-bold tracking-tight">
                  {s.meta}
                </p>

                <h3 className={`${T.h3} mt-1.5`}>{s.title}</h3>

                <p className={`${T.body} mt-3 text-stal`}>{s.body}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] flex justify-center">
          <Cta href={ctaHref} variant="graphite">
            {cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- OD ZAKUPU
   Następca <Steps> na stronach, gdzie klient płaci z góry za godzinę,
   której jeszcze nie widzi. Każde „a co potem?" ma mieć odpowiedź,
   zanim padnie.

   FORMAT · oś czasu jak rozkład jazdy
   „Kiedy" stoi przy osi, treść kroku po prawej. Czyta się z góry na dół
   jak plan dnia, a nie jak cztery osobne kafle.

   IKONY (lucide-react) · jedna na krok, na osi zamiast numeru
   · `icon`: limonkowy kwadrat na osi mówi, czym jest krok (płatność,
     ankieta, termin, sala). Kolejność niesie sama oś z góry na dół,
     a czytnik ekranu dostaje „Krok 1" ukryte w tytule. Krok bez `icon`
     pokazuje numer jak dawniej.
   · Konkrety pod krokiem to zwykły tekst z kropką. Komponent przyjmuje
     też { ikona, tekst }, ale więcej niż jedna ikona na krok rozbija
     rytm osi, więc na stronach tego nie używamy.

   PROPORCJE
   · Telefon (< 768 px): nagłówek, oś z kwadratem po lewej i „kiedy" nad
     tytułem, przycisk na końcu.
   · Tablet (768–1023 px): „kiedy" wychodzi na osobną kolumnę po lewej
     stronie osi (7 rem), reszta jak na telefonie.
   · Desktop (≥ 1024 px): dwie kolumny 1 : 1,618. Po lewej nagłówek,
     lead i przycisk, przyklejone przy przewijaniu. Po prawej oś.
   ─────────────────────────────────────────────────────────────────────── */

/** Ikony osi zakupu. Nazwa mówi, czym jest krok albo konkret. */
const IKONY_ZAKUPU = {
  platnosc: CreditCard,
  ankieta: ClipboardList,
  termin: CalendarCheck,
  sala: Dumbbell,
  kamera: Video,
  mail: Mail,
  telefon: Phone,
  sms: MessageSquare,
  bezTelefonu: PhoneOff,
  czas: Clock,
  zwrot: ShieldCheck,
  karta: FileText,
} as const;

export type IkonaZakupu = keyof typeof IKONY_ZAKUPU;

/** Konkret pod krokiem: sam tekst albo tekst z ikoną. */
export type KonkretZakupu = string | { ikona: IkonaZakupu; tekst: string };

export type KrokZakupu = {
  /** Kiedy i ile trwa, np. "Na sali · 60 minut". Przy osi część przed
      kropką stoi wyżej, część po kropce pod nią, drobniej. */
  meta: string;
  /** Ikona obok tytułu: czym jest ten krok. */
  icon?: IkonaZakupu;
  title: string;
  body: string;
  /** Konkrety pod treścią. Jeden, dwa, najwyżej cztery. */
  details?: KonkretZakupu[];
};

/** Tekst list konkretów: odrobinę mniejszy niż body, gęstsza interlinia. */
const DETAL = "text-[0.9375rem] leading-[1.5] text-pretty";

export function OdZakupu({
  heading,
  lead,
  steps,
  cta,
  ctaHref = "#oferty",
  ctaNote,
}: {
  heading: string;
  lead?: string;
  steps: KrokZakupu[];
  cta: string;
  ctaHref?: string;
  /** Jedno zdanie pod przyciskiem. */
  ctaNote?: string;
}) {
  const przycisk = (
    <>
      <Cta href={ctaHref} variant="graphite">
        {cta}
      </Cta>
      {ctaNote && <p className={`${T.small} max-w-[40ch] text-stal`}>{ctaNote}</p>}
    </>
  );

  return (
    <section id="jak-kupic" className="scroll-mt-24 bg-white">
      <div className={`${WRAP} ${PAD} grid items-start ${GAP} lg:grid-cols-[1fr_1.618fr]`}>
        {/* Lewa kolumna na desktopie: nagłówek i przycisk, przyklejone. */}
        <div className="lg:sticky lg:top-28">
          <h2 className={`${T.h2} max-w-[16ch]`}>{heading}</h2>
          {lead && <p className={`${T.lead} mt-4 max-w-[36ch] text-stal`}>{lead}</p>}
          <div className="mt-9 hidden flex-col items-start gap-3 lg:flex">{przycisk}</div>
        </div>

        {/* Oś czasu */}
        <div>
          <ol>
            {steps.map((s, i) => {
              const ostatni = i === steps.length - 1;
              /* "Zaraz po zakupie · 3 minuty" → kiedy nad, ile pod. */
              const [kiedy, ile] = s.meta.split(" · ");
              const IkonaKroku = s.icon ? IKONY_ZAKUPU[s.icon] : null;
              return (
                <li
                  key={i}
                  className="relative grid grid-cols-[2.25rem_1fr] gap-x-4 md:grid-cols-[7rem_2.25rem_1fr] md:gap-x-5"
                >
                  {/* Kiedy: od tabletu osobna kolumna po lewej stronie osi. */}
                  <p className="hidden pt-1.5 text-right md:block">
                    <span className="block font-display text-sm font-bold leading-snug">
                      {kiedy}
                    </span>
                    {ile && (
                      <span className="mt-0.5 block text-[0.8125rem] text-stal">{ile}</span>
                    )}
                  </p>

                  {/* Oś: kwadrat z ikoną kroku (bez ikony: numer) i przerywana
                      linia do następnego kroku. */}
                  <div className="relative flex justify-center">
                    {IkonaKroku ? (
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center bg-sygnal text-grafit"
                      >
                        <IkonaKroku strokeWidth={2} className="h-[1.125rem] w-[1.125rem]" />
                      </span>
                    ) : (
                      <Waypoint n={i + 1} size="md" />
                    )}
                    {!ostatni && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 top-11 border-l border-dashed border-stal/40"
                      />
                    )}
                  </div>

                  <div className={`min-w-0 pt-1.5 ${ostatni ? "" : "pb-10"}`}>
                    <p className="font-display text-sm font-bold md:hidden">{s.meta}</p>

                    <h3 className={`${T.h3} mt-1 md:mt-0 md:text-[clamp(1.25rem,1.12rem_+_0.55vw,1.5rem)]`}>
                      <span className="sr-only">Krok {i + 1}: </span>
                      {s.title}
                    </h3>

                    <p className={`${T.body} mt-2.5 max-w-[54ch] text-stal`}>{s.body}</p>

                    {s.details?.length ? (
                      <ul className="mt-4 space-y-2.5">
                        {s.details.map((d, j) => {
                          const tekst = typeof d === "string" ? d : d.tekst;
                          const Ikona = typeof d === "string" ? null : IKONY_ZAKUPU[d.ikona];
                          return (
                            <li key={j} className="flex items-start gap-3">
                              {Ikona ? (
                                <span
                                  aria-hidden="true"
                                  className="flex h-6 w-6 shrink-0 items-center justify-center bg-sygnal text-grafit"
                                >
                                  <Ikona strokeWidth={2} className="h-3.5 w-3.5" />
                                </span>
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 bg-sygnal outline outline-1 outline-grafit"
                                />
                              )}
                              <span className={`${DETAL} text-grafit ${Ikona ? "pt-0.5" : ""}`}>
                                {tekst}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Przycisk pod osią: telefon i tablet. */}
          <div className="mt-10 flex flex-col items-center gap-3 border-t border-mgla pt-8 text-center md:items-start md:pl-[calc(7rem+2.25rem+2.5rem)] md:text-left lg:hidden">
            {przycisk}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- FAQ */

export function Faq({
  heading,
  lead,
  items,
  phone = "537 483 233",
  phoneHref = "tel:+48537483233",
  phoneNote = "Odpisuję w 24 h w dni robocze.",
  cta,
  ctaHref = "#oferty",
}: {
  heading: string;
  lead?: string;
  items: { q: string; a: string }[];
  phone?: string;
  phoneHref?: string;
  phoneNote?: string;
  cta?: string;
  ctaHref?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <section id="pytania" className="scroll-mt-24 bg-white">
      {/* Rozwijanie animuje się tam, gdzie przeglądarka to potrafi. */}
      <style>{`
        @supports (interpolate-size: allow-keywords) {
          :root { interpolate-size: allow-keywords; }
          details.faq::details-content {
            block-size: 0;
            overflow: clip;
            transition: block-size .3s ease, content-visibility .3s allow-discrete;
          }
          details.faq[open]::details-content { block-size: auto; }
        }
        @media (prefers-reduced-motion: reduce) {
          details.faq::details-content { transition: none; }
        }
      `}</style>

      <div
        className={`${WRAP} ${PAD_LG} ${GAP} grid lg:grid-cols-[minmax(0,22rem)_1fr]`}
      >
        {/* Lewa kolumna: wyjście awaryjne, telefon. Przykleja się przy
            przewijaniu. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className={`${T.h2} max-w-[18ch]`}>{heading}</h2>

          {lead && (
            <p className={`${T.body} mt-4 max-w-[38ch] text-stal`}>{lead}</p>
          )}

          <div className="mt-8 border-t border-mgla pt-6">
            <p className="eyebrow text-stal">Nie ma Twojego pytania?</p>
            <a
              href={phoneHref}
              className={`mt-2 block font-display text-[clamp(1.5rem,1.2rem_+_1.2vw,2rem)] font-extrabold tracking-tight tnum transition-colors hover:text-stal ${FOCUS}`}
            >
              {phone}
            </a>
            <p className={`${T.small} mt-2 text-stal`}>{phoneNote}</p>
          </div>

          {cta && (
            <Cta href={ctaHref} className="mt-8">
              {cta}
            </Cta>
          )}
        </div>

        {/* Prawa kolumna: akordeon. Pierwsze pytanie otwarte domyślnie. */}
        <div className="border-t border-mgla">
          {items.map((item, i) => (
            <details
              key={i}
              open={i === 0}
              className="faq group border-b border-mgla"
            >
              <summary
                className={`flex cursor-pointer list-none items-start justify-between gap-5 py-5 text-[clamp(1rem,0.95rem_+_0.25vw,1.0625rem)] font-semibold leading-snug transition-colors hover:text-stal group-open:text-grafit [&::-webkit-details-marker]:hidden ${FOCUS}`}
              >
                {item.q}

                <span
                  aria-hidden="true"
                  className="relative mt-0.5 h-6 w-6 shrink-0 border border-stal/40 transition-colors group-open:border-sygnal group-open:bg-sygnal"
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-grafit" />
                  <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-grafit transition-transform duration-200 group-open:scale-y-0 motion-reduce:transition-none" />
                </span>
              </summary>

              <p className={`${T.body} max-w-[64ch] pb-6 text-stal`}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

/* --------------------------------------------------------------- CENNIK */

/** Trzy oferty z cenami. Środkowa może być wyróżniona. */
export function Offers({
  heading,
  lead,
  items,
  anchor,
  trust,
  objections,
}: {
  heading: string;
  lead: string;
  /** Kotwica cenowa pod kartami. Porównanie do alternatywy, nie do konkurencji. */
  anchor?: string;
  trust?: string[];
  /** Obiekcje odbite przy cenniku, nie dopiero w FAQ. */
  objections?: { q: string; a: string }[];
  items: {
    name: string;
    price: string;
    oldPrice?: string;
    save?: string;
    ribbon?: string;
    note: string;
    lead: string;
    includes: string[];
    /** Jedno zdanie o tym, kim klient jest po zakończeniu. */
    outcome?: string;
    href: string;
    cta: string;
    microcopy?: string;
    featured?: boolean;
  }[];
}) {
  return (
    <section id="oferty" className="scroll-mt-24 bg-white">
      <div className={`${WRAP} ${PAD_LG}`}>
        <h2 className={`${T.h2} max-w-[24ch]`}>{heading}</h2>
        <p className={`${T.lead} mt-5 max-w-[56ch] text-stal`}>{lead}</p>

        {/* gap-y-10 zamiast 6: przy jednej kolumnie wstążka nie nachodzi
            na kartę wyżej. Karta wyróżniona idzie na górę na telefonie. */}
        <div className="mt-[clamp(3rem,6vw,4.236rem)] grid gap-x-6 gap-y-10 lg:grid-cols-3">
          {items.map((o, i) => {
            const dark = o.featured;
            return (
              <div
                key={i}
                className={`relative flex flex-col p-7 sm:p-8 ${
                  dark
                    ? "order-first bg-grafit text-white lg:order-none lg:-my-4 lg:py-12"
                    : "bg-mgla"
                }`}
              >
                {o.ribbon && (
                  <span className="absolute -top-3 left-7 bg-sygnal px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-grafit">
                    {o.ribbon}
                  </span>
                )}

                <Waypoint n={i + 1} size="md" dark={!dark} />

                <h3 className={`${T.h3} mt-6 ${dark ? "text-white" : ""}`}>
                  {o.name}
                </h3>

                <p
                  className={`${T.body} mt-2.5 ${dark ? "text-white/70" : "text-stal"}`}
                >
                  {o.lead}
                </p>

                <div
                  className={`mt-6 border-t pt-5 ${
                    dark ? "border-white/20" : "border-stal/20"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {o.oldPrice && (
                      <span
                        className={`font-display text-xl font-semibold line-through tnum ${
                          dark ? "text-white/40" : "text-stal/60"
                        }`}
                      >
                        {o.oldPrice}
                      </span>
                    )}
                    <span className="font-display text-[clamp(2.618rem,2rem_+_2vw,3.4rem)] font-extrabold leading-none tnum tracking-[-0.03em]">
                      {o.price}
                    </span>
                  </div>

                  {o.save && (
                    <span
                      className={`mt-3.5 inline-block px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.1em] ${
                        dark ? "bg-sygnal text-grafit" : "bg-grafit text-sygnal"
                      }`}
                    >
                      {o.save}
                    </span>
                  )}

                  <p
                    className={`eyebrow mt-3 ${dark ? "text-white/70" : "text-stal"}`}
                  >
                    {o.note}
                  </p>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {o.includes.map((inc, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-[0.45rem] inline-block h-2 w-2 shrink-0 ${
                          dark ? "bg-sygnal" : "bg-grafit"
                        }`}
                      />
                      <span
                        className={`${T.body} ${dark ? "text-white/85" : "text-stal"}`}
                      >
                        {inc}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Jedyne miejsce na karcie mówiące, kim klient jest na końcu. */}
                {o.outcome && (
                  <p
                    className={`mt-6 border-t pt-5 text-[15px] font-semibold leading-snug ${
                      dark
                        ? "border-white/20 text-white"
                        : "border-stal/20 text-grafit"
                    }`}
                  >
                    {o.outcome}
                  </p>
                )}

                <a
                  href={o.href}
                  className={`mt-8 flex min-h-[3.25rem] items-center justify-center px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.09em] transition-colors ${
                    dark
                      ? "bg-sygnal text-grafit hover:bg-white"
                      : "bg-grafit text-white hover:bg-sygnal hover:text-grafit"
                  } ${FOCUS}`}
                >
                  {o.cta}
                </a>

                {o.microcopy && (
                  <p
                    className={`mt-3 text-center text-[0.8125rem] leading-relaxed ${
                      dark ? "text-white/60" : "text-stal"
                    }`}
                  >
                    {o.microcopy}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {anchor && (
          <p
            className={`${T.body} mx-auto mt-[clamp(2.618rem,5vw,4.236rem)] max-w-[64ch] text-center text-stal`}
          >
            {anchor}
          </p>
        )}

        {objections && (
          <div className="mt-[clamp(2.618rem,5vw,4.236rem)] grid gap-px bg-stal/20 md:grid-cols-3">
            {objections.map((o, i) => (
              <div key={i} className="bg-white p-6 sm:p-7">
                <p className="text-[15px] font-semibold leading-snug">{o.q}</p>
                <p className={`${T.body} mt-2.5 text-stal`}>{o.a}</p>
              </div>
            ))}
          </div>
        )}

        {trust && (
          <div className="mt-[clamp(2.618rem,5vw,4.236rem)] flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-mgla pt-8">
            {trust.map((t) => (
              <span key={t} className="eyebrow text-stal">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ CENNIK RZĘDY
   Druga wersja cennika: warianty jako rzędy, nie trzy karty obok siebie.

   DLACZEGO INACZEJ
   · W trzech kartach połowa punktów powtarzała się w każdej kolumnie
     (60 minut, wejście na salę, zapis obciążeń). Tu wspólne rzeczy stoją
     raz, w pasku nad wariantami, a w rzędach zostają tylko różnice.
   · Rząd czyta się od lewej jak zdanie: dla kogo → ile → co dostajesz
     → kup. Porównanie wariantów idzie w pionie, z góry na dół.

   PROPORCJE
   · Desktop (≥ 1024 px): rząd w czterech kolumnach 1,1 : 0,75 : 1,35 :
     przycisk. Ceny stoją w jednej pionowej linii, więc różnicę widać
     bez czytania.
   · Tablet (768–1023 px): dwie kolumny. Nazwa i cena u góry, lista
     i przycisk pod spodem.
   · Telefon: wszystko jedno pod drugim, przycisk na pełną szerokość.
   Wyróżniony wariant ma grafitowe tło i etykietę nad nazwą.
   ─────────────────────────────────────────────────────────────────────── */

const IKONY_CENNIKA = {
  czas: Timer,
  sala: MapPin,
  karta: FileText,
  termin: CalendarCheck,
  korekta: Check,
} as const;

export type IkonaCennika = keyof typeof IKONY_CENNIKA;

export type WariantCennika = {
  name: string;
  /** Dla kogo. Jedno zdanie. */
  lead: string;
  price: string;
  oldPrice?: string;
  save?: string;
  /** Cena za godzinę i warunek, np. "140 zł za sesję · bez daty ważności". */
  note: string;
  /** Tylko to, czego nie ma w pasku wspólnym. Może być puste. */
  includes?: string[];
  /** Kim klient jest po zakończeniu. */
  outcome: string;
  cta: string;
  href: string;
  featured?: boolean;
  ribbon?: string;
};

export function CennikRzedy({
  heading,
  lead,
  wspolneLabel = "W każdym wariancie",
  wspolne,
  items,
  trust,
}: {
  heading: string;
  lead: string;
  wspolneLabel?: string;
  /** Rzeczy wspólne dla wszystkich wariantów, z ikoną. Trzy albo cztery. */
  wspolne: { ikona: IkonaCennika; tekst: string }[];
  items: WariantCennika[];
  trust?: string[];
}) {
  return (
    <section id="oferty" className="scroll-mt-24 bg-white">
      <div className={`${WRAP} ${PAD_LG}`}>
        <div className="grid gap-5 lg:grid-cols-[1fr_1.618fr] lg:items-end lg:gap-[clamp(2.618rem,5vw,4.236rem)]">
          <h2 className={`${T.h2} max-w-[16ch]`}>{heading}</h2>
          <p className={`${T.lead} max-w-[52ch] text-stal`}>{lead}</p>
        </div>

        {/* WSPÓLNE: raz, zamiast w każdej karcie. */}
        <div className="mt-[clamp(2.618rem,5vw,3.4rem)] border-y border-mgla py-6">
          <p className="eyebrow text-stal">{wspolneLabel}</p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wspolne.map((w, i) => {
              const Ikona = IKONY_CENNIKA[w.ikona];
              return (
                <li key={i} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center bg-sygnal text-grafit"
                  >
                    <Ikona strokeWidth={2} className="h-[1.125rem] w-[1.125rem]" />
                  </span>
                  <span className="text-[0.9375rem] font-semibold leading-snug">{w.tekst}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* WARIANTY */}
        <div className="mt-6 space-y-3">
          {items.map((o, i) => {
            const dark = o.featured;
            return (
              <article
                key={i}
                className={`grid gap-x-10 gap-y-6 p-7 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.75fr)_minmax(0,1.35fr)_auto] lg:items-center ${
                  dark ? "bg-grafit text-white" : "bg-mgla"
                }`}
              >
                {/* Dla kogo */}
                <div>
                  {o.ribbon && (
                    <span className="mb-3 inline-block bg-sygnal px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-grafit">
                      {o.ribbon}
                    </span>
                  )}
                  <h3 className={T.h3}>{o.name}</h3>
                  <p className={`${T.body} mt-2 ${dark ? "text-white/70" : "text-stal"}`}>
                    {o.lead}
                  </p>
                </div>

                {/* Ile */}
                <div className="md:text-right lg:text-left">
                  <div className="flex flex-wrap items-baseline gap-x-3 md:justify-end lg:justify-start">
                    {o.oldPrice && (
                      <span
                        className={`font-display text-lg font-semibold line-through tnum ${
                          dark ? "text-white/40" : "text-stal/60"
                        }`}
                      >
                        {o.oldPrice}
                      </span>
                    )}
                    <span className="font-display text-[clamp(2.4rem,1.9rem_+_1.6vw,3rem)] font-extrabold leading-none tracking-[-0.03em] tnum">
                      {o.price}
                    </span>
                  </div>
                  <p className={`mt-2 text-[0.8125rem] leading-snug ${dark ? "text-white/70" : "text-stal"}`}>
                    {o.note}
                  </p>
                  {o.save && (
                    <span
                      className={`mt-2.5 inline-block px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-[0.1em] ${
                        dark ? "bg-sygnal text-grafit" : "bg-grafit text-sygnal"
                      }`}
                    >
                      {o.save}
                    </span>
                  )}
                </div>

                {/* Co dostajesz ponad wspólne */}
                <div>
                  {o.includes?.length ? (
                    <ul className="space-y-2">
                      {o.includes.map((inc, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={`mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 ${
                              dark ? "bg-sygnal" : "bg-grafit"
                            }`}
                          />
                          <span className={`text-[0.9375rem] leading-[1.5] ${dark ? "text-white/85" : "text-grafit"}`}>
                            {inc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p
                    className={`text-[0.9375rem] font-semibold leading-snug ${
                      o.includes?.length ? `mt-4 border-t pt-4 ${dark ? "border-white/15" : "border-stal/20"}` : ""
                    }`}
                  >
                    {o.outcome}
                  </p>
                </div>

                {/* Kup */}
                <a
                  href={o.href}
                  className={`flex min-h-[3.25rem] items-center justify-center px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.09em] transition-colors md:self-end lg:min-w-[11rem] lg:self-center ${
                    dark
                      ? "bg-sygnal text-grafit hover:bg-white"
                      : "bg-grafit text-white hover:bg-sygnal hover:text-grafit"
                  } ${FOCUS}`}
                >
                  {o.cta}
                </a>
              </article>
            );
          })}
        </div>

        {trust && (
          <div className="mt-[clamp(2rem,4vw,2.618rem)] flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {trust.map((t) => (
              <span key={t} className="eyebrow text-stal">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- CENNIK WYBÓR
   Trzecia wersja cennika: jeden wariant naraz. Po lewej wybierasz liczbę
   sesji, po prawej ciemny panel pokazuje tylko ten wariant.

   DLACZEGO TAK
   · Trzy karty albo trzy rzędy każą porównywać wszystko ze wszystkim.
     Tu decyzja jest jedna: ile sesji. Reszta panelu odpowiada na to
     jedno pytanie, więc nie ma czego zestawiać w głowie.
   · Domyślnie otwarty jest wariant wyróżniony (`featured`). Bez
     JavaScriptu strona pokazuje właśnie jego, więc nic się nie psuje.
   · Cena za godzinę stoi przy każdej opcji wyboru, więc spadek
     150 → 140 → 130 zł widać przed kliknięciem.

   PROPORCJE
   · Desktop (≥ 1024 px): 1 : 1,618. Nagłówek i wybór po lewej, panel po
     prawej. Wybór to pionowa lista, bo nazwy wariantów są długie.
   · Tablet i telefon: nagłówek, wybór jako trzy równe przyciski obok
     siebie (`krotko`, np. "3 sesje"), pod nim panel.

   Dostępność: wybór to tablist z aria-selected, strzałki zmieniają
   wariant, panel to tabpanel. Przycisk w panelu zawsze prowadzi do
   zakupu wybranego wariantu.
   ─────────────────────────────────────────────────────────────────────── */

export type WariantWyboru = WariantCennika & {
  /** Krótka nazwa do przełącznika na telefonie, np. "3 sesje". */
  krotko: string;
  /** Cena za godzinę przy opcji wyboru, np. "140 zł / sesja". */
  stawka: string;
};

export function CennikWybor({
  heading,
  lead,
  wspolneLabel = "W każdym wariancie",
  wyborLabel = "Ile sesji?",
  wspolne,
  items,
  trust,
}: {
  heading: string;
  lead: string;
  wspolneLabel?: string;
  /** Pytanie nad przełącznikiem, np. "Ile treningów?". */
  wyborLabel?: string;
  wspolne: { ikona: IkonaCennika; tekst: string }[];
  items: WariantWyboru[];
  trust?: string[];
}) {
  const start = Math.max(0, items.findIndex((o) => o.featured));
  const [wybrany, setWybrany] = useState(start);
  const o = items[wybrany];

  const klawisze = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowDown" && e.key !== "ArrowLeft" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const krok = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const n = (wybrany + krok + items.length) % items.length;
    setWybrany(n);
    document.getElementById(`cennik-tab-${n}`)?.focus();
  };

  return (
    <section id="oferty" className="scroll-mt-24 bg-mgla">
      <div className={`${WRAP} ${PAD_LG} grid items-start ${GAP} lg:grid-cols-[1fr_1.618fr]`}>
        {/* LEWA: nagłówek i wybór */}
        <div>
          <h2 className={`${T.h2} max-w-[14ch]`}>{heading}</h2>
          <p className={`${T.lead} mt-4 max-w-[40ch] text-stal`}>{lead}</p>

          <p className="eyebrow mt-9 text-stal">{wyborLabel}</p>
          <div
            role="tablist"
            aria-label="Wybierz wariant"
            onKeyDown={klawisze}
            className="mt-3 grid grid-cols-3 gap-px bg-stal/20 lg:grid-cols-1"
          >
            {items.map((it, i) => {
              const on = i === wybrany;
              return (
                <button
                  key={i}
                  id={`cennik-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="cennik-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setWybrany(i)}
                  className={`relative flex flex-col items-start gap-1 px-4 py-4 text-left transition-colors sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-5 ${
                    on ? "bg-grafit text-white" : "bg-white text-grafit hover:bg-white/70"
                  } ${FOCUS_IN}`}
                >
                  {on && (
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-sygnal lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-1" />
                  )}
                  <span className="min-w-0">
                    <span className="block font-display text-[0.9375rem] font-bold leading-tight sm:text-base">
                      <span className="lg:hidden">{it.krotko}</span>
                      <span className="hidden lg:inline">{it.name}</span>
                    </span>
                    <span className={`mt-1 block text-[0.75rem] tnum sm:text-[0.8125rem] ${on ? "text-white/70" : "text-stal"}`}>
                      {it.stawka}
                    </span>
                  </span>
                  <span className="font-display text-lg font-extrabold tracking-[-0.02em] tnum sm:text-xl lg:text-2xl">
                    {it.price}
                  </span>
                </button>
              );
            })}
          </div>

          {trust && (
            <ul className="mt-7 hidden space-y-2 lg:block">
              {trust.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[0.8125rem] text-stal">
                  <Check aria-hidden="true" strokeWidth={2.5} className="h-3.5 w-3.5 shrink-0 text-grafit" />
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PRAWA: panel wybranego wariantu */}
        <div
          id="cennik-panel"
          role="tabpanel"
          aria-labelledby={`cennik-tab-${wybrany}`}
          className="relative isolate overflow-hidden bg-grafit p-7 text-white sm:p-10"
        >
          <GraphiteGrid />
          <Corners tone="signal" />

          <div key={wybrany} className="motion-safe:animate-[panel_.35s_ease-out]">
            <style>{`@keyframes panel{from{opacity:0;transform:translateY(6px)}}`}</style>

            <div>
              <div className="min-w-0">
                {o.ribbon && (
                  <span className="mb-3 inline-block bg-sygnal px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-grafit">
                    {o.ribbon}
                  </span>
                )}
                <h3 className={T.h3}>{o.name}</h3>
                <p className={`${T.body} mt-2 max-w-[40ch] text-white/70`}>{o.lead}</p>
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  {o.oldPrice && (
                    <span className="font-display text-xl font-semibold text-white/40 line-through tnum">
                      {o.oldPrice}
                    </span>
                  )}
                  <span className="font-display text-[clamp(3rem,2.2rem_+_2.6vw,4.236rem)] font-extrabold leading-none tracking-[-0.035em] tnum">
                    {o.price}
                  </span>
                </div>
                <p className="mt-2 text-[0.8125rem] text-white/70">
                  {o.note}
                  {o.save && (
                    <span className="mt-2.5 block w-fit bg-sygnal px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-grafit">
                      {o.save}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Co dostajesz: wspólne + to, co ma tylko ten wariant */}
            <div className="mt-8 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-2">
              <div>
                <p className="eyebrow text-white/60">{wspolneLabel}</p>
                <ul className="mt-4 space-y-3">
                  {wspolne.map((w, i) => {
                    const Ikona = IKONY_CENNIKA[w.ikona];
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center bg-white/10 text-sygnal">
                          <Ikona strokeWidth={2} className="h-4 w-4" />
                        </span>
                        <span className="text-[0.9375rem] leading-snug text-white/85">{w.tekst}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <p className="eyebrow text-sygnal">
                  {o.includes?.length ? "Tylko w tym wariancie" : "Po tej sesji"}
                </p>
                {o.includes?.length ? (
                  <ul className="mt-4 space-y-3">
                    {o.includes.map((inc, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-[0.2rem] flex h-4 w-4 shrink-0 items-center justify-center bg-sygnal text-grafit">
                          <Check strokeWidth={3} className="h-3 w-3" />
                        </span>
                        <span className="text-[0.9375rem] leading-[1.5] text-white">{inc}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className={`font-display text-lg font-bold leading-snug ${o.includes?.length ? "mt-6" : "mt-4"}`}>
                  {o.outcome}
                </p>
              </div>
            </div>

            <a
              href={o.href}
              className={`mt-9 flex min-h-[3.5rem] w-full items-center justify-center gap-3 bg-sygnal px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.09em] text-grafit transition-colors hover:bg-white ${FOCUS}`}
            >
              {o.cta} · {o.price}
            </a>
          </div>
        </div>

        {trust && (
          <div className="flex flex-wrap gap-x-8 gap-y-2 lg:hidden">
            {trust.map((t) => (
              <span key={t} className="flex items-center gap-2 text-[0.8125rem] text-stal">
                <Check aria-hidden="true" strokeWidth={2.5} className="h-3.5 w-3.5 shrink-0 text-grafit" />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- SZEŚĆ RÓŻNIC */

export function Differentiators({
  heading,
  items,
  cta,
  ctaHref = "#oferty",
}: {
  heading: string;
  items: { title: string; body: string }[];
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-white">
      <div className={`${WRAP} ${PAD_LG}`}>
        <h2 className={`${T.h2} mx-auto max-w-[26ch] text-center`}>{heading}</h2>

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] grid gap-px bg-stal/20 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d, i) => (
            <div key={i} className="bg-white p-7 sm:p-8">
              <h3 className={`${T.h3} text-[clamp(1.125rem,1.05rem_+_0.4vw,1.375rem)]`}>
                {d.title}
              </h3>
              <p className={`${T.body} mt-3 text-stal`}>{d.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(2.618rem,5vw,4.236rem)] flex justify-center">
          <Cta href={ctaHref}>{cta}</Cta>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- KTO PROWADZI */

export function Team({
  heading,
  name,
  role,
  paragraphs,
  shot,
  image,
  cta,
  ctaHref = "#oferty",
  odstepGora = false,
}: {
  /** Pełny odstęp od góry. Włącz, gdy sekcja stoi pod sekcją w innym
      kolorze tła albo pod ciemnym blokiem, a nie pod białym cennikiem. */
  odstepGora?: boolean;
  heading: string;
  name: string;
  role: string;
  paragraphs: string[];
  shot: string;
  /** Ścieżka w /public, np. "/zdjecia/team.jpg". */
  image?: string;
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-white">
      <div
        className={`${WRAP} pb-[clamp(4rem,9.5vw,8.5rem)] ${
          odstepGora ? "pt-[clamp(4.5rem,10vw,9rem)]" : ""
        }`}
      >
        <h2 className={`${T.h2} text-center`}>{heading}</h2>

        <div
          className={`${GAP} mt-[clamp(2.618rem,5vw,4.236rem)] grid items-center lg:grid-cols-[1.618fr_1fr]`}
        >
          <div className="max-w-[48ch]">
            <h3 className={T.h3}>{name}</h3>
            <p className="eyebrow mt-2 text-stal">{role}</p>

            <div className={`${T.body} mt-6 space-y-4 text-stal`}>
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <Cta href={ctaHref} className="mt-8">
              {cta}
            </Cta>
          </div>

          <Shot ratio="0.786" brief={shot} src={image} alt={name} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- GWARANCJA */

export function Guarantee({
  eyebrow,
  title,
  body,
  cta,
  ctaHref = "#oferty",
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-mgla">
      <div className={`${WRAP_TEXT} ${PAD}`}>
        <div className="relative isolate overflow-hidden bg-grafit px-6 py-[clamp(3rem,7vw,4.236rem)] text-center text-white sm:px-14">
          <GraphiteGrid />
          <Corners tone="signal" />

          <p className="eyebrow text-sygnal">{eyebrow}</p>

          <h2 className={`${T.h2} mx-auto mt-5 max-w-[22ch]`}>{title}</h2>

          <p className={`${T.body} mx-auto mt-6 max-w-[56ch] text-white/75`}>
            {body}
          </p>

          <div className="mt-9 flex justify-center">
            <Cta href={ctaHref} variant="onDark">
              {cta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- ZOBOWIĄZANIA
   Gwarancja zadowolenia bez zwrotu pieniędzy i bez darmowych sesji.
   Działa tylko wtedy, gdy każdy punkt da się sprawdzić. „Będziesz
   zadowolony" bez konkretu ten avatar czyta jak każde inne hasło.

   UKŁAD · ciemny panel na pełną szerokość, siatka i celownik
   · Desktop (≥ 1024 px): 1 : 1,272. Po lewej obietnica i przycisk,
     po prawej cztery zobowiązania jedno pod drugim.
   · Tablet i telefon: nagłówek, zobowiązania, przycisk na końcu.

   KAŻDE ZOBOWIĄZANIE MA MOMENT SPRAWDZENIA (`kiedy`): na sesji, tego
   samego dnia, po pierwszej, po trzeciej. Czyta się to jak oś czasu:
   klient wie nie tylko co mu obiecujesz, ale kiedy może Cię z tego
   rozliczyć. To robi z listy obietnic gwarancję.

   `dowod` pokazuje się tylko, gdy go podasz: jedno zdanie z kart
   obciążeń. Liczb w nawiasach kwadratowych tu nie wpisuj.

   JAKO FINALNE CTA: podaj `id` (np. "rezerwacja"), żeby wszystkie
   przyciski na stronie tu prowadziły, i `note` z warunkami zakupu.
   ─────────────────────────────────────────────────────────────────────── */

const IKONY_ZOBOWIAZAN = {
  uwaga: Eye,
  karta: FileText,
  rozmowa: MessageSquare,
  progres: TrendingUp,
  czas: Clock,
  tarcza: ShieldCheck,
} as const;

export type Zobowiazanie = {
  ikona: keyof typeof IKONY_ZOBOWIAZAN;
  /** Kiedy klient może to sprawdzić, np. "Po 1. sesji". */
  kiedy: string;
  /** Obietnica w kilku słowach. */
  tytul: string;
  /** Jedno zdanie doprecyzowania. */
  opis: string;
};

export function Zobowiazania({
  id,
  eyebrow,
  title,
  body,
  points,
  dowod,
  note,
  cta,
  ctaHref = "#oferty",
}: {
  /** Kotwica, gdy sekcja jest finalnym CTA, np. "rezerwacja". */
  id?: string;
  /** Zdanie pod przyciskiem: warunki zakupu albo limit miejsc. */
  note?: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Najlepiej cztery, w kolejności, w jakiej klient może je sprawdzić. */
  points: Zobowiazanie[];
  /** Jedno zdanie z kart obciążeń. Tylko prawdziwe liczby. */
  dowod?: string;
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 bg-mgla">
      <div className={`${WRAP} ${PAD}`}>
        <div className="relative isolate overflow-hidden bg-grafit text-white">
          <GraphiteGrid />
          <Corners tone="signal" />

          <div className="grid gap-x-[clamp(2.618rem,5vw,4.236rem)] gap-y-10 p-7 sm:p-10 lg:grid-cols-[1fr_1.272fr] lg:p-14">
            {/* Obietnica */}
            <div className="lg:col-start-1 lg:row-start-1">
              <p className="eyebrow flex items-center gap-2.5 text-sygnal">
                <ShieldCheck aria-hidden="true" strokeWidth={2} className="h-4 w-4" />
                {eyebrow}
              </p>
              <h2 className={`${T.h2} mt-5 max-w-[16ch] lg:text-[clamp(2.2rem,1.6rem_+_1.6vw,3rem)]`}>
                {title}
              </h2>
              <p className={`${T.lead} mt-5 max-w-[40ch] text-white/70`}>{body}</p>
            </div>

            {/* Zobowiązania z momentem sprawdzenia */}
            <ol className="divide-y divide-white/15 border-y border-white/15 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
              {points.map((p, i) => {
                const Ikona = IKONY_ZOBOWIAZAN[p.ikona];
                return (
                  <li key={i} className="grid grid-cols-[2.75rem_1fr] gap-x-5 py-6">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center bg-sygnal text-grafit"
                    >
                      <Ikona strokeWidth={2} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="eyebrow text-white/50">{p.kiedy}</p>
                      <p className="mt-1.5 font-display text-[clamp(1.0625rem,1rem_+_0.3vw,1.25rem)] font-bold leading-snug">
                        {p.tytul}
                      </p>
                      <p className={`${T.body} mt-1 text-white/70`}>{p.opis}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Przycisk: na desktopie pod obietnicą, na telefonie na końcu. */}
            <div className="flex flex-col items-start gap-4 lg:col-start-1 lg:row-start-2 lg:self-end">
              <Cta href={ctaHref} variant="onDark">
                {cta}
              </Cta>
              {note && <p className={`${T.small} max-w-[42ch] text-white/70`}>{note}</p>}
              {dowod && <p className={`${T.small} max-w-[42ch] text-white/60`}>{dowod}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ LOKALIZACJA
   Jedna sekcja, dwa tryby. Lewa kolumna jest wspólna: nagłówek, lead
   i przycisk. Prawa zależy od trybu.

   TRYB `mapa` · trening stacjonarny
   · Adres w dużym kroju z pinezką, pod nim dojazd i punkt orientacyjny.
   · Po prawej embed Google Maps bez klucza API, w szarości, żeby trzymał
     paletę strony. Kolor wraca pod kursorem.
   · Obok przycisku link „Otwórz w Mapach": na telefonie uruchamia
     nawigację, a o to chodzi człowiekowi, który już jedzie.

   TRYB `silownie` · coaching online
   · Klient zaznacza swoją siłownię i od razu widzi: trenujemy tam czy
     trzeba sprawdzić regulamin, i na jakim warunku.
   · Ostatnia pozycja powinna zawsze być „Inna siłownia" ze statusem
     "sprawdz". Bez niej każdy spoza listy zostaje bez odpowiedzi.
   · Wynik czytają czytniki ekranu (aria-live), więc zaznaczenie nie jest
     ciche dla osób, które nie widzą zmiany koloru.

   Sekcja nie odsyła do innych podstron. Strona stacjonarna mówi tylko
   o sali, strona online tylko o kamerze.

   UKŁAD · 1 : 1,272, prawa kolumna szersza, bo mapa i lista potrzebują
   miejsca bardziej niż tekst.
   ─────────────────────────────────────────────────────────────────────── */

export type Silownia = {
  /** Nazwa sieci albo miejsca, np. "Zdrofit", "Dom", "Inna siłownia". */
  nazwa: string;
  /** "tak": trenujemy tam. "sprawdz": czytam regulamin przed sesją. */
  status: "tak" | "sprawdz";
  /** Jedno, dwa zdania: na jakim warunku albo co się dzieje dalej. */
  warunek: string;
};

type LokalizacjaMapa = {
  /** Adres w jednej linii, np. "ul. Piotrkowska 157A, Łódź". */
  address: string;
  /** Dojazd, punkt orientacyjny, sala. Krótkie zdania. */
  details?: string[];
  /** Fraza do wyszukania w Google Maps. */
  query: string;
};

type LokalizacjaSilownie = {
  /** Tekst nad listą, np. "Zaznacz, gdzie trenujesz". */
  label?: string;
  items: Silownia[];
  /** Podpis pod wynikiem: stan regulaminów, data sprawdzenia. */
  note?: string;
};

const STATUS_SILOWNI = {
  tak: { etykieta: "Trenujemy tutaj", Icon: Check },
  sprawdz: { etykieta: "Sprawdzę regulamin przed sesją", Icon: FileText },
} as const;

/** Prawa kolumna trybu `mapa`. */
function MapaKadr({ address, query }: { address: string; query: string }) {
  return (
    <div
      style={{ aspectRatio: "1.272" }}
      className="relative w-full overflow-hidden bg-mgla"
    >
      <iframe
        title={`Mapa: ${address}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0 grayscale transition-[filter] duration-300 hover:grayscale-0 motion-reduce:transition-none"
      />
      <Corners tone="signal" />
    </div>
  );
}

/** Prawa kolumna trybu `silownie`: zaznaczasz, widzisz odpowiedź. */
function WyborSilowni({ label, items, note }: LokalizacjaSilownie) {
  const [wybrana, setWybrana] = useState<number | null>(null);
  const s = wybrana === null ? null : items[wybrana];
  const status = s ? STATUS_SILOWNI[s.status] : null;

  return (
    <div className="bg-mgla p-6 sm:p-8">
      <p className="eyebrow text-stal">{label ?? "Zaznacz, gdzie trenujesz"}</p>

      <div
        role="group"
        aria-label={label ?? "Zaznacz, gdzie trenujesz"}
        className="mt-5 grid gap-px bg-stal/20 sm:grid-cols-2"
      >
        {items.map((it, i) => {
          const on = i === wybrana;
          return (
            <button
              key={it.nazwa}
              type="button"
              aria-pressed={on}
              onClick={() => setWybrana(i)}
              className={`flex min-h-[3.25rem] items-center gap-3 px-4 py-3 text-left text-[0.9375rem] font-semibold transition-colors ${
                on ? "bg-grafit text-white" : "bg-white text-grafit hover:bg-mgla"
              } ${FOCUS_IN}`}
            >
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
                  on ? "border-sygnal bg-sygnal text-grafit" : "border-stal/40"
                }`}
              >
                {on && <Check strokeWidth={3} className="h-3.5 w-3.5" />}
              </span>
              {it.nazwa}
            </button>
          );
        })}
      </div>

      {/* Wynik. Stała minimalna wysokość, żeby strona nie skakała przy
          zmianie zaznaczenia. */}
      <div aria-live="polite" className="mt-6 min-h-[9.5rem]">
        {s && status ? (
          <div className="relative bg-white p-6">
            <Corners tone={s.status === "tak" ? "signal" : "light"} />
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center ${
                  s.status === "tak"
                    ? "bg-sygnal text-grafit"
                    : "border-2 border-grafit text-grafit"
                }`}
              >
                <status.Icon strokeWidth={2.25} className="h-4 w-4" />
              </span>
              <p className="font-display text-[1.0625rem] font-bold leading-tight">
                {s.nazwa}: {status.etykieta}
              </p>
            </div>
            <p className={`${T.body} mt-3 text-stal`}>{s.warunek}</p>
          </div>
        ) : (
          <p className={`${T.body} flex h-full items-center border border-dashed border-stal/40 p-6 text-stal`}>
            Zaznacz swoją siłownię, a zobaczysz, czy trenujemy tam przez kamerę
            i na jakim warunku.
          </p>
        )}
      </div>

      {note && <p className={`${T.small} mt-5 text-stal`}>{note}</p>}
    </div>
  );
}

export function Lokalizacja({
  id = "gdzie",
  eyebrow,
  heading,
  lead,
  mapa,
  silownie,
  cta,
  ctaHref = "#oferty",
}: {
  id?: string;
  eyebrow?: string;
  heading: string;
  lead?: string;
  /** Tryb dla treningu stacjonarnego: adres i mapa. */
  mapa?: LokalizacjaMapa;
  /** Tryb dla coachingu online: wybór siłowni z odpowiedzią. */
  silownie?: LokalizacjaSilownie;
  cta: string;
  ctaHref?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 bg-white">
      <div
        className={`${WRAP} ${PAD_LG} ${GAP} grid items-center lg:grid-cols-[1fr_1.272fr]`}
      >
        <div className="max-w-[46ch]">
          {eyebrow && <p className="eyebrow text-stal">{eyebrow}</p>}

          <h2 className={`${T.h2} ${eyebrow ? "mt-5" : ""}`}>{heading}</h2>

          {lead && <p className={`${T.body} mt-5 text-stal`}>{lead}</p>}

          {mapa && (
            <>
              <div className="mt-8 flex items-start gap-3.5 border-t border-mgla pt-6">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center bg-sygnal text-grafit"
                >
                  <MapPin strokeWidth={2} className="h-4 w-4" />
                </span>
                <p className="font-display text-[clamp(1.25rem,1.1rem_+_0.6vw,1.5rem)] font-extrabold leading-tight tracking-tight">
                  {mapa.address}
                </p>
              </div>

              {mapa.details?.length ? (
                <ul className="mt-6 space-y-3">
                  {mapa.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 bg-grafit"
                      />
                      <span className={`${T.body} text-stal`}>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <Cta href={ctaHref}>{cta}</Cta>
            {mapa && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapa.query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-center text-sm font-semibold underline underline-offset-4 sm:text-left ${FOCUS}`}
              >
                Otwórz w Mapach Google
              </a>
            )}
          </div>
        </div>

        {mapa ? (
          <MapaKadr address={mapa.address} query={mapa.query} />
        ) : silownie ? (
          <WyborSilowni {...silownie} />
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ DOMKNIĘCIE */

export function Urgency({
  id,
  eyebrow,
  title,
  body,
  cta,
  ctaHref = "#oferty",
  note,
  total,
  free,
  slotsLabel,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  ctaHref?: string;
  note: string;
  /** Opcjonalny licznik miejsc. Podaj total i free, żeby narysować pasek. */
  total?: number;
  free?: number;
  slotsLabel?: string;
  /**
   * Slot na kalendarz z płatnością albo formularz. Gdy jest wypełniony,
   * przycisk sekcji znika — linkowałby sam do siebie.
   */
  children?: React.ReactNode;
}) {
  const showSlots = typeof total === "number" && typeof free === "number";

  return (
    <section
      id={id}
      className="relative isolate scroll-mt-24 overflow-hidden bg-grafit text-white"
    >
      <GraphiteGrid />

      <div className={`${WRAP_TEXT} ${PAD_LG} text-center`}>
        <p className="eyebrow text-sygnal">{eyebrow}</p>

        <h2 className={`${T.h2} mx-auto mt-5 max-w-[20ch]`}>{title}</h2>

        <p className={`${T.lead} mx-auto mt-6 max-w-[52ch] text-white/70`}>
          {body}
        </p>

        {showSlots && (
          <div className="mt-10">
            <div
              className="flex flex-wrap justify-center gap-1.5"
              role="img"
              aria-label={`${slotsLabel ?? "Wolne miejsca"}: ${free} z ${total}`}
            >
              {Array.from({ length: total! }).map((_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`h-4 w-4 ${
                    i < total! - free! ? "bg-white/20" : "bg-sygnal"
                  }`}
                />
              ))}
            </div>
            {slotsLabel && (
              <p className="eyebrow mt-4 text-white/70">
                {slotsLabel}: {free} z {total}
              </p>
            )}
          </div>
        )}

        {children ? (
          <div className="mt-10 text-left">{children}</div>
        ) : (
          <div className="mt-9 flex justify-center">
            <Cta href={ctaHref} variant="onDark">
              {cta}
            </Cta>
          </div>
        )}

        <p className={`${T.small} mx-auto mt-5 max-w-[48ch] text-white/60`}>
          {note}
        </p>
      </div>
    </section>
  );
}

/** Domknięcie: powtórzenie obietnicy plus zdjęcie. */
export function FinalRecap({
  proof,
  title,
  body,
  points,
  cta,
  ctaHref = "#oferty",
  note,
  shot,
}: {
  proof: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  ctaHref?: string;
  note: string;
  shot: string;
}) {
  return (
    <section className="bg-mgla">
      <div
        className={`${WRAP} ${GAP} ${PAD_LG} grid items-center lg:grid-cols-[1.618fr_1fr]`}
      >
        <div className="max-w-[46ch]">
          <p className="eyebrow text-stal">{proof}</p>

          <h2 className={`${T.h2} mt-5`}>{title}</h2>

          <p className={`${T.lead} mt-5 text-stal`}>{body}</p>

          <ul className="mt-8 space-y-3.5">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <Waypoint n={i + 1} size="sm" dark />
                <span className={`${T.body} pt-0.5`}>{p}</span>
              </li>
            ))}
          </ul>

          <Cta href={ctaHref} className="mt-9">
            {cta}
          </Cta>

          <p className={`${T.small} mt-5 text-stal`}>{note}</p>
        </div>

        <Shot ratio="0.786" brief={shot} />
      </div>
    </section>
  );
}

/** Ciemna belka domykająca. Siatka w tle, opcjonalne zdjęcie i warunki. */
export function FinalBand({
  eyebrow,
  title,
  body,
  aside,
  cta,
  ctaHref = "#oferty",
  note,
  image,
  imageAlt = "",
}: {
  /** Krótka linia nad nagłówkiem. */
  eyebrow?: string;
  title: string;
  body: string;
  /** Warunki pod kreską: zwrot, dostęp, aktualizacje. */
  aside?: string;
  cta: string;
  ctaHref?: string;
  note?: string;
  /** Ścieżka do zdjęcia w /public, np. "/zdjecia/sala.jpg". */
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-grafit text-white">
      {image && (
        <img
          src={image}
          alt={imageAlt}
          aria-hidden={imageAlt ? undefined : true}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
      )}

      <GraphiteGrid />

      <div className={`${WRAP_TEXT} ${PAD_LG} text-center`}>
        {eyebrow && <p className="eyebrow text-sygnal">{eyebrow}</p>}

        <h2 className={`${T.h2} mx-auto max-w-[22ch] ${eyebrow ? "mt-5" : ""}`}>
          {title}
        </h2>

        <p className={`${T.lead} mx-auto mt-6 max-w-[54ch] text-white/75`}>
          {body}
        </p>

        <div className="mt-9 flex justify-center">
          <Cta href={ctaHref} variant="onDark">
            {cta}
          </Cta>
        </div>

        {note && <p className={`${T.small} mt-5 text-white/60`}>{note}</p>}

        {aside && (
          <p
            className={`${T.small} mx-auto mt-9 max-w-[52ch] border-t border-white/15 pt-5 text-white/60`}
          >
            {aside}
          </p>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------- PASEK OGŁOSZEŃ */

/** Wąski pasek na samej górze: gwarancja, wysyłka albo aktualna oferta. */
export function AnnounceBar({ text }: { text: string }) {
  return (
    <div className="bg-grafit px-5 py-2.5 text-center">
      <p className="eyebrow text-sygnal">{text}</p>
    </div>
  );
}

/** Przewijana taśma z zasadami współpracy. Krawędzie wygaszone maską. */
export function IconStrip({
  items,
  tone = "light",
  label = "Zasady współpracy",
}: {
  items: string[];
  tone?: "light" | "fog";
  label?: string;
}) {
  // trzy kopie, żeby taśma nie zostawiała dziury na szerokich ekranach
  const track = [...items, ...items, ...items];

  return (
    <section
      aria-label={label}
      className={`overflow-hidden border-y border-black/[0.06] ${
        tone === "fog" ? "bg-mgla" : "bg-white"
      }`}
    >
      <style>{`
        @keyframes strip-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-33.3333%, 0, 0); }
        }
        .strip-track { animation: strip-scroll 48s linear infinite; }
        .strip:hover .strip-track { animation-play-state: paused; }
        .strip {
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .strip-track { animation: none; }
        }
      `}</style>

      <div className="strip py-4">
        <ul className="strip-track flex w-max items-center will-change-transform">
          {track.map((t, i) => (
            <li
              key={i}
              aria-hidden={i >= items.length}
              className="flex items-center whitespace-nowrap text-[13px] leading-none tracking-tight text-stal"
            >
              {t}
              <span
                aria-hidden="true"
                className="mx-7 h-[3px] w-[3px] shrink-0 rounded-full bg-sygnal"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- STOPKA
   Dwa rzędy:
   1. logo i trzy linki prawne: regulamin, polityka prywatności
      i ustawienia cookies,
   2. dane sprzedawcy wymagane przepisami (nazwa, adres, NIP, kontakt).
      Dane biorą się z app/tresc/firma.ts.

   „Ustawienia cookies" to przycisk, nie link: wysyła zdarzenie
   `otworz-ustawienia-cookies`, na które nasłuchuje baner zgód. Dopóki
   banera nie ma, zostaw POKAZ_USTAWIENIA_COOKIES = false, żeby w stopce
   nie wisiał przycisk, który nic nie robi.

   Na telefonie dolny margines robi miejsce pod przyklejony pasek CTA.
   ─────────────────────────────────────────────────────────────────────── */

const POKAZ_USTAWIENIA_COOKIES = false;

export function Footer() {
  const linki = [
    { href: "/regulamin", label: "Regulamin" },
    { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  ];

  const daneFirmy = [
    FIRMA.nazwa,
    FIRMA.adres,
    `NIP ${FIRMA.nip}`,
  ];

  return (
    <footer className="border-t border-stal/15 bg-mgla">
      <div className={`${WRAP} pb-28 pt-10 md:pb-10`}>
        {/* Rząd 1: marka i linki prawne */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Waypoint n="↑" size="sm" dark />
            <span className="font-display text-sm font-extrabold tracking-tight">
              {FIRMA.marka}
            </span>
          </div>

          <nav aria-label="Dokumenty">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {linki.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`text-sm text-stal underline-offset-4 hover:text-grafit hover:underline ${FOCUS}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {POKAZ_USTAWIENIA_COOKIES && (
                <li>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("otworz-ustawienia-cookies"))}
                    className={`text-sm text-stal underline-offset-4 hover:text-grafit hover:underline ${FOCUS}`}
                  >
                    Ustawienia cookies
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Rząd 2: dane sprzedawcy */}
        <div className="mt-8 flex flex-col gap-3 border-t border-stal/15 pt-6 text-xs leading-relaxed text-stal md:flex-row md:items-start md:justify-between md:gap-8">
          <p className="max-w-[60ch]">
            {daneFirmy.map((d, i) => (
              <span key={i}>
                {i > 0 && <span aria-hidden="true" className="mx-2 text-stal/50">·</span>}
                <span className="whitespace-nowrap">{d}</span>
              </span>
            ))}
          </p>

          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <a href={`mailto:${FIRMA.email}`} className={`hover:text-grafit ${FOCUS}`}>
              {FIRMA.email}
            </a>
            <a href={FIRMA.telefonHref} className={`tnum hover:text-grafit ${FOCUS}`}>
              {FIRMA.telefon}
            </a>
            <span>© {new Date().getFullYear()} {FIRMA.marka}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FaqSplit · zostawiony wyłącznie dla zgodności ze starszymi stronami.
   Na stronie treningów używaj <Faq>.
   ══════════════════════════════════════════════════════════════════════ */

export function FaqSplit({
  heading,
  items,
  cta,
  ctaHref = "#oferty",
}: {
  heading: string;
  items: { q: string; a: string }[];
  shot?: string;
  cta: string;
  ctaHref?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <section className="bg-white">
      <div className={`${WRAP_TEXT} ${PAD_LG}`}>
        <h2 className={T.h2}>{heading}</h2>

        <div className="mt-8 border-t border-mgla">
          {items.map((item, i) => (
            <details key={i} className="faq group border-b border-mgla">
              <summary
                className={`flex cursor-pointer list-none items-start justify-between gap-5 py-5 text-[16px] font-semibold leading-snug [&::-webkit-details-marker]:hidden ${FOCUS}`}
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className="relative mt-1 h-5 w-5 shrink-0 border border-stal/40 group-open:border-sygnal group-open:bg-sygnal"
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-grafit" />
                  <span className="absolute left-1/2 top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-grafit group-open:hidden" />
                </span>
              </summary>
              <p className={`${T.body} max-w-[62ch] pb-5 text-stal`}>{item.a}</p>
            </details>
          ))}
        </div>

        <Cta href={ctaHref} className="mt-9">
          {cta}
        </Cta>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}