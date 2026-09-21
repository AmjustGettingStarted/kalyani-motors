import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      if (!footerRef.current || isVisible) return;

      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Triggers when the top of the footer is within 80px of entering the viewport
      if (rect.top <= windowHeight - 40) {
        setIsVisible(true);
      }
    };

    // Check on scroll (both standard window and touch/wheel events)
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('wheel', checkVisibility, { passive: true });
    window.addEventListener('touchmove', checkVisibility, { passive: true });

    // Initial check in case user is already at the bottom
    checkVisibility();

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('wheel', checkVisibility);
      window.removeEventListener('touchmove', checkVisibility);
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

  return (
    <footer
      ref={footerRef}
      className="w-full bg-slate-50 text-slate-600 text-xs border-t border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Bio */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            custom={0.05}
            className="lg:col-span-2 space-y-4 will-change-transform"
          >
            <Link to="/" className="inline-block focus:outline-none mb-2">
              <img
                src="/assets/kalyani_light.png"
                alt="Kalyani Motors - Authorized Maruti Suzuki Dealership"
                className="h-11 sm:h-16 w-auto object-contain object-left select-none"
                loading="lazy"
              />
            </Link>

            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Established in 2006, Kalyani Motors is South India's premier Maruti Suzuki dealer group with 100+ touchpoints across Bengaluru, Hyderabad, Mysore, and Chennai. Serving over 2 million delighted customers.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-2.5 text-slate-700">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span>Nayandahalli, Mysore Road, Bengaluru - 560039</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <a href="tel:+919845012345" className="hover:text-blue-600 transition-colors">
                  +91 98450 12345 / +91 98450 12346
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="mailto:support@kalyanimotors.com" className="hover:text-blue-600 transition-colors">
                  support@kalyanimotors.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Popular Models */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            custom={0.15}
            className="will-change-transform"
          >
            <h4 className="text-slate-900 font-display font-bold text-sm tracking-wider uppercase mb-4">
              Popular Models
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Maruti Suzuki Swift', path: '/cars/swift' },
                { name: 'Grand Vitara Hybrid', path: '/cars/grand-vitara' },
                { name: 'Maruti Brezza SUV', path: '/cars/brezza' },
                { name: 'Nexa Baleno', path: '/cars/baleno' },
                { name: 'Jimny 5-Door 4x4', path: '/cars/jimny' },
                { name: 'Fronx Turbo Coupe', path: '/cars/fronx' },
                { name: 'Ertiga 7-Seater MPV', path: '/cars/ertiga' },
              ].map((car) => (
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
          </motion.div>

          {/* Column 3: Service & Care */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            custom={0.25}
            className="will-change-transform"
          >
            <h4 className="text-slate-900 font-display font-bold text-sm tracking-wider uppercase mb-4">
              Service & Care
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Periodic Maintenance', path: '/service' },
                { name: '60-Min Express Service', path: '/service' },
                { name: 'Doorstep Mobile Service', path: '/service' },
                { name: 'Cashless Insurance Claims', path: '/service' },
                { name: 'Accidental Body Repair', path: '/service' },
                { name: 'Maruti Genuine Accessories', path: '/service' },
                { name: '24x7 Roadside Assistance', path: '/contact' },
              ].map((item) => (
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
          </motion.div>

          {/* Column 4: Dealership Hubs */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            custom={0.35}
            className="will-change-transform"
          >
            <h4 className="text-slate-900 font-display font-bold text-sm tracking-wider uppercase mb-4">
              Dealership Hubs
            </h4>
            <ul className="space-y-2.5 leading-snug">
              {[
                { name: 'Bengaluru Showrooms (Nayandahalli, Hebbal, Whitefield)', path: '/outlets' },
                { name: 'Hyderabad Hubs (Gachibowli, Kukatpally, Jubilee Hills)', path: '/outlets' },
                { name: 'Mysore Branches (Hunsur Road, Nanjangud)', path: '/outlets' },
                { name: 'Chennai Centers (Anna Nagar, OMR)', path: '/outlets' },
                { name: 'True Value Pre-Owned Showrooms', path: '/outlets' },
              ].map((location) => (
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
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={columnVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          custom={0.45}
          className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 will-change-transform"
        >
          <p>
            © {currentYear} Kalyani Motors Pvt Ltd. All rights reserved. Authorized Dealer for Maruti Suzuki India Limited.
          </p>
          <div className="flex items-center gap-4 text-center md:text-right">
            <span>*Ex-showroom prices are indicative and subject to change by manufacturer without prior notice.</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}