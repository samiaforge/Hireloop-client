import { Suspense } from "react"

import { SiteNavbar } from "@/components/site-navbar"
import JobCard from "@/components/job-card"
import { getJobs } from "@/lib/api/jobs"

import { JobSearchBar } from "./_components/job-search-bar"
import { JobFiltersPanel } from "./_components/job-filters-panels"

export const dynamic = "force-dynamic"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ""

export default async function BrowseJobsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams

  const query = new URLSearchParams()
  const search = first(params.search || params.q)
  const jobType = first(params.jobType)
  const category = first(params.category)
  const isRemote = first(params.isRemote)

  if (search) query.set("search", search)
  if (jobType) query.set("jobType", jobType)
  if (category) query.set("category", category)
  if (isRemote === "remote" || isRemote === "true") query.set("isRemote", "true")

  const jobs = await getJobs(query.toString()).catch(() => [])

  return (
    <>
      <SiteNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <Suspense fallback={<div className="surface-card h-[109px] animate-pulse" />}>
          <JobSearchBar />
        </Suspense>

        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-8">
          <aside>
            <JobFiltersPanel jobs={jobs} />
          </aside>

          <section className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="section-title">Found {jobs.length} Professional Jobs</h2>
              <span className="text-[13px] text-[#808089]">Sort by: Most Recent</span>
            </div>

            <ul className="mt-4 flex list-none flex-col gap-3">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
              {jobs.length === 0 ? (
                <li className="surface-card p-10 text-center text-sm text-[#6E6E78]">
                  No jobs match your current search.
                </li>
              ) : null}
            </ul>

            {jobs.length > 0 ? (
              <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-md border border-[#5C53FE] bg-[#5C53FE] text-sm text-white">1</span>
                <span className="flex size-8 items-center justify-center rounded-md border border-white/10 text-sm text-[#A0A0AB]">2</span>
                <span className="flex size-8 items-center justify-center rounded-md border border-white/10 text-sm text-[#A0A0AB]">3</span>
                <span className="flex size-8 items-center justify-center rounded-md border border-white/10 text-sm text-[#A0A0AB]">›</span>
              </nav>
            ) : null}
          </section>
        </div>
      </main>
    </>
  )
}
