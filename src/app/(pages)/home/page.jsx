import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useKalyani } from '../../../context/KalyaniContext';
import CarCard from '../../../components/widgets/CarCard';
import CitySelector from '../../../components/widgets/CitySelector';
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Users,
  Building,
  ChevronDown,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import HeroVideo from '../../../components/widgets/HeroVideo';

export default function HomePage() {
  const { cars, locations, selectedCity, faqs } = useKalyani();
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const bodyTypes = ['All', 'SUV', 'Hatchback', 'Sedan', 'MPV'];

  const filteredFeaturedCars = cars
    .filter((c) => c.isFeatured)
    .filter((c) => (selectedBodyType === 'All' ? true : c.bodyType === selectedBodyType));

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Banner Carousel */}
      <HeroVideo />

      {/* 3. Featured Car Showcase with Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Popular Lineup
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Featured Maruti Suzuki Models
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Explore the latest top-selling Arena & Nexa vehicles available in {selectedCity} with best festive prices.
            </p>
          </div>

          {/* Body Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {bodyTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedBodyType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedBodyType === type
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-800/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {type === 'All' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeaturedCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* View all cars banner CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-blue-900 text-white font-bold text-sm rounded-2xl shadow-lg transition-colors"
          >
            <span>Explore All Maruti Models & Variants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Arena vs Nexa Channel Experience Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Arena Box */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 p-8 text-white shadow-xl flex flex-col justify-between min-h-[300px]">
            <div className="relative z-10">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-full inline-block mb-3">
                Maruti Suzuki Arena
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
                India's Most Trusted Family Cars
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed">
                Featuring Swift, Brezza, Ertiga, and Dzire. Modern design, class-leading mileage, and connected safety for everyone.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <Link
                to="/cars?channel=Arena"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-950 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <span>View Arena Lineup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Nexa Box */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-900 to-black p-8 text-white shadow-xl flex flex-col justify-between min-h-[300px] border border-slate-800">
            <div className="relative z-10">
              <span className="px-3 py-1 bg-white text-slate-950 text-xs font-black uppercase tracking-wider rounded-full inline-block mb-3">
                Nexa Experience
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
                Create. Inspire. Luxury Redefined.
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed">
                Discover Grand Vitara Strong Hybrid, Baleno, Jimny 4x4, and Fronx Turbo. Exclusive hospitality and automotive luxury.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <Link
                to="/cars?channel=Nexa"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <span>Discover Nexa Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Kalyani Motors (Trust Badges & Milestones) */}
      <section className="bg-slate-100 py-16 px-4 sm:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-blue-800 uppercase">Legacy of Excellence</span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight mt-1">
              Why 20+ Lakh Families Choose Kalyani Motors
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              For over 18 years, Kalyani Motors has set the gold standard in automotive retail, transparent financing, and authorized Maruti Suzuki care across South India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="font-display font-black text-2xl text-slate-900">20+ Lakh</h4>
              <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Satisfied Customers</p>
              <p className="text-xs text-slate-600 mt-2">
                Delivering dreams and creating smiles across Karnataka, Telangana, and Tamil Nadu.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Building className="w-7 h-7" />
              </div>
              <h4 className="font-display font-black text-2xl text-slate-900">100+ Outlets</h4>
              <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Showrooms & Workshops</p>
              <p className="text-xs text-slate-600 mt-2">
                State-of-the-art facilities located conveniently across all major tech hubs & highways.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-display font-black text-2xl text-slate-900">4.8 / 5.0</h4>
              <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Google Customer Rating</p>
              <p className="text-xs text-slate-600 mt-2">
                Over 50,000 verified reviews praising prompt service, polite staff, and genuine advisory.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="font-display font-black text-2xl text-slate-900">60-Min Express</h4>
              <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Quick Service Bays</p>
              <p className="text-xs text-slate-600 mt-2">
                Twin-technician synchronized servicing with zero delay while you relax in executive lounge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. City Outlets Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Nearest Branches</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
              Kalyani Motors in {selectedCity}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Visit our state-of-the-art showrooms, authorized service centers, and True Value hubs.
            </p>
          </div>

          <Link
            to="/outlets"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-900 hover:underline"
          >
            <span>View All {selectedCity} Branches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.slice(0, 3).map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {loc.type}
                  </span>
                  {loc.isFlagship && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      FLAGSHIP
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 leading-snug">{loc.name}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{loc.address}</p>
                <p className="text-[11px] text-blue-700 font-semibold mt-1">Landmark: {loc.landmark}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {loc.facilities.slice(0, 3).map((fac) => (
                    <span key={fac} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${loc.phone.replace(/\s+/g, '')}`}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  {loc.phone}
                </a>
                <a
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-800 hover:underline"
                >
                  Directions →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Common Customer FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-blue-800 uppercase">Have Questions?</span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Everything you need to know about buying, test drives, and maintaining your Maruti Suzuki car.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-display font-bold text-slate-900 hover:text-blue-800 transition-colors"
                >
                  <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-800' : ''
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
