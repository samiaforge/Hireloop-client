"use client"

import Link from "next/link"
import { useTransition } from "react"
import { Archive, Check, Eye, Printer, RotateCcw, Trash2 } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { ApplicationStatusSelect } from "@/components/shared/application-status-select"
import { StatusPill } from "@/components/shared/status-pill"
import { UserRoleSelect } from "@/components/shared/user-role-select"
import {
  archiveApplicationAction,
  deleteUserAction,
  removeSavedJobAction,
  setApplicationStatusAction,
  setCompanyStatusAction,
  updateJobAction,
  deleteJobAction,
} from "@/lib/actions/dashboard"
import { updateUserRole, updateUserStatus } from "@/lib/actions/users"
import { JOB_STATUS_META, type CompanyStatus, type JobStatus } from "@/lib/types/domain"
import type { ApplicationRow, ApplicationStatus } from "@/lib/types/applications"
import type { JobRow } from "@/lib/types/jobs"
import type { UserRole, UserRow } from "@/lib/types/users"
import { cn } from "@/lib/utils"

const ACTION_CLASS =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-xs text-[#D8D8DE] transition-colors hover:border-white/25 hover:text-white disabled:opacity-50"

function useAction() {
  const [pending, startTransition] = useTransition()

  const run = (action: () => Promise<unknown>, success?: string) => {
    startTransition(async () => {
      try {
        await action()
        if (success) toast.success(success)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong")
      }
    })
  }

  return { pending, run }
}

/* ------------------------------------------------------------- user table -- */

export function UserRoleControl({ user }: { user: UserRow }) {
  const { pending, run } = useAction()

  return (
    <div className="flex items-center justify-end gap-2">
      <UserRoleSelect
        value={user.role}
        className="h-8 w-[116px] text-xs"
        onChange={(role: UserRole) =>
          run(() => updateUserRole(user.id, role), `${user.name} is now a ${role}`)
        }
      />
      <button
        type="button"
        disabled={pending}
        className={ACTION_CLASS}
        onClick={() =>
          run(
            () => updateUserStatus(user.id, !user.banned),
            user.banned ? "Account activated" : "Account suspended",
          )
        }
      >
        {user.banned ? "Activate" : "Suspend"}
      </button>
      <button
        type="button"
        disabled={pending}
        className={cn(ACTION_CLASS, "text-[#F87171] hover:border-[#EF4444]/40")}
        onClick={() => {
          if (window.confirm(`Delete ${user.name}'s account? This cannot be undone.`)) {
            run(() => deleteUserAction(user.id), "User deleted")
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

/* ------------------------------------------------------- application table -- */

export function ApplicationStatusControl({
  application,
  showArchive = false,
  showStatus = true,
}: {
  application: ApplicationRow
  showArchive?: boolean
  /** Status changes are restricted to job owners and admins on the server. */
  showStatus?: boolean
}) {
  const { pending, run } = useAction()

  return (
    <div className="flex items-center justify-end gap-2">
      {showStatus ? (
        <ApplicationStatusSelect
          value={application.status}
          className="w-[118px] text-xs capitalize"
          onChange={(status: ApplicationStatus) =>
            run(() => setApplicationStatusAction(application._id, status), "Application status updated")
          }
        />
      ) : null}
      {showArchive ? (
        <button
          type="button"
          disabled={pending}
          className={ACTION_CLASS}
          onClick={() =>
            run(
              () => archiveApplicationAction(application._id, !application.archived),
              application.archived ? "Application restored" : "Application archived",
            )
          }
        >
          {application.archived ? <RotateCcw className="size-3.5" /> : <Archive className="size-3.5" />}
          {application.archived ? "Restore" : "Archive"}
        </button>
      ) : null}
      {application.jobId ? (
        <Link href={`/jobs/${application.jobId}`} className={ACTION_CLASS}>
          Details
        </Link>
      ) : null}
    </div>
  )
}

/* --------------------------------------------------------------- job table -- */

const JOB_STATUS_OPTIONS: JobStatus[] = ["active", "closed", "draft", "expired"]

export function JobActions({ job }: { job: JobRow }) {
  const { pending, run } = useAction()

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/jobs/${job._id}`}
        aria-label={`View ${job.title}`}
        className={cn(ACTION_CLASS, "px-2")}
      >
        <Eye className="size-4" />
      </Link>
      <Link href={`/dashboard/recruiter/jobs/${job._id}/edit`} className={ACTION_CLASS}>
        Update
      </Link>
      <select
        aria-label={`Update ${job.title} status`}
        value={(job.status as JobStatus) in JOB_STATUS_META ? (job.status as JobStatus) : "active"}
        disabled={pending}
        onChange={(event) =>
          run(
            () => updateJobAction(job._id, { status: event.target.value as JobRow["status"] }),
            "Job status updated",
          )
        }
        className="surface-field h-8 w-[96px] rounded-md px-2 text-xs capitalize"
      >
        {JOB_STATUS_OPTIONS.map((status) => (
          <option key={status} value={status} className="bg-[#1A1A1F]">
            {JOB_STATUS_META[status].label}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        aria-label={`Delete ${job.title}`}
        className={cn(ACTION_CLASS, "px-2 text-[#F87171]")}
        onClick={() => {
          if (window.confirm(`Delete ${job.title}?`)) {
            run(() => deleteJobAction(job._id), "Job deleted")
          }
        }}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

/* ---------------------------------------------------------- company table -- */

export function CompanyStatusControl({
  id,
  status,
}: {
  id: string
  status: CompanyStatus
}) {
  const { pending, run } = useAction()

  return (
    <div className="flex items-center justify-end gap-2">
      <StatusPill status={status} />
      {status !== "approved" ? (
        <button
          type="button"
          disabled={pending}
          className={cn(ACTION_CLASS, "text-[#4ADE80]")}
          onClick={() => run(() => setCompanyStatusAction(id, "approved"), "Company approved")}
        >
          <Check className="size-3.5" /> Approve
        </button>
      ) : null}
      {status !== "rejected" ? (
        <button
          type="button"
          disabled={pending}
          className={cn(ACTION_CLASS, "text-[#F87171]")}
          onClick={() => run(() => setCompanyStatusAction(id, "rejected"), "Company rejected")}
        >
          Reject
        </button>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------- saved jobs -- */

export function RemoveSavedJobButton({ jobId }: { jobId: string }) {
  const { pending, run } = useAction()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => run(() => removeSavedJobAction(jobId), "Removed from saved jobs")}
      className="inline-flex h-10 items-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-[#EDEDEF] transition-colors hover:border-white/30 hover:bg-white/10 disabled:opacity-50"
    >
      Remove from List
    </button>
  )
}

/* --------------------------------------------------------------- utilities -- */

export function ExportButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="ghost-button h-9 px-3 text-xs">
      <Printer aria-hidden className="size-3.5" />
      {label}
    </button>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="surface-card flex min-h-[180px] flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-sm font-medium text-[#EDEDEF]">{title}</p>
      {description ? <p className="body-muted max-w-md">{description}</p> : null}
    </div>
  )
}
