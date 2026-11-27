import Link from "next/link"
import { Bookmark, ChevronDown, Clock3, MapPin } from "lucide-react"

import { EmptyState, RemoveSavedJobButton } from "@/components/dashboard/controls"
import { PageHeader } from "@/components/dashboard/page-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Pill } from "@/components/shared/pill"
import { getSavedJobs } from "@/lib/api/saved-jobs"
import { requireUser } from "@/lib/core/server"
import { formatCompensation, formatRelativeTime } from "@/lib/formatters"
import type { SavedJobRow } from "@/lib/types/domain"
import { cn } from "@/lib/utils"

const MS_PER_DAY = 86_400_000

const CATEGORY_FILTERS = [
  { key: "design", label: "Design", matches: (category: string) => /design/i.test(category) },
  {
    key: "engineering",
    label: "Engineering",
    matches: (category: string) => /engineer|tech/i.test(category),
  },
  { key: "product", label: "Product", matches: (category: string) => /product/i.test(category) },
] as const

function daysUntil(deadline?: string) {
  if (!deadline) return null
  const target = new Date(deadline).getTime()
  if (Number.isNaN(target)) return null
  return Math.ceil((target - Date.now()) / MS_PER_DAY)
}

function deadlineLabel(deadline?: string) {
  const days = daysUntil(deadline)
  if (days === null) return "No deadline"
  if (days <= 0) return "Closed"
  return `Closes in ${days} day${days === 1 ? "" : "s"}`
}

export default async function SavedJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>
}) {
  await requireUser("seeker")

  const query = await searchParams
  const activeCategory = Array.isArray(query.category) ? query.category[0] : query.category

  let savedJobs: SavedJobRow[] = []
  try {
    const result = await getSavedJobs()
    savedJobs = Array.isArray(result) ? result : []
  } catch {
    savedJobs = []
  }

  const closingSoon = savedJobs.filter((saved) => {
    const days = daysUntil(saved.job?.deadline)
    return days !== null && days > 0 && days <= 7
  }).length

  const visibleJobs = activeCategory
    ? savedJobs.filter((saved) => {
        const filter = CATEGORY_FILTERS.find((item) => item.key === activeCategory)
        return filter ? filter.matches(saved.job?.category ?? "") : true
      })
    : savedJobs

  return (
    <div className="space-y-8">
      <PageHeader
        title="Saved Jobs"
        subtitle="Manage and track your bookmarked opportunities."
        action={
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6E6E78]">Sort by:</span>
            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] px-3.5 text-sm text-[#EDEDEF]">
              Recently Saved
              <ChevronDown aria-hidden className="size-4 text-[#A0A0AB]" />
            </div>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Saved" value={savedJobs.length} icon={Bookmark} />
        <StatCard label="Closing Soon" value={closingSoon} icon={Clock3} detail="Deadlines within 7 days" />
      </section>

      <nav aria-label="Saved job categories" className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/seeker/saved"
          className={cn(
            "inline-flex h-9 items-center rounded-full border px-4 text-xs font-medium transition-colors",
            !activeCategory
              ? "border-[#5C53FE]/40 bg-[#5C53FE]/15 text-[#C3C0FF]"
              : "border-white/10 bg-white/5 text-[#A0A0AB] hover:border-white/25 hover:text-white",
          )}
        >
          All Saved
        </Link>
        {CATEGORY_FILTERS.map((filter) => {
          const isActive = activeCategory === filter.key
          const count = savedJobs.filter((saved) => filter.matches(saved.job?.category ?? "")).length

          return (
            <Link
              key={filter.key}
              href={`?category=${filter.key}`}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-xs font-medium transition-colors",
                isActive
                  ? "border-[#5C53FE]/40 bg-[#5C53FE]/15 text-[#C3C0FF]"
                  : "border-white/10 bg-white/5 text-[#A0A0AB] hover:border-white/25 hover:text-white",
              )}
            >
              {filter.label} ({count})
            </Link>
          )
        })}
      </nav>

      {visibleJobs.length > 0 ? (
        <ul className="space-y-4">
          {visibleJobs.map((saved) => {
            const job = saved.job
            const days = daysUntil(job?.deadline)
            const closed =
              !job || job.status === "closed" || job.status === "expired" || (days !== null && days <= 0)
            const arrangement = job
              ? /hybrid/i.test(job.location ?? "")
                ? " (Hybrid)"
                : job.isRemote
                  ? " (Remote)"
                  : ""
              : ""

            return (
              <li key={saved._id} className="surface-card relative overflow-hidden p-6">
                {closed ? (
                  <span className="absolute top-4 right-4 z-10 rounded-full border border-[#EF4444]/30 bg-[#141418] px-2.5 py-1 text-[11px] font-medium text-[#F87171]">
                    Job closed by employer
                  </span>
                ) : null}

                <div className={cn("flex flex-wrap items-start gap-5 transition-opacity", closed && "opacity-60")}>
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1F] font-heading text-2xl font-semibold text-[#8F88FF]">
                    {job?.companyName?.charAt(0) ?? "H"}
                  </div>

                  <div className={cn("min-w-0 flex-1", closed && "pr-44")}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/jobs/${saved.jobId}`}
                        className="font-heading text-lg font-semibold text-[#EDEDEF] hover:text-white"
                      >
                        {job?.title ?? "Job no longer available"}
                      </Link>
                      <Pill label={(job?.companyName ?? "COMPANY").toUpperCase()} color="#8F88FF" />
                    </div>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#A0A0AB]">
                      <MapPin aria-hidden className="size-3.5" />
                      {job ? `${job.location ?? "Location unavailable"}${arrangement}` : "Location unavailable"}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#A0A0AB]">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[#EDEDEF]">
                        {job ? formatCompensation(job) : "Compensation unavailable"}
                      </span>
                      <span>Saved {formatRelativeTime(saved.savedAt)}</span>
                      <span aria-hidden>•</span>
                      <span className={days !== null && days <= 0 ? "text-[#F87171]" : undefined}>
                        {deadlineLabel(job?.deadline)}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/jobs/${saved.jobId}`}
                        className={cn("primary-button h-10 px-4 text-xs", closed && "pointer-events-none opacity-60")}
                      >
                        Apply Now
                      </Link>
                      <RemoveSavedJobButton jobId={saved.jobId} />
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyState
          title="No saved jobs here yet"
          description="Bookmark opportunities from the job board and they will appear in this list."
        />
      )}
    </div>
  )
}
