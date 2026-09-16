import React from 'react';
import { motion } from 'framer-motion';

const BrandsSection = () => {
  const brands = ['Hamleys Play', 'Ritu Kumar', 'Reliance', 'Satya Paul', 'CRISIL', 'Hamleys', 'Cisco Webex', 'Accenture'];
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white border-y border-slate-100 overflow-hidden relative font-sans">
      
      {/* Animated Header - Minimal & Premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10 sm:mb-16 relative z-10 flex flex-col items-center"
      >
        <span className="text-slate-400 font-bold tracking-[0.2em] uppercase text-[9px] sm:text-[11px] mb-3 sm:mb-4 block">
          Global Trust
        </span>
        <h2 className="text-[26px] sm:text-[32px] md:text-[40px] font-sans font-extrabold text-slate-900 tracking-tight leading-tight max-w-xl">
          Trusted by the world's most innovative teams.
        </h2>
      </motion.div>
      
      {/* Infinite Auto-Scrolling Marquee */}
      <div className="relative max-w-[1400px] mx-auto flex overflow-hidden z-10">
         
         {/* Deep Fade Gradients for a seamless edge transition - Scaled for mobile */}
         <div className="absolute top-0 left-0 w-12 sm:w-20 md:w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-12 sm:w-20 md:w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

         <motion.div 
           className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap px-4 w-max hover:[animation-play-state:paused]"
           animate={{ x: ["0%", "-33.33%"] }}
           transition={{ repeat: Infinity, ease: "linear", duration: 35 }} // Slower, more elegant scroll speed
         >
           {duplicatedBrands.map((brand, i) => (
             <div 
               key={i} 
               className="flex-none w-[140px] sm:w-[180px] md:w-[220px] h-[65px] sm:h-[80px] md:h-[90px] bg-slate-50 border border-slate-100 rounded-[20px] sm:rounded-[28px] flex items-center justify-center hover:bg-white hover:border-slate-200 hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.08)] transform hover:-translate-y-1 transition-all duration-500 cursor-pointer group"
             >
                <span className="text-slate-400 font-bold text-[15px] sm:text-xl md:text-2xl tracking-wide group-hover:text-slate-900 transition-colors duration-300">
                  {brand}
                </span>
             </div>
           ))}
         </motion.div>

      </div>
    </section>
  );
};

export default BrandsSection;