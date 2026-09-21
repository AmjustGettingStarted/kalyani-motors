import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useKalyani } from "../../context/KalyaniContext";
import CitySelector from "../widgets/CitySelector";
import SearchBar from "./SearchBar";
import {
  ArrowLeftRight,
  Menu,
  X,
  Home,
  Car,
  Wrench,
  MapPin,
  ChevronRight,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import useHeader from "../hooks/useHeader";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const { isScrolled, isHidden } = useHeader();
  const {
    selectedCity,
    openTestDrive,
  } = useKalyani();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsMobileSearchActive(false);
  }, [location.pathname]);

  // Reset search active state when mobile menu closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setIsMobileSearchActive(false);
    }
  }, [mobileMenuOpen]);

  // Close mobile menu on desktop screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Robust body scroll lock when mobile menu is open (supports iOS Safari & mobile browsers)
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      const originalBodyStyles = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        width: document.body.style.width,
        overflow: document.body.style.overflow,
        paddingRight: document.body.style.paddingRight,
      };
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.position = originalBodyStyles.position;
        document.body.style.top = originalBodyStyles.top;
        document.body.style.left = originalBodyStyles.left;
        document.body.style.right = originalBodyStyles.right;
        document.body.style.width = originalBodyStyles.width;
        document.body.style.overflow = originalBodyStyles.overflow;
        document.body.style.paddingRight = originalBodyStyles.paddingRight;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Cars", path: "/cars" },
    { name: "Service & Care", path: "/service" },
    { name: "Contact Us", path: "/contact" },
  ];

  const mobileNavItems = [
    {
      name: "Home",
      path: "/",
      subtitle: "Overview & Latest Offers",
      icon: Home,
    },
    {
      name: "All Cars",
      path: "/cars",
      subtitle: "Explore Arena & Nexa Lineup",
      badge: "Showroom",
      icon: Car,
    },
    {
      name: "Service & Care",
      path: "/service",
      subtitle: "Periodic Maintenance & Body Care",
      badge: "Express",
      icon: Wrench,
    },
    {
      name: "Compare Cars",
      path: "/compare",
      subtitle: "Side-by-side specs, price & mileage",
      icon: ArrowLeftRight,
    },
    {
      name: "Contact & Outlets",
      path: "/contact",
      subtitle: "Find Dealerships, Service & Workshops",
      icon: MapPin,
    },
  ];

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isHidden && !mobileMenuOpen ? -100 : 0,
        opacity: isHidden && !mobileMenuOpen ? 0 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
        : "bg-gradient-to-b from-black/80 via-black/40 to-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/kalyani_light.png"
              alt="Kalyani Motors"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-xs font-semibold tracking-wide transition-colors duration-200 ${isScrolled
                    ? isActive
                      ? "text-blue-600 font-bold"
                      : "text-slate-700 hover:text-blue-600"
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

          {/* Right: Desktop Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-56 lg:w-64">
              <SearchBar isScrolled={isScrolled} />
            </div>

            {/* Compare Button */}
            <Link
              to="/compare"
              title="Compare Cars"
              className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center shrink-0 ${isScrolled
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
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
              className={`p-2 rounded-xl transition-colors ${isScrolled
                ? "bg-slate-100 text-slate-900 border border-slate-200"
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
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              key="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 lg:hidden"
              aria-hidden="true"
            />

            <motion.div
              key="mobile-drawer-content"
              data-lenis-prevent="true"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ touchAction: isMobileSearchActive ? "none" : "pan-y" }}
              className={`lg:hidden border-t px-4 sm:px-6 pt-3.5 pb-7 space-y-4 shadow-2xl transition-colors duration-300 max-h-[85vh] ${isMobileSearchActive ? "overflow-y-hidden" : "overflow-y-auto overscroll-contain"
                } ${isScrolled
                  ? "bg-white/98 backdrop-blur-2xl border-slate-200 text-slate-800"
                  : "bg-neutral-950/98 backdrop-blur-2xl border-white/10 text-white"
                }`}
            >
              {/* 1. Top Search Bar */}
              <div className="pt-0.5">
                <SearchBar
                  isScrolled={isScrolled}
                  onOpenChange={setIsMobileSearchActive}
                />
              </div>

              {/* 2. City Selection Hub (Interactive Grid) */}
              <div
                className={`p-3.5 rounded-2xl border transition-colors ${isScrolled
                  ? "bg-slate-50/90 border-slate-200/80 shadow-sm"
                  : "bg-white/[0.04] border-white/10"
                  }`}
              >
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider ${isScrolled ? "text-slate-500" : "text-neutral-400"
                        }`}
                    >
                      Showroom City Hub
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold ${isScrolled ? "text-blue-700" : "text-blue-400"
                      }`}
                  >
                    {selectedCity} Active
                  </span>
                </div>

                <CitySelector variant="grid" />
              </div>

              {/* 3. Navigation Menu Links */}
              <div className="space-y-1">
                <div
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-1 mb-1.5 ${isScrolled ? "text-slate-400" : "text-neutral-500"
                    }`}
                >
                  Explore & Discover
                </div>

                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 group active:scale-[0.99] ${isScrolled
                          ? isActive
                            ? "bg-blue-50/90 text-blue-900 border border-blue-200/70 font-bold shadow-sm"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-transparent"
                          : isActive
                            ? "bg-gradient-to-r from-blue-600/20 via-blue-600/15 to-transparent text-white border border-blue-500/30 font-bold"
                            : "text-neutral-300 hover:bg-white/[0.06] hover:text-white border border-transparent"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isScrolled
                            ? "bg-slate-200/70 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700"
                            : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight flex items-center gap-2">
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-blue-600 text-white shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 truncate ${isScrolled ? "text-slate-500" : "text-neutral-400"
                              }`}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${isScrolled ? "text-slate-400" : "text-neutral-500"
                          }`}
                      />
                    </NavLink>
                  );
                })}
              </div>

              {/* 4. VIP Actions & Support */}
              <div
                className={`pt-3 border-t space-y-2.5 ${isScrolled ? "border-slate-200/80" : "border-white/10"
                  }`}
              >
                {openTestDrive && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openTestDrive();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-lg shadow-blue-700/25 transition-all active:scale-[0.98]"
                  >
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>Book a Free Test Drive</span>
                  </button>
                )}

                <a
                  href="tel:+919590990011"
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${isScrolled
                    ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-neutral-200"
                    }`}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Dealership</span>
                </a>

                {/* Trust Footer */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Authorized Maruti Suzuki Dealer</span>
                  <span>•</span>
                  <span>100+ Outlets</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}