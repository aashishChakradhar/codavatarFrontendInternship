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
import { OrderCheckoutComponent } from "./orderCheckout.component"

const groupOptions = ["order", "table"] as const
export type GroupType = (typeof groupOptions)[number]

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

function groupOrder({
  orders,
  removedOrder,
}: {
  orders: OrderInterface[]
  removedOrder: string[]
}) {
  if (!Array.isArray(orders) || orders.length === 0) return []

  // Filter out orders with removed statuses, then sort by order id
  const filtered = orders.filter((o) => !removedOrder.includes(o.status))
  return [...filtered].sort((a, b) => String(a.id).localeCompare(String(b.id)))
}

function groupTable({
  orders,
  removedOrder,
}: {
  orders: OrderInterface[]
  removedOrder: string[]
}) {
  if (!Array.isArray(orders) || orders.length === 0) return []

  // Sort orders alphabetically by order id first
  const filtered = orders.filter((o) => !removedOrder.includes(o.status))
  const sortedOrders = [...filtered].sort((a, b) =>
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

export default function OrderCheckout() {
  const orders = useSelector((state: RootState) => state.order.orders)
  const [groupBy, setGroupBy] = useState<GroupType>("table")
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
      setProcessedData(
        groupOrder({ orders: orders, removedOrder: ["in_progress"] })
      )
    } else if (groupBy === "table") {
      setProcessedData(
        groupTable({ orders: orders, removedOrder: ["in_progress"] })
      )
    }
  }, [orders, groupBy])

  return (
    <div className="flex flex-col gap-10">
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
              {groupOptions.map((group, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleGroupChange(group)}
                >
                  {group}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {processedData.map((order) => (
          <OrderCheckoutComponent
            key={order.id}
            order={order}
            groupBy={groupBy}
          />
        ))}
      </div>
    </div>
  )
}
