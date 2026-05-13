import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { changeOrderState } from "@/redux/order/orderSlice"
import { type OrderStateType } from "@/constants/constants"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { orderStateColor } from "@/constants/constants"
import { useState } from "react"
import type { OrderDataInterface } from "@/data/orderData"
import type {
  ItemsListInterface,
  OrderListInterface,
} from "@/redux/order/orderNextSlice"

export function ViewOrderComponent({
  orders,
}: {
  orders?: OrderListInterface[]
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderDataInterface | null>(
    null
  )
  const [selectedState, setSelectedState] = useState<OrderStateType | null>(
    null
  )

  const dispatch = useDispatch<AppDispatch>()

  const handleClick = (
    order: OrderListInterface,
    item: ItemsListInterface,
    state: OrderStateType
  ) => {
    // build an OrderDataInterface from order + item to match changeOrderState payload
    const builtOrder: OrderDataInterface = {
      orderId: Number(order.table?.number ?? 0),
      itemId: Number(item.id),
      name: item.dish?.name ?? "",
      quantity: item.quantity,
      price: (item.dish as any)?.price ?? 0,
      section:
        order.table?.section?.name ?? (order.table as any)?.section ?? "",
      table: order.table?.number ?? 0,
      state: state,
    }

    setSelectedOrder(builtOrder)
    setSelectedState(state)
    setOpen(true)
  }

  const handleConfirm = () => {
    if (selectedOrder && selectedState) {
      dispatch(
        changeOrderState({ order: selectedOrder, orderState: selectedState })
      )
    }
    setOpen(false)
    setSelectedOrder(null)
    setSelectedState(null)
  }
  const rows = (orders ?? []).flatMap((order) =>
    (order?.items ?? []).map((item) => ({ order, item }))
  )

  return (
    <Table className="mx-auto justify-center text-center md:w-9/10 lg:w-7/10">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">S.N</TableHead>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Qty</TableHead>
          <TableHead className="text-center">Location</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ order, item }, rowIndex) => (
          <TableRow
            key={`${order.table?.number ?? "x"}-${item.id}-${rowIndex}`}
          >
            <TableCell className="font-medium">{rowIndex + 1}</TableCell>
            <TableCell>{item.dish?.name ?? ""}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>
              {order.table?.section?.name ??
                order.table?.section?.id ??
                order.table?.number ??
                ""}
            </TableCell>
            <TableCell className="text-center">
              <Button
                className={orderStateColor(
                  (item as any).status?.status ?? (item as any).status
                )}
                onClick={() => handleClick(order, item, "delivered")}
              >
                {(item as any).status?.status ?? (item as any).status}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <ConfirmChange  
        open={open}
        onOpenChange={setOpen}
        state={selectedState ?? "pending"}
        onConfirm={handleConfirm}
      /> */}
    </Table>
  )
}
