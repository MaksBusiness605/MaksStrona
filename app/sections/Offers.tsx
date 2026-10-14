import { Waypoint } from "@/app/components/Waypoint";

/** Trzy oferty z cenami. Środkowa może być wyróżniona. */
export function Offers({
  heading,
  lead,
  items,
  trust,
}: {
  heading: string;
  lead: string;
  trust?: string[];
  items: {
    name: string;
    price: string;
    oldPrice?: string;
    save?: string;
    ribbon?: string;
    note: string;
    lead: string;
    includes: string[];
    href: string;
    cta: string;
    featured?: boolean;
  }[];
}) {
  return (
    <section id="oferty" className="flex min-h-screen min-h-[100svh] items-center bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <h2 className="max-w-[24ch] text-3xl leading-[1.1] sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-stal">
          {lead}
        </p>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          {items.map((o, i) => {
            const dark = o.featured;
            return (
              <div
                key={o.name}
                className={`relative flex flex-col p-5 sm:p-7 ${
                  dark ? "bg-grafit text-white" : "bg-mgla"
                }`}
              >
                {o.ribbon && (
                  <span className="absolute -top-3 left-5 bg-sygnal px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.1em] text-grafit sm:left-7">
                    {o.ribbon}
                  </span>
                )}

                <Waypoint n={i + 1} size="md" dark={!dark} />

                <h3
                  className={`mt-6 text-2xl leading-tight ${dark ? "text-white" : ""}`}
                >
                  {o.name}
                </h3>

                <p
                  className={`mt-2 text-[15px] leading-relaxed ${
                    dark ? "text-white/70" : "text-stal"
                  }`}
                >
                  {o.lead}
                </p>

                <div
                  className={`mt-6 border-t pt-5 ${
                    dark ? "border-white/20" : "border-stal/20"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {o.oldPrice && (
                      <span
                        className={`font-display text-xl font-semibold line-through tnum ${
                          dark ? "text-white/40" : "text-stal/60"
                        }`}
                      >
                        {o.oldPrice}
                      </span>
                    )}
                    <span className="font-display text-4xl font-extrabold tnum">
                      {o.price}
                    </span>
                  </div>

                  {o.save && (
                    <span
                      className={`mt-3 inline-block px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.1em] ${
                        dark ? "bg-sygnal text-grafit" : "bg-grafit text-sygnal"
                      }`}
                    >
                      {o.save}
                    </span>
                  )}

                  <p
                    className={`eyebrow mt-3 ${dark ? "text-white/60" : "text-stal"}`}
                  >
                    {o.note}
                  </p>
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {o.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 inline-block h-2.5 w-2.5 shrink-0 ${
                          dark ? "bg-sygnal" : "bg-grafit"
                        }`}
                      />
                      <span
                        className={`text-[15px] leading-relaxed ${
                          dark ? "text-white/85" : "text-stal"
                        }`}
                      >
                        {inc}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={o.href}
                  className={`mt-8 block px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.08em] transition-colors ${
                    dark
                      ? "bg-sygnal text-grafit hover:bg-white"
                      : "bg-grafit text-white hover:bg-sygnal hover:text-grafit"
                  }`}
                >
                  {o.cta}
                </a>
              </div>
            );
          })}
        </div>

        {trust && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-mgla pt-8 sm:gap-x-10">
            {trust.map((t) => (
              <span key={t} className="eyebrow text-stal">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
