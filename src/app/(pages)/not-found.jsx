import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto border border-red-100 shadow-lg shadow-red-600/10">
        <Car className="w-10 h-10 animate-bounce" />
      </div>

      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase">
          Error 404 • Destination Not Found
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 mt-2 tracking-tight">
          You've Taken a Wrong Turn
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable on the Kalyani Motors network.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/cars"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition-all"
        >
          <Car className="w-4 h-4 text-red-600" />
          <span>Browse All Cars</span>
        </Link>
      </div>
    </div>
  );
}
