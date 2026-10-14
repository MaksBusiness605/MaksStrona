import { Waypoint } from "@/app/components/Waypoint";
import { Cta } from "@/app/components/Cta";
import { Shot } from "@/app/components/Shot";

/** Domknięcie: powtórzenie obietnicy plus zdjęcie. */
export function FinalRecap({
  proof,
  title,
  body,
  points,
  cta,
  note,
  shot,
}: {
  proof: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  note: string;
  shot: string;
}) {
  return (
    <section className="bg-mgla">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
        <div className="max-w-[44ch]">
          <p className="eyebrow text-stal">{proof}</p>

          <h2 className="mt-5 text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-stal">{body}</p>

          <ul className="mt-8 space-y-3">
            {points.map((p, i) => (
              <li key={p} className="flex items-start gap-3">
                <Waypoint n={i + 1} size="sm" dark />
                <span className="pt-0.5 text-[15px] leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>

          <Cta href="#oferty" className="mt-9">
            {cta}
          </Cta>

          <p className="mt-5 text-xs leading-relaxed text-stal">{note}</p>
        </div>

        <Shot brief={shot} />
      </div>
    </section>
  );
}