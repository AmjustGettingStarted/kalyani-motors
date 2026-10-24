import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ARENA_CARS = [
    {
        id: 'brezza',
        name: 'BREZZA',
        tagline: 'Bold. Versatile.\nBuilt for more.',
        videoId: 'OwxaaiYHFFU',
        image: 'https://assets.kalyanicrm.com/super_app_v4/car_image/car_image/card_banner/arena/breeza.png',
        link: '/cars/brezza',
    },
    {
        id: 'victoris',
        name: 'VICTORIS',
        tagline: 'Unmatched Durability.\nFleet excellence.',
        videoId: 'kmmWFcfc7lI',
        image: 'https://assets.kalyanicrm.com/super_app_v4/car_image/car_image/card_banner/arena/victoris.png',
        link: '/cars/tour-s',
    },
    {
        id: 'swift',
        name: 'SWIFT',
        tagline: 'Sporty. Stylish.\nAlways a favorite.',
        videoId: 'DxLsTIG73I4',
        image: 'https://assets.kalyanicrm.com/super_app_v4/car_image/car_image/card_banner/arena/swift.png',
        link: '/cars/swift',
    },
];

const NEXA_CARS = [
    {
        id: 'e-vitara',
        name: 'e-VITARA',
        tagline: 'Born-EV SUV.\nNext-gen electric mobility.',
        videoId: 'RfIeDXpkEVc',
        image: 'https://assets.kalyanicrm.com/super_app_v4/car_image/car_image/card_banner/nexa/e_vitara.png',
        link: '/cars/e-vitara',
    },
    {
        id: 'baleno',
        name: 'BALENO',
        tagline: 'Sensual Tech.\nCrafted for elegance.',
        videoId: '01D8Nof6EZA',
        image: 'https://assets.kalyanicrm.com/super_app_v4/car_image/car_image/card_banner/nexa/baleno.png',
        link: '/cars/baleno',
    },
    {
        id: 'fronx',
        name: 'FRONX',
        tagline: 'Coupe Design.\nTurbocharged power.',
        videoId: '4fULdQ_C9MM',
        image: 'https://assets.kalyanicrm.com/super_app_v4/car_image/car_image/card_banner/nexa/fronx.png',
        link: '/cars/fronx',
    },
];

const ARENA_HERO_IMG = 'https://assets.kalyanicrm.com/new-brezza-2026/color/sizzling-red-with-bluish-black.png';
const NEXA_HERO_IMG = 'https://assets.kalyanicrm.com/super_app_v4/car_image/car_image/NEXA/The-Stunning-New-Baleno/color/Bluish-Black.png';

const TRANSITION_STYLE = 'flex-grow 0.45s cubic-bezier(0.22, 1, 0.36, 1)';

const SuzukiLogo = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.8 5.4L13 2.4 4.5 6.2l3.1 1.5 5.1-2.3 5.1 2.3-8.5 3.9 2 2.9 7.3-3.3 3.2 1.5-7.4 3.4-5.1-2.3 8.6-3.9-2-2.9L19.8 5.4z" />
    </svg>
);

