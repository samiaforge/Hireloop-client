// Sidebar "Company Overview" card from the Figma job details page:
// heading, banner, key-value rows, and a full-width "Visit Website" action.

import Image from "next/image"

import type { CompanyRow } from "@/lib/types/domain"
import type { JobRow } from "@/lib/types/jobs"

const rowClass = "flex items-center justify-between gap-4 py-3.5"

export function CompanyOverviewCard({
    job,
    company,
}: {
    job: JobRow
    company: CompanyRow | null
}) {
    const rows = [
        { label: "Size", value: company?.employeeCount || "250 - 500 Employees" },
        { label: "Industry", value: company?.industry || "Not specified" },
    ]

    const website = company?.website?.trim()

    return (
        <aside className="border border-white/10 bg-[#141418] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_rgba(255,255,255,0.035)]">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                Company Overview
            </h2>

            <div className="relative mt-3 flex h-[204px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#5C53FE]/40 via-[#5C53FE]/10 to-[#0B0B0C]">
                {company?.logoUrl ? (
                    <Image
                        src={company.logoUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 397px"
                        className="object-cover opacity-25"
                    />
                ) : null}
                <span className="relative font-heading text-5xl font-semibold text-white/80">
                    {(company?.name || job.companyName).charAt(0)}
                </span>
            </div>

            <dl className="mt-6 divide-y divide-white/10">
                {rows.map(({ label, value }) => (
                    <div key={label} className={rowClass}>
                        <dt className="text-[11px] font-medium tracking-[0.12em] text-[#A0A0AB] uppercase">
                            {label}
                        </dt>
                        <dd className="max-w-[65%] truncate text-right text-sm font-medium text-[#EDEDEF]">
                            {value}
                        </dd>
                    </div>
                ))}
            </dl>

            {website ? (
                <a
                    href={website.startsWith("http") ? website : `https://${website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex h-11 w-full items-center justify-center rounded-[10px] bg-white text-[13px] font-medium text-[#0B0B0C] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white/90"
                >
                    Visit Website
                </a>
            ) : (
                <button
                    type="button"
                    disabled
                    className="mt-5 h-11 w-full rounded-[10px] bg-white/40 text-[13px] font-medium text-[#0B0B0C]/60"
                >
                    Visit Website
                </button>
            )}
        </aside>
    )
}
