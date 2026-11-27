import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#080808] px-4 text-center text-white">
      <span className="flex size-16 items-center justify-center rounded-full border border-[#EF4444]/30 bg-[#EF4444]/10">
        <ShieldAlert aria-hidden className="size-7 text-[#EF4444]" />
      </span>
      <div>
        <h1 className="font-heading text-3xl font-semibold">You don&apos;t have access to this page</h1>
        <p className="mt-2 text-sm text-[#A0A0AB]">Sign in with an account that has the right role.</p>
      </div>
      <Link href="/" className="primary-button">Back to home</Link>
    </main>
  )
}
