import Link from "next/link"
import { ArrowUpRight, Bookmark, MapPin } from "lucide-react"

import { formatCompensation } from "@/lib/formatters"
import type { JobRow } from "@/lib/types/jobs"

export default function JobCard({ job }: { job: JobRow }) {
  return (
    <li className="surface-card flex flex-wrap items-start gap-5 p-6 transition-colors hover:border-white/20">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1F] font-heading text-2xl font-semibold text-[#8F88FF]">
        {job.companyName?.charAt(0) ?? "H"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/jobs/${job._id}`} className="text-lg font-semibold text-[#EDEDEF] hover:text-white">
              {job.title}
            </Link>
            <p className="mt-1 flex items-center gap-2 text-sm text-[#A0A0AB]">
              <span>{job.companyName}</span>
              <span aria-hidden>•</span>
              <MapPin aria-hidden className="size-3.5" />
              <span>{job.location}{job.isRemote ? " (Remote)" : ""}</span>
            </p>
          </div>
          <button
            type="button"
            aria-label={`Bookmark ${job.title}`}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#222228] text-[#E5E2E3] transition-colors hover:border-white/25 hover:text-white"
          >
            <Bookmark aria-hidden className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#EDEDEF]">
            {formatCompensation(job)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs capitalize text-[#EDEDEF]">
            {job.jobType}
          </span>
          {job.status === "active" ? (
            <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2.5 py-1 text-xs text-[#4ADE80]">
              Easy Apply
            </span>
          ) : null}
          <Link
            href={`/jobs/${job._id}`}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#8F88FF] hover:text-[#C3C0FF]"
          >
            View details <ArrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </div>
      </div>
    </li>
  )
}
