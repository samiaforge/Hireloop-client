import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Bookmark,
  Building2,
  ChartNoAxesCombined,
  Check,
  FileText,
  Search,
  Sparkles,
  Target,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { PricingSection } from "@/components/pricing-section"
import { getJobs } from "@/lib/api/jobs"
import { formatCompensation } from "@/lib/formatters"
import type { JobRow } from "@/lib/types/jobs"

export const dynamic = "force-dynamic"

const STATS = [
  { value: "50K", label: "Active Jobs" },
  { value: "12K", label: "Companies" },
  { value: "2M", label: "Job Seekers" },
  { value: "97%", label: "Satisfication Rate" },
]

const FEATURES = [
  { icon: Search, title: "Smart Search", body: "Find your ideal job with advanced filters." },
  { icon: ChartNoAxesCombined, title: "Salary Insights", body: "Get real salary data to negotiate confidently." },
  { icon: Building2, title: "Top Companies", body: "Apply to vetted companies that are hiring." },
  { icon: Bookmark, title: "Saved Jobs", body: "Manage apps & favorites on your dashboard." },
  { icon: Check, title: "One-Click Apply", body: "Simplify your job applications for an easier process!" },
  { icon: FileText, title: "Resume Builder", body: "Create professional resumes with modern templates." },
  { icon: Target, title: "Skill-Based Matching", body: "Discover jobs that match your skills and experience." },
  { icon: Sparkles, title: "Career Growth Resources", body: "Boost your career with quick interview tips." },
]

const FALLBACK_JOBS: JobRow[] = Array.from({ length: 6 }, (_, index) => ({
  _id: `sample-${index}`,
  title: "Frontend Developer",
  companyName: "Hireloop Partner",
  recruiterId: "",
  category: "Engineering & Tech",
  jobType: "full-time",
  isRemote: false,
  location: "New York, USA",
  deadline: "2026-12-31",
  minSalary: "25",
  maxSalary: "40",
  salaryFrequency: "per hour",
  responsibilities: "Showcase your commitment to diversity and inclusion by highlighting initiatives",
  requirements: "Experience with modern frontend frameworks",
  applicants: 0,
  status: "active",
  posted: "Recently",
}))

async function featuredJobs(): Promise<JobRow[]> {
  try {
    const jobs = await getJobs("status=active")
    return jobs.length ? jobs.slice(0, 6) : FALLBACK_JOBS
  } catch {
    return FALLBACK_JOBS
  }
}

export default async function Page() {
  const jobs = await featuredJobs()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010103] text-white">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 0% 0%, rgba(92,83,254,0.16), transparent 70%), radial-gradient(ellipse 60% 45% at 100% 0%, rgba(220,2,206,0.1), transparent 70%), linear-gradient(to bottom, #080810, #010103 55%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 z-0 w-full -translate-x-1/2">
        <Image
          src="/images/globe1.png"
          alt=""
          width={1440}
          height={1343}
          priority
          className="mx-auto mt-40 w-full max-w-none object-contain lg:max-w-[1400px]"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />

        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
          <p className="text-center text-sm text-[#ACABB2]">Assisting over 15,000 job seekers find their dream positions.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                <p className="font-heading text-4xl font-semibold text-white">{stat.value}</p>
                <p className="mt-3 text-sm text-[#D0D5DD]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <p className="overline-label">Smart job discovery</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
              The roles you&apos;d never find by searching
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <article key={job._id} className="flex min-h-[260px] flex-col rounded-2xl border border-white/10 bg-[#141418] p-6">
                <div className="flex size-14 items-center justify-center rounded-xl bg-[#1A1A1F] font-heading text-xl font-semibold text-[#8F88FF]">
                  {job.companyName?.charAt(0) ?? "H"}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{job.title}</h3>
                <p className="mt-2 text-sm text-[#A0A0AB]">{job.responsibilities}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#D0D5DD]">
                  <span>{job.location}</span>
                  <span aria-hidden>•</span>
                  <span>{job.isRemote ? "Remote" : "Hybrid"}</span>
                  <span aria-hidden>•</span>
                  <span>{formatCompensation(job)}</span>
                </div>
                <Link href={`/jobs/${job._id}`} className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-[#8F88FF]">
                  Apply Now <ArrowRight aria-hidden className="size-4" />
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/jobs" className="ghost-button">
              View all job open
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <p className="overline-label">features job</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
              Everything you need to succeed
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <article key={title} className="flex min-h-[110px] gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <Icon aria-hidden className="size-8 shrink-0 text-[#8F88FF]" />
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#A0A0AB]">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <PricingSection className="pb-10 sm:pb-12" />

        <section className="relative mt-16 flex min-h-[520px] w-full items-center justify-center overflow-hidden bg-[#07070C] lg:mt-20 lg:min-h-[720px]">
          <Image
            src="/images/cta-bg.png"
            alt=""
            aria-hidden
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="relative z-10 mx-auto flex w-full max-w-[792px] flex-col items-center px-6 py-20 text-center">
            <h2 className="whitespace-pre-line font-heading text-[40px] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[56px] lg:text-[64px] lg:leading-[1.2]">
              {`Your next role is\r\nalready looking for you`}
            </h2>
            <p className="mt-6 max-w-[792px] text-base leading-8 text-[#D0D5DD] sm:mt-8 sm:text-lg lg:mt-[18px] lg:text-[22px]">
              Build a profile in three minutes. The matches start arriving tomorrow morning.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:mt-[48px]">
              <Link href="/auth/sign-up" className="primary-button h-[58px] px-8 text-base">Create a free account</Link>
              <Link href="/pricing" className="ghost-button h-[58px] px-8 text-base">View pricing</Link>
            </div>
          </div>
        </section>

        <footer className="mx-auto mt-8 max-w-[1320px] border-t border-white/10 px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <Image src="/images/logo.png" alt="Hireloop" width={154} height={44} className="h-11 w-auto" />
              <p className="mt-5 max-w-xs text-sm leading-6 text-[#A0A0AB]">
                The AI-native career platform. Built for people who take their work seriously.
              </p>
              <div className="mt-6 flex gap-3">
                <span aria-label="Facebook" className="flex size-9 items-center justify-center rounded-full border border-white/10 font-semibold text-[#A0A0AB]">f</span>
                <span aria-label="Pinterest" className="flex size-9 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-[#A0A0AB]">P</span>
                <span aria-label="LinkedIn" className="flex size-9 items-center justify-center rounded-full border border-white/10 text-xs font-semibold text-[#A0A0AB]">in</span>
              </div>
            </div>
            <FooterColumn title="Product" links={["Job discovery", "Worker AI", "Companies", "Salary data"]} />
            <FooterColumn title="Navigations" links={["Help center", "Career library", "Contact"]} />
            <FooterColumn title="Resources" links={["Brand Guideline", "Newsroom"]} />
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#6E6E78]">
            <span>Copyright 2024 —Programming Hero</span>
            <span>Terms &amp; Policy - Privacy Guideline</span>
          </div>
        </footer>
      </div>
    </main>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <Link href={link === "Companies" ? "/companies" : link === "Job discovery" ? "/jobs" : "#"} className="text-sm text-[#A0A0AB] hover:text-white">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
