import { Cta } from "@/app/components/Cta";

/** Sześć powodów, dla których to działa. Siatka 3 × 2. */
export function Differentiators({
  heading,
  items,
  cta,
}: {
  heading: string;
  items: { title: string; body: string }[];
  cta: string;
}) {
  return (
    <section className="flex min-h-screen min-h-[100svh] items-center bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <h2 className="mx-auto max-w-[26ch] text-center text-3xl leading-[1.1] sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-10 grid gap-px bg-stal/20 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div key={d.title} className="bg-white p-5 sm:p-7">
              <h3 className="text-lg leading-tight">{d.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stal">
                {d.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Cta className="w-full sm:w-auto">{cta}</Cta>
        </div>
      </div>
    </section>
  );
}
