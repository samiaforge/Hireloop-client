import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Lock } from "lucide-react"

import { PayButton } from "./_components/pay-button"
import { getPlan } from "@/lib/plans"
import { PLAN_META, type PlanId } from "@/lib/types/domain"

export const dynamic = "force-dynamic"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; role?: string; canceled?: string }>
}) {
  const params = await searchParams
  const requestedPlan = getPlan(params.plan)?.id ?? "growth"
  const plan: PlanId = requestedPlan
  const role = params.role === "recruiter" ? "recruiter" : "seeker"
  const selected = getPlan(plan)!
  const amount = `$${selected.price.toFixed(2)}`
  const bdt = `BDT ${(selected.price * 127.6665).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  return (
    <div className="min-h-screen bg-[#08080a] text-white">
      <header className="mx-auto flex h-24 w-full max-w-5xl items-center gap-4 px-4">
        <Link href="/pricing" aria-label="Back to pricing" className="text-[#a1a1aa] transition-colors hover:text-white">
          <ArrowLeft aria-hidden className="size-6" />
        </Link>
        <Link href="/" className="font-heading text-lg font-bold text-white">
          Hireloop
        </Link>
        <span className="rounded border border-white/15 bg-white/5 px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-[#a1a1aa] uppercase">
          Sandbox
        </span>
      </header>

      {params.canceled ? (
        <p className="mx-auto -mt-6 max-w-5xl px-4 text-sm text-[#F59E0B]">
          Your checkout was canceled. You can try again whenever you&apos;re ready.
        </p>
      ) : null}

      <main className="mx-auto grid w-full max-w-5xl gap-14 px-4 pb-16 pt-4 lg:grid-cols-2">
        <section>
          <p className="text-xs font-bold tracking-[0.1em] text-[#808089] uppercase">Choose a currency:</p>

          <div className="mt-5 overflow-hidden rounded-lg border border-[#2e2e33]">
            <div className="flex items-center justify-between border-b border-[#2e2e33] bg-[#27272a] px-4 py-4">
              <span className="flex items-center gap-3 text-sm font-medium">🇧🇩 BDT {bdt.replace("BDT ", "")}</span>
              <Check aria-hidden className="size-4 text-[#60A5FA]" />
            </div>
            <div className="flex items-center justify-between px-4 py-4 text-sm text-[#a1a1aa]">
              <span>🇺🇸 $ {amount.replace("$", "")}</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-[#808089]">1 USD = 127.6665 BDT</p>

          <div className="mt-10 border-t border-[#2e2e33] pt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold leading-7 text-white">
                  Hireloop {PLAN_META[plan].label} Plan
                </h2>
                <p className="mt-1.5 text-sm text-[#a1a1aa]">Access to all features</p>
              </div>
              <p className="whitespace-nowrap text-lg font-semibold text-white">{bdt}</p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#2e2e33] pt-6 text-lg font-semibold">
              <span>Total</span>
              <span>{bdt}</span>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex h-11 items-center justify-center rounded-md border border-[#2e2e33] text-sm font-semibold">link</div>
            <div className="flex h-11 items-center justify-center rounded-md border border-[#2e2e33] text-sm font-semibold">
              VISA <span className="text-[#a1a1aa]">4242</span>
            </div>
          </div>

          <div className="my-7 flex items-center gap-4 text-xs text-[#808089]">
            <span className="h-px flex-1 bg-[#2e2e33]" /> OR <span className="h-px flex-1 bg-[#2e2e33]" />
          </div>

          <h2 className="text-sm font-semibold text-white">Contact information</h2>
          <label className="mt-4 block text-[11px] font-medium tracking-wide text-[#a1a1aa] uppercase">Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            disabled
            className="mt-2 w-full rounded-md border border-[#2e2e33] bg-[#18181b] px-3 py-3 text-sm text-white placeholder:text-[#71717a]"
          />

          <h2 className="mt-8 text-sm font-semibold text-white">Payment method</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#2e2e33]">
            <div className="flex items-center gap-2 border-b border-[#2e2e33] bg-[#27272a] px-3 py-2.5 text-sm text-white">
              <CreditCard aria-hidden className="size-4" /> Card
            </div>
            <div className="flex flex-col gap-3 p-4">
              <p className="text-[11px] font-medium tracking-wide text-[#a1a1aa] uppercase">Card information</p>
              <input placeholder="1234 1234 1234 1234" disabled className="w-full rounded-md border border-[#2e2e33] bg-[#18181b] px-3 py-3 text-sm placeholder:text-[#71717a]" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM / YY" disabled className="rounded-md border border-[#2e2e33] bg-[#18181b] px-3 py-3 text-sm placeholder:text-[#71717a]" />
                <input placeholder="CVC" disabled className="rounded-md border border-[#2e2e33] bg-[#18181b] px-3 py-3 text-sm placeholder:text-[#71717a]" />
              </div>
              <p className="text-[11px] text-[#808089]">
                Card details are collected on Stripe&apos;s secure checkout page, never on Hireloop.
              </p>
              <label className="mt-1 block text-[11px] font-medium tracking-wide text-[#a1a1aa] uppercase">Cardholder name</label>
              <input placeholder="Full name on card" disabled className="w-full rounded-md border border-[#2e2e33] bg-[#18181b] px-3 py-3 text-sm placeholder:text-[#71717a]" />
              <label className="block text-[11px] font-medium tracking-wide text-[#a1a1aa] uppercase">Country or region</label>
              <input value="Bangladesh" readOnly className="w-full rounded-md border border-[#2e2e33] bg-[#18181b] px-3 py-3 text-sm" />
            </div>
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm text-[#a1a1aa]">
            <input type="checkbox" className="mt-1 accent-[#0070E0]" />
            <span>
              Save my information for faster checkout
              <span className="mt-1 block text-xs text-[#808089]">
                Pay securely on this site and everywhere Link is accepted.
              </span>
            </span>
          </label>

          <div className="mt-8">
            <PayButton plan={plan} role={role} />
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#808089]">
              <Lock aria-hidden className="size-3.5" /> Powered by Stripe
            </p>
            <div className="mt-3 flex justify-center gap-4 text-xs text-[#808089]">
              <span>Terms</span>
              <span>Privacy</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
