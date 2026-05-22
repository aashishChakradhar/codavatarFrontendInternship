"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart with a label"



export function ChartLineLabel({
  data = [],
  timeframe = "month",
  setTimeframe,
  selectedMonth,
  setSelectedMonth,
}: {
  data?: { label: string; value: number }[]
  timeframe?: "year" | "month" | "week" | "day"
  setTimeframe?: (t: "year" | "month" | "week" | "day") => void
  selectedMonth?: number
  setSelectedMonth?: (m: number) => void
}) {
  const display = data ?? []

  return (
    <Card className="mx-4">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center ml-auto gap-2">
            <Select value={timeframe} onValueChange={(v) => setTimeframe?.(v as any)}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Group By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>View By</SelectLabel>
                  <SelectItem value="year">Yearly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="day">Daily</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {timeframe === "day" && (
              <Select
                value={String(selectedMonth ?? new Date().getMonth() + 1)}
                onValueChange={(v) => setSelectedMonth?.(Number(v))}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Month</SelectLabel>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {new Date(0, i).toLocaleString(undefined, { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>


      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <LineChart
            accessibilityLayer
            data={display}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
            <Line
              dataKey="value"
              type="linear"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-primary)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing aggregated totals</div>
      </CardFooter>
    </Card>
  )
}
