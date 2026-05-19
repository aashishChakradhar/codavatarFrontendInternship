import { fetchAllOrders } from "@/redux/order/orderSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { activateToast } from "@/redux/toast/toastSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useLoadOrder = () => {
  const dispatch = useDispatch<AppDispatch>()
  const orders = useSelector((state: RootState) => state.order.orders)

  useEffect(() => {
    if (orders && orders.length > 0) return

    const loadOrder = async () => {
      try {
        const result = await dispatch(fetchAllOrders())
        if (fetchAllOrders.pending.match(result)) {
          dispatch(
            activateToast({
              toastId: "load-items",
              status: "loading",
              message: "Loading Orders...",
            })
          )
        } else if (fetchAllOrders.fulfilled.match(result)) {
          dispatch(
            activateToast({
              toastId: "load-items",
              status: "success",
              message: "Orders Loaded.",
            })
          )
        } else if (fetchAllOrders.rejected.match(result)) {
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
  }, [dispatch, orders])
}

export default useLoadOrder
