import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
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
        // Fetch Main Background Video
        const bgVid = data.find(item => item.category === 'hero_video');
        if (bgVid) setDbBgVideo(bgVid.image_url);

        // Fetch Foreground Slider Videos
        const sliderVids = data.filter(item => item.category === 'hero_slider_video');
        if (sliderVids.length > 0) {
          setDbSliderVideos(sliderVids.map(item => item.image_url));
        }
      }
    };

    fetchMedia();

    const channel = supabase.channel('live-hero-media')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchMedia)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fallbackSliderVideos = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4"
  ];

  const displaySliderVideos = dbSliderVideos.length > 0 ? dbSliderVideos : fallbackSliderVideos;
  
  // Defaults main background to the first slider video if no main background is set
  const displayBgVideo = dbBgVideo || displaySliderVideos[0];

  useEffect(() => {
    let timer;
    if (!isHovered) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displaySliderVideos.length);
      }, 5000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [displaySliderVideos.length, isHovered]);

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#f5f3ff] pt-20">
      <motion.div initial={{ x: "-20vw", y: "70vh", scale: 0.4, rotate: 10, opacity: 0 }} animate={{ x: "110vw", y: "-10vh", scale: 1.2, rotate: -15, opacity: 0.9 }} transition={{ duration: 5.5, ease: "easeInOut", delay: 0.3 }} className="absolute z-50 pointer-events-none drop-shadow-2xl">
        <img src="/assets/your-custom-sparrow.png" alt="Flying Blue Sparrow" className="w-32 h-32 md:w-48 md:h-48 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
      </motion.div>

      {/* ================= BACKGROUND VIDEO ================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video key={displayBgVideo} className="w-full h-full object-cover opacity-30 mix-blend-multiply" autoPlay loop muted playsInline>
          <source src={displayBgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f3ff]/90 via-[#fce7f3]/60 to-white/90"></div>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-10 w-32 h-16 bg-white/60 rounded-full blur-[2px] shadow-soft animate-[bounce_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-40 left-16 w-24 h-12 bg-white/50 rounded-full blur-[2px] shadow-soft animate-[bounce_8s_ease-in-out_infinite_delay-100]"></div>
        <div className="absolute top-1/4 right-10 w-40 h-20 bg-white/40 rounded-full blur-[3px] shadow-soft animate-[bounce_10s_ease-in-out_infinite]"></div>
        <div className="absolute top-48 left-1/4 text-yellow-400 text-2xl animate-pulse">✨</div>
        <div className="absolute top-64 right-1/3 text-pink-400 text-3xl animate-[pulse_3s_ease-in-out_infinite]">✨</div>
        <div className="absolute bottom-32 left-1/3 text-blue-400 text-4xl animate-[pulse_4s_ease-in-out_infinite]">✨</div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-20 w-full">
        
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-2 mb-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/80 shadow-sm">
            <span className="text-gray-600 font-bold text-[13px] tracking-widest uppercase">We Create</span>
            <span className="text-yellow-400 text-lg leading-none">✨</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-serif font-bold text-brand-navy leading-[1.1] mb-1 tracking-tight drop-shadow-sm">
            Magical <br className="hidden md:block" /> Experiences
          </h1>
          <h2 className="text-[36px] md:text-[48px] lg:text-[55px] font-script text-[#ff7eb3] mb-6 transform lg:-rotate-2 origin-left tracking-wide drop-shadow-sm">
            That Stay With You Forever
          </h2>
          <p className="text-[16px] md:text-[17px] text-gray-600 mb-10 max-w-[460px] leading-relaxed font-medium bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
            From corporate workshops to immersive carnivals, we craft exceptional experiences that inspire, engage and bring people together.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-3.5 px-8 rounded-full shadow-floating hover:shadow-soft-hover transform hover:-translate-y-1 transition-all duration-500 flex items-center gap-3 text-[15px]">
              Explore Experiences <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <Link to="/contact" className="bg-white/80 backdrop-blur-md border border-white hover:border-[#4f46e5] hover:text-[#4f46e5] text-brand-navy font-medium py-3.5 px-8 rounded-full shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-500 flex items-center gap-3 text-[15px]">
              Plan an Event <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </Link>
          </div>
        </motion.div>

        {/* ================= FOREGROUND SLIDER ================= */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="w-full lg:w-1/2 relative flex justify-center lg:justify-end mt-10 lg:mt-0">
          <div className="relative w-full max-w-[550px] rounded-[40px] shadow-floating border-[6px] border-white/80 overflow-hidden bg-white/20 backdrop-blur-md aspect-[4/3] group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="flex w-full h-full transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {displaySliderVideos.map((video, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 relative" style={{ flex: "0 0 100%" }}>
                  {/* ADDED key={video} HERE to force React to load the newly fetched video URL */}
                  <video key={video} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" autoPlay loop muted playsInline>
                    <source src={video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {displaySliderVideos.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`} aria-label={`Go to slide ${idx + 1}`} />
              ))}
            </div>
          </div>
          <div className="absolute -bottom-6 -right-2 lg:-bottom-12 lg:-right-6 bg-[#fff9e6] rounded-full w-[130px] h-[130px] lg:w-[150px] lg:h-[150px] flex flex-col items-center justify-center p-4 shadow-floating z-30 border-[6px] border-white transform hover:scale-110 transition-transform duration-500 pointer-events-none">
            <span className="text-pink-400 text-2xl lg:text-3xl mb-1 animate-bounce">💖</span>
            <span className="text-brand-navy font-bold text-[12px] lg:text-[13px] text-center leading-tight">Crafting<br/>Smiles Since<br/>2016</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;