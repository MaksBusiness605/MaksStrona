/* /api/stripe/platnosc · start płatności. Cała logika: app/lib/platnosc.ts */
import { platnoscZFormularza, platnoscZLinku } from "@/app/lib/platnosc";

export const runtime = "nodejs";

export const GET = platnoscZLinku;
export const POST = platnoscZFormularza;