function SubCard({ car, isVisible, channel }) {
    const isArena = channel === 'arena';
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
        let timer;
        if (isVisible) {
            // Buffer delay: allows YouTube to start playing behind the poster
            // so the initial big play button and title bar never flash into view
            timer = setTimeout(() => {
                setIsVideoReady(true);
            }, 600);
        } else {
            setIsVideoReady(false);
        }
        return () => clearTimeout(timer);
    }, [isVisible]);

    return (
        <Link
            to={car.link}
            className={`group/child relative block overflow-hidden min-w-0 ${
                isArena ? 'border-l border-white/20' : 'border-r border-white/20'
            }`}
            style={{
                flexGrow: isVisible ? 1 : 0,
                flexBasis: 0,
                transition: TRANSITION_STYLE,
                willChange: 'flex-grow',
                pointerEvents: isVisible ? 'auto' : 'none',
            }}
        >
            {/* Full Sub-card Video Background (Desktop Only) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-900">
                {/* Fallback poster background */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                    style={{ backgroundImage: `url(${car.image})` }}
                />

                {/* Autoplay YouTube video covering full sub-card without title bar or play button */}
                {isVisible && (
                    <div className="absolute inset-0 overflow-hidden">
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${car.videoId}?autoplay=1&mute=1&loop=1&playlist=${car.videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1`}
                            title={car.name}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[860px] min-h-[550px] max-w-none pointer-events-none border-0 transition-opacity duration-700 ease-out"
                            style={{
                                opacity: isVideoReady ? 1 : 0,
                            }}
                            allow="autoplay; encrypted-media; gyroscope"
                            tabIndex="-1"
                        />
                    </div>
                )}

                {/* Scrim overlay for text contrast and premium feel */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 group-hover/child:from-black/75 group-hover/child:via-black/20 group-hover/child:to-black/50 transition-colors duration-300" /> */}
            </div>

            {/* Inner Content Overlay */}
            <div
                className="relative z-10 h-full flex flex-col justify-between p-4 xl:p-5"
                style={{
                    minWidth: '135px',
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity 0.25s ease ${isVisible ? '0.12s' : '0s'}`,
                }}
            >
                {/* <div>
                    <h4 className="font-display text-center font-black text-sm xl:text-base text-white tracking-wide uppercase group-hover/child:text-blue-800 drop-shadow-md">
                        {car.name}
                    </h4>
                </div> */}

                <div className="">
                    <span className="inline-flex w-full justify-center gap-1.5 text-md font-bold text-white group-hover/child:bg-blue-800 transition-all duration-200 bg-black/10">
                        <span>EXPLORE {car.name}</span>
                        {/* <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/child:translate-x-0.5" /> */}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function ChannelExperienceSection() {
    const [hoveredChannel, setHoveredChannel] = useState(null);
    const isArenaHovered = hoveredChannel === 'arena';
    const isNexaHovered = hoveredChannel === 'nexa';
    const handleReset = useCallback(() => setHoveredChannel(null), []);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" onMouseLeave={handleReset}>
            {/* Desktop Accordion: lg+ (Features full-size sub-card background videos) */}
            <div className="hidden lg:flex gap-5 xl:gap-6 items-stretch h-[340px] xl:h-[355px]">
                {/* Arena Group */}
                <div
                    onMouseEnter={() => setHoveredChannel('arena')}
                    className="-skew-x-[10deg] rounded-2xl xl:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    style={{
                        flexGrow: isArenaHovered ? 7 : isNexaHovered ? 1 : 4,
                        flexBasis: 0,
                        transition: TRANSITION_STYLE,
                        willChange: 'flex-grow',
                    }}
                >
                    <div className="flex w-full h-full">
                        {/* Arena Parent Card */}
                        <Link
                            to="/cars?channel=Arena"
                            className="group/parent relative block overflow-hidden cursor-pointer"
                            style={{
                                flexGrow: isArenaHovered ? 1 : 1,
                                flexBasis: 0,
                                transition: TRANSITION_STYLE,
                                willChange: 'flex-grow',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0b5cce] via-[#0d64db] to-[#1a7af5]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />

                            {/* Expanded View */}
                            <div
                                className="relative z-10 h-full p-7 xl:p-8 flex flex-col justify-between"
                                style={{
                                    opacity: isNexaHovered ? 0 : 1,
                                    transition: 'opacity 0.25s ease',
                                    pointerEvents: isNexaHovered ? 'none' : 'auto',
                                }}
                            >
                                <div className={`transition-all duration-300 ${isArenaHovered ? 'max-w-full' : 'max-w-[55%]'}`}>
                                    <div className="flex items-center gap-2 mb-3 select-none">
                                        <span className="font-black tracking-wider text-[11px] uppercase text-white">MARUTI SUZUKI</span>
                                        <span className="text-white/40 text-[11px]">|</span>
                                        <span className="font-medium tracking-widest text-[11px] uppercase text-white/90">ARENA</span>
                                    </div>
                                    <h3 className="font-display font-black text-2xl xl:text-[30px] text-white leading-[1.15] tracking-tight">
                                        India's Most Trusted<br />Family Cars
                                    </h3>
                                    <p className="text-white/85 text-xs mt-2.5 leading-relaxed max-w-xs">
                                        Featuring Swift, Brezza, Ertiga, and Dzire with proven reliability and class-leading mileage.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0d64db] rounded-full text-xs font-bold group-hover/parent:bg-blue-50 transition-colors duration-200">
                                        <span>Explore Arena Lineup</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover/parent:translate-x-1 transition-transform duration-200" />
                                    </div>
                                </div>

                                <div
                                    className="absolute right-1 sm:right-3 bottom-2 pointer-events-none select-none flex items-end justify-end h-[165px] xl:h-[185px] max-w-[48%] transition-all duration-300"
                                    style={{
                                        opacity: isArenaHovered ? 0 : 1,
                                        transform: isArenaHovered ? 'translateX(40px)' : 'translateX(0)',
                                    }}
                                >
                                    <img
                                        src={ARENA_HERO_IMG}
                                        alt="Brezza"
                                        className="h-full w-auto max-w-full object-contain drop-shadow-2xl"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Contracted View (when Nexa hovered) */}
                            <div
                                className="absolute inset-0 z-10 flex flex-col items-center justify-center p-5 text-center gap-6"
                                style={{
                                    opacity: isNexaHovered ? 1 : 0,
                                    transition: 'opacity 0.25s ease',
                                    pointerEvents: isNexaHovered ? 'auto' : 'none',
                                }}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="font-black text-[11px] tracking-widest uppercase text-white">ARENA</span>
                                    <span className="text-xs font-semibold text-white/80 mt-1">Family Cars</span>
                                </div>

                                <div className="w-full max-w-[100px] py-2 px-3 bg-white text-[#0d64db] rounded-full text-xs font-bold shadow-sm inline-flex items-center justify-center gap-1 group-hover/parent:bg-blue-50 transition-colors">
                                    <span>Explore</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </Link>

                        {/* Arena Child Cards with full sub-card background videos */}
                        {ARENA_CARS.map((car) => (
                            <SubCard key={car.id} car={car} isVisible={isArenaHovered} channel="arena" />
                        ))}
                    </div>
                </div>

                {/* Nexa Group */}
                <div
                    onMouseEnter={() => setHoveredChannel('nexa')}
                    className="-skew-x-[10deg] rounded-2xl xl:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    style={{
                        flexGrow: isNexaHovered ? 7 : isArenaHovered ? 1 : 4,
                        flexBasis: 0,
                        transition: TRANSITION_STYLE,
                        willChange: 'flex-grow',
                    }}
                >
                    <div className="flex w-full h-full">
                        {/* Nexa Child Cards with full sub-card background videos (left of parent) */}
                        {NEXA_CARS.map((car) => (
                            <SubCard key={car.id} car={car} isVisible={isNexaHovered} channel="nexa" />
                        ))}

                        {/* Nexa Parent Card */}
                        <Link
                            to="/cars?channel=Nexa"
                            className="group/parent relative block overflow-hidden cursor-pointer"
                            style={{
                                flexGrow: isNexaHovered ? 1 : 1,
                                flexBasis: 0,
                                transition: TRANSITION_STYLE,
                                willChange: 'flex-grow',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#060a0f] via-[#090e15] to-[#111a28]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 pointer-events-none" />

                            {/* Expanded View */}
                            <div
                                className="relative z-10 h-full p-7 xl:p-8 flex flex-col justify-between"
                                style={{
                                    opacity: isArenaHovered ? 0 : 1,
                                    transition: 'opacity 0.25s ease',
                                    pointerEvents: isArenaHovered ? 'none' : 'auto',
                                }}
                            >
                                <div className={`transition-all duration-300 ${isNexaHovered ? 'max-w-full' : 'max-w-[55%]'}`}>
                                    <div className="mb-3 select-none">
                                        <span className="font-serif tracking-[0.4em] text-sm font-bold text-white uppercase">N E X A</span>
                                    </div>
                                    <h3 className="font-display font-black text-2xl xl:text-[30px] text-white leading-[1.15] tracking-tight">
                                        Create. Inspire.<br />Luxury Redefined.
                                    </h3>
                                    <p className="text-white/75 text-xs mt-2.5 leading-relaxed max-w-xs">
                                        Explore Grand Vitara Strong Hybrid, Baleno, Fronx Turbo, and Jimny 4x4 with tailored hospitality.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full text-xs font-bold shadow-md group-hover/parent:bg-slate-100 transition-colors duration-200">
                                        <span>Discover Nexa Collection</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover/parent:translate-x-1 transition-transform duration-200" />
                                    </div>
                                </div>

                                <div
                                    className="absolute right-1 sm:right-3 bottom-2 pointer-events-none select-none flex items-end justify-end h-[165px] xl:h-[185px] max-w-[48%] transition-all duration-300"
                                    style={{
                                        opacity: isNexaHovered ? 0 : 1,
                                        transform: isNexaHovered ? 'translateX(40px)' : 'translateX(0)',
                                    }}
                                >
                                    <img
                                        src={NEXA_HERO_IMG}
                                        alt="Baleno"
                                        className="h-full w-auto max-w-full object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.55)]"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Contracted View (when Arena hovered) */}
                            <div
                                className="absolute inset-0 z-10 flex flex-col items-center justify-center p-5 text-center gap-6"
                                style={{
                                    opacity: isArenaHovered ? 1 : 0,
                                    transition: 'opacity 0.25s ease',
                                    pointerEvents: isArenaHovered ? 'auto' : 'none',
                                }}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="font-serif tracking-[0.3em] text-xs font-bold text-white uppercase mb-1">N E X A</span>
                                    <span className="text-xs font-semibold text-white/80 mt-1">Luxury</span>
                                </div>

                                <div className="w-full max-w-[100px] py-2 px-3 bg-white text-slate-900 rounded-full text-xs font-bold shadow-sm inline-flex items-center justify-center gap-1 group-hover/parent:bg-slate-100 transition-colors">
                                    <span>Discover</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile View (<lg, desktop-only video feature is disabled here) */}
            <div className="flex flex-col gap-5 lg:hidden">
                <Link
                    to="/cars?channel=Arena"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b5cce] to-[#1a7af5] text-white shadow-lg min-h-[220px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />
                    <div className="relative z-10 p-6">
                        <div className="flex items-center gap-2 mb-2 select-none">
                            <SuzukiLogo className="w-4 h-4 text-white fill-current" />
                            <span className="font-black tracking-wider text-[11px] uppercase">MARUTI SUZUKI</span>
                            <span className="text-white/40 text-[11px]">|</span>
                            <span className="font-medium tracking-widest text-[11px] uppercase text-white/90">ARENA</span>
                        </div>
                        <h3 className="font-display font-black text-xl sm:text-2xl leading-tight max-w-[55%]">
                            India's Most Trusted Family Cars
                        </h3>
                        <p className="text-white/80 text-xs mt-2 max-w-[55%] leading-relaxed">
                            Featuring Swift, Brezza, Ertiga, and Dzire.
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0d64db] rounded-full text-xs font-bold shadow-sm group-hover:bg-blue-50 transition-colors">
                            <span>Explore Arena</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                    <div className="absolute right-1 bottom-2 pointer-events-none select-none flex items-end justify-end h-[120px] sm:h-[140px] max-w-[46%]">
                        <img src={ARENA_HERO_IMG} alt="Brezza" className="h-full w-auto max-w-full object-contain drop-shadow-xl" loading="lazy" />
                    </div>
                </Link>

                <Link
                    to="/cars?channel=Nexa"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#060a0f] to-[#111a28] text-white shadow-lg min-h-[220px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 pointer-events-none" />
                    <div className="relative z-10 p-6">
                        <div className="mb-2 select-none">
                            <span className="font-serif tracking-[0.4em] text-xs font-bold uppercase">N E X A</span>
                        </div>
                        <h3 className="font-display font-black text-xl sm:text-2xl leading-tight max-w-[55%]">
                            Create. Inspire. Luxury Redefined.
                        </h3>
                        <p className="text-white/70 text-xs mt-2 max-w-[55%] leading-relaxed">
                            Grand Vitara, Baleno, Fronx Turbo & Jimny 4x4.
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full text-xs font-bold shadow-sm group-hover:bg-slate-100 transition-colors">
                            <span>Discover Nexa</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                    <div className="absolute right-1 bottom-2 pointer-events-none select-none flex items-end justify-end h-[120px] sm:h-[140px] max-w-[46%]">
                        <img src={NEXA_HERO_IMG} alt="Baleno" className="h-full w-auto max-w-full object-contain drop-shadow-xl" loading="lazy" />
                    </div>
                </Link>
            </div>
        </section>
    );
}