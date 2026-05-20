import OrderKitchen from "@/components/orders/orderKitchen"
import useLoadOrder from "@/hooks/use-loadOrder"

export default function OrderPage() {
  useLoadOrder()
  return <OrderKitchen />
}
