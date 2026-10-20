// PLIK: app/polityka-prywatnosci/page.tsx · STRONA /polityka-prywatnosci · RODO, cookies, GA4, Meta Pixel i Conversions API

import type { Metadata } from "next";
import { StronaPrawna, type Paragraf } from "@/app/components/Prawne";
import { FIRMA } from "@/app/tresc/firma";

export const metadata: Metadata = {
  title: `Polityka prywatności · ${FIRMA.marka}`,
  robots: { index: true, follow: false },
};

/* ═══════════════════════════════════════════════════════════════════════
   POLITYKA PRYWATNOŚCI · tutaj edytujesz treść

   OPISUJE NARZĘDZIA, KTÓRYCH UŻYWASZ ALBO PLANUJESZ UŻYWAĆ
   Stripe, Resend (maile), SMSAPI (SMS), Vercel (hosting), Google
   Analytics 4, Meta Pixel, Meta Conversions API, formularze i ankietę.
   Przestajesz używać narzędzia albo dodajesz nowe: zmień § 4, § 6
   i datę w app/tresc/firma.ts.

   TRZY RZECZY, BEZ KTÓRYCH TA POLITYKA NIE BĘDZIE PRAWDZIWA
   1. BANER COOKIES. GA4 i Meta Pixel mogą się uruchomić dopiero po
      zgodzie (art. 399 Prawa komunikacji elektronicznej). Polityka
      mówi, że tak jest. Bez banera to zdanie jest nieprawdziwe.
   2. CONVERSIONS API tylko po zgodzie na marketing. Serwer nie może
      wysyłać do Meta danych kupującego, który zgody nie dał.
   3. ANKIETA: osobny, niezaznaczony checkbox zgody na dane o zdrowiu
      (art. 9 RODO). Kontuzje, ból i leki to dane szczególnej kategorii.
      Treść checkboxa: § 3 niżej, wiersz „Ankieta”.

   ⚠ Wzór pod Twój model działania, nie porada prawna.
   ═══════════════════════════════════════════════════════════════════════ */

const F = FIRMA;

