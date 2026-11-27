"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"

const SORT_OPTIONS = [
    { value: "recent", label: "Most Recent" },
    { value: "salary-desc", label: "Salary: High to Low" },
    { value: "salary-asc", label: "Salary: Low to High" },
    { value: "title", label: "Title: A to Z" },
]

export function JobSortSelect({ defaultValue = "recent" }: { defaultValue?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    const handleChange = (value: string) => {
        const next = new URLSearchParams(params.toString())
        if (value === "recent") next.delete("sort")
        else next.set("sort", value)
        next.delete("page")
        router.push(`${pathname}?${next.toString()}`)
    }

    return (
        <label className="relative flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] px-3 text-[13px] text-[#EDEDEF]">
            <span className="text-[#808089]">Sort by:</span>
            <select
                aria-label="Sort jobs"
                value={SORT_OPTIONS.some((option) => option.value === defaultValue) ? defaultValue : "recent"}
                onChange={(event) => handleChange(event.target.value)}
                className="appearance-none bg-transparent pr-5 text-[13px] font-medium text-[#EDEDEF] outline-none"
            >
                {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#1A1A1F]">
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 size-3.5 text-[#808089]" />
        </label>
    )
}
