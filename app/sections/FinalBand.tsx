import { Cta } from "@/app/components/Cta";

/** Ciemna belka domykająca ze zdjęciem w tle. */
export function FinalBand({
  title,
  body,
  cta,
  note,
  image,
}: {
  title: string;
  body: string;
  cta: string;
  note: string;
  /** Ścieżka do zdjęcia w /public, np. "/zdjecia/sala.jpg". Pomiń, żeby zostawić sam grafit. */
  image?: string;
}) {
  return (
    <section className="relative isolate flex min-h-screen min-h-[100svh] items-center overflow-hidden bg-grafit text-white">
      {image && (
        <div
          aria-hidden="true"
          style={{ backgroundImage: `url(${image})` }}
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-25"
        />
      )}

      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <h2 className="mx-auto max-w-[22ch] text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-white/75">
          {body}
        </p>

        <Cta href="#oferty" variant="onDark" className="mt-8 w-full sm:mt-9 sm:w-auto">
          {cta}
        </Cta>

        <p className="mt-5 text-xs text-white/50">{note}</p>
      </div>
    </section>
  );
}
