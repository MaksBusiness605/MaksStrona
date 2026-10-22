// STRONA: /konkurs/regulamin · REGULAMIN KONKURSU · zasady, wybór zwycięzcy, kontakt telefoniczny i SMS, dane

import type { Metadata } from "next";
import { StronaPrawna, type Paragraf } from "@/app/components/Prawne";
import { KONKURS, dataPL } from "@/app/lib/dane";
import { FIRMA, daneSprzedawcy } from "@/app/tresc/firma";

export const metadata: Metadata = {
  title: `Regulamin konkursu · ${FIRMA.marka}`,
  robots: { index: false, follow: true },
};

/* ═══════════════════════════════════════════════════════════════════════
   REGULAMIN KONKURSU · tutaj edytujesz treść

   Daty i wartość nagrody biorą się z app/lib/dane.ts (KONKURS), więc
   przy kolejnym konkursie zmieniasz je tam, a nie tutaj.

   NAJWAŻNIEJSZE ZAPISY
   · § 4: wybór jest subiektywny, według uznania Organizatora. To wybór
     za zadanie (najkonkretniejsza odpowiedź), a nie losowanie, więc to
     konkurs, a nie loteria promocyjna wymagająca zezwolenia.
   · § 5 ust. 3: wyróżnienia (np. kody rabatowe) bez zapowiadania ich
     liczby i wartości.
   · § 6: zgoda na kontakt telefoniczny i SMS-owy w sprawie konkursu.
   · § 10: zastrzeżenie o Meta, wymagane, jeśli promujesz konkurs na
     Facebooku albo Instagramie.

   ⚠ Wzór pod Twój konkurs, nie porada prawna.
   ═══════════════════════════════════════════════════════════════════════ */

const F = FIRMA;
const KONIEC = dataPL(KONKURS.koniec);
const WYNIKI = dataPL(KONKURS.wyniki);

