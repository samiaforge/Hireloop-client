"use server"

import { apiRequest } from "@/lib/core/server"
import type { ApplicationFormData, ApplicationRow } from "@/lib/types/applications"

export async function getApplications(query = ""): Promise<ApplicationRow[]> {
  return apiRequest<ApplicationRow[]>(`/applications${query ? `?${query}` : ""}`)
}

export async function getApplicationsCount(query = ""): Promise<{ count: number }> {
  return apiRequest<{ count: number }>(`/applications/count${query ? `?${query}` : ""}`)
}

export async function createApplication(data: ApplicationFormData) {
  return apiRequest<{ insertedId: string }>("/applications", { method: "POST", body: JSON.stringify(data) })
}

export async function updateApplicationStatus(id: string, status: string) {
  return apiRequest<{ modifiedCount: number }>(`/applications/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export async function archiveApplication(id: string, archived: boolean) {
  return apiRequest<{ modifiedCount: number }>(`/applications/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ archived }),
  })
}
