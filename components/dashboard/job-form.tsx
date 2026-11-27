"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Field } from "@/components/shared/field"
import { PillGroup } from "@/components/shared/pill-group"
import { toast } from "@/components/ui/toast"
import { createJobAction, updateJobAction } from "@/lib/actions/dashboard"
import { JOB_CATEGORIES, JOB_TYPES, SALARY_FREQUENCIES } from "@/lib/types/jobs"
import type { JobFormData, JobRow, JobType } from "@/lib/types/jobs"

const JOB_TYPE_OPTIONS = JOB_TYPES.map((value) => ({
  value,
  label: value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
}))

export function JobForm({
  job,
  companyName,
  recruiterId,
}: {
  job?: JobRow
  companyName: string
  recruiterId: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [title, setTitle] = useState(job?.title ?? "")
  const [category, setCategory] = useState(job?.category ?? JOB_CATEGORIES[0])
  const [jobType, setJobType] = useState<JobType>(job?.jobType ?? "full-time")
  const [isRemote, setIsRemote] = useState(job?.isRemote ?? false)
  const [location, setLocation] = useState(job?.location ?? "")
  const [deadline, setDeadline] = useState(job?.deadline?.slice(0, 10) ?? "")
  const [minSalary, setMinSalary] = useState(job?.minSalary ?? "")
  const [maxSalary, setMaxSalary] = useState(job?.maxSalary ?? "")
  const [salaryFrequency, setSalaryFrequency] = useState(job?.salaryFrequency ?? SALARY_FREQUENCIES[0])
  const [responsibilities, setResponsibilities] = useState(job?.responsibilities ?? "")
  const [requirements, setRequirements] = useState(job?.requirements ?? "")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: JobFormData = {
      title,
      companyName: job?.companyName ?? companyName,
      companyId: job?.companyId,
      recruiterId: job?.recruiterId ?? recruiterId,
      category,
      jobType,
      isRemote,
      location,
      deadline,
      minSalary,
      maxSalary,
      salaryFrequency,
      responsibilities,
      requirements,
      applicants: job?.applicants ?? 0,
      status: job?.status ?? "active",
    }

    if (!payload.title || !payload.location || !payload.responsibilities || !payload.requirements) {
      toast.error("Please complete all required fields")
      return
    }

    startTransition(async () => {
      try {
        if (job) {
          await updateJobAction(job._id, payload)
          toast.success("Job post updated")
        } else {
          await createJobAction(payload)
          toast.success("Job published")
        }
        router.push("/dashboard/recruiter/jobs")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save job post")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="surface-card p-6">
        <h2 className="mb-6 flex items-center gap-3 font-heading text-lg font-semibold text-white">
          <span className="brand-chip flex size-7 items-center justify-center rounded-lg text-sm">1</span>
          1. Basic Information
        </h2>
        <div className="space-y-5">
          <Field label="Job Title" htmlFor="job-title" required>
            <input
              id="job-title"
              className="surface-field"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Frontend Developer"
              required
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Company Name" htmlFor="job-company" required>
              <input
                id="job-company"
                className="surface-field opacity-70"
                value={job?.companyName ?? companyName}
                readOnly
              />
            </Field>
            <Field label="Job Category" htmlFor="job-category" required>
              <select
                id="job-category"
                className="surface-field"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {JOB_CATEGORIES.map((option) => (
                  <option key={option} value={option} className="bg-[#1A1A1F]">
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Job Type" htmlFor="job-type" required>
            <PillGroup
              name="jobType"
              value={jobType}
              onChange={setJobType}
              options={JOB_TYPE_OPTIONS}
              className="grid grid-cols-2 gap-2 md:grid-cols-4"
              pillClassName="h-11 justify-center"
            />
          </Field>
        </div>
      </section>

      <section className="surface-card p-6">
        <h2 className="mb-6 flex items-center gap-3 font-heading text-lg font-semibold text-white">
          <span className="brand-chip flex size-7 items-center justify-center rounded-lg text-sm">2</span>
          2. Location, Compensation &amp; Timeline
        </h2>
        <div className="space-y-5">
          <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#1A1A1F] p-4">
            <span>
              <span className="block text-sm font-medium text-[#EDEDEF]">Remote Work Allowed (isRemote)</span>
              <span className="block text-xs text-[#A0A0AB]">
                Enable worldwide or distributed candidate applications
              </span>
            </span>
            <input
              type="checkbox"
              className="size-5 accent-[#5C53FE]"
              checked={isRemote}
              onChange={(event) => setIsRemote(event.target.checked)}
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Job Location (location)" htmlFor="job-location" required>
              <input
                id="job-location"
                className="surface-field"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="New York, USA"
                required
              />
            </Field>
            <Field label="Application Deadline (deadline)" htmlFor="job-deadline" required>
              <input
                id="job-deadline"
                type="date"
                className="surface-field"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Min Salary / Rate" htmlFor="job-min-salary">
              <input
                id="job-min-salary"
                type="number"
                className="surface-field"
                value={minSalary}
                onChange={(event) => setMinSalary(event.target.value)}
                placeholder="25"
              />
            </Field>
            <Field label="Max Salary / Rate" htmlFor="job-max-salary">
              <input
                id="job-max-salary"
                type="number"
                className="surface-field"
                value={maxSalary}
                onChange={(event) => setMaxSalary(event.target.value)}
                placeholder="40"
              />
            </Field>
            <Field label="Frequency" htmlFor="job-frequency">
              <select
                id="job-frequency"
                className="surface-field"
                value={salaryFrequency}
                onChange={(event) => setSalaryFrequency(event.target.value)}
              >
                {SALARY_FREQUENCIES.map((option) => (
                  <option key={option} value={option} className="bg-[#1A1A1F]">
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </section>

      <section className="surface-card p-6">
        <h2 className="mb-6 flex items-center gap-3 font-heading text-lg font-semibold text-white">
          <span className="brand-chip flex size-7 items-center justify-center rounded-lg text-sm">3</span>
          3. Responsibilities &amp; Requirements
        </h2>
        <div className="space-y-5">
          <Field label="Key Responsibilities" htmlFor="job-responsibilities" required>
            <textarea
              id="job-responsibilities"
              rows={4}
              className="surface-field resize-y"
              value={responsibilities}
              onChange={(event) => setResponsibilities(event.target.value)}
              placeholder="Describe the impact this role will have…"
              required
            />
          </Field>
          <Field label="Qualifications & Requirements" htmlFor="job-requirements" required>
            <textarea
              id="job-requirements"
              rows={4}
              className="surface-field resize-y"
              value={requirements}
              onChange={(event) => setRequirements(event.target.value)}
              placeholder="• 3+ years of experience…"
              required
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="primary-button min-w-[148px]">
          {pending ? "Working…" : job ? "Update  Job" : "Publish Job"}
        </button>
      </div>
    </form>
  )
}
