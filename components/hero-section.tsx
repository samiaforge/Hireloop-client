import { Briefcase } from "lucide-react"

import { HomeSearch } from "@/components/home-search"

export function HeroSection() {
  return (
    <section className="relative px-4 pt-20 pb-10 text-center sm:pt-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#171717]/90 px-4 py-2 font-mono text-xs text-white sm:text-[20px]">
          <Briefcase aria-hidden className="size-4 text-[#F59E0B]" />
          <span>50,000+ new jobs this month</span>
        </div>

        <h1 className="mt-8 font-heading text-4xl leading-tight font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px]">
          Find Your Dream Job Today
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-[#D0D5DD]">
          HireLoop connects top talent with world-class companies. Browse thousands of curated opportunities and land
          your next role — faster.
        </p>

        <HomeSearch />
      </div>
    </section>
  )
}
