// PLIK: scripts/kod-testowy.mjs · tworzy w Stripe JEDEN kod -100% do testu zakupu
//
// URUCHOMIENIE (PowerShell, w folderze projektu):
//   node scripts/kod-testowy.mjs
//   node scripts/kod-testowy.mjs --produkt stacjonarny-1    (inny produkt w linku)
//
// Kod: 100% rabatu, działa RAZ i wygasa po 48 godzinach. Wpisujesz go na
// stronie płatności Stripe w polu „Dodaj kod promocyjny”. Zamówienie
// kosztuje 0 zł, a strona robi wszystko jak przy prawdziwym zakupie:
// mail, SMS, strona z podziękowaniem, link do e-booka albo ankiety.
//
// KLUCZ: STRIPE_SECRET_KEY z .env.local albo z terminala, np.:
//   $env:STRIPE_SECRET_KEY="rk_live_..."; node scripts/kod-testowy.mjs
//
// NIE używaj na „prowadzenie” (płatność co miesiąc): pierwszy miesiąc
// będzie za 0 zł, ale kolejny Stripe pobierze normalnie.

import { randomInt } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const WERSJA_API = "2024-06-20";
const STRONA = "https://www.trenerlodz.pl";
const KUPON = "TEST-100";
const ZNAKI = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const i = process.argv.indexOf("--produkt");
const produkt = i > -1 && process.argv[i + 1] ? process.argv[i + 1] : "ebook";
if (produkt === "prowadzenie") {
  console.error("Na „prowadzenie” kodu testowego nie robię: za miesiąc Stripe pobrałby normalną opłatę.");
  process.exit(1);
}

function kluczZEnvLocal() {
  if (!existsSync(".env.local")) return undefined;
  const linia = readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith("STRIPE_SECRET_KEY="));
  return linia?.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
}

const klucz = (process.env.STRIPE_SECRET_KEY || kluczZEnvLocal() || "").trim();
if (!/^(sk|rk)_(test|live)_/.test(klucz)) {
  console.error("Brak klucza Stripe. Ustaw STRIPE_SECRET_KEY w .env.local albo w terminalu (sk_… albo rk_…).");
  process.exit(1);
}

async function stripe(metoda, sciezka, pola) {
  const body = pola ? new URLSearchParams(Object.entries(pola).filter(([, v]) => v !== undefined)) : undefined;
  const odp = await fetch(`https://api.stripe.com/v1/${sciezka}`, {
    method: metoda,
    headers: {
      Authorization: `Bearer ${klucz}`,
      "Stripe-Version": WERSJA_API,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body,
  });
  return { status: odp.status, json: await odp.json() };
}

/* 1 · Kupon -100%, tworzony raz. */
const kupon = await stripe("GET", `coupons/${KUPON}`);
if (kupon.status === 404) {
  const nowy = await stripe("POST", "coupons", {
    id: KUPON,
    name: "Test zakupu: -100%",
    percent_off: "100",
    duration: "once",
  });
  if (nowy.status >= 300) {
    console.error("Nie udało się utworzyć kuponu:", nowy.json.error?.message);
    process.exit(1);
  }
} else if (kupon.status >= 300) {
  console.error("Błąd Stripe:", kupon.json.error?.message);
  process.exit(1);
}

/* 2 · Jeden kod: 1 użycie, ważny 48 h. */
const kod = `TEST-${Array.from({ length: 6 }, () => ZNAKI[randomInt(ZNAKI.length)]).join("")}`;
const r = await stripe("POST", "promotion_codes", {
  coupon: KUPON,
  code: kod,
  max_redemptions: "1",
  expires_at: String(Math.floor(Date.now() / 1000) + 48 * 3600),
  "metadata[zrodlo]": "test",
});
if (r.status >= 300) {
  console.error("Nie udało się utworzyć kodu:", r.json.error?.message);
  process.exit(1);
}

console.log(`
Kod testowy: ${kod}
(działa raz, wygasa za 48 h, ${klucz.includes("_live_") ? "na żywej stronie" : "TYLKO w trybie testowym Stripe"})

1. Otwórz: ${STRONA}/api/stripe/platnosc?produkt=${produkt}
2. Na stronie Stripe kliknij „Dodaj kod promocyjny” i wpisz: ${kod}
3. Kwota spadnie do 0 zł. Dokończ zamówienie.
`);
