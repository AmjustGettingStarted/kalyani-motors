import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useKalyani } from '../../context/KalyaniContext';
import { Button } from '../ui/button';

// Main container: sequences the word stack first, then the subtext & CTAs
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.2,
        },
    },
};

// Word stack container: fires individual words in tight sequence
const wordListVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.14,
        },
    },
};

// Individual word entrance
const wordVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.21, 0.47, 0.32, 0.98],
        },
    },
};

// Description & CTA entrance
const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: [0.21, 0.47, 0.32, 0.98],
        },
    },
};

const HERO_WORDS = ['DISCOVER', 'DESIRE', 'DRIVE'];

export default function HeroVideo() {
    const { openTestDrive } = useKalyani();
    const videoSrc =
        'https://marutisuzuki.scene7.com/is/content/maruti/E-vitara%20homepage%204k-1';

    return (
        <section className="relative w-full h-screen min-h-[640px] overflow-hidden bg-black text-white flex items-center">
            {/* 1. Background Video */}
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full pointer-events-none"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover object-center"
                >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </motion.div>

            {/* 2. Flat Overlays for Legibility */}
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            {/* 3. Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl space-y-6"
                >
                    {/* Staggered Word Stack */}
                    <motion.h1
                        variants={wordListVariants}
                        className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.92] select-none flex flex-col items-start gap-1"
                    >
                        {HERO_WORDS.map((word) => (
                            <motion.span
                                key={word}
                                variants={wordVariants}
                                className="inline-block text-white transition-colors duration-200 ease-out cursor-pointer hover:text-blue-600 will-change-transform"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>

                    {/* Subtitle Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed pt-1"
                    >
                        Explore the latest Arena & Nexa models online, lock in direct dealer pricing, and get doorstep test drives scheduled in seconds.
                    </motion.p>

                    {/* CTA Buttons - Matching Dimensions */}
                    <motion.div
                        variants={itemVariants}
                        className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
                    >
                        <Link
                            to="/cars"
                            className="h-12 px-7 min-w-[200px] rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center gap-2.5"
                        >
                            <span>Explore All Cars</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        <Button
                            variant="outline"
                            onClick={() => openTestDrive()}
                            className="h-12 px-7 min-w-[200px] rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center gap-2.5 m-0"
                        >
                            <CalendarDays className="w-4 h-4 text-slate-200" />
                            <span>Book A Test Drive</span>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* 4. Animated Floating Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="absolute bottom-8 inset-x-0 mx-auto w-fit z-10 flex flex-col items-center gap-2 pointer-events-none"
            >
                <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                    Scroll Down
                </span>
                <div className="w-5 h-9 rounded-full border-2 border-white/40 flex justify-center pt-1.5">
                    <motion.div
                        animate={{
                            y: [0, 8, 0],
                            opacity: [1, 0.4, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="w-1.5 h-2.5 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}