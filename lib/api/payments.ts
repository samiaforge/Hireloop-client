"use server"

import { apiRequest } from "@/lib/core/server"
import type { PaymentRow } from "@/lib/types/domain"
import type { PlanId } from "@/lib/types/domain"

export async function getPayments(): Promise<PaymentRow[]> {
  return apiRequest<PaymentRow[]>("/payments")
}

export type PaymentSummary = {
  totalRevenue: number
  monthlyRevenue: number
  activeSubscriptions: number
}

export async function getPaymentSummary(): Promise<PaymentSummary> {
  return apiRequest<PaymentSummary>("/payments/summary")
}

export async function verifyCheckout(sessionId: string) {
  return apiRequest<{ success: boolean; message?: string }>("/payments/checkout-verify", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  })
}

export async function checkoutVerify(sessionId: string) {
  return verifyCheckout(sessionId)
}

export async function createCheckoutSession(plan: PlanId, role: "seeker" | "recruiter") {
  return apiRequest<{ url: string }>("/payments/checkout-session", {
    method: "POST",
    body: JSON.stringify({ plan, role }),
  })
}
