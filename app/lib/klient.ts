import Stripe from "stripe";

/* KLIENT STRIPE. Bez STRIPE_SECRET_KEY jest null: wtedy w trybie
   deweloperskim zakup przechodzi na /dziekujemy w trybie pokazowym,
   a na produkcji płatność zwraca błąd 503 zamiast udawać zakup.

   Klucz testowy zaczyna się od sk_test_, produkcyjny od sk_live_.
   Klucz NIGDY nie trafia do kodu ani do zmiennej z prefiksem NEXT_PUBLIC_. */

const klucz = process.env.STRIPE_SECRET_KEY;

/* TYLKO LIVE NA ŻYWEJ STRONIE. Na produkcji (Vercel → Production) klucz
   testowy albo z piaskownicy (sk_test_…, rk_test_…) jest odrzucany:
   strona nie utworzy płatności testowej, nie przyjmie webhooka z
   piaskownicy i nie wyda e-booka z testowego zamówienia. Zamiast tego
   klient widzi „Płatności są chwilowo niedostępne”, a w logach Vercela
   jest błąd z instrukcją. Podglądy (Preview) i `npm run dev` mogą
   używać kluczy testowych. */
const naZywo = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";
export const kluczTestowyNaProdukcji = naZywo && !!klucz && /^(sk|rk)_test_/.test(klucz);
if (kluczTestowyNaProdukcji) {
  console.error(
    "[stripe] STRIPE_SECRET_KEY to klucz testowy/sandbox, a to produkcja. Płatności wyłączone. " +
      "Wpisz w Vercelu klucz sk_live_… i STRIPE_WEBHOOK_SECRET z webhooka live, potem Redeploy.",
  );
}

export const stripe = klucz && !kluczTestowyNaProdukcji ? new Stripe(klucz) : null;

export const trybPokazowy = !klucz && process.env.NODE_ENV !== "production";