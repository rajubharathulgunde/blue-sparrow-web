import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const QuickSummary = () => {
  const collageImages = [
    "/assets/family-day (1).pdf/1.jpg",
    "/assets/carnivals 2026.pdf/10.jpg",
    "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/14.jpg",
    "/assets/family-day (1).pdf/6.jpg"
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % collageImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [collageImages.length]);

  return (
    <section className="py-24 bg-white relative overflow-hidden z-20 border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center gap-16">
        
        {/* ================= LEFT: PAPERCLIP SQUARES COLLAGE (Unchanged) ================= */}
        <div className="w-full lg:w-1/2 relative h-[500px] md:h-[600px] flex items-center justify-center mt-10 lg:mt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-blue-50 rounded-full blur-3xl opacity-60 scale-90"></div>
          <div className="relative w-full h-full max-w-[500px]">
            {collageImages.map((src, index) => {
              const positions = [
                "top-[5%] left-[5%] -rotate-6",
                "top-[15%] right-[2%] rotate-6",
                "bottom-[10%] left-[8%] -rotate-3",
                "bottom-[5%] right-[10%] rotate-3"
              ];
              const isActive = index === activeIndex;

              return (
                <motion.div key={index} animate={{ scale: isActive ? 1.05 : 1, filter: isActive ? "brightness(1.05) saturate(1.1)" : "brightness(0.9) saturate(0.9)", zIndex: isActive ? 50 : 10 + index }} transition={{ duration: 0.8, ease: "easeOut" }} className={`absolute w-[50%] md:w-[55%] aspect-square ${positions[index]} transition-all`}>
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 z-30 drop-shadow-md rotate-[15deg]">
                    <svg width="30" height="60" viewBox="0 0 24 48" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M14 8v24a6 6 0 11-12 0V12a4 4 0 118 0v18a2 2 0 11-4 0V14" />
                    </svg>
                  </div>
                  <div className="w-full h-full rounded-[32px] overflow-hidden shadow-floating border-[6px] border-white relative bg-white">
                    <img src={src} alt={`Highlight ${index}`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-100', 'to-pink-100'); }} />
                    <AnimatePresence>
                      {isActive && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 border-4 border-pink-400/40 rounded-[26px] pointer-events-none" />}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT: STRATEGIC SUMMARY TEXT ================= */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-4">The Blue Sparrow Range</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-6 leading-tight">
            We make spaces come alive for kids and families.
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
            Blue Sparrow can take your child's interest, your audience, your space, or your objective and build the exact right event around it.
          </p>

          {/* Range Tags replacing generic service boxes */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
            <span className="bg-pink-50 text-pink-600 font-bold px-4 py-2 rounded-xl text-sm shadow-sm border border-pink-100">Birthdays</span>
            <span className="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl text-sm shadow-sm border border-blue-100">Mall & Retail Activations[cite: 3]</span>
            <span className="bg-emerald-50 text-emerald-600 font-bold px-4 py-2 rounded-xl text-sm shadow-sm border border-emerald-100">Corporate Family Days[cite: 3]</span>
            <span className="bg-amber-50 text-amber-600 font-bold px-4 py-2 rounded-xl text-sm shadow-sm border border-amber-100">Realtor & Society Events[cite: 3]</span>
            <span className="bg-purple-50 text-purple-600 font-bold px-4 py-2 rounded-xl text-sm shadow-sm border border-purple-100">Carnivals & Schools[cite: 3]</span>
          </div>

          <Link to="/contact" className="group flex items-center gap-3 text-white bg-[#4f46e5] font-bold text-sm hover:bg-pink-500 transition-colors py-4 px-8 rounded-full shadow-floating hover:shadow-lg">
            Discuss Your Space 
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="inline-block">&rarr;</motion.span>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default QuickSummary;