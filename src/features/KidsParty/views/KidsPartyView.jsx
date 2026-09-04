import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';
import FaqBrochureSection from '../../Home/components/FaqBrochureSection';

const KidsPartyView = () => {
  const scrollContainerRef = useRef(null);
  
  // === CMS STATES ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCards, setDbCards] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // === FETCH CMS DATA ===
    const fetchData = async () => {
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'birthday')
        .order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      const { data: cards } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'birthday')
        .order('created_at', { ascending: true });
      if (cards) setDbCards(cards);
    };

    fetchData();

    // === REALTIME LISTENERS ===
    const channel1 = supabase.channel('live-birthday-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData)
      .subscribe();
      
    const channel2 = supabase.channel('live-birthday-cards')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  // Function for manual slider navigation
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto-scroll logic for the image slider
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // === FALLBACK DATA ===
  const fallbackImages = [
    { id: 1, image_url: "/assets/family-day (1).pdf/6.jpg", title: "Astronomy" },
    { id: 2, image_url: "/assets/family-day (1).pdf/4.jpg", title: "Laboratory" },
    { id: 3, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/1.jpg", title: "Celebration" },
    { id: 4, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg", title: "Fun & Games" },
    { id: 5, image_url: "/assets/carnivals 2026.pdf/11.jpg", title: "Sci-Fi Fun" },
  ];

  const fallbackCards = [
    {
      id: 1,
      title: "Frozen Princess Party",
      description: "A magical celebration filled with wonder, creativity, and icy fun! Includes Snow Volcanoes, Wand Making, and Princess Training.",
      image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/3.jpg",
      icon: "MOST POPULAR"
    },
    {
      id: 2,
      title: "Peppa's Muddy Puddles",
      description: "Oink oink! Jump into muddy puddles with Peppa Pig themed sensory bins, craft stations, and a vibrant picnic setup.",
      image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg",
      icon: "TODDLERS"
    },
    {
      id: 3,
      title: "Superhero Academy",
      description: "Calling all heroes! Features an obstacle course, cape designing, and a special graduation ceremony to get their hero licenses.",
      image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/5.jpg",
      icon: "ACTION PACKED"
    }
  ];

  const displaySlider = dbGallery.length > 0 ? dbGallery : fallbackImages;
  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-brand-pink selection:text-brand-navy overflow-hidden">
      <Navbar />
      
      {/* ================= DREAMY HERO SECTION ================= */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 bg-gradient-to-b from-[#e0e7ff] via-[#fce7f3] to-white flex-grow">
        
        {/* Visible Animated Background Clouds */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ x: ["110vw", "-20vw"] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute top-10 opacity-80">
            <svg width="180" height="90" viewBox="0 0 24 24" fill="white"><path d="M17.5 19c-2.485 0-4.5-2.015-4.5-4.5 0-.154.008-.306.023-.456C12.35 13.568 11.698 13.5 11 13.5c-2.485 0-4.5 2.015-4.5 4.5S8.515 22.5 11 22.5h6.5c1.933 0 3.5-1.567 3.5-3.5S19.433 19 17.5 19zM6.5 18c-1.381 0-2.5-1.119-2.5-2.5S5.119 13 6.5 13c.18 0 .356.02.527.056C7.633 11.272 9.406 10 11.5 10c2.485 0 4.5 2.015 4.5 4.5 0 .154-.008.306-.023.456C16.65 14.432 17.302 14.5 18 14.5c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5h-11z"/></svg>
          </motion.div>
          <motion.div animate={{ x: ["110vw", "-20vw"] }} transition={{ repeat: Infinity, duration: 30, ease: "linear", delay: 10 }} className="absolute top-48 scale-150 opacity-60">
            <svg width="180" height="90" viewBox="0 0 24 24" fill="white"><path d="M17.5 19c-2.485 0-4.5-2.015-4.5-4.5 0-.154.008-.306.023-.456C12.35 13.568 11.698 13.5 11 13.5c-2.485 0-4.5 2.015-4.5 4.5S8.515 22.5 11 22.5h6.5c1.933 0 3.5-1.567 3.5-3.5S19.433 19 17.5 19zM6.5 18c-1.381 0-2.5-1.119-2.5-2.5S5.119 13 6.5 13c.18 0 .356.02.527.056C7.633 11.272 9.406 10 11.5 10c2.485 0 4.5 2.015 4.5 4.5 0 .154-.008.306-.023.456C16.65 14.432 17.302 14.5 18 14.5c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5h-11z"/></svg>
          </motion.div>
        </div>

        {/* ================= ANIMATED CURVED RAINBOW ================= */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-end justify-center overflow-hidden pb-10">
          <div className="relative w-full max-w-5xl opacity-40 mix-blend-multiply">
            <svg viewBox="0 0 1000 500" className="w-full h-auto drop-shadow-xl">
              <motion.path d="M 50 500 A 450 450 0 0 1 950 500" stroke="#ef4444" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }} />
              <motion.path d="M 72 500 A 428 428 0 0 1 928 500" stroke="#f97316" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }} />
              <motion.path d="M 94 500 A 406 406 0 0 1 906 500" stroke="#eab308" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }} />
              <motion.path d="M 116 500 A 384 384 0 0 1 884 500" stroke="#22c55e" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }} />
              <motion.path d="M 138 500 A 362 362 0 0 1 862 500" stroke="#3b82f6" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }} />
              <motion.path d="M 160 500 A 340 340 0 0 1 840 500" stroke="#6366f1" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }} />
              <motion.path d="M 182 500 A 318 318 0 0 1 818 500" stroke="#a855f7" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }} />
            </svg>

            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }} transition={{ duration: 1.5, delay: 2.2, repeat: Infinity, repeatDelay: 4 }} className="absolute bottom-0 right-[2%] text-4xl md:text-5xl drop-shadow-md">✨</motion.div>
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }} transition={{ duration: 1.5, delay: 2.4, repeat: Infinity, repeatDelay: 4 }} className="absolute bottom-[10%] right-[10%] text-5xl md:text-6xl drop-shadow-md">🌟</motion.div>
          </div>
        </div>

        {/* CUSTOM DOODLES */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-20 left-[10%]">
             <img src="/assets/unicorn-doodle.png" alt="Unicorn" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg" onError={(e) => e.target.style.display = 'none'} />
          </motion.div>
          <motion.div animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }} className="absolute bottom-10 right-[15%]">
             <img src="/assets/dragon-doodle.png" alt="Dragon" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg" onError={(e) => e.target.style.display = 'none'} />
          </motion.div>
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-10 right-[10%]">
             <img src="/assets/your-custom-sparrow.png" alt="Sparrow" className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-lg" onError={(e) => e.target.style.display = 'none'} />
          </motion.div>
          <div className="absolute bottom-0 left-0 md:left-10 z-20">
             <img src="/assets/tree-birds-doodle.png" alt="Tree Birds" className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-xl" onError={(e) => e.target.style.display = 'none'} />
          </div>
        </div>

        {/* Hero Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto text-center relative z-20 mt-10">
          <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-4 block">Kids Parties</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-navy mb-6 drop-shadow-sm">Magical Birthdays, <br/> Come to Life.</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">From immersive decorations to engaging activities, we turn your child's favorite dreams and stories into unforgettable celebrations.</p>
        </motion.div>
      </section>
      
      {/* ================= DYNAMIC AUTO IMAGE SLIDER ================= */}
      <section className="py-12 bg-white relative z-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-end mb-8">
           <div>
             <h2 className="text-[28px] font-serif font-bold text-brand-navy mb-1">A Glimpse of the Magic</h2>
             <p className="text-gray-500 text-[15px]">Kids enjoying space suits, lab experiments & celebrations!</p>
           </div>
           <div className="flex gap-3 hidden md:flex">
             <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>
             <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
           </div>
        </div>

        <div ref={scrollContainerRef} className="max-w-7xl mx-auto px-6 lg:px-12 flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory scroll-smooth">
          <AnimatePresence>
            {displaySlider.map((img, i) => (
              <motion.div layout key={img.id || i} className="min-w-[280px] md:min-w-[320px] h-[220px] snap-center group relative rounded-3xl overflow-hidden shadow-soft">
                <img 
                  src={img.image_url || img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-pink-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {img.title || img.tag}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= DYNAMIC THEME CARDS GRID ================= */}
      <section className="pt-16 pb-24 px-6 lg:px-12 bg-white relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {displayCards.map((card, i) => (
              <motion.div layout key={card.id || i} className="bg-white rounded-[32px] p-5 shadow-soft border border-gray-50 hover:shadow-soft-hover transition-all duration-500 group flex flex-col">
                 <div className="w-full aspect-[3/4] md:aspect-[9/16] max-h-[500px] rounded-[24px] overflow-hidden relative mb-6 bg-gray-100">
                   <img 
                     src={card.image_url} 
                     alt={card.title} 
                     className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                     onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')} 
                   />
                   <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-pink-500 text-[11px] font-bold px-3 py-1.5 rounded-md shadow-sm">
                     {card.icon || "THEME"}
                   </span>
                 </div>
                 <div className="px-2 pb-2 flex-grow flex flex-col">
                   <h3 className="font-serif font-bold text-brand-navy text-[24px] mb-2 leading-tight">{card.title}</h3>
                   <p className="text-[14px] text-gray-500 mb-6 leading-relaxed flex-grow">{card.description}</p>
                   <button className="text-pink-500 font-semibold text-[14px] flex items-center gap-2 group-hover:text-pink-600 transition-colors mt-auto">
                     View Theme Details <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                   </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
      <FaqBrochureSection pageTheme="birthday" />

      <Footer />
    </div>
  );
};

export default KidsPartyView;