import OrderRestro from "@/components/orders/orderRestro"
import useOrder from "@/hooks/useOrder"
import { useEffect } from "react"

export default function OrderPage() {
  const [, readOrder] = useOrder()

  useEffect(() => {
    void readOrder()
  }, [readOrder])

  return (
    <>
      <OrderRestro />
    </>
  )
}
