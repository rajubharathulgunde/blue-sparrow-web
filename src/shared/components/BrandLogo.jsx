import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo = () => {
  return (
    // Pinned purely to the exact top-left corner, scaling down for mobile.
    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 md:left-8 z-[70] pointer-events-auto">
      <Link to="/" className="flex items-center justify-start w-[80px] sm:w-[100px] md:w-[120px]">
        <img
          src="/assets/BS-Word-Logo-Light-BG.png"
          alt="Blue Sparrow Events"
          className="w-full h-auto object-contain transform origin-left"
        />
      </Link>
    </div>
  );
};

export default BrandLogo;