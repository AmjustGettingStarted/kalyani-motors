import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

export default function NearestBranchesSection({ locations = [], selectedCity = 'Bengaluru' }) {
    const displayLocations = locations?.slice(0, 3) || [];

    return (
        <section className="w-[90%] max-w-6xl mx-auto py-16">
            {/* Section Header */}
            <motion.div
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
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

            {/* Grid of Theme-Aligned Full-Bleed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            className="group relative h-[520px] rounded-[2.5rem] p-5 flex flex-col justify-between overflow-hidden shadow-lg border border-slate-100 will-change-transform"
                        >
                            {/* Full-Bleed Image Background */}
                            <img
                                src={bgImage}
                                alt={loc.name}
                                className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Blue-Tinted Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-slate-950/70 to-blue-950/95" />

                            {/* Top Floating Badge & Quick Actions */}
                            <div className="relative z-10 flex items-center justify-between">
                                <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-blue-600 text-white shadow-sm uppercase tracking-wider">
                                    {loc.type}
                                </span>

                                <a
                                    href={`tel:${loc.phone ? loc.phone.replace(/\s+/g, '') : ''}`}
                                    aria-label="Call Branch"
                                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all transform active:scale-95 shadow-sm"
                                >
                                    <Phone className="w-4 h-4 text-white" />
                                </a>
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

                                {/* Primary Button */}
                                <div className="pt-2">
                                    <a
                                        href={loc.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-12 rounded-full bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-[0.98] group/btn"
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