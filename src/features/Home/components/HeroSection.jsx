import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

// Reusable Dual-Tone Star doodle
const DualToneStar = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dualToneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" /> {/* Blue */}
        <stop offset="100%" stopColor="#c084fc" /> {/* Purple */}
      </linearGradient>
    </defs>
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="url(#dualToneGrad)" />
  </svg>
);

const HeroSection = () => {
  const [dbBgVideo, setDbBgVideo] = useState(null);
  const [dbSliderVideos, setDbSliderVideos] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'home')
        .in('category', ['hero_video', 'hero_slider_video'])
        .order('created_at', { ascending: false });
        
      if (data && data.length > 0) {
        const bgVid = data.find(item => item.category === 'hero_video');
        if (bgVid) setDbBgVideo(bgVid.image_url);

        const sliderVids = data.filter(item => item.category === 'hero_slider_video');
        if (sliderVids.length > 0) {
          setDbSliderVideos(sliderVids.map(item => item.image_url));
        }
      }
    };

    fetchMedia();
    const channel = supabase.channel('live-hero-media').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchMedia).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-white">
      
      {/* ================= 1. FULL SCREEN BACKGROUND ================= */}
      <div className="absolute inset-0 z-0">
        {dbBgVideo ? (
          <video className="w-full h-full object-cover object-[60%_center] md:object-[70%_center]" autoPlay loop muted playsInline>
            <source src={dbBgVideo} type="video/mp4" />
          </video>
        ) : (
          <img 
            src="/assets/Home Screen Home Images.png" 
            alt="Magical Experiences" 
            className="w-full h-full object-cover object-[60%_center] md:object-[70%_center]" 
            onError={(e) => { 
              e.target.style.display = 'none'; 
              e.target.parentElement.classList.add('bg-gradient-to-r', 'from-blue-50', 'to-pink-50'); 
            }} 
          />
        )}

        {/* Masking Gradients - Enhanced for mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent w-full md:w-[65%] lg:w-[60%]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-transparent md:hidden"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      </div>

      {/* Background Soft Pastel Blobs */}
      <div className="absolute top-[10%] left-[-20%] md:left-[-5%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-gradient-to-br from-pink-100/80 to-purple-100/50 rounded-full blur-[80px] pointer-events-none z-0"></div>

      {/* ================= 2. FOREGROUND CONTENT ================= */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full relative z-20 pt-28 pb-16 flex flex-col justify-center min-h-[90vh]">
        
        {/* Floating Dual-Tone Stars - Adjusted positioning for mobile */}
        <DualToneStar className="absolute top-[15%] md:top-[20%] left-[60%] md:left-[45%] w-5 h-5 md:w-6 md:h-6 animate-pulse" />
        <DualToneStar className="absolute bottom-[20%] md:bottom-[25%] left-[8%] md:left-[55%] w-6 h-6 md:w-8 md:h-8 animate-pulse" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full lg:w-[55%] flex flex-col items-start text-left relative z-20 mt-8 md:mt-0">
          <span className="text-gray-600 font-bold text-[10px] md:text-[11px] tracking-[0.2em] uppercase mb-4">Events That Inspire</span>
          
          <h1 className="text-[42px] sm:text-[52px] md:text-[68px] lg:text-[80px] font-serif font-bold text-[#1e293b] leading-[1.05] tracking-tight mb-2">
            Magical <br className="hidden sm:block" /> Experiences
          </h1>
          <h2 className="text-[32px] sm:text-[38px] md:text-[48px] lg:text-[56px] text-[#f472b6] mb-6 transform -rotate-2 origin-left" style={{ fontFamily: '"Caveat", cursive' }}>
            That Stay With You Forever
          </h2>
          
          <p className="text-[14px] sm:text-[15px] md:text-[16px] text-gray-700 mb-10 max-w-[480px] leading-relaxed font-medium">
            From corporate workshops to immersive carnivals, we craft exceptional experiences that inspire, engage and bring people together.
          </p>
          
          {/* Buttons - Stacked on tiny screens, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 sm:mb-14 w-full sm:w-auto">
            <button onClick={() => window.scrollTo({ top: 850, behavior: 'smooth' })} className="w-full sm:w-auto justify-center bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-3.5 px-7 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-[14px]">
              Explore Experiences <span className="ml-1 font-bold">&rarr;</span>
            </button>
            <Link to="/contact" className="w-full sm:w-auto justify-center bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-[#4f46e5] hover:text-[#4f46e5] text-[#1e293b] font-medium py-3.5 px-7 rounded-full shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-[14px]">
              <svg className="w-4 h-4 text-[#4f46e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 
              Plan an Event
            </Link>
          </div>

          {/* Credibility Metrics - Converted to a 2x2 grid on mobile for a cleaner look */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-4 sm:gap-x-8 lg:gap-x-12 gap-y-6 w-full">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-400 shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[16px] sm:text-[18px] text-[#1e293b] leading-none mb-1">500+</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wide">Events Delivered</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 flex items-center justify-center text-xl sm:text-2xl drop-shadow-sm shrink-0">✨</div>
              <div className="flex flex-col">
                <span className="font-bold text-[16px] sm:text-[18px] text-[#1e293b] leading-none mb-1">100K+</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wide">Happy Kids</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 flex items-center justify-center text-xl sm:text-2xl drop-shadow-sm shrink-0">🌟</div>
              <div className="flex flex-col">
                <span className="font-bold text-[16px] sm:text-[18px] text-[#1e293b] leading-none mb-1">50+</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wide">Corp Clients</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-400 shrink-0">
                 <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[16px] sm:text-[18px] text-[#1e293b] leading-none mb-1">12+</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wide">Years Magic</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Crafting Smiles Badge - Hidden on mobile, visible on tablets and up */}
        <div className="hidden md:flex absolute bottom-[8%] right-[10%] lg:right-[35%] bg-white rounded-full w-[110px] h-[110px] flex-col items-center justify-center p-3 shadow-xl z-30 border border-gray-50 transform hover:scale-105 transition-transform duration-500">
          <span className="text-red-400 text-[22px] mb-1">❤️</span>
          <span className="text-[#1e293b] font-bold text-[9px] text-center leading-tight tracking-wide">Crafting<br/>Smiles Since<br/>2016</span>
        </div>
      </div>

      {/* ================= 3. RIGHT CORNER DOODLES (PINNED TO EDGE) ================= */}
      <div className="hidden lg:flex absolute bottom-0 right-0 w-[280px] h-[250px] xl:w-[360px] xl:h-[300px] bg-white rounded-tl-[100%] z-30 flex-col justify-center items-center shadow-[-10px_-10px_40px_rgba(255,255,255,0.7)] pt-12 xl:pt-16 pr-10 xl:pr-16">
        <div className="relative">
          <img src="/assets/blue sparrow.png" alt="Sparrow" className="absolute -top-14 right-2 w-12 h-12 rotate-12 drop-shadow-md" onError={(e) => e.target.style.display='none'} />
          <div className="text-transparent bg-clip-text bg-gradient-to-br from-[#1e293b] to-[#4f46e5] text-[18px] xl:text-[22px] leading-tight" style={{ fontFamily: '"Caveat", cursive' }}>
            <span className="absolute -left-6 top-4 text-xl text-[#60a5fa]"></span>
            <div className="mb-0.5">Events</div>
            <div className="mb-0.5">Experiences</div>
            <div className="mb-0.5">Fun</div>
            <div className="mb-0.5">For a brighter</div>
            <div>tomorrow!</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;