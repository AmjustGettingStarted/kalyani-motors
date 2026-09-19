import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useKalyani } from "../../../context/KalyaniContext";
import { submitServiceBooking } from "../../../services/kalyaniApi";

export default function ServicePage() {
  const { selectedCity, locations, cars, services } = useKalyani();

  const heroRef = useRef(null);
  const serviceRef = useRef(null);

  const [activeTab, setActiveTab] = useState("services");

  const [bookingForm, setBookingForm] = useState({
    carModel: "Swift",
    regNumber: "",
    serviceType: "10,000 km / 1 Year Periodic Service",
    workshopId: locations[0]?.id || "",
    pickupRequired: false,
    date: "",
    timeSlot: "Morning (09:00 AM - 12:00 PM)",
    fullName: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  /*
   * HERO SCROLL
   */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /*
   * Hero image movement
   *
   * The images begin spread around the heading.
   * As the user scrolls they rotate inward,
   * scale down and finish as a deck.
   */

  const heroImages = services?.heroImages || [];

  const positions = [
    {
      x: "-34vw",
      y: "-17vh",
      rotate: -18,
    },
    {
      x: "-21vw",
      y: "16vh",
      rotate: -12,
    },
    {
      x: "-8vw",
      y: "-27vh",
      rotate: -7,
    },
    {
      x: "0vw",
      y: "27vh",
      rotate: 4,
    },
    {
      x: "9vw",
      y: "-25vh",
      rotate: 8,
    },
    {
      x: "23vw",
      y: "13vh",
      rotate: 13,
    },
    {
      x: "34vw",
      y: "-13vh",
      rotate: 18,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const res = await submitServiceBooking({
        ...bookingForm,
        city: selectedCity,
      });

      setSuccessInfo(res);
    } catch (err) {
      alert("Could not submit booking. Please try again or call our hotline.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#f5f5f3] text-slate-950 overflow-hidden">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section ref={heroRef} className="relative h-[190vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* subtle background */}
          <div className="absolute inset-0 bg-[#f5f5f3]" />

          {/* small top label */}
          <div className="absolute top-8 left-6 md:left-12 z-40">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
              Kalyani Motors
            </span>
          </div>

          {/* center content */}

          <motion.div
            className="absolute z-30 inset-0 flex items-center justify-center text-center pointer-events-none"
            style={{
              y: useTransform(scrollYProgress, [0, 0.7], ["0%", "-12%"]),
            }}
          >
            <div className="max-w-3xl px-6">
              <motion.p
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] text-red-600 mb-5"
                style={{
                  opacity: useTransform(scrollYProgress, [0, 0.25], [1, 0]),
                }}
              >
                Service & Care
              </motion.p>

              <motion.h1
                className="font-display font-black tracking-[-0.06em] text-[clamp(3.5rem,8vw,8rem)] leading-[0.82]"
                style={{
                  scale: useTransform(scrollYProgress, [0, 0.7], [1, 0.78]),
                }}
              >
                Care for
                <br />
                every journey.
              </motion.h1>

              <motion.p
                className="max-w-lg mx-auto mt-8 text-sm md:text-base text-slate-500 leading-relaxed"
                style={{
                  opacity: useTransform(scrollYProgress, [0, 0.35], [1, 0]),
                }}
              >
                From routine maintenance to complete protection, everything your
                car needs is handled by trained professionals.
              </motion.p>
            </div>
          </motion.div>

          {/* 7 orbiting images */}

          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            {heroImages.map((item, index) => (
              <OrbitImage
                key={item.id}
                item={item}
                index={index}
                scrollYProgress={scrollYProgress}
                position={positions[index]}
              />
            ))}
          </div>

          {/* deck visual at bottom */}

          <motion.div
            className="absolute bottom-[7vh] left-1/2 -translate-x-1/2 z-10 flex items-end justify-center"
            style={{
              opacity: useTransform(
                scrollYProgress,
                [0.5, 0.75, 1],
                [0, 0.2, 1],
              ),
              y: useTransform(scrollYProgress, [0.65, 1], ["80px", "0px"]),
            }}
          >
            {heroImages.slice(0, 5).map((item, index) => (
              <img
                key={`deck-${item.id}`}
                src={item.image}
                alt=""
                className="w-[90px] h-[65px] md:w-[150px] md:h-[95px] object-cover rounded-xl border-2 border-[#f5f5f3] shadow-xl -ml-5"
                style={{
                  transform: `rotate(${(index - 2) * 5}deg)`,
                  zIndex: index,
                }}
              />
            ))}
          </motion.div>

          {/* scroll indicator */}

          <motion.div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.12], [1, 0]),
            }}
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400">
              Scroll to explore
            </span>

            <ArrowDown className="w-4 h-4 text-red-600 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          SERVICES SECTION
      ========================================================== */}

      <section ref={serviceRef} className="relative bg-[#101827] text-white">
        {/* top heading + toggle */}

        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold">
                Complete vehicle care
              </span>

              <h2 className="font-display font-black text-5xl md:text-7xl tracking-[-0.05em] leading-[0.9] mt-4">
                Service.
                <br />
                Care.
                <br />
                <span className="text-slate-500">Your choice.</span>
              </h2>
            </div>

            {/* TOGGLE */}

            <ServiceToggle activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>

        {/* =====================================================
            SERVICE CARDS
        ====================================================== */}

        <div className="max-w-7xl mx-auto px-5 md:px-10 pb-32">
          <div className="space-y-6">
            {(activeTab === "services"
              ? services?.services
              : services?.care
            )?.map((item, index) => (
              <ServiceCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* =====================================================
            BOOKING
        ====================================================== */}

        <section
          id="book-service"
          className="max-w-5xl mx-auto px-5 md:px-10 pb-32"
        >
          <div className="bg-white text-slate-900 rounded-[2rem] p-6 md:p-10">
            <div className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-bold">
                Book your visit
              </span>

              <h3 className="font-display font-black text-3xl md:text-5xl tracking-tight mt-3">
                Let&apos;s take care of it.
              </h3>
            </div>

            {successInfo ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                  <Check className="w-7 h-7" />
                </div>

                <h3 className="font-bold text-xl">
                  Service appointment confirmed
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Appointment ID: <strong>{successInfo.appointmentId}</strong>
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Field label="Car Model">
                  <select
                    value={bookingForm.carModel}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        carModel: e.target.value,
                      })
                    }
                    className="input"
                  >
                    {cars.map((car) => (
                      <option key={car.slug} value={car.name}>
                        {car.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Registration Number">
                  <input
                    required
                    value={bookingForm.regNumber}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        regNumber: e.target.value,
                      })
                    }
                    placeholder="KA 05 MN 1234"
                    className="input uppercase"
                  />
                </Field>

                <Field label="Service Type">
                  <select
                    value={bookingForm.serviceType}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        serviceType: e.target.value,
                      })
                    }
                    className="input"
                  >
                    <option>1,000 km / 1st Free Service</option>
                    <option>5,000 km / 2nd Free Service</option>
                    <option>10,000 km / 1 Year Periodic Service</option>
                    <option>20,000 km / 2 Year Major Maintenance</option>
                    <option>60-Minute Express Service</option>
                    <option>General Checkup & Diagnostics</option>
                    <option>Accidental Body Repair & Paint</option>
                  </select>
                </Field>

                <Field label="Workshop">
                  <select
                    value={bookingForm.workshopId}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        workshopId: e.target.value,
                      })
                    }
                    className="input"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Date">
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        date: e.target.value,
                      })
                    }
                    className="input"
                  />
                </Field>

                <Field label="Time">
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        timeSlot: e.target.value,
                      })
                    }
                    className="input"
                  >
                    <option>Morning (08:30 AM - 11:30 AM)</option>
                    <option>Afternoon (11:30 AM - 02:30 PM)</option>
                    <option>Evening (02:30 PM - 05:30 PM)</option>
                  </select>
                </Field>

                <Field label="Your Name">
                  <input
                    required
                    value={bookingForm.fullName}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        fullName: e.target.value,
                      })
                    }
                    className="input"
                  />
                </Field>

                <Field label="Mobile">
                  <input
                    required
                    pattern="[0-9]{10}"
                    value={bookingForm.phone}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        phone: e.target.value,
                      })
                    }
                    className="input"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="md:col-span-2 mt-3 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition-colors"
                >
                  {isSubmitting ? "Booking..." : "Confirm Service Booking"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* =====================================================
            BOTTOM TOGGLE
        ====================================================== */}

        <div className="sticky bottom-5 z-50 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto">
            <ServiceToggle activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </section>
    </main>
  );
}

