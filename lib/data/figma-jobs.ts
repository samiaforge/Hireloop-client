// Demo content from the "Hireloop 2.0 / 01 · Public Site" Figma frames.
// Used when the jobs API is unavailable or has no jobs yet, so the public
// browse/details screens still show the designed jobs.

import type { CompanyRow } from "@/lib/types/domain"
import type { JobRow } from "@/lib/types/jobs"

const description = (company: string, title: string) =>
    `At ${company}, we are building the next generation of tools that help teams work smarter. We are looking for a ${title} who is passionate about translating complex workflows into elegant, intuitive experiences. You will work closely with engineering and product leadership to define the vision for our core platform experience.`

const responsibilities = [
    "Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.",
    "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
    "Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.",
    "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
].join("\n")

const requirements = [
    "5+ years of experience designing complex B2B SaaS products or data-heavy applications.",
    "A strong portfolio showcasing your design process and problem-solving skills.",
].join("\n")

const benefits = [
    "Full Health & Dental",
    "Competitive 401k",
    "Latest Hardware Stipend",
    "Unlimited PTO",
].join("\n")

const skills = ["Figma Expertise", "System Thinking", "UI/UX Design", "Basic Frontend"]

export const FIGMA_COMPANIES: CompanyRow[] = [
    {
        _id: "figma-company-techflow",
        name: "TechFlow Systems",
        industry: "SaaS / Artificial Intelligence",
        website: "https://example.com",
        location: "San Francisco, CA",
        employeeCount: "250 - 500 Employees",
        description: "TechFlow Systems builds monitoring and workflow tools for modern engineering teams.",
        status: "approved",
        recruiterId: "figma-recruiter",
        createdAt: "2026-01-10T00:00:00.000Z",
    },
    {
        _id: "figma-company-fingrid",
        name: "FinGrid Solutions",
        industry: "FinTech / Software",
        website: "https://example.com",
        location: "New York, NY",
        employeeCount: "100 - 250 Employees",
        description: "FinGrid Solutions creates financial infrastructure products for global teams.",
        status: "approved",
        recruiterId: "figma-recruiter",
        createdAt: "2026-01-12T00:00:00.000Z",
    },
    {
        _id: "figma-company-creativestudio",
        name: "CreativeStudio",
        industry: "Design / Creative Services",
        website: "https://example.com",
        location: "Austin, TX",
        employeeCount: "50 - 100 Employees",
        description: "CreativeStudio partners with product teams on research-led design work.",
        status: "approved",
        recruiterId: "figma-recruiter",
        createdAt: "2026-01-14T00:00:00.000Z",
    },
    {
        _id: "figma-company-healthai",
        name: "HealthAI Corp",
        industry: "Healthcare / Artificial Intelligence",
        website: "https://example.com",
        location: "Boston, MA",
        employeeCount: "250 - 500 Employees",
        description: "HealthAI Corp applies machine learning to improve patient and clinician workflows.",
        status: "approved",
        recruiterId: "figma-recruiter",
        createdAt: "2026-01-16T00:00:00.000Z",
    },
]

const job = (
    data: Omit<JobRow, "posted" | "description" | "responsibilities" | "requirements" | "benefits" | "skills"> &
        Partial<Pick<JobRow, "posted" | "description" | "responsibilities" | "requirements" | "benefits" | "skills">>,
): JobRow => ({
    posted: "Posted 2d ago",
    description: description(data.companyName, data.title),
    responsibilities,
    requirements,
    benefits,
    skills,
    experience: "5+ Years",
    ...data,
})

export const FIGMA_JOBS: JobRow[] = [
    job({
        _id: "figma-senior-product-designer",
        title: "Senior Product Designer",
        companyName: "TechFlow Systems",
        companyId: "figma-company-techflow",
        recruiterId: "figma-recruiter",
        category: "Design",
        jobType: "full-time",
        isRemote: true,
        location: "San Francisco, CA (Remote)",
        deadline: "2027-01-31",
        minSalary: "140000",
        maxSalary: "180000",
        salaryFrequency: "per year",
        applicants: 12,
        status: "active",
        createdAt: "2026-11-25T09:00:00.000Z",
    }),
    job({
        _id: "figma-lead-frontend-engineer",
        title: "Lead Frontend Engineer",
        companyName: "FinGrid Solutions",
        companyId: "figma-company-fingrid",
        recruiterId: "figma-recruiter",
        category: "Engineering & Tech",
        jobType: "hybrid",
        isRemote: false,
        location: "New York, NY",
        deadline: "2027-02-07",
        minSalary: "165000",
        maxSalary: "210000",
        salaryFrequency: "per year",
        applicants: 8,
        status: "active",
        createdAt: "2026-11-24T09:00:00.000Z",
    }),
    job({
        _id: "figma-ux-researcher",
        title: "UX Researcher",
        companyName: "CreativeStudio",
        companyId: "figma-company-creativestudio",
        recruiterId: "figma-recruiter",
        category: "Design",
        jobType: "contract",
        isRemote: false,
        location: "Austin, TX",
        deadline: "2027-02-14",
        minSalary: "110000",
        maxSalary: "145000",
        salaryFrequency: "per year",
        applicants: 5,
        status: "active",
        createdAt: "2026-11-23T09:00:00.000Z",
    }),
    job({
        _id: "figma-machine-learning-engineer",
        title: "Machine Learning Engineer",
        companyName: "HealthAI Corp",
        companyId: "figma-company-healthai",
        recruiterId: "figma-recruiter",
        category: "Engineering & Tech",
        jobType: "senior",
        isRemote: true,
        location: "Boston, MA (Remote)",
        deadline: "2027-02-21",
        minSalary: "180000",
        maxSalary: "250000",
        salaryFrequency: "per year",
        applicants: 42,
        status: "active",
        createdAt: "2026-11-22T09:00:00.000Z",
    }),
]

/** Headline count shown in the Figma browse-jobs frame. */
export const FIGMA_TOTAL_JOBS = 1248

/** Apply the same public query params the Express API supports. */
export function filterFigmaJobs(query = ""): JobRow[] {
    const params = new URLSearchParams(query)
    const search = params.get("search")?.toLowerCase()
    const jobType = params.get("jobType")?.toLowerCase()
    const category = params.get("category")?.toLowerCase()
    const isRemote = params.get("isRemote")

    return FIGMA_JOBS.filter((item) => {
        if (search) {
            const haystack = `${item.title} ${item.companyName} ${item.responsibilities} ${item.requirements}`.toLowerCase()
            if (!haystack.includes(search)) return false
        }
        if (jobType && item.jobType.toLowerCase() !== jobType) return false
        if (category && item.category.toLowerCase() !== category) return false
        if (isRemote === "true" && !item.isRemote) return false
        return item.status === "active"
    })
}
