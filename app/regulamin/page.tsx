// PLIK: app/regulamin/page.tsx · STRONA /regulamin · regulamin sprzedaży usług treningowych i e-booka

import type { Metadata } from "next";
import { StronaPrawna, type Paragraf } from "@/app/components/Prawne";
import { FIRMA, daneSprzedawcy } from "@/app/tresc/firma";

export const metadata: Metadata = {
  title: `Regulamin · ${FIRMA.marka}`,
  robots: { index: true, follow: false },
};

/* ═══════════════════════════════════════════════════════════════════════
   REGULAMIN · tutaj edytujesz treść

   ZAŁOŻENIA, NA KTÓRYCH STOI TEN DOKUMENT
   · Sprzedajesz: treningi stacjonarne (Just GYM), treningi online przez
     kamerę, e-book, indywidualny plan i prowadzenie miesięczne.
   · Płatność z góry przez Stripe, termin ustalany po zakupie.
   · Brak zwrotu za usługę, która została już wykonana.
   · Prawo odstąpienia od umowy: 14 DNI, nie 7. To minimum z ustawy
     o prawach konsumenta (art. 27). Krótszy termin w regulaminie byłby
     nieważny (art. 7), a sprzedający z nieważnym zapisem ryzykuje
     wydłużenie terminu do 12 miesięcy, jeśli nie poinformuje
     prawidłowo o prawie odstąpienia (art. 29).
   · E-book: po rozpoczęciu dostarczenia za zgodą klienta prawo
     odstąpienia nie przysługuje (art. 38 ust. 1 pkt 13).
   · Usługa w pełni wykonana za zgodą klienta: brak prawa odstąpienia
     (art. 38 ust. 1 pkt 1). Pakiet częściowo wykorzystany: klient płaci
     tylko za odbyte sesje (art. 35).

   ⚠ To wzór przygotowany pod Twój model sprzedaży, nie porada prawna.
   Przed publikacją niech go przeczyta prawnik albo księgowy, zwłaszcza
   § 3 ust. 4 (VAT) i dane w app/tresc/firma.ts.

   ⚠ SPÓJNOŚĆ ZE STRONAMI. Regulamin wiąże, ale obietnice na stronie też.
   Jeśli strona obiecuje więcej (np. „30 dni na zwrot”), klient może się
   na to powołać. Zmieniasz zasady tutaj, sprawdź teksty na stronach.
   ═══════════════════════════════════════════════════════════════════════ */

const F = FIRMA;

