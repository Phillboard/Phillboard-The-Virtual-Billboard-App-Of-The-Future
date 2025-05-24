
import { SearchBar } from "./SearchBar";
import { FilterDropdown, FilterOptions } from "./FilterDropdown";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  searchPlaceholder?: string;
  className?: string;
}

export function SearchAndFilter({ 
  onSearch, 
  onFilterChange, 
  searchPlaceholder,
  className = "" 
}: SearchAndFilterProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <SearchBar 
        onSearch={onSearch} 
        placeholder={searchPlaceholder}
        className="flex-1"
      />
      <FilterDropdown onFilterChange={onFilterChange} />
    </div>
  );
}
