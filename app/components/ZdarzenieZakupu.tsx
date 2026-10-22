"use client";
// PLIK: app/components/ZdarzenieZakupu.tsx · ŚLEDZENIE · zakup do GA4 i Meta Pixel na /dziekujemy

import { useEffect } from "react";
import { sledz } from "@/app/lib/sledzenie";

/* Wysyła „purchase” (GA4) i „Purchase” (Pixel) raz na płatność, tylko
   przy zgodzie z banera. Odświeżenie strony nie liczy zakupu drugi raz.
   Ten sam zakup wysyła też serwer (Conversions API) z tym samym id,
   więc Meta liczy go raz. */
export function ZdarzenieZakupu(p: { id: string; numer?: string; wartosc: number; produkt?: string; nazwa?: string }) {
  useEffect(() => {
    const klucz = `zakup-wyslany-${p.id}`;
    try {
      if (localStorage.getItem(klucz)) return;
      localStorage.setItem(klucz, "1");
    } catch {
      /* Tryb prywatny: wysyłamy, najwyżej raz więcej. */
    }
    sledz({ typ: "zakup", ...p });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.id]);

  return null;
}