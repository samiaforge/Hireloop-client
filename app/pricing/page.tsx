import Link from "next/link"

import { Navbar } from "@/components/navbar"
import { PricingSection } from "@/components/pricing-section"

const FAQ = [
  {
    question: "Can I cancel at any time?",
    answer: "Yes. Switch plans or cancel from your billing page whenever you like — there are no long-term contracts.",
  },
  {
    question: "What is the refund policy?",
    answer: "All paid plans are covered by a 14-day money-back guarantee. Contact support if you need a refund.",
  },
  {
    question: "Which payment methods do you accept?",
    answer: "All major cards are accepted securely through Stripe. Card details are never stored on Hireloop.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Yes. Upgrades and downgrades take effect immediately and are prorated for the remaining billing period.",
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#010103] text-white">
      <Navbar />
      <PricingSection />

      <section className="mx-auto mt-28 max-w-3xl px-4 pb-24 sm:px-6">
        <h2 className="text-center font-heading text-3xl font-semibold">Frequently asked questions</h2>
        <div className="mt-10 flex flex-col gap-4">
          {FAQ.map((item) => (
            <details key={item.question} className="group rounded-xl border border-white/10 bg-[#141418] p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {item.question}
                <span className="text-[#8F88FF] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm leading-6 text-[#A0A0AB]">{item.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth/sign-up" className="primary-button">Create a free account</Link>
          <Link href="/jobs" className="ghost-button">Browse jobs</Link>
        </div>
      </section>
    </main>
  )
}
