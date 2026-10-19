// PLIK: app/api/dev/test-powiadomien/route.ts · ADRES /api/dev/test-powiadomien · test maili i SMS-ów bez płacenia (tylko lokalnie)

import { NextResponse } from "next/server";
import { doGsm, mailDoKlienta, mailDoTrenera, potwierdzenie, smsDoKlienta, smsDoTrenera } from "@/app/lib/maile";
import { htmlPotwierdzenia } from "@/app/lib/szablon-potwierdzenia";
import { cena, znajdzProdukt } from "@/app/lib/produkty";
import { wyslijMail } from "@/app/lib/wyslij-mail";
import { czesciSms, wyslijSms } from "@/app/lib/wyslij-sms";

/* ═══════════════════════════════════════════════════════════════════════
   TEST POWIADOMIEŃ · wysyła dokładnie te maile i SMS-y, które wychodzą
   po zakupie, ale bez Stripe i bez płacenia. Działa TYLKO w `npm run dev`,
   na produkcji zwraca 404.

   Przykłady (w przeglądarce):
     /api/dev/test-powiadomien
     /api/dev/test-powiadomien?produkt=prowadzenie
     /api/dev/test-powiadomien?produkt=online-3&telefon=537483233&sms=1

   Parametry:
     produkt   id z app/lib/produkty.ts (domyślnie online-1)
     email     adres klienta (domyślnie MAIL_TRENERA, bo bez domeny
               Resend wysyła tylko na adres konta)
     telefon   numer klienta do SMS-a
     sms=1     wyślij też SMS-y (bez tego tylko maile, żeby nie płacić
               za każdy test)
   ═══════════════════════════════════════════════════════════════════════ */

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });

  const q = new URL(req.url).searchParams;
  const p = znajdzProdukt(q.get("produkt") ?? "online-1");
  if (!p) return NextResponse.json({ blad: "Nieznany produkt" }, { status: 400 });

  const email = q.get("email") ?? process.env.MAIL_TRENERA ?? "";
  const telefon = q.get("telefon") ?? "";
  const numer = "MT-TEST" + Date.now().toString(36).toUpperCase().slice(-4);
  const kwota = cena(p.cenaGrosze);
  const imieNazwisko = "Jan Testowy";

  const wynik: Record<string, string> = {};

  try {
    if (process.env.MAIL_TRENERA) {
      await wyslijMail({
        do: process.env.MAIL_TRENERA,
        temat: `[TEST] Nowe zamówienie: ${imieNazwisko} · ${p.nazwa} · ${kwota}`,
        tresc: mailDoTrenera(p, { numer, email, imieNazwisko, telefon, kwota, panel: "https://dashboard.stripe.com/test/payments" }),
      });
      wynik.mail_trener = "wysłany";
    } else wynik.mail_trener = "pominięty: brak MAIL_TRENERA";

    if (email) {
      const temat = `[TEST] Potwierdzenie zamówienia ${numer} · ${p.nazwa}`;
      await wyslijMail({
        do: email,
        temat,
        tresc: mailDoKlienta(p, numer, kwota, "Jan"),
        html: htmlPotwierdzenia(potwierdzenie(p, numer, kwota, "Jan"), temat),
        odpowiedzDo: process.env.MAIL_TRENERA,
      });
      wynik.mail_klient = "wysłany";
    } else wynik.mail_klient = "pominięty: brak adresu";
  } catch (e) {
    wynik.blad_maila = String(e);
  }

  /* Podgląd SMS-ów zawsze, nawet bez wysyłki: treść, długość, liczba części. */
  const smsKlient = doGsm(smsDoKlienta(p, numer, "Jan"));
  const smsTrener = doGsm(smsDoTrenera(p, imieNazwisko, telefon || "48600100200", kwota));
  const podglad = {
    sms_klient_tresc: smsKlient,
    sms_klient_dlugosc: `${smsKlient.length} zn., ${czesciSms(smsKlient)} SMS`,
    sms_trener_tresc: smsTrener,
    sms_trener_dlugosc: `${smsTrener.length} zn., ${czesciSms(smsTrener)} SMS`,
    sms_dostawca: process.env.SMS_DOSTAWCA === "smsapi" ? "SMSAPI" : "Twilio",
    sms_tryb:
      process.env.SMS_TEST === "1" || process.env.SMSAPI_TEST === "1"
        ? "TEST (bez wysyłki i opłat)"
        : process.env.TWILIO_ACCOUNT_SID || process.env.SMSAPI_TOKEN
          ? "PRAWDZIWY"
          : "brak kluczy, tylko logi",
  };

  if (q.get("sms") === "1") {
    wynik.sms_klient = (await wyslijSms(telefon, smsDoKlienta(p, numer, "Jan"))) ? "wysłany" : "nie wysłany (szczegóły w terminalu)";
    if (process.env.SMS_TRENERA) {
      wynik.sms_trener = (await wyslijSms(process.env.SMS_TRENERA, smsDoTrenera(p, imieNazwisko, telefon, kwota)))
        ? "wysłany"
        : "nie wysłany (szczegóły w terminalu)";
    }
  } else wynik.sms = "pominięte: dodaj &sms=1";

  return NextResponse.json({ produkt: p.id, numer, ...wynik, ...podglad });
}