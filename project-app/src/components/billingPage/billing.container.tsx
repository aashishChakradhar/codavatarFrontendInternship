import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import { BillingComponent } from "./billing.component"
import useBill from "@/hooks/useBill"
import { activateToast } from "@/redux/toast/toastSlice"
import { useNavigate } from "react-router-dom"

export default function Billing() {
  const orderTemp = useSelector((state: RootState) => state.order.orderTemp)
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [discountOption, setDiscountOption] = useState<string>("Rs")
  const { createBill } = useBill()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const flatItems = useMemo(() => {
    const items = orderTemp?.flatMap((invoice) => invoice.items ?? []) ?? []
    return items
      .slice()
      .sort((a, b) =>
        String((a as any)?.dish?.name ?? a.id).localeCompare(
          String((b as any)?.dish?.name ?? b.id)
        )
      )
  }, [orderTemp])

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

  useEffect(() => {
    if (orderTemp && orderTemp.length > 0) return

    dispatch(
      activateToast({
        toastId: "order-notselected-error",
        status: "error",
        message: "Select Order First",
      })
    )
    navigate("/checkout")
  }, [dispatch, navigate, orderTemp])

  const handleCheckout = useCallback(
    (fullName: string, phoneNumber: string, payMethod: string) => {
      void createBill(fullName, phoneNumber, payMethod)
    },
    [createBill]
  )

  if (!orderTemp || orderTemp.length === 0) return null

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
