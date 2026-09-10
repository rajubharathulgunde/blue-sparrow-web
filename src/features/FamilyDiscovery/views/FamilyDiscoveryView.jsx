import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';
// import FaqBrochureSection from '../../Home/components/FaqBrochureSection'; // Commented out for now

// ================= REUSABLE NEON STAR =================
const NeonStar = ({ className, color = "rose" }) => {
  const gradients = {
    rose: { stop1: "#fb7185", stop2: "#e11d48" },
    amber: { stop1: "#fbbf24", stop2: "#d97706" },
    pink: { stop1: "#f472b6", stop2: "#db2777" }
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`star-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradients[color].stop1} />
          <stop offset="100%" stopColor={gradients[color].stop2} />
        </linearGradient>
        <filter id={`glow-${color}`}>
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill={`url(#star-${color})`} filter={`url(#glow-${color})`} />
    </svg>
  );
};

// ================= GENTLE FLOATING HEART COMPONENT =================
const FloatingHeart = ({ left, delay, size, duration, color }) => (
  <motion.div
    initial={{ y: "120vh", opacity: 0, scale: size, x: 0 }}
    animate={{ 
      y: "-20vh", 
      opacity: [0, 0.9, 0],
      x: [0, 30, -30, 0] 
    }}
    transition={{ repeat: Infinity, duration: duration, delay: delay, ease: "easeInOut" }}
    className={`absolute z-10 ${color} pointer-events-none drop-shadow-[0_0_15px_currentColor]`}
    style={{ left: `${left}%` }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-12 md:h-12 opacity-80">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </motion.div>
);

const FamilyDiscoveryView = () => {
  const scrollContainerRef = useRef(null);

  // === CMS & DYNAMIC CARDS LOGIC ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCards, setDbCards] = useState([]);
  const [hiddenCards, setHiddenCards] = useState(new Set()); 

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'discovery')
        .order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      const { data: cards } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'discovery')
        .order('created_at', { ascending: true });
      if (cards) setDbCards(cards);
    };

    fetchData();

    const channel1 = supabase.channel('live-discovery-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe();
    const channel2 = supabase.channel('live-discovery-cards').on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450; 
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
        }
      }
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  // Hides empty/broken image cards automatically
  const handleImageError = (cardId) => {
    setHiddenCards(prev => new Set(prev).add(cardId));
  };

  // === FALLBACK DATA FOR SLIDER ===
  const fallbackImages = [
    { id: 1, image_url: "/assets/family-day (1).pdf/1.jpg", title: "Joyful Moments", category: "Connection" },
    { id: 2, image_url: "/assets/family-day (1).pdf/4.jpg", title: "Learning Together", category: "Discovery" },
    { id: 3, image_url: "/assets/family-day (1).pdf/6.jpg", title: "Shared Smiles", category: "Bonding" },
    { id: 4, image_url: "/assets/family-day (1).pdf/5.jpg", title: "Creative Play", category: "Imagination" },
    { id: 5, image_url: "/assets/family-day (1).pdf/2.jpg", title: "Family Challenges", category: "Teamwork" },
  ];

  // Specific custom text for known cards
  const specificCards = [
    { id: 6, title: "Crazy Science Lab", description: "A high-energy world packed with hands-on experiments, safe chemical reactions, and physics challenges families solve together.", image_url: "/assets/family-day (1).pdf/6.jpg", icon: "STEM LEARNING" },
    { id: 4, title: "Artistic Expressions", description: "Collaborative mural painting, clay sculpting, and giant interactive coloring walls where creativity knows no bounds.", image_url: "/assets/family-day (1).pdf/4.jpg", icon: "CREATIVE PLAY" },
    { id: 2, title: "The Great Outdoors", description: "Safe, challenging obstacle courses, mini-golf, and nature-inspired treasure hunts that get the whole family moving.", image_url: "/assets/family-day (1).pdf/2.jpg", icon: "NATURE & ACTION" }
  ];

  // Dynamic Array Generation (Set to 20 maximum, will auto-hide missing ones)
  const TOTAL_LOCAL_IMAGES = 20; 

  const fallbackCards = Array.from({ length: TOTAL_LOCAL_IMAGES }, (_, i) => {
    const cardNum = i + 1;
    const specificMatch = specificCards.find(c => c.id === cardNum);
    
    if (specificMatch) return specificMatch;
    
    return {
      id: cardNum,
      title: `Family Day Experience ${cardNum}`,
      description: "We create safe, engaging, and wonder-filled environments where families can disconnect from the noise and reconnect with each other.",
      image_url: `/assets/family-day (1).pdf/${cardNum}.jpg`,
      icon: "FAMILY FUN"
    };
  });

  const displaySlider = dbGallery.length > 0 ? dbGallery : fallbackImages;
  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;

  // Dynamic color cycling for cards
  const cardColors = [
    { border: 'border-rose-50', bg: 'bg-rose-50', badge: 'text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]', titleHover: 'group-hover:text-rose-500', btnText: 'text-rose-500', btnHover: 'group-hover:text-rose-600' },
    { border: 'border-amber-50', bg: 'bg-amber-50', badge: 'text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]', titleHover: 'group-hover:text-amber-500', btnText: 'text-amber-500', btnHover: 'group-hover:text-amber-600' },
    { border: 'border-pink-50', bg: 'bg-pink-50', badge: 'text-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]', titleHover: 'group-hover:text-pink-500', btnText: 'text-pink-500', btnHover: 'group-hover:text-pink-600' }
  ];

  return (
    <div className="font-sans text-gray-600 bg-[#fffbf7] min-h-screen flex flex-col selection:bg-rose-200 selection:text-brand-navy overflow-x-hidden w-full max-w-[100vw]">
      <Navbar />
      
      {/* ================= FULL SCREEN NEON HERO ================= */}
      <section className="relative w-full min-h-[95vh] flex items-center bg-[#0f172a] flex-grow overflow-hidden">
        
        {/* Full Size Background Image (NO white blur) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/Family.png" 
            alt="Family Bonding" 
            className="w-full h-full object-cover object-[70%_center] md:object-center" 
            onError={(e) => { 
              e.target.style.display = 'none'; 
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-rose-900', 'to-orange-900'); 
            }} 
          />
          {/* Dark gradient strictly on the left to make neon pop without blurring the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent w-full md:w-[65%] lg:w-[60%]"></div>
          {/* Bottom transition into the warm cream page background */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffbf7] to-transparent z-10"></div>
        </div>

        {/* Gently Floating Neon Hearts */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <FloatingHeart left={10} delay={0} size={0.8} duration={12} color="text-rose-400" />
          <FloatingHeart left={45} delay={4} size={1.2} duration={15} color="text-amber-400" />
          <FloatingHeart left={30} delay={8} size={0.6} duration={10} color="text-pink-400" />
        </div>

        {/* Foreground Content - Shifted completely to the left edge */}
        <div className="w-full px-6 sm:px-10 lg:pl-16 xl:pl-24 relative z-20 pt-28 pb-16 flex flex-col justify-center min-h-[95vh]">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="w-full lg:w-[60%] xl:w-[50%] flex flex-col items-start text-left"
          >
            <NeonStar color="amber" className="absolute -top-6 left-[5%] w-8 h-8 animate-pulse opacity-90" />
            <NeonStar color="rose" className="absolute top-[40%] right-[10%] w-5 h-5 animate-pulse opacity-70" />
            
            <span className="text-amber-300 font-bold tracking-[0.2em] uppercase text-[11px] md:text-sm mb-4 block drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]">
              Family Day Experiences
            </span>
            
            {/* Glowing Neon Heading */}
            <h1 className="text-[52px] sm:text-[64px] md:text-[80px] lg:text-[90px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 leading-[1.05] tracking-tight mb-6 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
              Cherish Every <br className="hidden sm:block"/> Beautiful Moment.
            </h1>
            
            <p className="text-[15px] md:text-[17px] text-gray-100 max-w-xl font-medium leading-relaxed drop-shadow-md bg-black/30 p-5 rounded-2xl backdrop-blur-sm border border-white/10 mb-8">
              Life moves fast. We create safe, engaging, and wonder-filled environments where families can disconnect from the noise and reconnect with each other.
            </p>

            <button onClick={() => window.scrollTo({ top: 850, behavior: 'smooth' })} className="mt-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:shadow-[0_0_30px_rgba(244,63,94,0.8)] transform hover:-translate-y-1 transition-all duration-300 text-[15px] tracking-wide border border-rose-300/50 flex items-center gap-3">
              Explore Family Days <span className="text-lg">&rarr;</span>
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* ================= EMOTIONAL VALUES ROW ================= */}
      <section className="py-16 bg-[#fffbf7] relative z-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-rose-50 hover:shadow-[0_10px_30px_rgba(244,63,94,0.15)] transition-all group">
            <div className="w-16 h-16 mx-auto bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-navy mb-3 group-hover:text-rose-600 transition-colors">Deep Bonding</h3>
            <p className="text-[15px] text-gray-500 font-light leading-relaxed">Activities designed specifically to encourage teamwork and laughter between parents and children.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-amber-50 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] transition-all group">
            <div className="w-16 h-16 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-navy mb-3 group-hover:text-amber-600 transition-colors">Shared Discovery</h3>
            <p className="text-[15px] text-gray-500 font-light leading-relaxed">Watch their eyes light up as you explore interactive science, art, and nature worlds together.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-pink-50 hover:shadow-[0_10px_30px_rgba(236,72,153,0.15)] transition-all group">
            <div className="w-16 h-16 mx-auto bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-navy mb-3 group-hover:text-pink-600 transition-colors">Pure Joy</h3>
            <p className="text-[15px] text-gray-500 font-light leading-relaxed">We handle all the planning and stress, leaving you free to simply be present and enjoy the smiles.</p>
          </motion.div>
        </div>
      </section>

      {/* ================= DYNAMIC AUTO IMAGE SLIDER ================= */}
      <section className="py-20 bg-[#fffbf7] relative z-20 border-t border-rose-50/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-end mb-12">
           <div className="relative">
             <NeonStar color="amber" className="absolute -top-4 -left-6 w-5 h-5 animate-pulse opacity-80" />
             <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-2 relative inline-block">
               Memories in the Making
               <div className="absolute bottom-1 left-[-5%] w-[110%] h-3 bg-amber-100 opacity-60 rounded-full rotate-[1deg] z-[-1]"></div>
             </h2>
             <p className="text-gray-500 text-[16px] font-light">Glimpses of families exploring, learning, and laughing.</p>
           </div>
           <div className="flex gap-3 hidden md:flex">
             <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full bg-white border border-rose-100 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>
             <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full bg-white border border-rose-100 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
           </div>
        </div>

        <div ref={scrollContainerRef} className="max-w-[1400px] mx-auto px-6 lg:px-12 flex overflow-x-auto gap-8 pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth relative z-10">
          <AnimatePresence>
            {displaySlider.map((img, i) => {
              if (hiddenCards.has(img.id)) return null;

              return (
                <motion.div layout key={img.id || i} className="min-w-[320px] md:min-w-[480px] h-[300px] md:h-[380px] snap-center group relative rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-gray-100 cursor-pointer border border-white">
                  <img 
                    src={img.image_url || img.src} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                    onError={() => handleImageError(img.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#432c23]/80 via-transparent to-transparent opacity-90"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-bold px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] tracking-widest uppercase inline-block mb-3">
                      {img.category || img.tag || "Discovery"}
                    </span>
                    <h3 className="text-white text-2xl md:text-3xl font-serif font-bold drop-shadow-md">{img.title}</h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= DYNAMIC DISCOVERY WORLDS GRID ================= */}
      <section className="pt-10 pb-32 px-6 lg:px-12 bg-[#fffbf7] relative z-20 border-b border-rose-50/50">
        
        <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] bg-rose-400/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
          <AnimatePresence>
            {displayCards.map((card, i) => {
              if (hiddenCards.has(card.id)) return null;
              
              const color = cardColors[i % 3];

              return (
                <motion.div 
                  layout key={card.id || i}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: (i % 6) * 0.1, ease: "easeOut" }}
                  className={`bg-white rounded-[40px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${color.border} hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col`}
                >
                   <div className={`w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[32px] overflow-hidden relative mb-6 ${color.bg}`}>
                     <img 
                       src={card.image_url} 
                       onError={() => handleImageError(card.id)}
                       alt={card.title} 
                       className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out" 
                     />
                     <span className={`absolute top-5 right-5 bg-white/90 backdrop-blur-md ${color.badge} text-[10px] tracking-wider font-bold px-4 py-2 rounded-full`}>
                       {card.icon || "FAMILY FUN"}
                     </span>
                   </div>
                   <div className="px-2 pb-2 flex-grow flex flex-col">
                     <h3 className={`font-serif font-bold text-brand-navy text-[24px] mb-3 leading-tight ${color.titleHover} transition-colors`}>{card.title}</h3>
                     <p className="text-[14px] md:text-[15px] text-gray-500 mb-6 leading-relaxed flex-grow font-light">{card.description}</p>
                     <button className={`${color.btnText} font-bold text-[14px] uppercase tracking-wider flex items-center gap-2 ${color.btnHover} transition-colors mt-auto drop-shadow-sm`}>
                       Explore World <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                     </button>
                   </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* <FaqBrochureSection pageTheme="discovery" /> */}

      <Footer />
    </div>
  );
};

export default FamilyDiscoveryView;