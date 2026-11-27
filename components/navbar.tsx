"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserAvatar } from "@/components/shared/user-avater"
import { signOut, useSession } from "@/lib/auth-client"

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const user = session?.user
  const role = user?.role
  const dashboardHref =
    role === "recruiter"
      ? "/dashboard/recruiter"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/seeker"

  const handleSignOut = async () => {
    await signOut()
    router.replace("/")
    router.refresh()
  }

  const authLinks = user ? (
    <>
      <Link href={dashboardHref} className="flex items-center gap-2 text-sm text-[#EDEDEF] hover:text-white">
        <UserAvatar src={user.image} name={user.name} className="size-7" />
        <span className="hidden lg:inline">{user.name}</span>
      </Link>
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="text-sm font-semibold text-[#8F88FF] hover:bg-transparent hover:text-[#C3C0FF]"
      >
        <LogOut aria-hidden className="size-4" />
        Sign Out
      </Button>
    </>
  ) : (
    <>
      <Link href="/auth/sign-in">
        <Button
          variant="ghost"
          className="text-sm font-semibold text-[#8F88FF] hover:bg-transparent hover:text-[#C3C0FF]"
        >
          Sign In
        </Button>
      </Link>
      <Link href="/auth/sign-up">
        <Button className="rounded-lg bg-[#5C53FE] px-4 text-sm text-white shadow-[0_2px_10px_rgba(92,83,254,0.3)] hover:bg-[#6f67ff]">
          Get Started
        </Button>
      </Link>
    </>
  )

  return (
    <header className="px-4 pt-6 md:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-xl border border-black/[0.07] bg-[#1a1a1f] px-4 py-3 md:px-5">
        <Link href="/" className="shrink-0" aria-label="Hireloop home">
          <Image src="/images/logo.png" alt="Hireloop" width={154} height={44} priority className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors hover:text-white ${
                  pathname.startsWith(link.href) ? "font-semibold text-white" : "text-[#ededef]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-4">{authLinks}</div>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Open menu" className="text-white hover:bg-white/10 md:hidden" />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="border-white/10 bg-[#1a1a1f] text-white">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 p-4">
              <Link href="/">
                <Image src="/images/logo.png" alt="Hireloop" width={154} height={44} className="h-10 w-auto" />
              </Link>
              <div className="flex flex-col gap-5">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} nativeButton={false} render={<Link href={link.href} />}>
                    {link.label}
                  </SheetClose>
                ))}
              </div>
              <div className="h-px bg-white/20" />
              {user ? (
                <div className="flex flex-col gap-4">
                  <SheetClose nativeButton={false} render={<Link href={dashboardHref} />}>
                    Dashboard
                  </SheetClose>
                  <Button onClick={handleSignOut} variant="outline" className="border-white/20 text-white">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <SheetClose nativeButton={false} render={<Link href="/auth/sign-in" />}>
                    Sign In
                  </SheetClose>
                  <SheetClose nativeButton={false} render={<Link href="/auth/sign-up" />}>
                    <Button className="w-full bg-[#5C53FE] text-white hover:bg-[#6f67ff]">Get Started</Button>
                  </SheetClose>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
