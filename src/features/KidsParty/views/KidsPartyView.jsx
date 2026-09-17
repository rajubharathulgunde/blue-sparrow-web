import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo'; 
import { supabase } from '../../../lib/supabase';
// import FaqBrochureSection from '../../Home/components/FaqBrochureSection'; 

const KidsPartyView = () => {
  const scrollContainerRef = useRef(null);
  
  // === INTRO ANIMATION STATE ===
  const [showIntro, setShowIntro] = useState(true);

  // === CMS & CARD STATES ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCards, setDbCards] = useState([]);
  const [hiddenCards, setHiddenCards] = useState(new Set()); 
  
  // === DYNAMIC HERO SLIDESHOW STATE ===
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroImages, setHeroImages] = useState([
    "/assets/Birthday Section.png",
    "/assets/Birthday.png"
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Hide rainbow intro after 3.5 seconds
    const introTimer = setTimeout(() => setShowIntro(false), 3500);

    // === FETCH CMS DATA ===
    const fetchData = async () => {
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'birthday')
        .order('created_at', { ascending: false });
        
      if (gallery) {
        setDbGallery(gallery);
        
        // Dynamically pull Hero images from CMS
        const heroes = gallery.filter(g => g.category === 'hero').map(g => g.image_url);
        if (heroes.length > 0) {
          setHeroImages(heroes);
        }
      }

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
      clearTimeout(introTimer);
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  // Update Hero interval dynamically if heroImages changes
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(heroTimer);
  }, [heroImages.length]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 250 : 350;
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const scrollAmount = window.innerWidth < 640 ? 250 : 350;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (cardId) => {
    setHiddenCards(prev => new Set(prev).add(cardId));
  };

  // === FALLBACK DATA ===
  const fallbackImages = [
    { id: 1, image_url: "/assets/family-day (1).pdf/6.jpg", title: "Astronomy" },
    { id: 2, image_url: "/assets/family-day (1).pdf/4.jpg", title: "Laboratory" },
    { id: 3, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/1.jpg", title: "Celebration" },
    { id: 4, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg", title: "Fun & Games" },
    { id: 5, image_url: "/assets/carnivals 2026.pdf/11.jpg", title: "Sci-Fi Fun" },
  ];

  const specificCards = [
    { id: 3, title: "Frozen Princess Party", description: "A magical celebration filled with wonder, creativity, and icy fun! Includes Snow Volcanoes, Wand Making, and Princess Training.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/3.jpg", icon: "MOST POPULAR" },
    { id: 4, title: "Peppa's Muddy Puddles", description: "Oink oink! Jump into muddy puddles with Peppa Pig themed sensory bins, craft stations, and a vibrant picnic setup.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg", icon: "TODDLERS" },
    { id: 5, title: "Superhero Academy", description: "Calling all heroes! Features an obstacle course, cape designing, and a special graduation ceremony to get their hero licenses.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/5.jpg", icon: "ACTION PACKED" }
  ];

  const TOTAL_LOCAL_IMAGES = 18; 
  const fallbackCards = Array.from({ length: TOTAL_LOCAL_IMAGES }, (_, i) => {
    const cardNum = i + 1;
    const specificMatch = specificCards.find(c => c.id === cardNum);
    if (specificMatch) return specificMatch;
    
    return {
      id: cardNum,
      title: `Magical Theme ${cardNum}`,
      description: "An unforgettable, immersive party experience featuring custom decor, engaging games, and non-stop fun for kids of all ages.",
      image_url: `/assets/Bluesparrow_Party_Themes_Catalogue.pdf/${cardNum}.jpg`,
      icon: "PREMIUM THEME"
    };
  });

  // Pull only "glimpse" category items for the slider
  const glimpseImages = dbGallery.filter(g => g.category === 'glimpse' || !g.category);
  const displaySlider = glimpseImages.length > 0 ? glimpseImages : fallbackImages;
  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-brand-pink selection:text-brand-navy overflow-hidden relative">
      
      {/* ================= WELCOME RAINBOW ANIMATION ================= */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            exit={{ opacity: 0, filter: "blur(10px)" }} 
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="relative w-full max-w-2xl px-6 flex items-end justify-center mb-6 sm:mb-8">
              <svg viewBox="0 0 1000 500" className="w-full h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <motion.path d="M 50 500 A 450 450 0 0 1 950 500" stroke="#ef4444" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
                <motion.path d="M 72 500 A 428 428 0 0 1 928 500" stroke="#f97316" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }} />
                <motion.path d="M 94 500 A 406 406 0 0 1 906 500" stroke="#eab308" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} />
                <motion.path d="M 116 500 A 384 384 0 0 1 884 500" stroke="#22c55e" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }} />
                <motion.path d="M 138 500 A 362 362 0 0 1 862 500" stroke="#3b82f6" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }} />
                <motion.path d="M 160 500 A 340 340 0 0 1 840 500" stroke="#6366f1" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} />
                <motion.path d="M 182 500 A 318 318 0 0 1 818 500" stroke="#a855f7" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }} />
              </svg>

              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, repeatDelay: 1 }} className="absolute bottom-[5%] right-[5%] text-2xl sm:text-3xl md:text-5xl drop-shadow-md">✨</motion.div>
              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }} transition={{ duration: 1.5, delay: 1.8, repeat: Infinity, repeatDelay: 1 }} className="absolute bottom-[15%] right-[15%] text-3xl sm:text-4xl md:text-6xl drop-shadow-md">🌟</motion.div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.5, duration: 1 }}
              className="text-white font-serif text-[22px] sm:text-3xl md:text-5xl font-bold mt-[-20px] sm:mt-[-30px] z-10 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-center px-4"
            >
              Welcome to the Magic
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <BrandLogo />
      <Navbar />
      
      {/* ================= FULL SCREEN NEON HERO SECTION ================= */}
      <section className="relative w-full min-h-[95vh] flex items-center bg-[#0f172a] flex-grow overflow-hidden">
        
        {/* Full Screen Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={heroImages[heroIndex]} 
                alt="Magical Birthday Experiences" 
                className="w-full h-full object-cover object-[70%_center] md:object-center"
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent w-full md:w-[70%]"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10"></div>
        </div>

        {/* Foreground Content */}
        <div className="w-full px-5 sm:px-6 lg:pl-12 xl:pl-20 relative z-20 pt-28 sm:pt-28 pb-16 flex flex-col justify-center min-h-[95vh]">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 3.2, ease: "easeOut" }} 
            className="w-full lg:w-[70%] xl:w-[50%] flex flex-col items-start text-left mt-8 sm:mt-0"
          >
            <span className="text-[#06b6d4] font-bold tracking-widest uppercase text-[10px] sm:text-sm mb-3 sm:mb-4 block drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              Kids Parties
            </span>
            
            <h1 className="text-[44px] leading-[1.05] sm:text-6xl md:text-8xl lg:text-[100px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 sm:leading-[1.1] mb-5 sm:mb-6 drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]">
              Magical Birthdays, <br className="hidden md:block"/> Come to Life.
            </h1>
            
            <p className="text-[14px] sm:text-lg text-gray-100 max-w-xl font-medium leading-relaxed drop-shadow-md bg-black/40 sm:bg-black/30 p-4 sm:p-5 rounded-[16px] sm:rounded-2xl backdrop-blur-sm border border-white/10">
              From immersive decorations to engaging activities, we turn your child's favorite dreams and stories into unforgettable celebrations.
            </p>

            <button className="mt-8 sm:mt-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] transform hover:-translate-y-1 transition-all duration-300 text-[14px] sm:text-[16px] tracking-wide border border-pink-300/50">
              Plan a Celebration ✨
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* ================= DYNAMIC AUTO IMAGE SLIDER ================= */}
      <section className="py-10 sm:py-12 bg-white relative z-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-4">
           <div>
             <h2 className="text-[24px] sm:text-[28px] font-serif font-bold text-brand-navy mb-1 leading-tight">A Glimpse of the Magic</h2>
             <p className="text-gray-500 text-[13px] sm:text-[15px]">Kids enjoying space suits, lab experiments & celebrations!</p>
           </div>
           <div className="hidden md:flex gap-3">
             <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>
             <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
           </div>
        </div>

        <div ref={scrollContainerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex overflow-x-auto gap-4 sm:gap-6 pb-6 hide-scrollbar snap-x snap-mandatory scroll-smooth">
          <AnimatePresence>
            {displaySlider.map((img, i) => {
              if (hiddenCards.has(img.id)) return null;

              return (
                <motion.div layout key={img.id || i} className="min-w-[220px] sm:min-w-[280px] md:min-w-[320px] h-[160px] sm:h-[220px] snap-center group relative rounded-[20px] sm:rounded-3xl overflow-hidden shadow-soft">
                  <img 
                    src={img.image_url || img.src} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={() => handleImageError(img.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/90 backdrop-blur-sm text-pink-500 text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {img.title || img.tag || 'Magic'}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= DYNAMIC THEME CARDS GRID (RESPONSIVE MULTI-GRID) ================= */}
      <section className="pt-10 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-12 bg-white relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-10">
          <AnimatePresence>
            {displayCards.map((card, i) => {
              if (hiddenCards.has(card.id)) return null;

              return (
                <motion.div layout key={card.id || i} className="bg-white rounded-[16px] sm:rounded-[32px] p-2.5 sm:p-5 shadow-soft border border-gray-50 hover:shadow-soft-hover transition-all duration-500 group flex flex-col">
                  
                  {/* Image Aspect Box */}
                  <div className="w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[9/16] max-h-[250px] sm:max-h-[500px] rounded-[12px] sm:rounded-[24px] overflow-hidden relative mb-3 sm:mb-6 bg-gray-100">
                    <img 
                      src={card.image_url} 
                      alt={card.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                      onError={() => handleImageError(card.id)}
                    />
                    <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm text-pink-500 text-[8px] sm:text-[11px] font-bold px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-sm">
                      {card.icon || "THEME"}
                    </span>
                  </div>

                  <div className="px-1 sm:px-2 pb-1 sm:pb-2 flex-grow flex flex-col">
                    <h3 className="font-serif font-bold text-brand-navy text-[14px] sm:text-[24px] mb-1 sm:mb-2 leading-tight line-clamp-1 sm:line-clamp-none">
                      {card.title}
                    </h3>
                    
                    <p className="text-[10px] sm:text-[14px] text-gray-500 mb-3 sm:mb-6 leading-relaxed flex-grow line-clamp-3 sm:line-clamp-none">
                      {card.description}
                    </p>
                    
                    <button className="text-pink-500 font-semibold text-[10px] sm:text-[14px] flex items-center gap-1 sm:gap-2 group-hover:text-pink-600 transition-colors mt-auto w-fit">
                      <span className="hidden sm:inline">View Theme Details</span>
                      <span className="sm:hidden">View Details</span> 
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </div>
                  
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KidsPartyView;