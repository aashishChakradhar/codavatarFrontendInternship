import { fetchMenu } from "@/redux/menu/menuSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { activateToast } from "@/redux/toast/toastSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useLoadMenu = () => {
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.menu.status)

  useEffect(() => {
    if (status !== "idle") return

    dispatch(
      activateToast({
        toastId: "load-menu",
        status: "loading",
        message: "Loading Menu...",
      })
    )
    const loadMenu = async () => {
      try {
        const result = await dispatch(fetchMenu())
        if (fetchMenu.fulfilled.match(result)) {
          dispatch(
            activateToast({
              toastId: "load-menu",
              status: "success",
              message: "Menu Loaded.",
            })
          )
        } else if (fetchMenu.rejected.match(result)) {
          const errorMessage = result.payload || "Loading menu failed"
          dispatch(
            activateToast({
              toastId: "load-menu",
              status: "error",
              message: errorMessage,
            })
          )
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occured"
        dispatch(
          activateToast({
            toastId: "load-table",
            status: "error",
            message,
          })
        )
      }
    }

    loadMenu()
  }, [dispatch, status])
}

export default useLoadMenu
