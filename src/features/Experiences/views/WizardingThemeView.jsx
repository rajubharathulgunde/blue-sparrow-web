import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';

// === MAGICAL BACKGROUND CSS ELEMENTS ===
const FloatingStar = ({ delay, sizeClass = "w-4 h-4", top, left, right, bottom }) => (
  <motion.div 
    animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3], rotate: [0, 90, 180] }} 
    transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute pointer-events-none ${sizeClass}`}
    style={{ top, left, right, bottom }}
  >
    <div className="absolute inset-0 bg-amber-200" style={{ clipPath: 'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)' }} />
    <div className="absolute inset-0 bg-yellow-100/50 blur-[3px] scale-150 rounded-full" />
  </motion.div>
);

const GlowingOrb = ({ delay, color = "bg-purple-200", top, left, right, bottom, size="w-64 h-64" }) => (
  <motion.div 
    animate={{ y: [0, 40, 0], x: [0, 20, -20, 0], scale: [1, 1.1, 1] }} 
    transition={{ duration: 10, delay, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute ${size} rounded-full ${color} opacity-40 blur-[80px] pointer-events-none`}
    style={{ top, left, right, bottom }}
  />
);

// === MAGICAL LOADING GATEWAY ===
const MagicalLoader = () => (
  <motion.div 
    key="magic-loader"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    className="fixed inset-0 z-[100] bg-gradient-to-b from-purple-50 via-pink-50 to-white flex flex-col items-center justify-center overflow-hidden"
  >
    <div className="relative w-full h-[400px] flex justify-center items-center">
      <motion.div
        className="absolute z-10 rounded-[100%]"
        style={{
          boxShadow: "0 0 20px #ef4444, 0 0 40px #f97316, 0 0 60px #eab308, 0 0 80px #22c55e, 0 0 100px #3b82f6, 0 0 120px #a855f7",
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)"
        }}
        animate={{ scale: [0, 0, 0.1, 30], opacity: [0, 0, 1, 0], rotate: [0, 0, 90, 180] }}
        transition={{ duration: 2.5, times: [0, 0.5, 0.6, 1], ease: "easeInOut" }}
      />
      <motion.div 
        className="relative z-20 flex flex-col items-center origin-bottom"
        animate={{ rotate: [-30, 45, -20, 20, 0], y: [50, 20, 40, 30, 0], scale: [1, 1, 1, 1, 0] }}
        transition={{ duration: 2.5, times: [0, 0.2, 0.4, 0.6, 0.7], ease: "easeInOut" }}
      >
        <motion.div 
          className="w-4 h-4 bg-yellow-100 rounded-full shadow-[0_0_20px_#fde047] z-30 absolute -top-2"
          animate={{ scale: [1, 1.5, 1, 3, 0], opacity: [0.8, 1, 0.8, 1, 0] }}
          transition={{ duration: 2.5, times: [0, 0.2, 0.4, 0.6, 0.7] }}
        />
        <div className="w-3 h-32 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-lg border-r border-amber-500/50" />
        <div className="w-4 h-12 bg-amber-900 rounded-b-full -mt-2 border-r border-amber-700/50" />
      </motion.div>
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute z-20 rounded-full shadow-sm"
          style={{
            backgroundColor: ['#fde047', '#f472b6', '#38bdf8', '#a855f7'][i % 4],
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400 - 150
          }}
          transition={{ duration: 2, delay: 0.1 + (Math.random() * 0.5), ease: "easeOut" }}
        />
      ))}
    </div>
    <motion.div className="mt-4 text-center z-50 relative" animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }} transition={{ duration: 2.5, times: [0, 0.1, 0.8, 1] }}>
      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-400 font-serif font-bold tracking-widest uppercase text-2xl mb-1">
        Alohomora!
      </h2>
      <p className="text-purple-400 text-sm font-medium tracking-wide">Opening the Magical Gateway...</p>
    </motion.div>
  </motion.div>
);

