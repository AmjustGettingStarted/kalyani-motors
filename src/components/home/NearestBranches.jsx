import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { mockLocations } from '../../data/fallbacks/fallbackLocations';

// Curated high-resolution fallback dealership exterior images matching channel/type
const FALLBACK_BRANCH_IMAGES = {
    arena: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    ],
    service: [
        'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    ],
    truevalue: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
    nexa: [
        'https://www.nexaofbanaswadi.com/adobe/assets/urn:aaid:aem:4de58443-7a40-48d2-b919-1d9b5262c407/as/About_Us_Image.png?width=750&id=1',
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    ],
    default: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    ],
};

function getFallbackImage(loc, index = 0) {
    const cat = (loc?.category || '').toLowerCase();
    const type = (loc?.type || '').toLowerCase();
    const name = (loc?.name || '').toLowerCase();

    if (cat.includes('truevalue') || type.includes('true value') || name.includes('true value')) {
        const list = FALLBACK_BRANCH_IMAGES.truevalue;
        return list[index % list.length];
    }
    if (type.includes('service') || type.includes('workshop') || name.includes('service')) {
        const list = FALLBACK_BRANCH_IMAGES.service;
        return list[index % list.length];
    }
    if (cat.includes('nexa') || name.includes('nexa')) {
        const list = FALLBACK_BRANCH_IMAGES.nexa;
        return list[index % list.length];
    }
    const list = FALLBACK_BRANCH_IMAGES.arena;
    return list[index % list.length];
}

// Parses raw branch title and locality area (e.g., "Maruti Suzuki Arena (Kalyani Motors, Mysore Road)" -> "Maruti Suzuki Arena", "Mysore Road")
function parseBranchName(rawName = '') {
    if (!rawName) return { title: 'Kalyani Motors', area: '' };

    const match = rawName.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
        let title = match[1].trim();
        const areaRaw = match[2].trim();

        const parts = areaRaw
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean);

        const specificParts = parts.filter(
            (p) => !/kalyani\s*motors/i.test(p) && !/bengaluru|bangalore|hyderabad|hydrabad/i.test(p)
        );

        const area = specificParts.length > 0 ? specificParts[specificParts.length - 1] : parts[parts.length - 1] || areaRaw;

        // Proper casing for True Value
        title = title.replace(/\bTRUE\s+VALUE\b/i, 'True Value');

        return { title, area };
    }

    return { title: rawName, area: '' };
}

// Formats channel/type badge text (e.g. ARENA, SERVICE, TRUE VALUE, NEXA)
function getBranchBadge(loc) {
    const cat = (loc?.category || '').toLowerCase();
    const type = (loc?.type || '').toLowerCase();
    const name = (loc?.name || '').toLowerCase();

    if (cat.includes('truevalue') || type.includes('true value') || name.includes('true value')) {
        return 'TRUE VALUE';
    }
    if (cat.includes('driving') || type.includes('driving')) {
        return 'DRIVING SCHOOL';
    }
    if (type.includes('service') || type.includes('workshop') || name.includes('service')) {
        return 'SERVICE';
    }
    if (cat.includes('nexa') || name.includes('nexa')) {
        return 'NEXA';
    }
    if (cat.includes('arena') || name.includes('arena')) {
        return 'ARENA';
    }
    if (loc?.type) {
        return loc.type.toUpperCase();
    }
    return 'ARENA';
}

