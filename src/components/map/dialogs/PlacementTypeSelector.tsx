
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PlacementTypeSelectorProps {
  placementType: string;
  setPlacementType: (type: string) => void;
}

export function PlacementTypeSelector({ placementType, setPlacementType }: PlacementTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Select placement type</Label>
      <RadioGroup value={placementType} onValueChange={setPlacementType} className="grid gap-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="human" id="placement-human" />
          <Label htmlFor="placement-human" className="cursor-pointer">Above a human/object</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="building" id="placement-building" />
          <Label htmlFor="placement-building" className="cursor-pointer">Above a building</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="billboard" id="placement-billboard" />
          <Label htmlFor="placement-billboard" className="cursor-pointer">Outdoor billboard size</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