/* =============================================================
   TOGGLE
============================================================= */

function ServiceToggle({ activeTab, setActiveTab }) {
  return (
    <div className="inline-flex items-center p-1.5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full">
      <button
        onClick={() => setActiveTab("services")}
        className={`px-6 md:px-8 py-3 rounded-full text-xs md:text-sm font-bold transition-all ${
          activeTab === "services"
            ? "bg-white text-slate-950 shadow-lg"
            : "text-white/60 hover:text-white"
        }`}
      >
        Services
      </button>

      <button
        onClick={() => setActiveTab("care")}
        className={`px-6 md:px-8 py-3 rounded-full text-xs md:text-sm font-bold transition-all ${
          activeTab === "care"
            ? "bg-red-600 text-white shadow-lg"
            : "text-white/60 hover:text-white"
        }`}
      >
        Care
      </button>
    </div>
  );
}

/* =============================================================
   SERVICE CARD
============================================================= */

function ServiceCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
      }}
      className="group grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] min-h-[500px] rounded-[2rem] overflow-hidden bg-[#172235] border border-white/10"
    >
      {/* IMAGE */}

      <div className="relative min-h-[300px] lg:min-h-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-6 bottom-6">
          <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] uppercase tracking-widest font-bold">
            {item.category}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-between">
        <div>
          <span className="text-xs text-red-500 font-bold">0{index + 1}</span>

          <h3 className="font-display font-black text-4xl md:text-5xl tracking-tight mt-5">
            {item.title}
          </h3>

          <p className="text-slate-400 max-w-xl mt-5 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {item.points.map((point) => (
              <div key={point} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-red-600/15 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>

                <span className="text-sm text-slate-300">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-xs text-slate-500 uppercase tracking-widest">
            Kalyani Motors
          </span>

          <button className="flex items-center gap-2 text-sm font-bold hover:text-red-500 transition-colors">
            Explore
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* =============================================================
   FORM FIELD
