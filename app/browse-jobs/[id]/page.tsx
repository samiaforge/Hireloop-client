import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SiteNavbar } from "@/components/site-navbar"
import { getCompanyById } from "@/lib/api/companies"
import { getJobById, getJobs } from "@/lib/api/jobs"
import JobCard from "@/components/job-card"

import { JobHeaderCard } from "./_components/job-header-card"
import { JobHighlights } from "./_components/job-highlights"
import { JobContentCard } from "./_components/job-content-card"
import { CompanyOverviewCard } from "./_components/company-overview-card"

export const dynamic = "force-dynamic"

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJobById(id).catch(() => null)
  if (!job) notFound()

  const company = job.companyId
    ? await getCompanyById(job.companyId).catch(() => null)
    : null

  let similar: Awaited<ReturnType<typeof getJobs>> = []
  try {
    const all = await getJobs(`status=active&category=${encodeURIComponent(job.category)}`)
    similar = all.filter((item) => item._id !== job._id).slice(0, 3)
  } catch {
    similar = []
  }

  return (
    <>
      <SiteNavbar />
      <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
        <JobHeaderCard job={job} />

        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_397px] lg:gap-6">
          <div className="flex min-w-0 flex-col gap-6">
            <JobHighlights job={job} />
            <JobContentCard job={job} />
          </div>
          <div>
            <CompanyOverviewCard job={job} company={company} />
          </div>
        </div>

        {similar.length ? (
          <section className="mt-14">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="section-title">Similar jobs</h2>
              <Link href="/jobs" className="inline-flex items-center gap-1 text-[13px] text-[#8F88FF]">
                View all <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            </div>
            <ul className="flex list-none flex-col gap-3">
              {similar.map((item) => <JobCard key={item._id} job={item} />)}
            </ul>
          </section>
        ) : null}
      </main>
    </>
  )
}
