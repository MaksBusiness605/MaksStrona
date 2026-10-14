/** Numerowany kwadrat — motyw przewodni marki (punkt na trasie). */
export function Waypoint({
  n,
  size = "md",
  dark = false,
}: {
  n: number | string;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}) {
  const s = {
    sm: "h-6 w-6 text-[11px]",
    md: "h-9 w-9 text-sm",
    lg: "h-14 w-14 text-lg",
  }[size];

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center font-display font-bold tnum ${s} ${
        dark ? "bg-grafit text-sygnal" : "bg-sygnal text-grafit"
      }`}
    >
      {n}
    </span>
  );
}