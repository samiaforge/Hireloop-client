import { CompanyForm } from "@/components/dashboard/company-form"
import { PageHeader } from "@/components/dashboard/page-shell"
import { getMyCompany } from "@/lib/api/companies"
import { requireUser } from "@/lib/core/server"
import type { CompanyRow } from "@/lib/types/domain"

export default async function RecruiterCompanyPage() {
  await requireUser("recruiter")

  let company: CompanyRow | null = null
  try {
    company = await getMyCompany()
  } catch {
    company = null
  }

  return (
    <>
      <PageHeader
        title="My Company"
        subtitle="Manage your employer profile and how your organization appears to candidates."
      />

      {company?.status !== "approved" ? (
        <p className="surface-card mb-6 border-l-2 border-l-[#F59E0B] p-4 text-[13px] text-[#A0A0AB]">
          Jobs can only be posted after your company has been approved.
        </p>
      ) : null}

      <CompanyForm company={company} />
    </>
  )
}