const WizardingThemeView = () => {
  // === 1. ALL HOOKS SAFELY AT THE TOP ===
  const [isLoading, setIsLoading] = useState(true);
  const [dbGallery, setDbGallery] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 2500);

    // === FETCH CMS DATA ===
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'wizarding')
        .order('created_at', { ascending: false });
      
      if (data) setDbGallery(data);
    };

    fetchGallery();

    // === REALTIME CMS LISTENER ===
    const channel = supabase.channel('live-wizard-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, () => {
          fetchGallery(); 
      })
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  // === FALLBACK DATA ===
  const activities = [
    { title: "Magical Experiments", description: "Amazing science experiments with a magical twist.", emoji: "🔮", bgColor: "bg-[#f4f7fe]", borderColor: "border-[#e0e8f9]" },
    { title: "Wand Making", description: "Create your own magical wand to take home.", emoji: "🪄", bgColor: "bg-[#f0f9fa]", borderColor: "border-[#d8f0f3]" },
    { title: "Potions & Spells", description: "Cook bubbling potions and learn fun spells.", emoji: "🧪", bgColor: "bg-[#f5fbf6]", borderColor: "border-[#e2f3e5]" },
    { title: "Games & Adventures", description: "Exciting games and challenges in the wizarding world.", emoji: "🧙‍♂️", bgColor: "bg-[#fdf7fa]", borderColor: "border-[#f6e5ef]" },
    { title: "Magical Ambience", description: "Themed decor, costumes & magical surprises.", emoji: "🏰", bgColor: "bg-[#f5f8ff]", borderColor: "border-[#e4edff]" }
  ];

  const stats = [
    { number: "45000+", label: "Kids Entertained", emoji: "🧒" },
    { number: "24+", label: "Cities", emoji: "📍" },
    { number: "350+", label: "Events", emoji: "✨" },
    { number: "150+", label: "Workshops", emoji: "📖" }
  ];

  const fallbackGallery = [
    { id: 1, title: "The Great Hall Setup", src: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Wand Selection Ceremony", src: "https://images.unsplash.com/photo-1618944847023-38aa001235f0?auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Mystical Potions Class", src: "https://images.unsplash.com/photo-1574360699252-87063ff394de?auto=format&fit=crop&w=800&q=80" },
    { id: 4, title: "Enchanted Decor", src: "https://images.unsplash.com/photo-1558235128-4856f6ce8db5?auto=format&fit=crop&w=800&q=80" }
  ];

  const displayGallery = dbGallery.length > 0 ? dbGallery : fallbackGallery;

  return (
    <div className="font-sans text-[#4a5568] bg-white min-h-screen flex flex-col selection:bg-purple-100 selection:text-[#5a4d75] overflow-x-hidden relative">
      
      <AnimatePresence>
        {isLoading && <MagicalLoader />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-purple-50/50 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
        <Navbar />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: 1, delay: 0.2 }} className="flex-grow flex flex-col relative">
        
        {/* BACKGROUND */}
        <div className="absolute top-0 left-0 w-full h-[1200px] overflow-hidden pointer-events-none z-0">
          <img 
            src="/assets/wizarding.png" 
            alt="Wizarding Theme Background" 
            className="absolute top-0 right-0 w-full lg:w-[110%] h-full object-cover object-right-top opacity-100"
            style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-[60%] h-full"></div>
        </div>

        {/* BANNER */}
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="absolute top-32 right-12 z-20 hidden lg:flex flex-col items-center">
          <div className="w-40 bg-[#f9f5fa] border border-[#e8dced] shadow-[0_10px_30px_rgba(114,101,147,0.1)] pt-6 pb-10 px-4 text-center relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}>
            <p className="text-[#5a4d75] font-serif text-lg leading-snug">Where<br/>Imagination<br/>Becomes<br/>Magic</p>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-yellow-400 text-lg">✨</span>
          </div>
          <div className="w-1 h-12 bg-gradient-to-b from-[#e8dced] to-transparent -mt-1"></div>
        </motion.div>

        {/* HERO SECTION */}
        <section className="pt-48 lg:pt-56 pb-20 px-6 lg:px-16 relative z-10 max-w-[1500px] mx-auto w-full">
          <div className="w-full lg:w-[45%] flex flex-col items-start relative">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-10 left-10 text-yellow-400 text-2xl">✨</motion.div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-40 -right-12 text-yellow-400 text-3xl">🪄</motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative inline-flex items-center justify-center px-8 py-2.5 bg-[#a394d6] rounded-full shadow-sm mb-8 ml-4">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#8b7abf] -z-10" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#8b7abf] -z-10" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>
              <span className="text-white font-serif text-[15px] tracking-wide relative z-10">Step into a world of wonder</span>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              <h1 className="text-[80px] lg:text-[100px] font-serif font-bold text-[#726593] leading-[1.05] tracking-tight drop-shadow-sm">Wizarding</h1>
              <h2 className="text-[42px] lg:text-[56px] font-serif text-[#726593] leading-[1.1] mb-6 drop-shadow-sm">Birthday Experience</h2>
              <p className="text-[19px] text-[#5a6270] font-light mb-10 max-w-[420px] leading-relaxed">Magical moments, enchanting activities and memories that last a lifetime.</p>
              
              <Link to="/contact" className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#a698d8] to-[#8d7cbf] text-white rounded-full text-lg font-serif transition-all hover:shadow-[0_8px_25px_rgba(114,101,147,0.3)] hover:-translate-y-0.5">
                Plan Your Magical Party 
                <span className="ml-3 text-yellow-200 group-hover:scale-125 transition-transform duration-300">🪄</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* BOTTOM CONTENT */}
        <div className="relative w-full z-20 mt-10 lg:mt-24">
          <svg className="w-full h-auto text-white drop-shadow-[0_-10px_20px_rgba(0,0,0,0.03)]" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
          
          <div className="bg-white w-full relative pt-2 pb-20">
            <div className="max-w-[1500px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row gap-10 items-start -mt-16 lg:-mt-24 relative z-30">
              
              {/* ACTIVITY CARDS */}
              <div className="w-full lg:w-[65%] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {activities.map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" }} whileHover={{ y: -5 }} className={`${item.bgColor} border ${item.borderColor} rounded-t-[60px] rounded-b-[30px] p-5 pt-8 text-center flex flex-col items-center shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full blur-[20px] opacity-60 pointer-events-none"></div>
                    <div className="text-4xl mb-4 relative z-10 drop-shadow-sm">{item.emoji}</div>
                    <h3 className="text-[17px] font-serif font-bold text-[#443b59] mb-3 leading-tight relative z-10">{item.title}</h3>
                    <p className="text-[13px] text-[#6b7280] leading-relaxed relative z-10">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* MAGIC CALLOUT */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="w-full lg:w-[35%] relative mt-10 lg:mt-0">
                <div className="rounded-[40px] border border-[#f3e3e8] bg-gradient-to-br from-[#fef8f9] to-[#f4f2fa] p-10 lg:p-12 text-center relative shadow-[0_15px_50px_rgba(114,101,147,0.06)] overflow-visible">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -left-6 text-3xl">✨</motion.div>
                  <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-8 -right-4 text-5xl drop-shadow-md z-20">📚🎩</motion.div>
                  <motion.div animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-10 -right-10 text-6xl drop-shadow-lg z-20">🕊️</motion.div>
                  <h3 className="text-[28px] lg:text-[34px] font-serif text-[#5a4d75] mb-2 leading-snug">Every child has<br/>a little magic in them.</h3>
                  <p className="text-[22px] lg:text-[26px] font-serif italic text-[#d48296]">We bring it to life.</p>
                </div>
              </motion.div>
            </div>

            {/* STATISTICS */}
            <div className="max-w-[1500px] mx-auto px-6 lg:px-16 mt-16 pb-10">
              <div className="flex flex-wrap items-center justify-start lg:gap-16 gap-8">
                {stats.map((stat, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + (index * 0.1), duration: 0.6 }} className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-50 text-2xl">{stat.emoji}</div>
                    <div>
                      <h4 className="text-[26px] font-serif font-bold text-[#5a4d75] leading-none mb-1">{stat.number}</h4>
                      <p className="text-[13px] font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ================= DYNAMIC CMS GALLERY ================= */}
            <div className="max-w-[1500px] mx-auto px-6 lg:px-16 mt-24 mb-10">
              <div className="text-center mb-16">
                <h2 className="text-[34px] font-serif font-bold text-[#5a4d75] mb-4 drop-shadow-sm">A Glimpse into the Magic</h2>
                <p className="text-gray-500 text-[16px] max-w-2xl mx-auto font-light">Real moments captured from our enchanted celebrations, updated live.</p>
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
                      className="group relative rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(114,101,147,0.08)] cursor-pointer h-full"
                    >
                      <div className="w-full aspect-[4/5] bg-purple-50">
                        {/* Pulls from CMS if available, else local fallback */}
                        <img 
                          src={img.image_url || img.src} 
                          alt={img.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#5a4d75]/90 via-[#5a4d75]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-full p-8 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <h3 className="text-white font-serif text-[22px] leading-snug drop-shadow-md">{img.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 pointer-events-none opacity-40">
              <img src="/assets/floral-doodle.png" alt="" className="w-64 h-auto" onError={(e) => e.target.style.display='none'} />
            </div>

          </div>
        </div>

      </motion.div>
      <Footer />
    </div>
  );
};

export default WizardingThemeView;