import { redirect } from "next/navigation"

import { requireUser } from "@/lib/core/server"

export default async function DashboardIndexPage() {
  const user = await requireUser()
  if (user.role === "recruiter") redirect("/dashboard/recruiter")
  if (user.role === "admin") redirect("/dashboard/admin")
  redirect("/dashboard/seeker")
}
