"use client"

import Link from "next/link"
import { Bell, HelpCircle, Plus, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/shared/user-avater"
import { useSession } from "@/lib/auth-client"

export function DashboardTopbar({ placeholder = "Search..." }: { placeholder?: string }) {
  const { data: session } = useSession()
  const user = session?.user
  const role = user?.role
  const createHref = role === "recruiter" ? "/dashboard/recruiter/jobs/new" : "/jobs"

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-white/10 bg-[#0B0B0C]/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1 text-[#A0A0AB] hover:text-white" />

      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#141418] px-3 py-2 sm:max-w-md">
        <Search aria-hidden className="size-4 shrink-0 text-[#6E6E78]" />
        <input
          aria-label="Search"
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-[13px] text-[#EDEDEF] outline-none placeholder:text-[#6E6E78]"
        />
      </label>

      <div className="ml-auto flex items-center gap-2">
        <button type="button" aria-label="Help" className="flex size-8 items-center justify-center rounded-lg text-[#A0A0AB] hover:bg-white/5 hover:text-white">
          <HelpCircle aria-hidden className="size-4" />
        </button>
        <button type="button" aria-label="Notifications" className="relative flex size-8 items-center justify-center rounded-lg text-[#A0A0AB] hover:bg-white/5 hover:text-white">
          <Bell aria-hidden className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#5C53FE]" />
        </button>
        <Link
          href={createHref}
          aria-label={role === "recruiter" ? "Create job post" : "Browse jobs"}
          className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#141418] text-[#EDEDEF] hover:border-white/25"
        >
          <Plus aria-hidden className="size-4" />
        </Link>
        <Link href="/dashboard/settings" aria-label="Account settings" className="ml-1">
          <UserAvatar src={user?.image} name={user?.name} className="size-8" />
        </Link>
      </div>
    </header>
  )
}
