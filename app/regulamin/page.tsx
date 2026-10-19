// STRONA: /konkurs · KONKURS · formularz zgłoszeń, każde zgłoszenie przychodzi mailem na FIRMA.email (firma.ts)
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer, Header } from "@/app/components/sections";
import { KONKURS, TELEFON, TELEFON_HREF, TRASY, TRENER, dataPL, dzienPL } from "@/app/lib/dane";
import { wyslijMail } from "@/app/lib/wyslij-mail";
import { FIRMA } from "@/app/tresc/firma";

export const metadata: Metadata = {
  title: "Konkurs: wygraj 3 treningi personalne w Just GYM Łódź | Maks Treningi",
  description:
    "Napisz w dwóch zdaniach, co chcesz poprawić w treningu, i wygraj trzy sesje jeden na jeden w Just GYM przy Piotrkowskiej w Łodzi. Wartość 420 zł. Bez losowania.",
};

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

/** Pole z firma.ts jest uzupełnione, gdy nie ma w nim „[…]”. */
const jest = (s: string) => Boolean(s.trim()) && !s.includes("[");

const ADMIN = [
  `Administrator danych: ${jest(FIRMA.nazwa) ? FIRMA.nazwa : FIRMA.wlasciciel}`,
  jest(FIRMA.adres) ? FIRMA.adres : "",
  `e-mail: ${FIRMA.email}`,
  `tel. ${FIRMA.telefon}.`,
]
  .filter(Boolean)
  .join(", ")
  .concat(
    " Dane z konkursu usuwam 30 dni po ogłoszeniu wyników, chyba że zgodzisz się na SMS-y o ofertach: wtedy do czasu wycofania zgody.",
  );

// TODO: np. "Każdy uczestnik dostanie SMS-em kod na pierwszą sesję za 120 zł zamiast 150 zł, ważny do 30 listopada."
const DLA_WSZYSTKICH: string | null = null;

