
import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/barChart";

interface DailyPlacementsChartProps {
  dailyPlacements: { name: string; value: number }[];
  isLoading: boolean;
}

export function DailyPlacementsChart({
  dailyPlacements,
  isLoading
}: DailyPlacementsChartProps) {
  return (
    <Card className="p-4 bg-black/40 border border-white/10">
      <h3 className="font-semibold mb-3">Daily Phillboard Placements</h3>
      <div className="h-60 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">Loading chart data...</p>
          </div>
        ) : (
          <BarChart
            data={dailyPlacements}
            index="name"
            categories={["value"]}
            colors={["#00FFFF"]}
            valueFormatter={(value) => `${value} placements`}
            className="text-xs"
          />
        )}
      </div>
    </Card>
  );
}
