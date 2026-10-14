import { Waypoint } from "@/app/components/Waypoint";
import { Cta } from "@/app/components/Cta";

export function Steps({
  heading,
  items,
  cta,
}: {
  heading: string;
  items: { meta: string; title: string; body: string }[];
  cta: string;
}) {
  return (
    <section className="bg-mgla">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <h2 className="mx-auto max-w-[22ch] text-center text-3xl leading-[1.1] sm:text-4xl">
          {heading}
        </h2>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((s, i) => (
            <li key={s.title} className="bg-white p-7">
              <Waypoint n={i + 1} size="lg" />
              <p className="eyebrow mt-6 text-stal">{s.meta}</p>
              <h3 className="mt-2 text-xl">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stal">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Cta variant="graphite">{cta}</Cta>
        </div>
      </div>
    </section>
  );
}