"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Bookmark } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { removeSavedJob, saveJob } from "@/lib/api/saved-jobs"
import { useSession } from "@/lib/auth-client"
import { formatJobLocation, formatPublicSalary } from "@/lib/formatters"
import type { JobRow } from "@/lib/types/jobs"
import { cn } from "@/lib/utils"

export default function JobCard({ job }: { job: JobRow }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleBookmark = async () => {
    if (!session?.user) {
      router.push(`/auth/sign-in?redirectTo=/jobs/${job._id}`)
      return
    }

    setBusy(true)
    try {
      if (saved) {
        await removeSavedJob(job._id)
        setSaved(false)
        toast.success("Removed from saved jobs")
      } else {
        await saveJob(job._id)
        setSaved(true)
        toast.success("Job saved")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update saved jobs")
    } finally {
      setBusy(false)
    }
  }

  const badge = job.applicants > 20 ? "Hot Job" : job.status === "active" ? "Easy Apply" : null

  return (
    <li className="surface-card relative flex flex-wrap items-start gap-5 p-6 transition-colors hover:border-white/20">
      <Link
        href={`/jobs/${job._id}`}
        aria-label={`View ${job.title} at ${job.companyName}`}
        className="absolute inset-0 z-0"
      />

      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1F] font-heading text-2xl font-semibold text-[#8F88FF]">
        {job.companyName?.charAt(0) ?? "H"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-[#EDEDEF]">{job.title}</h3>
            <p className="mt-1 truncate text-sm text-[#A0A0AB]">
              {job.companyName} <span aria-hidden>•</span> {formatJobLocation(job)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBookmark}
            disabled={busy}
            aria-label={saved ? `Remove bookmark from ${job.title}` : `Bookmark ${job.title}`}
            className={cn(
              "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-lg border bg-[#222228] text-[#E5E2E3] transition-colors disabled:opacity-50",
              saved
                ? "border-[#5C53FE] text-[#C3C0FF]"
                : "border-white/10 hover:border-white/25 hover:text-white",
            )}
          >
            <Bookmark aria-hidden className={cn("size-4", saved && "fill-current")} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#EDEDEF]">
            {formatPublicSalary(job)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs capitalize text-[#EDEDEF]">
            {job.jobType}
          </span>
          {badge ? (
            <span className="rounded-full border border-[#5C53FE]/30 bg-[#5C53FE]/10 px-2.5 py-1 text-xs text-[#C3C0FF]">
              {badge}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  )
}
