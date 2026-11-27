import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  ProfileForm,
  type ProfileUser,
} from "@/components/dashboard/profile-form"
import { PageHeader } from "@/components/dashboard/page-shell"
import { getMe } from "@/lib/api/user"
import { requireUser } from "@/lib/core/server"

export default async function RecruiterSettingsPage() {
  const user = await requireUser("recruiter")

  let me: Partial<ProfileUser> | null = null
  try {
    me = (await getMe()) as Partial<ProfileUser>
  } catch {
    me = null
  }

  const profile: ProfileUser = {
    id: user.id,
    name: me?.name ?? user.name,
    email: me?.email ?? user.email,
    image: me?.image ?? (user as { image?: string | null }).image ?? null,
    headline: me?.headline ?? null,
    bio: me?.bio ?? null,
    skills: me?.skills ?? null,
    resumeUrl: me?.resumeUrl ?? null,
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and hiring workspace."
      />

      <ProfileForm user={profile} />

      <Link
        href="/dashboard/recruiter/company"
        className="surface-card mt-8 flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:border-[#8F88FF]/40"
      >
        <div>
          <h2 className="font-heading text-lg font-semibold text-white">
            Company Profile
          </h2>
          <p className="body-muted mt-1">
            Update your company details and approval status.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-[13px] font-medium text-[#8F88FF]">
          Manage company <ArrowRight aria-hidden className="size-4" />
        </span>
      </Link>
    </>
  )
}
