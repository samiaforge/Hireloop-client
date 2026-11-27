import { NextResponse, type NextRequest } from "next/server"
import { headers } from "next/headers"

import { getSession } from "@/lib/core/server"
import { planAmountCents } from "@/lib/plans"
import { PLAN_META, type PlanId } from "@/lib/types/domain"

export const dynamic = "force-dynamic"

const isPlanId = (value: unknown): value is PlanId =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(PLAN_META, value)

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) throw new Error("STRIPE_SECRET_KEY is not configured. Add it to .env to enable checkout.")
  // Lazy import keeps builds working when Stripe is not configured yet.
  return import("stripe").then(({ default: Stripe }) => new Stripe(secret))
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const contentType = request.headers.get("content-type") ?? ""
    const body = contentType.includes("application/json")
      ? await request.json().catch(() => ({}))
      : Object.fromEntries(await request.formData())

    const planValue = body?.plan
    const plan: PlanId = isPlanId(planValue) ? planValue : "growth"
    const role = body?.role === "recruiter" ? "recruiter" : "seeker"

    if (planAmountCents(plan) === 0) {
      return NextResponse.json({ error: "The Starter plan is free. No checkout is required." }, { status: 400 })
    }

    const headerList = await headers()
    const host = headerList.get("host") ?? "localhost:3000"
    const protocol = headerList.get("x-forwarded-proto") ?? "http"
    const localOrigin = `${protocol}://${host}`
    const originHeader = headerList.get("origin")
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")

    // Only trust an Origin that matches our own host; otherwise fall back to
    // the request's host so a forged header cannot redirect checkout.
    let trustedOrigin: string | null = null
    if (originHeader) {
      try {
        if (new URL(originHeader).host === host) trustedOrigin = originHeader
      } catch {
        trustedOrigin = null
      }
    }
    const origin = configuredOrigin || trustedOrigin || localOrigin

    const stripe = await getStripe()
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: planAmountCents(plan),
            product_data: {
              name: `Hireloop ${PLAN_META[plan].label} Plan`,
              description: "Access to all features",
            },
          },
        },
      ],
      metadata: {
        userId: session.user.id,
        plan,
        role,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1&plan=${plan}&role=${role}`,
    })

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(checkoutSession.url ?? `${origin}/checkout?error=1`, 303)
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
