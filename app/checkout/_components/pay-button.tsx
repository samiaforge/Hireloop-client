"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import type { PlanId } from "@/lib/types/domain"

export function PayButton({ plan, role }: { plan: PlanId; role: "seeker" | "recruiter" }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, role }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || "Unable to start checkout")
      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout")
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="flex h-[60px] w-full items-center justify-center gap-2 rounded-lg bg-[#0070E0] text-lg font-bold text-white shadow-[0_4px_6px_-4px_rgba(94,158,246,0.3),0_10px_15px_-3px_rgba(94,158,246,0.3)] transition-colors hover:bg-[#3F90E5] disabled:opacity-60"
      >
        {loading ? <Loader2 aria-hidden className="size-5 animate-spin" /> : null}
        {loading ? "Redirecting…" : "Pay"}
      </button>
      {error ? <p className="mt-3 text-center text-xs text-[#EF4444]">{error}</p> : null}
    </div>
  )
}
