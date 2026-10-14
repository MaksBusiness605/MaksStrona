import { Shot } from "@/app/components/Shot";
import { Cta } from "@/app/components/Cta";

/** Autor materiałów. Tekst po lewej, zdjęcie po prawej. */
export function Team({
  heading,
  name,
  role,
  paragraphs,
  shot,
  cta,
}: {
  heading: string;
  name: string;
  role: string;
  paragraphs: string[];
  shot: string;
  cta: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 pb-20 lg:pb-28">
        <h2 className="text-center text-3xl leading-[1.1] sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-[46ch]">
            <h3 className="text-2xl leading-tight">{name}</h3>
            <p className="eyebrow mt-2 text-stal">{role}</p>

            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-stal">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>

            <Cta className="mt-8">{cta}</Cta>
          </div>

          <Shot ratio="4/5" brief={shot} />
        </div>
      </div>
    </section>
  );
}