import Link from "next/link"

import { EmptyState, JobActions } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { Pill } from "@/components/shared/pill"
import { getMyJobs } from "@/lib/api/jobs"
import { requireUser } from "@/lib/core/server"
import { formatCompensation, formatDeadline } from "@/lib/formatters"
import { JOB_STATUS_META } from "@/lib/types/domain"
import type { JobRow } from "@/lib/types/jobs"

function formatJobType(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default async function ManageJobsPage() {
  await requireUser("recruiter")

  let jobs: JobRow[] = []
  try {
    jobs = await getMyJobs()
  } catch {
    jobs = []
  }

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#6E6E78]"
      >
        <span>Manage Jobs</span>
        <span aria-hidden className="text-[#4B4B52]">
          &gt;
        </span>
        <span className="text-[#A0A0AB]">Job Listings &amp; Postings</span>
      </nav>

      <PageHeader
        title="Manage Job Posts"
        subtitle="Review live listings, monitor applicants, and update job details across your organization."
        action={
          <Link
            href="/dashboard/recruiter/jobs/new"
            className="primary-button h-10 px-4 text-xs"
          >
            + New Job Post
          </Link>
        }
      />

      <DashboardTable
        headers={[
          "JOB TITLE & DEPT",
          "COMPANY & LOCATION",
          "TYPE",
          "COMPENSATION",
          "APPLICANTS",
          "STATUS",
          "DEADLINE",
          "ACTIONS",
        ]}
      >
        {jobs.length === 0 ? (
          <tr>
            <td colSpan={8}>
              <EmptyState
                title="No job posts yet"
                description="Create your first listing to start attracting candidates."
              />
            </td>
          </tr>
        ) : (
          jobs.map((job) => {
            const meta = JOB_STATUS_META[job.status] ?? {
              label: job.status,
              color: "#A0A0AB",
            }

            return (
              <tr key={job._id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="font-medium text-white transition-colors hover:text-[#8F88FF]"
                    >
                      {job.title}
                    </Link>
                    <span className="text-xs text-[#6E6E78]">
                      {job.category || "—"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#EDEDEF]">{job.companyName}</span>
                    <span className="text-xs text-[#6E6E78]">
                      {job.isRemote ? "Remote · " : ""}
                      {job.location || "—"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatJobType(job.jobType)}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCompensation(job)}
                </TableCell>
                <TableCell>{job.applicants ?? 0}</TableCell>
                <TableCell>
                  <Pill label={meta.label} color={meta.color} dot />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {job.deadline ? formatDeadline(job.deadline) : "—"}
                </TableCell>
                <TableCell>
                  <JobActions job={job} />
                </TableCell>
              </tr>
            )
          })
        )}
      </DashboardTable>
    </>
  )
}
