import OrderRestro from "@/components/orders/orderRestro"
import OrderKitchen from "@/components/orders/orderKitchen"
import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

export default function OrderPage() {
  const user = useSelector((state: RootState) => state.user)
  return (
    <>
      {user.role === "restro" && <OrderRestro />}
      {user.role === "kitchen" && <OrderKitchen />}
    </>
  )
}
