// The "Bento Info Grid" from the Figma job details page: four square
// corner info tiles with icon, uppercase label, and semibold value.

import { Briefcase, GraduationCap, MapPin, Wallet } from "lucide-react"

import { formatJobLocation, formatPublicSalary } from "@/lib/formatters"
import type { JobRow } from "@/lib/types/jobs"

export function JobHighlights({ job }: { job: JobRow }) {
    const cells = [
        { label: "Salary Range", value: formatPublicSalary(job), Icon: Wallet },
        { label: "Location", value: formatJobLocation(job), Icon: MapPin },
        { label: "Job Type", value: job.jobType, Icon: Briefcase },
        { label: "Experience", value: job.experience || "5+ Years", Icon: GraduationCap },
    ]

    return (
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cells.map(({ label, value, Icon }) => (
                <div
                    key={label}
                    className="border border-white/10 bg-[#141418] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_rgba(255,255,255,0.035)]"
                >
                    <Icon aria-hidden className="size-[22px] text-[#C4C7C8]" />
                    <dt className="mt-3 text-[11px] font-medium tracking-[0.12em] text-[#A0A0AB] uppercase">
                        {label}
                    </dt>
                    <dd className="mt-1.5 text-base font-semibold capitalize text-[#EDEDEF]">
                        {value}
                    </dd>
                </div>
            ))}
        </dl>
    )
}
