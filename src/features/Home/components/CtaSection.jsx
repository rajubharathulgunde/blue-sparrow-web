import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

// Reusable Dual-Tone Star doodle
const DualToneStar = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ctaStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
    </defs>
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="url(#ctaStarGrad)" />
  </svg>
);

const CtaSection = () => {
  const [ctaImage, setCtaImage] = useState(null);

  useEffect(() => {
    const fetchCtaImage = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'home')
        .eq('category', 'cta_image')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) setCtaImage(data[0].image_url);
    };
    fetchCtaImage();
    const channel = supabase.channel('live-cta-image').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchCtaImage).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const fallbackImage = "https://images.unsplash.com/photo-1530021544433-289542f53cb4?auto=format&fit=crop&w=800&q=80"; 
  const displayImage = ctaImage || fallbackImage;

  return (
    <section className="py-12 px-6 lg:px-12 mb-20 relative font-sans">
      
      {/* Pure CSS Background Doodles floating outside the CTA box */}
      <div className="absolute top-[20%] left-[5%] w-16 h-16 border-[4px] border-dashed border-blue-100 rounded-full opacity-60 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[8%] w-10 h-10 border-[3px] border-pink-100 rounded-full opacity-50 z-0 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1400px] mx-auto bg-gradient-to-r from-[#eef2ff] via-[#fce7f3] to-[#e0f2fe] rounded-[40px] p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden border border-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] z-10"
      >
        {/* Soft Background Glows inside CTA */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

         <div className="md:w-3/5 relative z-20 text-center md:text-left">
           
           <DualToneStar className="absolute -top-8 -left-4 w-6 h-6 animate-pulse opacity-80" />
           
           <h2 className="text-[32px] lg:text-[42px] font-serif font-bold text-[#1e293b] mb-5 leading-tight drop-shadow-sm relative inline-block">
             Let's Create Something<br/>Unforgettable Together!
             {/* CSS highlighter squiggle under title */}
             <div className="absolute bottom-1 left-0 w-[80%] h-3 bg-pink-100 opacity-60 rounded-full rotate-[-1deg] z-[-1]"></div>
           </h2>
           <p className="text-[16px] md:text-[17px] text-gray-600 mb-8 max-w-lg leading-relaxed mx-auto md:mx-0 font-light relative">
             Whether it's a corporate event, birthday party or a grand carnival experience, we're here to make it extraordinary.
           </p>
           
           <Link 
             to="/contact" 
             className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3 text-[15px] mx-auto md:mx-0 group relative overflow-hidden"
           >
              {/* Button shine effect constructed in CSS */}
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/20 skew-x-[-20deg] group-hover:left-[200%] transition-all duration-700 ease-in-out z-0"></div>
              <span className="relative z-10">Get in Touch</span> 
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
         </div>
         
         <div className="md:w-2/5 mt-12 md:mt-0 relative z-20 flex justify-center md:justify-end pr-0 lg:pr-8">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-white rounded-full flex items-center justify-center border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-visible group"
            >
              <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-gray-50">
                <img 
                  src={displayImage} 
                  alt="Magical Kids Experience" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
              </div>
              
              {/* CSS Decorative rings looping behind the photo */}
              <div className="absolute inset-[-15px] border-[2px] border-dashed border-indigo-200 rounded-full z-0 opacity-50 rotate-45 pointer-events-none"></div>
              
              {/* Floating doodles relative to the circle */}
              <div className="absolute -top-6 -left-2 text-4xl animate-pulse drop-shadow-md z-20">✨</div>
              <div className="absolute bottom-2 -right-4 text-3xl animate-[pulse_3s_ease-in-out_infinite] drop-shadow-md z-20">🌟</div>
            </motion.div>
         </div>
         
      </motion.div>
    </section>
  );
};

export default CtaSection;