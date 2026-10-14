/** Przycisk. variant: signal (jasne tło) | graphite | onDark (ciemne tło). */
export function Cta({
  children,
  href = "#formularz",
  variant = "signal",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "signal" | "graphite" | "onDark";
  className?: string;
}) {
  const styles = {
    signal: "bg-sygnal text-grafit hover:bg-grafit hover:text-sygnal",
    graphite: "bg-grafit text-white hover:bg-sygnal hover:text-grafit",
    onDark: "bg-sygnal text-grafit hover:bg-white",
  }[variant];

  return (
    <a
      href={href}
      className={`inline-block px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.08em] transition-colors ${styles} ${className}`}
    >
      {children}
    </a>
  );
}