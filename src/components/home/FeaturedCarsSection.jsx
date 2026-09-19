import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import CarCard from '../widgets/CarCard';

const FILTER_CATEGORIES = ['All Types', 'SUV', 'Hatchback', 'Sedan', 'MUV'];

export default function FeaturedCarsSection({ cars = [], selectedCity = 'Bengaluru' }) {
  const [selectedBodyType, setSelectedBodyType] = useState('All Types');
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter cars to featured list first, then by active body type category
  const featuredCars = cars.some((c) => c.isFeatured)
    ? cars.filter((c) => c.isFeatured)
    : cars;

  const filteredCars = featuredCars.filter((car) => {
    if (selectedBodyType === 'All Types') return true;
    return car.bodyType?.toLowerCase() === selectedBodyType.toLowerCase();
  });

  // Check if desktop should render as a carousel (> 3 cars) or 3-column grid (<= 3 cars)
  const isCarouselDesktop = filteredCars.length > 3;

  // Scroll boundary evaluation for arrow buttons
  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const newCanLeft = scrollLeft > 4;
    const newCanRight = scrollLeft + clientWidth < scrollWidth - 4;
    setCanScrollLeft((prev) => (prev !== newCanLeft ? newCanLeft : prev));
    setCanScrollRight((prev) => (prev !== newCanRight ? newCanRight : prev));
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollButtons();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateScrollButtons();
    const timer1 = setTimeout(updateScrollButtons, 100);
    const timer2 = setTimeout(updateScrollButtons, 350);

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [updateScrollButtons, selectedBodyType, filteredCars.length]);

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

  // Container styling:
  // Mobile (<640px) & Tablets (<1024px): Single horizontal scroll row with CSS snap
  // Desktop (>=1024px): Grid if <= 3 cars, single-row carousel without rigid mandatory snap to prevent vertical scroll trap
  const containerClasses = isCarouselDesktop
    ? 'flex items-stretch overflow-x-auto overscroll-x-contain touch-pan-y snap-x snap-mandatory md:snap-none scrollbar-none gap-6 pt-2 pb-6 px-1'
    : 'flex items-stretch overflow-x-auto overscroll-x-contain touch-pan-y snap-x snap-mandatory md:snap-none scrollbar-none gap-6 pt-2 pb-6 px-1 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 lg:pt-0 lg:px-0';

  // Card wrapper styling:
  // Mobile: w-[85vw], Tablet: sm:w-[350px] shrink-0 snap-start
  // Desktop: lg:w-[380px] shrink-0 (if carousel) or lg:w-auto lg:shrink (if grid)
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
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
      >
        <div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Featured Maruti Suzuki Models
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Explore the latest top-selling Arena & Nexa vehicles available in {selectedCity} with best festive prices.
          </p>
        </div>

        {/* Body Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none self-start md:self-end">
          {FILTER_CATEGORIES.map((type) => {
            const isSelected = selectedBodyType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleFilterChange(type)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${isSelected
                  ? 'text-white bg-blue-600'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-800/20 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                {type}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Cars Container: Responsive Grid vs Single-Row Carousel with Side Arrows */}
      <div className="relative group">
        {/* Left Navigation Arrow */}
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

        {/* Scrollable Container - Isolated from vertical scroll hijacking */}
        <div
          ref={scrollContainerRef}
          style={{ overscrollBehaviorX: 'contain', touchAction: 'pan-y' }}
          className={containerClasses}
        >
          <AnimatePresence>
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

        {/* Right Navigation Arrow */}
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
