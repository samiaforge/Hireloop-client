import { ProfileForm, type ProfileUser } from "@/components/dashboard/profile-form"
import { PageHeader } from "@/components/dashboard/page-shell"
import { getMe } from "@/lib/api/user"
import { requireUser } from "@/lib/core/server"
import type { UserRow } from "@/lib/types/users"

type MeResponse = UserRow & Partial<ProfileUser>

export default async function SettingsPage() {
  const sessionUser = await requireUser("seeker")
  const authUser = sessionUser as typeof sessionUser & Partial<ProfileUser>

  let user: ProfileUser = {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    image: authUser.image ?? null,
    headline: authUser.headline ?? null,
    bio: authUser.bio ?? null,
    skills: authUser.skills ?? null,
    resumeUrl: authUser.resumeUrl ?? null,
  }

  try {
    const me = (await getMe()) as MeResponse
    user = {
      ...user,
      name: me.name || user.name,
      email: me.email || user.email,
      image: me.image ?? user.image,
      headline: me.headline ?? user.headline,
      bio: me.bio ?? user.bio,
      skills: me.skills ?? user.skills,
      resumeUrl: me.resumeUrl ?? user.resumeUrl,
    }
  } catch {
    // The session user is enough to render the form when the API is unavailable.
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" subtitle="Manage your account details and professional profile." />
      <ProfileForm user={user} />
    </div>
  )
}
