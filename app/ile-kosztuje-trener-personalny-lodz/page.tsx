// STRONA: /ile-kosztuje-trener-personalny-lodz · SEO · poradnik pod hasła „trener personalny Łódź cena / cennik”
import type { Metadata } from "next";
import { Footer, Header } from "@/app/components/sections";
import { JsonLd } from "@/app/components/JsonLd";
import { artykul, faq, metaStrony, okruszki } from "@/app/lib/seo";
import { cena, znajdzProdukt, TELEFON, TELEFON_HREF, type IdProduktu } from "@/app/lib/produkty";

/* ═══════════════════════════════════════════════════════════════════════
   PORADNIK: ILE KOSZTUJE TRENER PERSONALNY W ŁODZI

   Cel: ludzie, którzy wpisują „trener personalny Łódź cena”, „cennik
   trenera personalnego Łódź”, „ile kosztuje trening personalny Łódź”.
   Strona odpowiada na pytanie wprost, a potem prowadzi na
   /trening-stacjonarny.

   AKTUALIZACJA: raz na pół roku sprawdź ceny w Łodzi i zmień ZAKRESY
   oraz AKTUALIZACJA niżej. Ceny Maksa biorą się same z katalogu
   (app/lib/produkty.ts).
   ═══════════════════════════════════════════════════════════════════════ */

const SCIEZKA = "/ile-kosztuje-trener-personalny-lodz";
const AKTUALIZACJA = { iso: "2026-10-25", tekst: "październik 2026" };

const TYTUL = "Ile kosztuje trener personalny w Łodzi? Ceny 2026";
const OPIS =
  "Trener personalny w Łodzi kosztuje zwykle 120–220 zł za 60 minut. Porównanie cen: siłownia, studio, dojazd, pakiety i online, ukryte koszty i jak wybrać trenera w Łodzi.";

export const metadata: Metadata = metaStrony({
  tytul: `${TYTUL} | Maks Treningi`,
  opis: OPIS,
  sciezka: SCIEZKA,
});

const zl = (id: IdProduktu) => cena(znajdzProdukt(id)!.cenaGrosze);

/* Zakresy z publicznych cenników łódzkich trenerów i studiów treningowych
   (kwiecień–październik 2026). */
const ZAKRESY = [
  { rodzaj: "Trening personalny na siłowni (60 min)", cena: "120–200 zł" },
  { rodzaj: "Trening w prywatnym studiu treningowym", cena: "150–220 zł" },
  { rodzaj: "Trener z dojazdem do domu", cena: "150–250 zł" },
  { rodzaj: "Pierwszy trening (próbny)", cena: "100–150 zł" },
  { rodzaj: "Pakiet 10 treningów", cena: "1200–1600 zł" },
  { rodzaj: "Prowadzenie online (plan i kontakt)", cena: "300–500 zł / mies." },
];

const MOJE_CENY = [
  { rodzaj: "Trening 1 na 1 w Just GYM, Piotrkowska 157A", cena: zl("stacjonarny-1"), href: "/trening-stacjonarny" },
  { rodzaj: "Pakiet 3 sesji na sali", cena: `${zl("stacjonarny-3")} (140 zł / h)`, href: "/trening-stacjonarny" },
  { rodzaj: "Pakiet 5 sesji na sali", cena: `${zl("stacjonarny-5")} (130 zł / h)`, href: "/trening-stacjonarny" },
  { rodzaj: "Trening online na żywo przez kamerę", cena: zl("online-1"), href: "/trening-online" },
  { rodzaj: "Indywidualny plan treningowy na 12 tygodni", cena: zl("plan"), href: "/produkty" },
];

