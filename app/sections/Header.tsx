import { Waypoint } from "@/app/components/Waypoint";
import { NAV } from "@/app/components/nav";

export function Header({ cta }: { cta: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-mgla bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <Waypoint n="↑" size="sm" dark />
          <span className="font-display text-sm font-extrabold tracking-tight">
            TWOJA MARKA
          </span>
        </a>

        <nav className="hidden gap-6 text-sm text-stal md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-grafit">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="tel:+48000000000"
            className="hidden text-sm font-semibold underline underline-offset-4 sm:block"
          >
            000 000 000
          </a>
          <a
            href="#formularz"
            className="whitespace-nowrap bg-grafit px-3.5 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-sygnal hover:text-grafit sm:px-5 sm:text-xs"
          >
            {cta}
          </a>
        </div>
      </div>
    </header>
  );
}
