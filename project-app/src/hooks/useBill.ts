import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { _createBill, fetchBills } from "@/redux/bill/billSlice"
import { activateToast } from "@/redux/toast/toastSlice"
import { updateOrderStatus } from "@/redux/order/orderSlice"

export default function useBill() {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const orderTemp = useSelector((state: RootState) => state.order.orderTemp)

  async function createBill(
    fullName: string,
    phoneNumber: string,
    payMethod: string
  ) {
    if (!orderTemp || orderTemp.length === 0) return

    for (const ot of orderTemp) {
      try {
        await dispatch(
          _createBill({
            customer_name: fullName,
            customer_contact: phoneNumber,
            payment_method: payMethod,
            order_id: ot.id,
            table_id: ot.table?.id ?? "",
            user_id: String(currentUser?.userId ?? ""),
          })
        )

        await dispatch(
          updateOrderStatus({ orderId: ot.id, updateStatus: "in_progress" })
        )

        dispatch(
          activateToast({
            toastId: "create-bill",
            status: "success",
            message: "Bill Saved...",
          })
        )
      } catch (err) {
        dispatch(
          activateToast({
            toastId: "create-bill-fail",
            status: "error",
            message: "Failed saving bill...",
          })
        )
      }
    }
  }

  async function readBill() {
    try {
      await dispatch(fetchBills())
      dispatch(
        activateToast({
          toastId: "create-bill",
          status: "success",
          message: "Bill Saved...",
        })
      )
    } catch (err) {
      dispatch(
        activateToast({
          toastId: "create-bill-fail",
          status: "error",
          message: "Failed saving bill...",
        })
      )
    }
  }

  return { createBill, readBill }
}
