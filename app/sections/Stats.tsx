import { Cta } from "@/app/components/Cta";

export function Stats({
  heading,
  items,
  cta,
}: {
  heading: string;
  items: { value: string; label: string }[];
  cta: string;
}) {
  return (
    <section className="flex min-h-screen min-h-[100svh] items-center bg-mgla">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <h2 className="max-w-[24ch] text-3xl leading-[1.1] sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-10 grid gap-px bg-stal/20 sm:mt-12 sm:grid-cols-3">
          {items.map((s) => (
            <div key={s.label} className="bg-mgla px-2 py-7 text-center sm:py-8">
              <p className="font-display text-4xl font-extrabold tnum sm:text-5xl">
                {s.value}
              </p>
              <p className="eyebrow mt-3 text-stal">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Cta variant="graphite" className="w-full sm:w-auto">
            {cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}
