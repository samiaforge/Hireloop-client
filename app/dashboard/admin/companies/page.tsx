import Link from "next/link"
import { Check, Clock, X } from "lucide-react"

import { CompanyStatusControl, EmptyState } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusPill } from "@/components/shared/status-pill"
import { getAllCompanies } from "@/lib/api/companies"
import { requireUser } from "@/lib/core/server"
import type { CompanyStatus } from "@/lib/types/domain"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: { value: CompanyStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

function safeStatus(status: string): CompanyStatus {
  return status === "approved" || status === "rejected" ? status : "pending"
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-colors",
        active
          ? "border-[#5C53FE]/50 bg-[#5C53FE]/15 text-[#C3C0FF]"
          : "border-white/10 bg-white/5 text-[#A0A0AB] hover:border-white/25 hover:text-white",
      )}
    >
      {label}
    </Link>
  )
}

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>
}) {
  await requireUser("admin")

  const params = await searchParams
  const requestedStatus = Array.isArray(params.status) ? params.status[0] : params.status
  const status: CompanyStatus | "all" =
    requestedStatus === "pending" || requestedStatus === "approved" || requestedStatus === "rejected"
      ? requestedStatus
      : "all"

  const companiesResult = await getAllCompanies().catch(() => [])
  const companies = Array.isArray(companiesResult) ? companiesResult : []

  const pending = companies.filter((company) => safeStatus(company.status) === "pending").length
  const approved = companies.filter((company) => safeStatus(company.status) === "approved").length
  const rejected = companies.filter((company) => safeStatus(company.status) === "rejected").length

  const visibleCompanies =
    status === "all" ? companies : companies.filter((company) => safeStatus(company.status) === status)

  return (
    <div className="space-y-8">
      <PageHeader title="Companies" subtitle="Review and approve company registrations." />

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Company metrics">
        <StatCard label="Pending" value={pending} detail="Awaiting approval" icon={Clock} />
        <StatCard label="Approved" value={approved} detail="Live on the platform" icon={Check} />
        <StatCard label="Rejected" value={rejected} detail="Registration declined" icon={X} />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="overline-label mr-1">Filter by status</span>
          {STATUS_OPTIONS.map((option) => (
            <FilterLink
              key={option.value}
              href={`/dashboard/admin/companies?status=${option.value}`}
              label={option.label}
              active={status === option.value}
            />
          ))}
        </div>

        {visibleCompanies.length === 0 ? (
          <EmptyState
            title="No companies found"
            description="Company registrations will appear here for review once submitted."
          />
        ) : (
          <DashboardTable headers={["Name", "Industry", "Recruiter", "Location", "Status", "Actions"]}>
            {visibleCompanies.map((company) => {
              const companyStatus = safeStatus(company.status)

              return (
                <tr key={company._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="brand-chip flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-[#EDEDEF]">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{company.industry || "—"}</TableCell>
                  <TableCell>{company.recruiterEmail || company.recruiterId || "—"}</TableCell>
                  <TableCell>{company.location || "—"}</TableCell>
                  <TableCell>
                    <StatusPill status={companyStatus} />
                  </TableCell>
                  <TableCell>
                    <CompanyStatusControl id={company._id} status={companyStatus} />
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
