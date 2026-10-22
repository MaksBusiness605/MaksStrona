"use client";
// PLIK: app/components/Zgody.tsx · BANER COOKIES · zgody, wczytanie GA4 i Meta Pixel, zdarzenia kliknięć

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { czytajZgode, oproznijKolejke, sledz, zapiszZgode, type Zgoda } from "@/app/lib/sledzenie";

/* ═══════════════════════════════════════════════════════════════════════
   BANER COOKIES + GA4 + META PIXEL

   Wstawiony raz w app/layout.tsx. Do czasu zgody nie wczytuje niczego.
   · „Akceptuję wszystkie” → GA4 i Pixel.
   · „Odrzucam” → nic. Przycisk jest tak samo widoczny jak akceptacja,
     tego wymagają przepisy i UODO.
   · „Wybieram” → osobno analityka i marketing.
   Przycisk „Ustawienia cookies” w stopce otwiera ten panel ponownie.

   ZMIENNE (Vercel → Environment Variables, NIE oznaczaj jako Sensitive):
     NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX          (GA4 → Administracja → Strumienie danych)
     NEXT_PUBLIC_META_PIXEL_ID=123456789012345  (Menedżer zdarzeń Meta)
   Bez nich baner działa, a skrypty się po prostu nie wczytują.
   ═══════════════════════════════════════════════════════════════════════ */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Okno = Window & {
  dataLayer?: unknown[];
  gtag?: (...a: unknown[]) => void;
  fbq?: ((...a: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
  _fbq?: unknown;
  __zgoda?: Zgoda | null;
};

function skrypt(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function ladujGA(w: Okno) {
  if (!GA_ID || w.gtag) return;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  w.gtag("js", new Date());
  w.gtag("config", GA_ID);
  skrypt(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
}

function ladujPixel(w: Okno) {
  if (!PIXEL_ID || w.fbq) return;
  const fbq = function (...a: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...a);
    else fbq.queue!.push(a);
  } as NonNullable<Okno["fbq"]>;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  w.fbq = fbq;
  if (!w._fbq) w._fbq = fbq;
  skrypt("https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

export function Zgody() {
  const [widoczny, setWidoczny] = useState(false);
  const [szczegoly, setSzczegoly] = useState(false);
  const [analityka, setAnalityka] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const pathname = usePathname();
  const pierwszaStrona = useRef(true);

  const zastosuj = useCallback((z: Zgoda) => {
    const w = window as Okno;
    const poprzednia = w.__zgoda;
    /* Cofnięcie zgody po wczytaniu skryptów: przeładowanie, bo
       wczytanego skryptu nie da się „odładować”. */
    if (poprzednia && ((poprzednia.a && !z.a) || (poprzednia.m && !z.m))) {
      window.location.reload();
      return;
    }
    w.__zgoda = z;
    if (z.a) ladujGA(w);
    if (z.m) ladujPixel(w);
    oproznijKolejke();
  }, []);

  /* Start: zgoda zapisana wcześniej albo baner. */
  useEffect(() => {
    const z = czytajZgode(document.cookie);
    if (z) {
      setAnalityka(z.a);
      setMarketing(z.m);
      zastosuj(z);
    } else {
      setWidoczny(true);
    }
    const otworz = () => {
      setSzczegoly(true);
      setWidoczny(true);
    };
    window.addEventListener("otworz-ustawienia-cookies", otworz);
    return () => window.removeEventListener("otworz-ustawienia-cookies", otworz);
  }, [zastosuj]);

  /* Zmiana podstrony bez przeładowania: PageView dla Pixela. GA4 liczy
     to sam (pomiar zaawansowany, „zmiany historii przeglądarki”). */
  useEffect(() => {
    if (pierwszaStrona.current) {
      pierwszaStrona.current = false;
      return;
    }
    const w = window as Okno;
    if (w.__zgoda?.m) w.fbq?.("track", "PageView");
  }, [pathname]);

  /* Kliknięcie w zakup: każdy link i formularz do /api/stripe/platnosc. */
  useEffect(() => {
    const klik = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href*='/api/stripe/platnosc']") as HTMLAnchorElement | null;
      if (!a) return;
      sledz({ typ: "rozpoczecie", produkt: new URL(a.href, location.href).searchParams.get("produkt") ?? undefined });
    };
    const wyslanie = (e: SubmitEvent) => {
      const f = e.target as HTMLFormElement | null;
      if (!f?.action?.includes("/api/stripe/platnosc")) return;
      const produkt = new FormData(f).get("produkt");
      sledz({ typ: "rozpoczecie", produkt: typeof produkt === "string" ? produkt : undefined });
    };
    document.addEventListener("click", klik, true);
    document.addEventListener("submit", wyslanie, true);
    return () => {
      document.removeEventListener("click", klik, true);
      document.removeEventListener("submit", wyslanie, true);
    };
  }, []);

  const zapisz = (z: Zgoda) => {
    zapiszZgode(z);
    setWidoczny(false);
    setSzczegoly(false);
    zastosuj(z);
  };

  if (!widoczny) return null;

  const przycisk =
    "min-h-11 px-5 py-3 font-display text-[0.8125rem] font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sygnal";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="zgody-tytul"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-stal/20 bg-grafit text-white shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.5)]"
    >
      <div className="mx-auto w-full max-w-[1352px] px-5 py-5 sm:px-8 lg:px-10">
        <p id="zgody-tytul" className="font-display text-base font-extrabold">Pliki cookies</p>
        <p className="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-white/80">
          Statystyki Google (GA4) pokazują mi, które strony działają, a Meta Pixel mierzy reklamy na Facebooku
          i Instagramie. Uruchamiam je tylko za Twoją zgodą. Szczegóły w{" "}
          <a href="/polityka-cookies" className="underline underline-offset-4 hover:text-sygnal">polityce cookies</a>.
        </p>

        {szczegoly && (
          <fieldset className="mt-4 grid gap-3 sm:grid-cols-3">
            <legend className="sr-only">Rodzaje plików cookies</legend>
            <label className="flex items-start gap-3 bg-white/5 p-3 text-sm">
              <input type="checkbox" checked disabled className="mt-0.5 h-4 w-4 accent-sygnal" />
              <span><strong>Niezbędne</strong><br /><span className="text-white/70">zapamiętują ten wybór, zawsze włączone</span></span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 bg-white/5 p-3 text-sm">
              <input type="checkbox" checked={analityka} onChange={(e) => setAnalityka(e.target.checked)} className="mt-0.5 h-4 w-4 accent-sygnal" />
              <span><strong>Analityczne</strong><br /><span className="text-white/70">Google Analytics 4</span></span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 bg-white/5 p-3 text-sm">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 h-4 w-4 accent-sygnal" />
              <span><strong>Marketingowe</strong><br /><span className="text-white/70">Meta Pixel i Conversions API</span></span>
            </label>
          </fieldset>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={() => zapisz({ a: true, m: true })} className={`${przycisk} bg-sygnal text-grafit hover:bg-white`}>
            Akceptuję wszystkie
          </button>
          <button type="button" onClick={() => zapisz({ a: false, m: false })} className={`${przycisk} bg-white text-grafit hover:bg-sygnal`}>
            Odrzucam
          </button>
          {szczegoly ? (
            <button type="button" onClick={() => zapisz({ a: analityka, m: marketing })} className={`${przycisk} border border-white/40 text-white hover:border-sygnal hover:text-sygnal`}>
              Zapisz wybór
            </button>
          ) : (
            <button type="button" onClick={() => setSzczegoly(true)} className={`${przycisk} border border-white/40 text-white hover:border-sygnal hover:text-sygnal`}>
              Wybieram
            </button>
          )}
        </div>
      </div>
    </div>
  );
}