
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ImageSelectorProps {
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

export function ImageSelector({ selectedImage, setSelectedImage }: ImageSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Select an image</Label>
      <RadioGroup value={selectedImage} onValueChange={setSelectedImage} className="grid grid-cols-3 gap-4">
        <div>
          <RadioGroupItem 
            value="1" 
            id="image1" 
            className="peer sr-only"
          />
          <Label
            htmlFor="image1"
            className="flex flex-col items-center justify-center h-24 rounded-md border-2 border-white/20 bg-black/40 p-2 hover:bg-black/60 hover:border-neon-cyan peer-data-[state=checked]:border-neon-cyan peer-data-[state=checked]:bg-neon-cyan/10"
          >
            <div className="text-2xl">👤</div>
            <span className="text-xs mt-1">Above a human/object</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem 
            value="2" 
            id="image2" 
            className="peer sr-only"
          />
          <Label
            htmlFor="image2"
            className="flex flex-col items-center justify-center h-24 rounded-md border-2 border-white/20 bg-black/40 p-2 hover:bg-black/60 hover:border-neon-cyan peer-data-[state=checked]:border-neon-cyan peer-data-[state=checked]:bg-neon-cyan/10"
          >
            <div className="text-2xl">🏢</div>
            <span className="text-xs mt-1">Above a building</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem 
            value="3" 
            id="image3" 
            className="peer sr-only"
          />
          <Label
            htmlFor="image3"
            className="flex flex-col items-center justify-center h-24 rounded-md border-2 border-white/20 bg-black/40 p-2 hover:bg-black/60 hover:border-neon-cyan peer-data-[state=checked]:border-neon-cyan peer-data-[state=checked]:bg-neon-cyan/10"
          >
            <div className="text-2xl">🖼️</div>
            <span className="text-xs mt-1">Outdoor billboard size</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