const BLEDY: Record<string, string> = {
  dane: "Sprawdź imię, numer telefonu i odpowiedź (co najmniej 20 znaków), a potem wyślij jeszcze raz.",
  zgoda: "Zaakceptuj regulamin, żeby wysłać zgłoszenie.",
  zamkniete: "Zgłoszenia są już zamknięte.",
  serwer: `Zgłoszenie nie doszło. Spróbuj za chwilę albo zadzwoń: ${TELEFON}.`,
};

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

  const poprawne =
    imie && imie.length <= 40 &&
    /^(?:\+?48)?[1-9]\d{8}$/.test(telefon) &&
    odpowiedz.length >= 20 && odpowiedz.length <= 500;
  if (!poprawne) redirect("/konkurs?blad=dane#zgloszenie");
  if (f.get("zgodaRegulamin") !== "on") redirect("/konkurs?blad=zgoda#zgloszenie");

  const zgodaMarketing = f.get("zgodaMarketing") === "on";
  const zgloszono = new Date();

  /* 1 · Mail do Ciebie. */
  let mailOk = false;
  /* Zgłoszenia idą wyłącznie na adres z app/tresc/firma.ts. */
  const trener = FIRMA.email;
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
          `SMS-y marketingowe: ${zgodaMarketing ? "TAK, zgoda wyrażona" : "nie"}`,
          "",
          "ODPOWIEDŹ KONKURSOWA",
          odpowiedz,
        ].join("\n"),
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
        body: JSON.stringify({ imie, telefon, odpowiedz, zgodaMarketing, zgloszono: zgloszono.toISOString() }),
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
    console.error("[konkurs] ZGŁOSZENIE NIEZAPISANE:", { imie, telefon, odpowiedz, zgodaMarketing });
  }

  redirect(mailOk || webhookOk ? "/konkurs?wyslane=1#zgloszenie" : "/konkurs?blad=serwer#zgloszenie");
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ wyslane?: string; blad?: string }>;
}) {
  const { wyslane, blad } = await searchParams;
  const trwa = Date.now() < KONKURS.koniec.getTime();
  const komunikat = blad ? BLEDY[blad] : undefined;

  return (
    <>
      <style>{CSS}</style>
      <Header
        cta={trwa ? "Wyślij zgłoszenie" : "Trening na sali"}
        ctaHref={trwa ? "#zgloszenie" : TRASY.sala}
      />

      <main className="k">
        <section className="k-hero" aria-labelledby="k-tytul">
          <div className="k-w">
            <p className="k-miejsce">Konkurs w Just GYM, Piotrkowska 157A w Łodzi</p>
            <h1 id="k-tytul" className="k-tytul">Wygraj trzy treningi jeden na jeden</h1>
            <p className="k-lead">
              Napisz w dwóch, trzech zdaniach, co chcesz poprawić w swoim treningu. Najbardziej konkretna
              odpowiedź wygrywa trzy sesje ze mną na sali.
            </p>
            <dl className="k-fakty">
              <div><dt>Nagroda</dt><dd>3 sesje po 60 minut, wartość {KONKURS.wartosc}</dd></div>
              <div><dt>Zgłoszenia</dt><dd>{trwa ? `do ${dzienPL(KONKURS.koniec)}` : "zamknięte"}</dd></div>
              <div><dt>Jak wybieram</dt><dd>Czytam każdą odpowiedź. Nie losuję.</dd></div>
            </dl>
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
                <h2 id="k-zgl" className="k-h2">Zgłoszenie wysłane</h2>
                <p>
                  Wyniki do {dataPL(KONKURS.wyniki)}. Jeśli wygrasz, napiszę SMS-em z numeru {TELEFON}.
                  Zapisz go, żeby wiadomość nie wylądowała w spamie.
                </p>
                {DLA_WSZYSTKICH && <p className="k-wyroznienie">{DLA_WSZYSTKICH}</p>}
                <div className="k-dalej">
                  <p className="k-dalej-tytul">Nie chcesz czekać do wyników?</p>
                  <p>
                    Pojedyncza sesja na sali kosztuje 150 zł z wejściem. Termin ustalamy SMS-em w ciągu
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
                  <span className="k-etykieta">Co chcesz poprawić w swoim treningu i dlaczego akurat to?</span>
                  <span className="k-podpowiedz">
                    Napisz, z czym masz problem i od kiedy. Wygrywa konkret, nie długość.
                  </span>
                  <textarea name="odpowiedz" required minLength={20} maxLength={500} className="k-wejscie"
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
              <figcaption>Za ogólnie</figcaption>
              <blockquote>„Chcę być silniejszy i lepiej wyglądać.”</blockquote>
            </figure>
            <figure className="k-przyklad">
              <figcaption>Konkretnie</figcaption>
              <blockquote>
                „Przy martwym ciągu od 60 kg zaokrąglam plecy i po treningu boli mnie lędźwia. Stoję na
                tym ciężarze od dwóch miesięcy i boję się dokładać.”
              </blockquote>
            </figure>
            <figure className="k-przyklad">
              <figcaption>Też konkretnie</figcaption>
              <blockquote>
                „Nigdy nie robiłam przysiadu ze sztangą, bo wstydzę się, że zrobię to źle przy ludziach.
                Chcę się go nauczyć na tyle, żeby robić go sama.”
              </blockquote>
            </figure>
          </section>

          <section className="k-nagroda" aria-labelledby="k-nag">
            <h2 id="k-nag" className="k-h2">Co wygrywasz</h2>
            <p>
              Trzy godziny jeden na jeden, po jednym ruchu na sesję, ustawionym do końca. Stoję obok i
              poprawiam w tej samej serii. Wejście na salę opłacasz osobno w Just GYM. Zaczynamy od ciężaru, który dziś jest
              dla Ciebie właściwy, nawet jeśli to pusta sztanga.
            </p>
            <table className="k-karta">
              <caption>Karta obciążeń zwycięzcy. Zostaje u Ciebie po ostatniej sesji.</caption>
              <thead>
                <tr><th scope="col">Sesja</th><th scope="col">Ruch</th><th scope="col">Ciężar</th><th scope="col">Powt.</th></tr>
              </thead>
              <tbody>
                {["Przysiad", "Martwy ciąg", "Wyciskanie"].map((ruch, i) => (
                  <tr key={ruch}>
                    <th scope="row">{i + 1}</th>
                    <td>{ruch}</td>
                    <td className="k-puste" aria-label="do wpisania" />
                    <td className="k-puste" aria-label="do wpisania" />
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="k-drobne">
              Kolejność ruchów ustalamy na pierwszej sesji. Nagrody nie da się wymienić na gotówkę.
            </p>
          </section>

          <section className="k-zasady" aria-labelledby="k-zas">
            <h2 id="k-zas" className="k-h2">Jak to przebiega</h2>
            <ol className="k-lista">
              <li>Zgłoszenia przyjmuję do {dataPL(KONKURS.koniec)}. Jedno zgłoszenie na osobę.</li>
              <li>Czytam wszystkie odpowiedzi i wybieram tę, która najkonkretniej opisuje problem, z którym da się coś zrobić w trzy sesje.</li>
              <li>Do {dataPL(KONKURS.wyniki)} piszę SMS-em do zwycięzcy z numeru {TELEFON} i ustalamy pierwszy termin.</li>
            </ol>
            <p className="k-kto">
              Prowadzę ja, {TRENER.imie}, trener personalny w Just GYM przy Piotrkowskiej. Pytania o
              konkurs: <a href={TELEFON_HREF}>{TELEFON}</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

const CSS = `
.k{--g:#111820;--s:#D6FF3F;--m:#EDEFF2;--sl:#5F6A77;--l:#D3D8DE;--jas:#B4BCC6;--b:#B42318;color:var(--g);background:var(--m)}
.k-w{box-sizing:border-box;max-width:70rem;margin:0 auto;padding:0 clamp(1rem,4vw,2.5rem)}
.k p{line-height:1.6}

.k-hero{background:var(--g);color:#fff;padding:clamp(2.5rem,6vw,4rem) 0 clamp(2rem,5vw,3rem)}
.k-miejsce{margin:0 0 .9rem;color:var(--s);font-weight:600;font-size:.95rem}
.k-tytul{margin:0 0 1rem;max-width:44rem;font-size:clamp(2.3rem,6vw,4rem);font-weight:800;line-height:1;letter-spacing:-.035em}
.k-lead{margin:0;max-width:36rem;font-size:1.15rem;color:#D5DBE2}
.k-fakty{display:grid;gap:1rem 2.5rem;margin:2.25rem 0 0;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.16)}
@media(min-width:44rem){.k-fakty{grid-template-columns:repeat(3,auto);justify-content:start}}
.k-fakty dt{font-size:.85rem;color:var(--jas);margin-bottom:.2rem}
.k-fakty dd{margin:0;font-weight:700}

.k-uklad{display:grid;gap:2.5rem 4rem;padding-top:clamp(2rem,5vw,3.5rem);padding-bottom:clamp(3rem,7vw,5rem);grid-template-areas:"f" "p" "g" "z"}
.k-formularz{grid-area:f}.k-przyklady{grid-area:p}.k-nagroda{grid-area:g}.k-zasady{grid-area:z}
.k-przyklady,.k-nagroda,.k-zasady{max-width:36rem}
@media(min-width:60rem){
  .k-uklad{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);grid-template-areas:"p f" "g f" "z f";align-items:start}
  .k-formularz{position:sticky;top:1.5rem}
}
.k-formularz{background:#fff;border:1px solid var(--l);border-radius:6px;padding:clamp(1.25rem,3vw,2rem);box-shadow:0 12px 32px -18px rgba(17,24,32,.45)}

.k-h2{margin:0 0 .75rem;font-size:1.45rem;font-weight:800;line-height:1.2;letter-spacing:-.015em}
.k-czas{margin:-.4rem 0 1.25rem;display:block}
.k-drobne{margin:.9rem 0 0;font-size:.85rem;color:var(--sl)}

.k-przyklad{margin:1rem 0 0;padding:1rem 1.1rem;background:#fff;border:1px solid var(--l);border-radius:4px}
.k-przyklad figcaption{font-size:.85rem;font-weight:700;margin-bottom:.35rem;display:flex;align-items:center;gap:.5rem}
.k-przyklad figcaption::before{content:"";width:10px;height:10px;background:var(--s);outline:1px solid var(--g)}
.k-przyklad-slaby figcaption::before{background:transparent}
.k-przyklad-slaby{background:transparent}
.k-przyklad blockquote{margin:0;line-height:1.55}
.k-przyklad-slaby blockquote{color:var(--sl)}

.k-karta{width:100%;margin-top:1.25rem;border-collapse:collapse;background:#fff;font-variant-numeric:tabular-nums}
.k-karta caption{caption-side:top;padding-bottom:.5rem;text-align:left;font-weight:600}
.k-karta th,.k-karta td{border:1px solid var(--l);padding:.7rem .8rem;text-align:left}
.k-karta thead th{font-size:.85rem;font-weight:600;color:var(--sl)}
.k-karta tbody th{width:3.5rem;font-weight:800;background:var(--g);color:var(--s)}
.k-puste{width:5.5rem;background:linear-gradient(to top,var(--l) 1px,transparent 1px) no-repeat .8rem calc(100% - .7rem)/calc(100% - 1.6rem) 100%}

.k-lista{margin:0;padding-left:1.25rem;line-height:1.55}.k-lista li+li{margin-top:.6rem}
.k-lista li::marker{font-weight:800}
.k-kto{margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--l)}
.k-kto a{color:var(--g);font-weight:700}

.k-pole{display:grid;gap:.35rem;margin-bottom:1.1rem}
.k-etykieta{font-weight:700;font-size:.95rem}.k-podpowiedz{font-size:.85rem;color:var(--sl)}
.k-wejscie{box-sizing:border-box;width:100%;padding:.8rem .85rem;font:inherit;color:inherit;background:#fff;border:1px solid #B9C1CA;border-radius:4px}
textarea.k-wejscie{min-height:8rem;resize:vertical}
.k-wejscie::placeholder{color:#8A94A0}
.k-wejscie:focus-visible{outline:3px solid var(--g);outline-offset:1px;border-color:var(--g)}
.k-wejscie:user-invalid{border-color:var(--b)}
.k-blad{margin:0 0 1rem;padding:.75rem .9rem;color:var(--b);background:#FDF0EF;border-radius:4px;font-weight:600}
.k-zgoda{display:grid;grid-template-columns:auto 1fr;gap:.6rem;align-items:start;margin-bottom:.75rem;font-size:.9rem;line-height:1.45}
.k-zgoda input{width:1.15rem;height:1.15rem;margin:.15rem 0 0;accent-color:var(--g)}
.k-zgoda input:focus-visible{outline:3px solid var(--g);outline-offset:2px}.k-zgoda a{color:var(--g);font-weight:600}
.k-przycisk{box-sizing:border-box;display:block;width:100%;margin-top:.75rem;padding:1rem 1.25rem;font:inherit;font-weight:800;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;text-align:center;text-decoration:none;color:var(--g);background:var(--s);border:0;border-radius:2px;cursor:pointer}
.k-przycisk:hover{background:#C6F020}.k-przycisk:focus-visible{outline:3px solid var(--g);outline-offset:3px}
.k-wyroznienie{padding:.9rem 1rem;background:var(--s);font-weight:700;border-radius:4px}
.k-dalej{margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--l)}
.k-dalej-tytul{margin:0 0 .25rem;font-weight:800}
.k-dalej p{margin-top:0}
.k-ukryte{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
`;