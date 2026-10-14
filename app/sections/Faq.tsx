export function Faq({
  heading,
  items,
}: {
  heading: string;
  items: { q: string; a: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <section className="flex min-h-screen min-h-[100svh] items-center bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <h2 className="text-3xl leading-[1.1] sm:text-4xl">{heading}</h2>

        <div className="mt-8 border-t border-mgla sm:mt-10">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-mgla">
              <summary className="flex list-none cursor-pointer items-center justify-between gap-4 py-4 text-[16px] font-semibold [&::-webkit-details-marker]:hidden sm:gap-6 sm:py-5 sm:text-[17px]">
                {item.q}
                <span
                  aria-hidden="true"
                  className="relative h-4 w-4 shrink-0 border border-stal/40"
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2 bg-grafit" />
                  <span className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-grafit group-open:hidden" />
                </span>
              </summary>
              <p className="max-w-[62ch] pb-5 text-[15px] leading-relaxed text-stal sm:pb-6">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
