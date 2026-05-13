import { useDispatch, useSelector } from "react-redux"
import { OrderKitchenComponent } from "./orderView.component"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchOrder } from "@/redux/order/orderSlice"
import { useEffect, useState } from "react"
import type { OrderDataInterface } from "@/data/orderData"
import { orderState, type OrderStateType } from "@/constants/constants"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function orderArrange(orderList: OrderDataInterface[]) {
  const grouped: Record<number, OrderDataInterface[]> = {}

  orderList.forEach((order) => {
    if (!grouped[order.orderId]) {
      grouped[order.orderId] = []
    }
    grouped[order.orderId].push(order)
  })

  return Object.entries(grouped).map(([orderId, items]) => ({
    [Number(orderId)]: items,
  }))
}

function itemArrange(orderList: OrderDataInterface[]) {
  const grouped: Record<number, OrderDataInterface[]> = {}

  orderList.forEach((order) => {
    if (!grouped[order.itemId]) {
      grouped[order.itemId] = []
    }
    grouped[order.itemId].push(order)
  })

  return Object.entries(grouped).map(([itemId, items]) => ({
    [Number(itemId)]: items,
  }))
}

function OrderKitchen() {
  const dispatch = useDispatch<AppDispatch>()
  const { orders, status, error } = useSelector(
    (state: RootState) => state.order
  )
  const user = useSelector((state: RootState) => state.user.currentUser)
  if (!user) return

  const [availableOrders, setAvailableOrders] = useState<OrderDataInterface[]>(
    []
  )
  const [availableOrdersState, setAvailableState] = useState<OrderStateType[]>([
    ...orderState,
  ])
  const [groupBy, setGroupBy] = useState<"order" | "items">("order")
  const [arrangedOrder, setArrangedOrder] = useState<
    { [key: number]: OrderDataInterface[] }[]
  >([])

  //fetch order data
  useEffect(() => {
    if (status === "idle") dispatch(fetchOrder())
  }, [dispatch, status])

  //assign order state
  useEffect(() => {
    if (user.isAdmin) {
      setAvailableState([...orderState])
    }
    if (user.role === "chef") {
      setAvailableState(["preparing", "completed"])
    }
  }, [user.isAdmin, user.role])

  // filter perticular available orders
  useEffect(() => {
    if (user.isAdmin) {
      setAvailableOrders([...orders])
      setArrangedOrder(orderArrange(orders))
    }
    if (user.role === "chef") {
      const filteredOrders = orders.filter(
        (order) => order.state === "preparing" || order.state === "pending"
      )
      setAvailableOrders(filteredOrders)
      setArrangedOrder(orderArrange(filteredOrders))
    }
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

  const onArrangeOrder = () => {
    setGroupBy("order")
    setArrangedOrder(orderArrange(availableOrders))
  }

  const onArrangeItems = () => {
    setGroupBy("items")
    setArrangedOrder(itemArrange(availableOrders))
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Sort</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onArrangeOrder}>
              By Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onArrangeItems}>
              By Items
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-row flex-wrap items-start justify-around gap-5">
        {arrangedOrder.map((group) => {
          const [groupId, items] = Object.entries(group)[0]
          return (
            <OrderKitchenComponent
              key={groupId}
              orderId={Number(groupId)}
              items={items}
              states={availableOrdersState}
              group={groupBy}
            />
          )
        })}
      </div>
    </>
  )
}
export default OrderKitchen
