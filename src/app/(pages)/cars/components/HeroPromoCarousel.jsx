import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { useKalyani } from '../../../../context/KalyaniContext';

export default function HeroPromoCarousel({ banners: propBanners }) {
  const { openTestDrive } = useKalyani();
  const banners = propBanners || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = banners?.length || 0;

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused, currentIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  if (!banners || banners.length === 0) return null;
  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-100 group select-none h-[300px] sm:h-[330px] md:h-[500px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional Carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pointer-events-none">
            {/* Panel: tinted, NO backdrop blur so the car stays sharp */}
            {(currentBanner.title || currentBanner.subtitle || currentBanner.description) && (
              <div className="pointer-events-auto w-full max-w-[22rem] sm:max-w-sm md:max-w-[24rem]
                            rounded-2xl p-5 md:p-6
                            bg-slate-950/55 border border-white/15
                            shadow-xl shadow-black/20">
              {currentBanner.channel && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  {currentBanner.channel}
                </p>
              )}

              <h2 className="mt-1.5 font-display font-black text-2xl md:text-[1.9rem] leading-[1.1] tracking-tight text-white">
                {currentBanner.title}
              </h2>

              <p className="mt-2 text-sm text-white/75 leading-snug line-clamp-2">
                {currentBanner.subtitle || currentBanner.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                {currentBanner.priceText && (
                  <span className="text-lg md:text-xl font-display font-black text-white">
                    {currentBanner.priceText}
                  </span>
                )}
                {currentBanner.badge && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-white/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {currentBanner.badge}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                <Link
                  to={currentBanner.ctaLink || `/cars/${currentBanner.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition-colors"
                >
                  {currentBanner.ctaText || 'Explore Model'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => openTestDrive && openTestDrive(null)}
                  className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold border border-white/35 hover:bg-white/10 transition-colors"
                >
                  Book Test Drive
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      </AnimatePresence>

      {/* Dots */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id || i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/50 hover:bg-white/80'
                  }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}