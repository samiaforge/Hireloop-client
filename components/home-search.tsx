"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search } from "lucide-react"

const TRENDING = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

export function HomeSearch() {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")

  const submit = (query?: string) => {
    const params = new URLSearchParams()
    const value = query ?? keyword
    if (value) params.set("search", value)
    if (location && location.toLowerCase() !== "remote") params.set("location", location)
    if (location.toLowerCase() === "remote") params.set("isRemote", "true")
    router.push(`/jobs${params.size ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-[680px]">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#111111]/95 p-2 shadow-2xl sm:flex-row sm:items-center"
      >
        <label className="flex flex-1 items-center gap-3 px-4 py-3">
          <Search aria-hidden className="size-5 shrink-0 text-[#A0A0AB]" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Job tilte, skill or company"
            className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6E6E78]"
          />
        </label>
        <span className="hidden h-7 w-px bg-white/15 sm:block" />
        <label className="flex flex-1 items-center gap-3 px-4 py-3">
          <MapPin aria-hidden className="size-5 shrink-0 text-[#A0A0AB]" />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location or Remote"
            className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6E6E78]"
          />
        </label>
        <button type="submit" className="primary-button h-12 sm:w-12 sm:px-0" aria-label="Search">
          <Search aria-hidden className="size-5" />
          <span className="sm:hidden">Search</span>
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-xs text-[#A0A0AB]">Trending Position</span>
        {TRENDING.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => submit(item)}
            className="rounded-full border border-white/10 bg-[#202020] px-3 py-1.5 text-xs text-[#EDEDEF] transition-colors hover:border-[#5C53FE]/50 hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
