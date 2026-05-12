"use client"

import { toast } from "sonner"

export type ToastStatusType =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "loading"
  | "promise"
  | null

interface ToastMessageInterface {
  status: ToastStatusType
  message: string
  toastId?: string
}

export function ToastMessage({
  status,
  message,
  toastId,
}: ToastMessageInterface) {
  const id = toastId ?? `${status}-${message}`

  switch (status) {
    case "success":
      toast.success(message, { position: "top-right", id })

      return null
    case "error":
      toast.error(message, {
        position: "top-right",
        id,
      })

      return null
    case "info":
      toast.info(message, {
        position: "top-right",
        id,
      })

      return null
    case "warning":
      toast.warning(message, {
        position: "top-right",
        id,
      })

      return null
    case "loading":
      toast.loading(message, {
        position: "top-right",
        id,
      })

      return null
    case "promise":
      toast.promise<{ name: string }>(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ name: "Event" }), 2000)
          ),
        {
          loading: "Loading...",
          success: (data) => `${data.name} has been created`,
          error: "Error",
        }
      )

      return null
    default:
      toast("Event has been created", { position: "top-right" })
      return null
  }
}
