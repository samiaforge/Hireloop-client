"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

import { PRICING_PLANS } from "@/lib/plans"
import { cn } from "@/lib/utils"

export function PricingSection({ className }: { className?: string }) {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className={cn("mx-auto mt-32 max-w-7xl px-4 sm:px-6", className)}>
      <div className="text-center">
        <p className="overline-label">Pricing</p>
        <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
          Pay for the leverage, not the listings
        </h2>

        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#141418] p-1">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={cn("rounded-full px-5 py-2 text-sm transition-colors", !yearly ? "bg-[#5C53FE] text-white" : "text-[#A0A0AB]")}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={cn("rounded-full px-5 py-2 text-sm transition-colors", yearly ? "bg-[#5C53FE] text-white" : "text-[#A0A0AB]")}
          >
            Yearly
          </button>
          <span className="ml-1 rounded-full bg-[#22C55E]/15 px-2.5 py-1 text-[11px] font-medium text-[#4ADE80]">25%</span>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const price = yearly ? Math.round(plan.price * 0.75) : plan.price
          const href = plan.price === 0 ? "/auth/sign-up" : `/checkout?plan=${plan.id}`
          return (
            <article
              key={plan.id}
              className={cn(
                "flex min-h-[450px] flex-col rounded-2xl border border-white/10 bg-[#141418] p-8",
                plan.popular ? "border-[#5C53FE]/70 shadow-[0_0_60px_-20px_rgba(92,83,254,0.6)]" : ""
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-semibold text-white">{plan.name}</h3>
                {plan.popular ? <span className="rounded-full bg-[#5C53FE]/15 px-3 py-1 text-[11px] text-[#C3C0FF]">Popular</span> : null}
              </div>

              <p className="mt-6 flex items-end gap-2">
                <span className="font-heading text-5xl font-bold text-white">${price}</span>
                <span className="pb-2 text-sm text-[#A0A0AB]">/month</span>
              </p>
              <p className="mt-3 text-sm text-[#A0A0AB]">{plan.subtitle}</p>

              <ul className="mt-8 flex flex-1 flex-col gap-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-[#EDEDEF]">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-[#8F88FF]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={href} className="primary-button mt-8 w-full">
                {plan.cta}
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}