const FAQ = [
  {
    q: "Ile kosztuje jeden trening personalny w Łodzi?",
    a: "Pojedynczy trening personalny w Łodzi kosztuje zwykle od 120 do 220 zł za 60 minut. Na siłowni najczęściej 120–200 zł, w prywatnym studiu 150–220 zł, z dojazdem trenera do domu 150–250 zł.",
  },
  {
    q: "Czy cena treningu personalnego obejmuje wejście na siłownię?",
    a: "Zwykle nie. Jeśli trenujesz na siłowni sieciowej, do ceny trenera doliczasz karnet albo jednorazowe wejście. W prywatnym studiu sala jest zazwyczaj wliczona, dlatego studio jest droższe. Zawsze zapytaj o to przed zakupem.",
  },
  {
    q: "Czy opłaca się kupić pakiet treningów?",
    a: "Pakiet obniża cenę godziny, zwykle do 120–160 zł w Łodzi. Sprawdź jednak, czy pakiet ma datę ważności i co się dzieje z niewykorzystanymi treningami. Mały pakiet bez terminu ważności jest bezpieczniejszy niż duży, który przepada po trzech miesiącach.",
  },
  {
    q: "Czy trening w parze jest tańszy?",
    a: "Na osobę tak. W łódzkich studiach trening w parze kosztuje zwykle około półtora raza tyle co indywidualny, więc każda osoba płaci mniej. W zamian trener dzieli uwagę na dwie osoby.",
  },
  {
    q: "Ile kosztuje trener personalny online?",
    a: `Prowadzenie online (plan i kontakt z trenerem) kosztuje zwykle 300–500 zł miesięcznie. Trening na żywo przez kamerę u mnie kosztuje ${zl("online-1")} za sesję, a indywidualny plan na 12 tygodni ${zl("plan")}.`,
  },
  {
    q: "Ile treningów z trenerem personalnym potrzebuję?",
    a: "Na start zwykle wystarczy 3–5 sesji: tyle trzeba, żeby ustawić technikę podstawowych ćwiczeń i nauczyć się zwiększać ciężar. Potem możesz trenować sam i wracać na pojedyncze sesje kontrolne.",
  },
];

