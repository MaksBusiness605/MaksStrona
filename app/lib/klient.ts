import Stripe from "stripe";

/* KLIENT STRIPE. Bez STRIPE_SECRET_KEY jest null: wtedy w trybie
   deweloperskim zakup przechodzi na /dziekujemy w trybie pokazowym,
   a na produkcji płatność zwraca błąd 503 zamiast udawać zakup.

   Klucz testowy zaczyna się od sk_test_, produkcyjny od sk_live_.
   Klucz NIGDY nie trafia do kodu ani do zmiennej z prefiksem NEXT_PUBLIC_. */

const klucz = process.env.STRIPE_SECRET_KEY;

export const stripe = klucz ? new Stripe(klucz) : null;

export const trybPokazowy = !klucz && process.env.NODE_ENV !== "production";