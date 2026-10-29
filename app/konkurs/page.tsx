// STRONA: /konkurs · KONKURS · formularz zgłoszeń, każde zgłoszenie przychodzi mailem na FIRMA.trener.email (firma.ts)
import type { Metadata } from "next";
import { metaStrony } from "@/app/lib/seo";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { ZdarzenieLead } from "@/app/components/ZdarzenieLead";
import { leadDoMety } from "@/app/lib/meta-capi";
import { czytajZgode } from "@/app/lib/sledzenie";
import { Footer, Header, Team } from "@/app/components/sections";
import { ZDJECIA, kadr } from "@/app/tresc/zdjecia";
import { KONKURS, TELEFON, TELEFON_HREF, TRASY, TRENER, dataPL, dzienPL } from "@/app/lib/dane";
import { wyslijMail } from "@/app/lib/wyslij-mail";
import { FIRMA, profile } from "@/app/tresc/firma";

export const metadata: Metadata = metaStrony({
  tytul: "Konkurs: wygraj 3 treningi personalne w Łodzi | Maks Treningi",
  opis:
    "Napisz w dwóch zdaniach, co chcesz poprawić w treningu, i wygraj trzy darmowe sesje jeden na jeden w Just GYM przy Piotrkowskiej w Łodzi. Wartość 420 zł. Bez losowania.",
  sciezka: "/konkurs",
});

/* ═══════════════════════════════════════════════════════════════════════
   KONKURS — cała strona w jednym pliku. Daty i telefon są w app/lib/dane.ts.

   Formularz działa bez JavaScriptu: przeglądarka sprawdza pola sama,
   a zgłoszenie obsługuje server action `wyslij` niżej.

   GDZIE TRAFIA ZGŁOSZENIE
   1. MAIL do Ciebie, wyłącznie na adres z app/tresc/firma.ts
      (maksymilian.lehman.treningi@gmail.com), przez Resend.
   2. Opcjonalnie WEBHOOK (Make, Zapier, n8n → np. arkusz Google), jeśli
      ustawisz KONKURS_WEBHOOK_URL. Bez niego wystarczy sam mail.
   Zgłoszenie uznajemy za przyjęte, gdy doszło przynajmniej jednym z nich.

   ZANIM OPUBLIKUJESZ
   1. Regulamin pod /konkurs/regulamin. Dane administratora (ADMIN) biorą
      się z app/tresc/firma.ts: imię i nazwisko, e-mail, telefon, a adres
      i NIP dopiero wtedy, gdy je tam uzupełnisz.
   2. Pytanie konkursowe zostaw. Bez zadania ocenianego przez Ciebie to jest
      losowanie, czyli loteria promocyjna wymagająca zezwolenia.
   3. DLA_WSZYSTKICH: jeśli chcesz dać coś każdemu uczestnikowi (np. niższą
      cenę pierwszej sesji), wpisz to tutaj i w regulaminie. null = ukryte.
   ═══════════════════════════════════════════════════════════════════════ */

/* NAGRODY
   · Strona ogłasza jedną nagrodę główną: 3 darmowe sesje (420 zł) dla
     najlepszej odpowiedzi. Musisz ją naprawdę przyznać jednej osobie:
     ogłoszenie nagrody, której nikt nie dostaje, to wprowadzanie w błąd.
   · Dodatkowo, bez zapowiadania na stronie: pozostałe konkretne
     odpowiedzi dostają SMS-em „wyróżnienie”, czyli jednorazowy kod
     −140 zł na pakiet 3 sesji (pierwszy trening gratis, za dwa 280 zł).
     Kody: scripts/kody-konkurs.mjs. To bonus ponad obietnicę, więc
     nikt nie traci. Wpisz go też do regulaminu konkursu jako możliwe
     wyróżnienia, bez podawania szczegółów. */

/* Administrator danych z konkursu: trener (firma.ts → trener). */
const ADMIN = `Administrator danych: ${FIRMA.trener.imie}, ${FIRMA.trener.email}, tel. ${FIRMA.trener.telefon}.`
  .concat(
    " Dane z konkursu usuwam 30 dni po ogłoszeniu wyników, chyba że zgodzisz się na SMS-y o ofertach: wtedy do czasu wycofania zgody.",
  );

// TODO: np. "Każdy uczestnik dostanie SMS-em kod na pierwszą sesję za 120 zł zamiast 150 zł, ważny do 30 listopada."
const DLA_WSZYSTKICH: string | null = null;

