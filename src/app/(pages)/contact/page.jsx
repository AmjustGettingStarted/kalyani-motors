import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  CheckCircle2,
  Building2,
  Sparkles,
  Car,
  Wrench,
  ShieldCheck,
  Headphones,
  MessageSquare,
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

export default function ContactPage() {
  const { selectedCity, cities } = useKalyani();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: selectedCity || "Bengaluru",
    category: "New Car Sales (Arena / Nexa)",
    message: "",
    authorized: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

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
    if (!formData.phone.trim() || formData.phone.length < 10) {
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
        submittedAt: new Date().toISOString(),
      });
      setSubmissionResult(res);
    } catch (err) {
      setErrorMsg(
        err?.message || "Could not submit inquiry. Please call our hotline.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      city: selectedCity || "Bengaluru",
      category: "New Car Sales (Arena / Nexa)",
      message: "",
      authorized: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-24 pb-20">
      {/* HERO HEADER */}
      <section className="relative px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#071936]">
            We&apos;re Here to Help You
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Have questions about buying a Maruti Suzuki car, scheduling periodic
            maintenance, or need quick roadside support? Reach out to our
            dedicated team.
          </p>
        </motion.div>
      </section>

      {/* MAIN TWO-COLUMN CONTENT */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)]"
          >
            <div className="mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#071936]">
                Send Us a Message
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Fill out the details below. Our customer executive will get back
                to you within 2 hours.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submissionResult ? (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-5"
                >
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-emerald-950">
                      Message Received!
                    </h3>
                    <p className="text-emerald-800 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                      {submissionResult.message ||
                        "Thank you for reaching out! Our customer team has received your inquiry and will call you shortly."}
                    </p>
                  </div>

                  {submissionResult.ticketId && (
                    <div className="inline-block px-4 py-2 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-900 shadow-sm">
                      Reference Ticket: {submissionResult.ticketId}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Send Another Inquiry
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
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="98765 43210"
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email and City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ramesh@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Preferred City
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
                      >
                        {(
                          cities || [
                            "Bengaluru",
                            "Hyderabad",
                            "Mysore",
                            "Chennai",
                          ]
                        ).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      How Can We Help You?
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors"
                    >
                      {INQUIRY_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.label}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message or Requirements
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what car model, service package, or question you have in mind..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="authorized"
                      name="authorized"
                      checked={formData.authorized}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
                    />
                    <label
                      htmlFor="authorized"
                      className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none"
                    >
                      I authorize Kalyani Motors and its representatives to
                      contact me via Call, SMS, WhatsApp, or Email regarding
                      this inquiry.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Sending your message...</span>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT COLUMN: CUSTOMER DETAILS & DIRECT REACH */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Quick Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)] space-y-6">
              <div>
                <h3 className="font-display text-xl font-black text-[#071936]">
                  Customer Care & Support
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Connect with our centralized helpline or regional desk.
                </p>
              </div>

              {/* Phone Line */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Call Center / Hotline
                  </p>
                  <a
                    href="tel:+919845012345"
                    className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors block mt-0.5"
                  >
                    +91 98450 12345
                  </a>
                  <a
                    href="tel:+919845012346"
                    className="text-xs text-slate-600 hover:text-blue-700 transition-colors block"
                  >
                    Alt: +91 98450 12346
                  </a>
                </div>
              </div>

              {/* Email Line */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Official Email
                  </p>
                  <a
                    href="mailto:support@kalyanimotors.com"
                    className="text-sm font-bold text-slate-900 hover:text-blue-700 transition-colors block mt-0.5"
                  >
                    support@kalyanimotors.com
                  </a>
                  <a
                    href="mailto:care@kalyanimotors.com"
                    className="text-xs text-slate-600 hover:text-blue-700 transition-colors block"
                  >
                    Escalations: care@kalyanimotors.com
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Operating Hours
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    Monday – Sunday: 9:00 AM – 8:00 PM
                  </p>
                  <p className="text-xs text-slate-500">
                    Service bays operate all 7 days for your convenience.
                  </p>
                </div>
              </div>

              {/* Head Office */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Corporate Headquarters
                  </p>
                  <p className="text-xs leading-relaxed text-slate-800 mt-0.5">
                    Nayandahalli, Mysore Road, Bengaluru, Karnataka - 560039
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 24/7 Roadside Assistance Badge */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-6 shadow-md flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-blue-100">
                  <ShieldCheck className="w-3 h-3" /> 24x7 Breakdown
                </div>
                <h4 className="font-display text-base font-bold">
                  Roadside Assistance
                </h4>
                <p className="text-xs text-blue-100">
                  Emergency towing & on-spot assistance across South India.
                </p>
              </div>

              <a
                href="tel:18001021800"
                className="shrink-0 px-4 py-2.5 rounded-full bg-white text-blue-800 font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm"
              >
                1800 102 1800
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUTLET NAVIGATION BANNER */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mt-16 sm:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071936] via-[#0b244d] to-[#071936] text-white p-8 sm:p-12 lg:p-16 shadow-xl"
        >
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>100+ Touchpoints in South India</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                Or Visit Us at Your Nearest Branch
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Prefer an in-person visit? Explore Maruti Suzuki Arena, Nexa,
                True Value, and state-of-the-art service workshops located near
                you in {selectedCity} and beyond.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/outlets"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group cursor-pointer"
              >
                <span>View All Outlets</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
