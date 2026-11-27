import Link from "next/link"

import { JobForm } from "@/components/dashboard/job-form"
import { PageHeader } from "@/components/dashboard/page-shell"
import { getMyCompany } from "@/lib/api/companies"
import { requireUser } from "@/lib/core/server"
import type { CompanyRow } from "@/lib/types/domain"

export default async function NewJobPage() {
  const user = await requireUser("recruiter")

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
        <span className="text-[#A0A0AB]">Create New Listing</span>
      </nav>

      <PageHeader
        title="Post a New Job"
        subtitle="Fill in the position specifications to attract qualified talent across our network."
        action={
          <Link
            href="#publish-job"
            className="primary-button h-10 px-4 text-xs"
          >
            Publish Job
          </Link>
        }
      />

      {company?.status !== "approved" ? (
        <p className="body-muted mb-6">
          Jobs can only be posted after your company has been approved.
        </p>
      ) : null}

      <div id="publish-job" className="scroll-mt-6">
        <JobForm companyName={company?.name ?? ""} recruiterId={user.id} />
      </div>
    </>
  )
}
