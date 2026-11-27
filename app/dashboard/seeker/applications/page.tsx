import Link from "next/link"
import { CalendarDays, Send, Target, TrendingUp } from "lucide-react"

import {
  ApplicationStatusControl,
  EmptyState,
  ExportButton,
} from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusPill } from "@/components/shared/status-pill"
import { getApplications } from "@/lib/api/applications"
import { requireUser } from "@/lib/core/server"
import { formatRelativeTime } from "@/lib/formatters"
import type { ApplicationRow } from "@/lib/types/applications"
import { cn } from "@/lib/utils"

const VIEWS = [
  { key: "active", label: "Active", archived: false },
  { key: "archived", label: "Archived", archived: true },
] as const

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>
}) {
  await requireUser("seeker")

  const query = await searchParams
  const rawView = Array.isArray(query.view) ? query.view[0] : query.view
  const archived = rawView === "archived"

  let applications: ApplicationRow[] = []
  try {
    const result = await getApplications()
    applications = Array.isArray(result) ? result : []
  } catch {
    applications = []
  }

  const rows = applications.filter((application) => Boolean(application.archived) === archived)
  const shortlisted = applications.filter((application) => application.status === "shortlisted").length
  const interviews = applications.filter((application) => application.status === "interview").length
  const offers = applications.filter((application) => application.status === "offered").length
  const successRate = applications.length ? Math.round((offers / applications.length) * 100) : 0

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Applications"
        subtitle="Track your job applications and interview progress in real-time."
        action={<ExportButton label="Export PDF" />}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Applied" value={applications.length} icon={Send} />
        <StatCard label="Shortlisted" value={shortlisted} icon={Target} />
        <StatCard label="Interviews" value={interviews} icon={CalendarDays} />
        <StatCard label="Success Rate" value={`${successRate}%`} icon={TrendingUp} />
      </section>

      <nav aria-label="Application views" className="flex gap-1 border-b border-white/10">
        {VIEWS.map((view) => {
          const isActive = view.archived === archived

          return (
            <Link
              key={view.key}
              href={`?view=${view.key}`}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-[#EDEDEF] after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-[#5C53FE]"
                  : "text-[#A0A0AB] hover:text-white",
              )}
            >
              {view.label}
            </Link>
          )
        })}
      </nav>

      {rows.length > 0 ? (
        <DashboardTable headers={["Job Title", "Company", "Applied", "Status", "Action"]}>
          {rows.map((application) => {
            const arrangement = /hybrid/i.test(application.location ?? "")
              ? "hybrid"
              : application.isRemote
                ? "remote"
                : "on-site"

            return (
              <tr key={application._id}>
                <TableCell>
                  <span className="flex flex-col gap-1">
                    <Link
                      href={`/jobs/${application.jobId}`}
                      className="font-medium text-[#EDEDEF] hover:text-white"
                    >
                      {application.jobTitle}
                    </Link>
                    <span className="text-xs text-[#6E6E78]">
                      {application.jobType} • {arrangement}
                    </span>
                  </span>
                </TableCell>
                <TableCell>{application.companyName}</TableCell>
                <TableCell className="text-[#A0A0AB]">{formatRelativeTime(application.appliedAt)}</TableCell>
                <TableCell>
                  <StatusPill status={application.status} />
                </TableCell>
                <TableCell>
                  <ApplicationStatusControl application={application} showArchive showStatus={false} />
                </TableCell>
              </tr>
            )
          })}
        </DashboardTable>
      ) : (
        <EmptyState
          title={archived ? "No archived applications" : "No active applications"}
          description={
            archived
              ? "Applications you archive will be kept here and can be restored at any time."
              : "Apply to a job to start tracking your progress here."
          }
        />
      )}

      <p className="text-xs text-[#6E6E78]">
        Showing {rows.length ? `1-${rows.length}` : 0} of {rows.length} applications
      </p>
    </div>
  )
}
