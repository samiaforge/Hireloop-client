import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { SiteNavbar } from "@/components/site-navbar"
import JobCard from "@/components/job-card"
import { getJobs } from "@/lib/api/jobs"
import { FIGMA_JOBS, FIGMA_TOTAL_JOBS } from "@/lib/data/figma-jobs"

import { JobFiltersPanel } from "./_components/job-filters-panels"
import { JobSearchBar } from "./_components/job-search-bar"
import { JobSortSelect } from "./_components/job-sort-select"

export const dynamic = "force-dynamic"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ""
const all = (value: string | string[] | undefined) =>
    value == null ? [] : Array.isArray(value) ? value : [value]

const PAGE_SIZE = 4

export default async function BrowseJobsPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams

    const search = first(params.search || params.q)
    const jobType = first(params.jobType)
    const category = first(params.category)
    const remoteValues = all(params.isRemote)
    const isRemote = remoteValues.some((value) => value === "remote" || value === "true")
    const sort = first(params.sort) || "recent"
    const requestedPage = Number(first(params.page)) || 1

    const query = new URLSearchParams()
    if (search) query.set("search", search)
    if (jobType) query.set("jobType", jobType)
    if (category) query.set("category", category)
    if (isRemote) query.set("isRemote", "true")

    const jobs = await getJobs(query.toString()).catch(() => [])

    const sortedJobs = [...jobs].sort((a, b) => {
        if (sort === "salary-desc") return Number(b.maxSalary || 0) - Number(a.maxSalary || 0)
        if (sort === "salary-asc") return Number(a.minSalary || 0) - Number(b.minSalary || 0)
        if (sort === "title") return a.title.localeCompare(b.title)
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })

    const isFigmaDemo =
        sortedJobs.length === FIGMA_JOBS.length && sortedJobs.every((item) => item._id.startsWith("figma-"))
    const totalPages = isFigmaDemo ? 5 : Math.max(1, Math.ceil(sortedJobs.length / PAGE_SIZE))
    const page = Math.min(Math.max(requestedPage, 1), totalPages)
    const visibleJobs = isFigmaDemo ? sortedJobs : sortedJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const resultCount = isFigmaDemo ? FIGMA_TOTAL_JOBS : jobs.length

    const pageHref = (target: number) => {
        const next = new URLSearchParams()
        for (const [key, value] of Object.entries(params)) {
            if (value == null || key === "page") continue
            if (Array.isArray(value)) value.forEach((item) => next.append(key, item))
            else next.set(key, value)
        }
        next.set("page", String(target))
        return `?${next.toString()}`
    }

    return (
        <>
            <SiteNavbar />
            <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-4 sm:px-6">
                <Suspense fallback={<div className="surface-card h-[109px] animate-pulse" />}>
                    <JobSearchBar />
                </Suspense>

                <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-8">
                    <aside>
                        <JobFiltersPanel
                            jobs={jobs}
                            selectedJobType={jobType ? [jobType] : []}
                            selectedCategory={category ? [category] : []}
                            selectedRemote={isRemote ? ["remote"] : []}
                        />
                    </aside>

                    <section className="min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h2 className="section-title">Found {resultCount.toLocaleString()} Professional Jobs</h2>
                            <Suspense fallback={<div className="h-9 w-40 animate-pulse rounded-lg bg-white/5" />}>
                                <JobSortSelect defaultValue={sort} />
                            </Suspense>
                        </div>

                        <ul className="mt-4 flex list-none flex-col gap-3">
                            {visibleJobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                            {sortedJobs.length === 0 ? (
                                <li className="surface-card p-10 text-center text-sm text-[#6E6E78]">
                                    No jobs match your current search.
                                </li>
                            ) : null}
                        </ul>

                        {totalPages > 1 ? (
                            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
                                <Link
                                    href={pageHref(Math.max(1, page - 1))}
                                    aria-label="Previous page"
                                    aria-disabled={page === 1}
                                    className={`flex size-8 items-center justify-center rounded-md border ${
                                        page === 1
                                            ? "pointer-events-none border-white/5 text-[#4B4B53]"
                                            : "border-white/10 text-[#EDEDEF] hover:border-white/25"
                                    }`}
                                >
                                    <ChevronLeft aria-hidden className="size-4" />
                                </Link>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                                    <Link
                                        key={item}
                                        href={pageHref(item)}
                                        aria-current={item === page ? "page" : undefined}
                                        className={`flex size-8 items-center justify-center rounded-md border text-sm ${
                                            item === page
                                                ? "border-[#5C53FE] bg-[#5C53FE] text-white"
                                                : "border-white/10 text-[#A0A0AB] hover:border-white/25 hover:text-white"
                                        }`}
                                    >
                                        {item}
                                    </Link>
                                ))}
                                <Link
                                    href={pageHref(Math.min(totalPages, page + 1))}
                                    aria-label="Next page"
                                    aria-disabled={page === totalPages}
                                    className={`flex size-8 items-center justify-center rounded-md border ${
                                        page === totalPages
                                            ? "pointer-events-none border-white/5 text-[#4B4B53]"
                                            : "border-white/10 text-[#EDEDEF] hover:border-white/25"
                                    }`}
                                >
                                    <ChevronRight aria-hidden className="size-4" />
                                </Link>
                            </nav>
                        ) : null}
                    </section>
                </div>
            </main>
        </>
    )
}
