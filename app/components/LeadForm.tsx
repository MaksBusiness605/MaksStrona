"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function LeadForm({
  source,
  eyebrow = "Bezpłatna konsultacja",
  title = "Sprawdź, czy mogę ci pomóc",
  lead = "Wypełnij trzy pola. Oddzwaniam w 24 h.",
  ctaLabel = "Umów konsultację",
  goals = [
    "Redukcja masy ciała",
    "Budowa siły i masy",
    "Powrót po kontuzji",
    "Jeszcze nie wiem",
  ],
}: {
  source: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  ctaLabel?: string;
  goals?: string[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [utm, setUtm] = useState("");

  // Zapamiętuje parametry z reklamy, żeby wiedzieć, skąd przyszedł lead
  useEffect(() => {
    setUtm(window.location.search);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Pułapka na boty — człowiek tego pola nie widzi, więc zostaje puste
    if (data.firma) return;

    setStatus("sending");

    try {
      // TODO: podmień na własny endpoint albo Server Action
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source, utm }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border-l-4 border-sygnal bg-white p-5 sm:p-6">
        <p className="eyebrow text-stal">Gotowe</p>
        <h3 className="mt-1.5 text-xl leading-tight sm:text-2xl">
          Zgłoszenie przyjęte
        </h3>
        <p className="mt-3 text-sm leading-snug text-stal">
          Odezwę się w ciągu 24 godzin w dni robocze. Jeśli wolisz szybciej —
          zadzwoń pod{" "}
          <a
            href="tel:+48000000000"
            className="font-semibold text-grafit underline underline-offset-4"
          >
            000 000 000
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6">
      <p className="eyebrow text-stal">{eyebrow}</p>

      <h3 className="mt-1.5 text-xl leading-[1.2] sm:text-2xl">{title}</h3>

      <p className="mt-2 text-sm leading-snug text-stal">{lead}</p>

      <div className="mt-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field name="imie" label="Imię" autoComplete="given-name" />
          <Field
            name="telefon"
            label="Telefon"
            type="tel"
            autoComplete="tel"
            placeholder="600 000 000"
          />
        </div>

        <Field
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="jan@example.com"
        />

        <label className="block">
          <span className="eyebrow text-stal">Cel</span>
          <select
            required
            name="cel"
            defaultValue=""
            className="mt-1.5 w-full appearance-none border border-stal/45 bg-white bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 py-2.5 text-sm text-grafit transition-colors focus:border-grafit"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 8' fill='none'><path d='M1 1l6 6 6-6' stroke='%236B7684' stroke-width='1.5'/></svg>\")",
            }}
          >
            <option value="" disabled>
              Wybierz z listy
            </option>
            {goals.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        {/* Pułapka na boty — ukryta przed ludźmi i czytnikami ekranu */}
        <input
          type="text"
          name="firma"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 w-full bg-sygnal px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.08em] text-grafit transition-colors hover:bg-grafit hover:text-sygnal disabled:opacity-60"
      >
        {status === "sending" ? "Wysyłam…" : ctaLabel}
      </button>

      <p aria-live="polite" className="sr-only">
        {status === "sending" ? "Wysyłanie formularza" : ""}
      </p>

      {status === "error" && (
        <p className="mt-3 border-l-4 border-grafit bg-mgla px-3 py-2.5 text-sm leading-snug">
          Nie udało się wysłać. Spróbuj ponownie albo napisz na{" "}
          <a
            href="mailto:kontakt@twojadomena.pl"
            className="font-semibold underline underline-offset-4"
          >
            kontakt@twojadomena.pl
          </a>
          .
        </p>
      )}

      <p className="mt-4 text-xs leading-snug text-stal">
        Bez zobowiązań. Dane trafiają wyłącznie do mnie.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-stal">{label}</span>
      <input
        required
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-1.5 w-full border border-stal/45 bg-white px-3 py-2.5 text-sm text-grafit transition-colors placeholder:text-stal/50 focus:border-grafit"
      />
    </label>
  );
}