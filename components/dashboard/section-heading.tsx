import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SectionHeading({
  title,
  actionLabel,
  actionHref,
}: {
  title: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="section-title">{title}</h2>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="inline-flex items-center gap-1 text-[13px] font-medium text-[#8F88FF] hover:text-[#C3C0FF]">
          {actionLabel} <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      ) : null}
    </div>
  )
}
