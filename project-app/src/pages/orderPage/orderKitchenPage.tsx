import OrderKitchen from "@/components/orders/orderKitchen"
import useOrder from "@/hooks/useOrder"
import { useEffect } from "react"

export default function OrderPage() {
  const [, readOrder] = useOrder()

  useEffect(() => {
    void readOrder()
  }, [readOrder])

  return <OrderKitchen />
}
