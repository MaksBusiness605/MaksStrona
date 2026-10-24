// PLIK: app/components/JsonLd.tsx · SEO · dane strukturalne dla Google (schema.org)

/** Wstawia jeden lub kilka bloków JSON-LD. Dane: app/lib/seo.ts. */
export function JsonLd({ dane }: { dane: object | object[] }) {
  const lista = Array.isArray(dane) ? dane : [dane];
  return (
    <>
      {lista.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          /* „<” zamienione, żeby tekst z FAQ nie zamknął znacznika script. */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
