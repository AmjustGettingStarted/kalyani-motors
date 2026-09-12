import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useKalyani } from '../../../context/KalyaniContext';
import CarCard from '../../../components/widgets/CarCard';
import { Filter, SlidersHorizontal, RotateCcw, Car } from 'lucide-react';

export default function CarsPage() {
  const { cars, selectedCity } = useKalyani();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [channel, setChannel] = useState(searchParams.get('channel') || 'All');
  const [bodyType, setBodyType] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Keep searchParams in sync if passed
  useEffect(() => {
    const q = searchParams.get('search');
    const ch = searchParams.get('channel');
    if (q !== null) setSearchQuery(q);
    if (ch !== null) setChannel(ch);
  }, [searchParams]);

  const channels = ['All', 'Arena', 'Nexa'];
  const bodyTypes = ['All', 'SUV', 'Hatchback', 'Sedan', 'MPV'];
  const fuelTypes = ['All', 'Petrol', 'CNG', 'Strong Hybrid'];
  const transmissionTypes = ['All', 'Manual', 'Automatic'];

  const resetFilters = () => {
    setChannel('All');
    setBodyType('All');
    setFuel('All');
    setTransmission('All');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        if (channel !== 'All' && car.channel.toLowerCase() !== channel.toLowerCase()) return false;
        if (bodyType !== 'All' && car.bodyType.toLowerCase() !== bodyType.toLowerCase()) return false;
        if (fuel !== 'All' && !car.fuelTypes.includes(fuel)) return false;
        if (transmission !== 'All' && !car.transmissionTypes.includes(transmission)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            car.name.toLowerCase().includes(q) ||
            car.tagline.toLowerCase().includes(q) ||
            car.bodyType.toLowerCase().includes(q) ||
            car.channel.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'mileage') {
          const m1 = parseFloat(a.mileage) || 0;
          const m2 = parseFloat(b.mileage) || 0;
          return m2 - m1;
        }
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [cars, channel, bodyType, fuel, transmission, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Heading Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-full inline-block">
            Authorized Dealership Catalog
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            Explore Maruti Suzuki Range in {selectedCity}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Browse genuine ex-showroom prices, complete variant technical specifications, fuel efficiency, and schedule instant test drives.
          </p>
        </div>
      </div>

      {/* Interactive Filter Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-800" />
            <span className="font-display font-bold text-sm text-slate-900">Filter Inventory</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {filteredCars.length} models found
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-semibold hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="mileage">Highest Mileage</option>
              </select>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Rows */}
        <div className="space-y-3 text-xs">
          {/* Channel */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] w-24 shrink-0">Channel:</span>
            {channels.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChannel(c)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  channel === c
                    ? 'bg-blue-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Body Type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] w-24 shrink-0">Body Type:</span>
            {bodyTypes.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBodyType(b)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  bodyType === b
                    ? 'bg-blue-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Fuel */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] w-24 shrink-0">Fuel:</span>
            {fuelTypes.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFuel(f)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  fuel === f
                    ? 'bg-blue-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Transmission */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] w-24 shrink-0">Gearbox:</span>
            {transmissionTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTransmission(t)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  transmission === t
                    ? 'bg-blue-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Car Grid Results */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">No matching models found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any vehicles matching your selected filters. Try broadening your fuel, body type, or transmission options.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-2.5 bg-blue-800 text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
