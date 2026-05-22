import { useSelector } from "react-redux"
import { DashboardComponent } from "./dashboard.component"
import type { RootState } from "@/redux/store"
import type { BillInterface } from "@/redux/bill/billSlice"
import { useState, useEffect } from "react"
import useBill from "@/hooks/useBill"

function calculateTotals(raw: BillInterface[] | { bills?: BillInterface[] } | any) {
  // normalize input in case caller passed an object like { bills: [...] }
  const bills: BillInterface[] = Array.isArray(raw)
    ? raw
    : raw && Array.isArray(raw.bills)
    ? raw.bills
    : []

  if (bills.length === 0) {
    console.debug("calculateTotals: no bills or empty array", { raw, billsLength: bills.length })
    return 0
  }

  const total = bills.reduce((sum, b) => sum + (Number(b?.total_amount) || 0), 0)
  // eslint-disable-next-line no-console
  console.debug("calculateTotals: computed total", { total, billsLength: bills.length, sample: bills.slice(0, 3) })
  return total
}

function groupByPaymentMethod(bills: BillInterface[]) {
  if (!Array.isArray(bills) || bills.length === 0) return []
  const map = bills.reduce<
    Record<string, { method: string; count: number; total: number }>
  >((acc, b) => {
    const method = (b.payment_method as unknown as string) || "unknown"
    if (!acc[method]) acc[method] = { method, count: 0, total: 0 }
    acc[method].count += 1
    acc[method].total += Number(b.total_amount) || 0
    return acc
  }, {})

  return Object.values(map)
}

function filterYearly(bills: BillInterface[], thresholdYear: number) {
  if (!Array.isArray(bills) || bills.length === 0) return []
  const totalsByYear = bills.reduce<Record<number, number>>((acc, b) => {
    const date = new Date(b.billed_at)
    const year = date.getFullYear()
    if (year < thresholdYear) return acc
    acc[year] = (acc[year] || 0) + (Number(b.total_amount) || 0)
    return acc
  }, {})

  return Object.entries(totalsByYear)
    .map(([year, total]) => ({ year: Number(year), total }))
    .sort((a, b) => a.year - b.year)
}

function filterMonthly(bills: BillInterface[], year: number) {
  if (!Array.isArray(bills) || bills.length === 0) return []
  const totalsByMonth = new Array(12).fill(0)
  for (const b of bills) {
    const date = new Date(b.billed_at)
    if (date.getFullYear() !== year) continue
    const m = date.getMonth() // 0-based
    totalsByMonth[m] += Number(b.total_amount) || 0
  }
  return totalsByMonth.map((total, idx) => ({ month: idx + 1, total }))
}

function getWeekNumber(d: Date) {
  // ISO week number
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function filterWeekly(bills: BillInterface[], year: number) {
  if (!Array.isArray(bills) || bills.length === 0) return []
  const map = new Map<number, number>()
  for (const b of bills) {
    const date = new Date(b.billed_at)
    if (date.getFullYear() !== year) continue
    const week = getWeekNumber(date)
    map.set(week, (map.get(week) || 0) + (Number(b.total_amount) || 0))
  }
  return Array.from(map.entries())
    .map(([week, total]) => ({ week, total }))
    .sort((a, b) => a.week - b.week)
}

function filterDaily(bills: BillInterface[], month: number) {
  if (!Array.isArray(bills) || bills.length === 0) return []
  const year = new Date().getFullYear()
  const daysInMonth = new Date(year, month, 0).getDate()
  const totals = new Array(daysInMonth).fill(0)
  for (const b of bills) {
    const date = new Date(b.billed_at)
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month) continue
    const day = date.getDate() // 1-based
    totals[day - 1] += Number(b.total_amount) || 0
  }
  return totals.map((total, idx) => ({ day: idx + 1, total }))
}

export default function Dashboard() {
  const bills = useSelector((state: RootState) => state.bill.bills)
  const [year, setYear] = useState(new Date().getFullYear())
  const [timeframe, setTimeframe] = useState<"year" | "month" | "week" | "day">("month")
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const { readBill } = useBill()

  useEffect(() => {
    void readBill()
  }, [readBill])

  const total = calculateTotals(bills)

  function countNewCustomers(bills: BillInterface[]) {
    if (!Array.isArray(bills) || bills.length === 0) return 0
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30
    const cutoff = Date.now() - THIRTY_DAYS
    const set = new Set<string>()
    for (const b of bills) {
      const billed = new Date(b.billed_at).getTime()
      if (isNaN(billed)) continue
      if (billed >= cutoff && b.customer_phone) set.add(String(b.customer_phone))
    }
    return set.size
  }

  function countActiveAccounts(bills: BillInterface[]) {
    if (!Array.isArray(bills) || bills.length === 0) return 0
    const set = new Set<string>()
    for (const b of bills) {
      const uid = (b.user as any)?.id || (b.user as any)?.userId || null
      if (uid) set.add(String(uid))
    }
    return set.size
  }

  function computeGrowth(bills: BillInterface[]) {
    if (!Array.isArray(bills) || bills.length === 0) return 0
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonth = prev.getMonth()
    const prevYear = prev.getFullYear()

    let curSum = 0
    let prevSum = 0
    for (const b of bills) {
      const d = new Date(b.billed_at)
      if (isNaN(d.getTime())) continue
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        curSum += Number(b.total_amount) || 0
      } else if (d.getFullYear() === prevYear && d.getMonth() === prevMonth) {
        prevSum += Number(b.total_amount) || 0
      }
    }
    if (prevSum === 0) return curSum === 0 ? 0 : Math.round(curSum * 10) / 10
    const rate = ((curSum - prevSum) / prevSum) * 100
    return Math.round(rate * 10) / 10
  }

  const newCustomers = countNewCustomers(bills)
  const activeAccounts = countActiveAccounts(bills)
  const growthRate = computeGrowth(bills)

  // Build chart data according to timeframe
  const buildChartData = () => {
    if (!Array.isArray(bills)) return [] as { label: string; value: number }[]
    if (timeframe === "year") {
      const data = filterYearly(bills, year)
      return data.map((d) => ({ label: String(d.year), value: d.total }))
    }

    if (timeframe === "month") {
      const data = filterMonthly(bills, year)
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]
      return data.map((d) => ({ label: monthNames[d.month - 1] ?? String(d.month), value: d.total }))
    }

    if (timeframe === "week") {
      const data = filterWeekly(bills, year)
      return data.map((d) => ({ label: `W${d.week}`, value: d.total }))
    }

    // day
    const data = filterDaily(bills, selectedMonth)
    return data.map((d) => ({ label: String(d.day), value: d.total }))
  }

  const chartData = buildChartData()

  return (
    <>
      container
      <DashboardComponent
        totalAmount={total}
        newCustomers={newCustomers}
        activeAccounts={activeAccounts}
        growthRate={growthRate}
        chartData={chartData}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </>
  )
}
