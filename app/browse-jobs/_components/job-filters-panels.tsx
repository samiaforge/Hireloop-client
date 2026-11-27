// Sidebar filters for the Browse Jobs page — from the Figma
// "Aside - Sidebar Filters" (labels 13px #A0A0AB, counts #6E6E78,
// filter groups stacked in one #141418 card).

import { FilterChecklist, type FilterOption } from "@/components/shared/filter-checklist"
import { JOB_CATEGORIES, type JobRow } from "@/lib/types/jobs"

/** Figma sidebar uses "1.2k" style counts. */
const compactCount = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(value)

const countOptions = (
    facet: (job: JobRow) => string,
    allOptions: readonly string[],
    jobs: readonly JobRow[],
): FilterOption[] =>
    allOptions.map((option) => ({
        value: option,
        label: option,
        count: compactCount(jobs.filter((job) => facet(job) === option).length),
    }))

const BROWSE_JOB_TYPES = [
    { value: "full-time", label: "Full-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
]

export function JobFiltersPanel({
    jobs,
    selectedJobType = [],
    selectedCategory = [],
    selectedRemote = [],
}: {
    jobs: readonly JobRow[]
    selectedJobType?: readonly string[]
    selectedCategory?: readonly string[]
    selectedRemote?: readonly string[]
}) {
    return (
        <section className="surface-card p-6">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">Filters</h2>

            <div className="mt-7 flex flex-col gap-6">
                <FilterChecklist
                    legend="Job Type"
                    name="jobType"
                    multiple={false}
                    defaultValue={selectedJobType}
                    options={BROWSE_JOB_TYPES.map(({ value, label }) => ({
                        value,
                        label,
                        count: compactCount(jobs.filter((job) => job.jobType === value).length),
                    }))}
                />
                <FilterChecklist
                    legend="Job Category"
                    name="category"
                    multiple={false}
                    defaultValue={selectedCategory}
                    options={countOptions((job) => job.category, JOB_CATEGORIES, jobs)}
                />
                <FilterChecklist
                    legend="Work Arrangement"
                    name="isRemote"
                    defaultValue={selectedRemote}
                    options={[
                        {
                            value: "remote",
                            label: "Remote only",
                            count: compactCount(jobs.filter((job) => job.isRemote).length),
                        },
                    ]}
                />
            </div>
        </section>
    )
}