/* Sekcja „Kto prowadzi” na dole strony. Treść jak na stronie głównej. */
const TRENER_KONKURS = {
  heading: "Kto prowadzi konkurs i treningi",
  name: "Maksymilian Lehman",
  role: "Trener personalny · Just GYM, Piotrkowska 157A, Łódź",
  paragraphs: [
    "Pracuję z ludźmi o różnym poziomie zaawansowania i w bardzo różnym wieku. Prowadzę zarówno treningi pod cele sportowe, jak i treningi prozdrowotne. Nie boję się pracy z osobami po kontuzjach i wiem, kiedy trzeba skorzystać z pomocy fizjoterapeuty albo ortopedy.",
    "Pierwszy raz przyszedłem na siłownię 9 lat temu. Zaczynałem od pustej sztangi i nie potrafiłem podciągnąć się na drążku. Próbowałem treningu kulturystycznego i kalisteniki, aż odkryłem trójbój siłowy. Największą motywacją okazały się dla mnie wyniki w przysiadzie, wyciskaniu i martwym ciągu.",
    "Jestem pasjonatem i zawodnikiem trójboju siłowego, ale na co dzień pracuję z lekarzami, informatykami, sportowcami, kobietami po ciąży i osobami, które dopiero zaczynają. To ja czytam każde zgłoszenie i to ze mną zwycięzca spędzi trzy sesje.",
  ],
};

const BLEDY: Record<string, string> = {
  dane: "Sprawdź imię, numer telefonu, e-mail i odpowiedź, a potem wyślij jeszcze raz.",
  zgoda: "Zaakceptuj regulamin, żeby wysłać zgłoszenie.",
  zamkniete: "Zgłoszenia są już zamknięte.",
  serwer: `Zgłoszenie nie doszło. Spróbuj za chwilę albo zadzwoń: ${TELEFON}.`,
};

/** Mail do uczestnika zaraz po wysłaniu zgłoszenia. */
function mailPotwierdzenia(imie: string, odpowiedz: string) {
  const strona = (process.env.SITE_URL || FIRMA.strona).replace(/\/+$/, "");
  return [
    `Cześć ${imie},`,
    "",
    "dziękuję za zgłoszenie do konkursu „Wygraj trzy treningi jeden na jeden”. Dotarło i biorę je pod uwagę.",
    "",
    "TWOJA ODPOWIEDŹ",
    odpowiedz,
    "",
    "CO DALEJ",
    `Zgłoszenia przyjmuję do ${dataPL(KONKURS.koniec)}.`,
    `Wyniki ogłoszę do ${dataPL(KONKURS.wyniki)}. Czytam każdą odpowiedź, nie losuję.`,
    `Jeśli wygrasz, napiszę SMS-em z numeru ${TELEFON}. Zapisz go, żeby wiadomość nie umknęła.`,
    "",
    ...(profile().length
      ? [
          `Do czasu wyników możesz mnie obserwować: ${profile().map((p) => `${p.nazwa} ${p.url}`).join(", ")}. To dobrowolne i nie wpływa na wybór zwycięzcy.`,
          "",
        ]
      : []),
    `Nie chcesz czekać do wyników? Pojedyncza sesja w Just GYM przy Piotrkowskiej kosztuje 150 zł: ${strona}${TRASY.sala}`,
    "",
    `Regulamin konkursu: ${strona}/konkurs/regulamin`,
    `Pytania? Odpisz na tego maila albo zadzwoń: ${TELEFON}.`,
    "",
    "Maks",
    "Maks Treningi",
  ].join("\n");
}

/** 666222699 / +48666222699 → "+48 666 222 699" (do maila, żeby dało się kliknąć i zadzwonić). */
function telefonCzytelny(t: string) {
  const cyfry = t.replace(/\D/g, "").replace(/^48(?=\d{9}$)/, "");
  return cyfry.length === 9 ? `+48 ${cyfry.slice(0, 3)} ${cyfry.slice(3, 6)} ${cyfry.slice(6)}` : t;
}

