"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { FileText, Plus, X } from "lucide-react"

import { Field } from "@/components/shared/field"
import { toast } from "@/components/ui/toast"
import { updateProfileAction } from "@/lib/actions/dashboard"

export type ProfileUser = {
  id: string
  name: string
  email: string
  image?: string | null
  headline?: string | null
  bio?: string | null
  skills?: string[] | null
  resumeUrl?: string | null
}

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState(user.name)
  const [headline, setHeadline] = useState(user.headline ?? "")
  const [bio, setBio] = useState(user.bio ?? "")
  const [skills, setSkills] = useState<string[]>(user.skills ?? [])
  const [skillDraft, setSkillDraft] = useState("")
  const [resumeUrl, setResumeUrl] = useState(user.resumeUrl ?? "")
  const [resumeEditing, setResumeEditing] = useState(false)

  const save = (data: Record<string, unknown>, message: string) => {
    startTransition(async () => {
      try {
        await updateProfileAction(data)
        toast.success(message)
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save profile")
      }
    })
  }

  const addSkill = () => {
    const skill = skillDraft.trim()
    if (!skill || skills.includes(skill)) return
    setSkills([...skills, skill])
    setSkillDraft("")
  }

  return (
    <div className="space-y-8">
      <section className="surface-card p-6">
        <h2 className="mb-6 font-heading text-lg font-semibold text-white">Profile Information</h2>
        <div className="mb-6 flex items-center gap-5">
          <div className="brand-chip flex size-20 items-center justify-center rounded-full text-2xl font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <button type="button" className="ghost-button h-9 px-3 text-xs">
              Change Avatar
            </button>
            <p className="mt-2 text-xs text-[#6E6E78]">JPG, GIF or PNG. Max size of 5MB.</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full Name" htmlFor="profile-name">
            <input
              id="profile-name"
              className="surface-field"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field label="Email Address" htmlFor="profile-email" hint="Your sign-in email cannot be changed here.">
            <input id="profile-email" className="surface-field opacity-70" value={user.email} readOnly />
          </Field>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => save({ name }, "Profile updated")}
            className="primary-button h-9 px-4 text-xs"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={() => toast.info("Use the sign-in screen to reset your password")}
            className="ghost-button h-9 px-4 text-xs"
          >
            Reset Password
          </button>
        </div>
      </section>

      <section className="surface-card p-6">
        <h2 className="mb-6 font-heading text-lg font-semibold text-white">Professional Details</h2>
        <div className="space-y-5">
          <Field label="Professional Headline" htmlFor="profile-headline">
            <input
              id="profile-headline"
              className="surface-field"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Senior UX/UI Designer"
            />
          </Field>
          <Field label="Bio" htmlFor="profile-bio">
            <textarea
              id="profile-bio"
              rows={4}
              className="surface-field resize-y"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell employers about your experience…"
            />
          </Field>
          <Field label="Skills" htmlFor="profile-skill">
            <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] p-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#5C53FE]/30 bg-[#5C53FE]/10 px-3 text-xs text-[#C3C0FF]"
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() => setSkills(skills.filter((item) => item !== skill))}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <div className="flex min-w-[160px] flex-1 items-center gap-2">
                <input
                  id="profile-skill"
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#EDEDEF] outline-none placeholder:text-[#6E6E78]"
                  value={skillDraft}
                  onChange={(event) => setSkillDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addSkill()
                    }
                  }}
                  placeholder="Add a skill..."
                />
                <button type="button" aria-label="Add skill" onClick={addSkill} className="text-[#8F88FF]">
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={() => save({ headline, bio, skills }, "Details saved")}
            className="primary-button h-9 px-4 text-xs"
          >
            Save Details
          </button>
        </div>
      </section>

      <section className="surface-card p-6">
        <h2 className="mb-2 font-heading text-lg font-semibold text-white">Resume</h2>
        <p className="body-muted mb-5">
          Upload your most recent resume to enable one-click applications.
        </p>
        <div className="rounded-lg border border-dashed border-white/15 bg-[#1A1A1F] p-6 text-center">
          <FileText aria-hidden className="mx-auto size-10 text-[#8F88FF]" />
          <p className="mt-3 truncate text-sm text-[#EDEDEF]">
            {resumeUrl ? resumeUrl.split("/").pop() : "No resume on file"}
          </p>
          <p className="mt-1 text-xs text-[#6E6E78]">
            {resumeUrl ? "Resume available for one-click applications" : "Add a resume link to get started"}
          </p>
          {resumeEditing ? (
            <div className="mx-auto mt-4 flex max-w-md gap-2">
              <input
                className="surface-field h-10 py-2 text-xs"
                value={resumeUrl}
                onChange={(event) => setResumeUrl(event.target.value)}
                placeholder="https://…/resume.pdf"
              />
              <button
                type="button"
                disabled={pending}
                onClick={() => save({ resumeUrl }, "Resume updated")}
                className="primary-button h-10 px-4 text-xs"
              >
                Save
              </button>
            </div>
          ) : null}
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setResumeEditing(true)}
              className="ghost-button h-9 px-4 text-xs"
            >
              Replace
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setResumeUrl("")
                save({ resumeUrl: "" }, "Resume removed")
              }}
              className="ghost-button h-9 px-4 text-xs text-[#F87171]"
            >
              Remove
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