============================================================= */

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
        {label}
      </span>

      {React.cloneElement(children, {
        className: `${children.props.className} w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors`,
      })}
    </label>
  );
}

function OrbitImage({ item, index, scrollYProgress, position }) {
  const x = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [
      position.x,
      `${parseFloat(position.x) * 0.25}vw`,
      `${(index - 3) * 1.1}vw`,
    ],
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [position.y, `${parseFloat(position.y) * 0.2}vh`, `${(index % 2) * 0.5}vh`],
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
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
        src={item.image}
        alt={item.alt || item.title}
        className="w-full h-full object-cover"
        draggable="false"
      />

      <div className="absolute inset-0 bg-black/10" />
    </motion.div>
  );
}

// import React, { useState } from "react";
// import { useKalyani } from "../../../context/KalyaniContext";
// import {
//   MapPin,
//   Phone,
//   Clock,
//   Navigation,
//   CheckCircle,
//   Building,
//   Wrench,
//   Search,
// } from "lucide-react";

// export default function OutletsPage() {
//   const { cities, selectedCity, setSelectedCity, allLocations, openTestDrive } =
//     useKalyani();
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [branchSearch, setBranchSearch] = useState("");

//   const currentCityLocations = allLocations[selectedCity.toLowerCase()] || [];

//   const categories = [
//     { id: "all", label: "All Touchpoints" },
//     { id: "arena", label: "Arena Showrooms" },
//     { id: "nexa", label: "Nexa Showrooms" },
//     { id: "service", label: "Service Workshops" },
//     { id: "true-value", label: "True Value (Used)" },
//   ];

//   const filteredLocations = currentCityLocations.filter((loc) => {
//     if (activeCategory !== "all" && loc.category !== activeCategory)
//       return false;
//     if (branchSearch.trim()) {
//       const q = branchSearch.toLowerCase().trim();
//       return (
//         loc.name.toLowerCase().includes(q) ||
//         loc.address.toLowerCase().includes(q) ||
//         loc.landmark.toLowerCase().includes(q)
//       );
//     }
//     return true;
//   });

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
//       {/* Header Banner */}
//       <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
//         <div className="max-w-2xl space-y-2">
//           <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-full inline-block">
//             Authorized Network
//           </span>
//           <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
//             Kalyani Motors Dealerships & Service Hubs
//           </h1>
//           <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
//             Locate your nearest authorized Maruti Suzuki Arena, Nexa showroom,
//             certified service workshop, or True Value outlet in {selectedCity}.
//           </p>
//         </div>
//       </div>

//       {/* City Switcher Tabs */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
//         <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
//           {cities.map((city) => {
//             const isSelected = selectedCity === city;
//             const count = (allLocations[city.toLowerCase()] || []).length;
//             return (
//               <button
//                 key={city}
//                 type="button"
//                 onClick={() => setSelectedCity(city)}
//                 className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
//                   isSelected
//                     ? "bg-blue-800 text-white shadow-md shadow-blue-800/20"
//                     : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
//                 }`}
//               >
//                 <MapPin
//                   className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-slate-400"}`}
//                 />
//                 <span>{city}</span>
//                 <span
//                   className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? "bg-blue-900 text-blue-200" : "bg-slate-200 text-slate-600"}`}
//                 >
//                   {count}
//                 </span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Search input */}
//         <div className="relative w-full sm:w-64">
//           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
//           <input
//             type="text"
//             placeholder="Search locality, area..."
//             value={branchSearch}
//             onChange={(e) => setBranchSearch(e.target.value)}
//             className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
//           />
//         </div>
//       </div>

