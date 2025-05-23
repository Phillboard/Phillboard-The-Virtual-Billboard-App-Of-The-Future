
import * as React from "react"

// Create a chart context that stores the colors for each series
interface ChartContextValue {
  colors: Record<string, { color: string }>;
}

const ChartContext = React.createContext<ChartContextValue | undefined>(
  undefined
)

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Record<string, { color: string }>;
}

function ChartContainer({
  children,
  config,
  ...props
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ colors: config }}>
      <div {...props} className={`${props.className || ""} w-full h-full`}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

export { ChartContainer }

// These components are stubs to avoid errors but aren't used in the current implementation
export const ChartTooltip = () => null
export const ChartTooltipContent = () => null
