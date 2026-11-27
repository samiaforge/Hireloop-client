"use server"

import { apiRequest } from "@/lib/core/server"
import type { UserRole, UserRow } from "@/lib/types/users"
import type { PlanId } from "@/lib/types/domain"

export async function getUsers(): Promise<UserRow[]> {
  return apiRequest<UserRow[]>("/users")
}

export async function getMe(): Promise<UserRow> {
  return apiRequest<UserRow>("/users/me")
}

export async function getUserPlan(userId?: string): Promise<{ plan: PlanId; premium: boolean }> {
  return apiRequest<{ plan: PlanId; premium: boolean }>(userId ? `/users/${userId}/plan` : "/users/me/plan")
}

export async function updateMyProfile(data: Record<string, unknown>): Promise<{ success: true }> {
  return apiRequest<{ success: true }>("/users/me", { method: "PATCH", body: JSON.stringify(data) })
}

export async function updateUserRole(userId: string, role: UserRole) {
  return apiRequest<{ modifiedCount: number }>(`/users/${encodeURIComponent(userId)}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  })
}

export async function updateUserStatus(userId: string, banned: boolean) {
  return apiRequest<{ modifiedCount: number }>(`/users/${encodeURIComponent(userId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ banned }),
  })
}

export async function deleteUser(userId: string) {
  return apiRequest<{ deletedCount: number }>(`/users/${encodeURIComponent(userId)}`, { method: "DELETE" })
}

/** Backwards-compatible helper used by the job details apply flow. */
export async function getUserPremiumById(userId: string): Promise<{ premium: boolean; plan: PlanId }> {
  return getUserPlan(userId)
}
