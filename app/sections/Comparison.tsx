export function Comparison({
  heading,
  columns,
  rows,
}: {
  heading: string;
  columns: string[];
  rows: { point: string; values: boolean[] }[];
}) {
  return (
    <section className="flex min-h-screen min-h-[100svh] items-center bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-40 lg:px-8 lg:pb-28 lg:pt-52">
        <h2 className="mx-auto max-w-[26ch] text-center text-3xl leading-[1.1] sm:text-4xl">
          {heading}
        </h2>

        {/* Tabela porównawcza przewija się poziomo na telefonie; bleed do
           krawędzi ekranu (-mx) ułatwia przewijanie kciukiem. */}
        <div className="-mx-4 mt-10 overflow-x-auto overscroll-x-contain px-4 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:mt-12 sm:px-0">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-[26%] p-3 sm:p-4" />
                {columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`p-3 text-center align-bottom font-display text-[11px] font-bold uppercase tracking-[0.08em] sm:p-4 sm:text-xs ${
                      i === 0 ? "bg-grafit text-sygnal" : "text-grafit/75"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.point} className="border-t border-stal/20">
                  <th
                    scope="row"
                    className="p-3 text-left text-sm font-semibold text-grafit sm:p-4 sm:text-[15px]"
                  >
                    {row.point}
                  </th>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={`p-3 text-center sm:p-4 ${i === 0 ? "bg-grafit" : ""}`}
                    >
                      <span
                        className={
                          v
                            ? `inline-block h-5 w-5 ${i === 0 ? "bg-sygnal" : "bg-grafit"}`
                            : `inline-block h-5 w-5 border-2 ${
                                i === 0 ? "border-white/60" : "border-stal"
                              }`
                        }
                      >
                        <span className="sr-only">{v ? "tak" : "nie"}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}