import { Pill } from "@/components/shared/pill"
import { STATUS_META, type ApplicationStatus } from "@/lib/types/applications"
import { COMPANY_STATUS_META, JOB_STATUS_META, type CompanyStatus, type JobStatus } from "@/lib/types/domain"

type Status = ApplicationStatus | CompanyStatus | JobStatus | "active" | "closed" | "draft" | "expired" | "paid" | "pending" | "failed" | "success"

const EXTRA: Record<string, { label: string; color: string }> = {
  paid: { label: "Paid", color: "#22C55E" },
  pending: { label: "Pending", color: "#F59E0B" },
  failed: { label: "Failed", color: "#EF4444" },
  success: { label: "Success", color: "#22C55E" },
}

export function StatusPill({ status }: { status: Status }) {
  const meta =
    STATUS_META[status as ApplicationStatus] ??
    COMPANY_STATUS_META[status as CompanyStatus] ??
    JOB_STATUS_META[status as JobStatus] ??
    EXTRA[status] ?? { label: status, color: "#A0A0AB" }

  return <Pill label={meta.label} color={meta.color} dot />
}
