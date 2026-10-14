import { LeadForm } from "@/app/components/LeadForm";
import { Waypoint } from "@/app/components/Waypoint";
import { Cta } from "@/app/components/Cta";

export function Hero({
  proof,
  title,
  lead,
  points,
  disclaimer,
  cta,
  formTitle,
  formLead,
  source,
}: {
  proof: string;
  title: string;
  lead: string;
  points: string[];
  disclaimer: string;
  cta: string;
  formTitle: string;
  formLead: string;
  source: string;
}) {
  return (
    <section id="formularz" className="bg-grafit text-white">
      <div className="grid w-full items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,4fr)_minmax(340px,1fr)] lg:gap-14 lg:px-10 lg:py-16">
        <div className="w-full">
          <p className="eyebrow text-sygnal">{proof}</p>

          <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            {title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
            {lead}
          </p>

          <ul className="mt-6 space-y-2.5 sm:mt-7 sm:space-y-3">
            {points.map((p, i) => (
              <li key={p} className="flex items-start gap-3 sm:gap-3.5">
                <Waypoint n={i + 1} size="sm" />
                <span className="pt-0.5 text-[15px] leading-relaxed text-white/85">
                  {p}
                </span>
              </li>
            ))}
          </ul>

          <Cta
            href="#pola"
            variant="onDark"
            className="mt-7 w-full sm:mt-8 sm:w-auto lg:hidden"
          >
            {cta}
          </Cta>

          <p className="mt-6 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/50 sm:mt-7">
            {disclaimer}
          </p>
        </div>

        <div id="pola" className="w-full">
          <LeadForm
            source={source}
            title={formTitle}
            lead={formLead}
            ctaLabel={cta}
          />
        </div>
      </div>
    </section>
  );
}