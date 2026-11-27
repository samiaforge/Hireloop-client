import { cn } from "@/lib/utils"

/** Shared table shell for the high-density dashboard tables. */
export function DashboardTable({
  headers,
  children,
  className,
}: {
  headers: string[]
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("surface-card overflow-x-auto", className)}>
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-[11px] font-medium tracking-[0.08em] text-[#6E6E78] uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  )
}

export function TableCell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <td className={cn("px-4 py-3 align-middle text-[#D8D8DE]", className)}>{children}</td>
}
