import React from 'react';

export default function Loader({ text = 'Loading Kalyani Motors...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] py-16 px-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-700 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-red-600 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      <p className="mt-4 text-sm font-semibold tracking-wide text-slate-600 animate-pulse uppercase">
        {text}
      </p>
    </div>
  );
}
