// STRONA: /ankieta · ANKIETA PO ZAKUPIE · 3 wersje (sala, online, plan), odpowiedzi idą mailem do trenera
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer, Header } from "@/app/components/sections";
import { wyslijMail } from "@/app/lib/wyslij-mail";
import { FIRMA } from "@/app/tresc/firma";
import { sprawdzLinkAnkiety } from "@/app/lib/maile";

export const metadata: Metadata = {
  title: "Ankieta przed pierwszym treningiem | Maks Treningi",
  /* Strona tylko dla klientów po zakupie: link idzie mailem i SMS-em. */
  robots: { index: false, follow: false },
};

/* ═══════════════════════════════════════════════════════════════════════
   ANKIETA NA STRONIE

   TYLKO DLA KUPUJĄCYCH. Link przychodzi w mailu, SMS-ie i na
   /dziekujemy (po potwierdzeniu płatności w Stripe), np.
     /ankieta?z=MT-4K2P9XAB&t=s&k=Xy3…
   z = numer zamówienia, t = s (sala) / o (online) / p (plan),
   k = podpis z ANKIETA_SEKRET (app/lib/maile.ts). Zły albo brakujący
   podpis: strona pokazuje tylko informację, a wysyłka jest odrzucana.

   Odpowiedzi przychodzą mailem na FIRMA.trener.email (firma.ts),
   z numerem zamówienia w temacie. Nic nie jest zapisywane na stronie.

   Kontuzje to dane o zdrowiu (art. 9 RODO): wysyłamy je tylko z osobną
   zgodą. Bez zgody pole musi zostać puste.

   Pytania zmieniasz w PYTANIA niżej. Kolejność w tablicy = kolejność
   na stronie i w mailu.
   ═══════════════════════════════════════════════════════════════════════ */

type Typ = "sala" | "online" | "plan";

const NAZWY: Record<Typ, string> = {
  sala: "Treningi stacjonarne",
  online: "Trening online (kamerka)",
  plan: "Plan treningowy",
};

type Pole =
  | { id: string; typ: "tekst"; etykieta: string; podpowiedz?: string; wymagane?: boolean; wiersze?: number; zdrowie?: boolean }
  | { id: string; typ: "wybor"; etykieta: string; opcje: string[]; wymagane?: boolean }
  | { id: string; typ: "miejsce"; etykieta: string };

const DOSWIADCZENIE: Pole = {
  id: "doswiadczenie",
  typ: "wybor",
  etykieta: "Jak określisz swoje doświadczenie na siłowni?",
  opcje: [
    "To moja pierwsza wizyta na siłowni",
    "Początkujący",
    "Średnio zaawansowany (ok. rok treningu)",
    "Zaawansowany (3+ lata treningu)",
  ],
  wymagane: true,
};

const CELE: Pole = {
  id: "cele",
  typ: "tekst",
  etykieta: "Opisz swoje cele treningowe",
  podpowiedz:
    "Np. ogólna poprawa sylwetki i siły, poprawa wyników i techniki w przysiadzie, chcę trenować dla zdrowia i sprawności.",
  wymagane: true,
};

const KONTUZJE: Pole = {
  id: "kontuzje",
  typ: "tekst",
  etykieta: "Historia kontuzji",
  podpowiedz:
    "Czy miałeś ostatnio jakieś kontuzje? Czy masz ograniczenia mobilności lub urazy, na które powinienem zwrócić uwagę? Nic takiego? Zostaw puste.",
  zdrowie: true,
};

const TERMINY: Pole = {
  id: "terminy",
  typ: "tekst",
  etykieta: "Preferowane dni i godziny treningów",
  podpowiedz: "Np. poniedziałki i środy po 18:00, soboty rano.",
  wymagane: true,
  wiersze: 3,
};

const KONTAKT: Pole = {
  id: "kontakt",
  typ: "wybor",
  etykieta: "Jak mam się z Tobą kontaktować?",
  opcje: ["Telefonicznie", "SMS", "E-mail"],
  wymagane: true,
};

const MIEJSCE: Pole = { id: "miejsce", typ: "miejsce", etykieta: "Trenujesz w domu czy na siłowni?" };

const PYTANIA: Record<Typ, Pole[]> = {
  sala: [DOSWIADCZENIE, CELE, KONTUZJE, TERMINY, KONTAKT],
  online: [DOSWIADCZENIE, CELE, KONTUZJE, TERMINY, MIEJSCE, KONTAKT],
  plan: [
    CELE,
    KONTUZJE,
    {
      id: "czas",
      typ: "tekst",
      etykieta: "Ile razy w tygodniu chcesz trenować i ile czasu możesz poświęcić na pojedynczy trening?",
      podpowiedz: "Np. 3 razy w tygodniu po 60 minut, w piątek tylko 30 minut.",
      wymagane: true,
      wiersze: 3,
    },
    MIEJSCE,
  ],
};

