import React, { useState, useEffect } from 'react';
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
    <Card className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden min-h-[455px]">
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

        {/* Vehicle Image */}
        <Link
          to={`/cars/${car.slug}`}
          className="block w-full h-full flex items-center justify-center"
        >
          <img
            src={car.heroImage}
            alt={car.name}
            className="w-full h-full object-fill object-center transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
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