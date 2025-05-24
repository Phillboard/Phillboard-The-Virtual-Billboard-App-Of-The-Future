
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";

export interface FilterOptions {
  placementType: string[];
  timeRange: string;
  sortBy: string;
  username: string;
}

interface FilterDropdownProps {
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

const PLACEMENT_TYPES = [
  { id: "human", label: "Human" },
  { id: "building", label: "Building" },
  { id: "billboard", label: "Billboard" }
];

const TIME_RANGES = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" }
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "distance", label: "Closest First" },
  { id: "username", label: "Username A-Z" }
];

export function FilterDropdown({ onFilterChange, className = "" }: FilterDropdownProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    placementType: [],
    timeRange: "all",
    sortBy: "newest",
    username: ""
  });
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const togglePlacementType = (type: string) => {
    const newTypes = filters.placementType.includes(type)
      ? filters.placementType.filter(t => t !== type)
      : [...filters.placementType, type];
    updateFilter("placementType", newTypes);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      placementType: [],
      timeRange: "all",
      sortBy: "newest",
      username: ""
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.placementType.length > 0 || 
    filters.timeRange !== "all" || 
    filters.sortBy !== "newest" || 
    filters.username !== "";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`bg-black/40 border-white/20 hover:bg-white/10 ${className}`}
        >
          <Filter size={16} className={hasActiveFilters ? "text-cyan-400" : ""} />
          {hasActiveFilters && (
            <span className="ml-1 bg-cyan-500 text-black rounded-full text-xs px-1">
              {filters.placementType.length + (filters.timeRange !== "all" ? 1 : 0) + (filters.sortBy !== "newest" ? 1 : 0) + (filters.username ? 1 : 0)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/90 border-white/20" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filters</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 px-2 text-xs hover:bg-white/10"
              >
                Clear All
              </Button>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Placement Type</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PLACEMENT_TYPES.map((type) => (
                <Button
                  key={type.id}
                  variant={filters.placementType.includes(type.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlacementType(type.id)}
                  className={filters.placementType.includes(type.id) 
                    ? "bg-cyan-500/30 border-cyan-500 text-cyan-300" 
                    : "bg-transparent border-white/20 hover:bg-white/10"
                  }
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div>
            <label className="text-sm font-medium">Time Range</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range.id}
                  variant={filters.timeRange === range.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("timeRange", range.id)}
                  className={filters.timeRange === range.id
                    ? "bg-cyan-500/30 border-cyan-500 text-cyan-300"
                    : "bg-transparent border-white/20 hover:bg-white/10"
                  }
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div>
            <label className="text-sm font-medium">Sort By</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SORT_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  variant={filters.sortBy === option.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("sortBy", option.id)}
                  className={filters.sortBy === option.id
                    ? "bg-cyan-500/30 border-cyan-500 text-cyan-300"
                    : "bg-transparent border-white/20 hover:bg-white/10"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div>
            <label className="text-sm font-medium">Username</label>
            <div className="relative mt-2">
              <Input
                type="text"
                value={filters.username}
                onChange={(e) => updateFilter("username", e.target.value)}
                placeholder="Filter by username..."
                className="bg-black/40 border-white/20 pr-8"
              />
              {filters.username && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-white/10"
                  onClick={() => updateFilter("username", "")}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
