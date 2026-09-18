import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useKalyani } from '../../context/KalyaniContext';
import { Button } from '../ui/button';

// Stagger animation container config
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

// Child item entrance config
const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1.0], // smooth cubic-bezier
        },
    },
};

export default function HeroVideo() {
    const { openTestDrive } = useKalyani();
    const videoSrc =
        'https://marutisuzuki.scene7.com/is/content/maruti/E-vitara%20homepage%204k-1';

    return (
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black text-white flex items-center">
            {/* 1. Background Video with Smooth Fade-In */}
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

            {/* 2. Gradient Overlays for High-Contrast Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent pointer-events-none" />

            {/* 3. Staggered Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl space-y-5"
                >


                    {/* Main Headline */}
                    <motion.h1
                        variants={itemVariants}
                        className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08]"
                    >
                        Charge into the Next Era.
                    </motion.h1>



                    {/* CTA Buttons */}
                    <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-4">
                        <Link
                            to="/cars"
                            className="px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95 inline-flex items-center gap-2"
                        >
                            <span>Explore The Lineup</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Button
                            variant="primary"
                            onClick={() => openTestDrive()}
                            className="px-7 py-3.5 rounded-xl bg-transparent hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
                        >
                            Enquire
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* 4. Animated Floating Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
            >
                <span className="text-[11px] uppercase tracking-widest text-slate-300 font-bold">
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
