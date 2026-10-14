// PLIK: app/components/Prawne.tsx · UKŁAD STRON PRAWNYCH · regulamin i polityka prywatności

import { Footer } from "@/app/components/sections";
import { DATA_DOKUMENTOW, FIRMA } from "@/app/tresc/firma";

/* ═══════════════════════════════════════════════════════════════════════
   STRONA DOKUMENTU · wspólny układ regulaminu i polityki prywatności

   Treść podajesz jako dane: lista paragrafów, a w każdym akapity, listy
   i definicje. Komponent robi z tego numerowane paragrafy ze spisem treści
   i kotwicami (#p1, #p2…), żeby dało się podlinkować konkretny punkt,
   np. /regulamin#p7 przy odstąpieniu od umowy.

   Wygląd: te same tokeny co strony sprzedażowe (grafit, sygnal, stal,
   mgla, font-display), ale bez CTA. Kolumna tekstu ok. 68 znaków,
   bo to dokument do czytania, nie do przewijania.
   ═══════════════════════════════════════════════════════════════════════ */

export type Blok =
  | string
  | { lista: string[]; numerowana?: boolean }
  | { definicje: [string, string][] }
  | { tabela: { naglowki: string[]; wiersze: string[][] } }
  | { uwaga: string };

export type Paragraf = {
  tytul: string;
  tresc: Blok[];
};

const WRAP = "mx-auto w-full max-w-[52rem] px-5 sm:px-8";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sygnal";

function RenderBlok({ b }: { b: Blok }) {
  if (typeof b === "string") {
    return <p className="text-[0.9375rem] leading-[1.7] text-grafit/85 sm:text-base">{b}</p>;
  }
  if ("lista" in b) {
    const Tag = b.numerowana ? "ol" : "ul";
    return (
      <Tag
        className={`space-y-2 pl-5 text-[0.9375rem] leading-[1.7] text-grafit/85 sm:text-base ${
          b.numerowana ? "list-decimal marker:font-semibold marker:text-stal" : "list-disc marker:text-sygnal"
        }`}
      >
        {b.lista.map((l, i) => (
          <li key={i} className="pl-1.5">
            {l}
          </li>
        ))}
      </Tag>
    );
  }
  if ("definicje" in b) {
    return (
      <dl className="space-y-3">
        {b.definicje.map(([t, d], i) => (
          <div key={i} className="border-l-2 border-sygnal pl-4">
            <dt className="text-sm font-bold text-grafit">{t}</dt>
            <dd className="mt-0.5 text-[0.9375rem] leading-[1.65] text-grafit/85">{d}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if ("tabela" in b) {
    return (
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-grafit">
              {b.tabela.naglowki.map((h) => (
                <th key={h} className="py-2.5 pr-4 font-display text-xs font-bold uppercase tracking-[0.06em]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.tabela.wiersze.map((w, i) => (
              <tr key={i} className="border-b border-mgla align-top">
                {w.map((c, j) => (
                  <td key={j} className={`py-3 pr-4 leading-[1.55] ${j === 0 ? "font-semibold" : "text-grafit/80"}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <p className="border-l-4 border-sygnal bg-mgla px-5 py-4 text-[0.9375rem] font-medium leading-[1.65] text-grafit">
      {b.uwaga}
    </p>
  );
}

export function StronaPrawna({
  tytul,
  wstep,
  paragrafy,
  zalaczniki,
}: {
  tytul: string;
  wstep: string;
  paragrafy: Paragraf[];
  /** Dodatkowe treści na końcu, np. wzór formularza odstąpienia. */
  zalaczniki?: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-mgla bg-white">
        <div className={`${WRAP} flex items-center justify-between gap-4 py-4`}>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 items-center justify-center bg-grafit font-display text-[11px] font-bold text-sygnal"
            >
              ↑
            </span>
            <span className="font-display text-[0.9375rem] font-extrabold tracking-tight">{FIRMA.marka}</span>
          </div>
          <a href={FIRMA.telefonHref} className={`text-sm font-semibold underline underline-offset-4 ${FOCUS}`}>
            {FIRMA.telefon}
          </a>
        </div>
      </header>

      <main className="bg-white">
        <div className={`${WRAP} py-[clamp(3rem,7vw,5.5rem)]`}>
          <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-stal">
            Obowiązuje od {DATA_DOKUMENTOW}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,1.4rem_+_2.4vw,3.25rem)] leading-[1.05] tracking-[-0.022em]">
            {tytul}
          </h1>
          <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.6] text-stal">{wstep}</p>

          {/* Spis treści */}
          <nav aria-label="Spis treści" className="mt-10 border-y border-mgla py-6">
            <ol className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              {paragrafy.map((p, i) => (
                <li key={i}>
                  <a href={`#p${i + 1}`} className={`group flex gap-3 text-grafit/80 hover:text-grafit ${FOCUS}`}>
                    <span className="w-6 shrink-0 font-display font-bold text-stal tnum">§{i + 1}</span>
                    <span className="underline-offset-4 group-hover:underline">{p.tytul}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 space-y-14">
            {paragrafy.map((p, i) => (
              <section key={i} id={`p${i + 1}`} className="scroll-mt-8">
                <h2 className="flex items-start gap-3.5 font-display text-[clamp(1.25rem,1.1rem_+_0.6vw,1.5rem)] leading-tight tracking-[-0.012em]">
                  <span className="mt-0.5 inline-flex shrink-0 items-center justify-center bg-grafit px-2 py-1 text-[0.8125rem] font-bold leading-none text-sygnal tnum">
                    §{i + 1}
                  </span>
                  {p.tytul}
                </h2>
                <div className="mt-5 space-y-4">
                  {p.tresc.map((b, j) => (
                    <RenderBlok key={j} b={b} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {zalaczniki}
        </div>
      </main>

      <Footer />
    </>
  );
}