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
  title: "TWOJA MARKA — coaching, który ma trasę",
  description:
    "Plan treningowy i żywieniowy prowadzony przez trenera, z korektą co tydzień. Online i stacjonarnie.",
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