import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  className,
}: {
  label: string
  value: string | number
  detail?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <section className={cn("surface-card flex min-h-[128px] flex-col justify-between p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-[#A0A0AB]">{label}</p>
        {Icon ? <Icon aria-hidden className="size-5 text-[#8F88FF]" /> : null}
      </div>
      <div>
        <p className="font-heading text-[26px] leading-8 font-semibold text-[#EDEDEF]">{value}</p>
        {detail ? <p className="mt-1 text-xs text-[#6E6E78]">{detail}</p> : null}
      </div>
    </section>
  )
}
