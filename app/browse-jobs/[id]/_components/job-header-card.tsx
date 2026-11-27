"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bookmark } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import { createApplication, getApplicationsCount } from "@/lib/api/applications"
import { getUserPremiumById } from "@/lib/api/user"
import { removeSavedJob, saveJob } from "@/lib/api/saved-jobs"
import type { JobRow } from "@/lib/types/jobs"
import type { ApplicationFormData } from "@/lib/types/applications"
import { cn } from "@/lib/utils"

export function JobHeaderCard({ job }: { job: JobRow }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  const user = session?.user

  const handleSave = async () => {
    if (!user) return router.push(`/auth/sign-in?redirectTo=/jobs/${job._id}`)
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

  const handleApplyNow = async () => {
    if (!user) return router.push(`/auth/sign-in?redirectTo=/jobs/${job._id}`)
    if (user.role !== "seeker") {
      toast.error("Only job seekers can apply for jobs")
      return
    }

    setBusy(true)
    try {
      const [planResult, countResult] = await Promise.all([
        getUserPremiumById(user.id),
        getApplicationsCount(`userId=${user.id}&month=true`),
      ])

      if (planResult.plan === "starter" && countResult.count >= 3) {
        router.push("/checkout?plan=growth&role=seeker")
        return
      }

      const application: ApplicationFormData = {
        jobId: job._id,
        userId: user.id,
        email: user.email,
        jobTitle: job.title,
        companyName: job.companyName,
        jobType: job.jobType,
        isRemote: job.isRemote,
        location: job.location,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        salaryFrequency: job.salaryFrequency,
        deadline: job.deadline,
        appliedAt: new Date().toISOString(),
        status: "applied",
        archived: false,
      }

      await createApplication(application)
      toast.success({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })
      router.push("/dashboard/seeker/applications")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit application")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="flex flex-wrap items-start justify-between gap-6 border border-white/10 bg-[#141418] p-8">
      <div className="flex min-w-0 flex-wrap items-start gap-6">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1F]">
          <span className="brand-chip flex size-[70px] items-center justify-center rounded-xl text-2xl font-semibold">
            {job.companyName?.charAt(0) ?? "H"}
          </span>
        </div>

        <div className="min-w-0">
          <h1 className="text-[32px] leading-10 font-semibold tracking-[-0.02em] text-[#EDEDEF]">{job.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-[22px] font-semibold text-[#A0A0AB]">{job.companyName}</span>
            {job.companyId ? (
              <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[11px] text-[#4ADE80]">
                Verified Employer
              </span>
            ) : null}
            <span className="capitalize text-base text-[#EDEDEF]">
              {job.location}
              {job.isRemote ? " (Remote)" : ""}
            </span>
            <span className="capitalize text-base text-[#EDEDEF]">{job.jobType}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          aria-label={saved ? `Remove bookmark from ${job.title}` : `Bookmark ${job.title}`}
          className={cn(
            "flex size-12 items-center justify-center rounded-lg border bg-[#222228] transition-colors disabled:opacity-50",
            saved ? "border-[#5C53FE] text-[#C3C0FF]" : "border-white/10 text-[#E5E2E3] hover:border-white/25 hover:text-white"
          )}
        >
          <Bookmark aria-hidden className={cn("size-5", saved ? "fill-current" : "")} />
        </button>
        <button
          type="button"
          onClick={handleApplyNow}
          disabled={busy}
          className="h-12 rounded-lg bg-[#FAFAFA] px-5 text-base font-medium text-[#0B0B0C] transition-colors hover:bg-white disabled:opacity-50"
        >
          {busy ? "Working…" : "Apply Now"}
        </button>
      </div>
    </section>
  )
}
