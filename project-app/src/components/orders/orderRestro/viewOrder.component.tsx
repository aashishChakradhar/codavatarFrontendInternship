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
import { ConfirmChange } from "./changeOrder"
import type { OrderDataInterface } from "@/data/orderData"

export function ViewOrderComponent({
  orders,
}: {
  orders: OrderDataInterface[]
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderDataInterface | null>(
    null
  )
  const [selectedState, setSelectedState] = useState<OrderStateType | null>(
    null
  )

  const dispatch = useDispatch<AppDispatch>()

  const handleClick = (order: OrderDataInterface, state: OrderStateType) => {
    setSelectedOrder(order)
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
        {orders.map((order, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{order.name}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>
              {order.section}-{order.table}
            </TableCell>
            <TableCell className="text-center">
              <Button
                className={`${orderStateColor(order.state)}`}
                onClick={() => handleClick(order, "delivered")}
              >
                {order.state}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <ConfirmChange
        open={open}
        onOpenChange={setOpen}
        state={selectedState ?? "pending"}
        onConfirm={handleConfirm}
      />
    </Table>
  )
}
