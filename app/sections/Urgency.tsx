import { Cta } from "@/app/components/Cta";

/**
 * Domknięcie strony z powodem, żeby zadziałać teraz.
 * Podaj `total` i `free`, żeby obok tekstu pokazał się licznik miejsc.
 */
export function Urgency({
  eyebrow,
  title,
  body,
  cta,
  note,
  total,
  free,
  slotsLabel = "Miejsca w tym miesiącu",
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  note: string;
  /** Ile osób prowadzisz naraz, np. 12. Pomiń, żeby ukryć licznik. */
  total?: number;
  /** Ile miejsc jest jeszcze wolnych, np. 3. */
  free?: number;
  slotsLabel?: string;
}) {
  const showSlots = typeof total === "number" && typeof free === "number";
  const taken = showSlots ? total! - free! : 0;

  return (
    <section className="bg-grafit text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <div
          className={`grid items-center gap-14 ${
            showSlots ? "lg:grid-cols-[1.15fr_1fr] lg:gap-20" : ""
          }`}
        >
          <div className={showSlots ? "" : "mx-auto max-w-2xl text-center"}>
            <p className="eyebrow text-sygnal">{eyebrow}</p>

            <h2
              className={`mt-5 text-3xl leading-[1.06] sm:text-4xl lg:text-5xl ${
                showSlots ? "max-w-[18ch]" : "mx-auto max-w-[20ch]"
              }`}
            >
              {title}
            </h2>

            <p
              className={`mt-6 max-w-[52ch] text-[15px] leading-relaxed text-white/70 ${
                showSlots ? "" : "mx-auto"
              }`}
            >
              {body}
            </p>

            <Cta variant="onDark" className="mt-9">
              {cta}
            </Cta>

            <p
              className={`mt-6 max-w-[44ch] border-t border-white/15 pt-5 text-xs leading-relaxed text-white/50 ${
                showSlots ? "" : "mx-auto"
              }`}
            >
              {note}
            </p>
          </div>

          {showSlots && (
            <div className="border border-white/15 p-8 sm:p-10">
              <p className="eyebrow text-white/50">{slotsLabel}</p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-6xl font-extrabold leading-none tnum text-sygnal">
                  {free}
                </span>
                <span className="font-display text-xl font-bold leading-none tnum text-white/40">
                  / {total}
                </span>
              </div>

              <div
                role="img"
                aria-label={`${free} wolnych miejsc z ${total}`}
                className="mt-8 grid grid-cols-6 gap-2"
              >
                {Array.from({ length: total! }).map((_, i) => (
                  <span
                    key={i}
                    className={`aspect-square ${
                      i < taken ? "bg-white/15" : "bg-sygnal"
                    }`}
                  />
                ))}
              </div>

              <dl className="mt-7 space-y-2.5 border-t border-white/15 pt-5 text-xs">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-3 w-3 shrink-0 bg-sygnal" />
                  <dt className="text-white/70">Wolne</dt>
                  <dd className="ml-auto font-semibold tnum">{free}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-3 w-3 shrink-0 bg-white/15" />
                  <dt className="text-white/70">Zajęte</dt>
                  <dd className="ml-auto font-semibold tnum">{taken}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}