import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, Award, Clock, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      {/* Trust & Accreditations strip */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900/40 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">#1 Dealer Network</p>
              <p className="text-slate-400 text-[11px]">South India's Most Awarded</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">100% Genuine Parts</p>
              <p className="text-slate-400 text-[11px]">Maruti Suzuki Ecstar Certified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-900/40 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">60-Min Express Service</p>
              <p className="text-slate-400 text-[11px]">Twin-Technician Fast Bays</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">24x7 Breakdown Help</p>
              <p className="text-slate-400 text-[11px]">Toll-Free: +91 98450 12345</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white font-black text-xl shadow-lg">
                K
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tight text-white">
                  KALYANI <span className="text-red-500">MOTORS</span>
                </span>
                <span className="block text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  Authorized Maruti Suzuki Dealership
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Established in 2006, Kalyani Motors is South India's premier Maruti Suzuki dealer group with 100+ touchpoints across Bengaluru, Hyderabad, Mysore, and Chennai. Serving over 2 million delighted customers.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>Nayandahalli, Mysore Road, Bengaluru - 560039</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+919845012345" className="hover:text-white transition-colors">
                  +91 98450 12345 / +91 98450 12346
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:support@kalyanimotors.com" className="hover:text-white transition-colors">
                  support@kalyanimotors.com
                </a>
              </div>
            </div>
          </div>

          {/* Popular Arena & Nexa Cars */}
          <div>
            <h4 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-3">
              Popular Models
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cars/swift" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Maruti Suzuki Swift</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/cars/grand-vitara" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Grand Vitara Hybrid</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/cars/brezza" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Maruti Brezza SUV</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/cars/baleno" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Nexa Baleno</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/cars/jimny" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Jimny 5-Door 4x4</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/cars/fronx" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Fronx Turbo Coupe</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/cars/ertiga" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Ertiga 7-Seater MPV</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Service & Facilities */}
          <div>
            <h4 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-3">
              Service & Care
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/service" className="hover:text-white transition-colors">
                  Periodic Maintenance
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors">
                  60-Min Express Service
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors">
                  Doorstep Mobile Service
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors">
                  Cashless Insurance Claims
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors">
                  Accidental Body Repair
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors">
                  Maruti Genuine Accessories
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  24x7 Roadside Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Dealership Locations */}
          <div>
            <h4 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-3">
              Dealership Hubs
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/outlets" className="hover:text-white transition-colors">
                  Bengaluru Showrooms (Nayandahalli, Hebbal, Whitefield)
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white transition-colors">
                  Hyderabad Hubs (Gachibowli, Kukatpally, Jubilee Hills)
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white transition-colors">
                  Mysore Branches (Hunsur Road, Nanjangud)
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white transition-colors">
                  Chennai Centers (Anna Nagar, OMR)
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white transition-colors">
                  True Value Pre-Owned Showrooms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {currentYear} Kalyani Motors Pvt Ltd. All rights reserved. Authorized Dealer for Maruti Suzuki India Limited.
          </p>
          <div className="flex items-center gap-4">
            <span>*Ex-showroom prices are indicative and subject to change by manufacturer without prior notice.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
