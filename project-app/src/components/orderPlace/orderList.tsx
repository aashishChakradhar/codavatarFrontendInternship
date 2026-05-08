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
import { Button } from "../ui/button"
import { addItem, removeItem } from "@/redux/order/orderSlice"

export function OrderList() {
  const dispatch = useDispatch<AppDispatch>()
  const { orderTemp } = useSelector((state: RootState) => state.order)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SN</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          {/* <TableHead className="text-right">Amount</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderTemp.map((invoice, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="font-medium">{invoice.name}</TableCell>
            <TableCell>Rs. {invoice.price}</TableCell>
            <TableCell>
              <Button
                className="mr-1 h-0 rounded-sm p-2"
                onClick={() =>
                  dispatch(
                    removeItem({
                      itemId: invoice.itemId,
                      name: invoice.name,
                      quantity: 1,
                      price: invoice.price,
                    })
                  )
                }
              >
                -
              </Button>
              {invoice.quantity}
              <Button
                className="ml-1 h-0 rounded-sm p-2"
                onClick={() =>
                  dispatch(
                    addItem({
                      itemId: invoice.itemId,
                      name: invoice.name,
                      quantity: 1,
                      price: invoice.price,
                    })
                  )
                }
              >
                +
              </Button>
            </TableCell>
            {/* <TableCell>Rs. {invoice.amount}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      {/* {listedOrders.totalAmount > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              Rs. {listedOrders.totalAmount}
            </TableCell>
          </TableRow>
        </TableFooter>
      )} */}
    </Table>
  )
}
