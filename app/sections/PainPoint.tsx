import { Shot } from "@/app/components/Shot";
import { Cta } from "@/app/components/Cta";

export function PainPoint({
  title,
  paragraphs,
  shot,
  cta,
}: {
  title: string;
  paragraphs: string[];
  shot: string;
  cta: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
        <div className="max-w-[46ch]">
          <h2 className="text-3xl leading-[1.1] sm:text-4xl">{title}</h2>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-stal">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
          </div>

          <Cta className="mt-8">{cta}</Cta>
        </div>

        <Shot ratio="4/5" brief={shot} />
      </div>
    </section>
  );
}