export default function Page() {
  return (
    <>
      <style>{CSS}</style>
      <JsonLd
        dane={[
          artykul({ tytul: TYTUL, opis: OPIS, sciezka: SCIEZKA, data: AKTUALIZACJA.iso }),
          okruszki([{ nazwa: "Ile kosztuje trener personalny w Łodzi", sciezka: SCIEZKA }]),
          faq(FAQ),
        ]}
      />
      <Header cta="Trening w Łodzi od 150 zł" ctaKrotko={"Trening od 150\u00a0zł"} ctaHref="/trening-stacjonarny" />

      <main className="c">
        <section className="c-hero">
          <div className="c-w">
            <nav aria-label="Okruszki" className="c-okruszki">
              <a href="/">Strona główna</a> <span aria-hidden="true">›</span> Ceny trenera w Łodzi
            </nav>
            <p className="c-nadtytul">Cennik · Łódź · aktualizacja: {AKTUALIZACJA.tekst}</p>
            <h1 className="c-tytul">Ile kosztuje trener personalny w Łodzi?</h1>
            <p className="c-lead">
              <strong>Krótko:</strong> pojedynczy trening personalny w Łodzi kosztuje zwykle{" "}
              <strong>120–220 zł za 60 minut</strong>. W pakietach godzina tanieje do około 120–160 zł. Do tego
              najczęściej dochodzi wejście na siłownię. Niżej rozpisuję, od czego zależy cena, o co zapytać przed
              zakupem i ile kosztuje trening u mnie w centrum Łodzi.
            </p>
          </div>
        </section>

        <article className="c-w c-tresc">
          <section>
            <h2>Ceny trenerów personalnych w Łodzi w 2026 roku</h2>
            <div className="c-tabela-ramka">
              <table className="c-tabela">
                <caption>Typowe ceny treningu personalnego w Łodzi</caption>
                <thead>
                  <tr>
                    <th scope="col">Rodzaj treningu</th>
                    <th scope="col">Typowa cena</th>
                  </tr>
                </thead>
                <tbody>
                  {ZAKRESY.map((z) => (
                    <tr key={z.rodzaj}>
                      <th scope="row">{z.rodzaj}</th>
                      <td>{z.cena}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="c-przypis">
              Zakresy na podstawie publicznych cenników łódzkich trenerów i studiów treningowych ({AKTUALIZACJA.tekst}).
              Pojedyncze oferty mogą wychodzić poza te widełki.
            </p>
          </section>

          <section>
            <h2>Od czego zależy cena treningu personalnego w Łodzi?</h2>
            <ol className="c-lista-nr">
              <li>
                <strong>Miejsce.</strong> Trening na siłowni sieciowej jest najtańszy, ale wejście płacisz osobno.
                Prywatne studio ma salę w cenie, więc kosztuje więcej. Dojazd trenera do domu to zwykle najwyższa
                stawka.
              </li>
              <li>
                <strong>Forma.</strong> Godzina jeden na jeden kosztuje najwięcej. W parze albo w małej grupie płacisz
                mniej, ale trener dzieli uwagę.
              </li>
              <li>
                <strong>Pakiet czy pojedynczo.</strong> Pakiet obniża cenę godziny, ale wiąże Cię z trenerem. Liczy się
                też, czy pakiet ma datę ważności.
              </li>
              <li>
                <strong>Doświadczenie i specjalizacja.</strong> Trener prowadzący np. trening siłowy czy powrót po
                kontuzji zwykle bierze więcej niż osoba zaraz po kursie.
              </li>
            </ol>
          </section>

          <section>
            <h2>Ukryte koszty, o które warto zapytać</h2>
            <ul className="c-lista">
              <li>
                <strong>Wejście na salę:</strong> karnet albo jednorazowe wejście. Na siłowni sieciowej to zwykle
                osobny koszt.
              </li>
              <li>
                <strong>Odwołany trening:</strong> do ilu godzin przed możesz przełożyć bez straty?
              </li>
              <li>
                <strong>Termin ważności pakietu:</strong> co dzieje się z treningami, których nie zdążysz wykorzystać?
              </li>
              <li>
                <strong>Dojazd:</strong> sala w centrum Łodzi, przy węźle tramwajowym, oszczędza czas i pieniądze na
                każdym treningu.
              </li>
            </ul>
          </section>

          <section>
            <h2>Ile treningów z trenerem naprawdę potrzebujesz?</h2>
            <p>
              Wielu trenerów w Łodzi sprzedaje pakiety po 10 albo 20 treningów. Jeśli chcesz nauczyć się trenować
              samodzielnie, zwykle wystarczy <strong>3–5 sesji</strong>: tyle trzeba, żeby ustawić technikę przysiadu,
              martwego ciągu i wyciskania i wiedzieć, kiedy dołożyć ciężar. Potem trenujesz sam i wracasz na pojedynczą
              sesję kontrolną, gdy coś przestaje iść do przodu. Dlatego u mnie największy pakiet ma 5 sesji.
            </p>
          </section>

          <section className="c-karta">
            <h2>Ile kosztuje trening personalny u mnie w Łodzi</h2>
            <p>
              Trenuję w Just GYM przy ul. Piotrkowskiej 157A (budynek HiPiotrkowska, przystanek Piotrkowska Centrum).
              Zawsze jeden na jeden, 60 minut, z zapisem obciążeń po każdej sesji. Wejście na salę kupujesz w Just GYM.
            </p>
            <div className="c-tabela-ramka">
              <table className="c-tabela">
                <caption>Cennik Maks Treningi</caption>
                <thead>
                  <tr>
                    <th scope="col">Usługa</th>
                    <th scope="col">Cena</th>
                  </tr>
                </thead>
                <tbody>
                  {MOJE_CENY.map((m) => (
                    <tr key={m.rodzaj}>
                      <th scope="row">
                        <a href={m.href}>{m.rodzaj}</a>
                      </th>
                      <td>{m.cena}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>Pakiety nie mają daty ważności. Jeśli w ciągu 14 dni od zakupu nie znajdziemy terminu, oddaję całą kwotę.</p>
            <div className="c-przyciski">
              <a className="c-przycisk" href="/trening-stacjonarny">
                Trener personalny Łódź: zobacz szczegóły
              </a>
              <a className="c-przycisk c-przycisk-jasny" href={TELEFON_HREF}>
                Zadzwoń: {TELEFON}
              </a>
            </div>
          </section>

          <section>
            <h2>Jak wybrać trenera personalnego w Łodzi: 5 pytań przed zakupem</h2>
            <ol className="c-lista-nr">
              <li>Czy po każdym treningu dostanę zapis ciężarów i powtórzeń?</li>
              <li>Jak wygląda pierwszy trening: ocena techniki i celów czy od razu „wycisk”?</li>
              <li>Jakie są zasady odwoływania i czy pakiet ma datę ważności?</li>
              <li>Czy sala jest blisko domu albo pracy i łatwo do niej dojechać?</li>
              <li>Jakie opinie ma trener w Google i czy są w nich konkretne efekty?</li>
            </ol>
          </section>

          <section>
            <h2>Najczęstsze pytania o ceny trenera w Łodzi</h2>
            <div className="c-faq">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="c-dalej">
            Szukasz trenera w centrum Łodzi? Zobacz <a href="/trening-stacjonarny">trening personalny w Just GYM</a>.
            Nie mieszkasz w Łodzi albo wolisz z domu? Sprawdź <a href="/trening-online">trening online</a> albo{" "}
            <a href="/produkty">indywidualny plan treningowy</a>.
          </p>
        </article>
      </main>

      <Footer />
    </>
  );
}

const CSS = `
.c{--g:#111820;--s:#D6FF3F;--m:#EDEFF2;--sl:#5F6A77;--l:#D3D8DE;color:var(--g);background:var(--m)}
.c-w{box-sizing:border-box;max-width:46rem;margin:0 auto;padding:0 clamp(1rem,4vw,2rem)}
.c p,.c li{line-height:1.65}
.c-hero{background:var(--g);color:#fff;padding:clamp(2rem,6vw,3.5rem) 0 clamp(1.75rem,5vw,2.75rem)}
.c-okruszki{font-size:.85rem;color:#AEB7C2;margin:0 0 1.25rem}
.c-okruszki a{display:inline-block;padding:.5rem 0;color:#fff;text-decoration:underline;text-underline-offset:3px}
.c-nadtytul{margin:0 0 .8rem;color:var(--s);font-size:.75rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.c-tytul{margin:0 0 1rem;font-family:var(--font-display);font-size:clamp(2rem,6vw,3.4rem);font-weight:800;line-height:1.04;letter-spacing:-.03em;text-wrap:balance}
.c-lead{margin:0;color:#D5DBE2;font-size:1.08rem;max-width:60ch}
.c-lead strong{color:#fff}
.c-tresc{padding-top:clamp(1.75rem,4vw,2.75rem);padding-bottom:clamp(3rem,7vw,5rem)}
.c-tresc>section{margin:0 0 clamp(2rem,5vw,3rem)}
.c h2{margin:0 0 1rem;font-family:var(--font-display);font-size:clamp(1.35rem,3.2vw,1.75rem);font-weight:800;line-height:1.15;letter-spacing:-.015em}
.c-tabela-ramka{overflow-x:auto;background:#fff;border:1px solid var(--l)}
.c-tabela{width:100%;border-collapse:collapse;font-size:.98rem}
.c-tabela caption{text-align:left;padding:.85rem 1rem;font-weight:700;border-bottom:1px solid var(--l)}
.c-tabela th,.c-tabela td{padding:.8rem 1rem;border-bottom:1px solid var(--l);text-align:left;vertical-align:top}
.c-tabela thead th{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--sl)}
.c-tabela tbody th{font-weight:500}
.c-tabela td{white-space:nowrap;font-weight:700}
.c-tabela tr:last-child th,.c-tabela tr:last-child td{border-bottom:0}
.c-tabela a{display:inline-block;padding:.35rem 0;color:inherit;text-underline-offset:3px}
.c-przypis{margin:.6rem 0 0;font-size:.85rem;color:var(--sl)}
.c-lista,.c-lista-nr{margin:0;padding-left:1.25rem;display:grid;gap:.6rem}
.c-karta{background:#fff;border:1px solid var(--l);border-left:4px solid var(--s);padding:clamp(1.25rem,3vw,2rem)}
.c-karta .c-tabela-ramka{margin:1rem 0}
.c-przyciski{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.25rem}
.c-przycisk{display:inline-flex;align-items:center;min-height:48px;padding:0 1.25rem;background:var(--s);color:var(--g);font-weight:700;text-decoration:none}
.c-przycisk-jasny{background:transparent;border:2px solid var(--g)}
.c-przycisk:focus-visible{outline:3px solid var(--g);outline-offset:2px}
.c-faq details{background:#fff;border:1px solid var(--l);margin:0 0 .5rem}
.c-faq summary{cursor:pointer;padding:1rem 1.1rem;font-weight:700;line-height:1.4}
.c-faq details p{margin:0;padding:0 1.1rem 1.1rem}
.c-dalej{margin:0;color:var(--sl)}
.c-dalej a,.c-tresc p a{color:var(--g);font-weight:600;text-underline-offset:3px}
@media (max-width:30rem){.c-tabela td{white-space:normal}}
`;
