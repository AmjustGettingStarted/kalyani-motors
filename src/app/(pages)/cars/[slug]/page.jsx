import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useKalyani } from "../../../../context/KalyaniContext";
import { formatINR } from "../../../../lib/utils";
import CarCard from "../../../../components/widgets/CarCard";
import EMICalculator from "./EMICalculator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
// import Car360Viewer from "../../../../components/widgets/Car360Viewer";
// import get360Frames from "../../../../app/images/fronx/360/frames";
import {
  Gauge,
  Fuel,
  ShieldCheck,
  Calendar,
  CheckCircle,
  Sparkles,
  Award,
  Download,
} from "lucide-react";
import useCarBySlug from "../../../../components/hooks/useCarBySlug";
import useModels from "../../../../components/hooks/useModels";

const CarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
    window.scrollTo(0, 0);
  }, [slug]);

  const { openTestDrive, selectedCity } = useKalyani();
  const { data: allModels = [] } = useModels();
  const { data: variants, isLoading, isError } = useCarBySlug(slug);

  const car = variants?.[0];

  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeSpecTab, setActiveSpecTab] = useState("Performance");
  const [activeGalleryTab, setActiveGalleryTab] = useState("Exterior");
  const [openFaqIndices, setOpenFaqIndices] = useState([0]);
  const [previewImage, setPreviewImage] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  useEffect(() => {
    if (car) {
      if (car.variants?.length > 0) {
        setSelectedVariant(car.variants[0]);
      }
      if (car.colors?.length > 0) {
        setSelectedColor(car.colors[0]);
      }
      if (car.gallery?.exterior?.length > 0) {
        setActiveImage(car.gallery.exterior[0]);
      } else if (car.heroImage) {
        setActiveImage(car.heroImage);
      }
    }
  }, [car]);

  // Listen to open-emi-offers custom event from EMICalculator
  useEffect(() => {
    const handleEmiOffers = () => {
      if (car) {
        openTestDrive({
          ...car,
          purpose: "On Road Price",
          selectedVariant,
        });
      }
    };
    window.addEventListener("open-emi-offers", handleEmiOffers);
    return () => window.removeEventListener("open-emi-offers", handleEmiOffers);
  }, [car, selectedVariant, openTestDrive]);

  const carFaqs = useMemo(() => {
    if (!car) return [];
    return [
      {
        question: `What is the exact mileage of Maruti Suzuki ${car.name}?`,
        answer: `The Maruti Suzuki ${car.name} delivers an impressive ARAI-certified fuel efficiency of ${car.mileage || "22.89 km/l"}. Real-world mileage may vary based on driving style, traffic conditions, and maintenance.`,
        category: "Mileage & Efficiency",
        icon: Fuel,
      },
      {
        question: `What are the available variants of ${car.name}?`,
        answer: `The ${car.name} is available in ${car.variants?.length || 4} variants: ${car.variants?.map((v) => v.name).join(", ") || "Sigma, Delta, Zeta, Alpha"}. You can choose between ${car.transmissionTypes?.join(" and ") || "Manual and Automatic"} transmissions.`,
        category: "Variants & Trims",
        icon: Gauge,
      },
      {
        question: `Does the ${car.name} come with a sunroof option?`,
        answer: `${car.name.toLowerCase().includes("grand vitara") || car.name.toLowerCase().includes("brezza")
            ? `Yes, ${car.name} comes equipped with an electric/panoramic sunroof on select top variants for a premium, airy cabin feel.`
            : `The ${car.name} emphasizes aerodynamic coupe styling and enhanced structural rigidity with UV-cut glass and modern cabin design.`
          } Visit Kalyani Motors for complete trim feature details.`,
        category: "Features & Comfort",
        icon: Sparkles,
      },
      {
        question: `What is the boot space capacity of ${car.name}?`,
        answer: `The Maruti Suzuki ${car.name} features a practical ${car.bootSpace || "308 Litres"} luggage capacity with 60:40 split-folding rear seats, easily accommodating family road trip bags and daily shopping.`,
        category: "Storage & Utility",
        icon: ShieldCheck,
      },
      {
        question: `What warranty and roadside assistance coverage is included?`,
        answer: `Every new car comes with a 2-year / 40,000 km standard manufacturer warranty, extendable up to 5 years / 1,00,000 km, plus 24/7 Roadside Assistance across South India.`,
        category: "Warranty & Support",
        icon: Award,
      },
      {
        question: `How can I finance ${car.name} or book a doorstep test drive?`,
        answer: `You can schedule a complimentary doorstep test drive right from this page. Kalyani Motors also arranges instant bank financing approvals with low interest rates and low down payments.`,
        category: "Booking & Finance",
        icon: Calendar,
      },
    ];
  }, [car]);

  if (isLoading && !car) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading vehicle details...</p>
      </div>
    );
  }

  if (!car || isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display text-slate-900">
          Car Not Found
        </h2>
        <p className="text-slate-500 text-sm">
          The model "{slug}" could not be located in our catalog.
        </p>
        <button
          onClick={() => navigate("/cars")}
          className="px-6 py-2.5 bg-blue-800 text-white font-bold rounded-xl text-xs hover:bg-blue-900"
        >
          Back to All Cars
        </button>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || car.startingPrice || 650000;

  const otherCars = allModels
    .filter((c) => c.slug?.toLowerCase() !== slug?.toLowerCase())
    .slice(0, 5);

  // const rotationFrames = useMemo(() => {
  //   return get360Frames(car.slug, selectedColor?.key);
  // }, [car.slug, selectedColor?.key]);

  return (
    <>
      <div className="w-full pt-16 sm:pt-20" />
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans px-4 pb-4 sm:p-6">
        {/* Navigation & Breadcrumbs */}
        {/* <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium hover:text-gray-600">
          <span className="mr-2">←</span> Back
        </button>
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 hidden sm:flex">
          <Link to="/" className="hover:text-blue-800 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/cars" className="hover:text-blue-800 transition-colors">All Cars</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{car.name}</span>
        </nav>
      </div> */}

        {/* HERO - desktop */}
        <section className="hidden lg:block relative w-full h-auto lg:max-h-[540px] mb-8 border rounded-2xl overflow-hidden group">
          <div>
            <img
              src={selectedColor?.image || car.heroImage}
              alt={car.name}
              className="w-full h-full object-contain object-center"
            />
            {/* <div className="absolute inset-0 ">
            <Car360Viewer
              frames={rotationFrames}
              fallbackImage={selectedColor?.image || car.heroImage}
              alt={car.name}
            />
          </div> */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent md:w-2/3"></div> */}
          </div>

          <div className="absolute w-full h-full inset-0 z-10">
            <div className="flex h-full flex-row items-center justify-between px-16">
              {/* left-part */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="text-sm tracking-widest uppercase mb-3 font-semibold">
                  {car.channel === "Nexa"
                    ? "Nexa by Maruti Suzuki"
                    : "Maruti Suzuki Arena"}
                </p>
                <h1 className="text-4xl font-black mb-2 tracking-tight drop-shadow-xl">
                  {car.name}
                </h1>
                <p className="text-lg tracking-widest font-light mb-4 uppercase ">
                  {car.tagline}
                </p>

                <div className="flex flex-wrap gap-4">
                  <span className="px-5 py-2.5 rounded-full bg-white/10  text-sm font-semibold border border-white/20 shadow-lg flex items-center gap-2">
                    <Fuel className="w-4 h-4 " />{" "}
                    {car.fuelTypes?.[0] || "Petrol"}
                  </span>
                  <span className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-sm font-semibold border border-white/20 shadow-lg flex items-center gap-2">
                    <Gauge className="w-4 h-4" />{" "}
                    {car.transmissionTypes?.[0] || "MT/AT"}
                  </span>
                </div>
              </motion.div>

              {/* right-part */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="flex-1 gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-black/70 uppercase tracking-wider font-semibold">
                      Ex-showroom price ({selectedCity})
                    </p>
                    <button
                      type="button"
                      onClick={() => openTestDrive({ ...car, purpose: "On Road Price", selectedVariant })}
                      className="text-[11px] font-bold text-blue-800 hover:text-blue-900 underline underline-offset-2 cursor-pointer"
                    >
                      Get On-Road Price
                    </button>
                  </div>
                  <h2 className="text-3xl font-bold text-black drop-shadow-md">
                    {currentPrice ? formatINR(currentPrice) : car.priceRange}
                  </h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-black/70 font-semibold block uppercase tracking-wider">
                    Select Variant
                  </label>
                  <Select
                    value={selectedVariant?.name || ""}
                    onValueChange={(val) => {
                      const variant = car.variants?.find((v) => v.name === val);
                      if (variant) setSelectedVariant(variant);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 bg-white/40 hover:bg-white/60 border border-grey/20 rounded-xl px-4 text-black font-semibold appearance-none outline-none focus:border-white/60 focus:ring-0 transition-colors backdrop-blur-sm cursor-pointer shadow-sm">
                      <SelectValue placeholder="Select Variant">
                        {selectedVariant
                          ? `${selectedVariant.name} (${selectedVariant.fuel})`
                          : "Select Variant"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 shadow-2xl rounded-xl z-50 p-1 min-w-[240px]">
                      {car.variants?.map((v) => (
                        <SelectItem
                          key={v.name}
                          value={v.name}
                          className="py-2.5 px-3 rounded-lg text-sm font-medium text-slate-800 cursor-pointer focus:bg-slate-100 focus:text-slate-900 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3 w-full">
                            <span className="font-semibold text-slate-900">
                              {v.name}
                            </span>
                            <span className="text-xs text-slate-500 font-normal bg-slate-100 px-2 py-0.5 rounded-full">
                              ({v.fuel})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {car.colors && (
                  <div className="">
                    <div className="flex gap-2.5 flex-wrap">
                      {car.colors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor?.name === c.name
                              ? "border-grey scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                              : `border-grey/20 opacity-80 hover:opacity-100 hover:scale-110`
                            }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-black/80 mt-3 font-medium">
                      {selectedColor?.name}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => openTestDrive(car)}
                  className="w-full py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Test Drive
                </button>
                {car.brochureUrl && (
                  <a
                    href={car.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download Official Brochure
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* HERO - mobile */}
        <section className="lg:hidden pt-20 md:pt-0 mb-8">
          {/* Car name */}
          <motion.div className="text-center mb-4">
            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-slate-500">
              {car.channel === "Nexa"
                ? "Nexa by Maruti Suzuki"
                : "Maruti Suzuki Arena"}
            </p>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 mt-1">
              {car.name}
            </h1>

            <p className="text-xs tracking-widest font-medium text-slate-500 uppercase mt-1">
              {car.tagline}
            </p>
          </motion.div>

          {/* Cropped car image */}
          <div className="relative w-full h-[220px] overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={selectedColor?.image || car.heroImage}
              alt={car.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: "center",
              }}
            />
          </div>

          {/* Price / Variant */}
          <div className="mt-5">
            <div className="grid grid-cols-[4fr_6fr] gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Price
                  </p>
                  <button
                    type="button"
                    onClick={() => openTestDrive({ ...car, purpose: "On Road Price", selectedVariant })}
                    className="text-[10px] font-bold text-blue-700 underline"
                  >
                    On-Road?
                  </button>
                </div>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {currentPrice ? formatINR(currentPrice) : car.priceRange}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Variant
                </p>

                <Select
                  value={selectedVariant?.name || ""}
                  onValueChange={(val) => {
                    const variant = car.variants?.find((v) => v.name === val);
                    if (variant) setSelectedVariant(variant);
                  }}
                >
                  <SelectTrigger className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 shadow-sm focus:ring-2 focus:ring-slate-900/10 cursor-pointer">
                    <SelectValue placeholder="Select Variant">
                      {selectedVariant
                        ? `${selectedVariant.name} (${selectedVariant.fuel})`
                        : "Select Variant"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl z-50 p-1">
                    {car.variants?.map((v) => (
                      <SelectItem
                        key={v.name}
                        value={v.name}
                        className="py-2.5 px-3 rounded-lg text-sm font-medium text-slate-800 cursor-pointer focus:bg-slate-100 focus:text-slate-900"
                      >
                        <div className="flex items-center justify-between gap-2 w-full">
                          <span className="font-semibold text-slate-900">
                            {v.name}
                          </span>
                          <span className="text-xs text-slate-500 font-normal">
                            ({v.fuel})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color */}
            {car.colors && (
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Color
                </p>

                <div className="flex items-center gap-3">
                  {car.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor?.name === c.name
                          ? "border-slate-900 scale-110"
                          : "border-slate-300"
                        }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}

                  <span className="text-xs text-slate-500 ml-1">
                    {selectedColor?.name}
                  </span>
                </div>
              </div>
            )}

            {/* Test Drive */}
            <button
              onClick={() => openTestDrive(car)}
              className="w-full mt-5 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Test Drive
            </button>
            {car.brochureUrl && (
              <a
                href={car.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2.5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-500" />
                Download Brochure
              </a>
            )}
          </div>
        </section>

        {/* SPECIFICATIONS - desktop */}
        <section className="hidden lg:block mb-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold">Specifications</h2>

            <div className="flex bg-gray-100 rounded-full p-1">
              {["Performance", "Safety", "Technology"].map((tab) => {
                const isActive = activeSpecTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveSpecTab(tab)}
                    className="relative px-6 py-2 rounded-full text-sm font-medium"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-spec-tab"
                        className="absolute inset-0 bg-gray-900 rounded-full shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}

                    <motion.span
                      className={`relative z-10 ${isActive ? "text-white" : "text-gray-600"
                        }`}
                      animate={{
                        color: isActive ? "#ffffff" : "#4b5563",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {tab}
                    </motion.span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeSpecTab === "Performance" && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-8 flex-1 w-full">
                <StatItem
                  title="Engine"
                  value={car.engine}
                  desc="Boosted for thrilling performance"
                  direction="left"
                  delay={0}
                />
                <StatItem
                  title="Power"
                  value={car.maxPower}
                  desc="Power that moves you"
                  direction="left"
                  delay={0.1}
                />
                <StatItem
                  title="Torque"
                  value={car.maxTorque}
                  desc="Stronger for every drive"
                  direction="left"
                  delay={0.2}
                />
                <StatItem
                  title="Transmission"
                  value={car.transmissionTypes?.join(", ")}
                  desc="Smooth and efficient"
                  direction="left"
                  delay={0.3}
                />
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-[220px] sm:w-[260px] h-[460px]">
                  {car.topViewImage ? (
                    <img
                      src={car.topViewImage}
                      alt={`${car.name} Top View`}
                      className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <img
                        src={car.heroImage}
                        alt={car.name}
                        className="w-full h-auto object-contain opacity-40 drop-shadow"
                      />
                      <span className="text-gray-400 text-xs mt-2 block font-medium">
                        Top View Diagram
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-3">
                  Aerodynamic Top Profile
                </span>
              </div>

              <div className="space-y-8 flex-1 pl-0 lg:pl-12 w-full">
                <StatItem
                  title="Fuel Type"
                  value={car.fuelTypes?.join(", ")}
                  desc="Efficient and reliable"
                  direction="right"
                  delay={0}
                />
                <StatItem
                  title="Mileage"
                  value={car.mileage}
                  desc="Certified ARAI Mileage"
                  direction="right"
                  delay={0.1}
                />
                <StatItem
                  title="Fuel Tank Capacity"
                  value={car.fuelTank}
                  desc="Ready for longer journeys"
                  direction="right"
                  delay={0.2}
                />
                <StatItem
                  title="Boot Space"
                  value={car.bootSpace}
                  desc="More space for what matters"
                  direction="right"
                  delay={0.3}
                />
              </div>
            </div>
          )}

          {activeSpecTab === "Safety" && (
            <div className="py-20 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
              [ Safety Specifications Data Goes Here ]
            </div>
          )}

          {activeSpecTab === "Technology" && (
            <div className="py-20 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
              [ Technology Features Data Goes Here ]
            </div>
          )}
        </section>

        {/* SPECIFICATIONS - mobile */}
        <section className="lg:hidden mb-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-4">
            Specifications
          </h2>

          {/* Toggle */}
          <div className="flex bg-slate-100 rounded-full p-1 mb-6">
            {["Performance", "Safety", "Technology"].map((tab) => {
              const isActive = activeSpecTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveSpecTab(tab)}
                  className={`flex-1 py-2 rounded-full text-[11px] font-bold transition-all ${isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Performance */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[60%]">
              {activeSpecTab === "Performance" && (
                <div className="space-y-5">
                  <StatItem
                    title="Engine"
                    value={car.engine}
                    desc="Boosted for thrilling performance"
                  />

                  <StatItem
                    title="Power"
                    value={car.maxPower}
                    desc="Power that moves you"
                  />

                  <StatItem
                    title="Torque"
                    value={car.maxTorque}
                    desc="Stronger for every drive"
                  />

                  <StatItem
                    title="Transmission"
                    value={car.transmissionTypes?.join(", ")}
                    desc="Smooth and efficient"
                  />

                  <StatItem
                    title="Fuel Type"
                    value={car.fuelTypes?.join(", ")}
                    desc="Efficient and reliable"
                  />

                  <StatItem
                    title="Mileage"
                    value={car.mileage}
                    desc="Certified ARAI Mileage"
                  />

                  <StatItem
                    title="Fuel Tank Capacity"
                    value={car.fuelTank}
                    desc="Ready for longer journeys"
                  />

                  <StatItem
                    title="Boot Space"
                    value={car.bootSpace}
                    desc="More space for what matters"
                  />
                </div>
              )}

              {activeSpecTab === "Safety" && (
                <div className="py-10 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Safety Specifications Data Goes Here
                </div>
              )}

              {activeSpecTab === "Technology" && (
                <div className="py-10 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Technology Features Data Goes Here
                </div>
              )}
            </div>
            <div className="hidden md:flex md:w-[40%] items-center">
              <div className="w-[220px] sm:w-[260px] h-[460px] bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-100 rounded-full flex items-center justify-center shadow-inner p-5 overflow-hidden relative border border-slate-200">
                {car.topViewImage ? (
                  <img
                    src={car.topViewImage}
                    alt={`${car.name} Top View`}
                    className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="text-center p-4">
                    <img
                      src={car.heroImage}
                      alt={car.name}
                      className="w-full h-auto object-contain opacity-40 drop-shadow"
                    />
                    <span className="text-gray-400 text-xs mt-2 block font-medium">
                      Top View Diagram
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY - desktop */}
        {car.gallery && (
          <section className="hidden md:block mb-8 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-blue-800 uppercase block mb-1">
                  Visual Showcase
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {car.name} Gallery
                </h2>
              </div>

              <div className="flex bg-slate-100 rounded-full p-1 self-start sm:self-auto">
                {["Exterior", "Interior"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveGalleryTab(tab);
                      const tabKey = tab.toLowerCase();
                      const nextImages = car.gallery?.[tabKey] || [];

                      if (nextImages.length > 0) {
                        setActiveImage(nextImages[0]);
                      }
                    }}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeGalleryTab === tab
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Category Images */}
            {(() => {
              const currentTabKey = activeGalleryTab.toLowerCase();
              const currentImages = car.gallery?.[currentTabKey] || [];

              if (currentImages.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-2xl text-slate-400 border-2 border-dashed border-slate-200">
                    <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-xs font-semibold">
                      {activeGalleryTab} images arriving soon for this model
                    </span>
                  </div>
                );
              }

              // Fallback for activeImage if it gets lost
              const displayImage =
                activeImage && currentImages.includes(activeImage)
                  ? activeImage
                  : currentImages[0];

              return (
                <>
                  <motion.div
                    key={activeGalleryTab}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.16,
                          delayChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {/* Main featured image */}
                    <motion.button
                      type="button"
                      onClick={() => setPreviewImage(displayImage)}
                      variants={{
                        hidden: { opacity: 0, scale: 0.94 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.99 }}
                      className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden bg-slate-900 group shadow-md min-h-[300px] md:min-h-[460px] text-left cursor-zoom-in"
                    >
                      <img
                        src={displayImage}
                        alt={`${car.name} ${activeGalleryTab} view`}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-sm text-slate-900 shadow-sm">
                          {activeGalleryTab} View
                        </span>
                      </div>
                    </motion.button>

                    {/* Secondary bento images — all click-to-enlarge */}
                    {currentImages.slice(1, 5).map((img, idx) => (
                      <motion.button
                        key={img}
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        variants={{
                          hidden: {
                            opacity: 0,
                            scale: 0.82,
                            x: -35,
                            y: 25,
                          },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            transition: {
                              duration: 0.45,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          },
                        }}
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative rounded-2xl overflow-hidden bg-slate-100 group shadow-sm text-left cursor-zoom-in"
                      >
                        <img
                          src={img}
                          alt={`${car.name} ${activeGalleryTab} ${idx + 2}`}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Enlarged image lightbox */}
                  <AnimatePresence>
                    {previewImage && (
                      <motion.div
                        key="gallery-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setPreviewImage(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setPreviewImage(null);
                        }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Enlarged gallery image"
                        tabIndex={-1}
                      >
                        <motion.button
                          type="button"
                          aria-label="Close enlarged image"
                          onClick={() => setPreviewImage(null)}
                          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur-md hover:bg-white/25"
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                        >
                          &times;
                        </motion.button>

                        <motion.img
                          src={previewImage}
                          alt={`${car.name} enlarged ${activeGalleryTab} view`}
                          onClick={(e) => e.stopPropagation()}
                          initial={{ scale: 0.92 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.96 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="max-h-full max-w-full rounded-xl object-contain"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              );
            })()}
          </section>
        )}

        {/* GALLERY - mobile */}
        <section className="md:hidden mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
              <span className="text-[9px] font-bold tracking-widest text-blue-800 uppercase block mb-0.5">
                Visual Showcase
              </span>

              <h2 className="text-xl font-black text-slate-900 leading-tight">
                Gallery
              </h2>
            </div>

            <div className="flex shrink-0 bg-slate-100 rounded-full p-1">
              {["Exterior", "Interior"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveGalleryTab(tab);

                    const nextImages = car.gallery?.[tab.toLowerCase()] || [];

                    if (nextImages.length > 0) {
                      setActiveImage(nextImages[0]);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${activeGalleryTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const currentImages =
              car.gallery?.[activeGalleryTab.toLowerCase()] || [];

            if (currentImages.length === 0) {
              return (
                <div className="h-[220px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <span className="text-xs text-slate-400">
                    No images available
                  </span>
                </div>
              );
            }

            const displayImage = currentImages[0];

            return (
              <div className="grid grid-cols-2 gap-2.5">
                {/* Main featured bento image */}
                <button
                  type="button"
                  onClick={() => setPreviewImage(displayImage)}
                  className="col-span-2 relative h-[210px] rounded-2xl overflow-hidden bg-slate-900 group shadow-sm text-left cursor-zoom-in"
                >
                  <img
                    src={displayImage}
                    alt={`${car.name} ${activeGalleryTab} view`}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-900 shadow-sm">
                      {activeGalleryTab} View
                    </span>
                  </div>
                </button>

                {/* Secondary bento images - click to enlarge */}
                {currentImages.slice(1, 5).map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setPreviewImage(img)}
                    className="relative h-[110px] rounded-xl overflow-hidden bg-slate-100 group shadow-sm text-left cursor-zoom-in"
                  >
                    <img
                      src={img}
                      alt={`${car.name} ${activeGalleryTab} ${idx + 2}`}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            );
          })()}
        </section>

        {/* EMI CALCULATOR */}
        <EMICalculator
          car={car}
          selectedVariant={selectedVariant}
          currentPrice={currentPrice}
        />
        {/* <section className="mb-8 bg-gray-900 rounded-2xl p-8 text-white shadow-lg space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-blue-400 uppercase flex items-center gap-1.5 mb-2">
                <Calculator className="w-4 h-4" /> Quick Financing Tool
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Estimated Monthly EMI
              </h2>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 text-center">
              <span className="text-[11px] uppercase tracking-wider text-gray-300 font-bold block">
                Estimated EMI
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                ₹ {emi.toLocaleString("en-IN")}
                <span className="text-xs text-gray-400 font-normal">
                  {" "}
                  / month
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-semibold">
                  Down Payment:
                </span>
                <span className="font-bold text-white">
                  ₹ {downPayment.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={currentPrice * 0.7}
                step={10000}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-semibold">Tenure:</span>
                <span className="font-bold text-white">
                  {loanTenureYears} Years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                step={1}
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-semibold">
                  Interest Rate:
                </span>
                <span className="font-bold text-white">
                  {interestRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={7.5}
                max={14.0}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </section> */}

        {/* FOOTER: FAQ & EXPLORE MORE */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2"
          >
            <div>
              <span className="text-xs font-bold tracking-widest text-blue-600 uppercase flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Everything About Maruti Suzuki {car.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Click any question to view verified specifications & details
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {carFaqs.map((faq, index) => (
              <FaqCard
                key={index}
                index={index}
                faq={faq}
                isOpen={openFaqIndices.includes(index)}
                onToggle={() => toggleFaq(index)}
              />
            ))}
          </div>
          {/* Explore more - desktop */}
          <section className="hidden md:block">
            {otherCars.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Explore More Cars</h2>
                  <Link
                    to="/cars"
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    View All Cars →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {otherCars.slice(0, 3).map((c) => (
                    <CarCard key={c.id} car={c} />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Explore more - mobile */}
          <div className="md:hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">Explore More Cars</h2>

              <Link to="/cars" className="text-xs text-blue-600 font-medium">
                View All →
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
              {otherCars.map((c) => (
                <div key={c.id} className="shrink-0 w-[270px] snap-start">
                  <CarCard car={c} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

// --- SUB COMPONENTS ---

const StatItem = ({ title, value, desc, direction = "left", delay = 0 }) => {
  const xOffset = direction === "left" ? -100 : direction === "right" ? 100 : 0;
  return (
    <motion.div
      className="flex gap-3 items-start"
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500">
        <CheckCircle className="w-4 h-4 opacity-50" />
      </div>
      <div>
        <p className="text-[10px] text-gray-500">{title}</p>
        <p className="font-bold text-sm md:ext-base text-gray-900">{value}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );
};

const FaqCard = ({ faq, index, isOpen, onToggle }) => {
  const Icon = faq.icon || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onToggle}
      className={`group rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden ${isOpen
          ? "border-blue-500/50 shadow-md ring-1 ring-blue-500/20 bg-gradient-to-b from-white to-blue-50/20"
          : "border-slate-200/90 hover:border-slate-300 hover:shadow-md"
        }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${isOpen
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
              }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            {faq.category && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                {faq.category}
              </span>
            )}
            <h3
              className={`text-sm sm:text-base font-bold transition-colors leading-snug ${isOpen
                  ? "text-blue-700"
                  : "text-slate-900 group-hover:text-blue-600"
                }`}
            >
              {faq.question}
            </h3>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen
              ? "bg-blue-100 text-blue-700"
              : "border border-slate-200 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-700"
            }`}
        >
          <span className="text-base font-semibold leading-none">+</span>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 14 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-12 pt-2 border-t border-slate-100">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CarDetailPage;
