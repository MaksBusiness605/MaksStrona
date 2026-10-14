import { Cta } from "@/app/components/Cta";

/** Problem wyśrodkowany, bez zdjęcia (wariant z layoutu A). */
export function PainCenter({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <section className="flex min-h-screen min-h-[100svh] items-center bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <h2 className="mx-auto max-w-[28ch] text-3xl leading-[1.12] sm:text-4xl">
          {title}
        </h2>

        <p className="mx-auto mt-5 max-w-[60ch] text-[15px] leading-relaxed text-stal sm:mt-6">
          {body}
        </p>

        <Cta className="mt-8 w-full sm:mt-9 sm:w-auto">{cta}</Cta>
      </div>
    </section>
  );
}
