// Main content card for the job details page — the Figma
// "Content Sections" card: description, responsibilities, requirements
// and benefits, separated by horizontal white/10 borders.

import type { JobRow } from "@/lib/types/jobs"

const headingClass = "text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]"
const bodyClass = "text-[13px] leading-6 text-[#A0A0AB]"

/** "• A\n B" → ["A", "B"] — strips bullets and blank lines. */
const toLines = (text: string) =>
    text
        .split("\n")
        .map((line) => line.trim().replace(/^•\s*/, ""))
        .filter(Boolean)

/** Figma bullet row: 6px white dot + text. */
function BulletList({ items }: { items: readonly string[] }) {
    if (items.length === 0) return null

    return (
        <ul className="list-none">
            {items.map((item) => (
                <li key={item} className={`${bodyClass} flex items-start gap-6 py-1.5`}>
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-white" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    )
}

function BenefitCard({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-[#C3C0FF]">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
            <span className="text-[13px] font-medium text-[#EDEDEF]">{label}</span>
        </div>
    )
}

export function JobContentCard({ job }: { job: JobRow }) {
    const responsibilityLines = toLines(job.responsibilities)
    const description = job.description || responsibilityLines[0] || ""
    const responsibilities = job.description ? responsibilityLines : responsibilityLines.slice(1)
    const requirements = toLines(job.requirements)
    const benefits = toLines(
        job.benefits || "Full Health & Dental\nCompetitive 401k\nLatest Hardware Stipend\nUnlimited PTO",
    )
    const skills = job.skills?.length
        ? job.skills
        : ["Figma Expertise", "System Thinking", "UI/UX Design", "Basic Frontend"]

    return (
        <section className="border border-white/10 bg-[#141418] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_rgba(255,255,255,0.035)]">
            <div className="pb-7">
                <h2 className={headingClass}>Job Description</h2>
                {description ? <p className={`mt-4 ${bodyClass}`}>{description}</p> : null}
            </div>

            <div className="border-t border-white/10 py-7">
                <h2 className={headingClass}>Responsibilities</h2>
                <div className="mt-4">
                    <BulletList items={responsibilities} />
                </div>
            </div>

            <div className="border-t border-white/10 py-7">
                <h2 className={headingClass}>Requirements</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#EDEDEF]"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <div className="mt-5">
                    <BulletList items={requirements} />
                </div>
            </div>

            <div className="border-t border-white/10 pt-7">
                <h2 className={headingClass}>Benefits</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {benefits.map((benefit) => (
                        <BenefitCard key={benefit} label={benefit} />
                    ))}
                </div>
            </div>
        </section>
    )
}
