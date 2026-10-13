import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading Kalyani Motors...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        {/* Animated Icon */}
        <Loader2 className="w-10 h-10 text-blue-700 animate-spin" />

        {/* Text */}
        <p className="text-sm font-semibold tracking-wide text-slate-700 animate-pulse uppercase">
          {text}
        </p>
      </div>
    </div>
  );
}