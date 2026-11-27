import {
  ApplicationStatusControl,
  EmptyState,
  ExportButton,
} from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { StatusPill } from "@/components/shared/status-pill"
import { getApplications } from "@/lib/api/applications"
import { requireUser } from "@/lib/core/server"
import { formatDeadline } from "@/lib/formatters"
import type { ApplicationRow } from "@/lib/types/applications"

function candidateName(email?: string) {
  const localPart = email?.split("@")[0]
  if (!localPart) return "Candidate"

  const name = localPart
    .replace(/[._]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())

  return name || "Candidate"
}

export default async function RecruiterApplicationsPage() {
  await requireUser("recruiter")

  let applications: ApplicationRow[] = []
  try {
    applications = await getApplications()
  } catch {
    applications = []
  }

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Review candidates and move them through your hiring pipeline."
        action={<ExportButton label="Export PDF" />}
      />

      <DashboardTable
        headers={["Candidate", "Job Title", "Applied", "Status", "Action"]}
      >
        {applications.length === 0 ? (
          <tr>
            <td colSpan={5}>
              <EmptyState
                title="No applications yet"
                description="Applications for your job posts will appear here."
              />
            </td>
          </tr>
        ) : (
          applications.map((application) => (
            <tr key={application._id}>
              <TableCell className="font-medium text-white">
                {candidateName(application.email)}
              </TableCell>
              <TableCell>{application.jobTitle}</TableCell>
              <TableCell className="whitespace-nowrap">
                {application.appliedAt
                  ? formatDeadline(application.appliedAt)
                  : "—"}
              </TableCell>
              <TableCell>
                <StatusPill status={application.status} />
              </TableCell>
              <TableCell>
                <ApplicationStatusControl application={application} />
              </TableCell>
            </tr>
          ))
        )}
      </DashboardTable>
    </>
  )
}
