// PLIK: app/lib/platnosc.ts · STRIPE · tworzy płatność (wołane z app/api/stripe/platnosc/route.ts)
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, trybPokazowy } from "./klient";
import { noweZamowienie, TELEFON, znajdzProdukt, type Produkt } from "./produkty";
import { czytajZgode } from "./sledzenie";

/* ═══════════════════════════════════════════════════════════════════════
   TWORZENIE PŁATNOŚCI · logika dla /api/stripe/platnosc

   Dwa sposoby wywołania:

   1. LINK (GET), np. z przycisku w cenniku:
        <a href="/api/stripe/platnosc?produkt=online-1">Kup trening</a>
      Działa z <a> i z <Link>: zapytania prefetch są odrzucane niżej.

   2. FORMULARZ (POST), np. z /zamowienie po danych i ankiecie:
        <form method="post" action="/api/stripe/platnosc">
          <input type="hidden" name="produkt" value="plan" />
          <input name="imie" /> <input name="email" type="email" />
          <input name="telefon" type="tel" />
          <button>Przejdź do płatności</button>
        </form>
      Imię i telefon lądują w metadanych płatności, e-mail od razu
      wypełnia się na stronie Stripe.

   KODY PROMOCYJNE: na stronie płatności Stripe jest pole „Dodaj kod
   promocyjny” (allow_promotion_codes). Kody z konkursu tworzy skrypt
   scripts/kody-konkurs.mjs: każdy działa raz, odejmuje 140 zł i działa
   tylko przy zamówieniu od 420 zł (pakiet 3 albo 5 sesji na sali).

   Metody płatności (BLIK, karta, Przelewy24, Google Pay, Apple Pay)
   włączasz w panelu Stripe: Settings → Payments → Payment methods.
   Kod ich nie wymienia, Stripe pokazuje te, które pasują do PLN i Polski.
   ═══════════════════════════════════════════════════════════════════════ */

type Dane = { produkt: unknown; email?: string; imie?: string; telefon?: string };

const przytnij = (v: FormDataEntryValue | null, max: number) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

/** Next.js pobiera adresy z <Link> z wyprzedzeniem (prefetch). Takie
    zapytanie nie może tworzyć płatności, więc dostaje pustą odpowiedź.
    Dzięki temu przyciski w komponentach mogą używać i <a>, i <Link>. */
function toPrefetch(req: Request): boolean {
  const h = req.headers;
  return (
    h.has("next-router-prefetch") ||
    h.get("rsc") === "1" ||
    h.get("purpose") === "prefetch" ||
    h.get("sec-purpose")?.includes("prefetch") === true
  );
}

/** GET /api/stripe/platnosc?produkt=… */
export async function platnoscZLinku(req: Request) {
  if (toPrefetch(req)) return new NextResponse(null, { status: 204 });
  return utworzPlatnosc(req, { produkt: new URL(req.url).searchParams.get("produkt") });
}

/** POST /api/stripe/platnosc z formularza. */
export async function platnoscZFormularza(req: Request) {
  const f = await req.formData();
  const email = przytnij(f.get("email"), 200);
  return utworzPlatnosc(req, {
    produkt: f.get("produkt"),
    email: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
    imie: przytnij(f.get("imie"), 100),
    telefon: przytnij(f.get("telefon"), 30),
  });
}

/** Zgoda wyświetlana przy checkboksie regulaminu na stronie płatności. */
function tekstZgody(p: Produkt, regulamin: string): string {
  const link = `[regulamin](${regulamin})`;
  if (p.rodzaj === "ebook") {
    return `Akceptuję ${link}. Proszę o dostarczenie e-booka od razu, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że z chwilą rozpoczęcia dostarczenia tracę prawo odstąpienia od umowy.`;
  }
  return `Akceptuję ${link} i żądam rozpoczęcia usługi przed upływem 14 dni na odstąpienie od umowy. Przyjmuję do wiadomości, że po pełnym wykonaniu usługi tracę prawo odstąpienia, a przy odstąpieniu wcześniej płacę za część już wykonaną.`;
}

