export type CompanyStatus = "pending" | "approved" | "rejected"
export type JobStatus = "active" | "closed" | "draft" | "expired"
export type PlanId = "starter" | "growth" | "premium"

export const COMPANY_STATUS_META: Record<CompanyStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "#F59E0B" },
  approved: { label: "Approved", color: "#22C55E" },
  rejected: { label: "Rejected", color: "#EF4444" },
}

export const JOB_STATUS_META: Record<JobStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "#22C55E" },
  closed: { label: "Closed", color: "#EF4444" },
  draft: { label: "Draft", color: "#A0A0AB" },
  expired: { label: "Expired", color: "#EF4444" },
}

export const PLAN_META: Record<PlanId, { label: string; price: number; color: string }> = {
  starter: { label: "Starter", price: 0, color: "#A0A0AB" },
  growth: { label: "Growth", price: 17, color: "#5C53FE" },
  premium: { label: "Premium", price: 99, color: "#F59E0B" },
}

export const PLAN_LIMITS = {
  jobs: { starter: 3, growth: 10, premium: 50 },
  applicationsPerMonth: { starter: 3, growth: 30, premium: Number.POSITIVE_INFINITY },
  savedJobs: { starter: 10, growth: Number.POSITIVE_INFINITY, premium: Number.POSITIVE_INFINITY },
} as const

export type CompanyRow = {
  _id: string
  name: string
  industry: string
  website?: string
  location: string
  employeeCount: string
  description: string
  logoUrl?: string
  status: CompanyStatus
  recruiterId: string
  recruiterEmail?: string
  createdAt: string
}

export type SavedJobRow = {
  _id: string
  userId: string
  jobId: string
  savedAt: string
  job: import("@/lib/types/jobs").JobRow | null
}

export type PaymentRow = {
  _id: string
  sessionId: string
  userId: string
  email: string
  plan: PlanId
  amount: number
  currency: string
  status: string
  createdAt: string
  transactionId: string
}
