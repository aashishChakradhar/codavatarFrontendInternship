import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { orderStateColor } from "./viewOrder.container"
import { useState } from "react"
import { ConfirmChange } from "./changeOrder"
import type { OrderDataInterface } from "@/data/orderData"

export function ViewOrderComponent({
  orders,
  states,
}: {
  orders: OrderDataInterface[]
  states: OrderStateType[]
}) {
  const user = useSelector((state: RootState) => state.user)

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
              {user.role === "restro" ? (
                <Button
                  className={`${orderStateColor(order.state)}`}
                  onClick={() => handleClick(order, "delivered")}
                >
                  {order.state}
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className={`${orderStateColor(order.state)}`}>
                      {order.state}
                      <span className="sr-only">{order.state}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {states.map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => handleClick(order, s)}
                      >
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
