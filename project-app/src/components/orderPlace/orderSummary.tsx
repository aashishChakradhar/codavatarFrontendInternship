import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined"

import { OrderList } from "./orderList"
import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "@/redux/store"
import { useEffect, useState } from "react"

import ChairIcon from "@mui/icons-material/Chair"
import { SelectTable } from "./orderTableSelect"
import { ConfirmOrder } from "./confirmOrder"
import { fetchTable } from "@/redux/table/tableSlice"

// export function DrawerWithSides() {
function PlaceOrder() {
  const { tables, status } = useSelector((state: RootState) => state.table)
  const { orderTemp } = useSelector((state: RootState) => state.order)

  const [open, setOpen] = useState<boolean>(false)
  const [orderOpen, setOrderOpen] = useState<boolean>(false)
  const hasOrder: boolean = orderTemp.length !== 0

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTable())
    }
  }, [dispatch, status])

  if (status === "pending") {
    return <div className="text-sm">Loading tables...</div>
  }

  if (status === "failed") {
    return <div className="text-sm text-red-500">Error loading tables</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Drawer direction={"right"} open={orderOpen} onOpenChange={setOrderOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="capitalize">
            <ShoppingBagOutlinedIcon />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="data-[vaul-drawer-direction=top]:max-h-[90vh]">
          <DrawerHeader className="">
            <DrawerTitle className="mb-2 flex justify-between text-center">
              <span>Order Summary</span>
              <Button variant="ghost" onClick={() => setOrderOpen(false)}>
                X
              </Button>
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Select Table
            </DrawerDescription>
            <div className="flex items-center gap-2">
              <ChairIcon fontSize="small" />
              <SelectTable tables={tables} />
            </div>
          </DrawerHeader>

          <div className="no-scrollbar overflow-y-auto">
            <OrderList />
          </div>

          <DrawerFooter>
            <Button onClick={() => setOpen(true)} disabled={!hasOrder}>
              Place Order
            </Button>
            <ConfirmOrder open={open} onOpenChange={setOpen} />

            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default PlaceOrder
