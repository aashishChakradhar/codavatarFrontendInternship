import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  orderStatus,
  type OrderInterface,
  type OrderStatusType,
  updateOrderItemStatus,
} from "@/redux/order/orderSlice"
import {
  updateOptimisticItemStatus,
  type ItemInterface,
  type ItemStatusType,
} from "@/redux/items/itemsSlice"
import type { GroupType } from "./orderView.container"
import { ItemRow } from "./itemRow"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import useUpdateItem from "@/hooks/use-updateItem"

export function OrderCardComponent({
  order,
  groupBy,
}: {
  order: OrderInterface
  groupBy: GroupType
}) {
  const [displayTitle, setDisplayTitle] = useState<string>("")
  const [orderStat, setOrderStat] = useState<OrderStatusType>("pending")
  const disabledOrderStatus = [
    "open",
    "idle",
    "pending",
    "delivered",
    "cancelled",
  ]
  const disabledItemStatus = ["pending", "delivered", "cancelled"]

  const handleOrderStatusUpdate = (statChange: OrderStatusType) => {
    setOrderStat(statChange)
  }

  const dispatch = useDispatch<AppDispatch>()
  const { updateItem } = useUpdateItem()

  const applyItemStatusOptimistically = (
    item: ItemInterface,
    statusUpdate: ItemStatusType
  ) => {
    const backendIds = item.backendIds?.length ? item.backendIds : [item.id]

    backendIds.forEach((itemID) => {
      dispatch(updateOrderItemStatus({ itemID, status: statusUpdate }))
      dispatch(
        updateOptimisticItemStatus({
          item: { ...item, id: itemID },
          status: statusUpdate,
        })
      )
    })
  }

  // Group items by order id if present
  const itemsByOrder =
    groupBy !== "order"
      ? order.items.reduce(
          (acc, item) => {
            const orderId = (item as any).orderId ?? "ungrouped"
            if (!acc[orderId]) acc[orderId] = []
            acc[orderId].push(item)
            return acc
          },
          {} as Record<string, OrderInterface["items"]>
        )
      : undefined

  useEffect(() => {
    groupBy === "order"
      ? setDisplayTitle(`Order: ${order.id}`)
      : groupBy === "table"
        ? setDisplayTitle(
            `Table: ${order.table?.section.name}-${order.table?.number}`
          )
        : setDisplayTitle(`Dish: ${order.items[0]?.dish.name ?? "Unknown"}`)
  }, [groupBy, order.items])

  const handleItemStatusUpdate = ({
    item,
    statusUpdate,
  }: {
    item: ItemInterface
    statusUpdate: ItemStatusType
  }) => {
    //backend
    updateItem(item, statusUpdate)
    // ui
    applyItemStatusOptimistically(item, statusUpdate)
  }

  return (
    <Card
      size="sm"
      className="w-full max-w-sm sm:max-w-80 lg:max-w-sm xl:max-w-sm"
    >
      <CardHeader>
        <CardTitle className="max-w-80 overflow-hidden font-semibold text-ellipsis whitespace-nowrap">
          {displayTitle}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {itemsByOrder
          ? Object.entries(itemsByOrder).map(([orderId, items]) => (
              <div key={orderId} className="mb-3 border-b pb-2 last:border-b-0">
                {/* Order group */}
                <div className="mb-1 max-w-60 overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-gray-600">
                  Order: {orderId}
                </div>
                {/* items group */}
                {items.map((item) => (
                  <ItemRow
                    key={`${order.id}-${item.id}`}
                    item={item}
                    disabledItemStatus={disabledItemStatus}
                    onStatusChange={handleItemStatusUpdate}
                  />
                ))}
              </div>
            ))
          : order.items.map((item) => (
              <ItemRow
                key={`${order.id}-${item.id}`}
                item={item}
                disabledItemStatus={disabledItemStatus}
                onStatusChange={handleItemStatusUpdate}
              />
            ))}
      </CardContent>
      <CardFooter className="mt-auto w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full" size="sm">
              {orderStat}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Order Status</DropdownMenuLabel>
              {orderStatus.map((stat, index) => (
                <DropdownMenuItem
                  key={`${stat}-${index}`}
                  onClick={() => handleOrderStatusUpdate(stat)}
                  hidden={disabledOrderStatus.includes(stat)}
                >
                  {stat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
