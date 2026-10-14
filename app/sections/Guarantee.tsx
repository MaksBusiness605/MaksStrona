import { Cta } from "@/app/components/Cta";

/** Gwarancja — jeden mocny blok na grafitowym tle. */
export function Guarantee({
  eyebrow,
  title,
  body,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <section className="flex min-h-screen min-h-[100svh] items-center bg-mgla">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="bg-grafit px-5 py-11 text-center text-white sm:px-10 sm:py-14 lg:px-14">
          <p className="eyebrow text-sygnal">{eyebrow}</p>

          <h2 className="mx-auto mt-5 max-w-[24ch] text-3xl leading-[1.12] sm:text-4xl">
            {title}
          </h2>

          <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-relaxed text-white/70">
            {body}
          </p>

          <Cta href="#oferty" variant="onDark" className="mt-8 w-full sm:mt-9 sm:w-auto">
            {cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}
