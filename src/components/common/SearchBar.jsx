import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKalyani } from '../../context/KalyaniContext';
import { Search, X, ArrowRight, Car, Wrench } from 'lucide-react';

export default function SearchBar({ placeholder = 'Search Swift, Grand Vitara, periodic service...', className = '' }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { cars, services } = useKalyani();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const matchedCars = trimmed
    ? cars.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.tagline.toLowerCase().includes(trimmed) ||
          c.channel.toLowerCase().includes(trimmed) ||
          c.bodyType.toLowerCase().includes(trimmed) ||
          c.fuelTypes.some((f) => f.toLowerCase().includes(trimmed))
      )
    : [];

  const matchedServices = trimmed
    ? [
        ...services.periodicMaintenance.filter(
          (s) => s.interval.toLowerCase().includes(trimmed) || s.description.toLowerCase().includes(trimmed)
        ),
        ...services.specializedPackages.filter(
          (s) => s.title.toLowerCase().includes(trimmed) || s.subtitle.toLowerCase().includes(trimmed)
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
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400 transition-all shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Instant live search results dropdown */}
      {isOpen && trimmed && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 max-h-[420px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
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
                            src={car.heroImage}
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
                            <div className="text-[11px] text-slate-500">{car.priceRange} • {car.mileage}</div>
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
                          <div className="text-[11px] text-slate-500 line-clamp-1">{s.subtitle || s.description}</div>
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
