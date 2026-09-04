import React from 'react';
import { motion } from 'framer-motion';

const BrandsSection = () => {
  // We added a few more brands and duplicated the list so it loops seamlessly!
  const brands = ['Google', 'Microsoft', 'Amazon', 'Deloitte', 'Disney', 'Adobe', 'Apple', 'Spotify'];
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-16 bg-white border-t border-b border-gray-50 overflow-hidden">
      
      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 text-center mb-10"
      >
        <h2 className="text-[28px] font-serif font-bold text-brand-navy mb-2">Trusted by Amazing Brands</h2>
        <p className="text-gray-500 text-[15px]">We're proud to create unforgettable experiences for</p>
      </motion.div>
      
      {/* Infinite Auto-Scrolling Marquee */}
      <div className="relative max-w-7xl mx-auto flex overflow-hidden">
         
         {/* Left & Right Fade Gradients */}
         <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

         {/* Framer Motion Animation Container */}
         <motion.div 
           className="flex gap-6 whitespace-nowrap px-4 w-max hover:[animation-play-state:paused]"
           animate={{ x: ["0%", "-50%"] }}
           transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
         >
           {duplicatedBrands.map((brand, i) => (
             <div key={i} className="flex-none w-[160px] h-[72px] bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center hover:bg-[#f8fafc] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <span className="text-gray-400 font-bold text-lg group-hover:text-gray-600 transition-colors">{brand}</span>
             </div>
           ))}
         </motion.div>

      </div>
    </section>
  );
};

export default BrandsSection;