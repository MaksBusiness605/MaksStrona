// PLIK: app/lib/szablon-potwierdzenia.ts · MAILE · wygląd maila z potwierdzeniem zakupu (HTML)

import { FIRMA } from "@/app/tresc/firma";
import type { Krok, Potwierdzenie } from "./maile";
import { KOLOR, esc, stopka } from "./wyslij-mail";

/* ═══════════════════════════════════════════════════════════════════════
   SZABLON MAILA Z POTWIERDZENIEM

   Tu jest tylko WYGLĄD. Teksty są w app/lib/maile.ts (funkcja
   potwierdzenie), osobno dla każdego produktu.

   Maile to nie strona WWW: Gmail, Outlook i Apple Mail obsługują tylko
   część CSS. Dlatego układ stoi na tabelach, style są wpisane w każdy
   element, a przyciski to komórki tabeli z tłem. Tak wygląda to samo
   w Gmailu na telefonie i w Outlooku na komputerze.

   Podgląd bez płacenia (npm run dev):
     http://localhost:3000/api/dev/podglad-maila?produkt=stacjonarny-1
   ═══════════════════════════════════════════════════════════════════════ */

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const JASNY_TEKST = "#c3c8cf";
const LINIA = "#e2e5ea";

/** Przycisk, który działa też w Outlooku (komórka tabeli z tłem). */
function przycisk(etykieta: string, url: string, wariant: "pelny" | "obrys" = "pelny"): string {
  const pelny = wariant === "pelny";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px">
  <tr><td bgcolor="${pelny ? KOLOR.sygnal : "#ffffff"}" style="background:${pelny ? KOLOR.sygnal : "#ffffff"};border:2px solid ${pelny ? KOLOR.sygnal : KOLOR.grafit}">
    <a href="${esc(url)}" target="_blank" style="display:inline-block;padding:13px 22px;font-family:${FONT};font-size:15px;font-weight:700;color:${KOLOR.grafit};text-decoration:none">${esc(etykieta)}&nbsp;&rarr;</a>
  </td></tr>
</table>`;
}

/** Mała etykieta nad sekcją, jak „eyebrow” na stronie. */
function etykieta(tekst: string, kolor: string = KOLOR.stal): string {
  return `<p style="margin:0 0 14px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${kolor}">${esc(tekst)}</p>`;
}

/** Kółko z numerem kroku: zrobiony (limonka z ptaszkiem), następny
    do zrobienia (grafit) albo późniejszy (szary obrys). */
function znacznik(k: Krok, nr: number, pierwszyNiezrobiony: boolean): string {
  const [tlo, kolor, ramka, znak] = k.zrobione
    ? [KOLOR.sygnal, KOLOR.grafit, KOLOR.sygnal, "&#10003;"]
    : pierwszyNiezrobiony
      ? [KOLOR.grafit, "#ffffff", KOLOR.grafit, String(nr)]
      : ["#ffffff", KOLOR.stal, LINIA, String(nr)];
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
  <td width="30" height="30" align="center" valign="middle" bgcolor="${tlo}" style="width:30px;height:30px;background:${tlo};border:2px solid ${ramka};border-radius:50%;font-family:${FONT};font-size:13px;font-weight:700;color:${kolor};line-height:30px">${znak}</td>
</tr></table>`;
}

function kroki(lista: Krok[]): string {
  const pierwszy = lista.findIndex((k) => !k.zrobione);
  return lista
    .map((k, i) => {
      const ostatni = i === lista.length - 1;
      return `<tr>
  <td width="34" valign="top" style="width:34px;padding:0 14px 0 0">
    ${znacznik(k, i + 1, i === pierwszy)}
    ${ostatni ? "" : `<table role="presentation" cellpadding="0" cellspacing="0" width="34"><tr><td align="center" style="padding:4px 0"><div style="width:2px;height:28px;background:${LINIA};margin:0 auto"></div></td></tr></table>`}
  </td>
  <td valign="top" style="padding:4px 0 ${ostatni ? 0 : 18}px">
    <p style="margin:0;font-family:${FONT};font-size:16px;font-weight:700;color:${k.zrobione ? KOLOR.stal : KOLOR.grafit};line-height:1.35">${esc(k.tytul)}</p>
    <p style="margin:6px 0 0;font-family:${FONT};font-size:14px;line-height:1.6;color:${KOLOR.stal}">${esc(k.opis)}</p>
    ${k.przycisk ? przycisk(k.przycisk.etykieta, k.przycisk.url) : ""}
  </td>
</tr>`;
    })
    .join("");
}

