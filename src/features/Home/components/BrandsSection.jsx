import React from 'react';
import { motion } from 'framer-motion';

const BrandsSection = () => {
  const brands = ['Google', 'Microsoft', 'Amazon', 'Deloitte', 'Disney', 'Adobe', 'Apple', 'Spotify'];
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-[#fafafa] border-y border-gray-100 overflow-hidden relative font-sans">
      
      {/* Pure CSS Background Abstract Shapes */}
      <div className="absolute top-[20%] left-[5%] w-12 h-12 border-4 border-pink-100 rounded-full opacity-50 z-0"></div>
      <div className="absolute bottom-[30%] right-[10%] w-8 h-8 bg-blue-100 rotate-45 opacity-50 z-0"></div>
      
      {/* CSS squiggly line spanning the width behind the marquee */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] border-b-2 border-dashed border-gray-200 z-0"></div>

      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 text-center mb-10 relative z-10"
      >
        <h2 className="text-[28px] font-serif font-bold text-[#1e293b] mb-2 relative inline-block">
          Trusted by Amazing Brands
          {/* Subtle Highlighter background behind title */}
          <div className="absolute bottom-1 left-[-5%] w-[110%] h-3 bg-yellow-100 opacity-60 z-[-1] rounded-full rotate-1"></div>
        </h2>
        <p className="text-gray-500 text-[14px] font-light">We're proud to create unforgettable experiences for</p>
      </motion.div>
      
      {/* Infinite Auto-Scrolling Marquee */}
      <div className="relative max-w-[1400px] mx-auto flex overflow-hidden z-10">
         
         {/* Left & Right Fade Gradients matching the off-white background */}
         <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none"></div>

         <motion.div 
           className="flex gap-6 whitespace-nowrap px-4 w-max hover:[animation-play-state:paused]"
           animate={{ x: ["0%", "-33.33%"] }}
           transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
         >
           {duplicatedBrands.map((brand, i) => (
             <div key={i} className="flex-none w-[160px] h-[72px] bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 cursor-pointer group relative">
                {/* CSS pop dot on hover */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <span className="text-gray-400 font-bold text-lg group-hover:text-gray-700 transition-colors">{brand}</span>
             </div>
           ))}
         </motion.div>

      </div>
    </section>
  );
};

export default BrandsSection;