/* WYSYŁKA MAILI przez Resend (resend.com, darmowy plan wystarczy na
   start). Bez RESEND_API_KEY mail nie wychodzi, tylko trafia do logów
   serwera: zakup działa dalej, a Ty widzisz treść w konsoli.

   MAIL_NADAWCA musi być z domeny zweryfikowanej w Resend,
   np. "Maks Treningi <kontakt@makstreningi.pl>". */

type Mail = { do: string; temat: string; tresc: string; odpowiedzDo?: string };

export async function wyslijMail({ do: odbiorca, temat, tresc, odpowiedzDo }: Mail): Promise<void> {
  const klucz = process.env.RESEND_API_KEY;
  const nadawca = process.env.MAIL_NADAWCA;

  if (!klucz || !nadawca) {
    console.log(`[mail · nie wysłano, brak RESEND_API_KEY albo MAIL_NADAWCA]\nDo: ${odbiorca}\nTemat: ${temat}\n\n${tresc}`);
    return;
  }

  const odp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${klucz}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: nadawca,
      to: [odbiorca],
      subject: temat,
      text: tresc,
      ...(odpowiedzDo ? { reply_to: odpowiedzDo } : {}),
    }),
  });

  if (!odp.ok) {
    /* Rzucamy błąd celowo: webhook odpowie wtedy Stripe'owi kodem 500
       i Stripe ponowi zdarzenie, więc mail nie zginie po cichu. */
    throw new Error(`Resend ${odp.status}: ${await odp.text()}`);
  }
}