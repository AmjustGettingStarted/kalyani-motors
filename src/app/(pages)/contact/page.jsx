import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  CalendarDays,
  Car,
  ChevronRight,
  Clock,
  Headphones,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useKalyani } from "../../../context/KalyaniContext";
import { submitContactEnquiry } from "../../../services/kalyaniApi";

const INQUIRY_CATEGORIES = [
  { id: "new-car", label: "New Car Sales (Arena / Nexa)", icon: Car },
  { id: "service", label: "Service & Maintenance", icon: Wrench },
  { id: "test-drive", label: "Book a Test Drive", icon: Sparkles },
  { id: "insurance", label: "Car Insurance & Renewal", icon: ShieldCheck },
  { id: "true-value", label: "True Value (Pre-Owned)", icon: Building2 },
  { id: "general", label: "General Feedback / Other", icon: MessageSquare },
];

const CUSTOMER_CARE_PHONE = "+919845012345";
const CUSTOMER_CARE_PHONE_DISPLAY = "+91 98450 12345";
const CUSTOMER_CARE_EMAIL = "support@kalyanimotors.com";
const ROADSIDE_ASSISTANCE_PHONE = "18001021800";
const ROADSIDE_ASSISTANCE_DISPLAY = "1800 102 1800";

export default function ContactPage() {
  const { selectedCity, cities } = useKalyani();
  const currentCity = selectedCity || "Bengaluru";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: currentCity,
    category: "New Car Sales (Arena / Nexa)",
    message: "",
    authorized: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Only the Bengaluru headquarters address is currently verified in the page data.
  // For other selected cities, route visitors to the outlet finder instead of inventing an address.
  const isBengaluru = /bengaluru|bangalore/i.test(currentCity);
  const officeTitle = isBengaluru
    ? "Head Office · Bengaluru"
    : `Local support · ${currentCity}`;
  const officeDescription = isBengaluru
    ? "Nayandahalli, Mysore Road, Bengaluru, Karnataka – 560039"
    : `Find the nearest Kalyani Motors outlet in ${currentCity} for local assistance.`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    const cleanedPhone = formData.phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!formData.authorized) {
      setErrorMsg("Please authorize us to contact you regarding your inquiry.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitContactEnquiry({
        ...formData,
        phone: cleanedPhone,
        submittedAt: new Date().toISOString(),
      });
      setSubmissionResult(res);
    } catch (err) {
      setErrorMsg(
        err?.message ||
          "Could not submit your inquiry. Please call our customer care team.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setErrorMsg("");
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      city: currentCity,
      category: "New Car Sales (Arena / Nexa)",
      message: "",
      authorized: true,
    });
  };

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10";
  const labelClassName =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fa] text-slate-900">
      {/* HERO: cinematic automotive image */}
      <section className="relative isolate flex min-h-[520px] items-center bg-[#061322] pt-24 sm:min-h-[600px] lg:min-h-[650px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-[center_58%]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=90')",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061322]/95 via-[#061322]/75 to-[#061322]/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#071321]/70 to-transparent"
        />

        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
              <span className="h-px w-9 bg-red-500" />
              Contact Kalyani Motors
            </div>
            <h1 className="font-display text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              We&apos;re here
              <br />
              for you.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              Whether you&apos;re exploring your next car, need help with
              ownership, or require roadside support, our team is just a call
              away.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#support-options"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/25 transition hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-400/30"
              >
                Explore support <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#enquiry"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                Submit an enquiry
              </a>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
      </section>

      {/* INTRO SPLIT: intentionally no central wheel */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-9 md:grid-cols-2 md:gap-14"
        >
          <div className="relative md:pr-10">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-[2px] w-8 bg-red-500" /> People first
            </div>
            <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-[#071936] sm:text-4xl">
              Driven by people.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              Real support from a team that understands your journey, from
              choosing a car to keeping it running smoothly.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-8 md:border-l md:border-t-0 md:pl-14 md:pt-0">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-[2px] w-8 bg-red-500" /> Always here
            </div>
            <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-[#071936] sm:text-4xl">
              Always by your side.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              From quick questions to unexpected moments on the road, find the
              right help without having to search through multiple pages.
            </p>
          </div>
        </motion.div>
      </section>

      {/* FOUR SUPPORT CARDS */}
      <section
        id="support-options"
        className="scroll-mt-24 border-y border-slate-200/80 bg-white py-14 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="mb-9 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end"
          >
            <div>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-[2px] w-8 bg-red-500" /> Support options
              </div>
              <h2 className="font-display text-3xl font-black tracking-tight text-[#071936] sm:text-4xl">
                How can we help?
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Choose the option that best matches what you need and get
              connected with the right team.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {/* Chat card */}
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0 }}
              className="flex min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-[#f9fafb] p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-700">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="mt-5 flex items-center gap-2">
                <h3 className="font-display text-xl font-extrabold text-[#071936]">
                  Need to chat?
                </h3>
              </div>
              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Service unavailable
              </span>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Live chat is currently offline. You can still reach our team by
                phone or email, and we&apos;ll be happy to help.
              </p>
              <div className="mt-auto pt-6">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-400"
                >
                  <MessageSquare className="h-4 w-4" /> Chat unavailable
                </button>
              </div>
            </motion.article>

            {/* Customer care card */}
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.06 }}
              className="flex min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-extrabold text-[#071936]">
                Customer Care
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Our team is here to help with questions, feedback, and support.
              </p>

              <div className="mt-5 space-y-4">
                <a
                  href={`tel:${CUSTOMER_CARE_PHONE}`}
                  className="group flex items-start gap-3 text-sm text-slate-800 transition hover:text-blue-700"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 group-hover:text-blue-700" />
                  <span className="font-semibold">
                    {CUSTOMER_CARE_PHONE_DISPLAY}
                  </span>
                </a>
                <a
                  href={`mailto:${CUSTOMER_CARE_EMAIL}`}
                  className="group flex items-start gap-3 break-all text-sm text-slate-800 transition hover:text-blue-700"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 group-hover:text-blue-700" />
                  <span>{CUSTOMER_CARE_EMAIL}</span>
                </a>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <span>Monday – Sunday, 9:00 AM – 8:00 PM</span>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {officeTitle}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {officeDescription}
                      </p>
                    </div>
                  </div>
                  {!isBengaluru && (
                    <Link
                      to="/outlets"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800"
                    >
                      Find a nearby outlet{" "}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
              <div className="mt-auto pt-6">
                <a
                  href={`tel:${CUSTOMER_CARE_PHONE}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#071936] px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
                >
                  Contact Customer Care <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.article>

            {/* Roadside assistance card */}
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#102e56] via-[#0b2342] to-[#061322] p-5 text-white shadow-lg shadow-blue-950/10 sm:p-6"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/15 blur-2xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-red-300">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <span className="relative mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-100">
                <ShieldCheck className="h-3.5 w-3.5" /> Roadside support
              </span>
              <h3 className="relative mt-3 font-display text-xl font-extrabold">
                Roadside Assistance
              </h3>
              <p className="relative mt-3 text-sm leading-6 text-blue-100/90">
                Breakdown, flat tyre, or an unexpected stop? Call for assistance
                and get help getting back on the road.
              </p>
              <div className="relative mt-auto pt-7">
                <a
                  href={`tel:${ROADSIDE_ASSISTANCE_PHONE}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-400/30"
                >
                  <Phone className="h-4 w-4" /> Call Now
                  <ArrowRight className="ml-auto h-4 w-4" />
                </a>
                <p className="mt-3 text-center text-xs font-semibold tracking-wide text-blue-100">
                  {ROADSIDE_ASSISTANCE_DISPLAY}
                </p>
              </div>
            </motion.article>

            {/* Outlets card */}
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <div
                role="img"
                aria-label="Kalyani Motors showroom"
                className="h-36 shrink-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, rgba(7,25,54,.25), rgba(7,25,54,.02)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=85')",
                }}
              />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold text-[#071936]">
                  Our Outlets
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Prefer to meet in person? Find a showroom or service centre
                  near you and plan your visit.
                </p>
                <div className="mt-auto pt-6">
                  <Link
                    to="/outlets"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-[#071936] transition hover:border-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    View All Outlets <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM: retained API submission and validation */}
      <section id="enquiry" className="scroll-mt-24 py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.25)] lg:grid-cols-12"
          >
            {/* Visual panel */}
            <div className="relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden bg-[#061322] p-7 sm:p-10 lg:col-span-5 lg:min-h-full lg:p-12">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-20 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85')",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061322] via-[#061322]/75 to-[#061322]/20"
              />
              <div className="mb-auto inline-flex w-fit items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                <span className="h-[2px] w-8 bg-red-500" /> Submit an enquiry
              </div>
              <div className="mt-14 max-w-md">
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Have a question
                  <br />
                  or need more information?
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-slate-200 sm:text-base">
                  Share a few details and our team will get in touch to help you
                  take the next step.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-white/90">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur">
                    <Phone className="h-3.5 w-3.5" /> Personal assistance
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur">
                    <CalendarDays className="h-3.5 w-3.5" /> Sales & service
                  </span>
                </div>
              </div>
            </div>

            {/* Form panel */}
            <div className="p-6 sm:p-9 lg:col-span-7 lg:p-12 xl:p-14">
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <span className="h-[2px] w-8 bg-red-500" /> We&apos;re
                  listening
                </div>
                <h3 className="font-display text-2xl font-black tracking-tight text-[#071936] sm:text-3xl">
                  Send us a message
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill in the form and tell us how we can help.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {submissionResult ? (
                  <motion.div
                    key="success-box"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/15">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>
                    <div>
                      <h4 className="font-display text-2xl font-bold text-emerald-950">
                        Message received!
                      </h4>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-emerald-800">
                        {submissionResult.message ||
                          "Thank you for reaching out! Our customer team has received your inquiry and will call you shortly."}
                      </p>
                    </div>
                    {submissionResult.ticketId && (
                      <div className="inline-block rounded-xl border border-emerald-200 bg-white px-4 py-2 font-mono text-xs font-bold text-emerald-900">
                        Reference Ticket: {submissionResult.ticketId}
                      </div>
                    )}
                    <div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071936] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
                      >
                        Send another enquiry <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {errorMsg && (
                      <div
                        role="alert"
                        className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium text-rose-700"
                      >
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-fullName"
                          className={labelClassName}
                        >
                          Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contact-fullName"
                          type="text"
                          name="fullName"
                          autoComplete="name"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Kumar"
                          className={inputClassName}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className={labelClassName}
                        >
                          Phone number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                            +91
                          </span>
                          <input
                            id="contact-phone"
                            type="tel"
                            name="phone"
                            autoComplete="tel-national"
                            inputMode="numeric"
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) => {
                              const digitsOnly = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              setFormData((prev) => ({
                                ...prev,
                                phone: digitsOnly,
                              }));
                            }}
                            placeholder="98765 43210"
                            className={`${inputClassName} pl-12`}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-email"
                          className={labelClassName}
                        >
                          Email address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-city"
                          className={labelClassName}
                        >
                          Preferred city
                        </label>
                        <select
                          id="contact-city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={inputClassName}
                        >
                          {(cities && cities.length > 0
                            ? cities
                            : ["Bengaluru", "Hyderabad", "Mysore", "Chennai"]
                          ).map((city) => {
                            const cityName =
                              typeof city === "string" ? city : city.name;
                            return (
                              <option key={cityName} value={cityName}>
                                {cityName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-category"
                        className={labelClassName}
                      >
                        How can we help you?
                      </label>
                      <select
                        id="contact-category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        {INQUIRY_CATEGORIES.map((category) => (
                          <option key={category.id} value={category.label}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className={labelClassName}
                      >
                        Your message or requirements
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us which car, service, or information you are looking for..."
                        className={`${inputClassName} resize-y`}
                      />
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <input
                        id="contact-authorized"
                        type="checkbox"
                        name="authorized"
                        checked={formData.authorized}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                      />
                      <label
                        htmlFor="contact-authorized"
                        className="cursor-pointer select-none text-xs leading-5 text-slate-600"
                      >
                        I authorize Kalyani Motors and its representatives to
                        contact me via Call, SMS, WhatsApp, or Email regarding
                        this enquiry.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                      {isSubmitting
                        ? "Sending your message..."
                        : "Submit enquiry"}
                      {!isSubmitting && <Send className="h-4 w-4" />}
                    </button>
                    <p className="text-center text-[11px] leading-5 text-slate-400">
                      Your details will be used to respond to this enquiry.
                    </p>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Phone,
//   Mail,
//   MapPin,
//   Clock,
//   ArrowRight,
//   Send,
//   CheckCircle2,
//   Building2,
//   Sparkles,
//   Car,
//   Wrench,
//   ShieldCheck,
//   Headphones,
//   MessageSquare,
// } from "lucide-react";
// import { useKalyani } from "../../../context/KalyaniContext";
// import { submitContactEnquiry } from "../../../services/kalyaniApi";

// const INQUIRY_CATEGORIES = [
//   { id: "new-car", label: "New Car Sales (Arena / Nexa)", icon: Car },
//   { id: "service", label: "Service & Maintenance", icon: Wrench },
//   { id: "test-drive", label: "Book a Test Drive", icon: Sparkles },
//   { id: "insurance", label: "Car Insurance & Renewal", icon: ShieldCheck },
//   { id: "true-value", label: "True Value (Pre-Owned)", icon: Building2 },
//   { id: "general", label: "General Feedback / Other", icon: MessageSquare },
// ];

// export default function ContactPage() {
//   const { selectedCity, cities } = useKalyani();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     email: "",
//     city: selectedCity || "Bengaluru",
//     category: "New Car Sales (Arena / Nexa)",
//     message: "",
//     authorized: true,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionResult, setSubmissionResult] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");

//     if (!formData.fullName.trim()) {
//       setErrorMsg("Please enter your full name.");
//       return;
//     }
//     if (!formData.phone.trim() || formData.phone.length < 10) {
//       setErrorMsg("Please enter a valid 10-digit phone number.");
//       return;
//     }
//     if (!formData.authorized) {
//       setErrorMsg("Please authorize us to contact you regarding your inquiry.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await submitContactEnquiry({
//         ...formData,
//         submittedAt: new Date().toISOString(),
//       });
//       setSubmissionResult(res);
//     } catch (err) {
//       setErrorMsg(
//         err?.message || "Could not submit inquiry. Please call our hotline.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setSubmissionResult(null);
//     setFormData({
//       fullName: "",
//       phone: "",
//       email: "",
//       city: selectedCity || "Bengaluru",
//       category: "New Car Sales (Arena / Nexa)",
//       message: "",
//       authorized: true,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-24 pb-20">
//       {/* HERO HEADER */}
//       <section className="relative px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-12 sm:mb-16">
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center max-w-3xl mx-auto space-y-4"
//         >
//           <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#071936]">
//             We&apos;re Here to Help You
//           </h1>

//           <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
//             Have questions about buying a Maruti Suzuki car, scheduling periodic
//             maintenance, or need quick roadside support? Reach out to our
//             dedicated team.
//           </p>
//         </motion.div>
//       </section>

//       {/* MAIN TWO-COLUMN CONTENT */}
//       <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
//           {/* LEFT COLUMN: CONTACT FORM */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.55 }}
//             className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)]"
//           >
//             <div className="mb-8">
//               <h2 className="font-display text-2xl sm:text-3xl font-black text-[#071936]">
//                 Send Us a Message
//               </h2>
//               <p className="text-slate-500 text-sm mt-1">
//                 Fill out the details below. Our customer executive will get back
//                 to you within 2 hours.
//               </p>
//             </div>

//             <AnimatePresence mode="wait">
//               {submissionResult ? (
//                 <motion.div
//                   key="success-box"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-5"
//                 >
//                   <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
//                     <CheckCircle2 className="w-9 h-9" />
//                   </div>

//                   <div>
//                     <h3 className="font-display text-2xl font-bold text-emerald-950">
//                       Message Received!
//                     </h3>
//                     <p className="text-emerald-800 text-sm mt-2 max-w-md mx-auto leading-relaxed">
//                       {submissionResult.message ||
//                         "Thank you for reaching out! Our customer team has received your inquiry and will call you shortly."}
//                     </p>
//                   </div>

//                   {submissionResult.ticketId && (
//                     <div className="inline-block px-4 py-2 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-900 shadow-sm">
//                       Reference Ticket: {submissionResult.ticketId}
//                     </div>
//                   )}

//                   <div className="pt-2">
//                     <button
//                       type="button"
//                       onClick={handleReset}
//                       className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
//                     >
//                       Send Another Inquiry
//                     </button>
//                   </div>
//                 </motion.div>
//               ) : (
//                 <form
//                   key="contact-form"
//                   onSubmit={handleSubmit}
//                   className="space-y-5"
//                 >
//                   {errorMsg && (
//                     <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
//                       {errorMsg}
//                     </div>
//                   )}

//                   {/* Name and Phone */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
//                         Full Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="fullName"
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         placeholder="e.g. Ramesh Kumar"
//                         className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
//                         Phone Number <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
//                           +91
//                         </span>
//                         <input
//                           type="tel"
//                           name="phone"
//                           maxLength={10}
//                           value={formData.phone}
//                           onChange={handleChange}
//                           placeholder="98765 43210"
//                           className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Email and City */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="ramesh@example.com"
//                         className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
//                         Preferred City
//                       </label>
//                       <select
//                         name="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
//                       >
//                         {(
//                           cities || [
//                             "Bengaluru",
//                             "Hyderabad",
//                             "Mysore",
//                             "Chennai",
//                           ]
//                         ).map((c) => (
//                           <option key={c} value={c}>
//                             {c}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Inquiry Type */}
//                   <div>
//                     <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
//                       How Can We Help You?
//                     </label>
//                     <select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
//                     >
//                       {INQUIRY_CATEGORIES.map((cat) => (
//                         <option key={cat.id} value={cat.label}>
//                           {cat.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Message */}
//                   <div>
//                     <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
//                       Your Message or Requirements
//                     </label>
//                     <textarea
//                       name="message"
//                       rows={4}
//                       value={formData.message}
//                       onChange={handleChange}
//                       placeholder="Tell us what car model, service package, or question you have in mind..."
//                       className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors resize-none"
//                     />
//                   </div>

//                   {/* Consent Checkbox */}
//                   <div className="flex items-start gap-3 pt-1">
//                     <input
//                       type="checkbox"
//                       id="authorized"
//                       name="authorized"
//                       checked={formData.authorized}
//                       onChange={handleChange}
//                       className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
//                     />
//                     <label
//                       htmlFor="authorized"
//                       className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none"
//                     >
//                       I authorize Kalyani Motors and its representatives to
//                       contact me via Call, SMS, WhatsApp, or Email regarding
//                       this inquiry.
//                     </label>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full py-3.5 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
//                   >
//                     {isSubmitting ? (
//                       <span>Sending your message...</span>
//                     ) : (
//                       <>
//                         <span>Submit Inquiry</span>
//                         <Send className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 </form>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* RIGHT COLUMN: CUSTOMER DETAILS & DIRECT REACH */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.55, delay: 0.1 }}
//             className="lg:col-span-5 space-y-6"
//           >
//             {/* Quick Contact Card */}
//             <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)] space-y-6">
//               <div>
//                 <h3 className="font-display text-xl font-black text-[#071936]">
//                   Customer Care & Support
//                 </h3>
//                 <p className="text-slate-500 text-xs mt-1">
//                   Connect with our centralized helpline or regional desk.
//                 </p>
//               </div>

//               {/* Phone Line */}
//               <div className="flex items-start gap-4">
//                 <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
//                   <Phone className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                     Call Center / Hotline
//                   </p>
//                   <a
//                     href="tel:+919845012345"
//                     className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors block mt-0.5"
//                   >
//                     +91 98450 12345
//                   </a>
//                   <a
//                     href="tel:+919845012346"
//                     className="text-xs text-slate-600 hover:text-blue-700 transition-colors block"
//                   >
//                     Alt: +91 98450 12346
//                   </a>
//                 </div>
//               </div>

//               {/* Email Line */}
//               <div className="flex items-start gap-4">
//                 <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
//                   <Mail className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                     Official Email
//                   </p>
//                   <a
//                     href="mailto:support@kalyanimotors.com"
//                     className="text-sm font-bold text-slate-900 hover:text-blue-700 transition-colors block mt-0.5"
//                   >
//                     support@kalyanimotors.com
//                   </a>
//                   <a
//                     href="mailto:care@kalyanimotors.com"
//                     className="text-xs text-slate-600 hover:text-blue-700 transition-colors block"
//                   >
//                     Escalations: care@kalyanimotors.com
//                   </a>
//                 </div>
//               </div>

//               {/* Hours */}
//               <div className="flex items-start gap-4">
//                 <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
//                   <Clock className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                     Operating Hours
//                   </p>
//                   <p className="text-sm font-semibold text-slate-900 mt-0.5">
//                     Monday – Sunday: 9:00 AM – 8:00 PM
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     Service bays operate all 7 days for your convenience.
//                   </p>
//                 </div>
//               </div>

//               {/* Head Office */}
//               <div className="flex items-start gap-4">
//                 <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
//                   <MapPin className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                     Corporate Headquarters
//                   </p>
//                   <p className="text-xs leading-relaxed text-slate-800 mt-0.5">
//                     Nayandahalli, Mysore Road, Bengaluru, Karnataka - 560039
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Quick 24/7 Roadside Assistance Badge */}
//             <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-6 shadow-md flex items-center justify-between gap-4">
//               <div className="space-y-1">
//                 <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-blue-100">
//                   <ShieldCheck className="w-3 h-3" /> 24x7 Breakdown
//                 </div>
//                 <h4 className="font-display text-base font-bold">
//                   Roadside Assistance
//                 </h4>
//                 <p className="text-xs text-blue-100">
//                   Emergency towing & on-spot assistance across South India.
//                 </p>
//               </div>

//               <a
//                 href="tel:18001021800"
//                 className="shrink-0 px-4 py-2.5 rounded-full bg-white text-blue-800 font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm"
//               >
//                 1800 102 1800
//               </a>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* OUTLET NAVIGATION BANNER */}
//       <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mt-16 sm:mt-20">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071936] via-[#0b244d] to-[#071936] text-white p-8 sm:p-12 lg:p-16 shadow-xl"
//         >
//           {/* Subtle decorative glow */}
//           <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl" />
//           <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />

//           <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
//             <div className="max-w-2xl space-y-3">
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
//                 <MapPin className="w-3.5 h-3.5" />
//                 <span>100+ Touchpoints in South India</span>
//               </div>

//               <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
//                 Or Visit Us at Your Nearest Branch
//               </h2>

//               <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
//                 Prefer an in-person visit? Explore Maruti Suzuki Arena, Nexa,
//                 True Value, and state-of-the-art service workshops located near
//                 you in {selectedCity} and beyond.
//               </p>
//             </div>

//             <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
//               <Link
//                 to="/outlets"
//                 className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group cursor-pointer"
//               >
//                 <span>View All Outlets</span>
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//           </div>
//         </motion.div>
//       </section>
//     </div>
//   );
// }
