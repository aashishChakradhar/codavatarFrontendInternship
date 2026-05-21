import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { useCallback, useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import { BillingComponent } from "./billing.component"
export default function Billing() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const orderTemp = useSelector((state: RootState) => state.order.orderTemp)

  if (!orderTemp || orderTemp.length === 0) return <div>No items to bill</div>
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [discountOption, setDiscountOption] = useState<string>("Rs")

  const flatItems = useMemo(
    () => orderTemp.flatMap((invoice) => invoice.items ?? []),
    [orderTemp]
  )

  const totalAmount = useMemo(() => {
    return flatItems.reduce((sum, content) => {
      const price = (content.dish as any)?.price ?? 0
      const qty = Number(content.quantity ?? 0)
      return sum + price * qty
    }, 0)
  }, [flatItems])

  const handleDiscountAmount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value ?? "0"
      const parsed = Number(raw) || 0
      setDiscountValue(parsed)
    },
    []
  )

  const discountAmount = useMemo(() => {
    const parsed = Number(discountValue) || 0
    if (discountOption === "%") {
      return (totalAmount * parsed) / 100
    }
    return parsed
  }, [discountValue, discountOption, totalAmount])

  const discounted = useMemo(
    () => Math.max(0, totalAmount - discountAmount),
    [totalAmount, discountAmount]
  )

  const handleCheckout = useCallback(
    (fullName: string, phoneNumber: string, payMethod: string) => {
      orderTemp.map((ot) =>
        console.log(
          `fullName: ${fullName}
        \nphone: ${phoneNumber}
        \npaid:${totalAmount}-${payMethod}
        \norderId:${ot.id}
        \ncurrent:${currentUser?.userId}
        \ntable:${ot.table?.id}
        `
        )
      )
    },
    []
  )

  return (
    <div className="flex flex-col">
      Container orderId:
      {orderTemp?.map((ot) => (
        <div key={ot.id}>{ot.id}</div>
      ))}
      <BillingComponent
        flatItems={flatItems}
        totalAmount={totalAmount}
        discountOption={discountOption}
        setDiscountOption={setDiscountOption}
        discountValue={discountValue}
        handleDiscountAmount={handleDiscountAmount}
        discounted={discounted}
        handleCheckout={handleCheckout}
      />
    </div>
  )
}
