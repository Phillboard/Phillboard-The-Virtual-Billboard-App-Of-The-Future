
import { useState, useMemo } from "react";
import { MapPin } from "@/components/map/types";
import { Phillboard } from "@/components/feed/types";
import { FilterOptions } from "@/components/search/FilterDropdown";

type PhillboardItem = MapPin | Phillboard;

export function usePhillboardFiltering<T extends PhillboardItem>(items: T[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    placementType: [],
    timeRange: "all",
    sortBy: "newest",
    username: ""
  });

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply placement type filter
    if (filters.placementType.length > 0) {
      filtered = filtered.filter(item => {
        const placementType = 'placement_type' in item ? item.placement_type : item.image_type;
        return filters.placementType.includes(placementType || "human");
      });
    }

    // Apply username filter
    if (filters.username) {
      filtered = filtered.filter(item =>
        item.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    // Apply time range filter
    if (filters.timeRange !== "all" && 'created_at' in filtered[0]) {
      const now = new Date();
      const cutoffDate = new Date();

      switch (filters.timeRange) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(item => {
        if ('created_at' in item && item.created_at) {
          return new Date(item.created_at) >= cutoffDate;
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          if ('created_at' in a && 'created_at' in b) {
            return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
          }
          return 0;
        case "newest":
          if ('created_at' in a && 'created_at' in b) {
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          }
          return 0;
        case "distance":
          if ('distanceValue' in a && 'distanceValue' in b) {
            return (a.distanceValue || 0) - (b.distanceValue || 0);
          }
          return 0;
        case "username":
          return a.username.localeCompare(b.username);
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchQuery, filters]);

  return {
    filteredItems,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    hasActiveFilters: searchQuery !== "" || 
      filters.placementType.length > 0 || 
      filters.timeRange !== "all" || 
      filters.sortBy !== "newest" || 
      filters.username !== ""
  };
}
