import Link from "next/link"
import { redirect } from "next/navigation"

import { JobForm } from "@/components/dashboard/job-form"
import { PageHeader } from "@/components/dashboard/page-shell"
import { canManageJob } from "@/lib/actions/dashboard"
import { getMyCompany } from "@/lib/api/companies"
import { getJobById } from "@/lib/api/jobs"
import { requireUser } from "@/lib/core/server"
import type { CompanyRow } from "@/lib/types/domain"
import type { JobRow } from "@/lib/types/jobs"

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser("recruiter")
  const { id } = await params

  let job: JobRow | null = null
  try {
    job = await getJobById(id)
  } catch {
    job = null
  }
  if (!job) redirect("/unauthorized")

  let canManage = false
  try {
    canManage = await canManageJob(id, user.id)
  } catch {
    canManage = false
  }
  if (!canManage) redirect("/unauthorized")

  let company: CompanyRow | null = null
  try {
    company = await getMyCompany()
  } catch {
    company = null
  }

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#6E6E78]"
      >
        <Link
          href="/dashboard/recruiter/jobs"
          className="transition-colors hover:text-[#8F88FF]"
        >
          Manage Jobs
        </Link>
        <span aria-hidden className="text-[#4B4B52]">
          &gt;
        </span>
        <Link
          href="/dashboard/recruiter/jobs"
          className="transition-colors hover:text-[#8F88FF]"
        >
          Job Listings &amp; Postings
        </Link>
        <span aria-hidden className="text-[#4B4B52]">
          &gt;
        </span>
        <span className="text-[#A0A0AB]">Update Job Post</span>
      </nav>

      <PageHeader
        title="Update Job Post"
        subtitle="Modify position specifications, compensation range, and candidate requirements for this listing."
      />

      <JobForm
        job={job}
        companyName={company?.name ?? job.companyName ?? ""}
        recruiterId={user.id}
      />
    </>
  )
}
