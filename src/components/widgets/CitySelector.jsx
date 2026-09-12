import React, { useState, useRef, useEffect } from 'react';
import { useKalyani } from '../../context/KalyaniContext';
import { MapPin, ChevronDown, Check, Building2 } from 'lucide-react';

export default function CitySelector({ variant = 'header', isScrolled = false }) {
  const { selectedCity, setSelectedCity, cities, allLocations } = useKalyani();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBranchCount = (cityName) => {
    const list = allLocations?.[cityName.toLowerCase()] || [];
    return list.length;
  };

  if (variant === 'pill') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {cities.map((city) => {
          const isSelected = selectedCity === city;
          return (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${isSelected
                  ? 'bg-blue-800 text-white shadow-blue-800/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{city}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-blue-900/80 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                {getBranchCount(city)}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="city-picker-button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none ${isScrolled
            ? 'bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200'
            : 'bg-transparent text-white border border-white/40 hover:border-white/70'
          }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isScrolled ? 'text-red-600' : 'text-red-500'}`} />
        <span className="font-bold tracking-tight">{selectedCity}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            } ${isScrolled ? 'text-slate-600' : 'text-white/80'}`}
        />
      </button>

      {/* Dark Glassmorphism Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2.5 w-72 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden ${isScrolled
              ? 'bg-white border border-slate-100 text-slate-900'
              : 'bg-black/90 backdrop-blur-xl border border-white/15 text-white'
            }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3 border-b ${isScrolled ? 'border-slate-100' : 'border-white/10'
              }`}
          >
            <p
              className={`text-[11px] font-bold uppercase tracking-wider ${isScrolled ? 'text-slate-400' : 'text-white/50'
                }`}
            >
              Select Your City
            </p>
            <p
              className={`text-xs mt-0.5 ${isScrolled ? 'text-slate-500' : 'text-white/70'
                }`}
            >
              Showing dealership branches & service hubs
            </p>
          </div>

          {/* Cities List */}
          <div className="py-1">
            {cities.map((city) => {
              const isSelected = selectedCity === city;
              const count = getBranchCount(city);
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all text-left ${isScrolled
                      ? isSelected
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                      : isSelected
                        ? 'bg-white/15 text-white font-bold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
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