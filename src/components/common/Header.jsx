import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useKalyani } from '../../context/KalyaniContext';
import CitySelector from '../widgets/CitySelector';
import SearchBar from './SearchBar';
import { Phone, Menu, X, Shield, Calendar, Sparkles } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openTestDrive } = useKalyani();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Cars', path: '/cars' },
    { name: 'Outlets & Showrooms', path: '/outlets' },
    { name: 'Service & Care', path: '/service' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      {/* Top micro bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Tagline & Badges */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-200">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              Maruti Suzuki Authorized Dealer
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Arena</span>
              <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">Nexa</span>
              <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">Commercial</span>
            </div>
          </div>

          {/* Right side info & City */}
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:+919845012345"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium text-slate-300"
            >
              <Phone className="w-3 h-3 text-red-400" />
              <span className="hidden md:inline text-slate-400">Toll-Free Helpline:</span>
              <span className="font-bold text-white">+91 98450 12345</span>
            </a>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 hidden lg:inline">City:</span>
              <CitySelector variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Kalyani Motors Dealership Branding */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-900/30 group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <div className="font-display font-black text-xl tracking-tight text-slate-900 leading-none group-hover:text-blue-800 transition-colors">
                KALYANI <span className="text-red-600">MOTORS</span>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">
                Maruti Suzuki Arena & Nexa
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'text-blue-800 bg-blue-50/80 font-extrabold shadow-sm'
                      : 'text-slate-700 hover:text-blue-800 hover:bg-slate-100'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Search bar on desktop */}
          <div className="hidden md:block w-72 lg:w-80">
            <SearchBar />
          </div>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openTestDrive()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all transform active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Test Drive</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="mt-3 block md:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="py-2">
            <p className="text-xs font-bold uppercase text-slate-400 mb-2">City Selected</p>
            <CitySelector variant="pill" />
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openTestDrive();
              }}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm text-center shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book a Test Drive
            </button>

            <Link
              to="/service"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-blue-800 text-white font-bold text-sm text-center shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> Book Car Service
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
