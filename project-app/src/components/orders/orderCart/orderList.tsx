import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type AppDispatch, type RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../../ui/button"
import {
  addItem,
  removeItem,
  type CreateItemInterface,
} from "@/redux/items/itemsSlice"

export function OrderList() {
  const dispatch = useDispatch<AppDispatch>()
  const itemTable = useSelector((state: RootState) => state.item.createItemData)
  const order = useSelector((state: RootState) => state.order.order)
  const handleReduce = (dish: CreateItemInterface) => {
    dispatch(
      removeItem({
        quantity: 1,
        quantity_type: dish.quantity_type,
        remark: "",
        status: "pending",
        order_id: order?.id,
        dish_id: dish.dish_id,
      })
    )
  }
  const handleIncrease = (dish: CreateItemInterface) => {
    dispatch(
      addItem({
        quantity: 1,
        quantity_type: dish.quantity_type,
        remark: "",
        status: "pending",
        order_id: order?.id,
        dish_id: dish.dish_id,
      })
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itemTable.map((entry, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="font-medium">{entry.dish.name}</TableCell>
            <TableCell>Rs. {entry.dish.price}</TableCell>
            <TableCell>
              <Button
                className="mr-1 h-0 rounded-sm p-2"
                onClick={() => handleReduce(entry)}
              >
                -
              </Button>
              {entry.quantity}
              <Button
                className="ml-1 h-0 rounded-sm p-2"
                onClick={() => handleIncrease(entry)}
              >
                +
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
