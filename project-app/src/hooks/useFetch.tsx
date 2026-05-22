import type { AppDispatch } from "@/redux/store"
import { activateToast } from "@/redux/toast/toastSlice"
import { useDispatch } from "react-redux"

type FetchOptions<T> = {
  onSuccess?: (data: T) => void
  successAction?: (payload: T) => any
  notifySuccess?: boolean
  successMessage?: string
  toastId?: string
}

export default function useFetch() {
  const dispatch = useDispatch<AppDispatch>()

  async function fetchData<T = any>(
    input: RequestInfo,
    init?: RequestInit,
    options?: FetchOptions<T>
  ): Promise<T> {
    try {
      const response = await fetch(input, init)

      // attempt to parse body safely
      const text = await response.text()
      const data = text ? JSON.parse(text) : (null as any)

      if (!response.ok) {
        const errMsg =
          (data && (data.message || data.error)) || response.statusText
        throw new Error(errMsg || `HTTP ${response.status}`)
      }

      if (options?.successAction) dispatch(options.successAction(data))
      if (options?.onSuccess) options.onSuccess(data)
      if (options?.notifySuccess)
        dispatch(
          activateToast({
            toastId: options.toastId ?? `toast-${Date.now()}`,
            status: "success",
            message: options.successMessage ?? "Success",
          })
        )

      return data as T
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      dispatch(
        activateToast({
          toastId: `toast-${Date.now()}`,
          status: "error",
          message,
        })
      )
      throw err
    }
  }

  return { fetchData }
}
