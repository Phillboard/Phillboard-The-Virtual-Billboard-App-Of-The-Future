
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HumanARView from "@/components/ar/HumanARView";
import BillboardARView from "@/components/ar/BillboardARView";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ARViewTabsProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function ARViewTabs({ activeView, onViewChange }: ARViewTabsProps) {
  return (
    <Tabs 
      value={activeView} 
      className="w-full" 
      onValueChange={onViewChange}
    >
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-lg py-1 px-1 rounded-full z-20">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger 
            value="human"
            className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-white"
          >
            Human View
          </TabsTrigger>
          <TabsTrigger 
            value="billboard"
            className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-white"
          >
            Billboard View
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="human" className="h-full mt-0">
        <HumanARView />
      </TabsContent>
      
      <TabsContent value="billboard" className="h-full mt-0">
        <BillboardARView />
      </TabsContent>
      
      <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-10">
        <Button 
          className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan w-64"
          onClick={() => toast.info(`Place ${activeView === "human" ? "Human" : "Billboard"} Phillboard`)}
        >
          Place {activeView === "human" ? "Human" : "Billboard"} Phillboard
        </Button>
      </div>
    </Tabs>
  );
}
