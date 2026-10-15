// PLIK: app/lib/wyslij-mail.ts · MAILE · wysyłka przez Resend, wersja tekstowa i HTML

import { FIRMA } from "@/app/tresc/firma";

/* ═══════════════════════════════════════════════════════════════════════
   WYSYŁKA MAILI przez Resend (resend.com)

   Treść piszesz zwykłym tekstem w app/lib/maile.ts. Ten plik robi z niej
   dwie wersje: tekstową (dla programów pocztowych bez HTML i dla filtrów
   antyspamowych) i HTML w kolorach strony: grafitowy pasek z nazwą,
   klikalne linki, stopka z danymi firmy.

   Zasady formatowania w maile.ts:
   · pusta linia = nowy akapit,
   · linia PISANA WIELKIMI LITERAMI = śródtytuł (np. „DANE KLIENTA”),
   · adresy https://… same stają się linkami.

   Bez RESEND_API_KEY albo MAIL_NADAWCA mail nie wychodzi, tylko trafia
   do logów serwera: zakup działa dalej, a Ty widzisz treść w konsoli.

   BEZ DOMENY: nadawca `onboarding@resend.dev` może wysyłać wyłącznie na
   adres, na który założono konto w Resend. Na każdy inny adres Resend
   zwróci błąd 403.
   ═══════════════════════════════════════════════════════════════════════ */

type Mail = {
  do: string;
  temat: string;
  /** Wersja tekstowa. Zawsze wysyłana obok HTML-u. */
  tresc: string;
  /** Własny HTML (np. szablon-potwierdzenia.ts). Bez niego HTML powstaje
      automatycznie z `tresc`. */
  html?: string;
  odpowiedzDo?: string;
};

export const KOLOR = { grafit: "#14181d", sygnal: "#d2f34c", stal: "#5f6672", mgla: "#edeff2" };

