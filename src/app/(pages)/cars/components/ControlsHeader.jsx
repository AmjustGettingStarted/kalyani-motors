import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

export default function ControlsHeader({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  totalCarsCount,
  filteredCarsCount,
  activeFilters = [],
  onRemoveFilter,
  onResetFilters,
  onOpenMobileFilters,
  activeFiltersCount = 0,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Search Input + Elegant Vehicle Count */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Swift, Brezza, Nexa, petrol, hybrid..."
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Clean Minimal Typography Counter */}
          <div className="hidden sm:flex items-center text-xs text-slate-500 font-medium shrink-0">
            <span>Showing</span>
            <span className="text-slate-900 font-bold mx-1.5 text-sm">{filteredCarsCount}</span>
            <span>of {totalCarsCount} models</span>
          </div>
        </div>

        {/* Right: Mobile Filter Trigger + shadcn Select Sort */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
          {/* Mobile Filter Button (Visible on screens < lg) */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className={`lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              activeFiltersCount > 0
                ? 'bg-brand-blue text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] inline-flex items-center justify-center font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* shadcn Select for Sort By */}
          <div className="flex items-center shrink-0">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
              <SelectTrigger className="w-[170px] sm:w-[195px] h-10 text-xs font-semibold bg-slate-50 hover:bg-slate-100/80 border-slate-200/90 rounded-xl px-3 text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-brand-blue cursor-pointer transition-colors">
                <div className="flex items-center gap-2 truncate">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden">
                <SelectItem
                  value="featured"
                  className="text-xs font-medium py-2 cursor-pointer focus:bg-blue-50 focus:text-brand-blue"
                >
                  Sort by: Featured
                </SelectItem>
                <SelectItem
                  value="price-low"
                  className="text-xs font-medium py-2 cursor-pointer focus:bg-blue-50 focus:text-brand-blue"
                >
                  Price: Low to High
                </SelectItem>
                <SelectItem
                  value="price-high"
                  className="text-xs font-medium py-2 cursor-pointer focus:bg-blue-50 focus:text-brand-blue"
                >
                  Price: High to Low
                </SelectItem>
                <SelectItem
                  value="mileage"
                  className="text-xs font-medium py-2 cursor-pointer focus:bg-blue-50 focus:text-brand-blue"
                >
                  Mileage: High to Low
                </SelectItem>
                <SelectItem
                  value="newest"
                  className="text-xs font-medium py-2 cursor-pointer focus:bg-blue-50 focus:text-brand-blue"
                >
                  Newest Launches
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Mobile count on narrow screens */}
      <div className="flex sm:hidden items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Showing <strong className="text-slate-900 font-bold">{filteredCarsCount}</strong> of {totalCarsCount} models</span>
      </div>

      {/* Active Filter Dismissible Chips Row */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active:
          </span>
          {activeFilters.map((filter) => (
            <span
              key={`${filter.type}-${filter.label}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 border border-blue-200/70 text-brand-blue text-xs font-semibold"
            >
              <span>{filter.label}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter(filter)}
                className="hover:text-red-600 transition-colors p-0.5"
                aria-label={`Remove filter ${filter.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
}
