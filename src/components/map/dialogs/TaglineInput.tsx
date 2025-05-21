
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaglineInputProps {
  tagline: string;
  setTagline: (tagline: string) => void;
  maxLength?: number;
}

export function TaglineInput({ tagline, setTagline, maxLength = 30 }: TaglineInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tagline">Tagline (max {maxLength} chars)</Label>
      <Input
        id="tagline"
        placeholder="Enter a catchy tagline"
        value={tagline}
        onChange={(e) => setTagline(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
        className="bg-black/40 border-white/20"
      />
      <div className="text-right text-xs text-gray-400">
        {tagline.length}/{maxLength}
      </div>
    </div>
  );
}
