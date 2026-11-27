import { PLAN_META, type PlanId } from "@/lib/types/domain"

export type PricingPlan = {
  id: PlanId
  name: string
  price: number
  subtitle: string
  features: string[]
  cta: string
  popular?: boolean
}

const subtitle = "Start building your insights hub:"

/** Prices and copy mirror the Figma pricing section exactly. */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: PLAN_META.starter.label,
    price: 0,
    subtitle,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    cta: "Choose This Plan",
  },
  {
    id: "growth",
    name: PLAN_META.growth.label,
    price: 17,
    subtitle,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    cta: "Choose This Plan",
    popular: true,
  },
  {
    id: "premium",
    name: PLAN_META.premium.label,
    price: 99,
    subtitle,
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
    cta: "Choose This Plan",
  },
]

export const getPlan = (id?: string | null): PricingPlan | undefined =>
  PRICING_PLANS.find((plan) => plan.id === id)

/** Hosted Stripe checkout expects minor units. */
export const planAmountCents = (id: PlanId) => PLAN_META[id].price * 100
