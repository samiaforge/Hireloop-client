import Link from "next/link"
import { Building2, CreditCard, DollarSign, SlidersHorizontal, UserRound } from "lucide-react"

import { EmptyState, ExportButton } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Pill } from "@/components/shared/pill"
import { StatusPill } from "@/components/shared/status-pill"
import { getPayments, getPaymentSummary } from "@/lib/api/payments"
import { requireUser } from "@/lib/core/server"
import { PLAN_META } from "@/lib/types/domain"
import { cn } from "@/lib/utils"

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function formatMoney(value: number) {
  return moneyFormatter.format(Number.isFinite(value) ? value : 0)
}

function formatDate(value?: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

function paymentStatus(status?: string | null): "success" | "pending" | "failed" {
  const normalized = (status ?? "").toLowerCase()
  if (normalized === "pending") return "pending"
  if (normalized === "failed") return "failed"
  return "success"
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
        active
          ? "border-[#5C53FE]/50 bg-[#5C53FE]/15 text-[#C3C0FF]"
          : "border-white/10 bg-white/5 text-[#A0A0AB] hover:border-white/25 hover:text-white",
      )}
    >
      {label}
    </Link>
  )
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>
}) {
  await requireUser("admin")

  const params = await searchParams
  const requestedStatus = Array.isArray(params.status) ? params.status[0] : params.status
  const filter =
    requestedStatus === "success" || requestedStatus === "pending" || requestedStatus === "failed"
      ? requestedStatus
      : "all"

  const [paymentsResult, summaryResult] = await Promise.all([
    getPayments().catch(() => []),
    getPaymentSummary().catch(() => null),
  ])

  const payments = Array.isArray(paymentsResult) ? paymentsResult : []
  const summary = summaryResult

  const collected = payments.reduce((total, payment) => total + (Number(payment.amount) || 0), 0)
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
  const monthlyCollected = payments.reduce((total, payment) => {
    const time = new Date(payment.createdAt).getTime()
    return Number.isNaN(time) || time < monthStart ? total : total + (Number(payment.amount) || 0)
  }, 0)

  const proCount = payments.filter(
    (payment) => payment.plan === "growth" || payment.plan === "premium",
  ).length
  const enterpriseCount = payments.filter((payment) => payment.plan === "premium").length

  const visiblePayments = payments.filter((payment) => {
    if (filter === "all") return true
    return paymentStatus(payment.status) === filter
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments & Subscriptions"
        subtitle="Comprehensive overview of platform revenue and active subscriptions."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Revenue metrics">
        <StatCard
          label="Total Revenue"
          value={formatMoney(summary?.totalRevenue ?? collected)}
          detail="+12.4% vs last month"
          icon={DollarSign}
        />
        <StatCard
          label="Monthly Revenue"
          value={formatMoney(summary?.monthlyRevenue ?? monthlyCollected)}
          detail="+8.1% vs last month"
          icon={CreditCard}
        />
        <StatCard
          label="Active Pro Users"
          value={proCount > 0 ? proCount : (summary?.activeSubscriptions ?? 0)}
          detail="+2.3% vs last month"
          icon={UserRound}
        />
        <StatCard
          label="Active Enterprise Users"
          value={enterpriseCount}
          detail="+15.7% vs last month"
          icon={Building2}
        />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">Recent Transactions</h2>
            <p className="body-muted mt-1">Every subscription payment recorded on the platform.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ghost-button h-9 px-3 text-xs">
              <SlidersHorizontal aria-hidden className="size-3.5" />
              Filter
            </span>
            <ExportButton label="Export CSV" />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterLink href="/dashboard/admin/payments" label="All" active={filter === "all"} />
          <FilterLink href="/dashboard/admin/payments?status=success" label="Success" active={filter === "success"} />
          <FilterLink href="/dashboard/admin/payments?status=pending" label="Pending" active={filter === "pending"} />
          <FilterLink href="/dashboard/admin/payments?status=failed" label="Failed" active={filter === "failed"} />
        </div>

        {visiblePayments.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Payments will appear here once a subscription checkout is completed."
          />
        ) : (
          <DashboardTable
            headers={["USER EMAIL", "PLAN", "AMOUNT", "DATE", "TRANSACTION ID", "STATUS"]}
          >
            {visiblePayments.map((payment) => {
              const plan = PLAN_META[payment.plan]

              return (
                <tr key={payment._id || payment.transactionId}>
                  <TableCell className="text-[#EDEDEF]">{payment.email || "—"}</TableCell>
                  <TableCell>
                    <Pill label={plan?.label ?? "Starter"} color={plan?.color ?? "#A0A0AB"} />
                  </TableCell>
                  <TableCell className="font-medium text-[#EDEDEF]">{formatMoney(payment.amount)}</TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell className="font-mono text-xs text-[#A0A0AB]">
                    {payment.transactionId || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={paymentStatus(payment.status)} />
                  </TableCell>
                </tr>
              )
            })}
          </DashboardTable>
        )}
      </section>
    </div>
  )
}
