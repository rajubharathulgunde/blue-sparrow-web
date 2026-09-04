import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';
import FaqBrochureSection from '../../Home/components/FaqBrochureSection';

// ================= GENTLE FLOATING HEART COMPONENT =================
const FloatingHeart = ({ left, delay, size, duration, color }) => (
  <motion.div
    initial={{ y: "120vh", opacity: 0, scale: size, x: 0 }}
    animate={{ 
      y: "-20vh", 
      opacity: [0, 0.8, 0],
      x: [0, 30, -30, 0] // Gentle swaying motion
    }}
    transition={{ repeat: Infinity, duration: duration, delay: delay, ease: "easeInOut" }}
    className={`absolute z-10 ${color} pointer-events-none drop-shadow-md`}
    style={{ left: `${left}%` }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-12 md:h-12 opacity-60">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </motion.div>
);

const FamilyDiscoveryView = () => {
  const scrollContainerRef = useRef(null);

  // === CMS STATES ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCards, setDbCards] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // === FETCH CMS DATA ===
    const fetchData = async () => {
      // Fetch Slider Images
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'discovery')
        .order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      // Fetch Theme Cards
      const { data: cards } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'discovery')
        .order('created_at', { ascending: true });
      if (cards) setDbCards(cards);
    };

    fetchData();

    // === REALTIME LISTENERS ===
    const channel1 = supabase.channel('live-discovery-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData)
      .subscribe();
      
    const channel2 = supabase.channel('live-discovery-cards')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  // Manual Slider Navigation
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450; 
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  // Ultra-smooth, slow auto-scroll for a relaxing feel
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

  // === FALLBACK DATA ===
  const fallbackImages = [
    { id: 1, image_url: "/assets/family-day (1).pdf/1.jpg", title: "Joyful Moments", category: "Connection" },
    { id: 2, image_url: "/assets/family-day (1).pdf/4.jpg", title: "Learning Together", category: "Discovery" },
    { id: 3, image_url: "/assets/family-day (1).pdf/6.jpg", title: "Shared Smiles", category: "Bonding" },
    { id: 4, image_url: "/assets/family-day (1).pdf/5.jpg", title: "Creative Play", category: "Imagination" },
    { id: 5, image_url: "/assets/family-day (1).pdf/2.jpg", title: "Family Challenges", category: "Teamwork" },
  ];

  const fallbackCards = [
    {
      id: 1,
      title: "Crazy Science Lab",
      description: "A high-energy world packed with hands-on experiments, safe chemical reactions, and physics challenges families solve together.",
      image_url: "/assets/family-day (1).pdf/6.jpg",
      icon: "STEM LEARNING"
    },
    {
      id: 2,
      title: "Artistic Expressions",
      description: "Collaborative mural painting, clay sculpting, and giant interactive coloring walls where creativity knows no bounds.",
      image_url: "/assets/family-day (1).pdf/4.jpg",
      icon: "CREATIVE PLAY"
    },
    {
      id: 3,
      title: "The Great Outdoors",
      description: "Safe, challenging obstacle courses, mini-golf, and nature-inspired treasure hunts that get the whole family moving.",
      image_url: "/assets/family-day (1).pdf/2.jpg",
      icon: "NATURE & ACTION"
    }
  ];

  const displaySlider = dbGallery.length > 0 ? dbGallery : fallbackImages;
  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;

  // Dynamic color cycling for cards (Rose -> Amber -> Orange)
  const cardColors = [
    { border: 'border-rose-50', bg: 'bg-rose-50', badge: 'text-rose-500', titleHover: 'group-hover:text-rose-500', btnText: 'text-rose-500', btnHover: 'group-hover:text-rose-600' },
    { border: 'border-amber-50', bg: 'bg-amber-50', badge: 'text-amber-600', titleHover: 'group-hover:text-amber-500', btnText: 'text-amber-500', btnHover: 'group-hover:text-amber-600' },
    { border: 'border-orange-50', bg: 'bg-orange-50', badge: 'text-orange-600', titleHover: 'group-hover:text-orange-500', btnText: 'text-orange-500', btnHover: 'group-hover:text-orange-600' }
  ];

  return (
    <div className="font-sans text-gray-600 bg-[#fffbf7] min-h-screen flex flex-col selection:bg-rose-200 selection:text-brand-navy overflow-hidden">
      <Navbar />
      
      {/* ================= EMOTIONAL FULL-SCREEN HERO ================= */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
        
        {/* Full Screen Image with Soft Light Blending */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/assets/Family.png" 
            alt="Family Bonding" 
            className="w-full h-full object-cover object-center" 
            onError={(e) => e.target.style.display = 'none'} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fffbf7] via-[#fffbf7]/70 to-[#fffbf7]/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/60 to-rose-50/30 mix-blend-overlay"></div>
        </div>

        {/* Breathing Golden Orbs for Emotional Warmth */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} 
            className="absolute top-[20%] left-[10%] w-96 h-96 bg-amber-200/40 rounded-full blur-[100px]"
          ></motion.div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }} 
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }} 
            className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[120px]"
          ></motion.div>
        </div>

        {/* Gently Floating Hearts */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <FloatingHeart left={15} delay={0} size={0.8} duration={12} color="text-rose-300" />
          <FloatingHeart left={85} delay={4} size={1.2} duration={15} color="text-amber-300" />
          <FloatingHeart left={50} delay={8} size={0.6} duration={10} color="text-pink-300" />
          <FloatingHeart left={30} delay={6} size={1} duration={14} color="text-orange-300" />
        </div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="max-w-5xl mx-auto text-center relative z-20 px-6"
        >
          <span className="text-rose-500 font-medium tracking-[0.3em] uppercase text-sm mb-6 block drop-shadow-sm">
            Discover the Magic of Togetherness
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-serif font-bold text-brand-navy mb-8 tracking-tight drop-shadow-md leading-[1.1]">
            Cherish Every <br className="hidden md:block" /> Beautiful Moment.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            Life moves fast. We create safe, engaging, and wonder-filled environments where families can disconnect from the noise and reconnect with each other.
          </p>
        </motion.div>
        
        {/* Soft scalloped cloud divider to transition into the next section smoothly */}
        <div className="absolute -bottom-1 left-0 w-full text-[#fffbf7] z-30">
          <svg viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none" className="w-full h-12 md:h-24"><path d="M0,50 C150,100 250,0 400,50 C550,100 650,20 800,50 C950,80 1100,10 1200,50 L1440,30 L1440,100 L0,100 Z"></path></svg>
        </div>
      </section>
      
      {/* ================= EMOTIONAL VALUES ROW ================= */}
      <section className="py-12 bg-[#fffbf7] relative z-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="w-16 h-16 mx-auto bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-navy mb-2">Deep Bonding</h3>
            <p className="text-sm text-gray-500 font-light">Activities designed specifically to encourage teamwork and laughter between parents and children.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-navy mb-2">Shared Discovery</h3>
            <p className="text-sm text-gray-500 font-light">Watch their eyes light up as you explore interactive science, art, and nature worlds together.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}>
            <div className="w-16 h-16 mx-auto bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-navy mb-2">Pure Joy</h3>
            <p className="text-sm text-gray-500 font-light">We handle all the planning and stress, leaving you free to simply be present and enjoy the smiles.</p>
          </motion.div>
        </div>
      </section>

      {/* ================= DYNAMIC AUTO IMAGE SLIDER ================= */}
      <section className="py-16 bg-[#fffbf7] relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-end mb-10">
           <div>
             <h2 className="text-[32px] font-serif font-bold text-brand-navy mb-2">Memories in the Making</h2>
             <p className="text-gray-500 text-[16px] font-light">Glimpses of families exploring, learning, and laughing.</p>
           </div>
           <div className="flex gap-3 hidden md:flex">
             <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full bg-white border border-rose-100 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-all shadow-sm">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>
             <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full bg-white border border-rose-100 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-all shadow-sm">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
           </div>
        </div>

        <div 
          ref={scrollContainerRef} 
          className="max-w-7xl mx-auto px-6 lg:px-12 flex overflow-x-auto gap-8 pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          <AnimatePresence>
            {displaySlider.map((img, i) => (
              <motion.div layout key={img.id || i} className="min-w-[320px] md:min-w-[480px] h-[300px] md:h-[380px] snap-center group relative rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border border-orange-50">
                <img 
                  src={img.image_url || img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                  onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#432c23]/80 via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wider uppercase inline-block mb-3">
                    {img.category || img.tag || "Discovery"}
                  </span>
                  <h3 className="text-white text-2xl font-serif font-bold drop-shadow-md">{img.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= DYNAMIC DISCOVERY WORLDS GRID ================= */}
      <section className="pt-10 pb-32 px-6 lg:px-12 bg-[#fffbf7] relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {displayCards.map((card, i) => {
              // Cycle through the 3 color palettes based on index
              const color = cardColors[i % 3];

              return (
                <motion.div 
                  layout
                  key={card.id || i}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  className={`bg-white rounded-[40px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${color.border} hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col`}
                >
                   <div className={`w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[32px] overflow-hidden relative mb-6 ${color.bg}`}>
                     <img 
                       src={card.image_url} 
                       onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                       alt={card.title} 
                       className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out" 
                     />
                     <span className={`absolute top-5 right-5 bg-white/90 backdrop-blur-md ${color.badge} text-[11px] font-bold px-4 py-2 rounded-full shadow-sm`}>
                       {card.icon || "FAMILY FUN"}
                     </span>
                   </div>
                   <div className="px-2 pb-2 flex-grow flex flex-col">
                     <h3 className={`font-serif font-bold text-brand-navy text-[26px] mb-3 leading-tight ${color.titleHover} transition-colors`}>{card.title}</h3>
                     <p className="text-[15px] text-gray-500 mb-6 leading-relaxed flex-grow font-light">{card.description}</p>
                     <button className={`${color.btnText} font-semibold text-[15px] flex items-center gap-2 ${color.btnHover} transition-colors mt-auto`}>
                       Explore World <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                     </button>
                   </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
      <FaqBrochureSection pageTheme="discovery" />

      <Footer />
    </div>
  );
};

export default FamilyDiscoveryView;