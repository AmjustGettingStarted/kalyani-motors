import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
} from '../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { ToastAction } from '../ui/toast';
import { useToast } from '../ui/use-toast';
import { ArrowRight, Heart, ArrowLeftRight } from 'lucide-react';

export default function CarCard({ car }) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [displayBadge, setDisplayBadge] = useState(car?.channel || 'Arena');

  // ── Desktop-only: Hover Color Cycling ──────────────────────────────────────
  // Max images to cycle through on hover: first 6 if more exist, or all if less
  const MAX_HOVER_IMAGES = 6;

  // Build a deduplicated list of color variant image URLs for this car (capped at 6)
  const colorImages = useMemo(() => {
    if (!car) return [];
    // 1. Prefer explicit colors array (from detail normalizer or fallback data)
    if (Array.isArray(car.colors) && car.colors.length > 0) {
      const urls = car.colors
        .map((c) => (typeof c === 'string' ? c : c?.image || c?.images))
        .filter(Boolean);
      const unique = [...new Set(urls)];
      if (unique.length > 1) return unique.slice(0, MAX_HOVER_IMAGES);
    }
    // 2. Fallback: use the images array (product images from API listing normalizer)
    if (Array.isArray(car.images) && car.images.length > 1) {
      const unique = [...new Set(car.images.filter(Boolean))];
      if (unique.length > 1) return unique.slice(0, MAX_HOVER_IMAGES);
    }
    return [];
  }, [car]);

  const hasColorVariants = colorImages.length > 1;
  const [colorIndex, setColorIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const cycleTimerRef = useRef(null);
  const preloadedRef = useRef(new Set());

  // Preload a single image URL (no-op if already cached)
  const preloadImage = useCallback((url) => {
    if (!url || preloadedRef.current.has(url)) return;
    const img = new Image();
    img.src = url;
    preloadedRef.current.add(url);
  }, []);

  // Determine if the device supports hover (desktop)
  const isDesktopPointer = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  // Start / stop the 2-second cycling interval based on hover state
  useEffect(() => {
    if (!isImageHovered || !hasColorVariants) {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
      return;
    }

    // Immediately preload all color images for this card on hover
    colorImages.forEach(preloadImage);

    cycleTimerRef.current = setInterval(() => {
      setColorIndex((prev) => {
        const next = (prev + 1) % colorImages.length;
        if (next === 0) {
          setCycleKey((k) => k + 1);
        }
        return next;
      });
    }, 2000);

    return () => {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
    };
  }, [isImageHovered, hasColorVariants, colorImages, preloadImage]);

  const handleImageMouseEnter = useCallback(() => {
    if (!hasColorVariants || !isDesktopPointer()) return;
    // Start smoothly from the hero image if present in the variant list
    const startIndex = car?.heroImage ? colorImages.indexOf(car.heroImage) : 0;
    setColorIndex(startIndex >= 0 ? startIndex : 0);
    setCycleKey((k) => k + 1);
    setIsImageHovered(true);
  }, [hasColorVariants, isDesktopPointer, car?.heroImage, colorImages]);

  const handleImageMouseLeave = useCallback(() => {
    setIsImageHovered(false);
    const startIndex = car?.heroImage ? colorImages.indexOf(car.heroImage) : 0;
    setColorIndex(startIndex >= 0 ? startIndex : 0);
    setCycleKey(0);
  }, [car?.heroImage, colorImages]);

  // The image to display: when hovering and color variants exist, use cycled color; otherwise hero
  const displayedImage = isImageHovered && hasColorVariants
    ? colorImages[colorIndex]
    : car?.heroImage;

  // Alternating fade effect between car channel and body type (same as outlet page tab)
  useEffect(() => {
    if (!car?.bodyType || !car?.channel || car.channel.toLowerCase() === car.bodyType.toLowerCase()) {
      return;
    }

    const interval = setInterval(() => {
      setDisplayBadge((prev) => (prev === car.channel ? car.bodyType : car.channel));
    }, 3000);

    return () => clearInterval(interval);
  }, [car?.channel, car?.bodyType]);

  if (!car) return null;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    toast({
      title: nextState ? 'Added to wishlist' : 'Removed from wishlist',
      description: nextState
        ? `${car.name} has been saved to your wishlist.`
        : `${car.name} was removed from your wishlist.`,
    });
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !isCompared;
    setIsCompared(nextState);

    toast({
      title: `${car.name} added to comparison`,
      description: 'Compare technical specs, mileage, and features side-by-side.',
      action: (
        <ToastAction
          altText="Compare Now"
          onClick={() => navigate('/compare')}
        >
          Compare Now
        </ToastAction>
      ),
    });
  };

  return (
    <Card
      onMouseEnter={handleImageMouseEnter}
      onMouseLeave={handleImageMouseLeave}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden min-h-[455px]"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 border-b border-slate-100">
        {/* Top Badges Bar: Channel & Body Type with alternating fade effect */}
        <div className="absolute top-3 left-4 z-10 pointer-events-none">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={displayBadge}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold uppercase tracking-wide text-slate-900 block"
            >
              {displayBadge}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Top-Right Quick Actions: Wishlist & Compare with Tooltips */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <TooltipProvider delayDuration={150}>
            {/* Wishlist Action */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleWishlistClick}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs border ${isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white/95 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 border-slate-200/90'
                    }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform active:scale-90 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''
                      }`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={5}>
                {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              </TooltipContent>
            </Tooltip>

            {/* Compare Action */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCompareClick}
                  aria-label="Add to compare"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs border ${isCompared
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-white/95 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 border-slate-200/90'
                    }`}
                >
                  <ArrowLeftRight className="w-4 h-4 transition-transform active:scale-90" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={5}>
                Add to compare
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Vehicle Image — with desktop hover color cycling */}
        <Link
          to={`/cars/${car.slug}`}
          className="block w-full h-full flex items-center justify-center relative"
        >
          {/* Base hero image (always rendered underneath, zero blank flash) */}
          <img
            src={car.heroImage}
            alt={car.name}
            className="w-full h-full object-fill object-center transform transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* variant image layer — smooth hardware-accelerated cross-fade */}
          <AnimatePresence initial={false}>
            {isImageHovered && hasColorVariants && (
              <motion.img
                key={displayedImage}
                src={displayedImage}
                alt={`${car.name} color variant`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full object-fill object-center transform pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Smile visual indicator — progress bar on hover (replaces dots style) */}
          <AnimatePresence>
            {isImageHovered && hasColorVariants && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-0 -translate-x-1/2 w-full h-1 bg-slate-900/10 overflow-hidden pointer-events-none z-10 "
              >
                <motion.div
                  key={cycleKey}
                  initial={{ width: `${(colorIndex / colorImages.length) * 100}%` }}
                  animate={{ width: `${((colorIndex + 1) / colorImages.length) * 100}%` }}
                  transition={{ duration: 2, ease: 'linear' }}
                  className="h-full rounded-full bg-blue-600"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Card Body Content */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between gap-2">
        <div>
          {/* Car Name */}
          <Link
            to={`/cars/${car.slug}`}
            className="block group-hover:text-blue-600 transition-colors duration-300"
          >
            <h3 className="text-lg font-semibold text-slate-900 leading-snug">
              {car.name}
            </h3>
          </Link>

          {/* Essential Specifications */}
          <div className="mt-4 grid grid-cols-[35%_65%] gap-2 border-y border-slate-100 py-4">
            <div className="min-w-0">
              <p className="text-xs text-slate-500 mb-1">
                Fuel Type
              </p>
              <p className="text-sm font-medium text-slate-900 break-words">
                {car.fuelTypes?.join(', ') || '—'}
              </p>
            </div>

            <div className="min-w-0 border-l border-slate-200 pl-4">
              <p className="text-xs text-slate-500 mb-1">
                Transmission
              </p>
              <p className="text-sm font-medium text-slate-900 break-words">
                {car.transmissionTypes?.join(', ') || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Price and Explore */}
        <CardFooter className="p-0 flex flex-col items-stretch gap-3">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">
              Ex-showroom
            </span>

            <div className="text-lg font-semibold text-slate-900 leading-tight">
              {car.priceRange?.split('-')[0].replace(/^from\s*/i, '').trim()
                || 'Price on request'}
            </div>
          </div>

          <Link
            to={`/cars/${car.slug}`}
            aria-label={`Explore ${car.name}`}
            className="group/btn relative w-full h-10 px-4 border border-blue-600/40 text-blue-600 rounded-xl flex items-center justify-center text-sm font-semibold overflow-hidden transition-all duration-300 ease-out hover:text-white hover:border-blue-600 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            {/* Fluid expanding blue fill on hover */}
            <span className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300 ease-out" />

            <span className="relative z-10 transition-colors duration-300">Explore</span>

            <ArrowRight className="absolute right-4 w-4 h-4 z-10 transition-transform duration-300 ease-out group-hover/btn:translate-x-1" />
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
}