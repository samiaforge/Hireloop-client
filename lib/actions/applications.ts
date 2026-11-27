"use server"

import { revalidatePath } from "next/cache"

import { updateApplicationStatus as updateStatus } from "@/lib/api/applications"

export async function updateApplicationStatus(id: string, status: string) {
  const result = await updateStatus(id, status)
  revalidatePath("/dashboard/recruiter/applications")
  revalidatePath("/dashboard/seeker/applications")
  return result
}
