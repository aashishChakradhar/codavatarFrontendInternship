import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { clearOrderTemp, confirmOrder } from "@/redux/order/orderSlice"
import { type AppDispatch, type RootState } from "@/redux/store"
import { resetTableData } from "@/redux/table/tableSlice"
import { useDispatch, useSelector } from "react-redux"

interface OpenStateInterface {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfirmOrder({ open, onOpenChange }: OpenStateInterface) {
  const { orders, orderTemp } = useSelector((state: RootState) => state.order)
  const table = useSelector((state: RootState) => state.table.selectedTable)
  const dispatch = useDispatch<AppDispatch>()

  const handleOrder = () => {
    console.log(`handle order`)
    dispatch(
      confirmOrder({
        orderList: orderTemp,
        table: table.number,
        section: table.sectionId,
      })
    )
    orderTemp.map((orderT) => {
      console.log(`
        Tname:${orderT.name}
        Tprice:${orderT.price}
        table:${table.number},
        section:${table.sectionId},
        `)
    })
    console.log("order")
    orders.map((orderL) => {
      console.log(`
        name:${orderL.name}
        price:${orderL.price}
        table:${orderL.table}
        section:${orderL.section}
        `)
    })
    dispatch(clearOrderTemp())
    dispatch(resetTableData())
  }
  const hasTable: boolean = table.number !== 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {!hasTable ? (
            <>
              <AlertDialogTitle className="font-bold">
                Select Table First?
              </AlertDialogTitle>
              <AlertDialogDescription className="flex flex-col text-left">
                <span>Please select table before proceeding</span>
              </AlertDialogDescription>
            </>
          ) : (
            <>
              <AlertDialogTitle className="font-bold">
                Confirm Order?
              </AlertDialogTitle>
              <AlertDialogDescription className="flex flex-col text-left">
                <span>Place order for given details:</span>
                <span className="font-bold">
                  Section: {table.section.name.toUpperCase()}
                </span>
                <span className="font-bold">Table: {table.number}</span>
              </AlertDialogDescription>
            </>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {hasTable ? <span>Cancel</span> : <span>Select Table</span>}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleOrder} disabled={!hasTable}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
