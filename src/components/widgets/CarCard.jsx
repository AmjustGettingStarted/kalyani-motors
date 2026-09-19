import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useKalyani } from '../../context/KalyaniContext';
import { Fuel, Gauge, ArrowRight, Star, ShieldCheck } from 'lucide-react';

export default function CarCard({ car }) {
  const { openTestDrive } = useKalyani();

  if (!car) return null;

  const isNexa = car.channel === 'Nexa';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-car-card hover:shadow-car-hover transition-[transform,box-shadow] duration-250 flex flex-col overflow-hidden h-[450px] transform-gpu will-change-transform"
    >
      {/* Top badges bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span
          className={`px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-sm ${isNexa
            ? 'bg-slate-900 text-white border border-slate-700'
            : 'bg-blue-800 text-white border border-blue-700'
            }`}
        >
          {car.channel}
        </span>

        <span className="px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-700 rounded-full border border-slate-200/80 shadow-sm">
          {car.bodyType}
        </span>
      </div>

      {/* Image container */}
      <Link
        to={`/cars/${car.slug}`}
        className="block relative aspect-[16/10] overflow-hidden bg-slate-100"
      >
        <img
          src={car.heroImage}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out transform-gpu will-change-transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{car.rating}</span>
              <span className="text-slate-400">({car.reviewsCount})</span>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> 5-Yr Warranty Avail.
            </span>
          </div>

          {/* Model Name & Tagline */}
          <Link
            to={`/cars/${car.slug}`}
            className="block group-hover:text-blue-700 transition-colors"
          >
            <h3 className="font-display font-extrabold text-lg text-slate-900 leading-snug">
              {car.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">{car.tagline}</p>
          </Link>

          {/* Quick specs pill row */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 truncate">
              <Gauge className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span className="truncate font-medium">{car.mileage}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Fuel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-medium">
                {car.fuelTypes?.join(', ')}
              </span>
            </div>
          </div>

          {/* Transmission types */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {car.transmissionTypes?.map((t) => (
              <span
                key={t}
                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Ex-Showroom
            </span>
            <div className="font-display font-black text-base text-slate-900">
              {car.priceRange?.split('-')[0].trim()}
              <span className="text-xs font-normal text-slate-500"> onw.</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {openTestDrive && (
              <button
                type="button"
                onClick={() => openTestDrive(car)}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-colors duration-200 border border-red-200"
              >
                Test Drive
              </button>
            )}
            <Link
              to={`/cars/${car.slug}`}
              className="p-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-200 inline-flex items-center justify-center shadow-sm"
              title="View Model Details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}