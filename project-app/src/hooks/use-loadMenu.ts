import { fetchMenu } from "@/redux/menu/menuSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { activateToast } from "@/redux/toast/toastSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useLoadMenu = () => {
  const dispatch = useDispatch<AppDispatch>()
  const menus = useSelector((state: RootState) => state.menu.menus)

  useEffect(() => {
    if (menus && menus.length > 0) return // already loaded, do nothing

    const loadMenu = async () => {
      try {
        dispatch(
          activateToast({
            toastId: "load-menu",
            status: "loading",
            message: "Loading Menu...",
          })
        )

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
          err instanceof Error ? err.message : "An unknown error occurred"
        dispatch(
          activateToast({
            toastId: "load-menu",
            status: "error",
            message,
          })
        )
      }
    }

    loadMenu()
    // only run on mount or when menus length changes
  }, [dispatch, menus])
}

export default useLoadMenu
