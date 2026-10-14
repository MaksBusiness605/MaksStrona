export function ProofBar({ items }: { items: string[] }) {
  return (
    <section className="border-b border-mgla bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-5">
        {items.map((i) => (
          <span key={i} className="eyebrow text-stal">
            {i}
          </span>
        ))}
      </div>
    </section>
  );
}