async function utworzPlatnosc(req: Request, dane: Dane) {
  /* SITE_URL: adres strony bez ukośnika na końcu, np. https://www.trenerlodz.pl.
     Stąd Stripe bierze adres powrotu (/dziekujemy i strona produktu).
     Bez niej: adres, z którego klient przyszedł. NEXT_PUBLIC_SITE_URL
     zostaje dla zgodności ze starszymi ustawieniami. */
  const origin = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/+$/, "");
  const p = znajdzProdukt(dane.produkt);

  if (!p) return NextResponse.redirect(`${origin}/`, 303);

  if (!stripe) {
    if (trybPokazowy) {
      return NextResponse.redirect(`${origin}/dziekujemy?produkt=${p.id}&demo=1`, 303);
    }
    return new NextResponse(`Płatności są chwilowo niedostępne. Zadzwoń: ${TELEFON}.`, { status: 503 });
  }

  const numer = noweZamowienie();

  /* Zgoda z banera cookies i dane dla Meta Conversions API. Zapisujemy
     je tylko przy zgodzie na marketing: wtedy po zakupie serwer może
     wysłać zakup do Mety (app/lib/meta-capi.ts). Bez zgody nic z tego
     nie trafia do metadanych. */
  const ciasteczka = req.headers.get("cookie");
  const zgoda = czytajZgode(ciasteczka);
  const ciastko = (nazwa: string) =>
    ciasteczka?.split(/;\s*/).find((c) => c.startsWith(`${nazwa}=`))?.slice(nazwa.length + 1);
  const meta = zgoda?.m
    ? {
        zgoda_m: "1",
        fbp: ciastko("_fbp"),
        fbc: ciastko("_fbc"),
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        ua: req.headers.get("user-agent")?.slice(0, 400),
        url: req.headers.get("referer")?.split("?")[0]?.slice(0, 400),
      }
    : {};

  /* Stripe nie przyjmuje pustych wartości w metadanych, więc puste pola
     odpadają. Limit to 500 znaków na wartość. */
  const metadata: Record<string, string> = Object.fromEntries(
    Object.entries({ produkt: p.id, numer, imie: dane.imie, telefon: dane.telefon, ...meta }).filter(
      (e): e is [string, string] => typeof e[1] === "string" && e[1].length > 0,
    ),
  );

  const regulamin = process.env.REGULAMIN_URL;

  const wspolne: Stripe.Checkout.SessionCreateParams = {
    locale: "pl",
    /* Pole „Dodaj kod promocyjny” na stronie płatności (kody z konkursu). */
    allow_promotion_codes: true,
    client_reference_id: numer,
    metadata,
    customer_email: dane.email,
    /* Telefon zbieramy przy każdym produkcie, także przy e-booku, bo
       trafia do maila do trenera. Stripe robi z niego pole obowiązkowe. */
    phone_number_collection: { enabled: true },
    /* Imię i nazwisko: osobne pole, bo przy BLIK-u Stripe nie pyta
       o nazwisko (przy karcie pyta tylko o właściciela karty). */
    custom_fields: [
      {
        key: "imie_nazwisko",
        label: { type: "custom", custom: "Imię i nazwisko" },
        type: "text",
        text: { minimum_length: 3, maximum_length: 80 },
      },
    ],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "pln",
          unit_amount: p.cenaGrosze,
          product_data: { name: p.nazwa, description: p.opis },
          ...(p.cykliczny ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    success_url: `${origin}/dziekujemy?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${p.strona}#oferty`,
    /* Checkbox regulaminu. Działa dopiero, gdy w panelu Stripe
       (Settings → Public details) wpiszesz adres regulaminu. Bez
       REGULAMIN_URL pomijamy go, żeby testowa płatność nie padła. */
    ...(regulamin
      ? {
          consent_collection: { terms_of_service: "required" as const },
          custom_text: { terms_of_service_acceptance: { message: tekstZgody(p, regulamin) } },
        }
      : {}),
  };

  const parametry: Stripe.Checkout.SessionCreateParams = p.cykliczny
    ? { ...wspolne, mode: "subscription", subscription_data: { metadata } }
    : { ...wspolne, mode: "payment", payment_intent_data: { metadata } };

  try {
    const sesja = await stripe.checkout.sessions.create(parametry);
    if (!sesja.url) throw new Error("Stripe nie zwrócił adresu płatności");
    return NextResponse.redirect(sesja.url, 303);
  } catch (e) {
    console.error("[stripe/platnosc]", e);
    return new NextResponse(`Nie udało się otworzyć płatności. Spróbuj za chwilę albo zadzwoń: ${TELEFON}.`, {
      status: 502,
    });
  }
}