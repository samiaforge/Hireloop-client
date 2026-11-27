"use server"

import { apiRequest } from "@/lib/core/server"
import type { SavedJobRow } from "@/lib/types/domain"

export async function getSavedJobs(): Promise<SavedJobRow[]> {
  return apiRequest<SavedJobRow[]>("/saved-jobs")
}

export async function saveJob(jobId: string) {
  return apiRequest<{ insertedId: string }>("/saved-jobs", { method: "POST", body: JSON.stringify({ jobId }) })
}

export async function removeSavedJob(jobId: string) {
  return apiRequest<{ deletedCount: number }>(`/saved-jobs/${encodeURIComponent(jobId)}`, { method: "DELETE" })
}
