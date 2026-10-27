// STRONA: 404 · każdy adres, którego nie ma na stronie (i /zamowienie)
import type { Metadata } from "next";
import { Footer, Header } from "@/app/components/sections";
import { TELEFON, TELEFON_HREF, TRASY } from "@/app/lib/dane";

export const metadata: Metadata = {
  title: "Nie ma takiej strony | Maks Treningi",
  robots: { index: false, follow: true },
};

/* Zamiast ślepej uliczki: trzy oferty i telefon. */
const DOKAD = [
  { href: TRASY.sala, nazwa: "Trening personalny w Łodzi", cena: "150 zł" },
  { href: TRASY.online, nazwa: "Trening online przez kamerę", cena: "100 zł" },
  { href: TRASY.plan, nazwa: "Plan treningowy", cena: "249 zł" },
];

export default function NotFound() {
  return (
    <>
      <Header cta="Strona główna" ctaKrotko="Strona główna" ctaHref="/" />

      <main className="relative isolate overflow-hidden bg-grafit text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:2.618rem_2.618rem]"
        />
        <div className="mx-auto w-full max-w-[52rem] px-5 py-16 sm:px-8 sm:py-24">
          <p className="font-display text-sm font-bold text-sygnal">Błąd 404</p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,1.5rem+3.5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.025em] text-balance">
            Tej strony nie ma
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/75">
            Adres jest błędny albo strona została usunięta. Wybierz, czego szukasz, albo zadzwoń.
          </p>

          <ul className="mt-10 grid gap-3">
            {DOKAD.map((d) => (
              <li key={d.href}>
                <a
                  href={d.href}
                  className="flex min-h-[3.5rem] items-center justify-between gap-4 bg-sygnal px-5 py-4 font-display font-extrabold text-grafit transition-colors hover:bg-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-white"
                >
                  <span>{d.nazwa}</span>
                  <span className="whitespace-nowrap">{d.cena} →</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-white/75">
            Nie wiesz, co wybrać? Zadzwoń albo napisz SMS:{" "}
            <a href={TELEFON_HREF} className="font-bold text-white underline underline-offset-4">
              {TELEFON}
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
