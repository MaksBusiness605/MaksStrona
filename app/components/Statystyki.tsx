"use client";
// PLIK: app/components/Statystyki.tsx · VERCEL · Web Analytics i Speed Insights (bez cookies, bez zgody)

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Vercel Web Analytics i Speed Insights nie zapisują plików cookies
   i nie rozpoznają osoby, więc działają bez banera.
   Adresy wysyłamy bez parametrów (?session_id=…, ?kod=…): po zakupie
   w adresie /dziekujemy jest numer płatności, który nie powinien trafiać
   do statystyk.

   Instalacja: npm i @vercel/analytics @vercel/speed-insights
   Włączenie w panelu: Vercel → projekt → Analytics → Enable,
   oraz Speed Insights → Enable. */

const bezParametrow = <T extends { url: string }>(zdarzenie: T): T => ({
  ...zdarzenie,
  url: zdarzenie.url.split("?")[0],
});

export function Statystyki() {
  return (
    <>
      <Analytics beforeSend={bezParametrow} />
      <SpeedInsights beforeSend={bezParametrow} />
    </>
  );
}