const PARAGRAFY: Paragraf[] = [
  {
    tytul: "Postanowienia ogólne",
    tresc: [
      {
        lista: [
          `Regulamin określa zasady sprzedaży usług treningowych i treści cyfrowych przez stronę ${F.strona} („Strona”) oraz zasady korzystania ze Strony.`,
          `Usługodawcą i sprzedawcą jest ${daneSprzedawcy()} („Usługodawca”).`,
          `Usługi w imieniu Usługodawcy prowadzi trener ${F.trener.imie} („Trener”). Za wykonanie usług wobec Klienta odpowiada Usługodawca.`,
          `Kontakt z Usługodawcą: e-mail ${F.email}, telefon ${F.telefon}. W sprawach terminów i treningów: Trener, telefon ${F.trener.telefon}, e-mail ${F.trener.email} (w dni robocze).`,
          "Regulamin jest udostępniany nieodpłatnie na Stronie w sposób, który pozwala go pobrać, zapisać i wydrukować. Przed złożeniem zamówienia Klient zapoznaje się z Regulaminem i akceptuje go.",
          "Usługi są przeznaczone dla osób pełnoletnich. Osoba niepełnoletnia może skorzystać z usług wyłącznie za zgodą przedstawiciela ustawowego, który składa zamówienie w jej imieniu.",
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "Definicje",
    tresc: [
      {
        definicje: [
          ["Klient", "Osoba fizyczna, osoba prawna albo jednostka organizacyjna, która składa zamówienie."],
          ["Konsument", "Klient będący osobą fizyczną, który kupuje usługę niezwiązaną bezpośrednio z jego działalnością gospodarczą lub zawodową."],
          [
            "Przedsiębiorca na prawach konsumenta",
            "Osoba fizyczna prowadząca jednoosobową działalność gospodarczą, która kupuje usługę związaną z tą działalnością, ale niemającą dla niej charakteru zawodowego (wynika to z wpisu w CEIDG). Przysługują jej prawa konsumenta opisane w § 9 i § 11.",
          ],
          ["Sesja", "Trening personalny jeden na jeden trwający 60 minut, stacjonarny albo online."],
          ["Pakiet", "Określona liczba Sesji kupiona w jednym zamówieniu (3 albo 5)."],
          ["Trening stacjonarny", `Sesja prowadzona osobiście w siłowni ${F.sala}.`],
          ["Trening online", "Sesja prowadzona na żywo przez połączenie wideo, w miejscu wybranym przez Klienta."],
          ["E-book", "Treść cyfrowa w formie pliku PDF, udostępniana elektronicznie, bez nośnika materialnego."],
          ["Plan indywidualny", "Usługa przygotowania 12-tygodniowego planu treningowego na podstawie Ankiety, dostarczanego w formie elektronicznej."],
          ["Prowadzenie", "Usługa świadczona w okresach miesięcznych, obejmująca plan, cotygodniowe podsumowania i korekty, opisana na Stronie."],
          ["Ankieta", "Formularz, w którym Klient po zakupie podaje informacje potrzebne do realizacji usługi, w tym o stanie zdrowia, kontuzjach i dostępności."],
          ["Dzień roboczy", "Dzień od poniedziałku do piątku z wyjątkiem dni ustawowo wolnych od pracy."],
        ],
      },
    ],
  },
  {
    tytul: "Usługi i ceny",
    tresc: [
      "Za pośrednictwem Strony Usługodawca sprzedaje:",
      {
        lista: [
          "Treningi stacjonarne: pojedyncza Sesja albo Pakiet 3 lub 5 Sesji. Cena nie obejmuje wejścia na salę: Klient opłaca je osobno w Just GYM (karnet albo jednorazowe wejście). Pakiety stacjonarne nie mają daty ważności.",
          "Treningi online: pojedyncza Sesja albo Pakiet 3 lub 5 Sesji. Pakiet 3 Sesji należy wykorzystać w ciągu 8 tygodni, a Pakiet 5 Sesji w ciągu 12 tygodni od zakupu. Po tym czasie niewykorzystane Sesje wygasają, chyba że nie odbyły się z przyczyn leżących po stronie Usługodawcy.",
          "E-book.",
          "Plan indywidualny.",
          "Prowadzenie, opłacane z góry za każdy miesiąc i odnawiane automatycznie do czasu rezygnacji (§ 7).",
        ],
        numerowana: true,
      },
      "Szczegółowy opis każdej usługi znajduje się na jej stronie. Opis z chwili złożenia zamówienia jest częścią umowy.",
      "Ceny podane na Stronie są cenami końcowymi w złotych polskich i obejmują wszystkie składniki ceny. Klient nie ponosi kosztów dostawy.",
      "Usługodawca prowadzi działalność nierejestrowaną i korzysta ze zwolnienia podmiotowego z VAT (art. 113 ust. 1 ustawy o podatku od towarów i usług), dlatego ceny nie zawierają podatku VAT. Na życzenie Klient otrzymuje rachunek.",
      "Usługodawca może zmieniać ceny. Zmiana nie dotyczy zamówień opłaconych przed jej wprowadzeniem.",
    ],
  },
  {
    tytul: "Zamówienie i płatność",
    tresc: [
      {
        lista: [
          "Klient wybiera usługę na Stronie i zostaje przekierowany na stronę płatności obsługiwaną przez Stripe Payments Europe, Limited („Stripe”).",
          "Na stronie płatności Klient podaje imię i nazwisko, adres e-mail i numer telefonu, akceptuje Regulamin i wybiera metodę płatności: BLIK, kartę płatniczą, Przelewy24, Google Pay albo Apple Pay. Dostępne metody wyświetla Stripe.",
          "Przy zakupie usług treningowych, Planu indywidualnego i Prowadzenia Klient składa żądanie rozpoczęcia świadczenia usługi przed upływem terminu na odstąpienie od umowy. Przy zakupie E-booka Klient wyraża zgodę na dostarczenie treści cyfrowej przed upływem tego terminu i przyjmuje do wiadomości utratę prawa odstąpienia (§ 9).",
          "Umowa zostaje zawarta z chwilą potwierdzenia płatności przez Stripe. Płatność następuje z góry.",
          "Po zawarciu umowy Klient otrzymuje na podany adres e-mail potwierdzenie zamówienia z numerem zamówienia, treścią zawartej umowy, informacją o złożonym żądaniu lub zgodzie z ust. 3 oraz linkiem do Ankiety. Potwierdzenie stanowi utrwalenie umowy na trwałym nośniku. Usługodawca może dodatkowo wysłać potwierdzenie SMS-em.",
          "Usługodawca nie przechowuje danych kart płatniczych. Płatności przetwarza wyłącznie Stripe.",
          "Usługodawca wystawia rachunek na żądanie Klienta zgłoszone e-mailem z numerem zamówienia.",
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "Realizacja treningów stacjonarnych i online",
    tresc: [
      {
        lista: [
          "Po zakupie Klient wypełnia Ankietę. Jeśli tego nie zrobi, Usługodawca zbierze potrzebne informacje przy pierwszym kontakcie.",
          `W ciągu 24 godzin od zakupu, w Dni robocze, Usługodawca kontaktuje się z Klientem kanałem wskazanym w Ankiecie (telefon z numeru ${F.trener.telefon}, SMS albo e-mail) i proponuje terminy pierwszej Sesji. Termin ustalają strony wspólnie.`,
          "Jeśli w ciągu 14 dni od zakupu strony nie ustalą terminu pierwszej Sesji z przyczyn leżących po stronie Usługodawcy, Klient otrzymuje zwrot całej zapłaconej kwoty.",
          `Treningi stacjonarne odbywają się wyłącznie w siłowni ${F.sala}. Klient przestrzega regulaminu tej siłowni.`,
          "Do Treningu online Klient potrzebuje urządzenia z kamerą i mikrofonem, stabilnego połączenia z internetem i miejsca do ćwiczeń. Komunikator do połączenia (Messenger, WhatsApp albo Discord) strony ustalają przy ustalaniu terminu. Jeśli Klient ćwiczy w siłowni, odpowiada za zgodność ćwiczenia przed kamerą z regulaminem tej siłowni. Usługodawca może pomóc to sprawdzić przed pierwszą Sesją.",
          "Usługodawca nie nagrywa Treningów online bez zgody Klienta. Nagrania przekazywane po Sesji służą wyłącznie Klientowi i nie są publikowane.",
          "Usługodawca może przerwać lub zmodyfikować ćwiczenie, jeśli uzna, że zagraża ono zdrowiu Klienta.",
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "Odwoływanie i przekładanie Sesji",
    tresc: [
      {
        lista: [
          "Trening stacjonarny Klient może odwołać lub przełożyć bez kosztów najpóźniej 24 godziny przed jego rozpoczęciem.",
          "Trening online Klient może odwołać lub przełożyć bez kosztów najpóźniej 12 godzin przed jego rozpoczęciem.",
          "Pierwsze odwołanie w krótszym terminie Usługodawca przekłada bez kosztów. Każde kolejne odwołanie w krótszym terminie albo niestawienie się na Sesji oznacza, że Sesja przepada i jest traktowana jak wykonana.",
          "Choroba Klienta zgłoszona przed Sesją nie powoduje utraty Sesji. Strony ustalają nowy termin.",
          "Spóźnienie Klienta nie wydłuża Sesji.",
          "Jeśli Sesję odwołuje Usługodawca, strony ustalają nowy termin, a gdy to niemożliwe, Klient otrzymuje zwrot za tę Sesję.",
          "Odwołanie lub przełożenie zgłasza się telefonicznie, SMS-em albo e-mailem.",
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "Prowadzenie: płatność cykliczna i rezygnacja",
    tresc: [
      {
        lista: [
          "Prowadzenie jest opłacane z góry za kolejne okresy miesięczne. Płatność za następny miesiąc jest pobierana automatycznie w dniu odpowiadającym dniu pierwszego zakupu, tą samą metodą płatności.",
          `Klient może zrezygnować w każdej chwili, bez podawania przyczyny i bez kosztów: SMS-em lub telefonicznie pod numerem ${FIRMA.trener.telefon} albo e-mailem na adres ${FIRMA.trener.email} lub ${FIRMA.email}. Rezygnacja zatrzymuje kolejne płatności, a Prowadzenie trwa do końca opłaconego miesiąca.`,
          "Rezygnacja zgłoszona najpóźniej w dniu poprzedzającym datę odnowienia zatrzymuje kolejną płatność. Jeśli mimo to płatność zostanie pobrana, Usługodawca zwraca ją w całości w ciągu 14 dni.",
          "Za miesiąc, który już się rozpoczął, nie przysługuje zwrot, z zastrzeżeniem prawa odstąpienia od umowy opisanego w § 9.",
          "Przed zmianą ceny Prowadzenia Usługodawca informuje Klienta e-mailem co najmniej 14 dni wcześniej. Klient, który nie akceptuje nowej ceny, może zrezygnować przed jej wejściem w życie.",
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "E-book i Plan indywidualny",
    tresc: [
      {
        lista: [
          "E-book jest udostępniany przez link przesłany e-mailem niezwłocznie po zawarciu umowy. Dostęp jest bezterminowy, z zastrzeżeniem ust. 4.",
          "Plan indywidualny Usługodawca przygotowuje w ciągu 72 godzin od otrzymania wypełnionej Ankiety i udostępnia go elektronicznie.",
          "Do korzystania z E-booka i Planu indywidualnego potrzebne jest urządzenie z dostępem do internetu i aktualną przeglądarką.",
          "E-book i Plan indywidualny są przeznaczone wyłącznie do osobistego użytku Klienta i są chronione prawem autorskim. Nie wolno ich udostępniać, kopiować w celu rozpowszechniania ani odsprzedawać. W razie rażącego naruszenia tego zakazu Usługodawca może zablokować dostęp do materiałów.",
          "Jeśli E-book albo Plan indywidualny nie zostaną dostarczone albo nie będą działać, Klientowi przysługują uprawnienia opisane w § 11.",
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "Odstąpienie od umowy",
    tresc: [
      {
        uwaga:
          "W skrócie: masz 14 dni na rezygnację z usługi, której jeszcze nie wykonaliśmy, i dostajesz wtedy zwrot pieniędzy. Za usługę, która już się odbyła, zwrotu nie ma. Przy E-booku prawo rezygnacji wygasa, gdy dostaniesz do niego dostęp.",
      },
      {
        lista: [
          "Konsument i Przedsiębiorca na prawach konsumenta mogą odstąpić od umowy bez podawania przyczyny w terminie 14 dni od dnia jej zawarcia.",
          `Aby odstąpić od umowy, wystarczy wysłać przed upływem terminu jednoznaczne oświadczenie, np. e-mailem na adres ${F.email} albo ${F.trener.email}. Można skorzystać ze wzoru formularza zamieszczonego na końcu Regulaminu, ale nie jest to obowiązkowe. Usługodawca niezwłocznie potwierdza otrzymanie oświadczenia e-mailem.`,
          "Usługodawca zwraca płatność w ciągu 14 dni od otrzymania oświadczenia, tą samą metodą płatności, której użył Klient, chyba że Klient zgodzi się na inną. Klient nie ponosi kosztów zwrotu.",
          "Jeśli Klient zażądał rozpoczęcia usługi przed upływem terminu na odstąpienie (§ 4 ust. 3) i część usługi została już wykonana, Klient płaci za usługi spełnione do chwili odstąpienia. Przy Pakiecie jest to cena Pakietu podzielona przez liczbę Sesji, pomnożona przez liczbę Sesji odbytych lub przepadłych zgodnie z § 6 ust. 3. Przy Prowadzeniu jest to część ceny proporcjonalna do liczby dni świadczenia.",
          "Prawo odstąpienia od umowy nie przysługuje:",
        ],
        numerowana: true,
      },
      {
        lista: [
          "przy umowie o usługę, którą Usługodawca wykonał w pełni za wyraźną i uprzednią zgodą Klienta, poinformowanego przed rozpoczęciem usługi, że po jej wykonaniu utraci prawo odstąpienia, i który przyjął to do wiadomości. Dotyczy to w szczególności odbytej pojedynczej Sesji, wykorzystanego w całości Pakietu i dostarczonego Planu indywidualnego;",
          "przy umowie o dostarczenie E-booka, jeśli dostarczanie rozpoczęło się za wyraźną i uprzednią zgodą Klienta przed upływem terminu na odstąpienie, po poinformowaniu go o utracie prawa odstąpienia, a Usługodawca przekazał Klientowi potwierdzenie tej zgody.",
        ],
      },
      "Postanowienia tego paragrafu nie dotyczą Klientów będących przedsiębiorcami innymi niż Przedsiębiorca na prawach konsumenta.",
    ],
  },
  {
    tytul: "Dodatkowe zobowiązania Usługodawcy",
    tresc: [
      "Niezależnie od uprawnień ustawowych Usługodawca zobowiązuje się, że:",
      {
        lista: [
          "zwraca całość ceny, jeśli w ciągu 14 dni od zakupu nie ustalono terminu pierwszej Sesji z przyczyn leżących po stronie Usługodawcy (§ 5 ust. 3);",
          "odlicza całą cenę E-booka od ceny Planu indywidualnego albo pierwszego miesiąca Prowadzenia, jeśli Klient kupi je w ciągu 30 dni od zakupu E-booka i zgłosi to e-mailem przed zakupem. Odliczenie jest rabatem, a nie zwrotem płatności za E-book.",
        ],
      },
      "Poza przypadkami opisanymi w ust. 1 oraz prawem odstąpienia od umowy (§ 9) cena niewykorzystanych Sesji z Pakietu nie podlega zwrotowi.",
      "Zobowiązania jakościowe opisane na Stronie w sekcji „Moja gwarancja” (m.in. pełna uwaga przez całą Sesję, pisemna karta lub notatka po Sesji) nie są gwarancją efektu treningowego. Efekt zależy także od regularności, regeneracji i odżywiania Klienta, na które Usługodawca nie ma wpływu.",
    ],
  },
  {
    tytul: "Reklamacje",
    tresc: [
      {
        lista: [
          `Reklamację można złożyć e-mailem na adres ${F.email} albo ${F.trener.email}${F.adres ? `, albo pisemnie na adres ${F.adres}` : ""}.`,
          "W reklamacji warto podać imię i nazwisko, numer zamówienia, opis problemu i oczekiwany sposób jego rozwiązania. Ułatwia to rozpatrzenie, ale nie jest warunkiem przyjęcia reklamacji.",
          "Usługodawca odpowiada na reklamację w ciągu 14 dni od jej otrzymania, e-mailem albo w inny sposób wskazany przez Klienta. Brak odpowiedzi w tym terminie oznacza uznanie reklamacji.",
          "Jeśli usługa, E-book albo Plan indywidualny są niezgodne z umową, Konsument i Przedsiębiorca na prawach konsumenta mogą żądać doprowadzenia ich do zgodności z umową, a gdy to niemożliwe albo nie nastąpi w rozsądnym czasie, obniżenia ceny albo odstąpienia od umowy, na zasadach ustawy o prawach konsumenta.",
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "Zdrowie i odpowiedzialność",
    tresc: [
      {
        lista: [
          "Trening fizyczny wiąże się z wysiłkiem i ryzykiem urazu. Klient przed rozpoczęciem treningów powinien upewnić się u lekarza, że nie ma przeciwwskazań do wysiłku fizycznego, zwłaszcza gdy choruje przewlekle, jest w ciąży, przyjmuje leki albo jest po urazie.",
          "Klient informuje Usługodawcę w Ankiecie i przed każdą Sesją o kontuzjach, dolegliwościach i zmianach stanu zdrowia. Usługodawca dostosowuje do nich trening.",
          "Usługodawca jest trenerem personalnym. Nie jest lekarzem, fizjoterapeutą ani dietetykiem i nie stawia diagnoz. Wskazówki dotyczące odżywiania mają charakter ogólny. Jeśli stan Klienta wymaga konsultacji specjalisty, Usługodawca o tym informuje.",
          "Klient wykonuje samodzielnie, bez obecności Usługodawcy, ćwiczenia z planu, E-booka i zaleceń między Sesjami. Powinien przerwać ćwiczenie w razie bólu lub niepokojących objawów.",
          "Postanowienia tego paragrafu nie wyłączają ani nie ograniczają odpowiedzialności Usługodawcy wobec Konsumenta wynikającej z bezwzględnie obowiązujących przepisów.",
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "Korzystanie ze Strony i formularzy",
    tresc: [
      {
        lista: [
          "Usługodawca świadczy drogą elektroniczną nieodpłatne usługi: przeglądanie Strony, formularze kontaktowe i zapisowe oraz Ankietę. Umowa o korzystanie z formularza zostaje zawarta z chwilą jego wysłania i wygasa po udzieleniu odpowiedzi. Klient może z niej zrezygnować w każdej chwili, nie wysyłając formularza.",
          "Do korzystania ze Strony potrzebne jest urządzenie z dostępem do internetu, aktualna przeglądarka z włączoną obsługą JavaScript i, do otrzymywania wiadomości, aktywny adres e-mail lub numer telefonu.",
          "Zakazane jest dostarczanie przez Stronę treści o charakterze bezprawnym.",
          `Reklamacje dotyczące działania Strony i formularzy składa się i rozpatruje tak jak w § 11.`,
        ],
        numerowana: true,
      },
    ],
  },
  {
    tytul: "Dane osobowe",
    tresc: [
      "Administratorem danych osobowych Klientów jest Usługodawca. Zasady przetwarzania danych, w tym danych o zdrowiu z Ankiety, opisuje Polityka prywatności dostępna pod adresem /polityka-prywatnosci, a pliki cookies (Google Analytics, Meta Pixel) Polityka cookies pod adresem /polityka-cookies.",
    ],
  },
  {
    tytul: "Pozasądowe rozwiązywanie sporów",
    tresc: [
      "Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, w szczególności:",
      {
        lista: [
          "zwrócić się o bezpłatną pomoc do miejskiego lub powiatowego rzecznika konsumentów;",
          "złożyć wniosek o mediację albo o rozpatrzenie sprawy przez stały polubowny sąd konsumencki przy wojewódzkim inspektoracie Inspekcji Handlowej;",
          "skorzystać z informacji i adresów dostępnych na stronie prokonsument.gov.pl prowadzonej przez UOKiK.",
        ],
      },
      "Skorzystanie z tych sposobów jest dobrowolne i wymaga zgody obu stron.",
    ],
  },
  {
    tytul: "Postanowienia końcowe",
    tresc: [
      {
        lista: [
          "W sprawach nieuregulowanych w Regulaminie stosuje się przepisy prawa polskiego, w szczególności Kodeksu cywilnego, ustawy o prawach konsumenta i ustawy o świadczeniu usług drogą elektroniczną.",
          "Postanowienia Regulaminu nie ograniczają praw Konsumenta ani Przedsiębiorcy na prawach konsumenta wynikających z bezwzględnie obowiązujących przepisów. Postanowienia mniej korzystne niż te przepisy nie obowiązują, a w ich miejsce stosuje się przepisy ustawy.",
          "Usługodawca może zmienić Regulamin z ważnych przyczyn, takich jak zmiana przepisów, zmiana zakresu usług lub metod płatności. Zmiana obowiązuje od daty publikacji na Stronie i nie dotyczy umów zawartych wcześniej. Klientów z aktywnym Prowadzeniem Usługodawca informuje o zmianie e-mailem co najmniej 14 dni przed jej wejściem w życie.",
          "Spory z Konsumentami rozstrzyga sąd właściwy zgodnie z przepisami Kodeksu postępowania cywilnego.",
        ],
        numerowana: true,
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────── WZÓR FORMULARZA
   Załącznik wymagany przez ustawę o prawach konsumenta (załącznik nr 2). */

function WzorOdstapienia() {
  return (
    <section id="formularz-odstapienia" className="mt-16 scroll-mt-8 border-t-4 border-grafit pt-10">
      <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-stal">Załącznik</p>
      <h2 className="mt-3 font-display text-[clamp(1.25rem,1.1rem_+_0.6vw,1.5rem)] leading-tight">
        Wzór formularza odstąpienia od umowy
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-stal">
        Formularz należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy. Możesz też po prostu napisać
        e-mail własnymi słowami.
      </p>

      <div className="mt-6 space-y-4 bg-mgla p-6 font-mono text-[0.875rem] leading-[1.75] text-grafit sm:p-8">
        <p>
          Adresat: {[FIRMA.nazwa, FIRMA.adres, `e-mail: ${FIRMA.email}`].filter(Boolean).join(", ")}
        </p>
        <p>
          Ja/My(*) niniejszym informuję/informujemy(*) o moim/naszym(*) odstąpieniu od umowy o świadczenie następującej
          usługi / dostarczenie następującej treści cyfrowej(*):
        </p>
        <p>.................................................................</p>
        <p>Numer zamówienia: .........................................</p>
        <p>Data zawarcia umowy: .....................................</p>
        <p>Imię i nazwisko konsumenta(-ów): ..........................</p>
        <p>Adres konsumenta(-ów): ....................................</p>
        <p>
          Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej): ..........................
        </p>
        <p>Data: ....................</p>
        <p className="text-stal">(*) Niepotrzebne skreślić.</p>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <StronaPrawna
      tytul="Regulamin"
      wstep={`Zasady zakupu treningów stacjonarnych, treningów online, e-booka, planu indywidualnego i prowadzenia w ${FIRMA.marka}. Najważniejsze punkty: płacisz z góry, termin ustalamy po zakupie, masz 14 dni na rezygnację z usługi, która jeszcze się nie odbyła.`}
      paragrafy={PARAGRAFY}
      zalaczniki={<WzorOdstapienia />}
    />
  );
}