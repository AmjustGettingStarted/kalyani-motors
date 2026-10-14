import React from 'react';
import { Building2, Check, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

const BODY_OPTIONS = ['Hatchback', 'Sedan', 'SUV', 'MPV'];
const FUEL_OPTIONS = ['Petrol', 'CNG', 'Strong Hybrid'];
const TRANSMISSION_OPTIONS = ['Manual', 'Automatic'];

export default function FilterSidebar({
  channel,
  setChannel,
  bodyOptions = BODY_OPTIONS,
  bodyTypesSelected = [],
  toggleBodyType,
  fuelOptions = FUEL_OPTIONS,
  fuelTypesSelected = [],
  toggleFuel,
  transmissionOptions = TRANSMISSION_OPTIONS,
  transmissionSelected = [],
  toggleTransmission,
  maxPrice,
  setMaxPrice,
  selectedLocation,
  setSelectedLocation,
  locations = [],
  resetFilters,
  activeFiltersCount = 0,
  availableCounts = {},
  isMobileDrawer = false,
  onCloseDrawer,
  isHidden = false,
}) {
  const formatPriceLakh = (val) => {
    const lakh = (val / 100000).toFixed(1);
    return `₹ ${lakh} L`;
  };

  return (
    <div
      data-lenis-prevent="true"
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col custom-scrollbar-blue ${isMobileDrawer
        ? 'p-5 overflow-y-auto overscroll-contain'
        : `p-5 overflow-y-auto overscroll-contain w-full transition-[max-height] duration-300 ${isHidden ? 'max-h-[calc(100vh-2rem)]' : 'max-h-[calc(100vh-6.5rem)]'
        }`
        }`}
    >
      {/* Header */}
      {/* <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
            <Filter className="w-4 h-4" />
          </div>
          <h3 className="font-display font-black text-base text-slate-900 tracking-tight">
            Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-brand-blue text-[11px] font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div> */}

      <div className="divide-y divide-slate-100 space-y-5">
        {/* Section 1: Showroom Channel */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Channel / Brand
            </label>
            <span className="text-[10px] text-slate-400 font-semibold">Maruti Suzuki</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            {['All', 'Arena', 'Nexa'].map((c) => {
              const isSelected = channel === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${isSelected
                    ? c === 'Nexa'
                      ? 'bg-slate-950 text-white shadow-xs'
                      : c === 'Arena'
                        ? 'bg-brand-blue text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <span>{c}</span>
                  {availableCounts.channel && availableCounts.channel[c.toLowerCase()] !== undefined && (
                    <span
                      className={`text-[9px] px-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'text-slate-400'
                        }`}
                    >
                      {availableCounts.channel[c.toLowerCase()]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Body Type (Multi-select Checkboxes) */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Body Type
            </label>
            {bodyTypesSelected.length > 0 && (
              <span className="text-[10px] font-bold text-brand-blue">
                {bodyTypesSelected.length} selected
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {bodyOptions.map((type) => {
              const isChecked = bodyTypesSelected.includes(type);
              const count = availableCounts.bodyType ? availableCounts.bodyType[type] : 0;
              return (
                <label
                  key={type}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${isChecked
                    ? 'bg-blue-50/70 border-brand-blue/40 text-brand-blue font-bold shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/70 text-slate-700 hover:bg-slate-100/70'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${isChecked
                        ? 'bg-brand-blue text-white'
                        : 'border border-slate-300 bg-white'
                        }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{type}</span>
                  </div>
                  {count !== undefined && (
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded-full bg-white/70 border border-slate-200/50">
                      {count}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggleBodyType(type)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 3: Fuel Type (Multi-select Checkboxes) */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Fuel Type
            </label>
            {fuelTypesSelected.length > 0 && (
              <span className="text-[10px] font-bold text-brand-blue">
                {fuelTypesSelected.length} selected
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {fuelOptions.map((f) => {
              const isChecked = fuelTypesSelected.includes(f);
              const count = availableCounts.fuel ? availableCounts.fuel[f] : 0;
              return (
                <label
                  key={f}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${isChecked
                    ? 'bg-blue-50/70 border-brand-blue/40 text-brand-blue font-bold shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/70 text-slate-700 hover:bg-slate-100/70'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${isChecked
                        ? 'bg-brand-blue text-white'
                        : 'border border-slate-300 bg-white'
                        }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{f}</span>
                  </div>
                  {count !== undefined && (
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded-full bg-white/70 border border-slate-200/50">
                      {count}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggleFuel(f)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 4: Transmission / Gearbox */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Transmission
            </label>
            {transmissionSelected.length > 0 && (
              <span className="text-[10px] font-bold text-brand-blue">
                {transmissionSelected.length} selected
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {transmissionOptions.map((t) => {
              const isChecked = transmissionSelected.includes(t);
              const count = availableCounts.transmission ? availableCounts.transmission[t] : 0;
              return (
                <label
                  key={t}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${isChecked
                    ? 'bg-blue-50/70 border-brand-blue/40 text-brand-blue font-bold shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/70 text-slate-700 hover:bg-slate-100/70'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${isChecked
                        ? 'bg-brand-blue text-white'
                        : 'border border-slate-300 bg-white'
                        }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{t}</span>
                  </div>
                  {count !== undefined && (
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded-full bg-white/70 border border-slate-200/50">
                      {count}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggleTransmission(t)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 5: Price Range Dual/Max Slider */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Max Budget
            </label>
            <span className="text-xs font-bold text-brand-blue">
              {maxPrice >= 3000000 ? 'Any Budget' : `Up to ${formatPriceLakh(maxPrice)}`}
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={500000}
              max={3000000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
              <span>₹ 5 Lakh</span>
              <span>₹ 15 Lakh</span>
              <span>₹ 30+ Lakh</span>
            </div>

            {/* Quick Budget Chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              {[800000, 1200000, 1800000, 3000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMaxPrice(preset)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${maxPrice === preset
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  {preset === 3000000 ? 'All' : `< ${formatPriceLakh(preset)}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6: Dealership / Showroom Location (shadcn Select) */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-blue" />
              <span>Dealership Showroom</span>
            </label>
          </div>

          <Select
            value={selectedLocation}
            onValueChange={(val) => setSelectedLocation(val)}
          >
            <SelectTrigger className="w-full text-xs font-semibold bg-slate-50 hover:bg-slate-100/80 border-slate-200/90 rounded-xl px-3 h-10 text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-brand-blue transition-colors">
              <SelectValue placeholder="All Showrooms in City" />
            </SelectTrigger>
            <SelectContent className="max-h-64 bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-y-auto custom-scrollbar-blue" data-lenis-prevent="true">
              <SelectItem value="All" className="text-xs font-semibold py-2 cursor-pointer focus:bg-blue-50 focus:text-brand-blue">
                All Showrooms in City
              </SelectItem>
              {locations.map((loc) => (
                <SelectItem
                  key={loc.id}
                  value={String(loc.id)}
                  className="text-xs font-medium py-2 cursor-pointer focus:bg-blue-50 focus:text-brand-blue"
                >
                  <span className="font-bold text-brand-blue uppercase mr-1">
                    {loc.category || loc.type}:
                  </span>
                  <span>
                    {loc.name.replace(/Maruti Suzuki\s*/i, '').replace(/Kalyani Motors,?\s*/i, '')}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedLocation !== 'All' && (
            <p className="text-[11px] text-brand-blue font-medium bg-blue-50 p-2 rounded-lg border border-blue-100 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>Filtering inventory available at selected dealership.</span>
            </p>
          )}
        </div>
      </div>

      {isMobileDrawer && (
        <div className="pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onCloseDrawer}
            className="w-full py-3 bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Apply &amp; View Results
          </button>
        </div>
      )}
    </div>
  );
}
