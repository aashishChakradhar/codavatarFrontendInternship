import Menu from "@/components/menu"
import { ToastMessage, type ToastStatusType } from "@/components/toast/toast"
import { fetchMenu } from "@/redux/menu/menuSlice"
import type { AppDispatch } from "@/redux/store"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const toastId = "Menu-Toast"

export default function MenuPage() {
  const [loading, setLoading] = useState(false)
  const [toastStatus, setToastStatus] = useState<ToastStatusType | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setLoading(true)
    setToastStatus("loading")
    setToastMessage("Loading Menu...")
    const loadMenu = async () => {
      try {
        const result = await dispatch(fetchMenu())
        if (fetchMenu.fulfilled.match(result)) {
          setToastStatus("success")
          setToastMessage("Menu Loaded!")
        } else if (fetchMenu.rejected.match(result)) {
          const errorMessage = result.payload || "Loading menu failed"
          setToastStatus("error")
          setToastMessage(errorMessage)
        }
      } catch (err) {
        if (err instanceof Error) {
          setToastStatus("error")
          setToastMessage(err.message)
        } else {
          setToastStatus("error")
          setToastMessage("An unknown error occured")
        }
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [])

  return (
    <>
      <Menu />
      {toastMessage && toastStatus && (
        <ToastMessage
          status={toastStatus}
          message={toastMessage}
          toastId={toastId}
        />
      )}
    </>
  )
}
