// PLIK: app/api/ebook/route.ts · ADRES /api/ebook?s=<sesja> · pobranie e-booka po zakupie, z dopiskiem kupującego
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PLIK_EBOOKA, dostepDoEbooka } from "@/app/lib/ebook";
import { doGsm } from "@/app/lib/maile";
import { TELEFON } from "@/app/lib/produkty";

/* ═══════════════════════════════════════════════════════════════════════
   POBRANIE E-BOOKA

   1. Sprawdza w Stripe, czy sesja z linku jest opłacona (app/lib/ebook.ts).
   2. Czyta PDF z prywatne/Plan-Bez-Zgadywania.pdf.
   3. Dopisuje na dole każdej strony „Kopia dla: <e-mail> · <numer>”.
   4. Oddaje plik. Na telefonie otwiera się w przeglądarce, skąd da się
      go zapisać. ?pobierz=1 wymusza zapis zamiast podglądu.

   Na Vercelu plik musi trafić do funkcji: next.config, klucz
   outputFileTracingIncludes (opis w odpowiedzi w czacie).
   ═══════════════════════════════════════════════════════════════════════ */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function strona(tytul: string, tresc: string, status: number) {
  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${tytul}</title></head>
<body style="margin:0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#edeff2;color:#14181d">
<div style="max-width:520px;margin:12vh auto;padding:32px 28px;background:#fff;border-top:4px solid #d2f34c">
<h1 style="margin:0 0 12px;font-size:22px">${tytul}</h1><p style="margin:0;line-height:1.6;color:#5f6672">${tresc}</p></div></body></html>`;
  return new NextResponse(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const dostep = await dostepDoEbooka(q.get("s"));

  if (!dostep) {
    return strona(
      "Nie widzę tego zamówienia",
      `Link jest niepełny albo płatność nie została jeszcze potwierdzona. Otwórz link prosto z maila z potwierdzeniem. Jeśli dalej nie działa, zadzwoń: <strong>${TELEFON}</strong>.`,
      403,
    );
  }

  let pdf: Uint8Array;
  try {
    pdf = await readFile(path.join(process.cwd(), "prywatne", PLIK_EBOOKA));
  } catch (e) {
    console.error("[ebook] brak pliku prywatne/" + PLIK_EBOOKA, e);
    return strona(
      "E-book chwilowo niedostępny",
      `Plik jest właśnie aktualizowany. Wyślę Ci go mailem, a jeśli się spieszysz, zadzwoń: <strong>${TELEFON}</strong>.`,
      503,
    );
  }

  /* Dopisek na dole każdej strony, między nazwą e-booka a numerem strony.
     Czcionka standardowa (bez polskich liter), dlatego doGsm. */
  const doc = await PDFDocument.load(pdf);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const tekst = doGsm(`Kopia dla: ${dostep.email || "kupujacego"} · ${dostep.numer}`).slice(0, 90);
  const rozmiar = 6;
  for (const s of doc.getPages()) {
    const { width } = s.getSize();
    const w = font.widthOfTextAtSize(tekst, rozmiar);
    s.drawText(tekst, { x: (width - w) / 2, y: 27.5, size: rozmiar, font, color: rgb(0.55, 0.58, 0.62) });
  }
  doc.setSubject(`Kopia dla: ${dostep.email} · ${dostep.numer}`);
  const wynik = await doc.save();

  console.log(`[ebook] pobranie: ${dostep.numer} (${dostep.email})`);
  const tryb = q.get("pobierz") === "1" ? "attachment" : "inline";
  return new NextResponse(Buffer.from(wynik), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${tryb}; filename="${PLIK_EBOOKA}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}