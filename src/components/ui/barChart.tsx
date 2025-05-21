
import * as React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#0ea5e9"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: BarChartProps) {
  return (
    <ChartContainer
      className={className}
      config={{
        ...Object.fromEntries(
          categories.map((category, i) => [
            category,
            {
              color: colors[i % colors.length],
            },
          ])
        ),
      }}
    >
      <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          stroke="rgba(255,255,255,0.4)"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          stroke="rgba(255,255,255,0.4)"
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltipContent
                  className="bg-black/80 border-gray-800"
                  items={payload.map((entry) => ({
                    label: entry.dataKey as string,
                    value: valueFormatter(entry.value as number),
                    color: entry.color as string,
                  }))}
                />
              )
            }
            return null
          }}
        />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
            name={category}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}
