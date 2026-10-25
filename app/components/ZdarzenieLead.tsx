"use client";
// PLIK: app/components/ZdarzenieLead.tsx · ŚLEDZENIE · zgłoszenie (Lead) do GA4 i Meta Pixel

import { useEffect } from "react";
import { sledz } from "@/app/lib/sledzenie";

/* Wysyła „generate_lead” (GA4) i „Lead” (Pixel) raz na zgłoszenie, tylko
   przy zgodzie z banera. Odświeżenie strony nie liczy go drugi raz.
   To samo zgłoszenie wysyła serwer (Conversions API) z tym samym id. */
export function ZdarzenieLead({ id, zrodlo }: { id: string; zrodlo: string }) {
  useEffect(() => {
    const klucz = `lead-wyslany-${id}`;
    try {
      if (localStorage.getItem(klucz)) return;
      localStorage.setItem(klucz, "1");
    } catch {
      /* Tryb prywatny: wysyłamy, najwyżej raz więcej. */
    }
    sledz({ typ: "lead", id, zrodlo });
  }, [id, zrodlo]);

  return null;
}
