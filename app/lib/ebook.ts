// PLIK: app/lib/ebook.ts · E-BOOK · kto ma dostęp i jaki link dostaje (wołane z webhooka, /dziekujemy i /api/ebook)
import { FIRMA } from "@/app/tresc/firma";
import { stripe, trybPokazowy } from "./klient";
import type { Produkt } from "./produkty";

/* ═══════════════════════════════════════════════════════════════════════
   WYSYŁKA E-BOOKA

   Jak to działa:
   1. PDF leży w folderze `prywatne/` w katalogu głównym projektu, NIE
      w `public/`. Z `public/` każdy mógłby go pobrać po samym adresie.
   2. Kupujący dostaje link /api/ebook?s=<id sesji Stripe>: w mailu,
      na /dziekujemy i w ponownym mailu, jeśli poprosi.
   3. Przy każdym pobraniu serwer pyta Stripe, czy ta sesja jest
      opłacona i czy dotyczy produktu z e-bookiem. Dopiero wtedy wydaje
      plik, z dopiskiem na dole każdej strony: „Kopia dla: e-mail ·
      numer zamówienia”. Kto przekaże plik dalej, przekaże też swój mail.

   E-book dostają też kupujący plan i prowadzenie, bo cennik obiecuje
   im „wszystko z e-booka”.
   ═══════════════════════════════════════════════════════════════════════ */

/** Nazwa pliku w folderze prywatne/. */
export const PLIK_EBOOKA = "Plan-Bez-Zgadywania.pdf";

/** Produkty, które dają dostęp do e-booka. */
const Z_EBOOKIEM = new Set(["ebook", "plan", "prowadzenie"]);

export function maEbooka(p: Pick<Produkt, "id"> | undefined): boolean {
  return !!p && Z_EBOOKIEM.has(p.id);
}

function adresStrony(): string {
  const z = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || FIRMA.strona;
  return z.includes("[") ? "http://localhost:3000" : z.replace(/\/+$/, "");
}

/** Pełny link do pobrania, do maila i na /dziekujemy. */
export function linkDoEbooka(sesjaId: string): string {
  return `${adresStrony()}/api/ebook?s=${encodeURIComponent(sesjaId)}`;
}

export type Dostep = { email: string; numer: string };

/** Sprawdza w Stripe, czy sesja daje prawo do e-booka. null = brak dostępu. */
export async function dostepDoEbooka(sesjaId: string | null): Promise<Dostep | null> {
  if (!sesjaId) return null;

  /* Lokalnie bez klucza Stripe: /api/ebook?s=demo, żeby obejrzeć plik. */
  if (!stripe) return trybPokazowy && sesjaId === "demo" ? { email: "demo@example.com", numer: "MT-DEMO" } : null;

  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sesjaId)) return null;
  try {
    const s = await stripe.checkout.sessions.retrieve(sesjaId);
    const oplacona = s.payment_status === "paid" || s.payment_status === "no_payment_required";
    if (!oplacona || !Z_EBOOKIEM.has(s.metadata?.produkt ?? "")) return null;
    return {
      email: s.customer_details?.email ?? s.customer_email ?? "",
      numer: s.client_reference_id ?? s.id.slice(-8),
    };
  } catch {
    return null;
  }
}