import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ChannelExperienceSection() {
    const cardMotion = (delay = 0) => ({
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: {
            duration: 0.6,
            delay,
            ease: [0.21, 0.47, 0.32, 0.98],
        },
        whileHover: { y: -4 },
    });

    // YouTube playlist URLs for continuous autoplay loop
    // Arena links: OwxaaiYHFFU, kmmWFcfc7lI, DxLsTIG73I4
    const arenaVideoSrc =
        'https://www.youtube-nocookie.com/embed/OwxaaiYHFFU?autoplay=1&mute=1&loop=1&playlist=OwxaaiYHFFU,kmmWFcfc7lI,DxLsTIG73I4&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1';

    // Nexa links: RfIeDXpkEVc, 01D8Nof6EZA, 4fULdQ_C9MM
    const nexaVideoSrc =
        'https://www.youtube-nocookie.com/embed/RfIeDXpkEVc?autoplay=1&mute=1&loop=1&playlist=RfIeDXpkEVc,01D8Nof6EZA,4fULdQ_C9MM&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1';

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Arena Card */}
                <motion.div {...cardMotion(0)} className="h-full">
                    <Link
                        to="/cars?channel=Arena"
                        className="group relative block overflow-hidden rounded-3xl bg-blue-600 text-white shadow-md hover:shadow-xl transition-all duration-300 w-full h-full cursor-pointer select-none will-change-transform min-h-[340px] sm:min-h-[380px]"
                    >
                        {/* Background YouTube Video */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                            <iframe
                                src={arenaVideoSrc}
                                title="Maruti Suzuki Arena Showcase"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover pointer-events-none border-0 transition-transform duration-700 ease-out group-hover:scale-105"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                tabIndex="-1"
                            />
                        </div>

                        {/* Ambient Gradient Overlay for Text Legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/70 to-blue-900/40 pointer-events-none" />

                        {/* Card Content */}
                        <div className="relative z-10 flex flex-col justify-between h-full p-8 sm:p-9 pointer-events-none">
                            <div className="max-w-[85%] sm:max-w-[75%]">
                                <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-100 block mb-2">
                                    Maruti Suzuki Arena
                                </span>
                                <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
                                    India's Most Trusted Family Cars
                                </h3>
                                <p className="text-blue-100/95 text-xs sm:text-sm mt-2.5 leading-relaxed font-normal">
                                    Featuring Swift, Brezza, Ertiga, and Dzire with proven reliability and class-leading mileage.
                                </p>
                            </div>

                            {/* White Pill Button */}
                            <div className="pt-6">
                                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 rounded-full text-xs font-bold shadow-sm transition-all duration-200 group-hover:bg-blue-50">
                                    <span>Explore Arena Lineup</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* 2. Nexa Card */}
                <motion.div {...cardMotion(0.1)} className="h-full">
                    <Link
                        to="/cars?channel=Nexa"
                        className="group relative block overflow-hidden rounded-3xl bg-slate-900 text-white shadow-md hover:shadow-xl transition-all duration-300 w-full h-full cursor-pointer select-none will-change-transform min-h-[340px] sm:min-h-[380px]"
                    >
                        {/* Background YouTube Video */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                            <iframe
                                src={nexaVideoSrc}
                                title="Nexa Experience Showcase"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover pointer-events-none border-0 transition-transform duration-700 ease-out group-hover:scale-105"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                tabIndex="-1"
                            />
                        </div>

                        {/* Ambient Gradient Overlay for Text Legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-slate-950/75 to-slate-900/40 pointer-events-none" />

                        {/* Card Content */}
                        <div className="relative z-10 flex flex-col justify-between h-full p-8 sm:p-9 pointer-events-none">
                            <div className="max-w-[85%] sm:max-w-[75%]">
                                <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 block mb-2">
                                    Nexa Experience
                                </span>
                                <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
                                    Create. Inspire. Luxury Redefined.
                                </h3>
                                <p className="text-slate-300/95 text-xs sm:text-sm mt-2.5 leading-relaxed font-normal">
                                    Explore Grand Vitara Strong Hybrid, Baleno, Fronx Turbo, and Jimny 4x4 with tailored hospitality.
                                </p>
                            </div>

                            {/* White Pill Button */}
                            <div className="pt-6">
                                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-slate-900 rounded-full text-xs font-bold shadow-sm transition-all duration-200 group-hover:bg-slate-100">
                                    <span>Discover Nexa Collection</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}