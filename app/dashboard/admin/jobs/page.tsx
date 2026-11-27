import Link from "next/link"
import { Activity, Clock, Users } from "lucide-react"

import { EmptyState, JobActions } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { SectionHeading } from "@/components/dashboard/section-heading"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusPill } from "@/components/shared/status-pill"
import { getAllJobs } from "@/lib/api/jobs"
import { requireUser } from "@/lib/core/server"
import { JOB_CATEGORIES } from "@/lib/types/jobs"
import { cn } from "@/lib/utils"

type JobFilterStatus = "active" | "closed" | "draft" | "expired"

function safeStatus(status: string): JobFilterStatus {
  return status === "closed" || status === "draft" || status === "expired" ? status : "active"
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

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; category?: string | string[] }>
}) {
  await requireUser("admin")

  const params = await searchParams
  const pick = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)
  const requestedStatus = pick(params.status) ?? "all"
  const requestedCategory = pick(params.category) ?? "all"
  const status = requestedStatus === "active" || requestedStatus === "closed" ? requestedStatus : "all"
  const category = requestedCategory || "all"

  const jobsResult = await getAllJobs().catch(() => [])
  const jobs = Array.isArray(jobsResult) ? jobsResult : []
  const totalApplications = jobs.reduce((total, job) => total + (Number(job.applicants) || 0), 0)

  const activeCount = jobs.filter((job) => safeStatus(job.status) === "active").length
  const closedCount = jobs.filter((job) => safeStatus(job.status) === "closed").length

  const buildHref = (next: { status?: string; category?: string }) => {
    const query = new URLSearchParams()
    const nextStatus = next.status ?? status
    const nextCategory = next.category ?? category
    if (nextStatus !== "all") query.set("status", nextStatus)
    if (nextCategory !== "all") query.set("category", nextCategory)
    const suffix = query.toString()
    return `/dashboard/admin/jobs${suffix ? `?${suffix}` : ""}`
  }

  const visibleJobs = jobs.filter((job) => {
    const matchesStatus = status === "all" || safeStatus(job.status) === status
    const matchesCategory = category === "all" || job.category === category
    return matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Jobs"
        subtitle="Oversee all active listings and historical job posts across the platform."
      />

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterLink href={buildHref({ status: "all" })} label={`All Jobs (${jobs.length})`} active={status === "all"} />
          <FilterLink href={buildHref({ status: "active" })} label={`Active (${activeCount})`} active={status === "active"} />
          <FilterLink href={buildHref({ status: "closed" })} label={`Closed (${closedCount})`} active={status === "closed"} />
        </div>

        <div className="mb-4 flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="overline-label mr-1">Status</span>
            <FilterLink href={buildHref({ status: "all" })} label="All Statuses" active={status === "all"} />
            <FilterLink href={buildHref({ status: "active" })} label="Active" active={status === "active"} />
            <FilterLink href={buildHref({ status: "closed" })} label="Closed" active={status === "closed"} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="overline-label mr-1">Category</span>
            <FilterLink href={buildHref({ category: "all" })} label="All Categories" active={category === "all"} />
            {JOB_CATEGORIES.map((option) => (
              <FilterLink
                key={option}
                href={buildHref({ category: option })}
                label={option}
                active={category === option}
              />
            ))}
          </div>
        </div>

        {visibleJobs.length === 0 ? (
          <EmptyState title="No jobs found" description="Try clearing a filter to see more listings." />
        ) : (
          <DashboardTable
            headers={["Title", "Company", "Category", "Type", "Date Posted", "Status", "Actions"]}
          >
            {visibleJobs.map((job) => (
              <tr key={job._id}>
                <TableCell>
                  <span className="font-medium text-[#EDEDEF]">{job.title}</span>
                </TableCell>
                <TableCell>{job.companyName || "—"}</TableCell>
                <TableCell>{job.category || "—"}</TableCell>
                <TableCell className="capitalize">{job.jobType.replace("-", " ")}</TableCell>
                <TableCell>{job.posted || "—"}</TableCell>
                <TableCell>
                  <StatusPill status={safeStatus(job.status)} />
                </TableCell>
                <TableCell>
                  <JobActions job={job} />
                </TableCell>
              </tr>
            ))}
          </DashboardTable>
        )}
      </section>

      <section>
        <SectionHeading title="Insights" />
        <p className="body-muted mb-4">
          Platform-wide engagement and hiring signals, refreshed with the latest activity.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Engagement Rate" value="82.4%" detail="+5.2% from last month" icon={Activity} />
          <StatCard label="Avg. Time to Fill" value="14 Days" detail="Stable performance" icon={Clock} />
          <StatCard
            label="Total Applications"
            value={totalApplications.toLocaleString("en-US")}
            detail="-2.1% across tech sectors"
            icon={Users}
          />
        </div>
      </section>
    </div>
  )
}
