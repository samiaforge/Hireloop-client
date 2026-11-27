"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Field } from "@/components/shared/field"
import { StatusPill } from "@/components/shared/status-pill"
import { toast } from "@/components/ui/toast"
import { createCompanyAction, updateCompanyAction } from "@/lib/actions/dashboard"
import type { CompanyRow } from "@/lib/types/domain"

export function CompanyForm({ company }: { company: CompanyRow | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState(company?.name ?? "")
  const [industry, setIndustry] = useState(company?.industry ?? "")
  const [website, setWebsite] = useState(company?.website ?? "")
  const [location, setLocation] = useState(company?.location ?? "")
  const [employeeCount, setEmployeeCount] = useState(company?.employeeCount ?? "")
  const [description, setDescription] = useState(company?.description ?? "")
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl ?? "")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name || !industry) {
      toast.error("Company name and industry are required")
      return
    }

    const payload = { name, industry, website, location, employeeCount, description, logoUrl }

    startTransition(async () => {
      try {
        if (company) {
          await updateCompanyAction(company._id, payload)
          toast.success("Company profile updated")
        } else {
          await createCompanyAction(payload)
          toast.success("Company submitted for approval")
        }
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save company")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-white">
            {company ? "Company Profile" : "Register Your Company"}
          </h2>
          <p className="body-muted mt-1">
            {company
              ? "Keep your public employer profile accurate and up to date."
              : "New companies are reviewed before their jobs appear publicly."}
          </p>
        </div>
        {company ? <StatusPill status={company.status} /> : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Company Name" htmlFor="company-name" required>
          <input
            id="company-name"
            className="surface-field"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>
        <Field label="Industry" htmlFor="company-industry" required>
          <input
            id="company-industry"
            className="surface-field"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            placeholder="Engineering & Tech"
            required
          />
        </Field>
        <Field label="Website" htmlFor="company-website">
          <input
            id="company-website"
            className="surface-field"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="https://company.com"
          />
        </Field>
        <Field label="Location" htmlFor="company-location">
          <input
            id="company-location"
            className="surface-field"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="London, UK"
          />
        </Field>
        <Field label="Employee Count" htmlFor="company-size">
          <select
            id="company-size"
            className="surface-field"
            value={employeeCount}
            onChange={(event) => setEmployeeCount(event.target.value)}
          >
            <option value="" className="bg-[#1A1A1F]">
              Select size
            </option>
            {["1-10", "11-50", "51-200", "201-500", "500+"].map((size) => (
              <option key={size} value={size} className="bg-[#1A1A1F]">
                {size}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Logo URL" htmlFor="company-logo">
          <input
            id="company-logo"
            className="surface-field"
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            placeholder="https://company.com/logo.png"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Description" htmlFor="company-description">
          <textarea
            id="company-description"
            rows={4}
            className="surface-field resize-y"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tell candidates what your team builds…"
          />
        </Field>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" disabled={pending} className="primary-button min-w-[148px]">
          {pending ? "Working…" : company ? "Save Company" : "Register Company"}
        </button>
      </div>
    </form>
  )
}
