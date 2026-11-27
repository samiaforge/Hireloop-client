import Link from "next/link"
import { Archive, BriefcaseBusiness, Check, Plus, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { EmptyState } from "@/components/dashboard/controls"
import { DashboardTable, TableCell } from "@/components/dashboard/data-table"
import { PageHeader } from "@/components/dashboard/page-shell"
import { SectionHeading } from "@/components/dashboard/section-heading"
import { Pill } from "@/components/shared/pill"
import { getApplications } from "@/lib/api/applications"
import { getMyJobs } from "@/lib/api/jobs"
import { requireUser } from "@/lib/core/server"
import {
    FIGMA_RECENT_APPLICATIONS,
    FIGMA_RECRUITER_STATS,
} from "@/lib/data/recruiter-figma"
import { formatDeadline } from "@/lib/formatters"
import {
    STATUS_META,
    type ApplicationRow,
    type ApplicationStatus,
} from "@/lib/types/applications"
import type { JobRow } from "@/lib/types/jobs"

/** Recruiter-facing labels from the Figma dashboard (distinct from seeker labels). */
const FIGMA_STATUS_LABELS: Partial<Record<ApplicationStatus, string>> = {
    applied: "New",
    review: "Reviewing",
    interview: "Interviewing",
}

function candidateName(email?: string) {
    const localPart = email?.split("@")[0]
    if (!localPart) return "Candidate"

    const name = localPart
        .replace(/[._]+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) => character.toUpperCase())

    return name || "Candidate"
}

function FigmaStatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: string | number
    icon: LucideIcon
}) {
    return (
        <section className="surface-card flex min-h-[166px] flex-col p-6">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#1A1A1F] text-[#8F88FF]">
                <Icon aria-hidden className="size-5" />
            </span>
            <p className="mt-6 text-[13px] text-[#A0A0AB]">{label}</p>
            <p className="mt-1 font-heading text-[32px] leading-8 font-semibold text-[#EDEDEF]">
                {value}
            </p>
        </section>
    )
}

export default async function RecruiterDashboardPage() {
    const user = await requireUser("recruiter")

    let jobs: JobRow[] = []
    let applications: ApplicationRow[] = []

    try {
        jobs = await getMyJobs()
    } catch {
        jobs = []
    }

    try {
        applications = await getApplications()
    } catch {
        applications = []
    }

    const useFigmaData = jobs.length === 0 && applications.length === 0
    if (useFigmaData) applications = FIGMA_RECENT_APPLICATIONS

    const activeJobs = jobs.filter((job) => job.status === "active").length
    const closedJobs = jobs.filter((job) => job.status === "closed").length

    const stats = useFigmaData
        ? FIGMA_RECRUITER_STATS
        : {
              totalJobPosts: jobs.length,
              totalApplicants: applications.length,
              activeJobs,
              jobsClosed: closedJobs,
          }

    const firstName = user.name?.split(" ")[0] || "there"

    return (
        <>
            <PageHeader title={`Welcome back, ${firstName}`} />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FigmaStatCard label="Total Job Posts" value={stats.totalJobPosts} icon={BriefcaseBusiness} />
                <FigmaStatCard
                    label="Total Applicants"
                    value={stats.totalApplicants.toLocaleString("en-US")}
                    icon={Users}
                />
                <FigmaStatCard label="Active Jobs" value={stats.activeJobs} icon={Check} />
                <FigmaStatCard label="Jobs Closed" value={stats.jobsClosed} icon={Archive} />
            </div>

            <section className="mt-10">
                <SectionHeading
                    title="Recent Applications"
                    actionLabel="View all"
                    actionHref="/dashboard/recruiter/applications"
                />
                <DashboardTable
                    headers={["Candidate Name", "Role", "Date Applied", "Experience", "Status"]}
                >
                    {applications.length === 0 ? (
                        <tr>
                            <td colSpan={5}>
                                <EmptyState
                                    title="No applications yet"
                                    description="Candidate applications will appear here as soon as someone applies to one of your jobs."
                                />
                            </td>
                        </tr>
                    ) : (
                        applications.slice(0, 5).map((application) => {
                            const meta = STATUS_META[application.status] ?? {
                                label: application.status,
                                color: "#A0A0AB",
                            }
                            const label = FIGMA_STATUS_LABELS[application.status] ?? meta.label
                            const name = candidateName(application.email)

                            return (
                                <tr key={application._id}>
                                    <TableCell className="font-medium text-white">
                                        <span className="flex items-center gap-3">
                                            <span
                                                aria-hidden
                                                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1A1A1F] text-xs font-semibold text-[#C3C0FF]"
                                            >
                                                {name.charAt(0)}
                                            </span>
                                            {name}
                                        </span>
                                    </TableCell>
                                    <TableCell>{application.jobTitle}</TableCell>
                                    <TableCell>
                                        {application.appliedAt
                                            ? formatDeadline(application.appliedAt)
                                            : "—"}
                                    </TableCell>
                                    <TableCell>{application.experience || "—"}</TableCell>
                                    <TableCell>
                                        <Pill label={label} color={meta.color} dot />
                                    </TableCell>
                                </tr>
                            )
                        })
                    )}
                </DashboardTable>
            </section>

            <Link
                href="/dashboard/recruiter/jobs/new"
                aria-label="Create Job Post"
                className="group fixed right-6 bottom-6 z-30 flex size-16 items-center justify-center rounded-2xl bg-[#5C53FE] text-white shadow-[0_18px_40px_-12px_rgba(92,83,254,0.8)] transition-transform hover:scale-105"
            >
                <Plus aria-hidden className="size-6" />
                <span className="pointer-events-none absolute right-full mr-3 hidden rounded-lg border border-white/10 bg-[#1A1A1F] px-3 py-1.5 text-[13px] font-medium text-[#EDEDEF] whitespace-nowrap shadow-lg group-hover:block">
                    Create Job Post
                </span>
            </Link>
        </>
    )
}
