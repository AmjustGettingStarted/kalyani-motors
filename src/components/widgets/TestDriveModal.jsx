import React, { useState, useEffect } from 'react';
import { useKalyani } from '../../context/KalyaniContext';
import { submitTestDrive } from '../../services/kalyaniApi';
import { X, Calendar, MapPin, CheckCircle, Car, Clock, Phone, User, Home, Building } from 'lucide-react';

export default function TestDriveModal() {
  const { testDriveModal, closeTestDrive, cars, selectedCity, locations } = useKalyani();
  const { isOpen, selectedCar } = testDriveModal;

  const [formData, setFormData] = useState({
    carSlug: '',
    fullName: '',
    phone: '',
    email: '',
    locationType: 'showroom', // showroom or doorstep
    branchId: '',
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  useEffect(() => {
    if (selectedCar) {
      setFormData((prev) => ({
        ...prev,
        carSlug: selectedCar.slug,
        branchId: locations[0]?.id || '',
      }));
    }
  }, [selectedCar, locations]);

  if (!isOpen) return null;

  const activeCar = cars.find((c) => c.slug === formData.carSlug) || selectedCar || cars[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        carName: activeCar?.name,
        city: selectedCity,
      };
      const res = await submitTestDrive(payload);
      setSuccessInfo(res);
    } catch (err) {
      alert('Could not schedule test drive. Please try again or call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessInfo(null);
    closeTestDrive();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Car className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">Book a Test Drive</h3>
              <p className="text-xs text-blue-200">Kalyani Motors • {selectedCity}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successInfo ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold font-display text-slate-900 mb-2">Test Drive Confirmed!</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
                Thank you, <span className="font-semibold text-slate-900">{formData.fullName}</span>! Your test drive for the{' '}
                <span className="font-semibold text-blue-800">{activeCar?.name}</span> is booked.
              </p>
              <div className="inline-block bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs text-slate-700 font-mono mb-6">
                Booking ID: <span className="font-bold text-blue-700">{successInfo.bookingId}</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Our Relationship Manager will reach out to confirm your scheduled slot.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-8 py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-colors shadow-lg shadow-blue-800/20"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Car preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeCar?.heroImage}
                    alt={activeCar?.name}
                    className="w-16 h-11 object-cover rounded-lg border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">{activeCar?.channel}</span>
                    <h5 className="font-bold text-sm text-slate-900 leading-tight">{activeCar?.name}</h5>
                    <p className="text-xs text-slate-500">{activeCar?.priceRange}</p>
                  </div>
                </div>

                <div className="w-40">
                  <select
                    value={formData.carSlug}
                    onChange={(e) => setFormData({ ...formData, carSlug: e.target.value })}
                    className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {cars.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Drive Location Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Where do you prefer the test drive?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, locationType: 'showroom' })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      formData.locationType === 'showroom'
                        ? 'border-blue-700 bg-blue-50/70 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-blue-700" />
                    <span>At Nearest Showroom</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, locationType: 'doorstep' })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      formData.locationType === 'doorstep'
                        ? 'border-blue-700 bg-blue-50/70 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4 text-emerald-600" />
                    <span>At My Doorstep (Free)</span>
                  </button>
                </div>
              </div>

              {/* Nearest branch selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Kalyani Motors Branch ({selectedCity}) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} - {loc.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time Slot *</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                    >
                      <option>10:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 02:00 PM</option>
                      <option>02:00 PM - 04:00 PM</option>
                      <option>04:00 PM - 06:00 PM</option>
                      <option>06:00 PM - 08:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/25 transition-all transform active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming Your Slot...' : 'Schedule My Free Test Drive'}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  No purchase obligation. Valid driving license required at test drive.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
