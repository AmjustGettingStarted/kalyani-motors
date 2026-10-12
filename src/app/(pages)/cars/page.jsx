import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useKalyani } from '../../../context/KalyaniContext';
import CarCard from '../../../components/widgets/CarCard';
import { Filter, SlidersHorizontal, RotateCcw, Car, MapPin, Search, X } from 'lucide-react';

const pageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.28,
      delayChildren: 0.12,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};


export default function CarsPage() {
  const { cars, selectedCity, openTestDrive } = useKalyani();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [channel, setChannel] = useState(searchParams.get('channel') || 'All');
  const [bodyType, setBodyType] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

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

  const channelCounts = useMemo(() => {
    return {
      all: cars.length,
      arena: cars.filter((c) => c.channel.toLowerCase() === 'arena').length,
      nexa: cars.filter((c) => c.channel.toLowerCase() === 'nexa').length,
    };
  }, [cars]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (channel !== 'All') count++;
    if (bodyType !== 'All') count++;
    if (fuel !== 'All') count++;
    if (transmission !== 'All') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [channel, bodyType, fuel, transmission, searchQuery]);

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

  // Group filtered cars into rows of 3 for scroll-triggered row reveals
  const carRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < filteredCars.length; i += 3) {
      rows.push({
        id: `row-${i}-${channel}-${bodyType}-${fuel}-${transmission}-${sortBy}-${searchQuery}`,
        items: filteredCars.slice(i, i + 3),
      });
    }
    return rows;
  }, [filteredCars, channel, bodyType, fuel, transmission, sortBy, searchQuery]);

  return (
    <motion.div
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 space-y-6 sm:space-y-8"
    >
      {/* Top Heading Banner */}
      <motion.div
        variants={sectionVariants}
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden"
      >
        {/* Subtle accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-blue" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-red-50 border border-red-200/70 text-brand-red text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                Authorized Dealership Catalog
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                {selectedCity}
              </span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">
              Explore Maruti Suzuki Range in <span className="text-brand-blue">{selectedCity}</span>
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Browse genuine ex-showroom prices, complete variant technical specifications, fuel efficiency, and schedule instant test drives across our {selectedCity} dealerships.
            </p>

            {/* Trust and feature badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 pt-1 text-[11px] sm:text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                Verified Ex-Showroom Pricing
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                Arena &amp; Nexa Full Range
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                Doorstep Test Drives
              </span>
            </div>
          </div>

          {/* Quick Stats & Direct Action Box */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0 lg:w-72">
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
                {cars.length}+
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Available Models
              </div>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-2xl sm:text-3xl font-display font-black text-brand-blue">
                100%
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Genuine Pricing
              </div>
            </div>
            <div className="col-span-2 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Book A Test Drive</p>
                <p className="text-[11px] text-slate-600 truncate">Doorstep or showroom</p>
              </div>
              <button
                type="button"
                onClick={() => openTestDrive && openTestDrive(null)}
                className="px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold transition-colors shadow-sm shrink-0"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compact Mobile Filter Bar (Mobile Only: ~80px height) */}
      <motion.div
        variants={sectionVariants}
        className="block md:hidden bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm space-y-2.5"
      >
        {/* Top Line: Search Input + Filters Trigger Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Swift, Brezza, Fronx..."
              className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-blue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm ${
              activeFiltersCount > 0
                ? 'bg-brand-blue text-white'
                : 'bg-slate-900 text-white'
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
        </div>

        {/* Second Line: Showroom Quick Tabs + Sort Dropdown */}
        <div className="flex items-center justify-between gap-2">
          {/* Quick Showroom Channel Chips */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/60 overflow-x-auto shrink-0">
            {channels.map((c) => {
              const isSelected = channel === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all shrink-0 ${
                    isSelected
                      ? c === 'Nexa'
                        ? 'bg-slate-950 text-white shadow-xs'
                        : c === 'Arena'
                        ? 'bg-brand-blue text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  {c === 'All' ? 'All' : c}
                </button>
              );
            })}
          </div>

          {/* Compact Sort Select & Count */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
              {filteredCars.length} cars
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="mileage">Mileage</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary (If any active) */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-[11px]">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue font-semibold border border-blue-100">
                "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')}>
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {channel !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                {channel}
                <button type="button" onClick={() => setChannel('All')}>
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {bodyType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                {bodyType}
                <button type="button" onClick={() => setBodyType('All')}>
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {fuel !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                {fuel}
                <button type="button" onClick={() => setFuel('All')}>
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {transmission !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                {transmission}
                <button type="button" onClick={() => setTransmission('All')}>
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-bold text-red-600 hover:underline ml-auto"
            >
              Reset
            </button>
          </div>
        )}
      </motion.div>

      {/* Desktop Expanded Interactive Filter Control Panel (Hidden on Mobile) */}
      <motion.div
        variants={sectionVariants}
        className="hidden md:block bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5"
      >
        {/* Top Control Bar: Search + Results Count + Sort & Reset */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Search Input & Model Count */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Swift, Brezza, Grand Vitara, Fronx..."
                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
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

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-brand-blue border border-blue-100/80 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                {filteredCars.length} {filteredCars.length === 1 ? 'Model' : 'Models'} Available
              </span>
            </div>
          </div>

          {/* Sort By & Reset Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-semibold hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="mileage">Highest Mileage</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100/70 border border-red-100 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Channel Segmented Control Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 sm:w-24">
            Showroom:
          </span>
          <div className="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 max-w-full overflow-x-auto">
            {channels.map((c) => {
              const isSelected = channel === c;
              const count =
                c === 'All'
                  ? channelCounts.all
                  : c === 'Arena'
                  ? channelCounts.arena
                  : channelCounts.nexa;

              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? c === 'Nexa'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : c === 'Arena'
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c === 'Arena' && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-red-500'}`} />
                  )}
                  {c === 'Nexa' && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-300' : 'bg-slate-700'}`} />
                  )}
                  <span>{c === 'All' ? 'All Channels' : c}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Rows Grid: Body Type, Fuel, Gearbox */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Body Type */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Body Type
            </span>
            <div className="flex flex-wrap gap-1.5">
              {bodyTypes.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBodyType(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    bodyType === b
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Fuel Type
            </span>
            <div className="flex flex-wrap gap-1.5">
              {fuelTypes.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFuel(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    fuel === f
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Gearbox
            </span>
            <div className="flex flex-wrap gap-1.5">
              {transmissionTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTransmission(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    transmission === t
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Tag Strip */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Active Filters:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-brand-blue font-semibold">
                Search: "{searchQuery}"
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-600"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {channel !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
                Channel: {channel}
                <button
                  type="button"
                  onClick={() => setChannel('All')}
                  className="hover:text-red-600"
                  aria-label="Remove channel filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {bodyType !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
                Body: {bodyType}
                <button
                  type="button"
                  onClick={() => setBodyType('All')}
                  className="hover:text-red-600"
                  aria-label="Remove body filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {fuel !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
                Fuel: {fuel}
                <button
                  type="button"
                  onClick={() => setFuel('All')}
                  className="hover:text-red-600"
                  aria-label="Remove fuel filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {transmission !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
                Gearbox: {transmission}
                <button
                  type="button"
                  onClick={() => setTransmission('All')}
                  className="hover:text-red-600"
                  aria-label="Remove transmission filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-bold text-red-600 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </motion.div>

      {/* Mobile Filter Drawer Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drawer Handle */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Filter Vehicles
                  </h3>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue text-[11px] font-bold">
                      {activeFiltersCount} active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="overflow-y-auto p-5 space-y-5 flex-1 overscroll-contain">
                {/* Showroom Channel */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                    Showroom Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {channels.map((c) => {
                      const isSelected = channel === c;
                      const count =
                        c === 'All'
                          ? channelCounts.all
                          : c === 'Arena'
                          ? channelCounts.arena
                          : channelCounts.nexa;

                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setChannel(c)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 border ${
                            isSelected
                              ? c === 'Nexa'
                                ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                                : c === 'Arena'
                                ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                                : 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{c === 'All' ? 'All Channels' : c}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {count} models
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Body Type */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                    Body Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bodyTypes.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBodyType(b)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          bodyType === b
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                    Fuel Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {fuelTypes.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFuel(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          fuel === f
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gearbox */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                    Gearbox
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {transmissionTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTransmission(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          transmission === t
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Sticky Footer Action */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-brand-blue hover:bg-brand-darkBlue text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors"
                >
                  Show {filteredCars.length} {filteredCars.length === 1 ? 'Model' : 'Models'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Car Grid Results */}
      <motion.div variants={sectionVariants} className="space-y-6 sm:space-y-8">
        {carRows.length > 0 ? (
          carRows.map((row) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.14,
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {row.items.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
                  transition={{
                    duration: 0.85,
                    delay: index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm"
          >
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
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
