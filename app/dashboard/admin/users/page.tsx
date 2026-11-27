import Link from "next/link"
import { CalendarDays, TrendingUp, UserRound, Users } from "lucide-react"

import { EmptyState, ExportButton, UserRoleControl } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { Pill } from "@/components/shared/pill"
import { RolePill } from "@/components/shared/role-pill"
import { StatusPill } from "@/components/shared/status-pill"
import { UserAvatar } from "@/components/shared/user-avater"
import { getUsers } from "@/lib/api/user"
import { requireUser } from "@/lib/core/server"
import type { UserRole } from "@/lib/types/users"
import { cn } from "@/lib/utils"

const ROLE_OPTIONS: { value: "all" | UserRole; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "seeker", label: "Seeker" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
]

function formatDate(value?: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

function safeRole(role: string): UserRole {
  return role === "recruiter" || role === "admin" ? role : "seeker"
}

function countRecentSignups(users: { createdAt: string }[]) {
  const since = Date.now() - 24 * 60 * 60 * 1000
  return users.filter((user) => {
    const time = new Date(user.createdAt).getTime()
    return !Number.isNaN(time) && time >= since
  }).length
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-colors",
        active
          ? "border-[#5C53FE]/50 bg-[#5C53FE]/15 text-[#C3C0FF]"
          : "border-white/10 bg-white/5 text-[#A0A0AB] hover:border-white/25 hover:text-white",
      )}
    >
      {label}
    </Link>
  )
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string | string[] }>
}) {
  await requireUser("admin")

  const params = await searchParams
  const requestedRole = Array.isArray(params.role) ? params.role[0] : params.role
  const role: "all" | UserRole =
    requestedRole === "seeker" || requestedRole === "recruiter" || requestedRole === "admin"
      ? requestedRole
      : "all"

  const usersResult = await getUsers().catch(() => [])
  const users = Array.isArray(usersResult) ? usersResult : []

  const activeUsers = users.filter((user) => !user.banned).length
  const recruiters = users.filter((user) => safeRole(user.role) === "recruiter").length
  const suspended = users.length - activeUsers
  const newSignups = countRecentSignups(users)

  const visibleUsers = role === "all" ? users : users.filter((user) => safeRole(user.role) === role)

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Management"
        subtitle="Review, filter, and manage platform access for all users."
        action={<ExportButton label="Export List" />}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="User metrics">
        <StatCard label="Total Active Users" value={activeUsers} detail="+12% vs last month" icon={Users} />
        <StatCard
          label="Recruiter Growth"
          value="+8%"
          detail={`${recruiters} recruiters on platform`}
          icon={TrendingUp}
        />
        <StatCard label="Suspended Accounts" value={suspended} detail="Requires review" icon={UserRound} />
        <StatCard label="New Signups (24h)" value={newSignups} detail="+2.3% vs yesterday" icon={CalendarDays} />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="overline-label mr-1">Filter by role</span>
          {ROLE_OPTIONS.map((option) => (
            <FilterLink
              key={option.value}
              href={`/dashboard/admin/users?role=${option.value}`}
              label={option.label}
              active={role === option.value}
            />
          ))}
        </div>

        {visibleUsers.length === 0 ? (
          <EmptyState title="No users found" description="Try a different role filter to see more accounts." />
        ) : (
          <DashboardTable headers={["User Name", "Email Address", "Role", "Join Date", "Status", "Actions"]}>
            {visibleUsers.map((user) => (
              <tr key={user.id || user._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#EDEDEF]">{user.name}</p>
                      <p className="truncate text-xs text-[#6E6E78]">{(user.id || user._id || "").slice(0, 8)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <RolePill role={safeRole(user.role)} />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  {user.banned ? (
                    <Pill label="Suspended" color="#EF4444" dot />
                  ) : (
                    <StatusPill status="active" />
                  )}
                </TableCell>
                <TableCell>
                  <UserRoleControl user={user} />
                </TableCell>
              </tr>
            ))}
          </DashboardTable>
        )}
      </section>
    </div>
  )
}
