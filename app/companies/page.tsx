import Link from "next/link"
import { ArrowRight, Building2, MapPin, Users } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { getCompanies } from "@/lib/api/companies"

export const dynamic = "force-dynamic"

const INDUSTRIES = ["All", "Fintech", "AI", "Developer Tools", "E-Commerce", "SaaS"]

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>
}) {
  const { industry } = await searchParams
  const query = industry && industry !== "All" ? `?industry=${encodeURIComponent(industry)}` : ""
  const companies = await getCompanies(query).catch(() => [])

  return (
    <main className="min-h-screen bg-[#010103] text-white">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="overline-label">Companies</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold">Companies hiring on Hireloop</h1>
        <p className="mt-3 text-sm text-[#A0A0AB]">Explore verified teams and discover who is building what next.</p>

        <nav aria-label="Filter by industry" className="mt-10 flex flex-wrap gap-2">
          {INDUSTRIES.map((item) => (
            <Link
              key={item}
              href={item === "All" ? "/companies" : `/companies?industry=${encodeURIComponent(item)}`}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                (industry ?? "All") === item
                  ? "border-[#5C53FE] bg-[#5C53FE] text-white"
                  : "border-white/10 bg-[#141418] text-[#A0A0AB] hover:text-white"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {companies.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link key={company._id} href={`/companies/${company._id}`} className="surface-card flex flex-col p-6 transition-colors hover:border-white/25">
                <div className="flex size-14 items-center justify-center rounded-xl bg-[#1A1A1F] text-[#8F88FF]">
                  {company.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={company.logoUrl} alt="" className="size-12 rounded-lg object-cover" />
                  ) : (
                    <Building2 aria-hidden className="size-6" />
                  )}
                </div>
                <h2 className="mt-5 text-lg font-semibold text-white">{company.name}</h2>
                <p className="mt-1 text-sm text-[#A0A0AB]">{company.industry}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#A0A0AB]">
                  <span className="flex items-center gap-1"><MapPin aria-hidden className="size-3.5" />{company.location}</span>
                  <span className="flex items-center gap-1"><Users aria-hidden className="size-3.5" />{company.employeeCount}</span>
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-[#6E6E78]">{company.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-[#8F88FF]">
                  View profile <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="surface-card mt-10 p-12 text-center text-sm text-[#6E6E78]">
            No approved companies in this category yet.
          </div>
        )}
      </section>
    </main>
  )
}
