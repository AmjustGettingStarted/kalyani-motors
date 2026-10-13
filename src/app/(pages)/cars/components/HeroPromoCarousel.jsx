import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useKalyani } from '../../../../context/KalyaniContext';

export default function HeroPromoCarousel() {
  const { banners, openTestDrive } = useKalyani();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = banners?.length || 0;

  // Auto-scroll every 2.8 seconds, pauses on mouse hover
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 2800);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused]);

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
      className="relative w-full overflow-hidden bg-slate-100 group select-none h-[280px] sm:h-[310px] md:h-[340px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional Carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id || currentIndex}
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* Natural Full Brightness Background Image (No black shade/dark gradient) */}
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Clean Glassmorphic Showcase Content Panel */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-xl bg-white/90 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-white/80 shadow-xl space-y-2.5 sm:space-y-3">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    currentBanner.channel === 'Nexa'
                      ? 'bg-slate-900 text-white'
                      : 'bg-brand-blue text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {currentBanner.channel}
                </span>

                {currentBanner.tag && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80">
                    {currentBanner.tag}
                  </span>
                )}

                {currentBanner.offer && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-brand-red border border-red-200 text-[11px] font-bold">
                    <Flame className="w-3 h-3 text-brand-red fill-brand-red" />
                    {currentBanner.offer}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="font-display font-black text-lg sm:text-2xl md:text-3xl tracking-tight text-slate-900 leading-tight">
                  {currentBanner.title}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-medium line-clamp-1 sm:line-clamp-2 mt-0.5">
                  {currentBanner.subtitle || currentBanner.description}
                </p>
              </div>

              {/* Price and Features Callout */}
              <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                {currentBanner.priceText && (
                  <span className="text-sm sm:text-lg font-display font-black text-brand-blue">
                    {currentBanner.priceText}
                  </span>
                )}
                {currentBanner.badge && (
                  <span className="text-[11px] sm:text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-semibold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {currentBanner.badge}
                  </span>
                )}
              </div>

              {/* CTA Action Buttons */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <Link
                  to={currentBanner.ctaLink || `/cars/${currentBanner.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-brand-blue hover:bg-brand-darkBlue text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>{currentBanner.ctaText || 'Explore Model'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => openTestDrive && openTestDrive(null)}
                  className="inline-flex items-center gap-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200/80 transition-all duration-200"
                >
                  <span>Book Test Drive</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slick Next / Prev Overlay Arrows (Revealed on hover) */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg border border-slate-200 hover:scale-105"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg border border-slate-200 hover:scale-105"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
