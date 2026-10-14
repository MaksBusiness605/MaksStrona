/* /api/stripe/webhook · tu Stripe wysyła potwierdzenia płatności.
   Cała logika: app/lib/webhook.ts */
import { obsluzWebhook } from "@/app/lib/webhook";

export const runtime = "nodejs";

export const POST = obsluzWebhook;