export function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** https://… → klikalny link. Działa na tekście już zabezpieczonym esc(). */
function linki(s: string) {
  return s.replace(
    /(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g,
    `<a href="$1" style="color:${KOLOR.grafit};font-weight:600;text-decoration:underline;word-break:break-all">$1</a>`,
  );
}

/** Etykiety przycisków dla konkretnych linków (np. ankieta). Ustawia je
    maile.ts przez `etykietaLinku`, żeby przycisk mówił, co robi. */
const linkEtykieta = new Map<string, string>();
export function etykietaLinku(url: string, etykieta: string) {
  linkEtykieta.set(url, etykieta);
  return url;
}

/** Tekst z maile.ts → HTML. Kolumny wyrównane spacjami („E-mail:   …”) zostają czytelne. */
export function tekstNaHtml(tresc: string): string {
  const akapity = tresc.trim().split(/\n{2,}/);

  return akapity
    .map((a) => {
      const linie = a.split("\n");
      const pierwsza = linie[0].trim();
      const jestSrodtytul =
        /^[A-ZĄĆĘŁŃÓŚŹŻ0-9 ,:()·-]{4,}$/.test(pierwsza) && pierwsza === pierwsza.toUpperCase();

      const naglowek = jestSrodtytul
        ? `<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.08em;color:${KOLOR.stal}">${esc(pierwsza)}</p>`
        : "";
      const reszta = (jestSrodtytul ? linie.slice(1) : linie)
        .map((l) => {
          const czysta = l.trim();
          /* Linia, która jest samym adresem, staje się przyciskiem. */
          if (/^https?:\/\/\S+$/.test(czysta)) {
            const etykieta = czysta.includes("billing.stripe.com")
              ? "Zarządzaj prowadzeniem"
              : czysta.includes("dashboard.stripe.com")
                ? "Otwórz płatność w Stripe"
                : "Otwórz";
            return `<a href="${esc(czysta)}" style="display:inline-block;margin:6px 0;padding:12px 20px;background:${KOLOR.sygnal};color:${KOLOR.grafit};font-weight:700;font-size:14px;text-decoration:none">${esc(
              linkEtykieta.get(czysta) ?? etykieta,
            )}</a>`;
          }
          return linki(esc(l.replace(/ {2,}/g, " ")));
        })
        .join("<br>");

      return `<div style="margin:0 0 18px">${naglowek}${
        reszta ? `<p style="margin:0;font-size:15px;line-height:1.6;color:${KOLOR.grafit}">${reszta}</p>` : ""
      }</div>`;
    })
    .join("");
}

/** Pole z firma.ts jest uzupełnione, gdy nie jest puste i nie ma
    w sobie „[…]” (szablonu do wypełnienia). */
function wypelnione(s: string): boolean {
  return Boolean(s.trim()) && !s.includes("[");
}

/** Stopka maila: tylko pola uzupełnione w firma.ts, więc w mailu nigdy
    nie pojawi się „NIP [NIP]”. Bez NIP-u (działalność nierejestrowana)
    wpisz w firma.ts nip: "" i ten fragment zniknie sam. */
export function stopka(): string {
  const wiersz1 = [
    wypelnione(FIRMA.nazwa) ? FIRMA.nazwa : FIRMA.wlasciciel,
    wypelnione(FIRMA.adres) ? FIRMA.adres : "",
    wypelnione(FIRMA.nip) ? `NIP ${FIRMA.nip}` : "",
  ].filter(Boolean);
  const wiersz2 = [
    wypelnione(FIRMA.telefon) ? `Telefon: ${FIRMA.telefon}` : "",
    wypelnione(FIRMA.email) ? `E-mail: ${FIRMA.email}` : "",
  ].filter(Boolean);
  return [wiersz1, wiersz2]
    .filter((w) => w.length)
    .map((w) => w.map(esc).join(" &middot; "))
    .join("<br>");
}

/** Pełny HTML maila. Eksportowany, żeby dało się podejrzeć wygląd. */
export function htmlMaila(temat: string, tresc: string): string {
  return `<!doctype html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(temat)}</title></head>
<body style="margin:0;padding:0;background:${KOLOR.mgla};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${KOLOR.mgla};padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
        <tr><td style="background:${KOLOR.grafit};padding:18px 28px;border-bottom:4px solid ${KOLOR.sygnal}">
          <span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;background:${KOLOR.sygnal};color:${KOLOR.grafit};font-weight:700;font-size:12px;vertical-align:middle">&uarr;</span>
          <span style="margin-left:10px;color:#ffffff;font-size:16px;font-weight:800;vertical-align:middle">${esc(FIRMA.marka)}</span>
        </td></tr>
        <tr><td style="padding:28px 28px 10px">${tekstNaHtml(tresc)}</td></tr>
        <tr><td style="padding:18px 28px 24px;border-top:1px solid ${KOLOR.mgla};font-size:12px;line-height:1.6;color:${KOLOR.stal}">
          ${stopka()}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function wyslijMail({ do: odbiorca, temat, tresc, html, odpowiedzDo }: Mail): Promise<void> {
  const klucz = process.env.RESEND_API_KEY;
  const nadawca = process.env.MAIL_NADAWCA;

  if (!klucz || !nadawca) {
    console.log(`[mail · nie wysłano, brak RESEND_API_KEY albo MAIL_NADAWCA]\nDo: ${odbiorca}\nTemat: ${temat}\n\n${tresc}`);
    return;
  }

  const odp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${klucz}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: nadawca,
      to: [odbiorca],
      subject: temat,
      text: tresc,
      html: html ?? htmlMaila(temat, tresc),
      ...(odpowiedzDo ? { reply_to: odpowiedzDo } : {}),
    }),
  });

  if (!odp.ok) {
    const powod = await odp.text();
    /* Najczęstszy błąd bez domeny: wysyłka na inny adres niż konto w Resend. */
    if (odp.status === 403 && nadawca.includes("resend.dev")) {
      console.error(
        `[mail] Resend odrzucił wysyłkę do ${odbiorca}. Bez własnej domeny możesz wysyłać tylko na adres konta w Resend.`,
      );
    }
    /* Rzucamy błąd celowo: webhook odpowie Stripe'owi kodem 500 i Stripe
       ponowi zdarzenie, ale powtórzy tylko kroki, które się nie udały. */
    throw new Error(`Resend ${odp.status}: ${powod}`);
  }
}