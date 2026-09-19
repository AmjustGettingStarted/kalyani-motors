import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Building, ShieldCheck, Clock } from "lucide-react";

const VISIBLE_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

const TRANSITION_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.75,
};

const KALYANI_ITEMS = [
  {
    id: "stat-customers",
    stat: "20+ Lakh",
    badge: "Satisfied Customers",
    quote:
      "Delivering dreams and creating smiles across Karnataka, Telangana, and Tamil Nadu for over 18 years.",
    author: "20+ Lakh Families",
    role: "South India Retail Network",
    icon: Users,
    iconColor: "bg-blue-50 text-blue-800 border-blue-100",
    selectedImage:
      "https://images.unsplash.com/photo-1568310242860-b365653288c8?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    defaultImage:
      "https://images.unsplash.com/photo-1692878807328-f1acdc090606?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Satisfied customer delivery ceremony",
  },
  {
    id: "stat-outlets",
    stat: "100+ Outlets",
    badge: "Showrooms & Workshops",
    quote:
      "State-of-the-art facilities located conveniently across all major tech hubs, cities, and highways.",
    author: "100+ Locations",
    role: "Karnataka & Beyond",
    icon: Building,
    iconColor: "bg-red-50 text-red-600 border-red-100",
    defaultImage:
      "https://images.unsplash.com/photo-1651751055282-095885ec2544?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    selectedImage:
      "https://content3.jdmagicbox.com/v2/comp/bangalore/v6/080pxx80.xx80.190718182331.f5v6/catalogue/kalyani-motors-banaswadi-bangalore-car-repair-and-services-qnjuof3nod.jpg",

    alt: "Kalyani Motors state-of-the-art facility",
  },
  {
    id: "stat-rating",
    stat: "4.8 / 5.0",
    badge: "Google Customer Rating",
    quote:
      "Over 50,000 verified reviews praising prompt service, polite staff, and genuine advisory.",
    author: "50,000+ Reviews",
    role: "Verified Google Rating",
    icon: ShieldCheck,
    iconColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    defaultImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    selectedImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    alt: "Customer service excellence",
  },
  {
    id: "stat-service",
    stat: "60-Min Express",
    badge: "Quick Service Bays",
    quote:
      "Twin-technician synchronized servicing with zero delay while you relax in executive lounge.",
    author: "60-Min Express Bay",
    role: "Authorized Maruti Care",
    icon: Clock,
    iconColor: "bg-amber-50 text-amber-600 border-amber-100",
    defaultImage:
      "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    selectedImage:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
    alt: "Express service workshop bay",
  },
];

