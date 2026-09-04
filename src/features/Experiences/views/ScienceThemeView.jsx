import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';

// === PASTEL SCIENCE BACKGROUND CSS ELEMENTS ===
const FloatingBubble = ({ delay, sizeClass = "w-6 h-6", top, left, right, bottom, color = "bg-blue-200" }) => (
  <motion.div 
    animate={{ y: [0, -30, 0], x: [0, 10, -5, 0], opacity: [0.3, 0.7, 0.3] }} 
    transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute pointer-events-none rounded-full ${color} blur-[1px] ${sizeClass}`}
    style={{ top, left, right, bottom }}
  >
    <div className="absolute top-[15%] left-[20%] w-[20%] h-[20%] bg-white rounded-full opacity-60" />
  </motion.div>
);

const PastelAtom = ({ delay, top, left, right, bottom, scale = 1 }) => (
  <motion.div 
    animate={{ rotate: 360, y: [0, -15, 0] }} 
    transition={{ duration: 15, delay, repeat: Infinity, ease: "linear" }}
    className="absolute pointer-events-none opacity-40"
    style={{ top, left, right, bottom, transform: `scale(${scale})` }}
  >
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div className="w-3 h-3 bg-blue-400 rounded-full z-10" />
      <div className="absolute inset-0 border-2 border-mint-300 rounded-full rotate-45 scale-y-[0.3]" />
      <div className="absolute inset-0 border-2 border-blue-300 rounded-full -rotate-45 scale-y-[0.3]" />
      <div className="absolute inset-0 border-2 border-lavender-300 rounded-full rotate-90 scale-y-[0.3]" />
    </div>
  </motion.div>
);

// === LIGHT PASTEL SCIENCE LOADER ===
const ScienceLoader = () => (
  <motion.div 
    key="science-loader"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    className="fixed inset-0 z-[100] bg-gradient-to-b from-blue-50 via-mint-50 to-white flex flex-col items-center justify-center overflow-hidden"
  >
    <div className="relative w-full h-[300px] flex justify-center items-center">
      <motion.div 
        className="relative z-20 flex flex-col items-center"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-x-4 border-t-4 border-slate-200 rounded-t-lg" />
        <div className="w-24 h-24 border-4 border-slate-200 rounded-b-[40px] rounded-t-xl flex items-end overflow-hidden pb-1 bg-white/50 backdrop-blur-sm">
          <motion.div 
            animate={{ height: ['40%', '75%', '40%'] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-full bg-gradient-to-t from-blue-400 to-mint-300 rounded-b-[36px]"
          />
        </div>
      </motion.div>
      
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute z-10 rounded-full bg-blue-300/60"
          style={{ width: Math.random() * 12 + 4 + 'px', height: Math.random() * 12 + 4 + 'px' }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -150 - Math.random() * 100, x: (Math.random() - 0.5) * 100 }}
          transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </div>
    <motion.div className="mt-2 text-center z-50 relative" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400 font-serif font-bold tracking-widest uppercase text-2xl mb-1">
        Synthesizing!
      </h2>
      <p className="text-slate-400 text-sm font-medium tracking-wide">Preparing the Laboratory...</p>
    </motion.div>
  </motion.div>
);

const ScienceThemeView = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // === CMS STATE FOR GALLERY ===
  const [dbGallery, setDbGallery] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 2000);

    // === FETCH CMS DATA ===
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'science')
        .order('created_at', { ascending: false });
      
      if (data) setDbGallery(data);
    };

    fetchGallery();

    // === REALTIME LISTENER ===
    const channel = supabase.channel('live-science-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, () => {
          fetchGallery(); // Auto-refresh when new images are added via Admin
      })
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  const activities = [
    {
      title: "Exciting Experiments",
      description: "Safe and thrilling science experiments that make kids go WOW!",
      emoji: "🧪", 
      bgColor: "bg-[#f0fdf4]",
      borderColor: "border-[#dcfce7]",
      iconBg: "bg-white"
    },
    {
      title: "STEM Activities",
      description: "Creative STEM-based activities that build skills through fun.",
      emoji: "🧬",
      bgColor: "bg-[#eff6ff]",
      borderColor: "border-[#dbeafe]",
      iconBg: "bg-white"
    },
    {
      title: "Science Art & Crafts",
      description: "Unique crafts and art projects with a scientific twist.",
      emoji: "🎨",
      bgColor: "bg-[#f5f3ff]",
      borderColor: "border-[#ede9fe]",
      iconBg: "bg-white"
    },
    {
      title: "Interactive Games",
      description: "Engaging games that spark curiosity and teamwork.",
      emoji: "🚀",
      bgColor: "bg-[#ecfeff]",
      borderColor: "border-[#cffafe]",
      iconBg: "bg-white"
    },
    {
      title: "Take-Home Learning",
      description: "Kids take home fun experiments and new scientific knowledge!",
      emoji: "💡",
      bgColor: "bg-[#fefce8]",
      borderColor: "border-[#fef9c3]",
      iconBg: "bg-white"
    }
  ];

  const stats = [
    { number: "45,000+", label: "Kids Entertained", emoji: "🧒" },
    { number: "24+", label: "Cities", emoji: "📍" },
    { number: "350+", label: "Events", emoji: "🗓️" },
    { number: "150+", label: "Workshops", emoji: "🎓" }
  ];

  // Hardcoded fallbacks if nothing is in the database
  const fallbackGallery = [
    { id: 1, title: "Volcano Eruption", image_url: "https://images.unsplash.com/photo-1530213786676-4122d1e2e989?auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Slime Making Station", image_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c848?auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Microscope Discoveries", image_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80" },
    { id: 4, title: "Chemical Reactions", image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80" }
  ];

  // Logic: Display database images if they exist, otherwise show fallbacks
  const displayGallery = dbGallery.length > 0 ? dbGallery : fallbackGallery;

  return (
    <div className="font-sans text-[#4a5568] bg-[#fafafa] min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      
      <AnimatePresence>
        {isLoading && <ScienceLoader />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-blue-50/50 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
        <Navbar />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: 1, delay: 0.2 }} className="flex-grow flex flex-col relative">
        
        <div className="absolute top-0 left-0 w-full h-[1200px] overflow-hidden pointer-events-none z-0">
          <img 
            src="/assets/science.png" 
            alt="Science Theme Background" 
            className="absolute top-0 right-0 w-full lg:w-[100%] h-full object-cover object-right-top opacity-100"
            style={{ 
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent w-[65%] h-full"></div>
        </div>

        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <FloatingBubble top="15%" left="10%" sizeClass="w-12 h-12" color="bg-blue-200" delay={0} />
          <FloatingBubble top="35%" right="45%" sizeClass="w-8 h-8" color="bg-mint-200" delay={1.5} />
          <FloatingBubble bottom="40%" left="15%" sizeClass="w-16 h-16" color="bg-lavender-200" delay={0.8} />
          <FloatingBubble bottom="20%" right="50%" sizeClass="w-10 h-10" color="bg-blue-100" delay={2.1} />
          <PastelAtom top="25%" left="45%" scale={0.8} delay={0} />
          <PastelAtom top="60%" left="10%" scale={1.2} delay={2} />
          <PastelAtom top="15%" right="15%" scale={0.6} delay={4} />
        </div>

        <section className="pt-48 lg:pt-56 pb-20 px-6 lg:px-16 relative z-10 max-w-[1500px] mx-auto w-full">
          <div className="w-full lg:w-[48%] flex flex-col items-start relative">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-8 left-8 text-yellow-300 text-2xl">✨</motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="relative inline-flex items-center justify-center px-8 py-2.5 bg-[#93b4fa] rounded-full shadow-sm mb-6 ml-4"
            >
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#7699df] -z-10" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#7699df] -z-10" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>
              <span className="text-white font-serif text-[15px] tracking-wide relative z-10">Explore. Experiment. Celebrate!</span>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              <h1 className="text-[80px] lg:text-[110px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#34d399] leading-[1.05] tracking-tight drop-shadow-sm pb-2">
                Science
              </h1>
              <h2 className="text-[42px] lg:text-[52px] font-serif text-[#1e3a8a] leading-[1.1] mb-6 drop-shadow-sm">
                Birthday Experience
              </h2>
              <p className="text-[19px] text-[#475569] font-light mb-10 max-w-[440px] leading-relaxed">
                Hands-on experiments, exciting activities and a celebration filled with curiosity and wonder.
              </p>
              <Link to="/contact" className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#818cf8] to-[#93c5fd] text-white rounded-full text-lg font-serif transition-all hover:shadow-[0_8px_25px_rgba(129,140,248,0.3)] hover:-translate-y-0.5">
                Plan Your Science Party 
                <span className="ml-3 text-white group-hover:scale-125 transition-transform duration-300">🧪</span>
              </Link>
            </motion.div>
          </div>
        </section>

        <div className="relative w-full z-20 mt-10 lg:mt-24">
          <svg className="w-full h-auto text-white drop-shadow-[0_-10px_20px_rgba(0,0,0,0.02)]" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
          
          <div className="bg-white w-full relative pt-2 pb-20">
            <div className="max-w-[1500px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row gap-10 items-start -mt-16 lg:-mt-24 relative z-30">
              
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
                    <h3 className="text-[17px] font-serif font-bold text-[#1e3a8a] mb-3 leading-tight relative z-10">{item.title}</h3>
                    <p className="text-[13px] text-[#475569] leading-relaxed relative z-10">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full lg:w-[35%] relative mt-10 lg:mt-0"
              >
                <div className="rounded-[40px] border border-[#e0e7ff] bg-gradient-to-br from-[#f8fafc] to-[#f0fdf4] p-10 lg:p-12 text-center relative shadow-[0_15px_50px_rgba(96,165,250,0.06)] overflow-visible">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -left-6 text-4xl">⚛️</motion.div>
                  <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-6 -right-4 text-5xl drop-shadow-md z-20">🔬</motion.div>
                  <h3 className="text-[28px] lg:text-[32px] font-serif text-[#1e3a8a] mb-3 leading-snug">
                    Curiosity today,<br/>Innovation tomorrow.
                  </h3>
                  <p className="text-[22px] lg:text-[24px] font-serif text-[#34d399]">
                    We make learning magical!
                  </p>
                </div>
              </motion.div>
            </div>

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
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-blue-50 text-2xl">
                      {stat.emoji}
                    </div>
                    <div>
                      <h4 className="text-[26px] font-serif font-bold text-[#1e3a8a] leading-none mb-1">{stat.number}</h4>
                      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ================= DYNAMIC CMS GALLERY ================= */}
            <div className="max-w-[1500px] mx-auto px-6 lg:px-16 mt-24 mb-10">
              <div className="text-center mb-16">
                <h2 className="text-[34px] font-serif font-bold text-[#1e3a8a] mb-4 drop-shadow-sm">A Glimpse into the Lab</h2>
                <p className="text-slate-500 text-[16px] max-w-2xl mx-auto font-light">Real moments captured from our hands-on science celebrations, updated live.</p>
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
                      className="group relative rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(96,165,250,0.08)] cursor-pointer h-full"
                    >
                      <div className="w-full aspect-[4/5] bg-blue-50">
                        {/* Uses image_url from Supabase or src from hardcoded fallback */}
                        <img 
                          src={img.image_url || img.src} 
                          alt={img.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/90 via-[#1e3a8a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
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

export default ScienceThemeView;