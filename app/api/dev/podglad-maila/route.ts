// PLIK: app/api/dev/podglad-maila/route.ts · ADRES /api/dev/podglad-maila · podgląd maila z potwierdzeniem w przeglądarce (tylko lokalnie)

import { NextResponse } from "next/server";
import { mailDoKlienta, potwierdzenie } from "@/app/lib/maile";
import { cena, znajdzProdukt } from "@/app/lib/produkty";
import { htmlPotwierdzenia } from "@/app/lib/szablon-potwierdzenia";

/* ═══════════════════════════════════════════════════════════════════════
   PODGLĄD MAILA · pokazuje w przeglądarce dokładnie ten mail, który
   dostaje klient po zakupie. Nic nie wysyła, nic nie kosztuje.
   Działa TYLKO w `npm run dev`, na produkcji zwraca 404.

     /api/dev/podglad-maila                          online-1, imię Jan
     /api/dev/podglad-maila?produkt=stacjonarny-3
     /api/dev/podglad-maila?produkt=prowadzenie&imie=Marysia
     /api/dev/podglad-maila?produkt=ebook&tekst=1    wersja tekstowa

   Zmieniasz tekst w maile.ts albo wygląd w szablon-potwierdzenia.ts,
   zapisujesz plik i odświeżasz kartę.
   ═══════════════════════════════════════════════════════════════════════ */

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });

  const q = new URL(req.url).searchParams;
  const p = znajdzProdukt(q.get("produkt") ?? "online-1");
  if (!p) return NextResponse.json({ blad: "Nieznany produkt" }, { status: 400 });

  const imie = q.get("imie") ?? "Jan";
  const numer = "MT-PODGLAD";
  const kwota = cena(p.cenaGrosze);

  if (q.get("tekst") === "1") {
    return new NextResponse(mailDoKlienta(p, numer, kwota, imie), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const temat = `Potwierdzenie zamówienia ${numer} · ${p.nazwa}`;
  return new NextResponse(htmlPotwierdzenia(potwierdzenie(p, numer, kwota, imie), temat), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}