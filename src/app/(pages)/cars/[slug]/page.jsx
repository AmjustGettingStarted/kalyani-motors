import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useKalyani } from '../../../../context/KalyaniContext';
import { formatINR } from '../../../../lib/utils';
import CarCard from '../../../../components/widgets/CarCard';
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
} from 'lucide-react';

export default function CarDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cars, openTestDrive, selectedCity } = useKalyani();

  const car = useMemo(() => {
    return cars.find((c) => c.slug.toLowerCase() === slug?.toLowerCase());
  }, [cars, slug]);

  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

  // EMI Calculator State
  const [downPayment, setDownPayment] = useState(100000);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);

  useEffect(() => {
    if (car) {
      setActiveImage(car.heroImage);
      setSelectedColor(car.colors?.[0] || null);
      setDownPayment(Math.round(car.startingPrice * 0.2));
    }
  }, [car]);

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display text-slate-900">Car Not Found</h2>
        <p className="text-slate-500 text-sm">The model "{slug}" could not be located in our catalog.</p>
        <button
          onClick={() => navigate('/cars')}
          className="px-6 py-2.5 bg-blue-800 text-white font-bold rounded-xl text-xs hover:bg-blue-900"
        >
          Back to All Cars
        </button>
      </div>
    );
  }

  // Calculate EMI
  const loanPrincipal = Math.max(0, car.startingPrice - downPayment);
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = loanTenureYears * 12;
  const emi =
    loanPrincipal > 0
      ? Math.round(
          (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;

  const otherCars = cars.filter((c) => c.id !== car.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-12">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-blue-800 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/cars" className="hover:text-blue-800 transition-colors">
          All Cars
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{car.name}</span>
      </nav>

      {/* Hero Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src={activeImage || car.heroImage}
              alt={car.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md ${
                  car.channel === 'Nexa' ? 'bg-slate-950 border border-slate-700' : 'bg-blue-800'
                }`}
              >
                {car.channel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200 shadow-sm">
                {car.bodyType}
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {car.gallery && car.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {car.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-blue-700 ring-2 ring-blue-600/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${car.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Color Switcher Preview */}
          {car.colors && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-600 mb-2">
                Available Colors: <span className="text-blue-800">{selectedColor?.name}</span>
              </p>
              <div className="flex items-center gap-2.5">
                {car.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all transform hover:scale-110 shadow-sm ${
                      selectedColor?.name === color.name ? 'ring-2 ring-blue-700 ring-offset-2 scale-110' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Pricing, Specs & Booking CTAs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{car.rating}</span>
                  <span className="text-slate-400 font-normal">({car.reviewsCount} reviews)</span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  In Stock in {selectedCity}
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
                {car.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{car.tagline}</p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ex-Showroom Price ({selectedCity})
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-0.5">
                {car.priceRange}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Starting EMI from ~ ₹ {formatINR(Math.round(car.startingPrice * 0.015))}/mo*</span>
              </div>
            </div>

            {/* Core specs pills */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-blue-800 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mileage</span>
                  <span className="font-bold text-slate-800">{car.mileage}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2.5">
                <Fuel className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Fuel Types</span>
                  <span className="font-bold text-slate-800">{car.fuelTypes.join(', ')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Engine</span>
                  <span className="font-bold text-slate-800 truncate block max-w-[120px]">{car.engine}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Transmission</span>
                  <span className="font-bold text-slate-800">{car.transmissionTypes.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => openTestDrive(car)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Calendar className="w-4 h-4" /> Schedule Free Test Drive
              </button>

              <a
                href="tel:+919845012345"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center block transition-colors border border-slate-200"
              >
                Call Kalyani Motors Hotline: +91 98450 12345
              </a>
            </div>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-2 pt-1">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              <span>Maruti Suzuki True Value Exchange Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Detailed Matrix */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold tracking-widest text-blue-800 uppercase">Technical Details</span>
          <h2 className="font-display font-black text-2xl text-slate-900 mt-1">
            {car.name} Specifications Overview
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Max Power</span>
            <span className="font-display font-bold text-sm sm:text-base text-slate-900 mt-1 block">{car.maxPower}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Max Torque</span>
            <span className="font-display font-bold text-sm sm:text-base text-slate-900 mt-1 block">{car.maxTorque}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Boot Capacity</span>
            <span className="font-display font-bold text-sm sm:text-base text-slate-900 mt-1 block">{car.bootSpace}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Ground Clearance</span>
            <span className="font-display font-bold text-sm sm:text-base text-slate-900 mt-1 block">{car.groundClearance}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Fuel Tank Capacity</span>
            <span className="font-display font-bold text-sm sm:text-base text-slate-900 mt-1 block">{car.fuelTank}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Seating Capacity</span>
            <span className="font-display font-bold text-sm sm:text-base text-slate-900 mt-1 block">{car.seatingCapacity} Seater</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Dealership Channel</span>
            <span className="font-display font-bold text-sm sm:text-base text-blue-800 mt-1 block">{car.channel}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Certified Mileage</span>
            <span className="font-display font-bold text-sm sm:text-base text-emerald-700 mt-1 block">{car.mileage}</span>
          </div>
        </div>

        {/* Key Features Bullet List */}
        {car.keyFeatures && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-display font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-800" /> Key Equipment & Safety Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {car.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Variant Price Breakdown Table */}
      {car.variants && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Trim Comparison</span>
            <h2 className="font-display font-black text-2xl text-slate-900 mt-1">
              {car.name} Variant Prices in {selectedCity}
            </h2>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Variant Name</th>
                  <th className="py-3.5 px-4">Fuel</th>
                  <th className="py-3.5 px-4">Transmission</th>
                  <th className="py-3.5 px-4">Key Spec</th>
                  <th className="py-3.5 px-4">Ex-Showroom</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {car.variants.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{v.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{v.fuel}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{v.transmission}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{v.keyFeature}</td>
                    <td className="py-3.5 px-4 font-display font-black text-slate-900">{formatINR(v.price)}*</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openTestDrive(car)}
                        className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-bold text-xs shadow-sm"
                      >
                        Book Test Drive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Live Interactive EMI Calculator */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> Quick Financing Tool
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              Estimated Monthly EMI for {car.name}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Calculate monthly installment based on your chosen down payment and loan tenure.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">Estimated EMI</span>
            <span className="text-2xl sm:text-3xl font-display font-black text-amber-400">
              ₹ {emi.toLocaleString('en-IN')}
              <span className="text-xs text-slate-300 font-normal"> / month</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Down Payment Slider */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Down Payment:</span>
              <span className="font-bold text-white">₹ {downPayment.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={car.startingPrice * 0.7}
              step={10000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Min ₹ 50,000</span>
              <span>Max ~70%</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Tenure:</span>
              <span className="font-bold text-white">{loanTenureYears} Years ({loanTenureYears * 12} Mos)</span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={loanTenureYears}
              onChange={(e) => setLoanTenureYears(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 Year</span>
              <span>7 Years</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Interest Rate:</span>
              <span className="font-bold text-white">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min={7.5}
              max={14.0}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>7.5% (Best Bank Offer)</span>
              <span>14.0%</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          *Indicative EMI. Subject to bank approval, credit score, and insurance / RTO registration charges.
        </p>
      </section>

      {/* Recommended Other Cars */}
      {otherCars.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-slate-900">
              Explore Similar Maruti Suzuki Models
            </h2>
            <Link to="/cars" className="text-xs font-bold text-blue-800 hover:underline">
              View All Cars →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherCars.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
