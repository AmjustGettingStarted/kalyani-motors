import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight, ChevronDown } from "lucide-react";

const POPULAR_MODELS = [
  { name: "Maruti Suzuki Swift", path: "/cars/swift" },
  { name: "Grand Vitara Hybrid", path: "/cars/grand-vitara" },
  { name: "Maruti Brezza SUV", path: "/cars/brezza" },
  { name: "Nexa Baleno", path: "/cars/baleno" },
  { name: "Jimny 5-Door 4x4", path: "/cars/jimny" },
  { name: "Fronx Turbo Coupe", path: "/cars/fronx" },
  { name: "Ertiga 7-Seater MPV", path: "/cars/ertiga" },
];

const SERVICE_ITEMS = [
  { name: "Periodic Maintenance", path: "/service" },
  { name: "60-Min Express Service", path: "/service" },
  { name: "Doorstep Mobile Service", path: "/service" },
  { name: "Cashless Insurance Claims", path: "/service" },
  { name: "Accidental Body Repair", path: "/service" },
  { name: "Maruti Genuine Accessories", path: "/service" },
  { name: "24x7 Roadside Assistance", path: "/contact" },
];

const DEALERSHIP_HUBS = [
  {
    name: "Bengaluru Showrooms (Nayandahalli, Hebbal, Whitefield)",
    path: "/outlets",
  },
  {
    name: "Hyderabad Hubs (Gachibowli, Kukatpally, Jubilee Hills)",
    path: "/outlets",
  },
  { name: "Mysore Branches (Hunsur Road, Nanjangud)", path: "/outlets" },
  { name: "Chennai Centers (Anna Nagar, OMR)", path: "/outlets" },
  { name: "True Value Pre-Owned Showrooms", path: "/outlets" },
];

function StoreBadges({ className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href="https://play.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label="Get it on Google Play"
      >
        <img
          src="/assets/google-play-badge.svg"
          alt="Get it on Google Play"
          className="h-9 sm:h-10 w-auto object-contain"
          loading="lazy"
        />
      </a>
      <a
        href="https://www.apple.com/app-store/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label="Download on the App Store"
      >
        <img
          src="/assets/app-store-badge.svg"
          alt="Download on the App Store"
          className="h-9 sm:h-10 w-auto object-contain"
          loading="lazy"
        />
      </a>
    </div>
  );
}

