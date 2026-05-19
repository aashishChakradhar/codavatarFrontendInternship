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
import { type AppDispatch, type RootState } from "@/redux/store"

import { useDispatch, useSelector } from "react-redux"
import image from "../../assets/react.svg"
import type { DishDBInterface } from "@/redux/menu/menuSlice"
import { addItem, removeItem } from "@/redux/items/itemsSlice"

export function MenuCardComponent(dish: DishDBInterface) {
  const count = useSelector((state: RootState) => {
    const found = state.item.createItemData.find(
      (entry) => entry.dish_id === dish.id
    )
    return found?.quantity ?? 0
  })
  const order = useSelector((state: RootState) => state.order.order)
  const dispatch = useDispatch<AppDispatch>()

  const handleReduce = () => {
    dispatch(
      removeItem({
        quantity: 1,
        quantity_type: dish.dish_type,
        remark: "",
        status: "pending",
        order_id: order?.id,
        dish_id: dish.id,
        dish: dish,
      })
    )
  }

  const handleIncrease = () => {
    dispatch(
      addItem({
        quantity: 1,
        quantity_type: dish.dish_type,
        remark: "",
        status: "pending",
        order_id: order?.id,
        dish_id: dish.id,
        dish: dish,
      })
    )
  }

  return (
    <Card className="relative h-full w-45 gap-3 pt-0 pb-3 md:w-54 lg:w-60">
      <img
        src={image}
        alt="menu image"
        className="relative aspect-video w-full object-contain"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Rs. {dish.price}</Badge>
        </CardAction>
        <CardTitle>{dish.name}</CardTitle>
        <CardDescription>{dish.dish_type}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto justify-center gap-3">
        <Button onClick={handleReduce} className="rounded-md">
          -
        </Button>
        {count}
        <Button onClick={handleIncrease} className="rounded-md">
          +
        </Button>
      </CardFooter>
    </Card>
  )
}
