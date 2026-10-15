// PLIK: app/lib/wyslij-sms.ts · SMS · wysyłka SMS przez Twilio albo SMSAPI (wołane z app/lib/webhook.ts)

import { doGsm } from "./maile";

/* ═══════════════════════════════════════════════════════════════════════
   WYSYŁKA SMS · dwóch dostawców, wybierasz jedną zmienną

   SMS_DOSTAWCA=twilio   (domyślnie) twilio.com, konto także dla osoby
                         prywatnej, bez firmy. Płatność kartą.
   SMS_DOSTAWCA=smsapi   smsapi.pl, wymaga firmy. Przełączysz się, gdy
                         zarejestrujesz działalność.

   ── TWILIO (.env.local, a na produkcji Vercel) ───────────────────────
     TWILIO_ACCOUNT_SID=AC...         Console → Account Info
     TWILIO_AUTH_TOKEN=...            Console → Account Info
     TWILIO_NADAWCA=MaksTren          nazwa nadawcy, max 11 znaków, litery
                                      i cyfry, bez spacji. Dla Polski nie
                                      trzeba jej rejestrować.
       albo
     TWILIO_MESSAGING_SERVICE_SID=MG… jeśli wysyłasz przez Messaging Service

     Konto próbne (trial) wysyła tylko na numery zweryfikowane w Console
     i dopisuje „Sent from your Twilio trial account”. Po doładowaniu
     (Upgrade) wysyła do wszystkich.

     W Console → Messaging → Settings → Geo permissions musi być
     zaznaczona Polska, inaczej każdy SMS dostanie błąd 21408.

   ── SMSAPI ───────────────────────────────────────────────────────────
     SMSAPI_TOKEN=...          panel SMSAPI → Tokeny API
     SMSAPI_NADAWCA=MaksTren   zatwierdzone pole nadawcy

   ── WSPÓLNE ──────────────────────────────────────────────────────────
     SMS_TRENERA=48537483233   opcjonalnie: Twój numer na SMS o zakupie
     SMS_TEST=1                tryb testowy: nic nie wychodzi i nic nie
                               kosztuje. Twilio: kod sprawdza konfigurację
                               i pokazuje, co by wysłał. SMSAPI: serwer
                               sprawdza token, numer i nadawcę (test=1).
                               Usuń przed startem.

   Bez kluczy wybranego dostawcy SMS nie wychodzi, tylko jego treść trafia
   do logów serwera, tak samo jak przy mailach.

   Polskie litery zamieniamy na łacińskie przed wysyłką (doGsm z maile.ts):
   SMS z „ą” mieści 70 znaków zamiast 160 i kosztuje kilka razy więcej.
   ═══════════════════════════════════════════════════════════════════════ */

type Dostawca = "twilio" | "smsapi";

/** Zmienna środowiskowa bez spacji, enterów i cudzysłowów na brzegach.
    Przy wklejaniu do Vercela łatwo złapać spację albo enter na końcu,
    a wtedy Twilio odrzuca token (kod 20003), choć wygląda na dobry. */
