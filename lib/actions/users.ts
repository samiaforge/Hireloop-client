"use server"

import { revalidatePath } from "next/cache"

import { updateUserRole as updateRole, updateUserStatus as updateStatus } from "@/lib/api/user"

export async function updateUserRole(userId: string, role: "seeker" | "recruiter" | "admin") {
  const result = await updateRole(userId, role)
  revalidatePath("/dashboard/admin/users")
  return result
}

export async function updateUserStatus(userId: string, banned: boolean) {
  const result = await updateStatus(userId, banned)
  revalidatePath("/dashboard/admin/users")
  return result
}
