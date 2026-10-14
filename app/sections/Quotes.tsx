import { Cta } from "@/app/components/Cta";

export function Quotes({
  heading,
  items,
  cta,
}: {
  heading: string;
  items: { text: string; name: string; meta: string }[];
  cta: string;
}) {
  return (
    <section className="bg-mgla">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <h2 className="max-w-[24ch] text-3xl leading-[1.1] sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((q) => (
            <figure key={q.name} className="bg-white p-7">
              <blockquote className="text-[15px] leading-relaxed">
                {q.text}
              </blockquote>
              <figcaption className="mt-6 border-t border-mgla pt-4">
                <p className="text-sm font-semibold">{q.name}</p>
                <p className="eyebrow mt-1 text-stal">{q.meta}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Cta variant="graphite">{cta}</Cta>
        </div>
      </div>
    </section>
  );
}