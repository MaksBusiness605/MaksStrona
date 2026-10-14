import { Shot } from "@/app/components/Shot";
import { Waypoint } from "@/app/components/Waypoint";
import { Cta } from "@/app/components/Cta";

export function Benefits({
  items,
  cta,
}: {
  items: { eyebrow: string; title: string; body: string; shot: string }[];
  cta: string;
}) {
  return (
    <section className="flex min-h-screen min-h-[100svh] items-center bg-white">
      <div className="mx-auto w-full max-w-6xl space-y-14 px-4 py-16 sm:space-y-20 sm:px-6 sm:py-20 lg:space-y-28 lg:px-8 lg:py-28">
        {items.map((b, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={b.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <Shot brief={b.shot} className={flip ? "lg:order-2" : ""} />

              <div className={`max-w-[44ch] ${flip ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-3">
                  <Waypoint n={i + 1} size="sm" />
                  <p className="eyebrow text-stal">{b.eyebrow}</p>
                </div>

                <h2 className="mt-4 text-2xl leading-[1.15] sm:text-3xl">
                  {b.title}
                </h2>

                <p className="mt-4 text-[15px] leading-relaxed text-stal">
                  {b.body}
                </p>

                <Cta className="mt-7 w-full sm:w-auto">{cta}</Cta>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
