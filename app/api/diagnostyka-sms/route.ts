// PLIK: app/api/diagnostyka-sms/route.ts · ADRES /api/diagnostyka-sms · sprawdza ustawienia Twilio na Vercelu (TYMCZASOWY, usuń po naprawie)

import { NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════════════════════
   DIAGNOSTYKA SMS · otwierasz w przeglądarce:
     https://maks-strona.vercel.app/api/diagnostyka-sms

   Pokazuje:
   · który commit działa na Vercelu (czy nowy kod wszedł),
   · czy Vercel widzi zmienne Twilio (tylko długość i końcówki, nigdy
     całe wartości),
   · czy Twilio przyjmuje Auth Token i klucz API (zapytanie o dane konta,
     NIE wysyła SMS-a i nic nie kosztuje).

   Gdy SMS-y zaczną działać, USUŃ cały folder app/api/diagnostyka-sms.
   ═══════════════════════════════════════════════════════════════════════ */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function czysta(nazwa: string): string | undefined {
  const w = process.env[nazwa]?.trim().replace(/^["']|["']$/g, "").trim();
  return w || undefined;
}

function opis(w: string | undefined, jawna = false): string {
  if (!w) return "BRAK (Vercel nie widzi tej zmiennej)";
  if (jawna) return w;
  return `${w.length} zn. (${w.slice(0, 4)}…${w.slice(-3)})`;
}

async function sprawdzLogowanie(sid: string, login: string, haslo: string) {
  try {
    const odp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}.json`, {
      headers: { Authorization: `Basic ${Buffer.from(`${login}:${haslo}`).toString("base64")}` },
      signal: AbortSignal.timeout(8000),
    });
    const dane = (await odp.json().catch(() => ({}))) as {
      status?: string;
      type?: string;
      friendly_name?: string;
      code?: number;
      message?: string;
    };
    return odp.ok
      ? { wynik: "OK, Twilio przyjmuje", konto: dane.friendly_name, status_konta: dane.status, typ_konta: dane.type }
      : { wynik: `ODRZUCONE (HTTP ${odp.status})`, kod: dane.code, komunikat: dane.message };
  } catch (e) {
    return { wynik: "brak połączenia z Twilio", blad: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET() {
  const sid = czysta("TWILIO_ACCOUNT_SID");
  const token = czysta("TWILIO_AUTH_TOKEN");
  const klucz = czysta("TWILIO_API_KEY");
  const sekret = czysta("TWILIO_API_SECRET");

  return NextResponse.json(
    {
      wdrozenie: {
        commit: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "nieznany",
        sha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "nieznany",
        srodowisko: process.env.VERCEL_ENV ?? "lokalnie",
      },
      zmienne: {
        TWILIO_ACCOUNT_SID: opis(sid),
        TWILIO_AUTH_TOKEN: opis(token),
        TWILIO_API_KEY: opis(klucz),
        TWILIO_API_SECRET: opis(sekret),
        TWILIO_NADAWCA: opis(czysta("TWILIO_NADAWCA"), true),
        SMS_TRENERA: czysta("SMS_TRENERA") ? "ustawiony" : "BRAK",
        SMS_TEST: czysta("SMS_TEST") ?? "brak (dobrze)",
      },
      test_auth_tokena: sid && token ? await sprawdzLogowanie(sid, sid, token) : "pominięty: brak SID albo tokena",
      test_klucza_api: sid && klucz && sekret ? await sprawdzLogowanie(sid, klucz, sekret) : "pominięty: brak klucza API",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}