async function wyslij(f: FormData) {
  "use server";
  const t = (k: string) => String(f.get(k) ?? "").trim();

  if (Date.now() > KONKURS.koniec.getTime()) redirect("/konkurs?blad=zamkniete#zgloszenie");
  /* Pułapka na boty. Nazwa celowo nic nie znaczy: pole „firma” potrafiło
     uzupełnić autouzupełnianie przeglądarki i prawdziwe zgłoszenie
     znikało po cichu. */
  if (t("k_hp_9x")) {
    console.warn("[konkurs] pominięte jako bot (wypełnione ukryte pole)");
    redirect("/konkurs?wyslane=1#zgloszenie");
  }

  const imie = t("imie");
  const telefon = t("telefon").replace(/[\s()-]/g, "");
  const odpowiedz = t("odpowiedz");
  const email = t("email").toLowerCase();

  const poprawne =
    imie && imie.length <= 40 &&
    /^(?:\+?48)?[1-9]\d{8}$/.test(telefon) &&
    email.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) &&
    /* Bez limitu dla uczestnika; 10 000 znaków to tylko bezpiecznik przed botami. */
    odpowiedz.length > 0 && odpowiedz.length <= 10000;
  if (!poprawne) redirect("/konkurs?blad=dane#zgloszenie");
  if (f.get("zgodaRegulamin") !== "on") redirect("/konkurs?blad=zgoda#zgloszenie");

  const zgodaMarketing = f.get("zgodaMarketing") === "on";
  const zgloszono = new Date();

  /* 1 · Mail do Ciebie. */
  let mailOk = false;
  /* Zgłoszenia idą wyłącznie na adres z app/tresc/firma.ts. */
  const trener = FIRMA.trener.email;
  if (trener) {
    try {
      await wyslijMail({
        do: trener,
        temat: `Konkurs: nowe zgłoszenie · ${imie}`,
        tresc: [
          "NOWE ZGŁOSZENIE DO KONKURSU",
          `Wysłane: ${zgloszono.toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}`,
          "",
          "UCZESTNIK",
          `Imię:     ${imie}`,
          `Telefon:  ${telefonCzytelny(telefon)}`,
          `E-mail:   ${email}`,
          `SMS-y marketingowe: ${zgodaMarketing ? "TAK, zgoda wyrażona" : "nie"}`,
          "",
          "ODPOWIEDŹ KONKURSOWA",
          odpowiedz,
        ].join("\n"),
        odpowiedzDo: email,
      });
      mailOk = true;
      console.log(`[konkurs] mail wysłany do ${trener} (${imie})`);
    } catch (e) {
      console.error("[konkurs] mail nie wyszedł:", e);
    }
  } else {
    console.error("[konkurs] Brak adresu w firma.ts");
  }

  /* 2 · Opcjonalnie webhook (arkusz). */
  let webhookOk = false;
  const url = process.env.KONKURS_WEBHOOK_URL;
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imie, telefon, email, odpowiedz, zgodaMarketing, zgloszono: zgloszono.toISOString() }),
        signal: AbortSignal.timeout(8000),
      });
      webhookOk = res.ok;
    } catch (e) {
      console.error("[konkurs] webhook:", e);
    }
  }

  /* Bez maila i bez webhooka zgłoszenie by przepadło: pokazujemy błąd,
     a dane zostają w logach Vercela, żeby nic nie zginęło. */
  if (!mailOk && !webhookOk) {
    console.error("[konkurs] ZGŁOSZENIE NIEZAPISANE:", { imie, telefon, email, odpowiedz, zgodaMarketing });
  }

  if (!mailOk && !webhookOk) redirect("/konkurs?blad=serwer#zgloszenie");

  /* 2b · Potwierdzenie dla uczestnika. Błąd nie blokuje zgłoszenia:
     zgłoszenie już dotarło do trenera. Odpowiedź na ten mail trafia do trenera. */
  try {
    await wyslijMail({
      do: email,
      temat: "Twoje zgłoszenie do konkursu dotarło · Maks Treningi",
      tresc: mailPotwierdzenia(imie, odpowiedz),
      odpowiedzDo: FIRMA.trener.email,
    });
  } catch (e) {
    console.error("[konkurs] potwierdzenie do uczestnika nie wyszło:", e);
  }

  /* 3 · Zgłoszenie do Mety jako „Lead” (reklamy na leady uczą się na nim).
     Tylko przy zgodzie na cookies marketingowe. Ten sam id dostaje Pixel
     na stronie po przekierowaniu, więc Meta liczy zgłoszenie raz. */
  const eventId = randomUUID();
  const ciastka = await cookies();
  const h = await headers();
  if (czytajZgode(h.get("cookie"))?.m) {
    const strona = (process.env.SITE_URL || FIRMA.strona).replace(/\/+$/, "");
    await leadDoMety({
      eventId,
      zrodlo: "Konkurs",
      url: `${strona}/konkurs`,
      telefon,
      imie,
      email,
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
      ua: h.get("user-agent") || undefined,
      fbp: ciastka.get("_fbp")?.value,
      fbc: ciastka.get("_fbc")?.value,
    });
  }

  redirect(`/konkurs?wyslane=1&e=${eventId}#zgloszenie`);
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ wyslane?: string; blad?: string; e?: string }>;
}) {
  const { wyslane, blad, e } = await searchParams;
  const idZgloszenia = typeof e === "string" && /^[0-9a-f-]{36}$/.test(e) ? e : undefined;
  const trwa = Date.now() < KONKURS.koniec.getTime();
  const komunikat = blad ? BLEDY[blad] : undefined;

  return (
    <>
      <style>{CSS}</style>
      <Header
        cta={trwa ? "Wyślij zgłoszenie" : "Trening na sali"}
        ctaKrotko={trwa ? "Weź udział" : "Trening na sali"}
        ctaHref={trwa ? "#zgloszenie" : TRASY.sala}
      />

      <main className="k">
        <section className="k-hero" aria-labelledby="k-tytul">
          <div className="k-w k-hero-uklad">
            <div className="k-hero-tekst">
              <p className="k-miejsce">Konkurs w Just GYM, Piotrkowska 157A w Łodzi</p>
              <h1 id="k-tytul" className="k-tytul">Wygraj trzy treningi jeden na jeden</h1>
              <p className="k-lead">
                Napisz w dwóch, trzech zdaniach, co chcesz poprawić w swoim treningu. Najbardziej konkretna
                odpowiedź wygrywa trzy darmowe sesje ze mną na sali.
              </p>
              {trwa ? (
                <>
                  <a className="k-przycisk k-przycisk-hero" href="#zgloszenie">Napisz zgłoszenie</a>
                  <p className="k-termin">
                    Zgłoszenia do <strong>{dzienPL(KONKURS.koniec)}</strong>. Czytam każdą odpowiedź, nie losuję.
                  </p>
                </>
              ) : (
                <p className="k-termin">Zgłoszenia są już zamknięte.</p>
              )}
            </div>

            {/* Nagroda: karta, którą zwycięzca dostaje po ostatniej sesji. */}
            <figure className="k-nagroda-karta" aria-labelledby="k-karta-podpis">
              <div className="k-karta-gora">
                <span>Karta obciążeń</span>
                <span className="k-karta-wartosc">
                  <s>{KONKURS.wartosc}</s> 0 zł
                </span>
              </div>
              <table className="k-karta">
                <thead>
                  <tr><th scope="col">Sesja</th><th scope="col">Ruch</th><th scope="col">Ciężar</th><th scope="col">Powt.</th></tr>
                </thead>
                <tbody>
                  {["Przysiad", "Martwy ciąg", "Wyciskanie"].map((ruch, i) => (
                    <tr key={ruch}>
                      <th scope="row">{i + 1}</th>
                      <td>{ruch}</td>
                      <td className="k-puste"><span className="k-sr">do wpisania</span></td>
                      <td className="k-puste"><span className="k-sr">do wpisania</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <figcaption id="k-karta-podpis">
                Nagroda: 3 sesje po 60 minut jeden na jeden. Karta zostaje u Ciebie po ostatniej.
              </figcaption>
            </figure>
          </div>
        </section>

        <div className="k-w k-uklad">
          <section id="zgloszenie" className="k-formularz" aria-labelledby="k-zgl">
            {!trwa ? (
              <>
                <h2 id="k-zgl" className="k-h2">Konkurs zakończony</h2>
                <p>Zgłoszenia zamknięte. Zwycięzcę powiadomię SMS-em do {dataPL(KONKURS.wyniki)}.</p>
                <p>Nie chcesz czekać na kolejny konkurs? Pierwsza sesja na sali kosztuje 150 zł.</p>
                <a className="k-przycisk" href={TRASY.sala}>Zobacz trening na sali</a>
              </>
            ) : wyslane ? (
              <div role="status">
                {idZgloszenia && <ZdarzenieLead id={idZgloszenia} zrodlo="Konkurs" />}
                <h2 id="k-zgl" className="k-h2">Zgłoszenie wysłane</h2>
                <p>
                  Wyniki do {dataPL(KONKURS.wyniki)}. Jeśli wygrasz, napiszę SMS-em z numeru {TELEFON}.
                  Zapisz go, żeby wiadomość nie wylądowała w spamie.
                </p>
                {DLA_WSZYSTKICH && <p className="k-wyroznienie">{DLA_WSZYSTKICH}</p>}
                {profile().length > 0 && (
                  <div className="k-obserwuj">
                    <p className="k-dalej-tytul">Zostańmy w kontakcie do wyników</p>
                    <p>Obserwuj mnie, żeby zobaczyć, z kim będziesz trenować, jeśli wygrasz.</p>
                    <div className="k-obserwuj-linki">
                      {profile().map((p) => (
                        <a key={p.nazwa} className="k-przycisk k-przycisk-obrys" href={p.url}
                          target="_blank" rel="noopener noreferrer">
                          {p.nazwa}
                        </a>
                      ))}
                    </div>
                    <p className="k-drobne">Dobrowolne. Nie ma wpływu na wybór zwycięzcy.</p>
                  </div>
                )}
                <div className="k-dalej">
                  <p className="k-dalej-tytul">Nie chcesz czekać do wyników?</p>
                  <p>
                    Pojedyncza sesja na sali kosztuje 150 zł. Termin ustalamy SMS-em w ciągu
                    24 godzin od zakupu.
                  </p>
                  <a className="k-przycisk" href={TRASY.sala}>Zobacz trening na sali</a>
                </div>
              </div>
            ) : (
              <form action={wyslij}>
                <h2 id="k-zgl" className="k-h2">Twoje zgłoszenie</h2>
                <p className="k-podpowiedz k-czas">Zajmie Ci to około dwóch minut.</p>
                {komunikat && <p role="alert" className="k-blad">{komunikat}</p>}

                <label className="k-pole">
                  <span className="k-etykieta">Imię</span>
                  <input name="imie" required maxLength={40} autoComplete="given-name" className="k-wejscie" />
                </label>

                <label className="k-pole">
                  <span className="k-etykieta">Numer telefonu</span>
                  <span className="k-podpowiedz">Na ten numer napiszę, jeśli wygrasz.</span>
                  <input name="telefon" type="tel" required inputMode="tel" autoComplete="tel"
                    pattern="(\+?48)? ?[1-9]( ?[0-9]){8}" title="9 cyfr, np. 600 100 200"
                    className="k-wejscie" />
                </label>

                <label className="k-pole">
                  <span className="k-etykieta">E-mail</span>
                  <span className="k-podpowiedz">Wyślę na niego potwierdzenie zgłoszenia.</span>
                  <input name="email" type="email" required maxLength={120} autoComplete="email"
                    inputMode="email" className="k-wejscie" />
                </label>

                <label className="k-pole">
                  <span className="k-etykieta">Co chcesz poprawić w swoim treningu i dlaczego akurat to?</span>
                  <span className="k-podpowiedz">
                    Napisz, z czym masz problem i od kiedy. Wygrywa konkret, nie długość.
                  </span>
                  <textarea name="odpowiedz" required className="k-wejscie"
                    placeholder="Np. przy przysiadzie ze sztangą od 50 kg…" />
                </label>

                <div className="k-ukryte" aria-hidden="true">
                  <label>Zostaw to pole puste <input name="k_hp_9x" tabIndex={-1} autoComplete="new-password" /></label>
                </div>

                <label className="k-zgoda">
                  <input type="checkbox" name="zgodaRegulamin" required />
                  <span>
                    Akceptuję <a href="/konkurs/regulamin">regulamin konkursu</a> i zgadzam się na
                    przetwarzanie moich danych w celu jego przeprowadzenia.
                  </span>
                </label>
                <label className="k-zgoda">
                  <input type="checkbox" name="zgodaMarketing" />
                  <span>
                    Chcę dostawać SMS-y o wolnych terminach i nowych ofertach. Mogę z tego zrezygnować
                    w każdej chwili. <span className="k-podpowiedz">Nieobowiązkowe.</span>
                  </span>
                </label>

                <button type="submit" className="k-przycisk">Wyślij zgłoszenie</button>
                <p className="k-drobne">{ADMIN}</p>
              </form>
            )}
          </section>

          <section className="k-przyklady" aria-labelledby="k-prz">
            <h2 id="k-prz" className="k-h2">Jaka odpowiedź wygrywa</h2>
            <p>
              Szukam problemu, z którym da się coś zrobić w trzy sesje. Nie musisz umieć trenować ani
              pisać ładnie. Wystarczy, że opiszesz, co się dzieje.
            </p>
            <figure className="k-przyklad k-przyklad-slaby">
              <figcaption><span className="k-znak" aria-hidden="true">✕</span>Za ogólnie</figcaption>
              <blockquote>„Chcę być silniejszy i lepiej wyglądać.”</blockquote>
            </figure>
            <figure className="k-przyklad">
              <figcaption><span className="k-znak" aria-hidden="true">✓</span>Konkretnie</figcaption>
              <blockquote>
                „Przy martwym ciągu od 60 kg zaokrąglam plecy i po treningu boli mnie lędźwia. Stoję na
                tym ciężarze od dwóch miesięcy i boję się dokładać.”
              </blockquote>
            </figure>
            <figure className="k-przyklad">
              <figcaption><span className="k-znak" aria-hidden="true">✓</span>Też konkretnie</figcaption>
              <blockquote>
                „Nigdy nie robiłam przysiadu ze sztangą, bo wstydzę się, że zrobię to źle przy ludziach.
                Chcę się go nauczyć na tyle, żeby robić go sama.”
              </blockquote>
            </figure>
          </section>

          <section className="k-nagroda" aria-labelledby="k-nag">
            <h2 id="k-nag" className="k-h2">Co wygrywasz</h2>
            <p>
              Trzy godziny jeden na jeden, za darmo, po jednym ruchu na sesję, ustawionym do końca. Stoję
              obok i poprawiam w tej samej serii. Wejście na salę opłacasz osobno w Just GYM. Zaczynamy od ciężaru, który dziś jest
              dla Ciebie właściwy, nawet jeśli to pusta sztanga.
            </p>
            <p className="k-drobne">
              Kolejność ruchów ustalamy na pierwszej sesji. Nagrody nie da się wymienić na gotówkę.
            </p>
          </section>

          <section className="k-zasady" aria-labelledby="k-zas">
            <h2 id="k-zas" className="k-h2">Jak to przebiega</h2>
            <ol className="k-os">
              <li>
                <span className="k-os-kiedy">do {dzienPL(KONKURS.koniec)}</span>
                <span>Przyjmuję zgłoszenia, do {dataPL(KONKURS.koniec)}. Jedno zgłoszenie na osobę.</span>
              </li>
              <li>
                <span className="k-os-kiedy">potem</span>
                <span>Czytam wszystkie odpowiedzi i wybieram tę, która najkonkretniej opisuje problem, z którym da się coś zrobić w trzy sesje.</span>
              </li>
              <li>
                <span className="k-os-kiedy">do {dzienPL(KONKURS.wyniki)}</span>
                <span>Piszę SMS-em do zwycięzcy z numeru {TELEFON} i ustalamy pierwszy termin.</span>
              </li>
            </ol>
            <p className="k-kto">
              Prowadzę ja, {TRENER.imie}, trener personalny w Just GYM przy Piotrkowskiej. Pytania o
              konkurs: <a href={TELEFON_HREF}>{TELEFON}</a>.
            </p>
          </section>
        </div>

        {/* Kto prowadzi: ten sam opis i zdjęcie co na stronie głównej. */}
        <Team
          {...TRENER_KONKURS}
          {...kadr(ZDJECIA.stacjonarny.team)}
          cta={trwa ? "Wyślij zgłoszenie" : "Zobacz trening na sali"}
          ctaHref={trwa ? "#zgloszenie" : TRASY.sala}
          odstepGora
        />
      </main>

      <Footer />
    </>
  );
}

const CSS = `
.k{--g:#111820;--g2:#1B2430;--s:#D6FF3F;--m:#EDEFF2;--sl:#5F6A77;--l:#D3D8DE;--jas:#B4BCC6;--b:#B42318;--papier:#FBFBF8;color:var(--g);background:var(--m)}
.k-w{box-sizing:border-box;max-width:72rem;margin:0 auto;padding:0 clamp(1rem,4vw,2.5rem)}
.k p{line-height:1.6}
.k-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}

/* HERO: tekst po lewej, karta-nagroda po prawej */
.k-hero{position:relative;overflow:hidden;background:var(--g);color:#fff;padding:clamp(2.5rem,7vw,5rem) 0 clamp(3rem,7vw,5.5rem);
  background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:48px 48px}
.k-hero-uklad{display:grid;gap:clamp(2.5rem,6vw,4rem);align-items:center}
@media(min-width:60rem){.k-hero-uklad{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr)}}
.k-miejsce{margin:0 0 1rem;color:var(--s);font-weight:600;font-size:.95rem}
.k-tytul{margin:0 0 1.1rem;max-width:13ch;font-family:var(--font-display);font-size:clamp(2.6rem,7vw,4.75rem);font-weight:800;line-height:.98;letter-spacing:-.04em;text-wrap:balance}
.k-lead{margin:0;max-width:34rem;font-size:clamp(1.05rem,1.6vw,1.2rem);color:#D5DBE2}
.k-przycisk.k-przycisk-hero{display:inline-block;width:auto;margin-top:2rem;padding:1.05rem 2.25rem}
@media(max-width:35rem){.k-przycisk.k-przycisk-hero{display:block;width:100%}}
.k-termin{margin:1rem 0 0;font-size:.95rem;color:var(--jas)}
.k-termin strong{color:#fff}

/* Karta-nagroda: papier na grafitowym tle, lekko obrócona */
.k-nagroda-karta{margin:0;justify-self:center;width:100%;max-width:27rem;background:var(--papier);color:var(--g);
  padding:1.1rem 1.1rem 1rem;transform:rotate(-2deg);box-shadow:0 30px 60px -25px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.06)}
.k-karta-gora{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding-bottom:.75rem;margin-bottom:.75rem;border-bottom:2px solid var(--g);font-family:var(--font-display);font-weight:800;font-size:1.1rem}
.k-karta-wartosc{font-size:1.5rem;background:var(--s);padding:.1rem .5rem;white-space:nowrap}
.k-karta-wartosc s{font-size:.9rem;font-weight:600;color:var(--sl);margin-right:.35rem}
.k-karta{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:.95rem}
.k-karta th,.k-karta td{border-bottom:1px solid var(--l);padding:.8rem .5rem;text-align:left}
.k-karta thead th{font-size:.8rem;font-weight:600;color:var(--sl);padding-top:0}
.k-karta tbody th{width:2.25rem;font-family:var(--font-display);font-weight:800;font-size:1.15rem}
.k-puste{width:4.5rem;background:linear-gradient(to top,#9AA3AE 1px,transparent 1px) no-repeat .5rem calc(100% - .75rem)/calc(100% - 1rem) 100%}
.k-nagroda-karta figcaption{margin-top:.85rem;font-size:.85rem;line-height:1.45;color:var(--sl)}
/* Bez animacji: karta stoi od razu, przewijanie do formularza bez płynnego przesuwania. */
html:has(.k){scroll-behavior:auto!important}
@media(max-width:59.99rem){.k-nagroda-karta{transform:rotate(-1.5deg);max-width:24rem}}

/* TREŚĆ: opis po lewej, formularz po prawej (na telefonie formularz pierwszy) */
.k-uklad{display:grid;gap:3rem 4.5rem;padding-top:clamp(2.5rem,6vw,4rem);padding-bottom:clamp(3rem,7vw,5rem);grid-template-areas:"f" "p" "g" "z"}
.k-formularz{grid-area:f}.k-przyklady{grid-area:p}.k-nagroda{grid-area:g}.k-zasady{grid-area:z}
.k-przyklady,.k-nagroda,.k-zasady{max-width:36rem}
@media(min-width:60rem){
  .k-uklad{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);grid-template-areas:"p f" "g f" "z f";align-items:start}
  .k-formularz{position:sticky;top:1.5rem;margin-top:calc(-1 * clamp(4rem,8vw,6rem))}
}
@media(max-width:59.99rem){.k-formularz{margin-top:calc(-1 * clamp(2rem,5vw,3rem))}}
.k-formularz{position:relative;background:#fff;border-top:6px solid var(--s);padding:clamp(1.5rem,3.5vw,2.75rem);box-shadow:0 24px 48px -24px rgba(17,24,32,.5)}

.k-h2{margin:0 0 .75rem;font-family:var(--font-display);font-size:clamp(1.4rem,2.6vw,1.75rem);font-weight:800;line-height:1.15;letter-spacing:-.02em}
.k-formularz .k-h2{font-size:clamp(1.65rem,3vw,2.15rem)}
.k-czas{margin:-.4rem 0 1.25rem;display:block}
.k-drobne{margin:.9rem 0 0;font-size:.85rem;color:var(--sl)}

.k-przyklad{margin:1rem 0 0;padding:1rem 1.15rem;background:#fff;border-left:4px solid var(--s)}
.k-przyklad figcaption{font-size:.85rem;font-weight:700;margin-bottom:.4rem;display:flex;align-items:center;gap:.55rem}
.k-znak{display:inline-grid;place-items:center;width:1.25rem;height:1.25rem;font-size:.75rem;background:var(--s);color:var(--g)}
.k-przyklad-slaby{background:transparent;border-left-color:var(--l)}
.k-przyklad-slaby .k-znak{background:var(--l);color:var(--sl)}
.k-przyklad blockquote{margin:0;line-height:1.55}
.k-przyklad-slaby blockquote{color:var(--sl);text-decoration:line-through;text-decoration-color:rgba(95,106,119,.5)}

.k-os{list-style:none;margin:0;padding:0;border-left:2px solid var(--g)}
.k-os li{position:relative;display:grid;gap:.2rem;padding:0 0 1.4rem 1.4rem;line-height:1.55}
.k-os li:last-child{padding-bottom:0}
.k-os li::before{content:"";position:absolute;left:-7px;top:.35rem;width:12px;height:12px;background:var(--g)}
.k-os li:last-child::before{background:var(--s);outline:2px solid var(--g)}
.k-os-kiedy{font-family:var(--font-display);font-weight:800}
.k-kto{margin-top:1.75rem;padding-top:1.25rem;border-top:1px solid var(--l)}
.k-kto a{color:var(--g);font-weight:700}

.k-pole{display:grid;gap:.45rem;margin-bottom:1.4rem}
.k-etykieta{font-weight:700;font-size:1.05rem}.k-podpowiedz{font-size:.9rem;color:var(--sl)}
.k-wejscie{box-sizing:border-box;width:100%;min-height:3.5rem;padding:1rem 1.1rem;font:inherit;font-size:1.1rem;color:inherit;background:#fff;border:1px solid #B9C1CA;border-radius:0}
textarea.k-wejscie{min-height:11rem;resize:vertical;line-height:1.5}
.k-wejscie::placeholder{color:#8A94A0}
.k-wejscie:focus-visible{outline:3px solid var(--g);outline-offset:1px;border-color:var(--g)}
.k-wejscie:user-invalid{border-color:var(--b)}
.k-blad{margin:0 0 1rem;padding:.75rem .9rem;color:var(--b);background:#FDF0EF;font-weight:600}
.k-zgoda{display:grid;grid-template-columns:auto 1fr;gap:.75rem;align-items:start;margin-bottom:1rem;font-size:.95rem;line-height:1.5;cursor:pointer}
.k-zgoda input{width:1.35rem;height:1.35rem;margin:.1rem 0 0;accent-color:var(--g)}
.k-zgoda input:focus-visible{outline:3px solid var(--g);outline-offset:2px}.k-zgoda a{color:var(--g);font-weight:600}
.k-przycisk{box-sizing:border-box;display:block;width:100%;margin-top:.75rem;padding:1.25rem 1.5rem;font:inherit;font-weight:800;font-size:1.1rem;text-align:center;text-decoration:none;color:var(--g);background:var(--s);border:0;cursor:pointer}
.k-przycisk:hover{background:#C6F020}.k-przycisk:focus-visible{outline:3px solid #fff;outline-offset:3px;box-shadow:0 0 0 6px var(--g)}
.k-wyroznienie{padding:.9rem 1rem;background:var(--s);font-weight:700}
.k-dalej{margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--l)}
.k-dalej-tytul{margin:0 0 .25rem;font-weight:800}
.k-dalej p{margin-top:0}
.k-ukryte{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.k-obserwuj{margin-top:1.5rem;padding:1.25rem;background:var(--m)}
.k-obserwuj p{margin:0 0 .9rem}.k-obserwuj .k-drobne{margin:.75rem 0 0}
.k-obserwuj-linki{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.k-przycisk.k-przycisk-obrys{margin-top:0;padding:1rem;background:#fff;box-shadow:inset 0 0 0 2px var(--g)}
.k-przycisk.k-przycisk-obrys:hover{background:var(--s)}
`;
