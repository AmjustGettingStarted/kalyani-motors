import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKalyani } from '../../context/KalyaniContext';
import {
  Card,
  CardContent,
  CardFooter,
} from '../ui/card';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { ToastAction } from '../ui/toast';
import { useToast } from '../ui/use-toast';
import {
  Fuel,
  Gauge,
  ArrowRight,
  Star,
  ShieldCheck,
  Heart,
  ArrowLeftRight,
} from 'lucide-react';

export default function CarCard({ car }) {
  const { openTestDrive } = useKalyani();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  if (!car) return null;

  const isNexa = car.channel === 'Nexa';

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
    <Card className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden h-[455px]">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 border-b border-slate-100">
        {/* Top Badges Bar: Channel & Body Type */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
          <span
            className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-md shadow-xs ${isNexa
                ? 'bg-slate-900 text-white'
                : 'bg-blue-600 text-white'
              }`}
          >
            {car.channel}
          </span>

          <span className="px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-700 rounded-md border border-slate-200/90 shadow-xs">
            {car.bodyType}
          </span>
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

        {/* Vehicle Image (Synchronized zoom on card hover, clean background with no gradient/glow) */}
        <Link
          to={`/cars/${car.slug}`}
          className="block w-full h-full p-2.5 flex items-center justify-center"
        >
          <img
            src={car.heroImage}
            alt={car.name}
            className="w-full h-full object-contain object-center transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Card Body Content */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating, Reviews & Warranty */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{car.rating}</span>
              <span className="text-slate-400">({car.reviewsCount})</span>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> 5-Yr Warranty
            </span>
          </div>

          {/* Model Name & Tagline */}
          <Link
            to={`/cars/${car.slug}`}
            className="block group-hover:text-blue-600 transition-colors duration-300"
          >
            <h3 className="font-display font-black text-lg text-slate-900 leading-snug">
              {car.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{car.tagline}</p>
          </Link>

          {/* Quick Specs Solid Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 truncate">
              <Gauge className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate font-semibold">{car.mileage}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Fuel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-semibold">
                {car.fuelTypes?.join(', ')}
              </span>
            </div>
          </div>

          {/* Transmission Badges */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {car.transmissionTypes?.map((t) => (
              <span
                key={t}
                className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Interactive Action Row */}
        <CardFooter className="mt-4 pt-3.5 p-0 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Ex-Showroom
            </span>
            <div className="font-display font-black text-base text-slate-900 leading-tight">
              {car.priceRange?.split('-')[0].trim()}
              <span className="text-xs font-normal text-slate-500"> onw.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Book Test Drive Button using shadcn Button */}
            {openTestDrive && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openTestDrive(car)}
                className="h-9 px-3 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border-red-200 rounded-xl transition-colors duration-500 shadow-xs"
              >
                Test Drive
              </Button>
            )}

            {/* View Details Navigation Button: Smooth and slow color transition from blue-500 to blue-600 */}
            <Link to={`/cars/${car.slug}`} aria-label={`View ${car.name} details`}>
              <div
                style={{
                  transition: 'background-color 750ms ease-in-out, color 750ms ease-in-out, border-color 750ms ease-in-out',
                }}
                className="h-9 w-9 rounded-xl bg-blue-50 text-blue-500 border border-blue-200/90 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 flex items-center justify-center cursor-pointer shadow-xs"
              >
                <ArrowRight
                  style={{
                    transition: 'transform 750ms ease-in-out',
                  }}
                  className="w-4 h-4 group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}