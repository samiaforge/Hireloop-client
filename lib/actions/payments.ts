"use server"

import { checkoutVerify as verify } from "@/lib/api/payments"

export async function checkoutVerify(sessionId: string) {
  return verify(sessionId)
}
