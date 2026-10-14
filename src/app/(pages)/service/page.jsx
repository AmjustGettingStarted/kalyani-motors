import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { useKalyani } from "../../../context/KalyaniContext";
import { submitLead } from "../../../services/zuqoClient";
import useServices from "../../../components/hooks/useServices";
import useServiceBanners from "../../../components/hooks/useServiceBanners";
import useServiceFaq from "../../../components/hooks/useServiceFaq";
import useServiceVideo from "../../../components/hooks/useServiceVideo";
import useOutlets from "../../../components/hooks/useOutlets";
import FAQsection from "../../../components/home/FAQsection";
import { mockServices } from "../../../data/fallbacks/fallbackServices";

export default function ServicePage() {
  const { selectedCity } = useKalyani();
  const { data: allOutlets = [] } = useOutlets();
  const { data: servicesData } = useServices();
  const { data: serviceBanners = {} } = useServiceBanners();
  const { data: serviceFaqs = [] } = useServiceFaq();
  const { data: videoData } = useServiceVideo();

  const heroRef = useRef(null);
  const serviceSectionRef = useRef(null);
  const serviceRefs = useRef({});
  const [activeService, setActiveService] = useState("maintenance");
  const isProgrammaticScroll = useRef(false);

  const currentCity = selectedCity || "Bengaluru";

  const heroImages = useMemo(() => {
    const banners = serviceBanners[currentCity] || serviceBanners["Bengaluru"] || [];
    return banners.length >= 7
      ? banners.slice(0, 7)
      : [...banners, ...mockServices.heroImages].slice(0, 7);
  }, [serviceBanners, currentCity]);

  const serviceCategories = useMemo(() => {
    return servicesData && servicesData.length > 0
      ? servicesData
      : mockServices.serviceCategories;
  }, [servicesData]);

  const youtubeEmbedUrl = useMemo(() => {
    if (!videoData) return null;
    const v = String(videoData).trim();
    if (!v) return null;
    if (v.includes("embed")) return v;
    if (v.includes("watch?v=")) return v.replace("watch?v=", "embed/");
    if (v.includes("youtu.be/")) return v.replace("youtu.be/", "www.youtube.com/embed/");
    return `https://www.youtube-nocookie.com/embed/${v}`;
  }, [videoData]);

  const [bookingForm, setBookingForm] = useState({
    carModel: "Swift",
    regNumber: "",
    serviceType: "10,000 km / 1 Year Periodic Service",
    workshopId: allOutlets[0]?.id || "",
    pickupRequired: false,
    date: "",
    timeSlot: "Morning (09:00 AM - 12:00 PM)",
    fullName: "",
    phone: "",
  });

  const [successInfo, setSuccessInfo] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingConsent, setBookingConsent] = useState(false);

  /* HERO SCROLL */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const visibleRatiosRef = useRef({});
  const activeServiceRef = useRef(activeService);

  useEffect(() => {
    activeServiceRef.current = activeService;
  }, [activeService]);

  useEffect(() => {
    if (!serviceCategories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        entries.forEach((entry) => {
          const id = entry.target.dataset.serviceId;
          if (id) {
            visibleRatiosRef.current[id] = entry.isIntersecting
              ? entry.intersectionRatio
              : 0;
          }
        });

        let bestId = null;
        let highestRatio = 0;

        for (const [id, ratio] of Object.entries(visibleRatiosRef.current)) {
          if (ratio > highestRatio) {
            highestRatio = ratio;
            bestId = id;
          }
        }

        const currentId = activeServiceRef.current;
        const currentRatio =
          (currentId && visibleRatiosRef.current[currentId]) || 0;

        if (bestId && highestRatio > 0.15) {
          if (bestId !== currentId) {
            if (highestRatio > currentRatio + 0.15 || currentRatio < 0.1) {
              setActiveService(bestId);
            }
          }
        }
      },
      {
        rootMargin: "-20% 0px -30% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    );

    serviceCategories.forEach((service) => {
      const el = serviceRefs.current[service.id];
      if (el) {
        el.dataset.serviceId = service.id;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [serviceCategories]);

  const scrollToService = (id) => {
    isProgrammaticScroll.current = true;
    setActiveService(id);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    serviceRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: isMobile ? "center" : "start",
    });

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 1000);
  };

  const positions = [
    { x: "-38vw", y: "-17vh", rotate: 0 },
    { x: "-34vw", y: "16vh", rotate: 0 },
    { x: "-14vw", y: "-28vh", rotate: 0 },
    { x: "0vw", y: "34vh", rotate: 0 },
    { x: "14vw", y: "-28vh", rotate: 0 },
    { x: "34vw", y: "16vh", rotate: 0 },
    { x: "38vw", y: "-13vh", rotate: 0 },
  ];

  const openBooking = (service) => {
    setSelectedService(service);
    setBookingConsent(false);
    setSuccessInfo(null);

    setBookingForm((prev) => ({
      ...prev,
      serviceType: service.title || "General Service",
    }));

    setIsBookingOpen(true);
  };

  const mutation = useMutation({
    mutationFn: submitLead,
    onSuccess: (res) => {
      setSuccessInfo(res);
    },
    onError: () => {
      alert("Could not submit booking. Please try again or call our hotline.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bookingConsent) {
      alert("Please accept to continue");
      return;
    }

    mutation.mutate({
      name: bookingForm.fullName,
      phone: bookingForm.phone,
      city: currentCity,
      location: currentCity,
      vehicle: bookingForm.serviceType || "Car Service",
      purpose: "Book Service",
    });
  };

  return (
    <main className="bg-[#f5f5f3] text-slate-950">
      {/* 1. HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#edf7ff] via-[#f7fbff] to-[#eaf4ff]" />

          <motion.div
            className="absolute z-30 inset-0 flex items-center justify-center text-center pointer-events-none"
            style={{
              y: useTransform(scrollYProgress, [0, 0.7], ["0%", "-12%"]),
            }}
          >
            <div className="max-w-3xl px-6">
              <motion.p
                className="font-display font-black tracking-[0.12em] text-[clamp(3rem,7vw,5rem)] leading-[0.9]"
                style={{
                  scale: useTransform(scrollYProgress, [0, 0.7], [1, 0.78]),
                }}
              >
                SERVICE AND CARE
              </motion.p>
            </div>
          </motion.div>

          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            {heroImages.map((item, index) => (
              <OrbitImage
                key={item.id || index}
                item={item}
                index={index}
                scrollYProgress={scrollYProgress}
                position={positions[index % positions.length]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section
        ref={serviceSectionRef}
        className="relative bg-[#f4f9ff] text-[#071936]"
      >
        <ServiceNavigation
          services={serviceCategories}
          activeService={activeService}
          onSelect={scrollToService}
        />
        {serviceCategories.map((service, index) => (
          <ServiceSection
            key={service.id}
            service={service}
            index={index}
            onBook={openBooking}
            sectionRef={(element) => {
              serviceRefs.current[service.id] = element;
            }}
          />
        ))}
        <div className="pb-12 md:pb-16" />
      </section>

      {/* 3. PERIODIC MAINTENANCE MILESTONES (PRESERVED STATIC DATA) */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold tracking-widest text-blue-700 uppercase block mb-1">
            Manufacturer Schedule
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#071936] tracking-tight">
            Periodic Maintenance Milestones
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Keep your Maruti Suzuki performing at its prime while preserving complete warranty coverage across South India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockServices.periodicMaintenance.map((pm) => (
            <div
              key={pm.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-100">
                    {pm.tag}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    {pm.duration}
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-[#071936]">{pm.interval}</h3>
                <p className="mt-1 text-xs font-bold text-red-600">{pm.mileage}</p>
                <p className="mt-1 text-xs font-semibold text-slate-800">{pm.price}</p>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">{pm.description}</p>

                <div className="mt-5 border-t border-slate-100 pt-4 space-y-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Key Checklist:
                  </span>
                  {pm.checks.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => openBooking({ title: pm.interval })}
                  className="w-full rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-800 border border-slate-200/80 transition hover:bg-blue-700 hover:text-white hover:border-blue-700 cursor-pointer"
                >
                  Book This Interval
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SPECIALIZED WORKSHOP CAPABILITIES (PRESERVED STATIC DATA) */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold tracking-widest text-red-600 uppercase block mb-1">
            Specialized Solutions
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#071936] tracking-tight">
            Kalyani Premium Workshop Capabilities
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Express quick bays, mobile doorstep service vans, and computerized paint-booth body repairs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockServices.specializedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div>
                <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200 mb-3">
                  {pkg.badge}
                </span>
                <h3 className="font-display font-black text-base text-[#071936] leading-snug">{pkg.title}</h3>
                <p className="mt-1 text-xs font-semibold text-blue-700">{pkg.subtitle}</p>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">{pkg.description}</p>

                <div className="mt-4 border-t border-slate-100 pt-3 space-y-1.5">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{pkg.price}</span>
                <button
                  type="button"
                  onClick={() => openBooking({ title: pkg.title })}
                  className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-700 hover:text-white transition cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WORKSHOP WALKTHROUGH VIDEO EMBED (LIVE API) */}
      {youtubeEmbedUrl && (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-blue-700 uppercase block mb-1">
              Workshop Walkthrough
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#071936] tracking-tight">
              See Our Service Center in Action
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
              State-of-the-art bays, OEM diagnostic instruments, and certified technicians dedicated to your Maruti Suzuki.
            </p>
          </div>
          <div className="relative aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-200/90 shadow-2xl bg-slate-900">
            <iframe
              src={youtubeEmbedUrl}
              title="Kalyani Motors Workshop Experience"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* 6. CASHLESS INSURANCE CLAIM PARTNERS (PRESERVED STATIC DATA) */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-8 sm:p-12 text-center shadow-sm">
          <span className="text-xs font-bold tracking-widest text-blue-700 uppercase block mb-1">
            Hassle-Free Repairs
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-[#071936] tracking-tight">
            Cashless Insurance Claim Settlement
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            Direct survey, paperless settlement, and authorized body shop repairs with top national insurers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {mockServices.insurancePartners.map((partner) => (
              <div
                key={partner}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SERVICE FAQS (LIVE API) */}
      {serviceFaqs && serviceFaqs.length > 0 && (
        <section className="border-t border-slate-200/80 bg-slate-50/50 py-16 sm:py-20">
          <FAQsection faqs={serviceFaqs} />
        </section>
      )}

      {/* 8. SERVICE BOOKING POPUP */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
          >
            <div className="h-1.5 w-full bg-blue-700" />

            <div className="p-6 md:p-8">
              <div className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-700">
                  Kalyani Motors
                </p>

                <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-[#071936]">
                  Book Your Service
                </h2>

                {selectedService && (
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {selectedService.title}
                  </p>
                )}
              </div>

              {successInfo ? (
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                  >
                    <Check className="h-8 w-8 text-emerald-600" />
                  </motion.div>

                  <h3 className="font-display text-2xl font-black text-[#071936]">
                    Service Request Received
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                    Thank you, {bookingForm.fullName}. Our team will contact you
                    shortly regarding your service request.
                  </p>

                  {successInfo?.appointmentId && (
                    <p className="mt-4 text-xs font-bold text-blue-700">
                      Appointment ID: {successInfo.appointmentId}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsBookingOpen(false);
                      setSuccessInfo(null);
                    }}
                    className="mt-6 rounded-full bg-blue-700 px-6 py-3 text-xs font-bold text-white transition hover:bg-blue-800 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Name
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={bookingForm.fullName}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <input
                      type="checkbox"
                      checked={bookingConsent}
                      onChange={(e) => setBookingConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-blue-700"
                    />

                    <span className="text-[11px] leading-relaxed text-slate-600">
                      Disclaimer: I authorize Kalyani Motors to send
                      notifications via SMS, Kalyani Super App, WhatsApp, Email
                      and RCS.
                    </span>
                  </label>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(false)}
                      className="rounded-full border border-slate-200 px-6 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                    >
                      Close
                    </button>

                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="rounded-full bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      {mutation.isPending ? "Booking..." : "Book Service"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

/* Mobile Check */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

/* SERVICE NAVIGATION */
function ServiceNavigation({ services = [], activeService, onSelect }) {
  const navRef = useRef(null);
  const itemRefs = useRef({});

  const centerItem = (id, behavior = "smooth") => {
    const nav = navRef.current;
    const item = itemRefs.current[id];
    if (!nav || !item) return;

    nav.scrollTo({
      left: item.offsetLeft + item.offsetWidth / 2 - nav.clientWidth / 2,
      behavior,
    });
  };

  useEffect(() => {
    if (!services.length) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      centerItem(activeService, "smooth");
    }
  }, [activeService, services]);

  return (
    <div className="sticky top-[calc(100vh-6rem)] z-40 flex justify-center px-4 py-3 pointer-events-none">
      {/* Mobile Navigation */}
      <nav
        ref={navRef}
        className="pointer-events-auto flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-white/80 bg-white/95 p-1.5 shadow-[0_10px_40px_rgba(20,70,140,0.15)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
      >
        {services.map((service) => {
          const isActive = activeService === service.id;
          return (
            <button
              key={service.id}
              ref={(element) => {
                if (element) itemRefs.current[service.id] = element;
              }}
              type="button"
              onClick={() => onSelect(service.id)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-[11px] font-bold cursor-pointer transition-all duration-300 ${
                isActive ? "bg-blue-700 text-white shadow-md" : "text-slate-700"
              }`}
            >
              <span className="relative z-10 whitespace-nowrap">
                {service.shortTitle}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Navigation */}
      <nav className="pointer-events-auto hidden max-w-full items-center gap-1 rounded-full border border-white/80 bg-white/95 p-1.5 shadow-[0_10px_40px_rgba(20,70,140,0.15)] backdrop-blur-xl md:flex">
        {services.map((service) => {
          const isActive = activeService === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer transition-colors ${
                isActive ? "text-white" : "text-slate-700 hover:text-blue-700"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeServiceNavBg"
                  className="absolute inset-0 rounded-full bg-blue-700 shadow-md -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">
                {service.shortTitle}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* SERVICE CARD */
function ServiceSection({ service, index, sectionRef, onBook }) {
  const isReversed = index % 2 === 1;
  const isMobile = useIsMobile();

  const localSectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: localSectionRef,
    offset: ["start end", "end start"],
  });

  const desktopRange = isReversed
    ? ["100%", "65%", "65%", "100%"]
    : ["-100%", "-65%", "-65%", "-100%"];

  const mobileRange = isReversed
    ? ["100%", "45%", "45%", "100%"]
    : ["-100%", "-45%", "-45%", "-100%"];

  const smokeX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    isMobile ? mobileRange : desktopRange,
  );

  return (
    <section
      ref={(element) => {
        localSectionRef.current = element;
        sectionRef(element);
      }}
      className="relative h-[70vh] md:h-screen overflow-hidden"
    >
      <div
        className={`absolute inset-y-0 w-full ${
          isReversed ? "left-0" : "right-0"
        }`}
      >
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover"
        />
        <motion.div
          className={`pointer-events-none absolute inset-y-0 w-full z-[5] rounded-xxl md:rounded-full blur-3xl ${
            isReversed
              ? "right-0 bg-gradient-to-l from-white to-white"
              : "left-0 bg-gradient-to-r from-white to-white"
          }`}
          style={{
            x: smokeX,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-[70vh] md:h-screen items-center px-6 md:px-12 lg:px-16">
        <div className={`w-[50%] md:w-[30%] ${isReversed ? "ml-auto" : ""}`}>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-black leading-[0.9] tracking-[-0.05em] text-[#071936] md:text-6xl lg:text-7xl">
            {service.title}
          </h2>

          <p className="mt-4 text-sm font-semibold text-blue-700 md:text-lg">
            {service.subtitle}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-slate-600 md:text-base">
            {service.description}
          </p>

          <button
            type="button"
            onClick={() => onBook(service)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-xs md:text-sm font-bold text-white transition-colors hover:bg-blue-800 cursor-pointer"
          >
            Book Your Service
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function OrbitImage({ item, index, scrollYProgress, position }) {
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      position.x,
      `${parseFloat(position.x) * 0.25}vw`,
      `${(index - 3) * 1.1}vw`,
    ],
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [position.y, `25vh`, "25vh"],
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [position.rotate, position.rotate * 0.2, (index - 3) * 2],
  );

  const scale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.72, 0.52]);
  const opacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0.85]);

  return (
    <motion.div
      className="absolute w-[150px] h-[105px] md:w-[250px] md:h-[165px] lg:w-[300px] lg:h-[190px] rounded-2xl overflow-hidden shadow-2xl border border-white/70"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex: 10 + index,
      }}
    >
      <img
        src={item.image || item.imageUrl}
        alt={item.alt || item.title || "Kalyani Service"}
        className="w-full h-full object-cover"
        draggable="false"
      />

      <div className="absolute inset-0 bg-black/10" />
    </motion.div>
  );
}
