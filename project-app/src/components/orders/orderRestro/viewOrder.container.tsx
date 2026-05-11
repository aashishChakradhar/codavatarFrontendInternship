import { useDispatch, useSelector } from "react-redux"
import { ViewOrderComponent } from "./viewOrder.component"
import { type AppDispatch, type RootState } from "@/redux/store"
import { fetchOrder } from "@/redux/order/orderSlice"
import { useEffect, useState } from "react"
import { orderState, type OrderStateType } from "@/constants/constants"
import type { OrderDataInterface } from "@/data/orderData"

export function orderStateColor(state: OrderStateType) {
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

function OrderRestro() {
  const dispatch = useDispatch<AppDispatch>()
  const orders = useSelector((state: RootState) => state.order.orders)
  const user = useSelector((state: RootState) => state.user)

  const [availableOrders, setAvailableOrders] = useState<OrderDataInterface[]>(
    []
  )
  const [availableState, setAvailableState] = useState<OrderStateType[]>([
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

  return <ViewOrderComponent orders={availableOrders} states={availableState} />
}

export default OrderRestro