const PARAGRAFY: Paragraf[] = [
  {
    tytul: "Kto przetwarza Twoje dane",
    tresc: [
      `Administratorem Twoich danych osobowych jest ${F.nazwa}, ${F.adres}, NIP ${F.nip} („Administrator”, „my”).`,
      `We wszystkich sprawach dotyczących danych osobowych napisz na ${F.email} albo zadzwoń: ${F.telefon}. Nie wyznaczyliśmy inspektora ochrony danych.`,
    ],
  },
  {
    tytul: "Skąd mamy Twoje dane",
    tresc: [
      {
        lista: [
          "Od Ciebie: gdy kupujesz usługę, wypełniasz formularz na stronie albo Ankietę, piszesz do nas, dzwonisz lub wysyłasz SMS.",
          "Od operatora płatności Stripe: informację o płatności (kwota, status, metoda), bez pełnych danych karty.",
          "Automatycznie z Twojej przeglądarki: przez pliki cookies i podobne technologie (§ 6), wyłącznie w zakresie, na który się zgodzisz, z wyjątkiem plików niezbędnych do działania strony.",
        ],
      },
    ],
  },
  {
    tytul: "W jakim celu, na jakiej podstawie i jak długo",
    tresc: [
      {
        tabela: {
          naglowki: ["Cel", "Dane", "Podstawa (RODO)", "Jak długo"],
          wiersze: [
            [
              "Zakup i realizacja usługi: ustalenie terminu, treningi, wysyłka e-booka i planu, kontakt w sprawie zamówienia",
              "imię i nazwisko, e-mail, telefon, dane zamówienia, odpowiedzi z Ankiety poza danymi o zdrowiu, nagrania z Treningu online",
              "art. 6 ust. 1 lit. b: umowa",
              "przez czas współpracy, nagrania do 12 miesięcy po ostatniej Sesji, potem do przedawnienia roszczeń",
            ],
            [
              "Ankieta: dostosowanie treningu do Twojego zdrowia",
              "kontuzje, dolegliwości, choroby, przyjmowane leki, ciąża, zalecenia fizjoterapeuty",
              "art. 9 ust. 2 lit. a: Twoja wyraźna zgoda",
              "do końca współpracy, potem usuwamy w ciągu 30 dni; wcześniej, jeśli wycofasz zgodę",
            ],
            [
              "Potwierdzenia i przypomnienia e-mailem i SMS-em związane z zamówieniem",
              "imię, e-mail, telefon, numer zamówienia",
              "art. 6 ust. 1 lit. b: umowa",
              "przez czas współpracy",
            ],
            [
              "Płatności, faktury, księgowość",
              "dane transakcji, dane do faktury",
              "art. 6 ust. 1 lit. c: obowiązek prawny (przepisy podatkowe i rachunkowe)",
              "5 lat od końca roku podatkowego, w którym była płatność",
            ],
            [
              "Odpowiedź na zapytanie z formularza, telefon lub wiadomość przed zakupem",
              "imię, e-mail, telefon, treść wiadomości",
              "art. 6 ust. 1 lit. b (działania przed zawarciem umowy) albo lit. f (prawnie uzasadniony interes: odpowiedź na pytanie)",
              "do 12 miesięcy od ostatniego kontaktu, jeśli nie dojdzie do zakupu",
            ],
            [
              "Wiadomości marketingowe e-mailem i SMS-em (oferty, nowości)",
              "imię, e-mail, telefon",
              "art. 6 ust. 1 lit. a: zgoda, wymagana także przez Prawo komunikacji elektronicznej",
              "do wycofania zgody; bez zgody nie wysyłamy",
            ],
            [
              "Statystyki strony (Google Analytics 4)",
              "identyfikatory z plików cookies, odwiedzone podstrony, kliknięcia, przybliżona lokalizacja, typ urządzenia i przeglądarki",
              "art. 6 ust. 1 lit. a: zgoda",
              "do wycofania zgody; w Google Analytics dane są usuwane po 14 miesiącach",
            ],
            [
              "Reklamy w serwisach Meta (Facebook, Instagram) i mierzenie ich skuteczności (Meta Pixel, Conversions API)",
              "identyfikatory z plików cookies, zdarzenia na stronie (wejście, rozpoczęcie płatności, zakup i jego wartość), adres IP, dane przeglądarki, a przy zakupie zaszyfrowany skrót adresu e-mail i telefonu",
              "art. 6 ust. 1 lit. a: zgoda",
              "do wycofania zgody; po stronie Meta zgodnie z jej zasadami",
            ],
            [
              "Publikacja historii, opinii lub zdjęcia na stronie",
              "imię, wiek, wyniki treningowe, cytat, wizerunek",
              "art. 6 ust. 1 lit. a: zgoda (osobna, pisemna)",
              "do wycofania zgody",
            ],
            [
              "Ustalenie, dochodzenie i obrona roszczeń",
              "dane zamówienia i korespondencja",
              "art. 6 ust. 1 lit. f: prawnie uzasadniony interes",
              "do upływu terminu przedawnienia roszczeń",
            ],
          ],
        },
      },
      {
        uwaga:
          "Zgodę na dane o zdrowiu wyrażasz w Ankiecie osobnym polem: „Zgadzam się na przetwarzanie podanych przeze mnie informacji o zdrowiu w celu dostosowania treningu”. Bez tej zgody możesz trenować, ale nie będziemy mogli uwzględnić Twoich ograniczeń, o których nie wiemy.",
      },
    ],
  },
  {
    tytul: "Komu przekazujemy dane",
    tresc: [
      "Nie sprzedajemy Twoich danych. Przekazujemy je tylko firmom, które pomagają nam prowadzić działalność, i tylko w zakresie potrzebnym do danego zadania:",
      {
        tabela: {
          naglowki: ["Odbiorca", "Do czego", "Siedziba"],
          wiersze: [
            ["Stripe Payments Europe, Limited", "obsługa płatności i subskrypcji", "Irlandia"],
            ["Resend (resend.com)", "wysyłka e-maili z potwierdzeniami", "USA"],
            ["LINK Mobility Poland sp. z o.o. (SMSAPI)", "wysyłka SMS-ów", "Polska"],
            ["Vercel Inc.", "hosting strony i serwera obsługującego zamówienia", "USA"],
            ["Google Ireland Limited", "Google Analytics 4 (po zgodzie)", "Irlandia"],
            ["Meta Platforms Ireland Limited", "Meta Pixel i Conversions API (po zgodzie)", "Irlandia"],
            ["[dostawca formularza Ankiety, np. Tally / Google]", "obsługa Ankiety i formularzy", "[kraj]"],
            ["[dostawca poczty e-mail i domeny]", "skrzynka pocztowa, korespondencja", "[kraj]"],
            ["[biuro rachunkowe]", "księgowość i faktury", "Polska"],
          ],
        },
      },
      "Dane mogą otrzymać także organy publiczne, jeśli wymaga tego prawo.",
      "Przy Meta Pixel jesteśmy współadministratorem z Meta Platforms Ireland Limited w zakresie zbierania danych na stronie i przekazywania ich do Meta. Za dalsze przetwarzanie danych przez Meta odpowiada Meta. Szczegóły: facebook.com/privacy/policy.",
    ],
  },
  {
    tytul: "Przekazywanie danych poza Europejski Obszar Gospodarczy",
    tresc: [
      "Część dostawców (Resend, Vercel, a także Google i Meta w ramach ich grup) może przetwarzać dane w USA. Odbywa się to na podstawie decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony (EU-US Data Privacy Framework), jeśli dany dostawca jest w nim certyfikowany, albo na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję. Kopię zabezpieczeń możesz otrzymać, pisząc do nas.",
    ],
  },
  {
    tytul: "Pliki cookies i podobne technologie",
    tresc: [
      "Cookies to małe pliki zapisywane przez stronę w Twojej przeglądarce. Podobnie działają piksele i identyfikatory zapisywane w pamięci przeglądarki.",
      {
        lista: [
          "Niezbędne: zapamiętują Twój wybór w banerze cookies i zapewniają bezpieczeństwo. Działają bez zgody.",
          "Analityczne (Google Analytics 4): pokazują, jak korzystasz ze strony. Tylko po zgodzie.",
          "Marketingowe (Meta Pixel): pozwalają mierzyć skuteczność reklam i pokazywać reklamy osobom zainteresowanym. Tylko po zgodzie.",
        ],
      },
      "Do czasu wyrażenia zgody nie uruchamiamy narzędzi analitycznych ani marketingowych. Zgodę możesz w każdej chwili zmienić albo wycofać przez link „Ustawienia cookies” w stopce strony. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano przed jej wycofaniem.",
      {
        tabela: {
          naglowki: ["Plik", "Dostawca", "Cel", "Ważność"],
          wiersze: [
            ["[nazwa pliku zgody]", "my", "zapamiętanie wyboru w banerze cookies", "12 miesięcy"],
            ["_ga", "Google", "rozróżnianie użytkowników w statystykach", "do 2 lat"],
            ["_ga_[ID]", "Google", "utrzymanie stanu sesji w statystykach", "do 2 lat"],
            ["_fbp", "Meta", "rozpoznanie przeglądarki na potrzeby reklam", "90 dni"],
            ["_fbc", "Meta", "zapisanie kliknięcia w reklamę Meta", "90 dni"],
          ],
        },
      },
      "Strona płatności działa w domenie Stripe (checkout.stripe.com) i używa własnych plików niezbędnych do bezpiecznej płatności i ochrony przed oszustwami, opisanych w polityce prywatności Stripe.",
      "Pliki cookies możesz też usuwać i blokować w ustawieniach przeglądarki. Zablokowanie plików niezbędnych może utrudnić korzystanie ze strony.",
    ],
  },
  {
    tytul: "Meta Conversions API: co wysyłamy po zakupie",
    tresc: [
      "Conversions API to połączenie naszego serwera z Meta. Przeglądarki i blokery reklam często gubią informację z Meta Pixel, dlatego po zakupie nasz serwer może sam przekazać Meta, że zakup się odbył. Robimy to wyłącznie, gdy zgodziłeś się na pliki marketingowe.",
      "Wysyłamy wtedy: nazwę zdarzenia (np. zakup), jego wartość i walutę, czas, identyfikatory z plików _fbp i _fbc, adres IP i dane przeglądarki oraz adres e-mail i numer telefonu przekształcone przed wysłaniem w nieodwracalny skrót (SHA-256). Meta używa skrótu tylko do dopasowania zdarzenia do konta w swoich serwisach. Nie wysyłamy danych o zdrowiu ani odpowiedzi z Ankiety.",
    ],
  },
  {
    tytul: "Twoje prawa",
    tresc: [
      "Masz prawo:",
      {
        lista: [
          "dostępu do swoich danych i otrzymania ich kopii,",
          "sprostowania danych,",
          "usunięcia danych,",
          "ograniczenia przetwarzania,",
          "przeniesienia danych przetwarzanych na podstawie zgody lub umowy,",
          "sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,",
          "wycofania zgody w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania przed wycofaniem,",
          "wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa (uodo.gov.pl).",
        ],
      },
      `Aby skorzystać z praw, napisz na ${F.email}. Odpowiemy bez zbędnej zwłoki, najpóźniej w ciągu miesiąca. Rezygnację z wiadomości marketingowych możesz zgłosić także, odpowiadając na wiadomość.`,
    ],
  },
  {
    tytul: "Czy musisz podać dane",
    tresc: [
      "Podanie danych jest dobrowolne. Bez imienia i nazwiska, adresu e-mail i numeru telefonu nie możemy jednak przyjąć zamówienia ani umówić terminu. Dane o zdrowiu w Ankiecie podajesz dobrowolnie i tylko za wyraźną zgodą.",
    ],
  },
  {
    tytul: "Profilowanie i automatyczne decyzje",
    tresc: [
      "Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na automatycznym przetwarzaniu, które wywoływałyby skutki prawne lub w podobny sposób istotnie na Ciebie wpływały. Jeśli zgodzisz się na pliki marketingowe, Meta może na podstawie zebranych danych dopasowywać wyświetlane Ci reklamy.",
    ],
  },
  {
    tytul: "Bezpieczeństwo",
    tresc: [
      "Strona działa przez szyfrowane połączenie (HTTPS). Nie przechowujemy danych kart płatniczych, bo płatności obsługuje wyłącznie Stripe. Dostęp do danych klientów ma tylko Administrator, a konta w usługach, z których korzystamy, są chronione silnymi hasłami i weryfikacją dwuetapową.",
    ],
  },
  {
    tytul: "Zmiany polityki",
    tresc: [
      "Politykę aktualizujemy, gdy zmieniają się przepisy albo narzędzia, z których korzystamy. Aktualna wersja i data jej obowiązywania są zawsze na tej stronie. O istotnych zmianach dotyczących zgód poinformujemy Cię przy następnej wizycie, przez baner cookies.",
    ],
  },
];

export default function Page() {
  return (
    <StronaPrawna
      tytul="Polityka prywatności"
      wstep={`Jakie dane zbieramy w ${FIRMA.marka}, po co, komu je przekazujemy i jak możesz z nich zrezygnować. Najkrócej: dane do zamówienia służą do zamówienia, dane o zdrowiu tylko za Twoją zgodą, a statystyki i reklamy działają dopiero, gdy się na nie zgodzisz.`}
      paragrafy={PARAGRAFY}
    />
  );
}