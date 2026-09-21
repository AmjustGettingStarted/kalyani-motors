import React, { useState, useRef, useEffect } from 'react';
import { useKalyani } from '../../context/KalyaniContext';
import { MapPin, ChevronDown, Check, Building2, Sparkles } from 'lucide-react';

export default function CitySelector({ variant = 'header', isScrolled = false, onSelect }) {
  const { selectedCity, setSelectedCity, cities, allLocations } = useKalyani();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking or tapping outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const getBranchCount = (cityName) => {
    const list = allLocations?.[cityName.toLowerCase()] || [];
    return list.length;
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setIsOpen(false);
    onSelect?.(city);
  };

  // Pill variant (for filters or minimal headers)
  if (variant === 'pill') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {cities.map((city) => {
          const isSelected = selectedCity === city;
          const count = getBranchCount(city);
          return (
            <button
              key={city}
              type="button"
              onClick={() => handleCityChange(city)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${isSelected
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-blue-800/30 scale-[1.02]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{city}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Interactive 2x2 Grid Variant (tailor-made for mobile drawers & cards)
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {cities.map((city) => {
          const isSelected = selectedCity === city;
          const count = getBranchCount(city);
          return (
            <button
              key={city}
              type="button"
              onClick={() => handleCityChange(city)}
              className={`relative flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 group active:scale-[0.98] ${isSelected
                ? 'bg-gradient-to-br from-blue-600/15 via-blue-600/10 to-indigo-600/15 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
                : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:bg-white/[0.08] hover:border-white/20'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/10 text-neutral-400 group-hover:text-white'
                    }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                    {city}
                  </div>
                  <div className={`text-[10px] font-medium truncate ${isSelected ? 'text-blue-300' : 'text-neutral-400'}`}>
                    {count} Outlets
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default Desktop Header Variant
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="city-picker-button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none ${isScrolled
          ? 'bg-slate-100/90 hover:bg-slate-200/90 text-slate-800 border border-slate-200/90 shadow-sm'
          : 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 hover:border-white/40'
          }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isScrolled ? 'bg-red-500' : 'bg-red-400'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isScrolled ? 'bg-red-600' : 'bg-red-500'}`} />
        </span>
        <span className="font-bold tracking-tight">{selectedCity}</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${isScrolled
            ? 'bg-slate-200/80 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
            : 'bg-white/15 text-white/90 group-hover:bg-white/25'
            }`}
        >
          {getBranchCount(selectedCity)} Hubs
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            } ${isScrolled ? 'text-slate-500' : 'text-white/80'}`}
        />
      </button>

      {/* Floating Dropdown Card */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className={`absolute right-0 mt-2.5 w-76 sm:w-80 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden ${isScrolled
            ? 'bg-white/95 backdrop-blur-xl border border-slate-200/80 text-slate-900 shadow-slate-900/10'
            : 'bg-neutral-950/95 backdrop-blur-2xl border border-white/15 text-white shadow-black/80'
            }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3.5 border-b flex items-center justify-between ${isScrolled ? 'border-slate-100 bg-slate-50/50' : 'border-white/10 bg-white/[0.03]'
              }`}
          >
            <div>
              <p
                className={`text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${isScrolled ? 'text-blue-700' : 'text-blue-400'
                  }`}
              >
                Select Your City
              </p>
              <p
                className={`text-[11px] mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-white/70'
                  }`}
              >
                Customizes showroom offers & on-road pricing
              </p>
            </div>
          </div>

          {/* Cities List */}
          <div className="p-2 space-y-1">
            {cities.map((city) => {
              const isSelected = selectedCity === city;
              const count = getBranchCount(city);
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCityChange(city)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left group ${isScrolled
                    ? isSelected
                      ? 'bg-blue-50/90 border border-blue-200/60 text-blue-950 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-950'
                    : isSelected
                      ? 'bg-blue-600/20 border border-blue-500/40 text-white font-bold'
                      : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isScrolled
                        ? isSelected
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                        : isSelected
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                          : 'bg-white/10 text-white/70'
                        }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-snug">{city}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-white/50'
                          }`}
                      >
                        {count} Outlets Available
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 stroke-[2.5] ${isScrolled ? 'text-blue-700' : 'text-red-400'
                        }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div
            className={`px-4 py-2.5 border-t ${isScrolled
              ? 'border-slate-100 bg-slate-50/50 text-slate-400'
              : 'border-white/10 bg-white/[0.03] text-white/40'
              }`}
          >
            <p className="text-[11px] leading-tight">
              Prices & inventory adapt to your selected region.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}