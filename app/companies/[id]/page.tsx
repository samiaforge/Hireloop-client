import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Building2, MapPin, Users } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { getCompanyById } from "@/lib/api/companies"

export const dynamic = "force-dynamic"

export default async function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await getCompanyById(id).catch(() => null)
  if (!company) notFound()

  return (
    <main className="min-h-screen bg-[#010103] text-white">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <Link href="/companies" className="inline-flex items-center gap-2 text-sm text-[#A0A0AB] hover:text-white">
          <ArrowLeft aria-hidden className="size-4" /> Back to companies
        </Link>

        <div className="surface-card mt-8 p-8">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-[#1A1A1F] text-[#8F88FF]">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt="" className="size-16 rounded-xl object-cover" />
            ) : (
              <Building2 aria-hidden className="size-8" />
            )}
          </div>
          <h1 className="mt-6 font-heading text-3xl font-semibold">{company.name}</h1>
          <p className="mt-2 text-[#A0A0AB]">{company.industry}</p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#A0A0AB]">
            <span className="flex items-center gap-2"><MapPin aria-hidden className="size-4" />{company.location}</span>
            <span className="flex items-center gap-2"><Users aria-hidden className="size-4" />{company.employeeCount}</span>
            {company.website ? <a href={company.website} target="_blank" rel="noreferrer" className="text-[#8F88FF]">Visit website</a> : null}
          </div>

          <p className="mt-8 whitespace-pre-line leading-7 text-[#D0D5DD]">{company.description}</p>
        </div>
      </section>
    </main>
  )
}
