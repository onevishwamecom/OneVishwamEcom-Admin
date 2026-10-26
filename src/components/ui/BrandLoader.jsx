import React from 'react';
import { Lottie } from 'lottie-react';
import loaderAnimation from '../../assets/loaderAnimation.json';
import logo from '../../assets/logo.png';

function BrandLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
      <div className="flex flex-col items-center gap-3 animate-fade-in">
        <div className="w-36 h-36 flex items-center justify-center">
          <Lottie src={loaderAnimation} loop autoplay className="w-full h-full" />
        </div>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Vishwam Admin Logo" className="h-6 w-auto object-contain" />
          <span className="text-sm font-bold text-white tracking-wide">Loading OneVishwam Admin...</span>
        </div>
      </div>
    </div>
  );
}

export default BrandLoader;
