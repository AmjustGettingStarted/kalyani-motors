import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useKalyani } from '../../../context/KalyaniContext';
import useModels from '../../../components/hooks/useModels';
import useModelCars from '../../../components/hooks/useModelCars';
import useBanners from '../../../components/hooks/useBanners';
import useOutlets from '../../../components/hooks/useOutlets';
import CarCard from '../../../components/widgets/CarCard';
import HeroPromoCarousel from './components/HeroPromoCarousel';
import FilterSidebar from './components/FilterSidebar';
import ControlsHeader from './components/ControlsHeader';
import { Car, MapPin, ChevronRight, ChevronLeft, X, SlidersHorizontal } from 'lucide-react';
import useHeader from '../../../components/hooks/useHeader';

const ITEMS_PER_PAGE = 9;

const CITY_MONUMENT_BACKGROUNDS = {
  bengaluru: '/assets/BengaluruBG.png',
  bangalore: '/assets/BengaluruBG.png',
  hyderabad: '/assets/HyderabadBG.png',
  hydrabad: '/assets/HyderabadBG.png',
  mysore: '/assets/MysoreBG.png',
  chennai: '/assets/ChennaiBG.png',
};

export default function CarsPage() {
  const { selectedCity } = useKalyani();
  const { data: cars = [] } = useModels();
  const { data: modelCars = [] } = useModelCars();
  const { data: allBanners = {} } = useBanners();
  const { data: allOutlets = [] } = useOutlets();
  const { isHidden } = useHeader();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCity = selectedCity || 'Bengaluru';
  const activeCityKey = currentCity.toLowerCase();
  const activeCityBg = CITY_MONUMENT_BACKGROUNDS[activeCityKey] || CITY_MONUMENT_BACKGROUNDS.bengaluru;

  // Scroll-to-reveal for background monument skyline
  const carsSectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: carsSectionRef,
    offset: ['start 0.85', 'end end'],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 0.2, 0.75, 0.88]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '3%']);

  const locations = useMemo(() => {
    const city = currentCity.toLowerCase();
    const filtered = allOutlets.filter((l) => (l.city || '').toLowerCase() === city);
    return filtered.length > 0 ? filtered : allOutlets;
  }, [allOutlets, currentCity]);

  const cityBanners = useMemo(() => {
    return allBanners[currentCity] || allBanners['Bengaluru'] || [];
  }, [allBanners, currentCity]);

  const bodyOptions = useMemo(() => {
    const fromApi = [...new Set(modelCars.flatMap((m) => m.bodyTypes || []).filter(Boolean))];
    return fromApi.length > 0 ? fromApi : ['Hatchback', 'Sedan', 'SUV', 'MPV'];
  }, [modelCars]);

  const fuelOptions = useMemo(() => {
    const fromApi = [...new Set(modelCars.flatMap((m) => m.fuelTypes || []).filter(Boolean))];
    return fromApi.length > 0 ? fromApi : ['Petrol', 'CNG', 'Strong Hybrid'];
  }, [modelCars]);

  const transmissionOptions = useMemo(() => {
    const fromApi = [...new Set(modelCars.flatMap((m) => m.transmissionTypes || []).filter(Boolean))];
    return fromApi.length > 0 ? fromApi : ['Manual', 'Automatic'];
  }, [modelCars]);

  // Filters State
  const [channel, setChannel] = useState(searchParams.get('channel') || 'All');
  const [bodyTypesSelected, setBodyTypesSelected] = useState(() => {
    const b = searchParams.get('body');
    return b ? [b] : [];
  });
  const [fuelTypesSelected, setFuelTypesSelected] = useState(() => {
    const f = searchParams.get('fuel');
    return f ? [f] : [];
  });
  const [transmissionSelected, setTransmissionSelected] = useState(() => {
    const t = searchParams.get('transmission');
    return t ? [t] : [];
  });
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with searchParams if present
  useEffect(() => {
    const q = searchParams.get('search');
    const ch = searchParams.get('channel');
    if (q !== null) setSearchQuery(q);
    if (ch !== null) setChannel(ch);
  }, [searchParams]);

  // Reset page to 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [channel, bodyTypesSelected, fuelTypesSelected, transmissionSelected, maxPrice, selectedLocation, searchQuery, sortBy]);

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

  // Multi-select toggle helpers
  const toggleBodyType = (type) => {
    setBodyTypesSelected((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const toggleFuel = (type) => {
    setFuelTypesSelected((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const toggleTransmission = (type) => {
    setTransmissionSelected((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setChannel('All');
    setBodyTypesSelected([]);
    setFuelTypesSelected([]);
    setTransmissionSelected([]);
    setMaxPrice(3000000);
    setSelectedLocation('All');
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Selected showroom details
  const activeLocationObj = useMemo(() => {
    if (selectedLocation === 'All') return null;
    return locations.find((l) => String(l.id) === String(selectedLocation)) || null;
  }, [selectedLocation, locations]);

  // Available counts computation for badges
  const availableCounts = useMemo(() => {
    const counts = {
      channel: {
        all: cars.length,
        arena: cars.filter((c) => c.channel?.toLowerCase() === 'arena').length,
        nexa: cars.filter((c) => c.channel?.toLowerCase() === 'nexa').length,
        commercial: cars.filter((c) => c.channel?.toLowerCase() === 'commercial').length,
      },
      bodyType: {},
      fuel: {},
      transmission: {},
    };

    bodyOptions.forEach((b) => {
      counts.bodyType[b] = cars.filter((c) => {
        const cb = c.bodyType?.toLowerCase() || '';
        const sb = b.toLowerCase();
        if (sb === 'mpv' || sb === 'muv') return cb === 'mpv' || cb === 'muv';
        return cb === sb;
      }).length;
    });

    fuelOptions.forEach((f) => {
      counts.fuel[f] = cars.filter((c) => c.fuelTypes?.includes(f)).length;
    });

    transmissionOptions.forEach((t) => {
      counts.transmission[t] = cars.filter((c) => c.transmissionTypes?.includes(t)).length;
    });

    return counts;
  }, [cars, bodyOptions, fuelOptions, transmissionOptions]);

  // Active filters array for dismissible badges
  const activeFilters = useMemo(() => {
    const list = [];
    if (searchQuery.trim()) {
      list.push({ type: 'search', label: `"${searchQuery.trim()}"` });
    }
    if (channel !== 'All') {
      list.push({ type: 'channel', label: `Channel: ${channel}` });
    }
    bodyTypesSelected.forEach((b) => {
      list.push({ type: 'body', label: b, value: b });
    });
    fuelTypesSelected.forEach((f) => {
      list.push({ type: 'fuel', label: f, value: f });
    });
    transmissionSelected.forEach((t) => {
      list.push({ type: 'transmission', label: t, value: t });
    });
    if (maxPrice < 3000000) {
      list.push({ type: 'price', label: `< ₹ ${(maxPrice / 100000).toFixed(1)} L` });
    }
    if (activeLocationObj) {
      list.push({
        type: 'location',
        label: activeLocationObj.name.replace(/Maruti Suzuki\s*/i, '').replace(/Kalyani Motors,?\s*/i, ''),
      });
    }
    return list;
  }, [
    searchQuery,
    channel,
    bodyTypesSelected,
    fuelTypesSelected,
    transmissionSelected,
    maxPrice,
    activeLocationObj,
  ]);

  const removeFilter = (filter) => {
    if (filter.type === 'search') setSearchQuery('');
    if (filter.type === 'channel') setChannel('All');
    if (filter.type === 'body') toggleBodyType(filter.value);
    if (filter.type === 'fuel') toggleFuel(filter.value);
    if (filter.type === 'transmission') toggleTransmission(filter.value);
    if (filter.type === 'price') setMaxPrice(3000000);
    if (filter.type === 'location') setSelectedLocation('All');
  };

  // Main real-time filtering & sorting logic
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Channel filter
        if (channel !== 'All' && car.channel.toLowerCase() !== channel.toLowerCase()) {
          return false;
        }

        // Dealership location filter (filters by showroom category/channel)
        if (activeLocationObj && activeLocationObj.category) {
          const locCat = activeLocationObj.category.toLowerCase();
          if (locCat === 'arena' && car.channel.toLowerCase() !== 'arena') return false;
          if (locCat === 'nexa' && car.channel.toLowerCase() !== 'nexa') return false;
        }

        // Body type filter (multi-select, treats MUV and MPV equivalently)
        if (bodyTypesSelected.length > 0) {
          const carBody = car.bodyType.toLowerCase();
          const matches = bodyTypesSelected.some((selected) => {
            const s = selected.toLowerCase();
            if (s === 'mpv' || s === 'muv') {
              return carBody === 'mpv' || carBody === 'muv';
            }
            return carBody === s;
          });
          if (!matches) return false;
        }

        // Fuel type filter (multi-select)
        if (fuelTypesSelected.length > 0) {
          const matches = fuelTypesSelected.some((selected) =>
            car.fuelTypes?.includes(selected)
          );
          if (!matches) return false;
        }

        // Transmission filter (multi-select)
        if (transmissionSelected.length > 0) {
          const matches = transmissionSelected.some((selected) =>
            car.transmissionTypes?.includes(selected)
          );
          if (!matches) return false;
        }

        // Price range filter
        if (maxPrice < 3000000 && car.startingPrice > maxPrice) {
          return false;
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            car.name.toLowerCase().includes(q) ||
            car.tagline.toLowerCase().includes(q) ||
            car.bodyType.toLowerCase().includes(q) ||
            car.channel.toLowerCase().includes(q) ||
            car.fuelTypes?.some((f) => f.toLowerCase().includes(q));
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
        if (sortBy === 'newest') {
          const newSlugs = ['swift', 'dzire', 'fronx', 'grand-vitara', 'invicto'];
          const idxA = newSlugs.indexOf(a.slug);
          const idxB = newSlugs.indexOf(b.slug);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
        }
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    cars,
    channel,
    activeLocationObj,
    bodyTypesSelected,
    fuelTypesSelected,
    transmissionSelected,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  // Pagination computations (9 cars per page)
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);

  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCars, currentPage]);

  // Group paginated cars into rows of 3 for scroll-triggered row reveals
  const carRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < paginatedCars.length; i += 3) {
      rows.push({
        id: `row-${currentPage}-${i}`,
        items: paginatedCars.slice(i, i + 3),
      });
    }
    return rows;
  }, [paginatedCars, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const target = document.getElementById('cars-controls-top');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] flex flex-col pt-[68px] sm:pt-[72px]">
      {/* Scroll-Revealed City Monument Background Layer */}
      <motion.div
        style={{ opacity: bgOpacity, y: bgY }}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeCityBg}
            src={activeCityBg}
            alt={`${currentCity} Monument Background`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full object-cover object-center select-none brightness-[1.05] contrast-[0.95]"
          />
        </AnimatePresence>
      </motion.div>

      {/* 1. Hero Promotional Banner Carousel (Slow & Smooth Fade In) */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        <HeroPromoCarousel banners={cityBanners} />
      </motion.div>

      {/* 2. Main Page Layout (Two-Column Split-View) */}
      <div
        ref={carsSectionRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1"
      >
        {/* Page Header / Breadcrumbs (Slow & Smooth Entrance) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <Link to="/" className="hover:text-brand-blue transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold">New Vehicles</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-brand-blue font-bold">{selectedCity}</span>
            </nav>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Maruti Suzuki Cars in <span className="text-brand-blue">{selectedCity}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-brand-blue text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Kalyani Dealership Pricing</span>
            </span>
          </div>
        </motion.div>

        {/* Two-Column Layout Container defining sticky boundary */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Sticky Sidebar (Slow & Smooth Entrance) */}
          <motion.aside
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full lg:w-72 shrink-0 hidden lg:block lg:sticky self-start transition-[top] duration-300 ${isHidden ? 'lg:top-4' : 'lg:top-20'
              }`}
          >
            <FilterSidebar
              channel={channel}
              setChannel={setChannel}
              bodyOptions={bodyOptions}
              bodyTypesSelected={bodyTypesSelected}
              toggleBodyType={toggleBodyType}
              fuelOptions={fuelOptions}
              fuelTypesSelected={fuelTypesSelected}
              toggleFuel={toggleFuel}
              transmissionOptions={transmissionOptions}
              transmissionSelected={transmissionSelected}
              toggleTransmission={toggleTransmission}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locations={locations}
              resetFilters={resetFilters}
              activeFiltersCount={activeFilters.length}
              availableCounts={availableCounts}
              isHidden={isHidden}
            />
          </motion.aside>

          {/* Right Column: Search + Car Grid */}
          <main className="flex-1 min-w-0 space-y-6 w-full" id="cars-controls-top">
            {/* Top Controls Header (Slow & Smooth Entrance) */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ControlsHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                totalCarsCount={cars.length}
                filteredCarsCount={filteredCars.length}
                activeFilters={activeFilters}
                onRemoveFilter={removeFilter}
                onResetFilters={resetFilters}
                onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
                activeFiltersCount={activeFilters.length}
              />
            </motion.div>

            {/* Vehicle Grid (Rows Animate In on Scroll Down) */}
            {filteredCars.length > 0 ? (
              <div className="space-y-6">
                {carRows.map((row) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
                    transition={{
                      duration: 0.85,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {row.items.map((car, index) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <CarCard car={car} />
                      </motion.div>
                    ))}
                  </motion.div>
                ))}

                {/* Pagination Controls (9 cars per page) */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80"
                  >
                    <div className="text-xs text-slate-500 font-medium">
                      Showing Page <strong className="text-slate-900 font-bold">{currentPage}</strong> of{' '}
                      <strong className="text-slate-900 font-bold">{totalPages}</strong> ({filteredCars.length} models total)
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === pageNum
                            ? 'bg-brand-blue text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next Page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm my-8"
              >
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-xl text-slate-900">
                  No matching models found
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We couldn't find any Maruti Suzuki models matching your current filter selections. Try clearing some filters or searching for another model.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-brand-blue hover:bg-brand-darkBlue text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
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
                  {activeFilters.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue text-[11px] font-bold">
                      {activeFilters.length} active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Clear all
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

              {/* Scrollable Drawer Body */}
              <div className="overflow-y-auto flex-1 overscroll-contain">
                <FilterSidebar
                  channel={channel}
                  setChannel={setChannel}
                  bodyOptions={bodyOptions}
                  bodyTypesSelected={bodyTypesSelected}
                  toggleBodyType={toggleBodyType}
                  fuelOptions={fuelOptions}
                  fuelTypesSelected={fuelTypesSelected}
                  toggleFuel={toggleFuel}
                  transmissionOptions={transmissionOptions}
                  transmissionSelected={transmissionSelected}
                  toggleTransmission={toggleTransmission}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  locations={locations}
                  resetFilters={resetFilters}
                  activeFiltersCount={activeFilters.length}
                  availableCounts={availableCounts}
                  isMobileDrawer={true}
                  onCloseDrawer={() => setIsMobileFilterOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
