/** Wąski pasek na samej górze: gwarancja, wysyłka albo aktualna oferta. */
export function AnnounceBar({ text }: { text: string }) {
  return (
    <div className="bg-grafit px-4 py-2 text-center sm:px-5 sm:py-2.5">
      <p className="eyebrow text-sygnal">{text}</p>
    </div>
  );
}
