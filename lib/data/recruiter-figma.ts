// Demo content from the "Hireloop 2.0 / 03 · Recruiter" dashboard frame.
// Used only when the jobs API is unavailable or the recruiter has no data yet,
// so the designed dashboard still renders. Real applications always take priority.

import type { ApplicationRow } from "@/lib/types/applications"

export const FIGMA_RECRUITER_STATS = {
    totalJobPosts: 48,
    totalApplicants: 1284,
    activeJobs: 18,
    jobsClosed: 32,
} as const

const application = (
    data: Pick<ApplicationRow, "_id" | "email" | "jobTitle" | "appliedAt" | "status" | "experience">,
): ApplicationRow => ({
    jobId: `figma-${data._id}`,
    userId: `figma-user-${data._id}`,
    companyName: "Hireloop",
    jobType: "full-time",
    isRemote: false,
    location: "Remote",
    minSalary: "0",
    maxSalary: "0",
    salaryFrequency: "per year",
    deadline: "2027-01-01",
    archived: false,
    ...data,
})

export const FIGMA_RECENT_APPLICATIONS: ApplicationRow[] = [
    application({
        _id: "julianne-moore",
        email: "julianne.moore@example.com",
        jobTitle: "Senior Product Designer",
        appliedAt: "2023-10-24T09:00:00.000Z",
        experience: "6 years",
        status: "interview",
    }),
    application({
        _id: "robert-downey",
        email: "robert.downey@example.com",
        jobTitle: "Backend Engineer",
        appliedAt: "2023-10-23T09:00:00.000Z",
        experience: "4 years",
        status: "applied",
    }),
    application({
        _id: "emma-stone",
        email: "emma.stone@example.com",
        jobTitle: "Marketing Lead",
        appliedAt: "2023-10-22T09:00:00.000Z",
        experience: "8 years",
        status: "review",
    }),
    application({
        _id: "chris-pratt",
        email: "chris.pratt@example.com",
        jobTitle: "Product Manager",
        appliedAt: "2023-10-21T09:00:00.000Z",
        experience: "5 years",
        status: "rejected",
    }),
]
