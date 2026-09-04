import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

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

      if (data && data.length > 0) {
        setCtaImage(data[0].image_url);
      }
    };

    fetchCtaImage();

    const channel = supabase.channel('live-cta-image')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchCtaImage)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // A high-quality magical fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1530021544433-289542f53cb4?auto=format&fit=crop&w=800&q=80"; 
  const displayImage = ctaImage || fallbackImage;

  return (
    <section className="py-12 px-6 lg:px-12 mb-20">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto bg-gradient-to-r from-[#eef2ff] via-[#fce7f3] to-[#e0f2fe] rounded-[40px] p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden border border-white shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
      >
        {/* Soft Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

         <div className="md:w-3/5 relative z-10 text-center md:text-left">
           <h2 className="text-[32px] lg:text-[42px] font-serif font-bold text-brand-navy mb-5 leading-tight drop-shadow-sm">
             Let's Create Something<br/>Unforgettable Together!
           </h2>
           <p className="text-[17px] text-gray-600 mb-8 max-w-lg leading-relaxed mx-auto md:mx-0 font-light">
             Whether it's a corporate event, birthday party or a grand carnival experience, we're here to make it extraordinary.
           </p>
           <Link 
             to="/contact" 
             className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3 text-[15px] mx-auto md:mx-0 group"
           >
              Get in Touch 
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
         </div>
         
         <div className="md:w-2/5 mt-12 md:mt-0 relative z-10 flex justify-center md:justify-end">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-64 h-64 md:w-72 md:h-72 bg-white rounded-full flex items-center justify-center border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-visible group"
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src={displayImage} 
                  alt="Magical Kids Experience" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
              </div>
              
              {/* Floating sparkles outside the circle */}
              <div className="absolute -top-6 -left-2 text-4xl animate-pulse drop-shadow-md z-20">✨</div>
              <div className="absolute bottom-2 -right-4 text-3xl animate-[pulse_3s_ease-in-out_infinite] drop-shadow-md z-20">🌟</div>
            </motion.div>
         </div>
         
      </motion.div>
    </section>
  );
};

export default CtaSection;