import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';

// === PASTEL PRINCESS BACKGROUND CSS ELEMENTS ===
const FloatingButterfly = ({ delay, top, left, right, bottom, scale = 1 }) => (
  <motion.div 
    animate={{ y: [0, -40, 0], x: [0, 15, -10, 0], rotate: [-5, 10, -5] }} 
    transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    className="absolute pointer-events-none opacity-60 drop-shadow-sm text-2xl"
    style={{ top, left, right, bottom, transform: `scale(${scale})` }}
  >
    🦋
  </motion.div>
);

const PastelSparkle = ({ delay, top, left, right, bottom, scale = 1 }) => (
  <motion.div 
    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3], rotate: [0, 90, 180] }} 
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    className="absolute pointer-events-none"
    style={{ top, left, right, bottom, transform: `scale(${scale})` }}
  >
    <div className="w-6 h-6 bg-yellow-200" style={{ clipPath: 'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)' }} />
    <div className="absolute inset-0 bg-pink-200/50 blur-[3px] scale-150 rounded-full" />
  </motion.div>
);

// === LIGHT PASTEL PRINCESS LOADER ===
const PrincessLoader = () => (
  <motion.div 
    key="princess-loader"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    className="fixed inset-0 z-[100] bg-gradient-to-b from-pink-50 via-[#fff5f8] to-white flex flex-col items-center justify-center overflow-hidden"
  >
    <div className="relative w-full h-[300px] flex justify-center items-center">
      <motion.div 
        className="relative z-20 flex flex-col items-center"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl drop-shadow-[0_10px_20px_rgba(244,114,182,0.3)]"
        >
          👑
        </motion.div>
      </motion.div>
      
      {/* Magical Sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute z-10 rounded-full shadow-sm"
          style={{
            backgroundColor: ['#fde047', '#f472b6', '#fb7185', '#e879f9'][i % 4],
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200 - 50
          }}
          transition={{ duration: 2, delay: Math.random() * 1.5, repeat: Infinity }}
        />
      ))}
    </div>
    <motion.div className="mt-2 text-center z-50 relative" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 font-serif font-bold tracking-widest uppercase text-2xl mb-1">
        Bibbidi Bobbidi Boo!
      </h2>
      <p className="text-pink-300 text-sm font-medium tracking-wide">Preparing the Royal Ball...</p>
    </motion.div>
  </motion.div>
);

const PrincessThemeView = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const activities = [
    {
      title: "Royal Makeovers",
      description: "Glamorous makeovers fit for your little princess.",
      emoji: "🪞", 
      bgColor: "bg-[#fff0f5]", // Very pale blush pink
      borderColor: "border-[#ffe4ed]",
      iconBg: "bg-white"
    },
    {
      title: "Princess Activities",
      description: "Fun games and activities in a magical setting.",
      emoji: "🏰",
      bgColor: "bg-[#f8f5ff]", // Very pale lavender
      borderColor: "border-[#ede4ff]",
      iconBg: "bg-white"
    },
    {
      title: "Royal Crafts",
      description: "Create beautiful crafts to treasure forever.",
      emoji: "🪄",
      bgColor: "bg-[#fff6f0]", // Very pale peach
      borderColor: "border-[#ffe8d6]",
      iconBg: "bg-white"
    },
    {
      title: "Storytime Magic",
      description: "Magical stories that bring fairytales to life.",
      emoji: "📖",
      bgColor: "bg-[#f0f7ff]", // Very pale blue
      borderColor: "border-[#e0f0ff]",
      iconBg: "bg-white"
    },
    {
      title: "Themed Decor",
      description: "Stunning setups straight out of a fairy tale.",
      emoji: "🎀",
      bgColor: "bg-[#f0fff8]", // Very pale mint
      borderColor: "border-[#dcffed]",
      iconBg: "bg-white"
    }
  ];

  const stats = [
    { number: "45,000+", label: "Kids Entertained", emoji: "👸" },
    { number: "24+", label: "Cities", emoji: "📍" },
    { number: "350+", label: "Events", emoji: "✨" },
    { number: "150+", label: "Workshops", emoji: "💖" }
  ];

  const galleryImages = [
    { id: 1, title: "Royal Tea Party", src: "https://images.unsplash.com/photo-1518173434685-6d0dc23f8cb1?auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Crown Making", src: "https://images.unsplash.com/photo-1545622783-b3e021430fee?auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Fairy Tale Decor", src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80" },
    { id: 4, title: "Princess Grand Entrance", src: "https://images.unsplash.com/photo-1558235128-4856f6ce8db5?auto=format&fit=crop&w=800&q=80" }
  ];

  const [dbGallery, setDbGallery] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from('gallery_images').select('*').eq('theme_id', 'princess').order('created_at', { ascending: false });
      if (data) setDbGallery(data);
    };
    fetchGallery();

    const channel = supabase.channel('live-princess-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchGallery)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const displayGallery = dbGallery.length > 0 ? dbGallery : galleryImages;

  return (
    <div className="font-sans text-[#5a4d75] bg-[#fafafa] min-h-screen flex flex-col selection:bg-pink-100 selection:text-pink-900 overflow-x-hidden relative">
      
      <AnimatePresence>
        {isLoading && <PrincessLoader />}
      </AnimatePresence>

      {/* ================= FIXED NAVBAR ================= */}
      {/* Changed to fixed so it stays visible while scrolling! */}
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white/75 backdrop-blur-md border-b border-pink-50/50 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <Navbar />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: 1, delay: 0.2 }} className="flex-grow flex flex-col relative">
        
        {/* ================= EXACT MASTER REFERENCE BACKGROUND ================= */}
        <div className="absolute top-0 left-0 w-full h-[1200px] overflow-hidden pointer-events-none z-0">
          <img 
            src="/assets/Princess.png" 
            alt="Princess Theme Background" 
            className="absolute top-0 right-0 w-full lg:w-[100%] h-full object-cover object-right-top opacity-100"
            style={{ 
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fffbfd] via-[#fffbfd]/90 to-transparent w-[65%] h-full"></div>
        </div>

        {/* ================= FLOATING DECORATIONS ================= */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <FloatingButterfly top="15%" left="10%" scale={1.2} delay={0} />
          <FloatingButterfly top="45%" right="45%" scale={0.8} delay={1.5} />
          <FloatingButterfly bottom="30%" left="15%" scale={1.5} delay={0.8} />
          
          <PastelSparkle top="25%" left="45%" scale={0.8} delay={0} />
          <PastelSparkle top="60%" left="8%" scale={1.2} delay={2} />
          <PastelSparkle top="20%" right="25%" scale={0.6} delay={4} />
          
          {/* Subtle floating crowns */}
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-[35%] left-[30%] opacity-30 text-3xl">👑</motion.div>
        </div>

        {/* ================= HERO SECTION ================= */}
        <section className="pt-48 lg:pt-56 pb-20 px-6 lg:px-16 relative z-10 max-w-[1500px] mx-auto w-full">
          <div className="w-full lg:w-[48%] flex flex-col items-start relative">
            
            {/* Subtle floating sparkles */}
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-8 left-8 text-pink-300 text-2xl">✨</motion.div>

            {/* Pink Ribbon */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="relative inline-flex items-center justify-center px-8 py-2.5 bg-[#fbcfe8] rounded-full shadow-sm mb-6 ml-4"
            >
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f9a8d4] -z-10" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f9a8d4] -z-10" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>
              <span className="text-[#831843] font-serif text-[15px] tracking-wide relative z-10">Step into a world of magic</span>
            </motion.div>
            
            {/* Main Typography */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              <h1 className="text-[80px] lg:text-[110px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] to-[#fb7185] leading-[1.05] tracking-tight drop-shadow-sm pb-2">
                Princess
              </h1>
              <h2 className="text-[42px] lg:text-[52px] font-serif text-[#705275] leading-[1.1] mb-6 drop-shadow-sm">
                Birthday Experience
              </h2>
              
              <p className="text-[19px] text-[#78697a] font-light mb-10 max-w-[440px] leading-relaxed">
                Magical celebrations filled with sparkle, laughter and memories fit for a princess.
              </p>
              
              <Link to="/contact" className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#f472b6] to-[#fda4af] text-white rounded-full text-lg font-serif transition-all hover:shadow-[0_8px_25px_rgba(244,114,182,0.3)] hover:-translate-y-0.5">
                Plan Your Princess Party 
                <span className="ml-3 text-white group-hover:scale-125 transition-transform duration-300">👑</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ================= CLOUD TRANSITION & BOTTOM CONTENT ================= */}
        <div className="relative w-full z-20 mt-10 lg:mt-24">
          <svg className="w-full h-auto text-white drop-shadow-[0_-10px_20px_rgba(0,0,0,0.015)]" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
          
          <div className="bg-white w-full relative pt-2 pb-20">
            <div className="max-w-[1500px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row gap-10 items-start -mt-16 lg:-mt-24 relative z-30">
              
              {/* LEFT SIDE: 5 Arched Activity Cards */}
              <div className="w-full lg:w-[65%] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {activities.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" }}
                    whileHover={{ y: -5 }}
                    className={`${item.bgColor} border ${item.borderColor} rounded-t-[60px] rounded-b-[30px] p-5 pt-8 text-center flex flex-col items-center shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden`}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full blur-[25px] opacity-70 pointer-events-none"></div>
                    <div className={`text-4xl mb-5 w-16 h-16 rounded-full ${item.iconBg} flex items-center justify-center shadow-sm relative z-10`}>
                      {item.emoji}
                    </div>
                    <h3 className="text-[17px] font-serif font-bold text-[#705275] mb-3 leading-tight relative z-10">{item.title}</h3>
                    <p className="text-[13px] text-[#8a7f8d] leading-relaxed relative z-10">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* RIGHT SIDE: Magical Statement Callout */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full lg:w-[35%] relative mt-10 lg:mt-0"
              >
                <div className="rounded-[40px] border border-[#fce7f3] bg-gradient-to-br from-[#fff5f8] to-[#fdf2f8] p-10 lg:p-12 text-center relative shadow-[0_15px_50px_rgba(244,114,182,0.06)] overflow-visible">
                  
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -left-6 text-4xl">🦋</motion.div>
                  <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-6 -right-4 text-5xl drop-shadow-md z-20">🎀</motion.div>
                  
                  <h3 className="text-[28px] lg:text-[32px] font-serif text-[#831843] mb-3 leading-snug">
                    Every little princess<br/>deserves a day<br/>full of magic.
                  </h3>
                  <p className="text-[22px] lg:text-[24px] font-serif text-[#f472b6]">
                    We make it unforgettable.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ================= STATISTICS SECTION ================= */}
            <div className="max-w-[1500px] mx-auto px-6 lg:px-16 mt-16 pb-10">
              <div className="flex flex-wrap items-center justify-start lg:gap-16 gap-8">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.6 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-pink-50 text-2xl">
                      {stat.emoji}
                    </div>
                    <div>
                      <h4 className="text-[26px] font-serif font-bold text-[#831843] leading-none mb-1">{stat.number}</h4>
                      <p className="text-[13px] font-medium text-pink-400 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ================= DYNAMIC CMS GALLERY ================= */}
            <div className="max-w-[1500px] mx-auto px-6 lg:px-16 mt-24 mb-10">
              <div className="text-center mb-16">
                <h2 className="text-[34px] font-serif font-bold text-[#831843] mb-4 drop-shadow-sm">A Glimpse into the Fairytale</h2>
                <p className="text-[#a395a6] text-[16px] max-w-2xl mx-auto font-light">Real moments captured from our magical celebrations, updated live.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {displayGallery.map((img, i) => (
                    <motion.div 
                      layout
                      key={img.id || i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="group relative rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(244,114,182,0.08)] cursor-pointer h-full"
                    >
                      <div className="w-full aspect-[4/5] bg-pink-50">
                        <img src={img.image_url || img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#831843]/80 via-[#831843]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-full p-8 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <h3 className="text-white font-serif text-[22px] leading-snug drop-shadow-md">{img.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

      </motion.div>
      <Footer />
    </div>
  );
};

export default PrincessThemeView;