function DropdownItem({
  title,
  isOpen,
  onToggle,
  children,
  isLogoHeading = false,
  className = "",
}) {
  return (
    <div
      className={`border-b border-slate-200/90 transition-colors ${className}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3.5 text-left font-display font-semibold text-xs uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        {isLogoHeading ? (
          <img
            src="/assets/kalyani_light.png"
            alt="Kalyani Motors Logo"
            className="h-8 sm:h-9 w-auto object-contain select-none"
            loading="lazy"
          />
        ) : (
          <span className="text-slate-900 font-bold text-xs sm:text-sm tracking-wider">
            {title}
          </span>
        )}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 shrink-0 ml-2"
        >
          <ChevronDown className="w-4 h-4 text-slate-600" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-1 text-slate-600 text-xs">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Accordion state for tab & mobile screens (tab has its own, mobile has its own)
  const [tabOpen, setTabOpen] = useState({
    brand: true,
    models: false,
    service: false,
    hubs: false,
  });

  const [mobileOpen, setMobileOpen] = useState({
    brand: true,
    models: false,
    service: false,
    hubs: false,
  });

  const toggleTab = (key) =>
    setTabOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleMobile = (key) =>
    setMobileOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const checkVisibility = () => {
      if (!footerRef.current || isVisible) return;

      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= windowHeight - 40) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("wheel", checkVisibility, { passive: true });
    window.addEventListener("touchmove", checkVisibility, { passive: true });

    checkVisibility();

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("wheel", checkVisibility);
      window.removeEventListener("touchmove", checkVisibility);
    };
  }, [isVisible]);

  const columnVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    }),
  };

  const BrandBioContent = (
    <div className="space-y-3.5">
      <p className="text-slate-600 text-xs leading-relaxed max-w-md">
        Established in 2006, Kalyani Motors is South India's premier Maruti
        Suzuki dealer group with 100+ touchpoints across Bengaluru, Hyderabad,
        Mysore, and Chennai. Serving over 2 million delighted customers.
      </p>

      <div className="pt-1 space-y-2.5">
        <div className="flex items-center gap-2.5 text-slate-700">
          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
          <span>Nayandahalli, Mysore Road, Bengaluru - 560039</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700">
          <Phone className="w-4 h-4 text-blue-600 shrink-0" />
          <a
            href="tel:+919845012345"
            className="hover:text-blue-600 transition-colors"
          >
            +91 98450 12345 / +91 98450 12346
          </a>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700">
          <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
          <a
            href="mailto:support@kalyanimotors.com"
            className="hover:text-blue-600 transition-colors"
          >
            support@kalyanimotors.com
          </a>
        </div>
      </div>
    </div>
  );

  const ModelsContent = (
    <ul className="space-y-2.5">
      {POPULAR_MODELS.map((car) => (
        <li key={car.name}>
          <Link
            to={car.path}
            className="hover:text-blue-600 transition-colors flex items-center justify-between group"
          >
            <span>{car.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        </li>
      ))}
    </ul>
  );

  const ServiceContent = (
    <ul className="space-y-2.5">
      {SERVICE_ITEMS.map((item) => (
        <li key={item.name}>
          <Link
            to={item.path}
            className="hover:text-blue-600 transition-colors block"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  const DealershipContent = (
    <ul className="space-y-2.5 leading-snug">
      {DEALERSHIP_HUBS.map((location) => (
        <li key={location.name}>
          <Link
            to={location.path}
            className="hover:text-blue-600 transition-colors block"
          >
            {location.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer
      ref={footerRef}
      className="w-full bg-slate-50 text-slate-600 text-xs border-t border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-14">
        {/* 1) DESKTOP UI (>= 1024px): 60% Left : 40% Right                */}
        <div className="hidden lg:grid lg:grid-cols-[40%_60%] gap-12 items-start">
          {/* Left Column (60%): 2 rows (80% Up & 20% Down) */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            custom={0.05}
            className="flex flex-col justify-between h-full space-y-8 will-change-transform pr-4"
          >
            {/* Row 1 (80% Up): Brand & Bio Info */}
            <div className="space-y-4">
              <Link to="/" className="inline-block focus:outline-none mb-1">
                <img
                  src="/assets/kalyani_light.png"
                  alt="Kalyani Motors - Authorized Maruti Suzuki Dealership"
                  className="h-14 sm:h-16 w-auto object-contain object-left select-none"
                  loading="lazy"
                />
              </Link>
              {BrandBioContent}
            </div>

            {/* Row 2 (20% Down): App Store & Play Store links in image format */}
            <div className="pt-4 border-t border-slate-200/80">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Download Kalyani Motors App
              </span>
              <StoreBadges />
            </div>
          </motion.div>

          {/* Right Column (40%): Rest keep the same as it is (3 columns) */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            custom={0.2}
            className="grid grid-cols-3 gap-6 will-change-transform"
          >
            {/* Popular Models */}
            <div>
              <h4 className="text-slate-900 font-display font-bold text-xs uppercase tracking-wider mb-4">
                Popular Models
              </h4>
              {ModelsContent}
            </div>

            {/* Service & Care */}
            <div>
              <h4 className="text-slate-900 font-display font-bold text-xs uppercase tracking-wider mb-4">
                Service & Care
              </h4>
              {ServiceContent}
            </div>

            {/* Dealership Hubs */}
            <div>
              <h4 className="text-slate-900 font-display font-bold text-xs uppercase tracking-wider mb-4">
                Dealership Hubs
              </h4>
              {DealershipContent}
            </div>
          </motion.div>
        </div>

        {/* 2) TAB UI (768px - 1023px):                                     */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-10 items-start">
          {/* Left Side: Brand (Logo dropdown) + App/Play Store badges */}
          <div className="space-y-6">
            {/* Left Item 1: Dropdown with Logo as dropdown heading */}
            <DropdownItem
              isLogoHeading
              isOpen={tabOpen.brand}
              onToggle={() => toggleTab("brand")}
            >
              {BrandBioContent}
            </DropdownItem>

            {/* Left Item 2: App Store & Play Store logos */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                Download Kalyani Motors App
              </span>
              <StoreBadges />
            </div>
          </div>

          {/* Right Side: Popular Models, Service & Care, Dealership Hubs */}
          <div className="space-y-1">
            {/* Right Item 1: Popular Models */}
            <DropdownItem
              title="Popular Models"
              isOpen={tabOpen.models}
              onToggle={() => toggleTab("models")}
            >
              {ModelsContent}
            </DropdownItem>

            {/* Right Item 2: Service & Care */}
            <DropdownItem
              title="Service & Care"
              isOpen={tabOpen.service}
              onToggle={() => toggleTab("service")}
            >
              {ServiceContent}
            </DropdownItem>

            {/* Right Item 3: Dealership Hubs */}
            <DropdownItem
              title="Dealership Hubs"
              isOpen={tabOpen.hubs}
              onToggle={() => toggleTab("hubs")}
            >
              {DealershipContent}
            </DropdownItem>
          </div>
        </div>

        {/* 3) MOBILE UI - All in rows - dropdown structure       */}
        <div className="block md:hidden space-y-1">
          {/* 1st section: Logo as dropdown heading */}
          <DropdownItem
            isLogoHeading
            isOpen={mobileOpen.brand}
            onToggle={() => toggleMobile("brand")}
          >
            {BrandBioContent}
          </DropdownItem>

          {/* Popular Models Dropdown */}
          <DropdownItem
            title="Popular Models"
            isOpen={mobileOpen.models}
            onToggle={() => toggleMobile("models")}
          >
            {ModelsContent}
          </DropdownItem>

          {/* Service & Care Dropdown */}
          <DropdownItem
            title="Service & Care"
            isOpen={mobileOpen.service}
            onToggle={() => toggleMobile("service")}
          >
            {ServiceContent}
          </DropdownItem>

          {/* Dealership Hubs Dropdown */}
          <DropdownItem
            title="Dealership Hubs"
            isOpen={mobileOpen.hubs}
            onToggle={() => toggleMobile("hubs")}
          >
            {DealershipContent}
          </DropdownItem>

          {/* Bottom Store Badges */}
          <div className="pt-6 pb-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
              Download Kalyani Motors App
            </span>
            <StoreBadges />
          </div>
        </div>

        {/* 4) Rights and price  */}
        <motion.div
          variants={columnVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          custom={0.45}
          className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 will-change-transform"
        >
          <p>
            © {currentYear} Kalyani Motors Pvt Ltd. All rights reserved.
            Authorized Dealer for Maruti Suzuki India Limited.
          </p>
          <div className="flex items-center gap-4 text-center md:text-right">
            <span>
              *Ex-showroom prices are indicative and subject to change by
              manufacturer without prior notice.
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
