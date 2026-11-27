import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CreditCard,
  TrendingUp,
  Users,
} from "lucide-react"

import { EmptyState, ExportButton } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { SectionHeading } from "@/components/dashboard/section-heading"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusPill } from "@/components/shared/status-pill"
import { getAllCompanies } from "@/lib/api/companies"
import { getAllJobs } from "@/lib/api/jobs"
import { getPayments, getPaymentSummary } from "@/lib/api/payments"
import { getUsers } from "@/lib/api/user"
import { requireUser } from "@/lib/core/server"
import { PLAN_META } from "@/lib/types/domain"

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

function timestamp(value?: string | null) {
  const time = value ? new Date(value).getTime() : 0
  return Number.isNaN(time) ? 0 : time
}

function paymentStatus(status?: string | null): "success" | "pending" | "failed" {
  const normalized = (status ?? "").toLowerCase()
  if (normalized === "pending") return "pending"
  if (normalized === "failed") return "failed"
  return "success"
}

export default async function AdminDashboardPage() {
  await requireUser("admin")

  const [usersResult, companiesResult, jobsResult, paymentsResult, summaryResult] = await Promise.all([
    getUsers().catch(() => []),
    getAllCompanies().catch(() => []),
    getAllJobs().catch(() => []),
    getPayments().catch(() => []),
    getPaymentSummary().catch(() => null),
  ])

  const users = Array.isArray(usersResult) ? usersResult : []
  const companies = Array.isArray(companiesResult) ? companiesResult : []
  const jobs = Array.isArray(jobsResult) ? jobsResult : []
  const payments = Array.isArray(paymentsResult) ? paymentsResult : []
  const summary = summaryResult

  const recruiters = users.filter((user) => user.role === "recruiter").length
  const collected = payments.reduce((total, payment) => total + (Number(payment.amount) || 0), 0)
  const revenue = summary?.totalRevenue ?? collected

  const recent = [...payments]
    .sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Real-time platform performance and growth metrics."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <span className="ghost-button h-9 px-3 text-xs">
              <CalendarDays aria-hidden className="size-3.5" />
              Last 30 Days
            </span>
            <ExportButton label="Export Report" />
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Platform metrics">
        <StatCard label="Total Users" value={users.length} detail="+12% vs last month" icon={Users} />
        <StatCard label="Total Recruiters" value={recruiters} detail="+8% vs last month" icon={TrendingUp} />
        <StatCard label="Total Companies" value={companies.length} detail="0% vs last month" icon={Building2} />
        <StatCard label="Jobs Posted" value={jobs.length} detail="+24% vs last month" icon={BriefcaseBusiness} />
        <StatCard label="Platform Revenue" value={formatMoney(revenue)} detail="+18.5% vs last month" icon={CreditCard} />
      </section>

      <section>
        <SectionHeading
          title="Recent Subscription Transactions"
          actionLabel="View All Activity"
          actionHref="/dashboard/admin/payments"
        />
        {recent.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Subscription purchases will appear here as soon as recruiters upgrade a plan."
          />
        ) : (
          <DashboardTable
            headers={["USER/RECRUITER", "PLAN TYPE", "TRANSACTION ID", "AMOUNT", "DATE", "STATUS"]}
          >
            {recent.map((payment) => {
              const email = payment.email ?? ""
              const matchedUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
              const displayName = matchedUser?.name || email.split("@")[0] || "Unknown user"
              const plan = PLAN_META[payment.plan]

              return (
                <tr key={payment._id || payment.transactionId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="brand-chip flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#EDEDEF]">{displayName}</p>
                        <p className="truncate text-xs text-[#6E6E78]">{email || "—"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{plan?.label ?? payment.plan ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-[#A0A0AB]">
                    {payment.transactionId || "—"}
                  </TableCell>
                  <TableCell className="font-medium text-[#EDEDEF]">{formatMoney(payment.amount)}</TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
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
