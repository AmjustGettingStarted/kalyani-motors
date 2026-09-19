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

// import React, { useState } from 'react';
// import { useKalyani } from '../../../context/KalyaniContext';
// import { submitServiceBooking } from '../../../services/kalyaniApi';
// import {
//   Clock,
//   ShieldCheck,
//   CheckCircle,
//   Calendar,
//   CheckCircle2,
// } from 'lucide-react';

// export default function ServicePage() {
//   const { services, selectedCity, locations, cars } = useKalyani();

//   const [bookingForm, setBookingForm] = useState({
//     carModel: 'Swift',
//     regNumber: '',
//     serviceType: '10,000 km / 1 Year Periodic Service',
//     workshopId: locations[0]?.id || '',
//     pickupRequired: false,
//     date: '',
//     timeSlot: 'Morning (09:00 AM - 12:00 PM)',
//     fullName: '',
//     phone: '',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [successInfo, setSuccessInfo] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const res = await submitServiceBooking({ ...bookingForm, city: selectedCity });
//       setSuccessInfo(res);
//     } catch (err) {
//       alert('Could not submit booking. Please try again or call our hotline.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-16">
//       {/* 1. Header Banner */}
//       <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
//         <div className="relative z-10 max-w-2xl space-y-3">
//           <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-full inline-block">
//             Authorized Maruti Suzuki Service
//           </span>
//           <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
//             Certified Periodic Maintenance & Repairs
//           </h1>
//           <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
//             Experience dealer-grade care with genuine Maruti Suzuki Ecstar oils, computerized diagnostics, 60-minute express bays, and doorstep mobile service across {selectedCity}.
//           </p>
//         </div>
//       </div>

//       {/* 2. Interactive Service Appointment Booking Wizard */}
//       <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl" id="book-service">
//         <div className="max-w-3xl mx-auto">
//           <div className="text-center mb-8">
//             <span className="text-xs font-bold tracking-widest text-red-600 uppercase flex items-center justify-center gap-1.5">
//               <Calendar className="w-4 h-4" /> Seamless Online Booking
//             </span>
//             <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
//               Book Your Service Appointment
//             </h2>
//             <p className="text-slate-500 text-xs sm:text-sm mt-1">
//               Instant appointment confirmation at your nearest Kalyani Motors workshop in {selectedCity}.
//             </p>
//           </div>

//           {successInfo ? (
//             <div className="text-center py-8 bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
//               <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckCircle2 className="w-9 h-9" />
//               </div>
//               <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
//                 Service Appointment Confirmed!
//               </h3>
//               <p className="text-sm text-slate-700 max-w-md mx-auto mb-4">
//                 Thank you, <span className="font-bold">{bookingForm.fullName}</span>! Your service booking for{' '}
//                 <span className="font-bold text-blue-800">{bookingForm.carModel}</span> (Reg:{' '}
//                 {bookingForm.regNumber.toUpperCase()}) is confirmed.
//               </p>
//               <div className="inline-block bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs text-slate-800 font-mono mb-6 shadow-sm">
//                 Appointment ID: <span className="font-bold text-blue-700">{successInfo.appointmentId}</span>
//               </div>
//               <div>
//                 <button
//                   type="button"
//                   onClick={() => setSuccessInfo(null)}
//                   className="px-6 py-2.5 bg-blue-800 text-white text-xs font-bold rounded-xl hover:bg-blue-900"
//                 >
//                   Book Another Vehicle
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Car Model *</label>
//                   <select
//                     value={bookingForm.carModel}
//                     onChange={(e) => setBookingForm({ ...bookingForm, carModel: e.target.value })}
//                     className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                   >
//                     {cars.map((c) => (
//                       <option key={c.slug} value={c.name}>
//                         {c.name} ({c.channel})
//                       </option>
//                     ))}
//                     <option value="Other Maruti Suzuki Model">Other Maruti Suzuki Model</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Car Registration Number *</label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g. KA 05 MN 1234"
//                     value={bookingForm.regNumber}
//                     onChange={(e) => setBookingForm({ ...bookingForm, regNumber: e.target.value })}
//                     className="w-full text-xs uppercase bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Service Type *</label>
//                   <select
//                     value={bookingForm.serviceType}
//                     onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
//                     className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                   >
//                     <option>1,000 km / 1st Free Service</option>
//                     <option>5,000 km / 2nd Free Service</option>
//                     <option>10,000 km / 1 Year Periodic Service</option>
//                     <option>20,000 km / 2 Year Major Maintenance</option>
//                     <option>60-Minute Express Service</option>
//                     <option>General Checkup & Diagnostics</option>
//                     <option>Accidental Body Repair & Paint</option>
//                     <option>Deep Interior Spa & Anti-Rust</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     Preferred Workshop ({selectedCity}) *
//                   </label>
//                   <select
//                     value={bookingForm.workshopId}
//                     onChange={(e) => setBookingForm({ ...bookingForm, workshopId: e.target.value })}
//                     className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                   >
//                     {locations.map((loc) => (
//                       <option key={loc.id} value={loc.id}>
//                         {loc.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date *</label>
//                   <input
//                     type="date"
//                     required
//                     min={new Date().toISOString().split('T')[0]}
//                     value={bookingForm.date}
//                     onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
//                     className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Time Window *</label>
//                   <select
//                     value={bookingForm.timeSlot}
//                     onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
//                     className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                   >
//                     <option>Morning (08:30 AM - 11:30 AM)</option>
//                     <option>Afternoon (11:30 AM - 02:30 PM)</option>
//                     <option>Evening (02:30 PM - 05:30 PM)</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name *</label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="Full name"
//                     value={bookingForm.fullName}
//                     onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
//                     className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
//                   <input
//                     type="tel"
//                     required
//                     pattern="[0-9]{10}"
//                     placeholder="10-digit mobile"
//                     value={bookingForm.phone}
//                     onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
//                     className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Pickup checkbox */}
//               <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   id="pickup"
//                   checked={bookingForm.pickupRequired}
//                   onChange={(e) => setBookingForm({ ...bookingForm, pickupRequired: e.target.checked })}
//                   className="w-4 h-4 rounded text-blue-800 focus:ring-blue-500 accent-blue-800"
//                 />
//                 <label htmlFor="pickup" className="text-xs font-semibold text-slate-700 cursor-pointer">
//                   Require Doorstep Vehicle Pickup & Drop (Available across {selectedCity})
//                 </label>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
//                 >
//                   {isSubmitting ? 'Booking Your Slot...' : 'Confirm Service Booking'}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </section>

