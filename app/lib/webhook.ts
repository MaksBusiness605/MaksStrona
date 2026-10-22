// PLIK: app/lib/webhook.ts · STRIPE · potwierdzenie płatności i wysyłka maili (wołane z app/api/stripe/webhook/route.ts)
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "./klient";
import { mailDoKlienta, mailDoTrenera, mailNieudana, potwierdzenie, smsDoKlienta, smsDoTrenera, smsNieudana } from "./maile";
import { htmlPotwierdzenia } from "./szablon-potwierdzenia";
import { linkDoEbooka, maEbooka } from "./ebook";
import { FIRMA } from "@/app/tresc/firma";
import { wyslijSms } from "./wyslij-sms";
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
         potwierdza async_payment_succeeded. Kod nagrody (0 zł) kończy się
         statusem "no_payment_required". */
      case "checkout.session.completed": {
        const s = zdarzenie.data.object;
        if (s.payment_status === "paid" || s.payment_status === "no_payment_required") await potwierdz(s);
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

/* ─────────────────────────────────────────────────────── BEZ DUBLI
   Stripe może wysłać to samo zdarzenie kilka razy (ponowienie po błędzie,
   timeout). Żeby klient nie dostał dwóch maili i dwóch SMS-ów, zapisujemy
   w metadanych płatności, co już wyszło: pole `powiadomienia`, np.
   "mail_trener,mail_klient,sms_klient". Bez bazy danych, w samym Stripe.

   Płatność jednorazowa → metadane PaymentIntent.
   Prowadzenie (subskrypcja) → metadane Subscription.
   ─────────────────────────────────────────────────────────────────── */

type Krok = "mail_trener" | "mail_klient" | "sms_klient" | "sms_trener";

function celMetadanych(s: Stripe.Checkout.Session) {
  const pi = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id;
  const sub = typeof s.subscription === "string" ? s.subscription : s.subscription?.id;
  if (pi) return { typ: "pi" as const, id: pi };
  if (sub) return { typ: "sub" as const, id: sub };
  return undefined;
}

async function wykonaneKroki(s: Stripe.Checkout.Session): Promise<Set<Krok>> {
  const cel = celMetadanych(s);
  if (!stripe || !cel) return new Set();
  const obj =
    cel.typ === "pi" ? await stripe.paymentIntents.retrieve(cel.id) : await stripe.subscriptions.retrieve(cel.id);
  return new Set((obj.metadata?.powiadomienia ?? "").split(",").filter(Boolean) as Krok[]);
}

async function zapiszKroki(s: Stripe.Checkout.Session, kroki: Set<Krok>) {
  const cel = celMetadanych(s);
  if (!stripe || !cel || kroki.size === 0) return;
  const metadata = { powiadomienia: [...kroki].join(",") };
  if (cel.typ === "pi") await stripe.paymentIntents.update(cel.id, { metadata });
  else await stripe.subscriptions.update(cel.id, { metadata });
}

async function potwierdz(s: Stripe.Checkout.Session) {
  const p = znajdzProdukt(s.metadata?.produkt);
  const k = daneKlienta(s);
  if (!p) {
    console.error("[stripe/webhook] nieznany produkt", s.metadata?.produkt, s.id);
    return;
  }

  const kwota = cena(s.amount_total ?? p.cenaGrosze);
  const zrobione = await wykonaneKroki(s);
  const bledy: unknown[] = [];

  /** Każdy krok osobno: błąd jednego nie zatrzymuje pozostałych. */
  async function krok(nazwa: Krok, akcja: () => Promise<boolean | void>) {
    if (zrobione.has(nazwa)) return;
    try {
      const wynik = await akcja();
      if (wynik !== false) zrobione.add(nazwa);
    } catch (e) {
      console.error(`[stripe/webhook] ${nazwa} nie wyszedł:`, e);
      bledy.push(e);
    }
  }

  /* 1 · Ty dostajesz informację pierwszy: to od niej zależy telefon w 24 h. */
  /* Powiadomienie o zamówieniu: wyłącznie na adres z app/tresc/firma.ts. */
  const trener = FIRMA.trener.email;
  if (trener) {
    const platnosc = celMetadanych(s);
    const panel = `https://dashboard.stripe.com/${s.livemode ? "" : "test/"}${
      platnosc?.typ === "sub" ? "subscriptions" : "payments"
    }/${platnosc?.id ?? ""}`;
    await krok("mail_trener", () =>
      wyslijMail({
        do: trener,
        temat: `${s.total_details?.amount_discount ? "Zamówienie z kodem" : "Nowe zamówienie"}: ${k.imieNazwisko || "klient"} · ${p.nazwa} · ${kwota}`,
        tresc: mailDoTrenera(p, { ...k, kwota, panel, rabat: s.total_details?.amount_discount ? cena(s.total_details.amount_discount) : undefined }),
        odpowiedzDo: k.email,
      }),
    );
  }

  /* 2 · Mail do klienta. */
  if (k.email) {
    const temat = `Potwierdzenie zamówienia ${k.numer} · ${p.nazwa}`;
    /* E-book, plan i prowadzenie: link do pobrania e-booka w mailu. */
    const ebook = maEbooka(p) ? linkDoEbooka(s.id) : undefined;
    await krok("mail_klient", () =>
      wyslijMail({
        do: k.email!,
        temat,
        tresc: mailDoKlienta(p, k.numer, kwota, k.imie, ebook),
        html: htmlPotwierdzenia(potwierdzenie(p, k.numer, kwota, k.imie, ebook), temat),
        odpowiedzDo: FIRMA.trener.email,
      }),
    );
  }

  /* 3 · SMS-y. wyslijSms nie rzuca błędów: przy braku tokenu albo środków
     zwraca false i krok nie jest odhaczony. */
  await krok("sms_klient", () => wyslijSms(k.telefon, smsDoKlienta(p, k.numer, k.imie, kwota, k.email)));
  const smsTrenera = process.env.SMS_TRENERA;
  if (smsTrenera) {
    await krok("sms_trener", () => wyslijSms(smsTrenera, smsDoTrenera(p, k.imieNazwisko, k.telefon, kwota, k.numer, k.email ?? "")));
  }

  await zapiszKroki(s, zrobione).catch((e) => console.error("[stripe/webhook] zapis metadanych:", e));

  /* Nie wyszedł któryś mail: błąd → kod 500 → Stripe ponowi zdarzenie,
     ale powtórzy tylko to, co się nie udało. */
  if (bledy.length) throw bledy[0];
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
  await wyslijSms(k.telefon, smsNieudana(p));
}