export function htmlPotwierdzenia(t: Potwierdzenie, temat: string): string {
  const numer = t.zamowienie.find((z) => z.etykieta === "Numer zamówienia")?.wartosc ?? "";
  const telefonHref = FIRMA.trener.telefonHref;

  const wierszeZamowienia = t.zamowienie
    .map(
      (z, i) => `<tr>
  <td style="padding:12px 0;${i ? `border-top:1px solid ${LINIA};` : ""}font-family:${FONT};font-size:14px;color:${KOLOR.stal}">${esc(z.etykieta)}</td>
  <td align="right" style="padding:12px 0;${i ? `border-top:1px solid ${LINIA};` : ""}font-family:${FONT};font-size:${z.etykieta === "Kwota" ? 18 : 15}px;font-weight:700;color:${KOLOR.grafit}">${esc(z.wartosc)}</td>
</tr>`,
    )
    .join("");

  const wskazowki = t.wskazowki
    ? `<tr><td class="px" style="padding:0 32px 32px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${KOLOR.mgla}" style="background:${KOLOR.mgla};border-left:4px solid ${KOLOR.sygnal}">
    <tr><td style="padding:20px 22px">
      ${etykieta(t.wskazowki.tytul)}
      ${t.wskazowki.linie
        .map(
          (l) =>
            `<p style="margin:0 0 8px;font-family:${FONT};font-size:14px;line-height:1.6;color:${KOLOR.grafit}">&ndash;&nbsp; ${esc(l)}</p>`,
        )
        .join("")}
    </td></tr>
  </table>
</td></tr>`
    : "";

  const gwarancje = t.gwarancje
    .map(
      (g) => `<tr>
  <td width="22" valign="top" style="width:22px;padding:3px 10px 10px 0;font-family:${FONT};font-size:13px;font-weight:700;color:${KOLOR.grafit}"><span style="display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;background:${KOLOR.sygnal}">&#10003;</span></td>
  <td valign="top" style="padding:0 0 10px;font-family:${FONT};font-size:14px;line-height:1.6;color:${KOLOR.stal}">${esc(g)}</td>
</tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="pl" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(temat)}</title>
<style>
  @media (max-width:600px){
    .px{padding-left:22px!important;padding-right:22px!important}
    .h1{font-size:26px!important}
  }
  a{color:${KOLOR.grafit}}
</style>
</head>
<body style="margin:0;padding:0;background:${KOLOR.mgla}">
  <!-- Zajawka: tekst obok tematu w skrzynce, niewidoczny w treści. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${KOLOR.mgla}">${esc(t.zajawka)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${KOLOR.mgla}" style="background:${KOLOR.mgla}">
    <tr><td align="center" style="padding:24px 12px 40px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">

        <!-- PASEK Z MARKĄ -->
        <tr><td bgcolor="${KOLOR.grafit}" class="px" style="background:${KOLOR.grafit};padding:22px 32px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-family:${FONT}">
              <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:${KOLOR.sygnal};color:${KOLOR.grafit};font-weight:800;font-size:13px;vertical-align:middle">&uarr;</span>
              <span style="margin-left:10px;color:#ffffff;font-size:16px;font-weight:800;vertical-align:middle">${esc(FIRMA.marka)}</span>
            </td>
            <td align="right" style="font-family:${FONT};font-size:12px;color:${JASNY_TEKST}">${esc(numer)}</td>
          </tr></table>
        </td></tr>

        <!-- NAGŁÓWEK -->
        <tr><td bgcolor="${KOLOR.grafit}" class="px" style="background:${KOLOR.grafit};padding:20px 32px 36px;border-bottom:4px solid ${KOLOR.sygnal}">
          ${etykieta("Płatność przyjęta", KOLOR.sygnal)}
          <h1 class="h1" style="margin:0;font-family:${FONT};font-size:30px;line-height:1.2;font-weight:800;color:#ffffff">${esc(t.naglowek)}</h1>
          <p style="margin:14px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${JASNY_TEKST}">${esc(t.wstep)}</p>
        </td></tr>

        <!-- TREŚĆ -->
        <tr><td bgcolor="#ffffff" style="background:#ffffff">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

            <!-- Zamówienie -->
            <tr><td class="px" style="padding:30px 32px 8px">
              ${etykieta("Twoje zamówienie")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${wierszeZamowienia}</table>
            </td></tr>

            <tr><td class="px" style="padding:22px 32px 0"><div style="height:1px;background:${LINIA}"></div></td></tr>

            <!-- Co dalej -->
            <tr><td class="px" style="padding:28px 32px 32px">
              ${etykieta("Co dalej")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${kroki(t.kroki)}</table>
            </td></tr>

            ${wskazowki}

            <!-- Spokojnie -->
            <tr><td class="px" style="padding:0 32px 28px">
              ${etykieta("Spokojnie")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${gwarancje}</table>
              ${t.linkDodatkowy ? przycisk(t.linkDodatkowy.etykieta, t.linkDodatkowy.url, "obrys") : ""}
            </td></tr>

            <!-- Kontakt -->
            <tr><td class="px" style="padding:0 32px 34px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINIA}"><tr><td style="padding-top:26px">
                <p style="margin:0;font-family:${FONT};font-size:16px;font-weight:700;color:${KOLOR.grafit}">Masz pytanie?</p>
                <p style="margin:6px 0 0;font-family:${FONT};font-size:14px;line-height:1.6;color:${KOLOR.stal}">Zadzwoń albo po prostu odpisz na tego maila. Odpowiadam osobiście.</p>
                ${przycisk(`Zadzwoń: ${FIRMA.trener.telefon}`, telefonHref, "obrys")}
                <p style="margin:26px 0 0;font-family:${FONT};font-size:15px;line-height:1.5;color:${KOLOR.grafit}">Do usłyszenia,<br><strong>${esc(FIRMA.trener.imie)}</strong><br><span style="font-size:13px;color:${KOLOR.stal}">trener personalny, ${esc(FIRMA.marka)}</span></p>
              </td></tr></table>
            </td></tr>

          </table>
        </td></tr>

        <!-- STOPKA -->
        <tr><td class="px" style="padding:22px 32px 0;font-family:${FONT};font-size:12px;line-height:1.7;color:${KOLOR.stal}">
          ${stopka()}
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}