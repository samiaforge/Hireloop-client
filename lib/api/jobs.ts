"use server"

import { FIGMA_JOBS, filterFigmaJobs } from "@/lib/data/figma-jobs"
import { apiRequest, publicRequest } from "@/lib/core/server"
import type { JobFormData, JobRow } from "@/lib/types/jobs"

export async function getJobs(query = ""): Promise<JobRow[]> {
  const jobs = await publicRequest<JobRow[]>(`/jobs${query ? `?${query}` : ""}`).catch(() => [])
  return jobs.length ? jobs : filterFigmaJobs(query)
}

export async function getJobById(jobId: string): Promise<JobRow | null> {
  const job = await publicRequest<JobRow | null>(`/jobs/${encodeURIComponent(jobId)}`).catch(() => null)
  if (job) return job
  return FIGMA_JOBS.find((item) => item._id === jobId) ?? null
}

export async function getMyJobs(): Promise<JobRow[]> {
  return apiRequest<JobRow[]>("/jobs/mine")
}

export async function getAllJobs(): Promise<JobRow[]> {
  return apiRequest<JobRow[]>("/jobs/admin/all")
}

export async function createJob(data: JobFormData) {
  return apiRequest<{ insertedId: string }>("/jobs", { method: "POST", body: JSON.stringify(data) })
}

export async function updateJob(jobId: string, data: Partial<JobFormData>) {
  return apiRequest<{ modifiedCount: number }>(`/jobs/${encodeURIComponent(jobId)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteJob(jobId: string) {
  return apiRequest<{ deletedCount: number }>(`/jobs/${encodeURIComponent(jobId)}`, { method: "DELETE" })
}
