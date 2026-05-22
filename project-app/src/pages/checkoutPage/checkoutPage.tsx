import OrderCheckout from "@/components/orders/orderCheckout"
import useOrder from "@/hooks/useOrder"
import { useEffect } from "react"

export default function CheckoutPage() {
  const [, readOrder] = useOrder()

  useEffect(() => {
    void readOrder()
  }, [readOrder])

  return (
    <>
      <OrderCheckout />
    </>
  )
}
