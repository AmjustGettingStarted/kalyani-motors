import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKalyani } from '../../context/KalyaniContext';
import { submitContactEnquiry } from '../../services/kalyaniApi';
import {
  X,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../ui/select';

export default function EnquiryPopupModal({ isOpen, onClose }) {
  const { cars, selectedCity } = useKalyani();

  const [formData, setFormData] = useState({
    model: '',
    fullName: '',
    phone: '',
    city: selectedCity || 'Bengaluru',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync city when selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      setFormData((prev) => ({ ...prev, city: selectedCity }));
    }
  }, [selectedCity]);

  // Set default model once cars are loaded
  useEffect(() => {
    if (cars && cars.length > 0 && !formData.model) {
      setFormData((prev) => ({ ...prev, model: cars[0].name }));
    }
  }, [cars, formData.model]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.fullName,
        phone: formData.phone,
        model: formData.model,
        city: formData.city,
        enquiryType: 'Vehicle Purchase Enquiry',
        timestamp: new Date().toISOString(),
      };

      const res = await submitContactEnquiry(payload);
      setSuccessInfo(res);

      // Auto close after 3.5 seconds on success
      setTimeout(() => {
        handleClose();
      }, 3500);
    } catch (err) {
      setErrorMsg('Could not submit enquiry. Please try again or call our helpline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessInfo(null);
    setErrorMsg('');
    onClose?.();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row my-auto max-h-[92vh]"
        >
          {/* Close Button on Mobile (floating top-right) */}
          <button
            type="button"
            onClick={handleClose}
            className="md:hidden absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-900/60 text-white backdrop-blur-md flex items-center justify-center hover:bg-slate-900 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* LEFT COLUMN: Clean Executive Enquiry Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-9 flex flex-col justify-between overflow-y-auto" data-lenis-prevent="true">
            {successInfo ? (
              /* Success Screen */
              <div className="py-8 my-auto text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                    Enquiry Registered!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Our senior consultant from Kalyani Motors{' '}
                    <strong className="text-blue-500">{formData.city}</strong> will contact you shortly with the best ex-showroom quotation.
                  </p>
                </div>
                {/* {successInfo.ticketId && (
                  <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-mono text-slate-600">
                    Ref ID: {successInfo.ticketId}
                  </div>
                )} */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : (
              /* Enquiry Form */
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
                    Enquiry
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed font-medium">
                    Experience Maruti Suzuki for yourself. Request now.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Model Selector Dropdown */}
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                      Choose a model
                    </label>
                    <Select
                      value={formData.model}
                      onValueChange={(val) => setFormData({ ...formData, model: val })}
                      required
                    >
                      <SelectTrigger className="w-full h-auto px-4 py-3 bg-[#eef1f4] hover:bg-[#e8ecf0] border border-transparent focus:border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-slate-200 transition-all cursor-pointer shadow-none">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent
                        className="w-[var(--radix-select-trigger-width)] max-h-60 sm:max-h-72 rounded-xl border border-slate-200 bg-white shadow-xl overflow-y-auto scrollbar-none overscroll-contain"
                        data-lenis-prevent="true"
                      >
                        {cars && cars.length > 0 ? (
                          cars.map((car) => (
                            <SelectItem
                              key={car.id}
                              value={car.name}
                              className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer py-2.5 rounded-lg focus:bg-slate-100"
                            >
                              <span className="truncate block">
                                {car.name} ({car.channel}) • From ₹{(car.startingPrice / 100000).toFixed(2)} Lakh*
                              </span>
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Grand Vitara" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer py-2.5 rounded-lg focus:bg-slate-100">
                              <span className="truncate block">Grand Vitara (Nexa)</span>
                            </SelectItem>
                            <SelectItem value="Fronx" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer py-2.5 rounded-lg focus:bg-slate-100">
                              <span className="truncate block">Fronx (Nexa)</span>
                            </SelectItem>
                            <SelectItem value="Swift" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer py-2.5 rounded-lg focus:bg-slate-100">
                              <span className="truncate block">All-New Swift (Arena)</span>
                            </SelectItem>
                            <SelectItem value="Brezza" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer py-2.5 rounded-lg focus:bg-slate-100">
                              <span className="truncate block">Brezza (Arena)</span>
                            </SelectItem>
                            <SelectItem value="Invicto" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer py-2.5 rounded-lg focus:bg-slate-100">
                              <span className="truncate block">Invicto (Nexa)</span>
                            </SelectItem>
                            <SelectItem value="Baleno" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer py-2.5 rounded-lg focus:bg-slate-100">
                              <span className="truncate block">Baleno (Nexa)</span>
                            </SelectItem>
                            <SelectItem value="Dzire" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer py-2.5 rounded-lg focus:bg-slate-100">
                              <span className="truncate block">Dzire (Arena)</span>
                            </SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Full Name Input */}
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2.5 bg-[#eef1f4] hover:bg-[#e8ecf0] border border-transparent focus:border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile Phone Number */}
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                      Mobile Number
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl bg-[#e3e7ec] text-slate-700 text-xs font-bold border-r border-slate-300/60">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, phone: val });
                        }}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 bg-[#eef1f4] hover:bg-[#e8ecf0] border border-transparent focus:border-slate-300 rounded-r-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all font-mono font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200/60 p-2.5 rounded-lg">
                      {errorMsg}
                    </p>
                  )}

                  {/* Submit Button (Mint green pill button matching reference design) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-400/20 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Requesting...' : 'Request an Enquiry'}</span>
                    </button>
                  </div>
                </form>

                {/* Trust Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Confidential • Immediate Callback from {formData.city} Hub</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Cinematic Fleet Banner Visual */}
          <div className="w-full md:w-1/2 relative min-h-[220px] md:min-h-[460px] bg-slate-950 flex flex-col justify-between overflow-hidden">
            {/* Background Image */}
            <img
              src="/assets/maruti_fleet_enquiry_banner.jpg"
              alt="Maruti Suzuki Lineup at Kalyani Motors"
              className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-700 hover:scale-100"
            />

            {/* Gradient Overlays for Readability & Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

            {/* Stylized Brand Watermark Lettering across the Sky (mimicking reference image) */}
            <div className="relative z-10 pt-10 md:pt-16 px-6 text-center pointer-events-none select-none">
              <span className="font-display font-black text-3xl text-white tracking-[0.22em] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                KALYANI MOTORS
              </span>
              <div className="text-[11px] sm:text-xs text-white/95 font-bold uppercase tracking-[0.35em] mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                M A R U T I &nbsp; S U Z U K I
              </div>
            </div>

            {/* Close Button on Desktop (floating top-right inside image area matching screenshot) */}
            <button
              type="button"
              onClick={handleClose}
              className="hidden md:flex absolute top-4 right-4 z-20 p-1.5 rounded-full text-white/85 hover:text-white hover:bg-black/20 backdrop-blur-[2px] transition-all items-center justify-center cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 drop-shadow" />
            </button>

            {/* Bottom Glass Badge Strip */}
            <div className="relative z-10 p-5 sm:p-6">
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 text-white space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-300 flex items-center gap-1">
                    {/* <Sparkles className="w-3.5 h-3.5" /> */}
                    Special Dealership Benefits
                  </span>
                  <span className="text-[11px] text-slate-300">{formData.city}</span>
                </div>
                <p className="text-[9px] text-slate-300 leading-snug">
                  Zero Waiting Period on Select Variants   •   Best Exchange Value Guaranteed
                  •   Doorstep Showroom Consultation
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
