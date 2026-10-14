// PLIK: app/lib/webhook.ts · STRIPE · potwierdzenie płatności i wysyłka maili (wołane z app/api/stripe/webhook/route.ts)
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "./klient";
import { mailDoKlienta, mailDoTrenera, mailNieudana } from "./maile";
import { cena, znajdzProdukt } from "./produkty";
import { wyslijMail } from "./wyslij-mail";

/* ═══════════════════════════════════════════════════════════════════════
   WEBHOOK · jedyne miejsce, które wie na pewno, że zapłacono

   Strona /dziekujemy pokazuje klientowi, co dalej, ale to tutaj Stripe
   potwierdza płatność. Stąd wychodzą dwa maile: do klienta
   (potwierdzenie i co dalej) i do Ciebie (kto kupił i jak zadzwonić).

   Lokalnie:
     stripe listen --forward-to localhost:3000/api/stripe/webhook
   Sekret, który wypisze (whsec_…), wpisujesz do STRIPE_WEBHOOK_SECRET.

   Na produkcji, w panelu Stripe: Developers → Webhooks → Add endpoint
     adres:     https://TWOJA-DOMENA/api/stripe/webhook
     zdarzenia: checkout.session.completed
                checkout.session.async_payment_succeeded
                checkout.session.async_payment_failed
   Ten endpoint ma własny sekret whsec_…, inny niż lokalny.

   Stripe może wysłać to samo zdarzenie więcej niż raz. Przy dwóch
   mailach nic się nie psuje, ale gdy dojdzie baza zamówień, zapisuj
   event.id i pomijaj powtórki.
   ═══════════════════════════════════════════════════════════════════════ */

export async function obsluzWebhook(req: Request) {
  const sekret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !sekret) return new NextResponse("Webhook nieskonfigurowany", { status: 503 });

  const podpis = req.headers.get("stripe-signature");
  if (!podpis) return new NextResponse("Brak podpisu", { status: 400 });

  let zdarzenie: Stripe.Event;
  try {
    zdarzenie = stripe.webhooks.constructEvent(await req.text(), podpis, sekret);
  } catch {
    return new NextResponse("Zły podpis", { status: 400 });
  }

  try {
    switch (zdarzenie.type) {
      /* BLIK i karta są opłacone od razu. Przelewy24 może przyjść
         z opóźnieniem: wtedy completed ma status "unpaid", a pieniądze
         potwierdza async_payment_succeeded. */
      case "checkout.session.completed": {
        const s = zdarzenie.data.object;
        if (s.payment_status === "paid") await potwierdz(s);
        break;
      }
      case "checkout.session.async_payment_succeeded":
        await potwierdz(zdarzenie.data.object);
        break;
      case "checkout.session.async_payment_failed":
        await nieudana(zdarzenie.data.object);
        break;
    }
  } catch (e) {
    /* Kod 500 sprawia, że Stripe ponowi zdarzenie, więc mail nie zginie. */
    console.error("[stripe/webhook]", e);
    return new NextResponse("Błąd obsługi", { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/* ─────────────────────────────────────────────────────── OBSŁUGA */

function daneKlienta(s: Stripe.Checkout.Session) {
  /* Pole „Imię i nazwisko" ze strony płatności (custom_fields), potem
     imię z formularza /zamowienie, na końcu nazwa z karty. */
  const zPola = s.custom_fields?.find((f) => f.key === "imie_nazwisko")?.text?.value?.trim();
  const imieNazwisko = zPola || s.metadata?.imie || s.customer_details?.name || "";
  return {
    numer: s.client_reference_id ?? s.id,
    email: s.customer_details?.email ?? s.customer_email ?? undefined,
    imieNazwisko,
    /* Do powitania w mailu do klienta wystarczy samo imię. */
    imie: imieNazwisko.split(/\s+/)[0] ?? "",
    telefon: s.customer_details?.phone || s.metadata?.telefon || "",
  };
}

async function potwierdz(s: Stripe.Checkout.Session) {
  const p = znajdzProdukt(s.metadata?.produkt);
  const k = daneKlienta(s);
  if (!p) {
    console.error("[stripe/webhook] nieznany produkt", s.metadata?.produkt, s.id);
    return;
  }

  const kwota = cena(s.amount_total ?? p.cenaGrosze);

  if (k.email) {
    await wyslijMail({
      do: k.email,
      temat: `Potwierdzenie zamówienia ${k.numer} · ${p.nazwa}`,
      tresc: mailDoKlienta(p, k.numer, kwota, k.imie),
      odpowiedzDo: process.env.MAIL_TRENERA,
    });
  }

  const trener = process.env.MAIL_TRENERA;
  if (trener) {
    const platnosc = typeof s.payment_intent === "string" ? s.payment_intent : "";
    await wyslijMail({
      do: trener,
      temat: `Nowe zamówienie: ${k.imieNazwisko || "klient"} · ${p.nazwa} · ${kwota}`,
      tresc: mailDoTrenera(p, { ...k, kwota, panel: `https://dashboard.stripe.com/${s.livemode ? "" : "test/"}payments/${platnosc}` }),
    });
  }
}

async function nieudana(s: Stripe.Checkout.Session) {
  const p = znajdzProdukt(s.metadata?.produkt);
  const k = daneKlienta(s);
  if (k.email) {
    await wyslijMail({
      do: k.email,
      temat: `Płatność nie doszła · zamówienie ${k.numer}`,
      tresc: mailNieudana(p, k.imie),
    });
  }
}