import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase'; 

const BrandsSection = () => {
  const [dbTexts, setDbTexts] = useState({});
  const [dbBrands, setDbBrands] = useState([]);

  useEffect(() => {
    // 1. Fetch Header Text
    const fetchTexts = async () => {
      const { data } = await supabase.from('website_text').select('*').eq('page_id', 'global');
      if (data) {
        const textMap = data.reduce((acc, curr) => ({ ...acc, [curr.text_key]: curr.content }), {});
        setDbTexts(textMap);
      }
    };
    
    // 2. Fetch Brand Logos from Gallery Images
    const fetchBrands = async () => {
      const { data } = await supabase.from('gallery_images').select('*').eq('theme_id', 'global').eq('category', 'brand').order('created_at', { ascending: true });
      if (data) setDbBrands(data);
    };

    fetchTexts();
    fetchBrands();

    const textChannel = supabase.channel('live-brands-texts').on('postgres_changes', { event: '*', schema: 'public', table: 'website_text' }, fetchTexts).subscribe();
    const brandsChannel = supabase.channel('live-brands-logos').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchBrands).subscribe();

    return () => {
      supabase.removeChannel(textChannel);
      supabase.removeChannel(brandsChannel);
    };
  }, []);

  const badgeText = dbTexts.brands_badge || "Global Trust";
  const headingText = dbTexts.brands_heading || "Trusted by the world's most innovative teams.";
  
  // Fallbacks if DB is empty
  const fallbackBrands = [
    { id: 1, title: 'Hamleys', image_url: '' },
    { id: 2, title: 'Reliance', image_url: '' },
    { id: 3, title: 'CRISIL', image_url: '' },
    { id: 4, title: 'Accenture', image_url: '' }
  ];

  const activeBrands = dbBrands.length > 0 ? dbBrands : fallbackBrands;
  const duplicatedBrands = [...activeBrands, ...activeBrands, ...activeBrands, ...activeBrands];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white border-y border-slate-100 overflow-hidden relative font-sans">
      
      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10 sm:mb-16 relative z-10 flex flex-col items-center"
      >
        <span className="text-slate-400 font-bold tracking-[0.2em] uppercase text-[9px] sm:text-[11px] mb-3 sm:mb-4 block">
          {badgeText}
        </span>
        <h2 className="text-[26px] sm:text-[32px] md:text-[40px] font-sans font-extrabold text-slate-900 tracking-tight leading-tight max-w-xl">
          {headingText}
        </h2>
      </motion.div>
      
      {/* Infinite Auto-Scrolling Marquee */}
      <div className="relative max-w-[1400px] mx-auto flex overflow-hidden z-10">
         
         <div className="absolute top-0 left-0 w-12 sm:w-20 md:w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-12 sm:w-20 md:w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

         <motion.div 
           className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap px-4 w-max hover:[animation-play-state:paused]"
           animate={{ x: ["0%", "-33.33%"] }}
           transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
         >
           {duplicatedBrands.map((brand, i) => (
             <div 
               key={`${brand.id}-${i}`} 
               className="flex-none min-w-[140px] sm:min-w-[180px] md:min-w-[220px] h-[65px] sm:h-[80px] md:h-[90px] bg-slate-50 border border-slate-100 rounded-[20px] sm:rounded-[28px] flex items-center justify-center px-4 hover:bg-white hover:border-slate-200 hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.08)] transform hover:-translate-y-1 transition-all duration-500 cursor-pointer group gap-3"
             >
                {/* Brand Logo (Optional) */}
                {brand.image_url && (
                  <img src={brand.image_url} alt={brand.title || 'Brand'} className="h-8 sm:h-10 md:h-12 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                )}
                
                {/* Brand Name (Optional) */}
                {brand.title && (
                  <span className="text-slate-400 font-bold text-[14px] sm:text-lg md:text-xl tracking-wide group-hover:text-slate-900 transition-colors duration-300 truncate max-w-[120px]">
                    {brand.title}
                  </span>
                )}
             </div>
           ))}
         </motion.div>

      </div>
    </section>
  );
};

export default BrandsSection;