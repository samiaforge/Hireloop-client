import Link from "next/link"
import { Archive, BriefcaseBusiness, Check, Plus, Users } from "lucide-react"

import { EmptyState } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { SectionHeading } from "@/components/dashboard/section-heading"
import { StatCard } from "@/components/dashboard/stat-card"
import { Pill } from "@/components/shared/pill"
import { getApplications } from "@/lib/api/applications"
import { getMyJobs } from "@/lib/api/jobs"
import { requireUser } from "@/lib/core/server"
import { formatDeadline } from "@/lib/formatters"
import {
  STATUS_META,
  type ApplicationRow,
  type ApplicationStatus,
} from "@/lib/types/applications"
import type { JobRow } from "@/lib/types/jobs"

/** Recruiter-facing labels from the Figma dashboard (distinct from seeker labels). */
const FIGMA_STATUS_LABELS: Partial<Record<ApplicationStatus, string>> = {
  applied: "New",
  review: "Reviewing",
  interview: "Interviewing",
}

function candidateName(email?: string) {
  const localPart = email?.split("@")[0]
  if (!localPart) return "Candidate"

  const name = localPart
    .replace(/[._]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())

  return name || "Candidate"
}

export default async function RecruiterDashboardPage() {
  const user = await requireUser("recruiter")

  let jobs: JobRow[] = []
  let applications: ApplicationRow[] = []

  try {
    jobs = await getMyJobs()
  } catch {
    jobs = []
  }

  try {
    applications = await getApplications()
  } catch {
    applications = []
  }

  const firstName = user.name?.split(" ")[0] || "there"
  const activeJobs = jobs.filter((job) => job.status === "active").length
  const closedJobs = jobs.filter((job) => job.status === "closed").length

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here is a snapshot of your hiring pipeline and recent candidate activity."
        action={
          <Link
            href="/dashboard/recruiter/jobs/new"
            className="primary-button h-10 px-4 text-xs"
          >
            <Plus aria-hidden className="size-4" />
            Create Job Post
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Job Posts"
          value={jobs.length}
          icon={BriefcaseBusiness}
        />
        <StatCard
          label="Total Applicants"
          value={applications.length}
          icon={Users}
        />
        <StatCard
          label="Active Jobs"
          value={activeJobs}
          icon={Check}
          detail="Currently accepting applications"
        />
        <StatCard label="Jobs Closed" value={closedJobs} icon={Archive} />
      </div>

      <section className="mt-10">
        <SectionHeading
          title="Recent Applications"
          actionLabel="View all"
          actionHref="/dashboard/recruiter/applications"
        />
        <DashboardTable
          headers={[
            "Candidate Name",
            "Role",
            "Date Applied",
            "Experience",
            "Status",
          ]}
        >
          {applications.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <EmptyState
                  title="No applications yet"
                  description="Candidate applications will appear here as they come in."
                />
              </td>
            </tr>
          ) : (
            applications.slice(0, 5).map((application) => {
              const meta = STATUS_META[application.status] ?? {
                label: application.status,
                color: "#A0A0AB",
              }
              const label = FIGMA_STATUS_LABELS[application.status] ?? meta.label

              return (
                <tr key={application._id}>
                  <TableCell className="font-medium text-white">
                    {candidateName(application.email)}
                  </TableCell>
                  <TableCell>{application.jobTitle}</TableCell>
                  <TableCell>
                    {application.appliedAt
                      ? formatDeadline(application.appliedAt)
                      : "—"}
                  </TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>
                    <Pill label={label} color={meta.color} dot />
                  </TableCell>
                </tr>
              )
            })
          )}
        </DashboardTable>
      </section>
    </>
  )
}
