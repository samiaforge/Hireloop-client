import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import type { UserRole } from "@/lib/types/users"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/** One auth lookup per request, shared by pages and server actions. */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

export const getToken = async () => {
  const session = await getSession()
  if (!session?.session?.token) redirect("/auth/sign-in")
  return session.session.token
}

type ApiRequestInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...init.headers,
    },
  })

  if (res.status === 401 || res.status === 403) redirect("/auth/sign-in")

  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((payload as { message?: string } | null)?.message || `API request failed (${res.status})`)
  }
  return payload as T
}

export async function publicRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "content-type": "application/json", ...init.headers },
  })
  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((payload as { message?: string } | null)?.message || `API request failed (${res.status})`)
  }
  return payload as T
}

/** Kept for existing callers: returns the raw authenticated Response. */
export async function authFetch(api: string) {
  const token = await getToken()
  const res = await fetch(api, { cache: "no-store", headers: { authorization: `Bearer ${token}` } })
  if (res.status === 401 || res.status === 403) redirect("/auth/sign-in")
  return res
}

/** Kept for existing callers: returns the raw authenticated mutation Response. */
export async function protectedMutation(api: string, method: string, data?: unknown) {
  return apiRequest(api, { method, body: data === undefined ? undefined : JSON.stringify(data) })
}

export async function requireUser(roles?: UserRole | UserRole[]) {
  const session = await getSession()
  if (!session?.user) redirect("/auth/sign-in")

  if (roles) {
    const allowed = Array.isArray(roles) ? roles : [roles]
    if (!allowed.includes(session.user.role as UserRole)) redirect("/unauthorized")
  }

  return session.user
}

export async function requireRole(role: UserRole) {
  return requireUser(role)
}
