import React, { useState, useRef, useEffect } from 'react';
import { useKalyani } from '../../context/KalyaniContext';
import { MapPin, ChevronDown, Check, Building2 } from 'lucide-react';

export default function CitySelector({ variant = 'header' }) {
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
    const list = allLocations[cityName.toLowerCase()] || [];
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
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                isSelected
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
      <button
        type="button"
        id="city-picker-button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-full border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <span className="font-bold text-slate-900 tracking-tight">{selectedCity}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Your City</p>
            <p className="text-xs text-slate-500 mt-0.5">Showing dealership branches & service hubs</p>
          </div>

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
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${
                    isSelected ? 'bg-blue-50/80 text-blue-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{city}</div>
                      <div className="text-[11px] text-slate-500">{count} Outlets Available</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-700 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          <div className="px-4 pt-2 border-t border-slate-100 mt-1">
            <p className="text-[11px] text-slate-400 leading-tight">
              Prices & inventory adapt to your selected region.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
