import Billing from "@/components/billingPage"
import useBill from "@/hooks/useBill"
import { useEffect } from "react"

export default function BillingPage() {
  const { readBill } = useBill()

  useEffect(() => {
    void readBill()
  }, [readBill])

  return (
    <>
      <Billing />
    </>
  )
}
