import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { Zgody } from "@/app/components/Zgody";
import { Statystyki } from "@/app/components/Statystyki";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://www.trenerlodz.pl"),
  title: {
    default: "Trener personalny Łódź i online | Maks Treningi",
    template: "%s",
  },
  description:
    "Trening personalny 1 na 1 w Just GYM przy Piotrkowskiej w Łodzi, trening online przez kamerę i indywidualne plany treningowe.",
  openGraph: { locale: "pl_PL", type: "website", siteName: "Maks Treningi" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${archivo.variable} ${inter.variable}`}>
      <body>{children}
        <Zgody />
<Statystyki />
      </body>
    </html>
  );
}