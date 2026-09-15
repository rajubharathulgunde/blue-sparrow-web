import React from 'react';

const BrandLogo = () => {
  return (
    <div
      className="
        absolute
        top-[10px]
        left-[100px]
        -translate-x-1/2
        z-[70]
        w-[150px]
        h-[150px]
        
        flex
        items-left
        justify-left
        
        
        pointer-events-none
      "
    >
      <img
        src="/assets/BS-Full-Logo-Light-BG.png"
        alt="Blue Sparrow Events"
        className="
          w-[150px]
          h-[150px]
          object-contain
        "
      />
    </div>
  );
};

export default BrandLogo;