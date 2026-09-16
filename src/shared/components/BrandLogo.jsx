import React from 'react';

const BrandLogo = () => {
  return (
    <div
      className="
        absolute
        top-[5px] sm:top-[10px]
        left-[50px] sm:left-[80px] md:left-[100px]
        -translate-x-1/2
        z-[70]
        w-[90px] sm:w-[120px] md:w-[150px]
        h-[90px] sm:h-[120px] md:h-[150px]
        flex
        items-center
        justify-center
        pointer-events-none
      "
    >
      <img
        src="/assets/BS-Word-Logo-Light-BG.png"
        alt="Blue Sparrow Events"
        className="
          w-full
          h-full
          object-contain
        "
      />
    </div>
  );
};

export default BrandLogo;