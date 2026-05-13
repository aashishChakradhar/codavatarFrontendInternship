import { useSelector } from "react-redux"
import { ViewOrderComponent } from "./viewOrder.component"
import { type RootState } from "@/redux/store"
import { useEffect, useState } from "react"
import { type OrderListInterface } from "@/redux/order/orderNextSlice"

function OrderRestro() {
  const orders = useSelector((state: RootState) => state.item.orders ?? [])
  const user = useSelector((state: RootState) => state.user.currentUser)
  if (!user) return

  const [availableOrders, setAvailableOrders] = useState<OrderListInterface[]>(
    []
  )

  //provide menu state append option as per user role
  useEffect(() => {
    if (user.isAdmin) {
      setAvailableOrders(orders)
      return
    }

    if (user.role === "waiter") {
      setAvailableOrders(
        orders.filter((order) =>
          order.items.some((item) => item.status === "ready")
        )
      )
      return
    }

    if (user.role === "receptionist") {
      setAvailableOrders(
        orders.filter((order) =>
          order.items.some((item) =>
            ["in-progress", "ready", "delivered", "cancelled"].includes(
              item.status
            )
          )
        )
      )
      return
    }

    setAvailableOrders([])
  }, [user.isAdmin, user.role, orders])

  return <ViewOrderComponent orders={availableOrders} />
}

export default OrderRestro
