import { Waypoint } from "@/app/components/Waypoint";
import { NAV } from "@/app/components/nav";

export function Footer() {
  return (
    <footer className="bg-mgla">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Waypoint n="↑" size="sm" dark />
          <span className="font-display text-sm font-extrabold tracking-tight">
            TWOJA MARKA
          </span>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stal">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-grafit">
              {n.label}
            </a>
          ))}
          <a href="/polityka-prywatnosci" className="hover:text-grafit">
            Prywatność
          </a>
        </nav>

        <p className="text-xs text-stal">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
