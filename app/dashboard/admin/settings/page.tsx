import { ShieldCheck } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-shell"
import { ProfileForm, type ProfileUser } from "@/components/dashboard/profile-form"
import { getMe } from "@/lib/api/user"
import { requireUser } from "@/lib/core/server"

type ProfileExtras = Partial<Pick<ProfileUser, "image" | "headline" | "bio" | "skills" | "resumeUrl">>

const DASHBOARD_ROUTES = [
  { label: "Role-based landing", path: "/dashboard" },
  { label: "Candidate workspace", path: "/dashboard/seeker" },
  { label: "Recruiter workspace", path: "/dashboard/recruiter" },
  { label: "Admin overview", path: "/dashboard/admin" },
  { label: "User management", path: "/dashboard/admin/users" },
  { label: "Company approvals", path: "/dashboard/admin/companies" },
  { label: "Job moderation", path: "/dashboard/admin/jobs" },
  { label: "Revenue & subscriptions", path: "/dashboard/admin/payments" },
  { label: "Platform settings", path: "/dashboard/admin/settings" },
] as const

export default async function AdminSettingsPage() {
  const user = await requireUser("admin")
  const sessionUser = user as typeof user & { image?: string | null }
  const me = await getMe().catch(() => null)
  const extras = (me ?? {}) as unknown as ProfileExtras

  const profile: ProfileUser = {
    id: me?.id ?? sessionUser.id,
    name: me?.name ?? sessionUser.name,
    email: me?.email ?? sessionUser.email,
    image: extras.image ?? sessionUser.image ?? null,
    headline: extras.headline ?? null,
    bio: extras.bio ?? null,
    skills: extras.skills ?? null,
    resumeUrl: extras.resumeUrl ?? null,
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage platform-wide preferences and your admin profile."
      />

      <ProfileForm user={profile} />

      <section className="surface-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="brand-chip flex size-8 items-center justify-center rounded-lg">
            <ShieldCheck aria-hidden className="size-4" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold text-white">Dashboard Access</h2>
            <p className="body-muted">Routes are resolved from the role on your account.</p>
          </div>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {DASHBOARD_ROUTES.map((route) => (
            <li
              key={route.path}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/5 bg-[#1A1A1F] px-3 py-2"
            >
              <span className="text-xs text-[#D8D8DE]">{route.label}</span>
              <code className="text-[11px] text-[#8F88FF]">{route.path}</code>
            </li>
          ))}
        </ul>

        <p className="body-muted mt-4">
          Role and account-status moderation lives on the Users page; company approvals live on the
          Companies page. This card is read-only.
        </p>
      </section>
    </div>
  )
}
