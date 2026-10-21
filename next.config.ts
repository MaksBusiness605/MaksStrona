// PLIK: next.config.ts · KONFIGURACJA NEXT.JS
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* E-book leży w prywatne/ (poza public/, żeby nikt nie pobrał go bez
     zakupu). Ta linijka dokleja plik do funkcji /api/ebook na Vercelu. */
  outputFileTracingIncludes: {
    "/api/ebook": ["./prywatne/**"],
  },
};

export default nextConfig;