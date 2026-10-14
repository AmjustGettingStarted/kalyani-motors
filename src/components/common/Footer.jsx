import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight, ChevronDown } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { useKalyani } from "../../context/KalyaniContext";
import useBlogPages from "../hooks/useBlogPages";
import useIconLocations from "../hooks/useIconLocations";

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
    <div className={`flex flex-wrap lg:justify-center lg:items-center gap-3 ${className}`}>
      <a
        href="https://play.google.com/store/apps/details?id=com.kalyanimotors.superapp"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label="Get it on Google Play"
      >
        <img
          src="/assets/playstore.png"
          alt="Get it on Google Play"
          className="h-9 sm:h-10 w-auto object-contain"
          loading="lazy"
        />
      </a>
      <a
        href="https://apps.apple.com/in/app/kalyani-motors-app/id6479185557"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label="Download on the App Store"
      >
        <img
          src="/assets/appstore.png"
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
  const { selectedCity } = useKalyani();
  const { data: iconLocations = [] } = useIconLocations();
  const { data: blogPages = [] } = useBlogPages();
  const validBlogPages = blogPages?.filter((p) => p && p.title) || [];

  const cityContact = iconLocations?.find(
    (loc) => loc?.city?.toLowerCase() === selectedCity?.toLowerCase()
  );

  const activePhone = cityContact?.phone || "+91 98450 12345";
  const activeAddress = cityContact?.address || "Nayandahalli, Mysore Road, Bengaluru - 560039";
  const activeEmail = cityContact?.email || "support@kalyanimotors.com";

  const socialLinks = [
    {
      label: "Facebook",
      href: cityContact?.facebook_id || "https://www.facebook.com/kalyanimotors",
      Icon: FaFacebookF,
    },
    {
      label: "Twitter",
      href: cityContact?.twitter_id || "https://twitter.com/kalyanimotors",
      Icon: FaTwitter,
    },
    {
      label: "Instagram",
      href: cityContact?.instagram_id || "https://www.instagram.com/kalyanimotors",
      Icon: FaInstagram,
    },
    {
      label: "WhatsApp",
      href: cityContact?.whatsapp
        ? cityContact.whatsapp.startsWith("http")
          ? cityContact.whatsapp
          : `https://wa.me/${cityContact.whatsapp.replace(/\D/g, "")}`
        : "https://wa.me/919590990011",
      Icon: FaWhatsapp,
    },
    {
      label: "YouTube",
      href: cityContact?.youtube_id || "https://www.youtube.com/@kalyanimotors",
      Icon: FaYoutube,
    },
  ].filter(
    (social) =>
      typeof social.href === "string" && social.href.trim() !== ""
  );

  // Accordion state for tab & mobile screens
  const [accordionOpen, setAccordionOpen] = useState({
    brand: true,
    models: false,
    service: false,
    hubs: false,
    quickLinks: false,
  });

  const toggleAccordion = (key) =>
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));

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
          <span>{activeAddress}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700">
          <Phone className="w-4 h-4 text-blue-600 shrink-0" />
          <a
            href={`tel:${activePhone.replace(/[^\d+]/g, '')}`}
            className="hover:text-blue-600 transition-colors"
          >
            {activePhone}
          </a>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700">
          <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
          <a
            href={`mailto:${activeEmail}`}
            className="hover:text-blue-600 transition-colors"
          >
            {activeEmail}
          </a>
        </div>
      </div>
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-3 pt-2">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      )}
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

  const QuickLinksContent = (
    <ul className="space-y-2.5">
      {validBlogPages.map((page) => (
        <li key={page.id || page.title}>
          <a
            href={page.blogpage_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors block"
          >
            {page.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <footer
      ref={footerRef}
      className="w-full bg-slate-50 text-slate-600 text-xs border-t border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:py-14">
        {/* 1) DESKTOP UI (>= 1024px): 40% Left : 60% Right */}
        <div className="hidden lg:grid lg:grid-cols-[40%_60%] gap-6 items-start">
          {/* Left Column (40%): Brand & Bio Info */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            custom={0.05}
            className="space-y-4 will-change-transform pr-4"
          >
            <Link to="/" className="inline-block focus:outline-none mb-1">
              <img
                src="/assets/kalyani_light.png"
                alt="Kalyani Motors - Authorized Maruti Suzuki Dealership"
                className="h-14 sm:h-16 w-auto object-contain object-left select-none"
                loading="lazy"
              />
            </Link>
            {BrandBioContent}
          </motion.div>

          {/* Right Column (60%): Links grid with App Store & Play Store underneath */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            custom={0.2}
            className="flex flex-col space-y-8 will-change-transform"
          >
            <div
              className={`grid ${validBlogPages.length > 0 ? "grid-cols-4" : "grid-cols-3"
                } gap-6`}
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
                  Outlets
                </h4>
                {DealershipContent}
              </div>

              {/* Optional CMS Quick Links */}
              {validBlogPages.length > 0 && (
                <div>
                  <h4 className="text-slate-900 font-display font-bold text-xs uppercase tracking-wider mb-4">
                    Quick Links
                  </h4>
                  {QuickLinksContent}
                </div>
              )}
            </div>

            {/* App Store & Play Store badges */}
            <div className="pt-6 border-t border-slate-200/80">
              <span className="flex justify-center items-center block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Download Kalyani Motors App
              </span>
              <StoreBadges />
            </div>
          </motion.div>
        </div>

        {/* 2) TAB & MOBILE ACCORDION UI (< 1024px) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-10 items-start lg:hidden">
          {/* Column 1 on Tablet / First items on Mobile */}
          <div className="space-y-1 md:space-y-6">
            <DropdownItem
              isLogoHeading
              isOpen={accordionOpen.brand}
              onToggle={() => toggleAccordion("brand")}
            >
              {BrandBioContent}
            </DropdownItem>

            {/* Badges: Visible here on Tablet (under logo dropdown) */}
            <div className="hidden md:block pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                Download Kalyani Motors App
              </span>
              <StoreBadges />
            </div>
          </div>

          {/* Column 2 on Tablet / Followed on Mobile */}
          <div className="space-y-1">
            <DropdownItem
              title="Popular Models"
              isOpen={accordionOpen.models}
              onToggle={() => toggleAccordion("models")}
            >
              {ModelsContent}
            </DropdownItem>

            <DropdownItem
              title="Service & Care"
              isOpen={accordionOpen.service}
              onToggle={() => toggleAccordion("service")}
            >
              {ServiceContent}
            </DropdownItem>

            <DropdownItem
              title="Outlets"
              isOpen={accordionOpen.hubs}
              onToggle={() => toggleAccordion("hubs")}
            >
              {DealershipContent}
            </DropdownItem>

            {validBlogPages.length > 0 && (
              <DropdownItem
                title="Quick Links"
                isOpen={accordionOpen.quickLinks}
                onToggle={() => toggleAccordion("quickLinks")}
              >
                {QuickLinksContent}
              </DropdownItem>
            )}
          </div>

          {/* Badges: Visible at the very bottom on Mobile */}
          <div className="block md:hidden pt-2 pb-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
              Download Kalyani Motors App
            </span>
            <StoreBadges />
          </div>
        </div>

        {/* 4) Bottom Bar */}
        <motion.div
          variants={columnVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          custom={0.45}
          className="mt-6 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 will-change-transform"
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
