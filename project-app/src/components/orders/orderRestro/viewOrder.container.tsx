import { useSelector } from "react-redux"
import { ViewOrderComponent } from "./viewOrder.component"
import { type RootState } from "@/redux/store"
import { useEffect, useMemo, useState } from "react"
import type { ItemStatusType } from "@/redux/items/itemsSlice"

function OrderRestro() {
  const orders = useSelector((state: RootState) => state.order.orders ?? [])
  const items = useSelector((state: RootState) => state.item.items ?? [])
  const user = useSelector((state: RootState) => state.user.currentUser)
  if (!user) return null

  const [disabledStatus, setDisabledStatus] = useState<ItemStatusType[]>([])
  const [inactiveStatus, setInactiveStatus] = useState<ItemStatusType[]>([])

  useEffect(() => {
    if (user.isAdmin) {
      setInactiveStatus([])
      setDisabledStatus([])
    } else if (user.role === "chef") {
      setInactiveStatus([])
      setDisabledStatus([])
    } else if (user.role === "receptionist") {
      setInactiveStatus([])
      setDisabledStatus([])
    } else if (user.role === "waiter") {
      setInactiveStatus([])
      setDisabledStatus([])
    }
  }, [user.isAdmin, user.role, orders, items])

  const filteredOrders = useMemo(() => {
    // merge item statuses from the items slice into the orders so UI reflects optimistic updates
    const ordersWithLatestItems = orders.map((order) => ({
      ...order,
      items: (order.items ?? []).map((it) => {
        const updated = items.find((i) => i.id === it.id)
        return updated ? { ...it, status: updated.status } : it
      }),
    }))

    if (user.isAdmin) return ordersWithLatestItems
    if (user.role === "waiter") return ordersWithLatestItems

    if (user.role === "receptionist") {
      return ordersWithLatestItems.filter((order) =>
        order.items.some((item) =>
          ["in-progress", "ready", "delivered", "cancelled"].includes(
            item.status
          )
        )
      )
    }

    return []
  }, [user.isAdmin, user.role, orders, items])

  return (
    <ViewOrderComponent
      orders={filteredOrders}
      disabledStatus={disabledStatus}
      inactiveStatus={inactiveStatus}
    />
  )
}

export default OrderRestro
