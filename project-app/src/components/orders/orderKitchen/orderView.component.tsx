import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { orderStateColor, type OrderStateType } from "@/constants/constants"
import type { OrderDataInterface } from "@/data/orderData"
import { changeOrderState } from "@/redux/order/orderSlice"
import type { AppDispatch } from "@/redux/store"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { ConfirmChange } from "../orderRestro/changeOrder"

export function OrderKitchenComponent({
  orderId,
  items,
  states,
  group,
}: {
  orderId: number
  items: OrderDataInterface[]
  states: OrderStateType[]
  group: "order" | "items"
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
    <Card className="relative mx-auto w-full max-w-xs">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>
            {group === "order" ? <> Order: {orderId}</> : <>Item: {orderId}</>}
          </CardTitle>
          <Badge variant="secondary">Items: x{items.length}</Badge>
        </div>

        <CardDescription>
          {items.map((item) => (
            <div className="flex items-center justify-between">
              <div>
                {item.name} x{item.quantity}
              </div>
              <DropdownMenu key={item.itemId}>
                <DropdownMenuTrigger asChild>
                  <Button
                    className={`${orderStateColor(item.state)} rounded-sm`}
                  >
                    {item.state}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {states.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => handleClick(item, s)}
                      hidden={s === item.state}
                    >
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </CardDescription>
      </CardHeader>
      {/* <CardFooter className="flex flex-col gap-2">
        {items.map((order) => (
          <DropdownMenu key={order.itemId}>
            <DropdownMenuTrigger asChild>
              <Button className={`${orderStateColor(order.state)} w-full`}>
                {order.name} - {order.state}
                <span className="sr-only">{order.state}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {states.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => handleClick(order, s)}
                  hidden={s === order.state}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </CardFooter> */}
      <ConfirmChange
        open={open}
        onOpenChange={setOpen}
        state={selectedState ?? "pending"}
        onConfirm={handleConfirm}
      />
    </Card>
  )
}

export function CardImage() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  )
}