//       {/* Category Filter Pills */}
//       <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             type="button"
//             onClick={() => setActiveCategory(cat.id)}
//             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
//               activeCategory === cat.id
//                 ? "bg-slate-900 text-white shadow-sm"
//                 : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
//             }`}
//           >
//             {cat.label}
//           </button>
//         ))}
//       </div>

//       {/* Locations Grid */}
//       {filteredLocations.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredLocations.map((loc) => (
//             <div
//               key={loc.id}
//               className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
//             >
//               <div className="space-y-4">
//                 {/* Type Badge & Flagship */}
//                 <div className="flex items-center justify-between">
//                   <span
//                     className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
//                       loc.category === "nexa"
//                         ? "bg-slate-900 text-white"
//                         : loc.category === "service"
//                           ? "bg-red-50 text-red-700 border border-red-200"
//                           : "bg-blue-50 text-blue-800 border border-blue-200"
//                     }`}
//                   >
//                     {loc.type}
//                   </span>

//                   {loc.isFlagship && (
//                     <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
//                       FLAGSHIP HUB
//                     </span>
//                   )}
//                 </div>

//                 {/* Branch Title & Address */}
//                 <div>
//                   <h3 className="font-display font-extrabold text-lg text-slate-900 group-hover:text-blue-800 transition-colors">
//                     {loc.name}
//                   </h3>
//                   <p className="text-xs text-slate-600 mt-2 leading-relaxed flex items-start gap-2">
//                     <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
//                     <span>{loc.address}</span>
//                   </p>
//                   <p className="text-[11px] text-blue-700 font-semibold ml-6 mt-1">
//                     Landmark: {loc.landmark}
//                   </p>
//                 </div>

//                 {/* Hours */}
//                 <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
//                   <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
//                   <span>{loc.hours}</span>
//                 </div>

//                 {/* Facilities Pills */}
//                 <div>
//                   <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
//                     Facilities Available:
//                   </span>
//                   <div className="flex flex-wrap gap-1.5">
//                     {loc.facilities?.map((f) => (
//                       <span
//                         key={f}
//                         className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1"
//                       >
//                         <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
//                         {f}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-slate-400 font-semibold">
//                     Sales Desk:
//                   </span>
//                   <a
//                     href={`tel:${loc.phone.replace(/\s+/g, "")}`}
//                     className="font-bold text-red-600 hover:underline flex items-center gap-1"
//                   >
//                     <Phone className="w-3.5 h-3.5" />
//                     {loc.phone}
//                   </a>
//                 </div>

//                 {loc.servicePhone && loc.servicePhone !== loc.phone && (
//                   <div className="flex items-center justify-between text-xs">
//                     <span className="text-slate-400 font-semibold">
//                       Service Desk:
//                     </span>
//                     <a
//                       href={`tel:${loc.servicePhone.replace(/\s+/g, "")}`}
//                       className="font-bold text-blue-800 hover:underline flex items-center gap-1"
//                     >
//                       <Wrench className="w-3.5 h-3.5" />
//                       {loc.servicePhone}
//                     </a>
//                   </div>
//                 )}

//                 <div className="pt-2 grid grid-cols-2 gap-2">
//                   <a
//                     href={loc.mapUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
//                   >
//                     <Navigation className="w-3.5 h-3.5 text-blue-800" />
//                     <span>Get Directions</span>
//                   </a>

//                   <button
//                     type="button"
//                     onClick={() => openTestDrive()}
//                     className="py-2.5 px-3 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
//                   >
//                     <span>Book Visit</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
//           <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
//             <Building className="w-8 h-8" />
//           </div>
//           <h3 className="font-display font-bold text-lg text-slate-900">
//             No outlets found
//           </h3>
//           <p className="text-xs text-slate-500">
//             No touchpoints found matching your search term. Clear the search or
//             choose another city tab.
//           </p>
//           <button
//             type="button"
//             onClick={() => {
//               setBranchSearch("");
//               setActiveCategory("all");
//             }}
//             className="px-6 py-2.5 bg-blue-800 text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors"
//           >
//             Reset Filters
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
