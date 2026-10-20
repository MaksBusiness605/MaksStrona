// PLIK: app/polityka-cookies/page.tsx · STRONA /polityka-cookies · pliki cookies: GA4, Meta Pixel, Vercel (bez cookies), Stripe

import type { Metadata } from "next";
import { StronaPrawna, type Paragraf } from "@/app/components/Prawne";
import { FIRMA, daneSprzedawcy } from "@/app/tresc/firma";

export const metadata: Metadata = {
  title: `Polityka cookies · ${FIRMA.marka}`,
  robots: { index: true, follow: false },
};

/* ═══════════════════════════════════════════════════════════════════════
   POLITYKA COOKIES · tutaj edytujesz treść

   Osobno od polityki prywatności: tu tylko pliki w przeglądarce i zgody.
   Co robimy z danymi (cele, podstawy, odbiorcy) jest w
   app/polityka-prywatnosci/page.tsx.

   NARZĘDZIA W TABELI
   · zgoda-cookies: zapis wyboru z banera (nazwa musi się zgadzać
     z tym, czego używa baner).
   · Google Analytics 4: _ga, _ga_<identyfikator>. Tylko po zgodzie.
   · Meta Pixel: _fbp, _fbc. Tylko po zgodzie.
   · Vercel Web Analytics i Speed Insights: BEZ cookies, dlatego nie
     ma ich w tabeli, tylko w § 3.
   Dodajesz albo usuwasz narzędzie: popraw tabelę w § 2 i datę
   DATA_DOKUMENTOW w app/tresc/firma.ts.

   BEZ BANERA ZGÓD ta polityka nie jest prawdziwa: GA4 i Pixel nie mogą
   się uruchomić przed kliknięciem „Akceptuję”.

   ⚠ Wzór pod Twój model działania, nie porada prawna.
   ═══════════════════════════════════════════════════════════════════════ */

const PARAGRAFY: Paragraf[] = [
  {
    tytul: "Czym są pliki cookies",
    tresc: [
      "Cookies to małe pliki tekstowe, które strona zapisuje w Twojej przeglądarce. Podobnie działają piksele i identyfikatory zapisywane w pamięci przeglądarki: w tej polityce nazywamy je razem „cookies”.",
      `Za cookies na tej stronie odpowiada ${daneSprzedawcy()}. Kontakt w sprawie cookies i danych: ${FIRMA.email}, tel. ${FIRMA.telefon}.`,
    ],
  },
  {
    tytul: "Jakich cookies używamy",
    tresc: [
      {
        lista: [
          "Niezbędne: zapamiętują Twój wybór w banerze cookies. Działają bez zgody, bo bez nich strona nie wie, na co się zgodziłeś.",
          "Analityczne (Google Analytics 4): pokazują, które podstrony są czytane, skąd przychodzą odwiedzający i gdzie odpadają. Tylko po zgodzie.",
          "Marketingowe (Meta Pixel): mierzą skuteczność reklam na Facebooku i Instagramie i pozwalają pokazywać reklamy osobom, które odwiedziły stronę. Tylko po zgodzie.",
        ],
      },
      {
        tabela: {
          naglowki: ["Plik", "Dostawca", "Rodzaj", "Cel", "Ważność"],
          wiersze: [
            ["zgoda-cookies", "my", "niezbędny", "zapamiętanie wyboru w banerze cookies", "12 miesięcy"],
            ["_ga", "Google", "analityczny", "rozróżnianie użytkowników w statystykach", "do 2 lat"],
            ["_ga_<identyfikator>", "Google", "analityczny", "utrzymanie stanu sesji w statystykach", "do 2 lat"],
            ["_fbp", "Meta", "marketingowy", "rozpoznanie przeglądarki na potrzeby reklam", "90 dni"],
            ["_fbc", "Meta", "marketingowy", "zapisanie kliknięcia w reklamę Meta", "90 dni"],
          ],
        },
      },
      "Do czasu wyrażenia zgody nie uruchamiamy Google Analytics 4 ani Meta Pixel, więc pliki analityczne i marketingowe nie powstają.",
    ],
  },
  {
    tytul: "Statystyki bez cookies (Vercel)",
    tresc: [
      "Do sprawdzania, czy strona działa i jak szybko się ładuje, używamy Vercel Web Analytics i Vercel Speed Insights. Te narzędzia nie zapisują żadnych plików w Twojej przeglądarce i nie pozwalają Cię rozpoznać: zbierają odwiedzoną podstronę, źródło wejścia, kraj i miasto, typ urządzenia, system, przeglądarkę i czasy ładowania. Wizytę rozpoznają po jednorazowym skrócie, który Vercel kasuje po 24 godzinach.",
      "Ponieważ nie używają cookies i dają tylko dane zbiorcze, działają bez zgody z banera. Szczegóły w Polityce prywatności, § 3.",
    ],
  },
  {
    tytul: "Meta Conversions API",
    tresc: [
      "Oprócz Meta Pixel w przeglądarce, po zakupie nasz serwer może przekazać Meta informację o zakupie (Conversions API). Robimy to tylko wtedy, gdy zgodziłeś się na cookies marketingowe. Co dokładnie wysyłamy, opisuje Polityka prywatności, § 7.",
    ],
  },
  {
    tytul: "Płatność na stronie Stripe",
    tresc: [
      "Płacisz na stronie Stripe (checkout.stripe.com). Stripe używa tam własnych plików niezbędnych do bezpiecznej płatności i wykrywania oszustw. Opisuje je polityka prywatności Stripe: stripe.com/privacy.",
    ],
  },
  {
    tytul: "Jak zmienić albo wycofać zgodę",
    tresc: [
      {
        lista: [
          "Przy pierwszej wizycie wybierasz w banerze: akceptujesz wszystkie, odrzucasz wszystkie albo wybierasz rodzaje. Odrzucenie jest tak samo łatwe jak akceptacja.",
          "Zmienić decyzję możesz w każdej chwili przyciskiem „Ustawienia cookies” w stopce strony.",
          "Wycofanie zgody nie wpływa na zgodność z prawem tego, co działo się przed wycofaniem.",
        ],
      },
      "Cookies możesz też usuwać i blokować w ustawieniach przeglądarki (Chrome, Safari, Firefox, Edge: zakładka Prywatność). Zablokowanie pliku zgoda-cookies sprawi, że baner będzie pojawiał się przy każdej wizycie.",
    ],
  },
  {
    tytul: "Zmiany",
    tresc: [
      "Gdy dodamy albo usuniemy narzędzie, zaktualizujemy tę stronę i datę na górze. Jeśli zmiana wymaga nowej zgody, baner pojawi się ponownie.",
    ],
  },
];

export default function Page() {
  return (
    <StronaPrawna
      tytul="Polityka cookies"
      wstep="Jakie pliki zapisuje ta strona w Twojej przeglądarce, po co i jak to wyłączyć. Najkrócej: statystyki Google i reklamy Meta działają dopiero po Twojej zgodzie, a statystyki Vercel nie używają cookies wcale."
      paragrafy={PARAGRAFY}
    />
  );
}