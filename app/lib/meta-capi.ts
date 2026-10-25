// PLIK: app/lib/meta-capi.ts · META CONVERSIONS API · zakup i zgłoszenie (lead) z serwera do Mety (tylko przy zgodzie)
import { createHash } from "node:crypto";
import type Stripe from "stripe";

/* ═══════════════════════════════════════════════════════════════════════
   CONVERSIONS API

   Przeglądarki i blokery gubią część zdarzeń z Pixela. Po opłaconym
   zakupie serwer sam wysyła „Purchase” do Mety, ale TYLKO wtedy, gdy
   klient zgodził się na cookies marketingowe (zgoda zapisana w
   metadanych płatności przez app/lib/platnosc.ts).

   E-mail i telefon wychodzą jako skrót SHA-256, nigdy otwartym tekstem.
   event_id = id sesji Stripe, ten sam co w Pixelu na /dziekujemy:
   Meta łączy oba zdarzenia i liczy zakup raz.

   ZMIENNE (Vercel):
     NEXT_PUBLIC_META_PIXEL_ID=123456789012345
     META_CAPI_TOKEN=EAAB...          (Menedżer zdarzeń → Ustawienia →
                                       Conversions API → Wygeneruj token)
     META_TEST_EVENT_CODE=TEST12345   (opcjonalnie, tylko do testów:
                                       zdarzenia widać w „Testuj zdarzenia”)
   ═══════════════════════════════════════════════════════════════════════ */

const WERSJA_API = "v23.0";

const skrot = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

/** Telefon do formatu Mety: same cyfry z kierunkowym, np. 48600100200. */
function telefonDoMety(t: string | null | undefined): string | undefined {
  const cyfry = (t ?? "").replace(/\D/g, "");
  if (!cyfry) return undefined;
  return cyfry.length === 9 ? `48${cyfry}` : cyfry;
}

export async function zakupDoMety(s: Stripe.Checkout.Session, nazwaProduktu: string): Promise<void> {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  const md = s.metadata ?? {};
  if (!pixel || !token || md.zgoda_m !== "1") return;

  const email = s.customer_details?.email ?? s.customer_email;
  const telefon = telefonDoMety(s.customer_details?.phone ?? md.telefon);
  const strona = (process.env.SITE_URL || "https://www.trenerlodz.pl").replace(/\/+$/, "");

  const zdarzenie = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: s.id,
    action_source: "website",
    event_source_url: md.url || `${strona}/dziekujemy`,
    user_data: {
      ...(email ? { em: [skrot(email)] } : {}),
      ...(telefon ? { ph: [skrot(telefon)] } : {}),
      ...(md.ip ? { client_ip_address: md.ip } : {}),
      ...(md.ua ? { client_user_agent: md.ua } : {}),
      ...(md.fbp ? { fbp: md.fbp } : {}),
      ...(md.fbc ? { fbc: md.fbc } : {}),
      country: [skrot("pl")],
    },
    custom_data: {
      value: (s.amount_total ?? 0) / 100,
      currency: (s.currency ?? "pln").toUpperCase(),
      content_ids: md.produkt ? [md.produkt] : [],
      content_name: nazwaProduktu,
      order_id: s.client_reference_id ?? s.id,
    },
  };

  const test = process.env.META_TEST_EVENT_CODE;
  const odp = await fetch(`https://graph.facebook.com/${WERSJA_API}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [zdarzenie], ...(test ? { test_event_code: test } : {}) }),
    signal: AbortSignal.timeout(8000),
  });
  if (!odp.ok) {
    console.error("[meta-capi]", odp.status, (await odp.text()).slice(0, 500));
  }
}

/** Zgłoszenie (np. konkurs) z serwera do Mety jako „Lead”. Tylko przy zgodzie
    na cookies marketingowe. eventId = ten sam co w Pixelu (ZdarzenieLead). */
export async function leadDoMety(l: {
  eventId: string;
  zrodlo: string;
  url: string;
  telefon?: string;
  imie?: string;
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
}): Promise<void> {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) return;

  const telefon = telefonDoMety(l.telefon);
  const zdarzenie = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: l.eventId,
    action_source: "website",
    event_source_url: l.url,
    user_data: {
      ...(telefon ? { ph: [skrot(telefon)] } : {}),
      ...(l.imie ? { fn: [skrot(l.imie)] } : {}),
      ...(l.ip ? { client_ip_address: l.ip } : {}),
      ...(l.ua ? { client_user_agent: l.ua } : {}),
      ...(l.fbp ? { fbp: l.fbp } : {}),
      ...(l.fbc ? { fbc: l.fbc } : {}),
      country: [skrot("pl")],
    },
    custom_data: { content_name: l.zrodlo },
  };

  const test = process.env.META_TEST_EVENT_CODE;
  try {
    const odp = await fetch(`https://graph.facebook.com/${WERSJA_API}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [zdarzenie], ...(test ? { test_event_code: test } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!odp.ok) console.error("[meta-capi] lead", odp.status, (await odp.text()).slice(0, 500));
  } catch (e) {
    console.error("[meta-capi] lead:", e);
  }
}
