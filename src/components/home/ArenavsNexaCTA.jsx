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

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Arena Card */}
                <motion.div
                    {...cardMotion(0)}
                    className="group relative overflow-hidden rounded-3xl bg-blue-600 p-8 sm:p-9 text-white shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between min-h-[280px] will-change-transform"
                >
                    {/* Sizzling Red Brezza - Scaled up & Horizontally Flipped */}
                    <div className="absolute -right-6 -bottom-6 sm:-right-4 sm:-bottom-5 w-[65%] sm:w-[58%] max-w-[420px] pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-105">
                        <img
                            src="https://assets.kalyanicrm.com/new-brezza-2026/color/sizzling-red-with-bluish-black.png"
                            alt="Maruti Suzuki Arena Brezza"
                            className="w-full h-auto object-contain -scale-x-100 opacity-100 filter drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]"
                            loading="lazy"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 max-w-[62%] sm:max-w-[56%]">
                        <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-100 block mb-2">
                            Maruti Suzuki Arena
                        </span>
                        <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
                            India's Most Trusted Family Cars
                        </h3>
                        <p className="text-blue-100/95 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                            Featuring Swift, Brezza, Ertiga, and Dzire with proven reliability and class-leading mileage.
                        </p>
                    </div>

                    {/* White Pill Button */}
                    <div className="relative z-10 pt-6">
                        <Link
                            to="/cars?channel=Arena"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-full text-xs font-bold transition-all shadow-sm"
                        >
                            <span>Explore Arena Lineup</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </motion.div>

                {/* 2. Nexa Card */}
                <motion.div
                    {...cardMotion(0.1)}
                    className="group relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-9 text-white shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between min-h-[280px] will-change-transform"
                >
                    {/* Bluish Black Baleno - Scaled up & Horizontally Flipped */}
                    <div className="absolute -right-6 -bottom-6 sm:-right-4 sm:-bottom-5 w-[65%] sm:w-[58%] max-w-[420px] pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-105">
                        <img
                            src="https://assets.kalyanicrm.com/super_app_v4/car_image/car_image/NEXA/The-Stunning-New-Baleno/color/Bluish-Black.png"
                            alt="Nexa Experience Baleno"
                            className="w-full h-auto object-contain -scale-x-100 opacity-100 filter drop-shadow-[0_18px_24px_rgba(0,0,0,0.65)]"
                            loading="lazy"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 max-w-[62%] sm:max-w-[56%]">
                        <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 block mb-2">
                            Nexa Experience
                        </span>
                        <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
                            Create. Inspire. Luxury Redefined.
                        </h3>
                        <p className="text-slate-300/95 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                            Explore Grand Vitara Strong Hybrid, Baleno, Fronx Turbo, and Jimny 4x4 with tailored hospitality.
                        </p>
                    </div>

                    {/* White Pill Button */}
                    <div className="relative z-10 pt-6">
                        <Link
                            to="/cars?channel=Nexa"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-xs font-bold transition-all shadow-sm"
                        >
                            <span>Discover Nexa Collection</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}