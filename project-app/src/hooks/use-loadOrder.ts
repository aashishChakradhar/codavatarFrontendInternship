import { fetchItems } from "@/redux/order/orderNextSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { activateToast } from "@/redux/toast/toastSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useLoadOrder = () => {
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.item.status)

  useEffect(() => {
    if (status !== "idle") return

    dispatch(
      activateToast({
        toastId: "load-items",
        status: "loading",
        message: "Loading Orders...",
      })
    )
    const loadOrder = async () => {
      try {
        const result = await dispatch(fetchItems())
        if (fetchItems.fulfilled.match(result)) {
          dispatch(
            activateToast({
              toastId: "load-items",
              status: "success",
              message: "Orders Loaded.",
            })
          )
        } else if (fetchItems.rejected.match(result)) {
          const errorMessage = result.payload || "Loading menu failed"
          dispatch(
            activateToast({
              toastId: "load-items",
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

    loadOrder()
  }, [dispatch, status])
}

export default useLoadOrder