function env(nazwa: string): string | undefined {
  const w = process.env[nazwa]?.trim().replace(/^["']|["']$/g, "").trim();
  return w || undefined;
}

function dostawca(): Dostawca {
  return process.env.SMS_DOSTAWCA === "smsapi" ? "smsapi" : "twilio";
}

/** SMS_TEST=1, a dla zgodności wstecz także SMSAPI_TEST=1. */
function trybTestowy(): boolean {
  return process.env.SMS_TEST === "1" || process.env.SMSAPI_TEST === "1";
}

/** "+48 537-483-233" → "48537483233". Polski numer bez kierunkowego
    dostaje 48 na początku. Zwraca undefined, gdy to nie wygląda na numer. */
export function numerDoSms(telefon: string | undefined): string | undefined {
  if (!telefon) return undefined;
  let n = telefon.replace(/\D/g, "");
  if (n.startsWith("00")) n = n.slice(2);
  if (n.length === 9) n = `48${n}`;
  return n.length >= 10 && n.length <= 15 ? n : undefined;
}

/** Ile części SMS zajmie tekst w alfabecie GSM (160 albo 153 na część). */
export function czesciSms(tresc: string): number {
  const d = tresc.length;
  return d <= 160 ? 1 : Math.ceil(d / 153);
}

/**
 * Wysyła SMS. NIE rzuca błędu: SMS to dodatek, a błąd w webhooku sprawiłby,
 * że Stripe powtórzy zdarzenie. Zwraca true, gdy dostawca przyjął wiadomość
 * (w trybie testowym: gdy konfiguracja jest kompletna).
 */
export async function wyslijSms(telefon: string | undefined, tresc: string): Promise<boolean> {
  const numer = numerDoSms(telefon);
  if (!numer) {
    console.warn("[sms] brak poprawnego numeru, pomijam:", telefon);
    return false;
  }

  const wiadomosc = doGsm(tresc);
  const czesci = czesciSms(wiadomosc);
  if (czesci > 1) console.warn(`[sms] wiadomość ma ${wiadomosc.length} znaków i pójdzie w ${czesci} częściach`);

  return dostawca() === "smsapi" ? smsapi(numer, wiadomosc, czesci) : twilio(numer, wiadomosc, czesci);
}

/* ─────────────────────────────────────────────────────── TWILIO */

const BLEDY_TWILIO: Record<number, string> = {
  20003: "zły TWILIO_ACCOUNT_SID albo TWILIO_AUTH_TOKEN",
  21211: "zły numer odbiorcy",
  21212: "zły nadawca: TWILIO_NADAWCA może mieć max 11 znaków, tylko litery i cyfry",
  21408: "Polska nie jest włączona w Console → Messaging → Settings → Geo permissions",
  21608: "konto próbne: ten numer nie jest zweryfikowany w Console (Verified Caller IDs) albo zrób Upgrade",
  21610: "odbiorca zablokował SMS-y od Ciebie (wysłał STOP)",
  21612: "Twilio nie może dostarczyć SMS-a na ten numer od tego nadawcy",
  21614: "to nie jest numer komórkowy",
};

async function twilio(numer: string, wiadomosc: string, czesci: number): Promise<boolean> {
  const sid = env("TWILIO_ACCOUNT_SID");
  const token = env("TWILIO_AUTH_TOKEN");
  const nadawca = env("TWILIO_NADAWCA");
  const usluga = env("TWILIO_MESSAGING_SERVICE_SID");

  if (!sid || !token || (!nadawca && !usluga)) {
    console.log(
      `[sms · nie wysłano, brak TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN albo TWILIO_NADAWCA]\nDo: +${numer} (${wiadomosc.length} zn., ${czesci} SMS)\n\n${wiadomosc}`,
    );
    return false;
  }

  if (trybTestowy()) {
    console.log(`[sms] TEST (Twilio), nie wysłano naprawdę do +${numer}: ${czesci} SMS od „${nadawca ?? usluga}”\n${wiadomosc}`);
    return true;
  }

  const body = new URLSearchParams({ To: `+${numer}`, Body: wiadomosc });
  if (usluga) body.set("MessagingServiceSid", usluga);
  else if (nadawca) body.set("From", nadawca);

  try {
    const odp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(8000),
    });
    const dane = (await odp.json().catch(() => ({}))) as {
      sid?: string;
      status?: string;
      code?: number;
      message?: string;
      num_segments?: string;
    };

    if (!odp.ok) {
      const opis = (dane.code && BLEDY_TWILIO[dane.code]) || dane.message || `HTTP ${odp.status}`;
      console.error(`[sms] Twilio odrzuciło wiadomość do +${numer}: ${opis} (kod ${dane.code ?? "-"})`);
      if (dane.code === 20003) {
        /* Podpowiedź bez ujawniania sekretu: długość i początek/koniec. */
        console.error(
          `[sms] sprawdź zmienne: SID ${sid.length} zn. (${sid.slice(0, 4)}…${sid.slice(-4)}), ` +
            `token ${token.length} zn. (${token.slice(0, 3)}…${token.slice(-3)}). Poprawnie: SID 34 zn., token 32 zn.`,
        );
      }
      return false;
    }

    console.log(`[sms] wysłano przez Twilio do +${numer}: ${dane.num_segments ?? czesci} SMS, status ${dane.status} (${dane.sid})`);
    return true;
  } catch (e) {
    console.error("[sms] brak połączenia z Twilio:", e instanceof Error ? e.message : e);
    return false;
  }
}

/* ─────────────────────────────────────────────────────── SMSAPI */

const ADRESY_SMSAPI = ["https://api.smsapi.pl/sms.do", "https://api2.smsapi.pl/sms.do"];

const BLEDY_SMSAPI: Record<number, string> = {
  13: "zły numer telefonu odbiorcy",
  14: "pole nadawcy nie jest zatwierdzone: sprawdź SMSAPI_NADAWCA i status w panelu SMSAPI",
  101: "zły token: sprawdź SMSAPI_TOKEN",
  102: "zły token albo brak uprawnień tokenu do wysyłki SMS",
  103: "brak środków na koncie SMSAPI: doładuj konto",
};

async function smsapi(numer: string, wiadomosc: string, czesci: number): Promise<boolean> {
  const token = env("SMSAPI_TOKEN");
  if (!token) {
    console.log(`[sms · nie wysłano, brak SMSAPI_TOKEN]\nDo: ${numer} (${wiadomosc.length} zn., ${czesci} SMS)\n\n${wiadomosc}`);
    return false;
  }

  const test = trybTestowy();
  const nadawca = env("SMSAPI_NADAWCA");
  if (!nadawca) console.warn("[sms] brak SMSAPI_NADAWCA: SMS przyjdzie od nadawcy „Test”");

  const body = new URLSearchParams({
    to: numer,
    message: wiadomosc,
    format: "json",
    encoding: "utf-8",
    normalize: "1",
    ...(nadawca ? { from: nadawca } : {}),
    ...(test ? { test: "1" } : {}),
  });

  for (const adres of ADRESY_SMSAPI) {
    try {
      const odp = await fetch(adres, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(8000),
      });
      const dane = (await odp.json().catch(() => ({}))) as {
        error?: number;
        message?: string;
        list?: { id: string; points: number; status: string }[];
      };

      if (dane.error || !odp.ok) {
        const opis = (dane.error && BLEDY_SMSAPI[dane.error]) || dane.message || `HTTP ${odp.status}`;
        console.error(`[sms] SMSAPI odrzuciło wiadomość do ${numer}: ${opis} (kod ${dane.error ?? "-"})`);
        return false; // błąd po stronie danych, zapasowy serwer nic tu nie zmieni
      }

      const punkty = dane.list?.reduce((s, x) => s + (x.points ?? 0), 0);
      console.log(
        `[sms] ${test ? "TEST (SMSAPI), nie wysłano naprawdę" : "wysłano przez SMSAPI"} do ${numer}: ${czesci} SMS${
          punkty !== undefined ? `, koszt ${punkty} pkt` : ""
        }`,
      );
      return true;
    } catch (e) {
      /* Sieć albo timeout: próbujemy zapasowego serwera SMSAPI. */
      console.error(`[sms] brak połączenia z ${adres}:`, e instanceof Error ? e.message : e);
    }
  }
  return false;
}