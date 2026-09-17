import React, { useState } from 'react';
import { useKalyani } from '../../../context/KalyaniContext';
import { submitContactEnquiry } from '../../../services/kalyaniApi';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building,
} from 'lucide-react';

export default function ContactPage() {
  const { selectedCity, cities } = useKalyani();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: selectedCity,
    inquiryType: 'New Car Purchase',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await submitContactEnquiry(form);
      setSuccessInfo(res);
    } catch (err) {
      alert('Could not submit inquiry. Please try again or call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const helplineCards = [
    {
      title: 'Toll-Free Customer Support',
      number: '+91 98450 12345',
      desc: 'General inquiries, new booking status, complaints & customer assistance',
      hours: 'Mon - Sun: 8:00 AM - 8:30 PM',
      color: 'bg-blue-50 text-blue-800 border-blue-100',
    },
    {
      title: '24x7 Roadside Breakdown Helpline',
      number: '1800 102 1800',
      desc: 'Immediate towing, flat tyre, jump-start, and emergency highway assistance',
      hours: 'Available 24 Hours, 365 Days',
      color: 'bg-red-50 text-red-700 border-red-100',
    },
    {
      title: 'Workshop & Service Appointments',
      number: '+91 98450 12346',
      desc: 'Service booking, accidental repairs, insurance claim intimation',
      hours: 'Mon - Sat: 8:00 AM - 7:30 PM',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-full inline-block">
            We Are Here to Help
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            Contact Kalyani Motors
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Reach our relationship managers, schedule service, or get emergency roadside assistance across Bengaluru, Hyderabad, Mysore, and Chennai.
          </p>
        </div>
      </div>

      {/* 24x7 Roadside & Hotline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {helplineCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border ${card.color} shadow-sm flex flex-col justify-between`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Direct Helpline</span>
              <h3 className="font-display font-extrabold text-base mt-1 text-slate-900">{card.title}</h3>
              <a
                href={`tel:${card.number.replace(/\s+/g, '')}`}
                className="text-xl font-display font-black block mt-2 hover:underline"
              >
                {card.number}
              </a>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{card.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{card.hours}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Inquiry Form + Corporate Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="font-display font-black text-xl text-slate-900 mb-1">
            Send an Online Inquiry
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Fill in the details below and our customer relationship manager will call you within 2 business hours.
          </p>

          {successInfo ? (
            <div className="text-center py-8 bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
                Inquiry Received!
              </h3>
              <p className="text-xs text-slate-700 max-w-sm mx-auto mb-3">
                Thank you, <span className="font-semibold">{form.fullName}</span>! Your ticket reference number is{' '}
                <span className="font-bold text-blue-800">{successInfo.ticketId}</span>.
              </p>
              <button
                type="button"
                onClick={() => setSuccessInfo(null)}
                className="px-5 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select City *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Regarding *</label>
                <select
                  value={form.inquiryType}
                  onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option>New Car Purchase (Arena / Nexa)</option>
                  <option>Book a Test Drive at Home</option>
                  <option>Car Loan & Financing Deals</option>
                  <option>True Value Used Car Evaluation</option>
                  <option>Service & Accidental Repair</option>
                  <option>Customer Grievance / Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message or Comments</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the car model you're interested in, variant, or queries..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Corporate HQ & Locations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-800" /> Corporate Headquarters
            </h3>

            <div className="text-xs text-slate-600 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 block">Kalyani Motors Pvt Ltd</strong>
                  No. 24/1 & 25/1, Mysore Road, Near Nayandahalli Metro Station, Nayandahalli, Bengaluru, Karnataka - 560039
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Boardline: +91 80 4355 5555</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Email: corporate@kalyanimotors.com</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Customer Grievance Desk
            </span>
            <h4 className="font-display font-bold text-lg leading-snug">
              Direct Access to Principal Dealer
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              At Kalyani Motors, customer satisfaction is our highest priority. If you have an unresolved service or delivery query, escalate directly to our Principal Nodal Officer.
            </p>
            <p className="text-xs font-mono text-blue-300 pt-1">
              nodal.officer@kalyanimotors.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
