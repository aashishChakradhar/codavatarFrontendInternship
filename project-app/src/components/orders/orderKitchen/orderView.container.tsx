import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { OrderInterface } from "@/redux/order/orderSlice"
import { OrderCardComponent } from "./orderView.component"

export type GroupType = "order" | "table" | "dish"

function mergeGroupedItems(orders: OrderInterface[]) {
  const itemsByStatusAndDish = new Map<
    string,
    OrderInterface["items"][number] & { orderId?: string }
  >()

  for (const ord of orders) {
    for (const item of ord.items) {
      const dishId = (item.dish as any).id ?? item.id
      const status = item.status ?? ord.status
      const key = `${dishId}-${status}`
      const existing = itemsByStatusAndDish.get(key)

      if (existing) {
        existing.quantity = (existing.quantity ?? 0) + (item.quantity ?? 0)
        existing.backendIds = Array.from(
          new Set([...(existing.backendIds ?? []), String(item.id)])
        )
      } else {
        itemsByStatusAndDish.set(key, {
          ...item,
          id: `${dishId}-${status}`,
          backendIds: [String(item.id)],
          orderId: ord.id,
        } as OrderInterface["items"][number] & { orderId?: string })
      }
    }
  }

  return Array.from(itemsByStatusAndDish.values())
}

function groupOrder(orders: OrderInterface[]) {
  if (!Array.isArray(orders) || orders.length === 0) return []

  // Return all orders sorted alphabetically by order id

  return [...orders].sort((a, b) => String(a.id).localeCompare(String(b.id)))
}

function groupTable(orders: OrderInterface[]) {
  if (!Array.isArray(orders) || orders.length === 0) return []

  // Sort orders alphabetically by order id first
  const sortedOrders = [...orders].sort((a, b) =>
    String(a.id).localeCompare(String(b.id))
  )

  const tableMap = new Map<string, OrderInterface[]>()

  // Group sorted orders by table
  for (const ord of sortedOrders) {
    const table = ord.table
    const key =
      table?.id ??
      `${(table as any)?.section?.name ?? "unknown"}-${table?.number ?? "0"}`

    const list = tableMap.get(key) ?? []
    list.push(ord)
    tableMap.set(key, list)
  }

  // Sort table entries alphabetically by key (section-number format)
  const sortedTableEntries = Array.from(tableMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  )

  // Merge items for each table while preserving order ids
  const results: OrderInterface[] = []
  for (const [key, tableOrders] of sortedTableEntries) {
    results.push({
      id: `table-${key}`,
      items: mergeGroupedItems(tableOrders),
      status: tableOrders[0].status,
      remark: "",
      table: tableOrders[0].table ?? null,
      user: null,
    })
  }

  return results
}

function groupDish(orders: OrderInterface[]) {
  if (!Array.isArray(orders) || orders.length === 0) return []

  const dishMap = new Map<
    string,
    (OrderInterface["items"][number] & { orderId?: string })[]
  >()

  for (const ord of orders) {
    for (const it of ord.items) {
      const dishName = it.dish?.name ?? "Dish"
      const items = dishMap.get(dishName) ?? []

      items.push({
        ...it,
        orderId: ord.id,
      } as OrderInterface["items"][number] & { orderId?: string })

      dishMap.set(dishName, items)
    }
  }

  const results: OrderInterface[] = []
  for (const [dishName, items] of dishMap.entries()) {
    // Sort items by orderId, then by status
    const sortedItems = [...items].sort((a, b) => {
      const orderCmp = String(a.orderId).localeCompare(String(b.orderId))
      if (orderCmp !== 0) return orderCmp
      return String(a.status).localeCompare(String(b.status))
    })

    results.push({
      id: dishName,
      items: sortedItems,
      status: sortedItems[0]?.status ?? "pending",
      remark: "",
      table: null,
      user: null,
    })
  }

  return results
}

export default function KitchenOrderView() {
  const orders = useSelector((state: RootState) => state.order.orders)
  const [groupBy, setGroupBy] = useState<GroupType>("dish")
  const [processedData, setProcessedData] = useState<OrderInterface[]>([])

  const handleGroupChange = (group: GroupType) => {
    setGroupBy(group)
  }

  useEffect(() => {
    if (!Array.isArray(orders) || orders.length === 0) {
      setProcessedData([])
      return
    }

    if (groupBy === "order") {
      setProcessedData(groupOrder(orders))
    } else if (groupBy === "table") {
      setProcessedData(groupTable(orders))
    } else {
      setProcessedData(groupDish(orders))
    }
  }, [orders, groupBy])

  return (
    <div className="gap-5">
      <div className="flex w-full">
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto" asChild>
            <Button className="min-w-40" variant="outline">
              Group By : {groupBy.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Group Orders</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleGroupChange("table")}>
                Table
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleGroupChange("order")}>
                Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleGroupChange("dish")}>
                Dish
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {processedData.map((order) => (
          <OrderCardComponent key={order.id} order={order} groupBy={groupBy} />
        ))}
      </div>
    </div>
  )
}
