import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type AppDispatch, type RootState } from "@/redux/store"

import { useDispatch, useSelector } from "react-redux"
import { addItem, removeItem } from "@/redux/order/orderSlice"
import image from "../../assets/react.svg"
import type { MenuDataInterface } from "@/redux/menu/menuSlice"

export function MenuCardComponent(item: MenuDataInterface) {
  const count = useSelector((state: RootState) => {
    const order = state.order.orderTemp.find(
      (order) => order.itemId === item.id
    )
    return order?.quantity ?? 0
  })
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Card className="relative w-45 gap-3 pt-0 pb-3">
      <img
        src={image}
        alt="Event cover"
        className="relative aspect-video w-full object-contain"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Rs. {item.price}</Badge>
        </CardAction>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardFooter className="justify-center gap-3">
        <Button
          onClick={() =>
            dispatch(
              removeItem({
                itemId: item.id,
                name: item.name,
                quantity: 1,
                price: item.price,
              })
            )
          }
          className="rounded-md"
        >
          -
        </Button>
        {count}
        <Button
          onClick={() =>
            dispatch(
              addItem({
                itemId: item.id,
                name: item.name,
                quantity: 1,
                price: item.price,
              })
            )
          }
          className="rounded-md"
        >
          +
        </Button>
      </CardFooter>
    </Card>
  )
}
