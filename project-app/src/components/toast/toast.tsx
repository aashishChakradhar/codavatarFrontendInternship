"use client"

import { toast } from "sonner"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { deactivateToast } from "@/redux/toast/toastSlice"

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
  const dispatch = useDispatch()

  useEffect(() => {
    if (!status) return
    const id = toastId ?? `${status}-${message}`

    switch (status) {
      case "success":
        toast.success(message, { position: "top-right", id })
        break
      case "error":
        toast.error(message, { position: "top-right", id })
        break
      case "info":
        toast.info(message, { position: "top-right", id })
        break
      case "warning":
        toast.warning(message, { position: "top-right", id })
        break
      case "loading":
        toast.loading(message, { position: "top-right", id })
        break
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
        break
      default:
        toast("Event has been created", { position: "top-right", id })
    }

    // clear the toast state in redux so the same toast doesn't re-trigger on navigation
    try {
      dispatch(deactivateToast())
    } catch (e) {
      // ignore
    }
  }, [status, message, toastId, dispatch])

  return null
}
