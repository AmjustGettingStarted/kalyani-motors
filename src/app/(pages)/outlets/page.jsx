import React, { useState } from 'react';
import { useKalyani } from '../../../context/KalyaniContext';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle,
  Building,
  Wrench,
  Search,
} from 'lucide-react';

export default function OutletsPage() {
  const { cities, selectedCity, setSelectedCity, allLocations, openTestDrive } = useKalyani();
  const [activeCategory, setActiveCategory] = useState('all');
  const [branchSearch, setBranchSearch] = useState('');

  const currentCityLocations = allLocations[selectedCity.toLowerCase()] || [];

  const categories = [
    { id: 'all', label: 'All Touchpoints' },
    { id: 'arena', label: 'Arena Showrooms' },
    { id: 'nexa', label: 'Nexa Showrooms' },
    { id: 'service', label: 'Service Workshops' },
    { id: 'true-value', label: 'True Value (Used)' },
  ];

  const filteredLocations = currentCityLocations.filter((loc) => {
    if (activeCategory !== 'all' && loc.category !== activeCategory) return false;
    if (branchSearch.trim()) {
      const q = branchSearch.toLowerCase().trim();
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        loc.landmark.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-full inline-block">
            Authorized Network
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            Kalyani Motors Dealerships & Service Hubs
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Locate your nearest authorized Maruti Suzuki Arena, Nexa showroom, certified service workshop, or True Value outlet in {selectedCity}.
          </p>
        </div>
      </div>

      {/* City Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {cities.map((city) => {
            const isSelected = selectedCity === city;
            const count = (allLocations[city.toLowerCase()] || []).length;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${isSelected
                    ? 'bg-blue-800 text-white shadow-md shadow-blue-800/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{city}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-blue-900 text-blue-200' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search locality, area..."
            value={branchSearch}
            onChange={(e) => setBranchSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Locations Grid */}
      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Type Badge & Flagship */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${loc.category === 'nexa'
                        ? 'bg-slate-900 text-white'
                        : loc.category === 'service'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                  >
                    {loc.type}
                  </span>

                  {loc.isFlagship && (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      FLAGSHIP HUB
                    </span>
                  )}
                </div>

                {/* Branch Title & Address */}
                <div>
                  <h3 className="font-display font-extrabold text-lg text-slate-900 group-hover:text-blue-800 transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </p>
                  <p className="text-[11px] text-blue-700 font-semibold ml-6 mt-1">
                    Landmark: {loc.landmark}
                  </p>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{loc.hours}</span>
                </div>

                {/* Facilities Pills */}
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                    Facilities Available:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.facilities?.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Sales Desk:</span>
                  <a
                    href={`tel:${loc.phone.replace(/\s+/g, '')}`}
                    className="font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {loc.phone}
                  </a>
                </div>

                {loc.servicePhone && loc.servicePhone !== loc.phone && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Service Desk:</span>
                    <a
                      href={`tel:${loc.servicePhone.replace(/\s+/g, '')}`}
                      className="font-bold text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      {loc.servicePhone}
                    </a>
                  </div>
                )}

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-800" />
                    <span>Get Directions</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => openTestDrive()}
                    className="py-2.5 px-3 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Book Visit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">No outlets found</h3>
          <p className="text-xs text-slate-500">
            No touchpoints found matching your search term. Clear the search or choose another city tab.
          </p>
          <button
            type="button"
            onClick={() => {
              setBranchSearch('');
              setActiveCategory('all');
            }}
            className="px-6 py-2.5 bg-blue-800 text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
