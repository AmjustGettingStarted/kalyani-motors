import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useKalyani } from "../../../../context/KalyaniContext";
import { formatINR } from "../../../../lib/utils";
import CarCard from "../../../../components/widgets/CarCard";
// import Car360Viewer from "../../../../components/widgets/Car360Viewer";
// import get360Frames from "../../../../app/images/fronx/360/frames";
import {
  Star,
  Gauge,
  Fuel,
  Zap,
  ShieldCheck,
  Calendar,
  CheckCircle,
  Calculator,
  ChevronRight,
  Sparkles,
  Award,
} from "lucide-react";

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

  const { cars, openTestDrive, selectedCity } = useKalyani();

  const car = useMemo(() => {
    return cars.find((c) => c.slug.toLowerCase() === slug?.toLowerCase());
  }, [cars, slug]);

  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeSpecTab, setActiveSpecTab] = useState("Performance");
  const [activeGalleryTab, setActiveGalleryTab] = useState("Exterior");

  // EMI Calculator State
  const [downPayment, setDownPayment] = useState(100000);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);

  // CLEANED UP: Directly accessing the clean data structure
  useEffect(() => {
    if (car) {
      const initialImg = car.gallery?.exterior?.[0] || car.heroImage || "";
      setActiveImage(initialImg);
      setSelectedColor(car.colors?.[0] || null);
      setSelectedVariant(car.variants?.[0] || null);
      setDownPayment(Math.round(car.startingPrice * 0.2));
    }
  }, [car]);

  if (!car) {
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

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : car.startingPrice;
  const loanPrincipal = Math.max(0, currentPrice - downPayment);
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = loanTenureYears * 12;
  const emi =
    loanPrincipal > 0
      ? Math.round(
          (loanPrincipal *
            monthlyRate *
            Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1),
        )
      : 0;

  const otherCars = cars.filter((c) => c.id !== car.id).slice(0, 5);

  // const rotationFrames = useMemo(() => {
  //   return get360Frames(car.slug, selectedColor?.key);
  // }, [car.slug, selectedColor?.key]);

  return (
    <>
      <div className="w-full mx-auto px-4 sm:px-8 py-8" />
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
                  <p className="text-xs text-black/70 uppercase tracking-wider font-semibold">
                    Ex-showroom price ({selectedCity})
                  </p>
                  <h2 className="text-3xl font-bold text-black drop-shadow-md">
                    {currentPrice ? formatINR(currentPrice) : car.priceRange}
                  </h2>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-black/70 font-semibold block uppercase tracking-wider">
                    Select Variant
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVariant?.name || ""}
                      onChange={(e) => {
                        const variant = car.variants?.find(
                          (v) => v.name === e.target.value,
                        );
                        setSelectedVariant(variant);
                      }}
                      className="w-full p-3 bg-white/40 border border-grey/20 rounded-xl text-black font-medium appearance-none outline-none focus:border-white/60 transition-colors backdrop-blur-sm cursor-pointer"
                    >
                      {car.variants?.map((v) => (
                        <option
                          key={v.name}
                          value={v.name}
                          className="bg-white text-black"
                        >
                          {v.name} ({v.fuel})
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {car.colors && (
                  <div className="">
                    <div className="flex gap-2.5 flex-wrap">
                      {car.colors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            selectedColor?.name === c.name
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
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Price
                </p>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {currentPrice ? formatINR(currentPrice) : car.priceRange}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Variant
                </p>

                <select
                  value={selectedVariant?.name || ""}
                  onChange={(e) => {
                    const variant = car.variants?.find(
                      (v) => v.name === e.target.value,
                    );
                    setSelectedVariant(variant);
                  }}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 outline-none"
                >
                  {car.variants?.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.fuel})
                    </option>
                  ))}
                </select>
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
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColor?.name === c.name
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
                      className={`relative z-10 ${
                        isActive ? "text-white" : "text-gray-600"
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
                  className={`flex-1 py-2 rounded-full text-[11px] font-bold transition-all ${
                    isActive
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
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                      activeGalleryTab === tab
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
                  {/* Main Featured Display */}
                  <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden bg-slate-900 group shadow-md min-h-[300px] md:min-h-[460px]">
                    <img
                      src={displayImage}
                      alt={`${car.name} ${activeGalleryTab} view`}
                      className="w-full h-full object-cover object-center transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-sm text-slate-900 shadow-sm">
                        {activeGalleryTab} View
                      </span>
                      <span className="text-xs text-white/90 font-medium hidden sm:inline">
                        Click thumbnails to view
                      </span>
                    </div>
                  </div>

                  {/* Thumbnails - Sliced to 4 to prevent grid breaking */}
                  {currentImages.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative rounded-2xl overflow-hidden bg-slate-100 group shadow-xs transition-all text-left ${
                        displayImage === img
                          ? "ring-2 ring-slate-900"
                          : "hover:opacity-90"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${car.name} ${activeGalleryTab} #${idx + 1}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                          {activeGalleryTab} #{idx + 1}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
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
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                    activeGalleryTab === tab
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

            const displayImage =
              activeImage && currentImages.includes(activeImage)
                ? activeImage
                : currentImages[0];

            return (
              <>
                {/* Main Image */}
                <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={displayImage}
                    alt={`${car.name} ${activeGalleryTab} view`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {currentImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative shrink-0 w-[64px] h-[52px] rounded-lg overflow-hidden bg-slate-100 transition-all ${
                        displayImage === img
                          ? "ring-2 ring-slate-900 ring-offset-1"
                          : "opacity-75"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${car.name} ${activeGalleryTab} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            );
          })()}
        </section>

        {/* EMI CALCULATOR */}
        <section className="mb-8 bg-gray-900 rounded-2xl p-8 text-white shadow-lg space-y-8">
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
        </section>

        {/* FOOTER: FAQ & EXPLORE MORE */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <FaqCard
              question={`What is the exact mileage of Maruti Suzuki ${car.name}?`}
            />
            <FaqCard
              question={`What are the available variants of ${car.name}?`}
            />
            <FaqCard
              question={`Does the ${car.name} come with a sunroof option?`}
            />
            <FaqCard
              question={`What is the boot space capacity of ${car.name}?`}
            />
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

const FaqCard = ({ question }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-6 flex justify-between items-start bg-white shadow-sm hover:shadow-md transition cursor-pointer">
      <p className="text-sm font-medium pr-4 text-gray-700">{question}</p>
      <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 hover:bg-gray-50 hover:text-gray-900 transition-colors">
        +
      </button>
    </div>
  );
};

export default CarDetailPage;
