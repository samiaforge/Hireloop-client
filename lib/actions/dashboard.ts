"use server"

import { revalidatePath } from "next/cache"

import { archiveApplication, updateApplicationStatus } from "@/lib/api/applications"
import {
  createCompany,
  getMyCompany,
  updateCompany,
  updateCompanyStatus,
} from "@/lib/api/companies"
import { createJob, deleteJob, getJobById, updateJob } from "@/lib/api/jobs"
import { removeSavedJob, saveJob } from "@/lib/api/saved-jobs"
import { deleteUser, updateMyProfile } from "@/lib/api/user"
import type { CompanyStatus } from "@/lib/types/domain"
import type { JobFormData } from "@/lib/types/jobs"

const revalidateDashboards = () => {
  revalidatePath("/dashboard/seeker")
  revalidatePath("/dashboard/seeker/saved")
  revalidatePath("/dashboard/seeker/applications")
  revalidatePath("/dashboard/recruiter")
  revalidatePath("/dashboard/recruiter/company")
  revalidatePath("/dashboard/recruiter/jobs")
  revalidatePath("/dashboard/recruiter/applications")
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/companies")
  revalidatePath("/dashboard/admin/jobs")
  revalidatePath("/dashboard/admin/users")
}

/* ------------------------------------------------------------------ jobs -- */

export async function createJobAction(data: JobFormData) {
  const result = await createJob(data)
  revalidateDashboards()
  revalidatePath("/jobs")
  revalidatePath("/browse-jobs")
  return result
}

export async function updateJobAction(jobId: string, data: Partial<JobFormData>) {
  const result = await updateJob(jobId, data)
  revalidateDashboards()
  revalidatePath(`/jobs/${jobId}`)
  revalidatePath(`/browse-jobs/${jobId}`)
  return result
}

export async function deleteJobAction(jobId: string) {
  const result = await deleteJob(jobId)
  revalidateDashboards()
  revalidatePath(`/jobs/${jobId}`)
  revalidatePath(`/browse-jobs/${jobId}`)
  return result
}

/** Guard edit routes against recruiters trying to edit somebody else's job. */
export async function canManageJob(jobId: string, userId: string) {
  const job = await getJobById(jobId)
  if (!job) return false
  if (job.recruiterId === userId) return true

  const company = await getMyCompany()
  return Boolean(company && company._id === job.companyId)
}

/* ------------------------------------------------------------- companies -- */

export async function createCompanyAction(data: Partial<import("@/lib/types/domain").CompanyRow>) {
  const result = await createCompany(data)
  revalidateDashboards()
  return result
}

export async function updateCompanyAction(id: string, data: Partial<import("@/lib/types/domain").CompanyRow>) {
  const result = await updateCompany(id, data)
  revalidateDashboards()
  return result
}

export async function setCompanyStatusAction(id: string, status: Exclude<CompanyStatus, "pending">) {
  const result = await updateCompanyStatus(id, status)
  revalidateDashboards()
  return result
}

/* ----------------------------------------------------------- applications -- */

export async function setApplicationStatusAction(id: string, status: string) {
  const result = await updateApplicationStatus(id, status)
  revalidateDashboards()
  return result
}

export async function archiveApplicationAction(id: string, archived: boolean) {
  const result = await archiveApplication(id, archived)
  revalidateDashboards()
  return result
}

/* ------------------------------------------------------------- saved jobs -- */

export async function saveJobAction(jobId: string) {
  const result = await saveJob(jobId)
  revalidateDashboards()
  return result
}

export async function removeSavedJobAction(jobId: string) {
  const result = await removeSavedJob(jobId)
  revalidateDashboards()
  revalidatePath(`/jobs/${jobId}`)
  revalidatePath(`/browse-jobs/${jobId}`)
  return result
}

/* ------------------------------------------------------------------ users -- */

export async function updateProfileAction(data: Record<string, unknown>) {
  const result = await updateMyProfile(data)
  revalidateDashboards()
  return result
}

export async function deleteUserAction(userId: string) {
  const result = await deleteUser(userId)
  revalidateDashboards()
  return result
}
