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
  const amount =
    payment.currency?.toLowerCase() === "usd"
      ? `$${payment.amount.toFixed(2)}`
      : `${payment.currency.toUpperCase()} ${payment.amount.toFixed(2)}`
  const dashboardHref = payment.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/seeker"

  return (
    <div className="relative min-h-screen bg-[#08080a] text-white">
      <SiteNavbar />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a]/60 blur-[120px]"
      />

      <main className="relative flex items-start justify-center px-4 pb-24">
        <section className="mt-10 w-full max-w-[512px] rounded-[24px] border border-white/10 bg-[#141418] px-8 py-10 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
          <div className="flex justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#10b981] shadow-[0_0_0_6px_rgba(16,185,129,0.08)]">
              <Check strokeWidth={3} className="size-8 text-white" />
            </span>
          </div>

          <p className="mt-7 inline-flex h-6 items-center rounded-md border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-3 text-[11px] font-medium tracking-[0.22em] text-[#60a5fa] uppercase">
            Upgrade Successful
          </p>

          <h1 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
            Welcome to Hireloop Pro
          </h1>

          <p className="mx-auto mt-5 max-w-[402px] text-[14px] leading-[26px] text-[#A0A0AB]">
            Your payment of {amount} was received perfectly. All advanced premium recruiting modules are
            unlocked on your account. You may need to re-authenticate to see the effect.
          </p>

          <div className="mt-8 flex h-[57px] items-center gap-3 rounded-xl border border-[#1F2937] bg-black px-4 text-left">
            <ShieldCheck aria-hidden className="size-5 shrink-0 text-[#6B7280]" />
            <span className="text-[13px] font-medium text-[#A0A0AB]">Session ID Verified</span>
            <code
              title={session_id}
              className="ml-auto max-w-[172px] truncate rounded bg-[#1F2937] px-2 py-1 font-mono text-[11px] text-[#9CA3AF] select-all"
            >
              {session_id}
            </code>
          </div>

          <Link
            href={dashboardHref}
            className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#FAFAFA] text-sm font-semibold text-[#0B0B0C] transition-colors hover:bg-white"
          >
            Go to Workspace Dashboard
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </section>
      </main>
    </div>
  )
}
