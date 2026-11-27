"use client"

import { toast as sonnerToast } from "sonner"

type ToastPayload = {
  title?: string
  description?: string
  duration?: number
}

type ToastInput = string | ToastPayload

function normalize(input: ToastInput) {
  if (typeof input === "string") return { message: input, options: {} }
  return { message: input.title ?? "", options: { description: input.description, duration: input.duration } }
}

function show(input: ToastInput) {
  const { message, options } = normalize(input)
  return sonnerToast(message, options)
}

/** Small compatibility layer so callers can use `toast.add({ title, description })`. */
export const toast = Object.assign(show, {
  add: show,
  success: (input: ToastInput) => {
    const { message, options } = normalize(input)
    return sonnerToast.success(message, options)
  },
  error: (input: ToastInput) => {
    const { message, options } = normalize(input)
    return sonnerToast.error(message, options)
  },
  info: (input: ToastInput) => {
    const { message, options } = normalize(input)
    return sonnerToast.info(message, options)
  },
  loading: (input: ToastInput) => {
    const { message, options } = normalize(input)
    return sonnerToast.loading(message, options)
  },
  dismiss: sonnerToast.dismiss,
})
