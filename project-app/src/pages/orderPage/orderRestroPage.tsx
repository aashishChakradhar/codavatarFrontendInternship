import OrderRestro from "@/components/orders/orderRestro"
import useLoadOrder from "@/hooks/use-loadOrder"

export default function OrderPage() {
  useLoadOrder()
  return (
    <>
      <OrderRestro />
    </>
  )
}
