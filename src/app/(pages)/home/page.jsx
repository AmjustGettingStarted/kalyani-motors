import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useKalyani } from "../../../context/KalyaniContext";
import FeaturedCarsSection from "../../../components/home/FeaturedCarsSection";
import HeroVideo from "../../../components/home/HeroVideo";
import {
  ArrowRight,
} from "lucide-react";
import ChannelExperienceSection from "../../../components/home/ArenavsNexaCTA";
import WhyChooseKalyaniSection from "../../../components/home/WhyChoseUs";
import FaqSection from "../../../components/home/FAQsection";

export default function HomePage() {
  const { cars, locations, selectedCity, faqs } = useKalyani();
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Banner Carousel */}
      <HeroVideo />

      {/* 3. Featured Car Showcase with Filter Pills & Responsive Carousel */}
      <FeaturedCarsSection cars={cars} selectedCity={selectedCity} />

      {/* 4. Arena vs Nexa Channel Experience Strip */}
      <ChannelExperienceSection />

      {/* 5. Why Choose Kalyani Motors (Trust Badges & Milestones) */}
      <WhyChooseKalyaniSection />

      {/* 6. City Outlets Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-red-600 uppercase">
              Nearest Branches
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
              Kalyani Motors in {selectedCity}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Visit our state-of-the-art showrooms, authorized service centers,
              and True Value hubs.
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
          {locations?.slice(0, 3).map((loc) => (
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

                <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                  {loc.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {loc.address}
                </p>
                <p className="text-[11px] text-blue-700 font-semibold mt-1">
                  Landmark: {loc.landmark}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {loc.facilities?.slice(0, 3).map((fac) => (
                    <span
                      key={fac}
                      className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${loc.phone.replace(/\s+/g, "")}`}
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
      <FaqSection />
    </div>
  );
}