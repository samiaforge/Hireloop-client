"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

export function JobSearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [value, setValue] = useState(params.get("search") ?? params.get("q") ?? "")

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const next = new URLSearchParams(params.toString())
        if (value) next.set("search", value)
        else next.delete("search")
        router.push(`${pathname}?${next.toString()}`)
      }}
      className="flex min-h-[109px] flex-col justify-center gap-3 rounded-xl border border-white/10 bg-[#141418] p-4 sm:flex-row sm:items-center"
    >
      <label htmlFor="job-search" className="flex flex-1 items-center gap-3 px-3 py-2">
        <Search aria-hidden className="size-5 shrink-0 text-[#A0A0AB]" />
        <input
          id="job-search"
          name="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by job title, keywords..."
          className="w-full min-w-0 bg-transparent text-sm text-[#EDEDEF] outline-none placeholder:text-[#6E6E78]"
        />
      </label>
      <button
        type="submit"
        className="h-[59px] shrink-0 rounded-lg bg-[#5C53FE] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#6f67ff]"
      >
        Search Jobs
      </button>
    </form>
  )
}