function BranchCard({ location, index = 0, delay = 0 }) {
    const { title, area } = parseBranchName(location?.name);
    const badge = getBranchBadge(location);
    const fallback = getFallbackImage(location, index);
    const [imgSrc, setImgSrc] = useState(location?.image || fallback);

    useEffect(() => {
        setImgSrc(location?.image || fallback);
    }, [location?.image, fallback]);

    const mapHref =
        location?.mapUrl ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${location?.name || 'Kalyani Motors'} ${location?.address || ''}`
        )}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12, margin: '-20px' }}
            transition={{
                duration: 0.85,
                delay: delay ?? index * 0.12,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
            className="group relative bg-white rounded-[26px] overflow-hidden border border-slate-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)] flex flex-col h-full will-change-transform"
        >
            {/* Top Image Container */}
            <div className="relative h-44 sm:h-48 md:h-52 w-full overflow-hidden bg-slate-100 shrink-0">
                <img
                    src={imgSrc}
                    alt={location?.name || 'Kalyani Motors Branch'}
                    onError={() => setImgSrc(fallback)}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                />

                {/* Top-Left Channel Pill Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block bg-blue-600 text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {badge}
                    </span>
                </div>
            </div>

            {/* Bottom Content Container */}
            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white">
                {/* Title, Sub-locality, and Circular Action Arrow */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-display font-black text-base sm:text-lg text-slate-900 tracking-tight leading-snug truncate">
                            {title}
                        </h3>
                        {area && (
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
                                ({area})
                            </p>
                        )}
                    </div>

                    <a
                        href={mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Get directions to ${location?.name || 'branch'}`}
                        title="Get directions on Google Maps"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30 transition-all duration-200 group/btn"
                    >
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 text-white" />
                    </a>
                </div>

                {/* Address Row with MapPin */}
                <div className="flex items-start gap-2.5 mt-4 pt-1">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 fill-blue-600/20" />
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                        {location?.address || 'Visit branch for contact and showroom assistance.'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// Map Pin waypoint component for desktop navigation trail
function WaypointMarker({ delay = 0 }) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.65,
                delay,
                ease: [0.34, 1.56, 0.64, 1],
            }}
            className="w-8 h-8 rounded-full bg-white shadow-md shadow-blue-500/20 border border-blue-100 flex items-center justify-center"
        >
            <MapPin className="w-4 h-4 text-blue-600 fill-blue-600" />
        </motion.div>
    );
}

