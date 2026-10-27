// STRONA: /zamowienie · WYŁĄCZONA (zwraca 404)
// Stara kasa z ankietą przed płatnością. Zakup idzie teraz prosto do Stripe
// (/api/stripe/platnosc), więc ta strona nie jest używana. Poprzednia wersja
// jest w historii gita, gdyby kiedyś miała wrócić.
import { notFound } from "next/navigation";

export default function Page() {
  notFound();
}
