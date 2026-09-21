import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import CarCard from '../widgets/CarCard';

const FILTER_CATEGORIES = ['All Types', 'SUV', 'Hatchback', 'Sedan', 'MUV'];

// Animated swipe indicator that only renders when scroll overflow is active
function ScrollIndicator({ label = 'swipe' }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 select-none py-1">
      <motion.span
        animate={{ x: [-2, 2, -2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex items-center text-blue-600"
      >
        <ArrowLeft className="w-3 h-3" />
      </motion.span>
      <span className="uppercase tracking-wider text-[10px]">{label}</span>
      <motion.span
        animate={{ x: [2, -2, 2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex items-center text-blue-600"
      >
        <ArrowRight className="w-3 h-3" />
      </motion.span>
    </div>
  );
}

export default function FeaturedCarsSection({ cars = [], selectedCity = 'Bengaluru' }) {
  const [selectedBodyType, setSelectedBodyType] = useState('All Types');

  // Refs
  const pillsContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Desktop side arrows state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mobile-only active scroll indicators state
  const [pillsScrollable, setPillsScrollable] = useState(false);
  const [carsScrollable, setCarsScrollable] = useState(false);

  // Filter cars to featured list first, then by active body type category
  const featuredCars = cars.some((c) => c.isFeatured)
    ? cars.filter((c) => c.isFeatured)
    : cars;

  const filteredCars = featuredCars.filter((car) => {
    if (selectedBodyType === 'All Types') return true;
    return car.bodyType?.toLowerCase() === selectedBodyType.toLowerCase();
  });

  const isCarouselDesktop = filteredCars.length > 3;

  // Check scroll boundary & whether containers actually overflow
  const updateScrollStates = useCallback(() => {
    // 1. Pills scroll check (Mobile only)
    if (pillsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = pillsContainerRef.current;
      const hasOverflow = scrollWidth > clientWidth + 4;
      const notScrolledToEnd = scrollLeft + clientWidth < scrollWidth - 10;
      setPillsScrollable(hasOverflow && notScrolledToEnd);
    }

    // 2. Car cards scroll check (Mobile & Desktop arrows)
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const hasOverflow = scrollWidth > clientWidth + 4;
      const notScrolledToEnd = scrollLeft + clientWidth < scrollWidth - 10;

      setCarsScrollable(hasOverflow && notScrolledToEnd);
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(hasOverflow && notScrolledToEnd);
    }
  }, []);

  useEffect(() => {
    const carsEl = scrollContainerRef.current;
    const pillsEl = pillsContainerRef.current;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollStates();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateScrollStates();
    const t1 = setTimeout(updateScrollStates, 150);
    const t2 = setTimeout(updateScrollStates, 400);

    if (carsEl) carsEl.addEventListener('scroll', onScroll, { passive: true });
    if (pillsEl) pillsEl.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (carsEl) carsEl.removeEventListener('scroll', onScroll);
      if (pillsEl) pillsEl.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [updateScrollStates, selectedBodyType, filteredCars.length]);

  const handleFilterChange = (category) => {
    setSelectedBodyType(category);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const containerClasses = isCarouselDesktop
    ? 'flex items-stretch overflow-x-auto overscroll-x-contain touch-pan-y snap-x snap-mandatory md:snap-none scrollbar-none gap-6 pt-2 pb-6 px-1'
    : 'flex items-stretch overflow-x-auto overscroll-x-contain touch-pan-y snap-x snap-mandatory md:snap-none scrollbar-none gap-6 pt-2 pb-6 px-1 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 lg:pt-0 lg:px-0';

  const cardWrapperClasses = isCarouselDesktop
    ? 'w-[85vw] sm:w-[350px] lg:w-[380px] shrink-0 snap-start md:snap-align-none flex flex-col'
    : 'w-[85vw] sm:w-[350px] shrink-0 snap-start md:snap-align-none lg:w-auto lg:shrink flex flex-col';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* Header & Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
      >
        <div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Featured Maruti Suzuki Models
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Explore the latest top-selling Arena & Nexa vehicles available in {selectedCity} with best festive prices.
          </p>
        </div>

        {/* Filter Pills Column */}
        <div className="flex flex-col items-start md:items-end gap-1.5 w-full md:w-auto">
          {/* 1. Mobile Pill Indicator - ONLY renders if pills overflow on mobile */}
          {pillsScrollable && (
            <div className="flex md:hidden self-end">
              <ScrollIndicator label="swipe categories" />
            </div>
          )}

          {/* Responsive Filter Strip */}
          <div
            ref={pillsContainerRef}
            className="w-full md:w-auto overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 py-1 flex items-center gap-2"
          >
            {FILTER_CATEGORIES.map((type) => {
              const isSelected = selectedBodyType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleFilterChange(type)}
                  className={`relative shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${isSelected
                      ? 'text-white bg-blue-600 shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 2. Mobile Car Cards Indicator - ONLY renders on mobile when cards overflow */}
      {carsScrollable && (
        <div className="flex lg:hidden justify-end mb-2 pr-1">
          <ScrollIndicator label="swipe models" />
        </div>
      )}

      {/* Cars Container */}
      <div className="relative group">
        {/* Desktop Left Arrow Button */}
        {filteredCars.length > 3 && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous cars"
            className="hidden lg:flex absolute -left-4 xl:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-slate-200 items-center justify-center text-slate-800 hover:text-blue-600 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:text-slate-800 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.25]" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          style={{ overscrollBehaviorX: 'contain', touchAction: 'pan-y' }}
          className={containerClasses}
        >
          <AnimatePresence mode="popLayout">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.45,
                  delay: (index % 3) * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className={cardWrapperClasses}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop Right Arrow Button */}
        {filteredCars.length > 3 && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next cars"
            className="hidden lg:flex absolute -right-4 xl:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-slate-200 items-center justify-center text-slate-800 hover:text-blue-600 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:text-slate-800 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.25]" />
          </button>
        )}
      </div>

      {/* View all cars banner CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 text-center"
      >
        <Link
          to="/cars"
          className="inline-flex group items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-colors"
        >
          <span>Explore All Maruti Models & Variants</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </motion.div>
    </section>
  );
}