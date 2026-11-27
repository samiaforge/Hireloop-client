"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Wallet,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/shared/user-avater"
import { signOut, useSession } from "@/lib/auth-client"
import type { UserRole } from "@/lib/types/user"

type MenuItem = { name: string; url: string; icon: LucideIcon }

const DASHBOARD_HOME: Record<UserRole, string> = {
  seeker: "/dashboard/seeker",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
}

const MENU: Record<UserRole, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { name: "Jobs", url: "/jobs", icon: BriefcaseBusiness },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    { name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
    { name: "Billing", url: "/dashboard/seeker/billing", icon: CreditCard },
    { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { name: "My Company", url: "/dashboard/recruiter/company", icon: Building2 },
    { name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: BriefcaseBusiness },
    { name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
    { name: "Jobs", url: "/dashboard/admin/jobs", icon: BriefcaseBusiness },
    { name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

const PUBLIC_LINKS = [
  { name: "Home", url: "/", icon: Home },
  { name: "Browse Jobs", url: "/jobs", icon: BriefcaseBusiness },
  { name: "Companies", url: "/companies", icon: Building2 },
  { name: "Pricing", url: "/pricing", icon: CreditCard },
]

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  if (isPending) return null

  const rawRole = session?.user?.role
  const role: UserRole = rawRole === "recruiter" || rawRole === "admin" ? rawRole : "seeker"
  const user = session?.user

  const handleSignOut = async () => {
    await signOut()
    router.replace("/")
    router.refresh()
  }

  const renderItem = (item: MenuItem) => (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton
        isActive={pathname === item.url || (item.url !== DASHBOARD_HOME[role] && pathname.startsWith(`${item.url}/`))}
        render={<Link href={item.url} />}
        className="h-[34px] text-[13px] text-[#A0A0AB] hover:bg-white/5 hover:text-white data-[active=true]:bg-[#222228] data-[active=true]:text-white"
      >
        <item.icon className="size-[18px]" />
        <span>{item.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  return (
    <Sidebar className="w-[248px] border-r border-white/10 bg-[#080808] text-white">
      <SidebarHeader className="gap-5 border-b border-white/10 p-4">
        <div className="flex flex-col gap-1">
          <Link href={DASHBOARD_HOME[role]} aria-label="Hireloop dashboard">
            <Image src="/images/logo.png" alt="Hireloop" width={154} height={44} priority className="h-10 w-auto" />
          </Link>
          <p className="pl-1 text-[11px] tracking-[0.16em] text-[#6E6E78] uppercase">Admin Console</p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#141414] p-3">
          <UserAvatar src={user?.image} name={user?.name} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name || "Account"}</p>
            <p className="text-xs capitalize text-[#A0A0AB]">{role}</p>
            <span className="mt-1 inline-block rounded-full border border-[#8F88FF]/30 bg-[#8F88FF]/10 px-2 py-0.5 text-[10px] text-[#C3C0FF]">
              Premium account
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#080808] px-2 py-4">
        <SidebarGroup>
          <p className="mb-2 px-3 text-[10px] font-medium tracking-[0.16em] text-[#6E6E78] uppercase">Workspace</p>
          <SidebarMenu>{MENU[role].map(renderItem)}</SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <p className="mb-2 px-3 text-[10px] font-medium tracking-[0.16em] text-[#6E6E78] uppercase">Explore</p>
          <SidebarMenu>{PUBLIC_LINKS.map(renderItem)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-[#080808] p-4">
        <div className="mb-3 min-w-0">
          <p className="truncate text-[13px] font-medium text-[#EDEDEF]">{user?.name || "User"}</p>
          <p className="truncate text-[11px] text-[#6E6E78]">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-white/10 px-3 text-[13px] text-[#A0A0AB] transition-colors hover:border-white/20 hover:text-white"
        >
          <LogOut aria-hidden className="size-4" />
          Logout
        </button>
        <p className="mt-3 text-[10px] text-[#4B4B52]">© 2026 Hireloop</p>
      </SidebarFooter>
    </Sidebar>
  )
}
