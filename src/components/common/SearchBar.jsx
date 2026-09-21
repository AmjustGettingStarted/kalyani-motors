import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKalyani } from '../../context/KalyaniContext';
import { Search, X, ArrowRight, Car, Wrench } from 'lucide-react';

export default function SearchBar({
  placeholder = 'Search Swift, Grand Vitara, periodic service...',
  className = '',
  isScrolled = false,
  onOpenChange,
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { cars, services } = useKalyani();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const trimmed = query.trim().toLowerCase();
  const isDropdownOpen = Boolean(isOpen && trimmed);

  // Notify parent of dropdown open state
  useEffect(() => {
    onOpenChange?.(isDropdownOpen);
  }, [isDropdownOpen, onOpenChange]);

  // Close when clicking or tapping outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const matchedCars = trimmed
    ? (cars || []).filter(
      (c) =>
        c.name?.toLowerCase().includes(trimmed) ||
        c.tagline?.toLowerCase().includes(trimmed) ||
        c.channel?.toLowerCase().includes(trimmed) ||
        c.bodyType?.toLowerCase().includes(trimmed) ||
        c.fuelTypes?.some((f) => f.toLowerCase().includes(trimmed))
    )
    : [];

  const periodicList = services?.periodicMaintenance || [];
  const packagesList = services?.specializedPackages || [];

  const matchedServices = trimmed
    ? [
      ...periodicList.filter(
        (s) =>
          s.interval?.toLowerCase().includes(trimmed) ||
          s.description?.toLowerCase().includes(trimmed)
      ),
      ...packagesList.filter(
        (s) =>
          s.title?.toLowerCase().includes(trimmed) ||
          s.subtitle?.toLowerCase().includes(trimmed)
      ),
    ]
    : [];

  const hasResults = matchedCars.length > 0 || matchedServices.length > 0;

  const handleSelectCar = (slug) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/cars/${slug}`);
  };

  const handleSelectService = () => {
    setIsOpen(false);
    setQuery('');
    navigate('/service');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (matchedCars.length > 0) {
      handleSelectCar(matchedCars[0].slug);
    } else if (trimmed) {
      navigate(`/cars?search=${encodeURIComponent(trimmed)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search
            className={`w-4 h-4 absolute left-3.5 pointer-events-none transition-colors ${isScrolled ? 'text-slate-500' : 'text-white/80'
              }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full pl-10 pr-9 py-2 text-xs rounded-full transition-all duration-200 outline-none ${isScrolled
                ? 'bg-slate-100 text-slate-900 placeholder:text-slate-500 border border-slate-300 focus:bg-white focus:border-slate-400'
                : 'bg-transparent text-white placeholder:text-white/70 border border-white/40 hover:border-white/70 focus:border-white focus:ring-1 focus:ring-white/40'
              }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className={`absolute right-3 p-0.5 transition-colors ${isScrolled ? 'text-slate-400 hover:text-slate-600' : 'text-white/70 hover:text-white'
                }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Instant live search results dropdown */}
      {isOpen && trimmed && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
          }}
          className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 max-h-[60vh] sm:max-h-[400px] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {hasResults ? (
            <div className="space-y-3">
              {/* Cars Matches */}
              {matchedCars.length > 0 && (
                <div>
                  <div className="px-4 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-blue-700" /> Car Models ({matchedCars.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/cars?search=${encodeURIComponent(trimmed)}`);
                        setIsOpen(false);
                      }}
                      className="text-blue-700 hover:underline capitalize"
                    >
                      View All
                    </button>
                  </div>
                  <div className="mt-1 divide-y divide-slate-50">
                    {matchedCars.map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => handleSelectCar(car.slug)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={car.heroImage || car.image}
                            alt={car.name}
                            className="w-12 h-8 object-cover rounded-md border border-slate-100"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center gap-2">
                              <span>{car.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                                {car.channel}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {car.priceRange || car.price} {car.mileage ? `• ${car.mileage}` : ''}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Matches */}
              {matchedServices.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="px-4 py-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5 text-red-600" /> Maintenance & Services
                  </div>
                  <div className="mt-1">
                    {matchedServices.slice(0, 3).map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={handleSelectService}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-red-700">
                            {s.title || s.interval}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {s.subtitle || s.description}
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Book
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-slate-500 text-xs">
              <p className="font-semibold text-slate-700">No matching cars or services found</p>
              <p className="mt-1 text-slate-400">Try searching "Swift", "Grand Vitara", "SUV", or "Express"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}