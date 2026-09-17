import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useKalyani } from "../../context/KalyaniContext";
import CitySelector from "../widgets/CitySelector";
import SearchBar from "./SearchBar";
import { ArrowLeftRight, Menu, X } from "lucide-react";
import useHeader from "../../hooks/useHeader";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isScrolled, isHidden } = useHeader();
  const { openTestDrive } = useKalyani();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Cars", path: "/cars" },
    { name: "Service & Care", path: "/service" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isHidden ? -100 : 0,
        opacity: isHidden ? 0 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/kalyani_light.png"
              alt="Kalyani Motors"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Center: Minimalist Nav Links (No pill/border background) */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-xs font-semibold tracking-wide transition-colors duration-200 ${
                    isScrolled
                      ? isActive
                        ? "text-red-600 font-bold"
                        : "text-slate-700 hover:text-red-600"
                      : isActive
                        ? "text-white font-bold"
                        : "text-white/80 hover:text-white"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right: Themed Search Bar, Compare Icon, City Selector */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-56 lg:w-64">
              <SearchBar isScrolled={isScrolled} />
            </div>

            {/* Compare Button */}
            <Link
              to="/compare"
              title="Compare Cars"
              className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center shrink-0 ${
                isScrolled
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-800/10"
                  : "bg-transparent hover:bg-white/20 backdrop-blur-md text-white border border-white/15"
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Link>

            {/* City Selector */}
            <CitySelector isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors ${
                isScrolled
                  ? "bg-slate-100 text-slate-900"
                  : "bg-white/10 text-white backdrop-blur-md border border-white/20"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="mt-3 block md:hidden">
          <SearchBar isScrolled={isScrolled} />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/20 bg-slate-950/95 backdrop-blur-xl px-5 pt-3 pb-6 space-y-4 text-white shadow-2xl">
          <div className="py-2 border-b border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              City Selected
            </p>
            <CitySelector variant="pill" isScrolled={false} />
          </div>

          <div className="space-y-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-red-500 bg-white/5"
                      : "text-slate-200 hover:text-white"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <NavLink
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-white"
            >
              <ArrowLeftRight className="w-4 h-4 text-red-500" /> Compare Cars
            </NavLink>
          </div>
        </div>
      )}
    </motion.header>
  );
}
