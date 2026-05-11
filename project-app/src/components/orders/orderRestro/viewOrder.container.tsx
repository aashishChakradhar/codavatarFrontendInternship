import { useDispatch, useSelector } from "react-redux"
import { ViewOrderComponent } from "./viewOrder.component"
import { type AppDispatch, type RootState } from "@/redux/store"
import { fetchOrder } from "@/redux/order/orderSlice"
import { useEffect, useState } from "react"
import type { OrderDataInterface } from "@/data/orderData"

function OrderRestro() {
  const dispatch = useDispatch<AppDispatch>()
  const { orders, status, error } = useSelector(
    (state: RootState) => state.order
  )
  const user = useSelector((state: RootState) => state.user)

  const [availableOrders, setAvailableOrders] = useState<OrderDataInterface[]>(
    []
  )
  useEffect(() => {
    dispatch(fetchOrder())
  }, [dispatch])

  //provide menu state append option as per user role
  useEffect(() => {
    if (user.isAdmin) {
      setAvailableOrders([...orders])
      return
    }

    if (user.role === "restro") {
      setAvailableOrders(orders.filter((order) => order.state === "completed"))
      return
    }

    if (user.role === "reception") {
      setAvailableOrders(
        orders.filter((order) =>
          ["preparing", "completed", "delivered", "cancelled"].includes(
            order.state
          )
        )
      )
      return
    }

    setAvailableOrders([])
  }, [user.isAdmin, user.role, orders])

  if (status === "pending") {
    return <div className="text-sm">Loading Menu...</div>
  }

  if (status === "failed") {
    return (
      <div className="text-sm text-red-500">
        Error loading Menu
        <hr />
        {error}
      </div>
    )
  }

  return <ViewOrderComponent orders={availableOrders} />
}

export default OrderRestro
