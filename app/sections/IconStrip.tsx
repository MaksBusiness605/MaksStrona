import { Waypoint } from "@/app/components/Waypoint";

/** Pasek korzyści produktu — kwadrat z liczbą i podpis pod spodem. */
export function IconStrip({
  items,
  tone = "light",
}: {
  items: string[];
  tone?: "light" | "fog";
}) {
  return (
    <section className={tone === "fog" ? "bg-mgla" : "bg-white"}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-center gap-x-6 gap-y-5 px-4 py-7 sm:gap-x-10 sm:gap-y-6 sm:px-6 sm:py-8 lg:px-8">
        {items.map((t, i) => (
          <div
            key={t}
            className="flex w-[104px] flex-col items-center gap-2 sm:w-[128px] sm:gap-2.5"
          >
            <Waypoint n={i + 1} size="sm" dark />
            <span className="text-center text-[11px] leading-snug text-stal sm:text-xs">
              {t}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
