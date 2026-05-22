import { ChartLineLabel } from "./lineChart"
import { SectionCards } from "./sectionCards"

export function DashboardComponent({
  totalAmount,
  newCustomers,
  activeAccounts,
  growthRate,
  chartData,
  timeframe,
  setTimeframe,
  selectedMonth,
  setSelectedMonth,
}: {
  totalAmount: number
  newCustomers: number
  activeAccounts: number
  growthRate: number
  chartData?: { label: string; value: number }[]
  timeframe?: "year" | "month" | "week" | "day"
  setTimeframe?: (t: "year" | "month" | "week" | "day") => void
  selectedMonth?: number
  setSelectedMonth?: (m: number) => void
}) {
  return (
    <>
      component
      <SectionCards
        totalAmount={totalAmount}
        newCustomers={newCustomers}
        activeAccounts={activeAccounts}
        growthRate={growthRate}
      />
      <ChartLineLabel
        data={chartData}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </>
  )
}
