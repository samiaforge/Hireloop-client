import Link from "next/link"
import { Check, CreditCard, ShieldCheck } from "lucide-react"

import { EmptyState } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { StatusPill } from "@/components/shared/status-pill"
import { getPayments } from "@/lib/api/payments"
import { getUserPlan } from "@/lib/api/user"
import { requireUser } from "@/lib/core/server"
import { formatDeadline } from "@/lib/formatters"
import { PLAN_META, type PaymentRow, type PlanId } from "@/lib/types/domain"

const PLAN_FEATURES = [
  "Unlimited Applications",
  "Premium Job Insights",
  "Priority Candidate Badge",
  "Direct Recruiter Messaging",
] as const

export default async function BillingPage() {
  const user = await requireUser("seeker")

  let plan: PlanId = "starter"
  try {
    const result = await getUserPlan(user.id)
    if (result && result.plan in PLAN_META) plan = result.plan
  } catch {
    plan = "starter"
  }

  let payments: PaymentRow[] = []
  try {
    const result = await getPayments()
    payments = Array.isArray(result) ? result : []
  } catch {
    payments = []
  }

  const currentPlan = PLAN_META[plan]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Subscription & Billing"
        subtitle="Manage your professional tier features, recurring payments, and billing history."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="overline-label">CURRENT PLAN</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-white">{currentPlan.label}</h2>
              <p className="mt-1 text-sm text-[#8F88FF]">${currentPlan.price}/mo</p>
            </div>
            <span className="brand-chip flex size-11 items-center justify-center rounded-xl">
              <CreditCard aria-hidden className="size-5 text-white" />
            </span>
          </div>

          <ul className="mt-6 space-y-3">
            {PLAN_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-[#D8D8DE]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#5C53FE]/15 text-[#8F88FF]">
                  <Check aria-hidden className="size-3" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/pricing" className="primary-button h-10 px-4 text-xs">
              Upgrade Plan
            </Link>
            <Link href="/checkout" className="ghost-button h-10 px-4 text-xs">
              Manage Plan
            </Link>
          </div>
        </section>

        <section className="surface-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-semibold text-white">Payment Method</h2>
            <p className="overline-label">SECURE BY STRIPE</p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-[#1A1A1F] p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-xl tracking-[0.12em] text-[#EDEDEF]">•••• •••• •••• 4242</p>
              <span className="rounded border border-white/15 bg-white/5 px-2 py-1 text-xs font-semibold italic text-[#EDEDEF]">
                VISA
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[#6E6E78]">CARD HOLDER</p>
                <p className="mt-1 text-[#D8D8DE]">{user.name}</p>
              </div>
              <div>
                <p className="text-[#6E6E78]">EXPIRES</p>
                <p className="mt-1 text-[#D8D8DE]">12/28</p>
              </div>
            </div>
          </div>

          <Link href="/pricing" className="ghost-button mt-6 h-10 w-full px-4 text-xs">
            Add New Payment Method
          </Link>
          <p className="mt-3 flex items-center gap-2 text-xs text-[#6E6E78]">
            <ShieldCheck aria-hidden className="size-3.5" />
            Payments are processed securely by Stripe.
          </p>
        </section>
      </div>

      <section>
        <h2 className="section-title mb-4">Billing History</h2>
        {payments.length > 0 ? (
          <DashboardTable headers={["Date", "Plan", "Amount", "Transaction ID", "Status"]}>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <TableCell>{formatDeadline(payment.createdAt)}</TableCell>
                <TableCell>{PLAN_META[payment.plan]?.label ?? payment.plan}</TableCell>
                <TableCell>
                  ${payment.amount.toFixed(2)} {payment.currency?.toUpperCase()}
                </TableCell>
                <TableCell className="font-mono text-xs text-[#A0A0AB]">{payment.transactionId}</TableCell>
                <TableCell>
                  <StatusPill status={payment.status as Parameters<typeof StatusPill>[0]["status"]} />
                </TableCell>
              </tr>
            ))}
          </DashboardTable>
        ) : (
          <EmptyState
            title="No billing history yet"
            description="Your payments and subscription charges will appear here."
          />
        )}
      </section>

      <section className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="font-heading text-base font-semibold text-white">Need help with your invoice?</h2>
          <p className="body-muted mt-1">Questions about a charge or refund? Our support team is here to help.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:support@hireloop.com" className="primary-button h-10 px-4 text-xs">
            Contact Support
          </a>
          <Link href="/refund-policy" className="ghost-button h-10 px-4 text-xs">
            Read Refund Policy
          </Link>
        </div>
      </section>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#6E6E78]">
        <p>© 2023 HireLoop Inc. All rights reserved.</p>
        <nav className="flex gap-4" aria-label="Legal">
          <Link href="/terms" className="transition-colors hover:text-white">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
