import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"

import { SiteNavbar } from "@/components/site-navbar"
import { verifyCheckout } from "@/lib/api/payments"

export const dynamic = "force-dynamic"

type VerifyResult = {
  success: boolean
  message?: string
  payment?: {
    plan: string
    amount: number
    currency: string
    transactionId: string
    email: string
    createdAt: string
    role: string
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  if (!session_id) notFound()

  const result = (await verifyCheckout(session_id)) as VerifyResult
  if (!result.success || !result.payment) redirect("/checkout?canceled=1")

  const payment = result.payment
  const amount = `${payment.currency.toUpperCase()} ${payment.amount.toFixed(2)}`
  const dashboardHref = payment.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/seeker"

  return (
    <div className="relative min-h-screen bg-[#08080a] text-white">
      <SiteNavbar />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a] blur-[120px]"
      />

      <main className="relative flex items-start justify-center px-4 pb-24">
        <section className="mt-10 w-full max-w-[512px] rounded-3xl border border-white/10 bg-[#141418] px-10 py-10 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#10b981] shadow-[0_0_0_4px_rgba(16,185,129,0.05)]">
              <Check strokeWidth={3} className="size-8 text-white" />
            </span>
          </div>

          <p className="mt-7 inline-flex h-5 items-center rounded border border-[#3b82f6] bg-[#3b82f6]/15 px-[11px] text-[11px] font-medium tracking-[0.34em] text-[#60a5fa] uppercase">
            Upgrade successful
          </p>

          <h1 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
            Welcome to Hireloop Pro
          </h1>

          <p className="mx-auto mt-5 max-w-[366px] text-base leading-[26px] text-[#9ca3af]">
            Your payment of {amount} was received perfectly. All advanced premium recruiting modules are unlocked
            on your account. You may need to re-authenticate to see the effect.
          </p>

          <div className="mt-10 rounded-xl border border-[#1f2937] bg-black px-4 py-3.5 text-left">
            <div className="flex items-center gap-2.5">
              <ShieldCheck aria-hidden className="size-5 shrink-0 text-[#6b7280]" />
              <span className="text-[13px] font-medium text-[#a0a0ab]">Session ID Verified</span>
              <code
                title={session_id}
                className="ml-auto max-w-[190px] truncate rounded bg-[#1f2937] px-2 py-1 font-mono text-[11px] text-[#9ca3af] select-all"
              >
                {session_id}
              </code>
            </div>

            <dl className="mt-3 divide-y divide-[#1f2937] border-t border-[#1f2937] pt-1">
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-[13px] text-[#a0a0ab]">Plan</dt>
                <dd className="text-[13px] capitalize text-[#EDEDEF]">{payment.plan}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-[13px] text-[#a0a0ab]">Transaction ID</dt>
                <dd className="max-w-[240px] truncate font-mono text-[11px] text-[#9ca3af]">{payment.transactionId}</dd>
              </div>
              {payment.email ? (
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-[13px] text-[#a0a0ab]">Receipt email</dt>
                  <dd className="max-w-[230px] truncate text-[13px] text-[#EDEDEF]">{payment.email}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <Link
            href={dashboardHref}
            className="mt-8 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition-colors hover:bg-white/90"
          >
            Go to Workspace Dashboard
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </section>
      </main>
    </div>
  )
}