//       {/* 3. Periodic Maintenance Milestones */}
//       <section className="space-y-6">
//         <div>
//           <span className="text-xs font-bold tracking-widest text-blue-800 uppercase">Manufacturer Schedule</span>
//           <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
//             Periodic Maintenance Milestones
//           </h2>
//           <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
//             Keep your Maruti Suzuki running like new while preserving complete warranty coverage.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {services.periodicMaintenance.map((pm) => (
//             <div
//               key={pm.id}
//               className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
//             >
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
//                     {pm.tag}
//                   </span>
//                   <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
//                     <Clock className="w-3 h-3" /> {pm.duration}
//                   </span>
//                 </div>

//                 <h3 className="font-display font-black text-lg text-slate-900">{pm.interval}</h3>
//                 <p className="text-xs font-bold text-red-600 mt-0.5">{pm.mileage}</p>
//                 <p className="text-xs font-semibold text-slate-700 mt-1">{pm.price}</p>
//                 <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pm.description}</p>

//                 <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
//                     Key Checklist:
//                   </span>
//                   {pm.checks.map((c, i) => (
//                     <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
//                       <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
//                       <span>{c}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mt-6 pt-4 border-t border-slate-100">
//                 <a
//                   href="#book-service"
//                   className="w-full py-2 bg-slate-100 hover:bg-blue-800 hover:text-white rounded-xl text-xs font-bold text-slate-800 text-center block transition-colors"
//                 >
//                   Book This Interval
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 4. Specialized Care Packages */}
//       <section className="space-y-6">
//         <div>
//           <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Specialized Solutions</span>
//           <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
//             Kalyani Premium Workshop Capabilities
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {services.specializedPackages.map((pkg) => (
//             <div
//               key={pkg.id}
//               className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
//             >
//               <div>
//                 <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-3">
//                   {pkg.badge}
//                 </span>
//                 <h3 className="font-display font-black text-base text-slate-900 leading-snug">{pkg.title}</h3>
//                 <p className="text-xs font-semibold text-blue-800 mt-0.5">{pkg.subtitle}</p>
//                 <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{pkg.description}</p>

//                 <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
//                   {pkg.highlights.map((h, i) => (
//                     <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
//                       <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
//                       <span>{h}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mt-6 pt-4 border-t border-slate-100">
//                 <span className="text-xs font-bold text-slate-800 block">{pkg.price}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 5. Cashless Insurance Claim Partners */}
//       <section className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200">
//         <div className="text-center max-w-xl mx-auto mb-6">
//           <span className="text-xs font-bold tracking-widest text-blue-800 uppercase">Hassle-Free Repairs</span>
//           <h3 className="font-display font-black text-xl text-slate-900 mt-1">
//             Cashless Insurance Claim Settlement
//           </h3>
//           <p className="text-xs text-slate-600 mt-1">
//             Direct survey, paperless settlement, and authorized body shop repairs with top national insurers.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center justify-center gap-3">
//           {services.insurancePartners.map((partner) => (
//             <div
//               key={partner}
//               className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2"
//             >
//               <ShieldCheck className="w-4 h-4 text-emerald-600" />
//               <span>{partner}</span>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
