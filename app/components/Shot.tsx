/** Placeholder pod zdjęcie. Tekst w środku to brief dla fotografa. */
export function Shot({
  brief,
  ratio = "4/3",
  className = "",
}: {
  brief: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`flex w-full items-center justify-center bg-mgla p-8 ${className}`}
    >
      <p className="max-w-[34ch] text-center text-sm leading-relaxed text-stal">
        {brief}
      </p>
    </div>
  );
}