export default function WhyChooseKalyaniSection({
  items = KALYANI_ITEMS,
  autoPlayInterval = 6000,
  pauseOnHover = true,
}) {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const elapsedRef = useRef(0);

  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tier, setTier] = useState("desktop");
  const [viewportWidth, setViewportWidth] = useState(1200);

  const total = items.length;
  const activeIndex = ((page % total) + total) % total;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      if (width < 768) {
        setTier("mobile");
      } else if (width < 1120) {
        setTier("tablet");
      } else {
        setTier("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (pauseOnHover && isHovered) {
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      elapsedRef.current += delta;

      if (elapsedRef.current >= autoPlayInterval) {
        elapsedRef.current = 0;
        lastTimeRef.current = null;
        setProgress(0);
        setPage((curr) => curr + 1);
        return;
      }

      setProgress(Math.min((elapsedRef.current / autoPlayInterval) * 100, 100));
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [page, pauseOnHover, isHovered, autoPlayInterval]);

  const handlePrev = useCallback(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
    setPage((curr) => curr - 1);
  }, []);

  const handleNext = useCallback(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
    setPage((curr) => curr + 1);
  }, []);

  const handleSelectTab = (idx) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    else if (diff < -total / 2) diff += total;

    elapsedRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
    setPage((curr) => curr + diff);
  };

  const handleSelectCard = (offset) => {
    if (offset !== 0) {
      elapsedRef.current = 0;
      lastTimeRef.current = null;
      setProgress(0);
      setPage((curr) => curr + offset);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrev();
    else if (e.key === "ArrowRight") handleNext();
  };

  const activeDimensions = {
    desktop: { width: 780, height: 440 },
    tablet: { width: 560, height: 420 },
    mobile: { width: Math.min(340, viewportWidth - 48), height: 470 },
  }[tier];

  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="bg-slate-50 py-16 px-4 sm:px-8 border-y border-slate-200 overflow-hidden will-change-transform"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="text-xs font-bold tracking-widest text-blue-800 uppercase block mb-1">
            Legacy of Excellence
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Why 20+ Lakh Families Choose Kalyani Motors
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            For over 18 years, Kalyani Motors has set the gold standard in
            automotive retail, transparent financing, and authorized Maruti
            Suzuki care across South India.
          </p>
        </motion.div>

        {/* Interactive Expandable Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          ref={containerRef}
          role="region"
          aria-label="Kalyani Motors Milestones Carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full max-w-[1240px] flex flex-col items-center select-none outline-none"
        >
          <div
            className="relative w-full flex items-center justify-center"
            style={{ height: activeDimensions.height }}
          >
            {VISIBLE_OFFSETS.map((offset) => {
              const virtualIndex = page + offset;
              const itemIndex = ((virtualIndex % total) + total) % total;
              const item = items[itemIndex];
              const isActive = offset === 0;
              const Icon = item.icon;

              const getVariant = () => {
                if (tier === "mobile") {
                  const activeW = activeDimensions.width;
                  const activeH = activeDimensions.height;
                  const gap = 14;
                  const peekW = 55;
                  const peekH = 390;

                  if (offset === 0) {
                    return {
                      x: -activeW / 2,
                      y: -activeH / 2,
                      width: activeW,
                      height: activeH,
                      opacity: 1,
                      zIndex: 10,
                      pointerEvents: "auto",
                    };
                  }
                  if (offset === -1) {
                    return {
                      x: -activeW / 2 - gap - peekW,
                      y: -peekH / 2,
                      width: peekW,
                      height: peekH,
                      opacity: 1,
                      zIndex: 5,
                      pointerEvents: "auto",
                    };
                  }
                  if (offset === 1) {
                    return {
                      x: activeW / 2 + gap,
                      y: -peekH / 2,
                      width: peekW,
                      height: peekH,
                      opacity: 1,
                      zIndex: 5,
                      pointerEvents: "auto",
                    };
                  }
                  return {
                    x: offset < 0 ? -activeW / 2 - 220 : activeW / 2 + 220,
                    y: -peekH / 2,
                    width: peekW,
                    height: peekH,
                    opacity: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                  };
                }

                if (tier === "tablet") {
                  const activeW = 560;
                  const activeH = 420;
                  const gap = 16;
                  const sideW = 90;
                  const sideH = 330;

                  if (offset === 0) {
                    return {
                      x: -activeW / 2,
                      y: -activeH / 2,
                      width: activeW,
                      height: activeH,
                      opacity: 1,
                      zIndex: 10,
                      pointerEvents: "auto",
                    };
                  }
                  if (offset === -1) {
                    return {
                      x: -activeW / 2 - gap - sideW,
                      y: -sideH / 2,
                      width: sideW,
                      height: sideH,
                      opacity: 1,
                      zIndex: 5,
                      pointerEvents: "auto",
                    };
                  }
                  if (offset === 1) {
                    return {
                      x: activeW / 2 + gap,
                      y: -sideH / 2,
                      width: sideW,
                      height: sideH,
                      opacity: 1,
                      zIndex: 5,
                      pointerEvents: "auto",
                    };
                  }
                  return {
                    x: offset < 0 ? -activeW / 2 - 240 : activeW / 2 + 240,
                    y: -sideH / 2,
                    width: 70,
                    height: 200,
                    opacity: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                  };
                }

                // Desktop Layout
                switch (offset) {
                  case 0:
                    return {
                      x: -390,
                      y: -220,
                      width: 780,
                      height: 440,
                      opacity: 1,
                      zIndex: 10,
                      pointerEvents: "auto",
                    };
                  case -1:
                    return {
                      x: -510,
                      y: -150,
                      width: 100,
                      height: 300,
                      opacity: 1,
                      zIndex: 5,
                      pointerEvents: "auto",
                    };
                  case 1:
                    return {
                      x: 410,
                      y: -150,
                      width: 100,
                      height: 300,
                      opacity: 1,
                      zIndex: 5,
                      pointerEvents: "auto",
                    };
                  case -2:
                    return {
                      x: -595,
                      y: -95,
                      width: 70,
                      height: 190,
                      opacity: 1,
                      zIndex: 3,
                      pointerEvents: "auto",
                    };
                  case 2:
                    return {
                      x: 525,
                      y: -95,
                      width: 70,
                      height: 190,
                      opacity: 1,
                      zIndex: 3,
                      pointerEvents: "auto",
                    };
                  default:
                    return {
                      x: offset < 0 ? -820 : 820,
                      y: -95,
                      width: 70,
                      height: 190,
                      opacity: 0,
                      zIndex: 0,
                      pointerEvents: "none",
                    };
                }
              };

              return (
                <motion.div
                  key={virtualIndex}
                  onClick={() => handleSelectCard(offset)}
                  initial={false}
                  animate={getVariant()}
                  transition={TRANSITION_SPRING}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    willChange: "transform",
                  }}
                  className={`rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-[0_12px_36px_rgba(15,23,42,0.08)] overflow-visible ${
                    !isActive ? "cursor-pointer hover:border-slate-300" : ""
                  }`}
                >
                  {/* Left Peeking Connector Notch */}
                  {offset === -1 && (
                    <div
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 flex items-center text-white pointer-events-none z-[50]"
                      style={{
                        width: 22,
                        height: 42,
                        margin: "auto 0",
                        left: "calc(100% - 1px)",
                      }}
                    >
                      <svg
                        viewBox="0 0 20 37.3338"
                        preserveAspectRatio="none"
                        className="w-full h-full fill-current"
                      >
                        <path d="M0 0C0 0 1.2422 13.5759 10 13.5759C18.7578 13.5759 20 0 20 0V37.3338C20 37.3338 18.7578 23.7578 10 23.7578C1.2422 23.7578 0 37.3338 0 37.3338V0Z" />
                      </svg>
                    </div>
                  )}

                  {/* Right Peeking Connector Notch */}
                  {offset === 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 flex items-center text-white pointer-events-none z-[50]"
                      style={{
                        width: 22,
                        height: 42,
                        margin: "auto 0",
                        right: "calc(100% - 1px)",
                      }}
                    >
                      <svg
                        viewBox="0 0 20 37.3338"
                        preserveAspectRatio="none"
                        className="w-full h-full fill-current"
                      >
                        <path d="M0 0C0 0 1.2422 13.5759 10 13.5759C18.7578 13.5759 20 0 20 0V37.3338C20 37.3338 18.7578 23.7578 10 23.7578C1.2422 23.7578 0 37.3338 0 37.3338V0Z" />
                      </svg>
                    </div>
                  )}

                  <div className="w-full h-full overflow-hidden relative rounded-[inherit]">
                    {/* Inactive Thumbnail Preview */}
                    <motion.div
                      initial={false}
                      animate={{ opacity: isActive ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute inset-0 p-2 ${
                        isActive ? "pointer-events-none" : ""
                      }`}
                    >
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 relative">
                        <img
                          src={item.defaultImage}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </motion.div>

                    {/* Active Expanded Card Presentation */}
                    <div
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "50%",
                        width: activeDimensions.width,
                        height: activeDimensions.height,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          x: isActive ? 0 : offset < 0 ? -600 : 600,
                        }}
                        transition={TRANSITION_SPRING}
                        className={`w-full h-full flex flex-col md:flex-row p-6 sm:p-8 gap-6 ${
                          !isActive ? "pointer-events-none" : ""
                        }`}
                      >
                        {/* Text & Metrics Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between text-left py-1">
                          <div>
                            <div className="flex items-center gap-2.5 mb-4">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.iconColor}`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                                {item.badge}
                              </span>
                            </div>

                            <h3 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight leading-tight">
                              {item.stat}
                            </h3>

                            <p className="font-serif text-sm sm:text-base text-slate-600 mt-3.5 leading-relaxed italic">
                              "{item.quote}"
                            </p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">
                                {item.author}
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                {item.role}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                              Verified Milestone
                            </span>
                          </div>
                        </div>

                        {/* Visual Asset Panel */}
                        <div className="relative shrink-0 overflow-hidden rounded-2xl bg-slate-100 w-full md:w-[46%] h-[180px] md:h-full">
                          <img
                            src={item.selectedImage}
                            alt={item.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Auto-advancing Pill Navigation Indicators */}
          <div
            role="tablist"
            aria-label="Milestone navigation tabs"
            className="flex items-center gap-2 mt-8"
          >
            {items.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  onClick={() => handleSelectTab(idx)}
                  aria-selected={isSelected}
                  aria-label={`Milestone tab ${idx + 1}: ${item.stat}`}
                  className={`h-2 rounded-full overflow-hidden p-0 cursor-pointer transition-all duration-300 outline-none ${
                    isSelected
                      ? "w-20 bg-slate-200"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                >
                  {isSelected && (
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        transformOrigin: "0% 50%",
                        transform: `scaleX(${progress / 100})`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
