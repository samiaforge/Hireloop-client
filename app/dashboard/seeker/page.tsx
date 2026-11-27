import Link from "next/link"
import { Bookmark, CalendarDays, Search, Send, Trophy } from "lucide-react"

import { EmptyState } from "@/components/dashboard/controls"
import { PageHeader } from "@/components/dashboard/page-shell"
import { SectionHeading } from "@/components/dashboard/section-heading"
import { StatCard } from "@/components/dashboard/stat-card"
import { getApplications } from "@/lib/api/applications"
import { getSavedJobs } from "@/lib/api/saved-jobs"
import { requireUser } from "@/lib/core/server"
import { formatRelativeTime } from "@/lib/formatters"
import { STATUS_META, type ApplicationRow, type ApplicationStatus } from "@/lib/types/applications"

export default async function SeekerDashboardPage() {
  await requireUser("seeker")

  let applications: ApplicationRow[] = []
  try {
    const result = await getApplications()
    applications = Array.isArray(result) ? result : []
  } catch {
    applications = []
  }

  let savedCount = 0
  try {
    const result = await getSavedJobs()
    savedCount = Array.isArray(result) ? result.length : 0
  } catch {
    savedCount = 0
  }

  const interviews = applications.filter((application) => application.status === "interview").length
  const offers = applications.filter((application) => application.status === "offered").length
  const recentActivity = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <PageHeader
        overline="SEEKER OVERVIEW"
        title="Dashboard"
        subtitle="Track your search and stay on top of every opportunity."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saved Jobs" value={savedCount} icon={Bookmark} detail="Bookmarked opportunities" />
        <StatCard
          label="Applications Submitted"
          value={applications.length}
          icon={Send}
          detail="Across all your searches"
        />
        <StatCard
          label="Interviews Scheduled"
          value={interviews}
          icon={CalendarDays}
          detail="Currently in progress"
        />
        <StatCard label="Offers Received" value={offers} icon={Trophy} detail="Offers on the table" />
      </section>

      <section>
        <SectionHeading
          title="Recent Activity"
          actionLabel="View All Activity"
          actionHref="/dashboard/seeker/applications"
        />
        {recentActivity.length > 0 ? (
          <ul className="surface-card overflow-hidden divide-y divide-white/5">
            {recentActivity.map((application) => {
              const statusLabel =
                STATUS_META[application.status as ApplicationStatus]?.label ?? application.status

              return (
                <li key={application._id}>
                  <Link
                    href={
                      application.jobId ? `/jobs/${application.jobId}` : "/dashboard/seeker/applications"
                    }
                    className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-[#8F88FF]/30 bg-[#8F88FF]/10 text-[#8F88FF]">
                      <Send aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-5 text-[#EDEDEF]">
                        {`Application for ${application.jobTitle} at ${application.companyName} updated to '${statusLabel}'`}
                      </span>
                      <span className="mt-1 block text-xs text-[#6E6E78]">
                        {formatRelativeTime(application.appliedAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            title="No recent activity yet"
            description="When you apply to jobs, your progress will show up here."
          />
        )}
      </section>

      <Link
        href="/jobs"
        aria-label="Browse jobs"
        className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#5C53FE] text-white shadow-lg shadow-[#5C53FE]/30 transition-colors hover:bg-[#6f67ff]"
      >
        <Search aria-hidden className="size-6" />
      </Link>
    </div>
  )
}
