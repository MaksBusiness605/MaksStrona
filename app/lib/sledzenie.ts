// PLIK: app/lib/sledzenie.ts · ŚLEDZENIE · zgody z banera i zdarzenia do GA4 i Meta Pixel (przeglądarka)

/* ═══════════════════════════════════════════════════════════════════════
   ZGODY I ZDARZENIA

   Zgoda siedzi w pliku cookie `zgoda-cookies` (12 miesięcy), np.
   {"a":1,"m":0}: a = analityka (GA4), m = marketing (Meta Pixel i
   Conversions API). Ten sam plik czyta serwer przy płatności, żeby
   wiedzieć, czy wolno wysłać zakup do Mety (app/lib/meta-capi.ts).

   sledz() można wołać zawsze: bez zgody nic nie wychodzi, a zdarzenia
   wysłane, zanim skrypty się wczytały, czekają w kolejce.
   ═══════════════════════════════════════════════════════════════════════ */

export const ZGODA_COOKIE = "zgoda-cookies";

export type Zgoda = { a: boolean; m: boolean };

/** Czyta zgodę z nagłówka Cookie (serwer) albo z document.cookie (przeglądarka). */
export function czytajZgode(cookies: string | null | undefined): Zgoda | null {
  if (!cookies) return null;
  const surowe = cookies
    .split(/;\s*/)
    .find((c) => c.startsWith(`${ZGODA_COOKIE}=`))
    ?.slice(ZGODA_COOKIE.length + 1);
  if (!surowe) return null;
  try {
    const z = JSON.parse(decodeURIComponent(surowe));
    return { a: Boolean(z.a), m: Boolean(z.m) };
  } catch {
    return null;
  }
}

export function zapiszZgode(z: Zgoda) {
  const wartosc = encodeURIComponent(JSON.stringify({ a: z.a ? 1 : 0, m: z.m ? 1 : 0 }));
  document.cookie = `${ZGODA_COOKIE}=${wartosc}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax; Secure`;
}

/* ─────────────────────────────────────────────────────── ZDARZENIA */

type Zdarzenie =
  | { typ: "rozpoczecie"; produkt?: string }
  | { typ: "zakup"; id: string; numer?: string; wartosc: number; produkt?: string; nazwa?: string }
  | { typ: "lead"; id: string; zrodlo: string };

type Okno = Window & {
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
  __kolejkaSledzenia?: Zdarzenie[];
  __zgoda?: Zgoda | null;
};

function wyslij(w: Okno, z: Zdarzenie) {
  const zgoda = w.__zgoda;
  if (!zgoda) return;

  if (z.typ === "rozpoczecie") {
    if (zgoda.a) w.gtag?.("event", "begin_checkout", { currency: "PLN", items: z.produkt ? [{ item_id: z.produkt }] : [] });
    if (zgoda.m) w.fbq?.("track", "InitiateCheckout", { currency: "PLN", content_ids: z.produkt ? [z.produkt] : [] });
  }

  /* Zgłoszenie (np. konkurs). eventID = ten sam co w Conversions API
     z serwera, więc Meta liczy jedno zgłoszenie raz. */
  if (z.typ === "lead") {
    if (zgoda.a) w.gtag?.("event", "generate_lead", { lead_source: z.zrodlo });
    if (zgoda.m) w.fbq?.("track", "Lead", { content_name: z.zrodlo }, { eventID: z.id });
  }

  if (z.typ === "zakup") {
    if (zgoda.a) {
      w.gtag?.("event", "purchase", {
        transaction_id: z.numer || z.id,
        value: z.wartosc,
        currency: "PLN",
        items: [{ item_id: z.produkt, item_name: z.nazwa, price: z.wartosc, quantity: 1 }],
      });
    }
    /* eventID = id sesji Stripe: Meta łączy to zdarzenie z tym samym
       zakupem wysłanym z serwera (Conversions API) i liczy go raz. */
    if (zgoda.m) {
      w.fbq?.(
        "track",
        "Purchase",
        { value: z.wartosc, currency: "PLN", content_ids: z.produkt ? [z.produkt] : [], content_name: z.nazwa },
        { eventID: z.id },
      );
    }
  }
}

/** Wysyła zdarzenie, gdy jest zgoda. Przed wczytaniem skryptów trafia do kolejki. */
export function sledz(z: Zdarzenie) {
  if (typeof window === "undefined") return;
  const w = window as Okno;
  if (w.__zgoda === undefined) {
    (w.__kolejkaSledzenia ??= []).push(z);
    return;
  }
  wyslij(w, z);
}

/** Wołane przez baner, gdy zgoda jest znana i skrypty wczytane. */
export function oproznijKolejke() {
  const w = window as Okno;
  const kolejka = w.__kolejkaSledzenia ?? [];
  w.__kolejkaSledzenia = [];
  kolejka.forEach((z) => wyslij(w, z));
}