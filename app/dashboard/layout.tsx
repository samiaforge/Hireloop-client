import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardTopbar } from "@/components/dashboard/topbar"

import { DashboardSidebar } from "../components/DashboardSidebar"
import { requireUser } from "@/lib/core/server"

const SEARCH_PLACEHOLDERS = {
  seeker: "Search for opportunities...",
  recruiter: "Search candidates or jobs...",
  admin: "Global search...",
} as const

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const role = user.role === "recruiter" || user.role === "admin" ? user.role : "seeker"

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="min-w-0 flex-1 bg-[#0B0B0C]">
        <DashboardTopbar placeholder={SEARCH_PLACEHOLDERS[role]} />
        <div className="mx-auto w-full max-w-[1184px] px-6 py-8">{children}</div>
      </main>
    </SidebarProvider>
  )
}
