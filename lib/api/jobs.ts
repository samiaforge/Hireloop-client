"use server"

import { apiRequest, publicRequest } from "@/lib/core/server"
import type { JobFormData, JobRow } from "@/lib/types/jobs"

export async function getJobs(query = ""): Promise<JobRow[]> {
  return publicRequest<JobRow[]>(`/jobs${query ? `?${query}` : ""}`)
}

export async function getJobById(jobId: string): Promise<JobRow | null> {
  return publicRequest<JobRow | null>(`/jobs/${encodeURIComponent(jobId)}`)
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
