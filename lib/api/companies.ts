"use server"

import { FIGMA_COMPANIES } from "@/lib/data/figma-jobs"
import { apiRequest, publicRequest } from "@/lib/core/server"
import type { CompanyRow } from "@/lib/types/domain"

export async function getCompanies(query = ""): Promise<CompanyRow[]> {
  const companies = await publicRequest<CompanyRow[]>(`/companies${query ? `?${query}` : ""}`).catch(() => [])
  return companies.length ? companies : FIGMA_COMPANIES
}

export async function getCompanyById(id: string): Promise<CompanyRow | null> {
  const company = await publicRequest<CompanyRow | null>(`/companies/${encodeURIComponent(id)}`).catch(() => null)
  if (company) return company
  return FIGMA_COMPANIES.find((item) => item._id === id) ?? null
}

export async function getMyCompany(): Promise<CompanyRow | null> {
  return apiRequest<CompanyRow | null>("/companies/mine")
}

export async function getAllCompanies(): Promise<CompanyRow[]> {
  return apiRequest<CompanyRow[]>("/companies/admin/all")
}

export async function createCompany(data: Partial<CompanyRow>) {
  return apiRequest<{ insertedId: string }>("/companies", { method: "POST", body: JSON.stringify(data) })
}

export async function updateCompany(id: string, data: Partial<CompanyRow>) {
  return apiRequest<{ modifiedCount: number }>(`/companies/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function updateCompanyStatus(id: string, status: "approved" | "rejected") {
  return apiRequest<{ modifiedCount: number }>(`/companies/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
