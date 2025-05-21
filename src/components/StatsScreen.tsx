
import { BarChart } from "@/components/ui/barChart";

// Fake data for statistics (will be replaced with real data when connected to database)
const globalData = {
  total: 12483,
  personal: 5,
  popular: [
    { id: 1, title: "Downtown Digital", username: "CyberAlex", views: 342 },
    { id: 2, title: "Tech Hub", username: "NeonRider", views: 238 },
    { id: 3, title: "Future Now", username: "DigitalNomad", views: 187 },
  ],
  activity: [
    { id: 1, username: "Alice", action: "placed a philboard", location: "50 ft away", time: "2 min ago" },
    { id: 2, username: "Bob", action: "viewed your philboard", location: "Downtown", time: "10 min ago" },
    { id: 3, username: "Charlie", action: "placed a philboard", location: "near Coffee Shop", time: "25 min ago" },
  ],
};

// Chart data
const chartData = [
  { name: "Mon", value: 2 },
  { name: "Tue", value: 4 },
  { name: "Wed", value: 3 },
  { name: "Thu", value: 7 },
  { name: "Fri", value: 5 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 6 },
];

export function StatsScreen() {
  return (
    <div className="screen bg-black">
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>
      
      <div className="space-y-6">
        {/* Global Stats */}
        <div className="neon-card p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Global Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Philboards</p>
              <p className="text-2xl font-bold text-neon-cyan">
                {globalData.total.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Your Philboards</p>
              <p className="text-2xl font-bold text-neon-magenta">
                {globalData.personal}
              </p>
            </div>
          </div>
        </div>
        
        {/* Placements Chart */}
        <div className="neon-card p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Placements Over Time</h2>
          <div className="h-60 w-full">
            <BarChart
              data={chartData}
              index="name"
              categories={["value"]}
              colors={["#00FFFF"]}
              valueFormatter={(value) => `${value} placements`}
              className="text-sm"
            />
          </div>
        </div>
        
        {/* Popular Philboards */}
        <div className="neon-card p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Top Philboards</h2>
          <div className="space-y-3">
            {globalData.popular.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                    index === 1 ? "bg-gray-400/20 text-gray-400" :
                    "bg-amber-600/20 text-amber-600"
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-400">by @{item.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.views}</p>
                  <p className="text-sm text-gray-400">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Activity - Removed from this version to match the reference image */}
      </div>
    </div>
  );
}
