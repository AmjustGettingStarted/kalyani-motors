import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, Navigation } from 'lucide-react';

const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            delay: index * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98],
        },
    }),
};

const DEFAULT_BRANCH_IMAGES = [
    'https://www.nexaofbanaswadi.com/adobe/assets/urn:aaid:aem:4de58443-7a40-48d2-b919-1d9b5262c407/as/About_Us_Image.png?width=750&id=1',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
];

// Top floating badge: cross-fades between Type (Sales/Service) and Category (Arena/Nexa)
function OutletBadge({ type = '', category = '', name = '' }) {
    const normCategory = (category || '').toLowerCase();
    const normType = (type || '').toLowerCase();
    const normName = (name || '').toLowerCase();

    // Detect channel (Arena or Nexa)
    let channel = null;
    if (normCategory.includes('nexa') || normName.includes('nexa')) {
        channel = 'Nexa';
    } else if (normCategory.includes('arena') || normName.includes('arena')) {
        channel = 'Arena';
    }

    // Detect type (Sales or Service)
    let outletType = null;
    if (normType.includes('service') || normType.includes('workshop')) {
        outletType = 'Service';
    } else if (normType.includes('sales') || normType.includes('showroom')) {
        outletType = 'Sales';
    }

    // Only cross-fade if it has Arena/Nexa AND Sales/Service
    // "if it falls under other no need of cross fade"
    const canCrossFade = Boolean(channel && outletType);

    const [showCategory, setShowCategory] = useState(false);

    useEffect(() => {
        if (!canCrossFade) return;
        const interval = setInterval(() => {
            setShowCategory((prev) => !prev);
        }, 2600);
        return () => clearInterval(interval);
    }, [canCrossFade]);

    if (!canCrossFade) {
        return (
            <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-blue-600 text-white shadow-sm uppercase tracking-wider">
                {type || category || 'Outlet'}
            </span>
        );
    }

    const currentLabel = showCategory ? channel : outletType;

    return (
        <div className="h-7 flex items-center">
            <AnimatePresence mode="wait">
                <motion.span
                    key={currentLabel}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="inline-block text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm uppercase tracking-wider bg-blue-600 text-white"
                >
                    {currentLabel}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

export default function NearestBranchesSection({ locations = [], selectedCity = 'Bengaluru' }) {
    const displayLocations = locations || [];
    const scrollContainerRef = useRef(null);

    // Auto-scroll on mobile and tablet screens (< 1024px)
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        let isInteracting = false;
        let resumeTimeout = null;

        const onTouchStart = () => {
            isInteracting = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
        };

        const onTouchEnd = () => {
            resumeTimeout = setTimeout(() => {
                isInteracting = false;
            }, 3500);
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchend', onTouchEnd, { passive: true });

        const interval = setInterval(() => {
            if (window.innerWidth >= 1024 || isInteracting || !scrollContainerRef.current) return;

            const container = scrollContainerRef.current;
            const maxScroll = container.scrollWidth - container.clientWidth - 15;
            const firstCard = container.firstElementChild;
            const cardWidth = firstCard ? firstCard.clientWidth + 20 : 340;

            if (container.scrollLeft >= maxScroll) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }, 4200);

        return () => {
            clearInterval(interval);
            if (resumeTimeout) clearTimeout(resumeTimeout);
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [displayLocations]);

    return (
        <section className="w-[90%] max-w-6xl mx-auto py-16">
            {/* Section Header */}
            <motion.div
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10"
            >
                <div>
                    <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-1">
                        Nearest Branches
                    </span>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                        Kalyani Motors in {selectedCity}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Visit our state-of-the-art showrooms, authorized service centers, and True Value hubs.
                    </p>
                </div>

                <Link
                    to="/outlets"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group"
                >
                    <span>View All {selectedCity} Branches</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            </motion.div>

            {/* Horizontal Scroll on Mobile & Tab (< lg), 3-Column Grid on Desktop (>= lg) */}
            <div
                ref={scrollContainerRef}
                style={{ overscrollBehaviorX: 'contain', touchAction: 'pan-x' }}
                className="flex lg:grid lg:grid-cols-3 gap-5 lg:gap-6 overflow-x-auto lg:overflow-visible overscroll-x-contain touch-pan-x snap-x snap-mandatory lg:snap-none scrollbar-none pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
            >
                {displayLocations.map((loc, index) => {
                    const bgImage = loc.image || DEFAULT_BRANCH_IMAGES[index % DEFAULT_BRANCH_IMAGES.length];

                    return (
                        <motion.div
                            key={loc.id}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-20px' }}
                            custom={index}
                            className={`group relative h-[480px] sm:h-[500px] lg:h-[520px] w-[84vw] sm:w-[340px] md:w-[380px] shrink-0 snap-start lg:w-auto lg:shrink rounded-[2.5rem] p-5 flex flex-col justify-between overflow-hidden shadow-lg border border-slate-100 will-change-transform ${index >= 3 ? 'lg:hidden' : ''}`}
                        >
                            {/* Full-Bleed Image Background */}
                            <img
                                src={bgImage}
                                alt={loc.name}
                                className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Blue-Tinted Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-slate-950/70 to-blue-950/95" />

                            {/* Top Floating Badge */}
                            <div className="relative z-10 flex items-center justify-between">
                                <OutletBadge type={loc.type} category={loc.category} name={loc.name} />
                            </div>

                            {/* Bottom Details Content */}
                            <div className="relative z-10 space-y-4">
                                <div>
                                    {loc.isFlagship && (
                                        <span className="inline-block text-[10px] font-black px-2.5 py-0.5 rounded-md bg-white text-blue-600 tracking-wider mb-2 shadow-sm">
                                            FLAGSHIP
                                        </span>
                                    )}
                                    <h3 className="font-display font-black text-2xl text-white tracking-tight leading-snug drop-shadow-sm">
                                        {loc.name}
                                    </h3>
                                </div>

                                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
                                    {loc.address}
                                </p>

                                {/* Facilities Badges */}
                                {loc.facilities && loc.facilities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {loc.facilities.slice(0, 3).map((fac) => (
                                            <span
                                                key={fac}
                                                className="text-[11px] font-medium bg-blue-600/30 text-white px-3 py-1 rounded-full backdrop-blur-md border border-blue-400/20"
                                            >
                                                {fac}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Action Buttons: Call Icon + Get Directions */}
                                <div className="pt-2 flex items-center gap-3">
                                    {loc.phone && (
                                        <a
                                            href={`tel:${loc.phone.replace(/\s+/g, '')}`}
                                            aria-label={`Call ${loc.name}`}
                                            title={`Call ${loc.phone}`}
                                            className="w-12 h-12 shrink-0 rounded-full bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-white flex items-center justify-center transition-all duration-200 shadow-md active:scale-[0.98] group/call"
                                        >
                                            <Phone className="w-4 h-4 fill-current transition-transform duration-200 group-hover/call:scale-110" />
                                        </a>
                                    )}
                                    <a
                                        href={loc.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 h-12 rounded-full bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-[0.98] group/btn"
                                    >
                                        <span>Get Directions</span>
                                        <Navigation className="w-3.5 h-3.5 fill-current transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}