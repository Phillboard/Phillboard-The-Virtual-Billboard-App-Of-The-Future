
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin } from "@/components/map/types";

interface Phillboard extends MapPin {
  date: string;
}

interface UserPhillboardsListProps {
  phillboards: Phillboard[];
}

export function UserPhillboardsList({ phillboards }: UserPhillboardsListProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">My Phillboards</h2>
      <div className="neon-card rounded-md">
        <ScrollArea className="h-64">
          <div className="space-y-3 p-3">
            {phillboards.slice(0, 5).map((item) => (
              <div key={item.id} className="bg-black/40 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neon-cyan">{item.title}</h3>
                    <p className="text-sm text-gray-400">{`${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}`}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 bg-transparent border-white/20 hover:bg-white/10"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {phillboards.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>You haven't created any phillboards yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