export default function NearestBranchesSection({ locations = [], selectedCity = 'Bengaluru' }) {
    const scrollContainerRef = useRef(null);

    // Prepare display locations from API, fallback padded up to 6 items
    const cityKey = (selectedCity || 'bengaluru').toLowerCase();
    const fallbackCityList = mockLocations[cityKey] || mockLocations.bengaluru || [];

    const mergedLocations = [...(locations || [])];
    if (mergedLocations.length < 6) {
        for (const item of fallbackCityList) {
            if (!mergedLocations.some((m) => String(m.id) === String(item.id))) {
                mergedLocations.push(item);
            }
            if (mergedLocations.length >= 6) break;
        }
    }
    const displayLocations = mergedLocations.slice(0, 6);

    // Columns distribution for the staggered 3-column desktop layout
    const col1 = [displayLocations[0], displayLocations[1]].filter(Boolean);
    const col2 = [displayLocations[2], displayLocations[3]].filter(Boolean);
    const col3 = [displayLocations[4], displayLocations[5]].filter(Boolean);

    // Mobile horizontal auto-scroll interval
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
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Ambient Background Glow Highlights */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl" />
            </div>

            {/* Section Header with smooth entrance animation */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2, margin: '-40px' }}
                transition={{ duration: 0.85, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12"
            >
                <div>
                    <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-1"
                    >
                        Nearest Branches
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.75, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight"
                    >
                        Kalyani Motors in {selectedCity}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.75, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="text-slate-500 text-xs sm:text-sm md:text-base mt-1.5 font-normal"
                    >
                        Visit our state-of-the-art showrooms, authorized service centers, and True Value hubs.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    <Link
                        to="/outlets"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group shrink-0"
                    >
                        <span>View All {selectedCity} Branches</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </motion.div>

            {/* Desktop Layout: 3 Columns with Vertical Stagger + Connected Dashed Route */}
            <div className="relative hidden lg:block pb-16">
                {/* SVG Connected Dashed Route Background */}
                <div className="absolute inset-0 pointer-events-none overflow-visible -z-0">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 1000 700"
                        fill="none"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Upper Arch connecting Column 1 and Column 2 through Pin 1 */}
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.75 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
                            d="M 220 120 C 270 60, 310 50, 330 60 C 360 70, 390 120, 420 160"
                            stroke="#93C5FD"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            strokeLinecap="round"
                        />
                        {/* Upper Arch connecting Column 2 and Column 3 through Pin 3 */}
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.75 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.45, ease: 'easeInOut' }}
                            d="M 560 160 C 610 100, 650 80, 670 90 C 700 100, 720 130, 760 140"
                            stroke="#93C5FD"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            strokeLinecap="round"
                        />
                        {/* Lower Main Wavy Route through Pin 2 and Pin 4 */}
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.75 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.6, delay: 0.4, ease: 'easeInOut' }}
                            d="M 40 420 C 130 420, 190 370, 250 360 C 300 350, 310 440, 370 480 C 440 520, 560 520, 640 450 C 690 400, 715 370, 745 370 C 785 370, 830 440, 960 440"
                            stroke="#93C5FD"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            strokeLinecap="round"
                        />
                        {/* Radiating connector spurs from pins */}
                        <motion.path
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.6 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            d="M 330 60 L 290 120 M 330 60 L 370 120 M 250 360 L 220 310 M 250 360 L 220 400 M 670 90 L 620 140 M 670 90 L 710 120 M 745 370 L 690 410 M 745 370 L 710 330"
                            stroke="#BFDBFE"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                        />
                    </svg>

                    {/* Waypoint Pin 1: Top between Col 1 & 2 */}
                    <div className="absolute top-[8.5%] left-[33%] -translate-x-1/2 -translate-y-1/2 z-20">
                        <WaypointMarker delay={0.4} />
                    </div>

                    {/* Waypoint Pin 2: Lower-mid between Col 1 & 2 */}
                    <div className="absolute top-[51.5%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-20">
                        <WaypointMarker delay={0.55} />
                    </div>

                    {/* Waypoint Pin 3: Top between Col 2 & 3 */}
                    <div className="absolute top-[13%] left-[67%] -translate-x-1/2 -translate-y-1/2 z-20">
                        <WaypointMarker delay={0.5} />
                    </div>

                    {/* Waypoint Pin 4: Lower-mid between Col 2 & 3 */}
                    <div className="absolute top-[53%] left-[74.5%] -translate-x-1/2 -translate-y-1/2 z-20">
                        <WaypointMarker delay={0.65} />
                    </div>
                </div>

                {/* 3-Column Staggered Cards Grid */}
                <div className="grid grid-cols-3 gap-6 xl:gap-8 relative z-10">
                    {/* Column 1 (Left) */}
                    <div className="flex flex-col gap-6 xl:gap-8">
                        {col1.map((loc, idx) => (
                            <BranchCard
                                key={loc.id || `col1-${idx}`}
                                location={loc}
                                index={idx}
                                delay={idx === 0 ? 0.15 : 0.35}
                            />
                        ))}
                    </div>

                    {/* Column 2 (Center) - Staggered Down */}
                    <div className="flex flex-col gap-6 xl:gap-8 lg:translate-y-12">
                        {col2.map((loc, idx) => (
                            <BranchCard
                                key={loc.id || `col2-${idx}`}
                                location={loc}
                                index={idx + 2}
                                delay={idx === 0 ? 0.28 : 0.48}
                            />
                        ))}
                    </div>

                    {/* Column 3 (Right) - Subtle Stagger */}
                    <div className="flex flex-col gap-6 xl:gap-8 lg:translate-y-3">
                        {col3.map((loc, idx) => (
                            <BranchCard
                                key={loc.id || `col3-${idx}`}
                                location={loc}
                                index={idx + 4}
                                delay={idx === 0 ? 0.40 : 0.60}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet (< 1024px) Layout: Smooth Horizontal Swipe Carousel */}
            <div
                ref={scrollContainerRef}
                style={{ overscrollBehaviorX: 'contain', touchAction: 'pan-x' }}
                className="flex lg:hidden gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6"
            >
                {displayLocations.map((loc, index) => (
                    <div
                        key={loc.id || index}
                        className="w-[84vw] sm:w-[340px] shrink-0 snap-start"
                    >
                        <BranchCard
                            location={loc}
                            index={index}
                            delay={index * 0.12}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}