const PARAGRAFY: Paragraf[] = [
  {
    tytul: "Organizator",
    tresc: [
      `Organizatorem konkursu „Wygraj trzy treningi jeden na jeden” („Konkurs”) jest ${daneSprzedawcy()} („Organizator”).`,
      `Sesje z nagrody prowadzi trener ${F.trener.imie}. Kontakt w sprawie Konkursu: tel. ${F.trener.telefon}, e-mail ${F.trener.email} albo ${F.email}.`,
      "Konkurs prowadzony jest na stronie /konkurs („Strona”). Regulamin jest dostępny pod adresem /konkurs/regulamin.",
    ],
  },
  {
    tytul: "Czas trwania",
    tresc: [
      `Zgłoszenia przyjmowane są od dnia opublikowania Konkursu na Stronie do ${KONIEC} włącznie.`,
      `Wyniki zostaną ogłoszone do ${WYNIKI} przez kontakt z nagrodzonymi osobami (§ 6).`,
    ],
  },
  {
    tytul: "Kto może wziąć udział",
    tresc: [
      {
        lista: [
          "Uczestnikiem może być pełnoletnia osoba fizyczna z pełną zdolnością do czynności prawnych.",
          "W Konkursie nie mogą brać udziału Organizator ani osoby z nim spokrewnione lub z nim współpracujące.",
          "Jedna osoba może wysłać jedno zgłoszenie. Kolejne zgłoszenia tej samej osoby (to samo imię i numer telefonu) nie są brane pod uwagę.",
          "Udział w Konkursie jest bezpłatny i nie wymaga żadnego zakupu.",
        ],
      },
    ],
  },
  {
    tytul: "Zadanie konkursowe i wybór zwycięzcy",
    tresc: [
      "Zadaniem jest odpowiedź w formularzu na pytanie: co chcesz poprawić w swoim treningu i dlaczego akurat to.",
      "Odpowiedź musi być własna, napisana przez Uczestnika, i nie może naruszać prawa ani dóbr osobistych innych osób. Zgłoszenia niespełniające tych warunków nie biorą udziału w Konkursie.",
      "Zwycięzcę wybiera Organizator, kierując się własną, subiektywną oceną, która odpowiedź najkonkretniej opisuje problem, z którym da się coś zrobić w trzech sesjach treningowych. Ocena Organizatora jest ostateczna.",
      "Konkurs nie jest grą losową ani loterią: o wyniku decyduje ocena odpowiedzi, a nie przypadek.",
      "Uczestnikowi nie przysługuje prawo do uzasadnienia oceny ani do porównania jego odpowiedzi z innymi.",
    ],
  },
  {
    tytul: "Nagrody",
    tresc: [
      `Nagroda główna: trzy sesje treningu personalnego jeden na jeden po 60 minut w Just GYM, ul. Piotrkowska 157A w Łodzi, o łącznej wartości ${KONKURS.wartosc}. Nagrodę główną otrzymuje jedna osoba.`,
      "Nagroda nie obejmuje wejścia na salę Just GYM. Zwycięzca opłaca je samodzielnie (karnet albo jednorazowe wejście).",
      "Organizator może, według własnego uznania, przyznać dodatkowe wyróżnienia, np. kody rabatowe na treningi. Liczba, rodzaj i warunki wyróżnień zależą wyłącznie od decyzji Organizatora i są podawane nagrodzonej osobie razem z wyróżnieniem.",
      "Sesje z nagrody głównej należy wykorzystać w ciągu 3 miesięcy od ogłoszenia wyników, w terminach ustalonych z Organizatorem. Niewykorzystane w tym czasie sesje przepadają, chyba że nie odbyły się z przyczyn leżących po stronie Organizatora.",
      "Nagród nie można wymienić na gotówkę ani na inne usługi ani przekazać innej osobie.",
    ],
  },
  {
    tytul: "Kontakt z Uczestnikiem: telefon i SMS",
    tresc: [
      "Wysyłając zgłoszenie, Uczestnik zgadza się, aby Organizator kontaktował się z nim telefonicznie i SMS-em na podany numer w sprawach związanych z Konkursem: ogłoszenia wyników, przekazania nagrody lub wyróżnienia i ustalenia terminów sesji.",
      `Organizator kontaktuje się z numeru ${F.trener.telefon}.`,
      "Jeśli nagrodzona osoba nie odpowie w ciągu 7 dni od pierwszej próby kontaktu, traci prawo do nagrody, a Organizator może przyznać ją innemu Uczestnikowi.",
      "Wiadomości o ofertach i wolnych terminach, niezwiązane z Konkursem, Organizator wysyła tylko osobom, które zaznaczyły na to osobną, nieobowiązkową zgodę w formularzu. Zgodę można wycofać w każdej chwili, odpisując SMS-em, telefonicznie albo e-mailem.",
    ],
  },
  {
    tytul: "Dane osobowe",
    tresc: [
      `Administratorem danych Uczestników jest Organizator (${daneSprzedawcy()}).`,
      {
        tabela: {
          naglowki: ["Cel", "Dane", "Podstawa (RODO)", "Jak długo"],
          wiersze: [
            [
              "Przeprowadzenie Konkursu, wybór zwycięzcy, kontakt i wydanie nagrody",
              "imię, numer telefonu, odpowiedź konkursowa",
              "art. 6 ust. 1 lit. b: udział w Konkursie na zasadach tego regulaminu",
              "30 dni od ogłoszenia wyników; dane zwycięzcy do wykorzystania nagrody",
            ],
            [
              "Rozpatrzenie reklamacji i obrona przed roszczeniami",
              "jak wyżej, korespondencja",
              "art. 6 ust. 1 lit. f: prawnie uzasadniony interes",
              "do zakończenia sprawy",
            ],
            [
              "SMS-y o ofertach i wolnych terminach",
              "imię, numer telefonu",
              "art. 6 ust. 1 lit. a: zgoda",
              "do wycofania zgody",
            ],
          ],
        },
      },
      "Podanie danych jest dobrowolne, ale bez imienia, numeru telefonu i odpowiedzi nie można wziąć udziału w Konkursie.",
      "Zgłoszenia trafiają do Organizatora e-mailem (dostawcy: Resend, Google Ireland Limited, Vercel Inc.). Szczegóły, w tym prawa Uczestnika (dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, wycofanie zgody, skarga do Prezesa UODO), opisuje Polityka prywatności pod adresem /polityka-prywatnosci.",
      "Organizator nie publikuje imion ani odpowiedzi Uczestników bez ich osobnej zgody.",
    ],
  },
  {
    tytul: "Reklamacje",
    tresc: [
      `Reklamacje dotyczące Konkursu można zgłaszać do 14 dni od ogłoszenia wyników e-mailem na ${F.email} albo SMS-em na ${F.trener.telefon}. Reklamacja powinna zawierać imię, numer telefonu podany w zgłoszeniu i opis sprawy.`,
      "Organizator odpowiada na reklamację w ciągu 14 dni od jej otrzymania, w ten sam sposób, w jaki została zgłoszona.",
      "Reklamacja nie może dotyczyć samej oceny odpowiedzi, która należy do Organizatora (§ 4 ust. 3).",
    ],
  },
  {
    tytul: "Zmiany i zakończenie Konkursu",
    tresc: [
      "Organizator może zmienić regulamin z ważnych przyczyn (np. zmiana przepisów, zamknięcie sali). Zmiany nie pogarszają sytuacji Uczestników, którzy wysłali już zgłoszenie.",
      "Organizator może odwołać Konkurs przed ogłoszeniem wyników z ważnych przyczyn, informując o tym na Stronie.",
    ],
  },
  {
    tytul: "Postanowienia końcowe",
    tresc: [
      "Konkurs nie jest sponsorowany, popierany ani przeprowadzany przez Meta Platforms (Facebook, Instagram) ani w żaden sposób z nią związany. Meta nie odpowiada za Konkurs.",
      "W sprawach nieuregulowanych stosuje się przepisy prawa polskiego, w szczególności Kodeksu cywilnego.",
      "Wysłanie zgłoszenia oznacza akceptację tego regulaminu.",
    ],
  },
];

export default function Page() {
  return (
    <StronaPrawna
      tytul="Regulamin konkursu"
      wstep={`Zasady konkursu „Wygraj trzy treningi jeden na jeden”. Najkrócej: zgłoszenia do ${KONIEC}, zwycięzcę wybieram sam według tego, czyja odpowiedź jest najbardziej konkretna, a z nagrodzonymi kontaktuję się telefonicznie albo SMS-em z numeru ${F.trener.telefon}.`}
      paragrafy={PARAGRAFY}
    />
  );
}