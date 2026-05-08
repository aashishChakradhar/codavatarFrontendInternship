import { useDispatch, useSelector } from "react-redux"
import { OrderComponent } from "./viewOrder.component"
import { type AppDispatch, type RootState } from "@/redux/store"
import { fetchOrder, type OrderProp } from "@/redux/order/orderSlice"
import { useEffect, useState } from "react"
import { orderState, type OrderStateProp } from "@/redux/constants/constants"

export function orderStateColor(state: OrderStateProp) {
  switch (state) {
    case "pending":
      return `bg-gray-700 `
    case "preparing":
      return `bg-blue-400 `
    case "completed":
      return `bg-yellow-400 `
    case "delivered":
      return `bg-green-400 `
    case "cancelled":
      return `bg-red-400 `
  }
}

function ViewOrder() {
  const dispatch = useDispatch<AppDispatch>()
  const orders = useSelector((state: RootState) => state.order.orders)
  const user = useSelector((state: RootState) => state.user)

  const [availableOrders, setAvailableOrders] = useState<OrderProp[]>([])
  const [availableState, setAvailableState] = useState<OrderStateProp[]>([
    ...orderState,
  ])
  useEffect(() => {
    dispatch(fetchOrder())
  }, [dispatch])

  //filter order
  useEffect(() => {
    if (user.isAdmin) {
      setAvailableState([...orderState])
    }
    if (user.role === "restro") {
      setAvailableState(["delivered"])
    } else if (user.role === "kitchen") {
      setAvailableState(["preparing", "completed"])
    } else if (user.role === "reception") {
      setAvailableState(["preparing", "completed", "delivered", "cancelled"])
    }
  }, [user.isAdmin, user.role])

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

    if (user.role === "kitchen") {
      setAvailableOrders(
        orders.filter(
          (order) => order.state === "preparing" || order.state === "pending"
        )
      )
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

  return <OrderComponent orders={availableOrders} states={availableState} />
}

export default ViewOrder