const BLEDY: Record<string, string> = {
  dane: "Uzupełnij pola oznaczone jako obowiązkowe i wyślij jeszcze raz.",
  zdrowie:
    "Wpisałeś informacje o kontuzjach: zaznacz zgodę na ich przetwarzanie albo usuń je z pola. Bez zgody nie mogę ich przyjąć.",
  sprzet: "Trenujesz w domu: napisz, jaki masz sprzęt.",
  serwer: `Ankieta nie doszła. Spróbuj za chwilę albo zadzwoń: ${FIRMA.trener.telefon}.`,
};

const czysty = (v: FormDataEntryValue | null, max = 1500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function wyslij(formData: FormData) {
  "use server";
  const z = formData.get("z"), t = formData.get("t"), k = formData.get("k");
  /* Podpis sprawdzany jeszcze raz: ukryte pola da się podmienić. */
  const dostep = sprawdzLinkAnkiety(z, t, k);
  if (!dostep) redirect("/ankieta");
  const { numer, typ } = dostep;
  const powrot = (p: string) => {
    const [klucz, wartosc] = p.split("=");
    return `/ankieta?${new URLSearchParams({ z: String(z), t: String(t), k: String(k), [klucz]: wartosc })}`;
  };

  /* Pułapka na boty: pole niewidoczne dla ludzi. */
  if (czysty(formData.get("a_hp_7q"))) redirect(powrot("wyslane=1"));

  const imie = czysty(formData.get("imie"), 80);
  const odpowiedzi: { etykieta: string; wartosc: string }[] = [];
  let brak = !imie;

  for (const pole of PYTANIA[typ]) {
    if (pole.typ === "miejsce") {
      const miejsce = czysty(formData.get("miejsce"), 20);
      const sprzet = czysty(formData.get("sprzet"));
      if (miejsce !== "Na siłowni" && miejsce !== "W domu") brak = true;
      if (miejsce === "W domu" && !sprzet) redirect(powrot("blad=sprzet"));
      odpowiedzi.push({ etykieta: pole.etykieta, wartosc: miejsce });
      if (miejsce === "W domu") odpowiedzi.push({ etykieta: "Sprzęt w domu", wartosc: sprzet });
      continue;
    }
    const wartosc = czysty(formData.get(pole.id));
    if (pole.typ === "wybor" && wartosc && !pole.opcje.includes(wartosc)) brak = true;
    if (pole.wymagane && !wartosc) brak = true;
    if (pole.typ === "tekst" && pole.zdrowie && wartosc && formData.get("zgodaZdrowie") !== "on") {
      redirect(powrot("blad=zdrowie"));
    }
    odpowiedzi.push({ etykieta: pole.etykieta, wartosc: wartosc || "(brak)" });
  }
  if (brak) redirect(powrot("blad=dane"));

  try {
    await wyslijMail({
      do: FIRMA.trener.email,
      temat: `Ankieta · ${NAZWY[typ]} · ${imie} · ${numer}`,
      tresc: [
        `ANKIETA: ${NAZWY[typ].toUpperCase()}`,
        `Imię: ${imie}`,
        `Numer zamówienia: ${numer} (link z zakupu, zweryfikowany)`,
        `Wysłano: ${new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}`,
        "",
        ...odpowiedzi.flatMap((o) => [o.etykieta.toUpperCase(), o.wartosc, ""]),
        formData.get("zgodaZdrowie") === "on"
          ? "Zgoda na przetwarzanie informacji o zdrowiu: TAK"
          : "Zgoda na przetwarzanie informacji o zdrowiu: nie (pole kontuzji puste)",
      ].join("\n"),
    });
  } catch (e) {
    console.error("[ankieta] mail nie wyszedł:", e, { typ, numer, imie });
    redirect(powrot("blad=serwer"));
  }
  redirect(powrot("wyslane=1"));
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ z?: string; t?: string; k?: string; wyslane?: string; blad?: string }>;
}) {
  const sp = await searchParams;
  const dostep = sprawdzLinkAnkiety(sp.z, sp.t, sp.k);
  const typ: Typ | undefined = dostep?.typ;
  const numer = dostep?.numer ?? "";
  const komunikat = sp.blad ? BLEDY[sp.blad] ?? BLEDY.dane : undefined;

  return (
    <>
      <style>{CSS}</style>
      <Header cta="Trening na sali" ctaHref="/trening-stacjonarny" />

      <main className="a">
        <section className="a-hero">
          <div className="a-w">
            <p className="a-miejsce">Ankieta przed pierwszym treningiem{numer ? ` · zamówienie ${numer}` : ""}</p>
            <h1 className="a-tytul">{typ ? NAZWY[typ] : "Ankieta"}</h1>
            <p className="a-lead">
              Kilka pytań, żebym przygotował trening pod Ciebie, a pierwsza rozmowa była krótka i konkretna. Zajmie Ci
              to około 3 minut.
            </p>
          </div>
        </section>

        <div className="a-w a-tresc">
          {sp.wyslane && typ ? (
            <section className="a-karta" role="status">
              <h2 className="a-h2">Dziękuję, ankieta dotarła</h2>
              <p>
                W ciągu 24 godzin w dni robocze zadzwonię z numeru {FIRMA.trener.telefon} albo napiszę SMS-a. Zapisz
                ten numer, żeby nie odrzucić połączenia.
              </p>
            </section>
          ) : !typ ? (
            <section className="a-karta">
              <h2 className="a-h2">Ankieta jest dla osób po zakupie</h2>
              <p>
                Link do ankiety dostajesz po opłaceniu treningu albo planu: w mailu z potwierdzeniem, w SMS-ie i na
                stronie po płatności. Otwórz go stamtąd, bez zmieniania adresu.
              </p>
              <p>
                Kupiłeś, a link nie działa? Zadzwoń albo napisz SMS-a: {FIRMA.trener.telefon}. Chcesz dopiero kupić?
              </p>
              <ul className="a-wybor">
                <li><a className="a-przycisk a-przycisk-jasny" href="/trening-stacjonarny">Trening personalny w Łodzi</a></li>
                <li><a className="a-przycisk a-przycisk-jasny" href="/trening-online">Trening online</a></li>
                <li><a className="a-przycisk a-przycisk-jasny" href="/produkty">Plan treningowy</a></li>
              </ul>
            </section>
          ) : (
            <form action={wyslij} className="a-karta">
              <input type="hidden" name="z" value={sp.z} />
              <input type="hidden" name="t" value={sp.t} />
              <input type="hidden" name="k" value={sp.k} />
              {komunikat && <p role="alert" className="a-blad">{komunikat}</p>}

              <label className="a-pole">
                <span className="a-etykieta">Imię <span className="a-gw">*</span></span>
                <input name="imie" required maxLength={80} autoComplete="given-name" className="a-wejscie" />
              </label>

              {PYTANIA[typ].map((pole) => {
                if (pole.typ === "wybor") {
                  return (
                    <fieldset key={pole.id} className="a-pole a-fieldset">
                      <legend className="a-etykieta">
                        {pole.etykieta} {pole.wymagane && <span className="a-gw">*</span>}
                      </legend>
                      {pole.opcje.map((o) => (
                        <label key={o} className="a-opcja">
                          <input type="radio" name={pole.id} value={o} required={pole.wymagane} />
                          <span>{o}</span>
                        </label>
                      ))}
                    </fieldset>
                  );
                }
                if (pole.typ === "miejsce") {
                  return (
                    <div key={pole.id} className="a-miejsce-blok">
                      <fieldset className="a-pole a-fieldset">
                        <legend className="a-etykieta">{pole.etykieta} <span className="a-gw">*</span></legend>
                        <label className="a-opcja">
                          <input type="radio" name="miejsce" value="Na siłowni" required />
                          <span>Na siłowni</span>
                        </label>
                        <label className="a-opcja">
                          <input type="radio" name="miejsce" value="W domu" required />
                          <span>W domu</span>
                        </label>
                      </fieldset>
                      <label className="a-pole a-sprzet">
                        <span className="a-etykieta">Jaki masz dostępny sprzęt?</span>
                        <span className="a-podpowiedz">Np. hantle 2 × 10 kg, gumy oporowe, drążek, ławka.</span>
                        <textarea name="sprzet" rows={3} maxLength={1500} className="a-wejscie" />
                      </label>
                    </div>
                  );
                }
                return (
                  <div key={pole.id}>
                    <label className="a-pole">
                      <span className="a-etykieta">
                        {pole.etykieta} {pole.wymagane && <span className="a-gw">*</span>}
                      </span>
                      <textarea
                        name={pole.id}
                        required={pole.wymagane}
                        rows={pole.wiersze ?? 4}
                        maxLength={1500}
                        placeholder={pole.podpowiedz}
                        className="a-wejscie"
                      />
                    </label>
                    {pole.zdrowie && (
                      <label className="a-zgoda">
                        <input type="checkbox" name="zgodaZdrowie" />
                        <span>
                          Zgadzam się na przetwarzanie podanych przeze mnie informacji o zdrowiu w celu dostosowania
                          treningu. <span className="a-podpowiedz">Potrzebne tylko, jeśli wpisujesz kontuzje.</span>
                        </span>
                      </label>
                    )}
                  </div>
                );
              })}

              <div className="a-ukryte" aria-hidden="true">
                <label>Zostaw to pole puste <input name="a_hp_7q" tabIndex={-1} autoComplete="new-password" /></label>
              </div>

              <button type="submit" className="a-przycisk">Wyślij ankietę</button>
              <p className="a-drobne">
                Odpowiedzi trafiają tylko do mnie, mailem. Administratorem danych jest {FIRMA.nazwa}, szczegóły w{" "}
                <a href="/polityka-prywatnosci">polityce prywatności</a>. Informacje o zdrowiu usuwam w ciągu 30 dni
                od końca współpracy.
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

const CSS = `
.a{--g:#111820;--s:#D6FF3F;--m:#EDEFF2;--sl:#5F6A77;--l:#D3D8DE;--b:#B42318;color:var(--g);background:var(--m)}
.a-w{box-sizing:border-box;max-width:44rem;margin:0 auto;padding:0 clamp(1rem,4vw,2rem)}
.a p{line-height:1.6}
.a-hero{background:var(--g);color:#fff;padding:clamp(2.25rem,6vw,3.5rem) 0 clamp(1.75rem,5vw,2.5rem)}
.a-miejsce{margin:0 0 .8rem;color:var(--s);font-weight:600;font-size:.95rem}
.a-tytul{margin:0 0 .9rem;font-size:clamp(2rem,6vw,3.2rem);font-weight:800;line-height:1.05;letter-spacing:-.03em}
.a-lead{margin:0;color:#D5DBE2;font-size:1.05rem}
.a-tresc{padding-top:clamp(1.5rem,4vw,2.5rem);padding-bottom:clamp(3rem,7vw,5rem)}
.a-karta{background:#fff;border:1px solid var(--l);border-radius:6px;padding:clamp(1.25rem,3vw,2rem);box-shadow:0 12px 32px -18px rgba(17,24,32,.45)}
.a-h2{margin:0 0 .75rem;font-size:1.4rem;font-weight:800}
.a-pole{display:grid;gap:.4rem;margin:0 0 1.3rem}
.a-fieldset{border:0;padding:0;min-width:0}
.a-etykieta{font-weight:700;font-size:.98rem;padding:0;margin-bottom:.2rem}
.a-gw{color:var(--b)}
.a-podpowiedz{font-size:.85rem;color:var(--sl);font-weight:400}
.a-wejscie{box-sizing:border-box;width:100%;padding:.8rem .85rem;font:inherit;color:inherit;background:#fff;border:1px solid #B9C1CA;border-radius:4px}
textarea.a-wejscie{resize:vertical;min-height:5.5rem}
.a-wejscie::placeholder{color:#8A94A0}
.a-wejscie:focus-visible{outline:3px solid var(--g);outline-offset:1px;border-color:var(--g)}
.a-opcja{display:flex;gap:.65rem;align-items:center;padding:.7rem .85rem;border:1px solid var(--l);border-radius:4px;cursor:pointer}
.a-opcja+.a-opcja{margin-top:.45rem}
.a-opcja:has(input:checked){border-color:var(--g);background:#F6FFD6}
.a-opcja input{width:1.1rem;height:1.1rem;accent-color:var(--g);margin:0}
.a-sprzet{display:none}
.a-miejsce-blok:has(input[value="W domu"]:checked) .a-sprzet{display:grid}
.a-zgoda{display:grid;grid-template-columns:auto 1fr;gap:.6rem;align-items:start;margin:-.6rem 0 1.3rem;font-size:.9rem;line-height:1.45}
.a-zgoda input{width:1.1rem;height:1.1rem;margin:.15rem 0 0;accent-color:var(--g)}
.a-blad{margin:0 0 1rem;padding:.75rem .9rem;color:var(--b);background:#FDF0EF;border-radius:4px;font-weight:600}
.a-przycisk{box-sizing:border-box;display:block;width:100%;padding:1rem 1.25rem;font:inherit;font-weight:800;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;text-align:center;text-decoration:none;color:var(--g);background:var(--s);border:0;border-radius:2px;cursor:pointer}
.a-przycisk:hover{background:#C6F020}.a-przycisk:focus-visible{outline:3px solid var(--g);outline-offset:3px}
.a-przycisk-jasny{background:#fff;border:1px solid var(--g)}
.a-wybor{list-style:none;margin:0;padding:0;display:grid;gap:.6rem}
.a-drobne{margin:1rem 0 0;font-size:.82rem;color:var(--sl)}
.a-drobne a{color:var(--g)}
.a-ukryte{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
`;
