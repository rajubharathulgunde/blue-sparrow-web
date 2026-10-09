import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

// ================= CSS GEOMETRY COMPONENTS =================

const Firework = ({ left, delay, color1, color2 }) => (
  <div className="absolute bottom-0 z-10" style={{ left }}>
    <motion.div
      animate={{ y: [0, -400], scaleY: [1, 5, 1], opacity: [1, 1, 0] }}
      transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 2.5, ease: "easeOut" }}
      className={`w-2 h-8 ${color1} rounded-full origin-bottom absolute bottom-0 left-0`}
    />
    {[...Array(10)].map((_, i) => {
      const angle = (i * 36 * Math.PI) / 180;
      return (
        <motion.div
          key={i}
          animate={{
            x: [0, Math.cos(angle) * 120],
            y: [0, Math.sin(angle) * 120 - 400],
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.8, delay: delay + 1.1, repeat: Infinity, repeatDelay: 2.9, ease: "easeOut" }}
          className={`w-3 h-3 rounded-full ${i % 2 === 0 ? color1 : color2} absolute bottom-0 left-0 shadow-[0_0_10px_currentColor]`}
        />
      );
    })}
  </div>
);

const CssTrainEngine = () => (
  <div className="relative w-52 h-36">
    <motion.div animate={{ y: [-10, -50], x: [0, 30], opacity: [0.8, 0], scale: [1, 2.5] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} className="absolute top-4 left-16 w-5 h-5 bg-gray-300 rounded-full blur-[2px]" />
    <motion.div animate={{ y: [-10, -60], x: [0, 40], opacity: [0.8, 0], scale: [1, 3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4, ease: "easeOut" }} className="absolute top-4 left-16 w-4 h-4 bg-gray-400 rounded-full blur-[2px]" />
    <motion.div animate={{ y: [-10, -45], x: [0, 25], opacity: [0.8, 0], scale: [1, 2] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.8, ease: "easeOut" }} className="absolute top-4 left-16 w-6 h-6 bg-gray-200 rounded-full blur-[2px]" />

    <div className="absolute bottom-4 left-0 w-full h-24">
      <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-slate-800 border-t-[20px] border-t-transparent z-10"></div>
      <div className="absolute bottom-0 left-4 w-48 h-4 bg-slate-900 rounded-sm shadow-md z-10"></div>
      <div className="absolute bottom-4 left-10 w-24 h-14 bg-gradient-to-b from-blue-400 to-blue-700 rounded-l-3xl border-2 border-slate-800 z-10"></div>
      <div className="absolute bottom-4 left-16 w-2 h-14 bg-yellow-400 border-x border-yellow-600 z-10 shadow-sm"></div>
      <div className="absolute bottom-4 left-26 w-2 h-14 bg-yellow-400 border-x border-yellow-600 z-10 shadow-sm"></div>
      <div className="absolute bottom-16 left-14 w-6 h-10 bg-gradient-to-r from-red-500 to-red-800 border-2 border-slate-800 z-0">
         <div className="absolute -top-2 -left-2 w-10 h-3 bg-yellow-400 rounded-sm border border-slate-800 shadow-sm"></div>
      </div>
      <div className="absolute bottom-4 left-32 w-20 h-20 bg-gradient-to-b from-red-500 to-red-800 border-2 border-slate-800 z-10 flex justify-center pt-3 shadow-md">
         <div className="w-10 h-10 bg-cyan-200 border-2 border-slate-800 rounded-t-full shadow-inner"></div>
      </div>
      <div className="absolute bottom-24 left-30 w-24 h-4 bg-yellow-400 rounded-lg border-2 border-slate-800 z-20 shadow-md"></div>
    </div>

    <div className="absolute bottom-0 left-0 w-full h-10 z-20">
      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="absolute bottom-0 left-8 w-10 h-10 bg-red-500 rounded-full border-[3px] border-slate-900 flex items-center justify-center shadow-md">
         <div className="w-0.5 h-full bg-slate-900 absolute"></div><div className="w-full h-0.5 bg-slate-900 absolute"></div><div className="w-2 h-2 bg-yellow-400 rounded-full border border-slate-900 z-30"></div>
      </motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="absolute bottom-0 left-20 w-10 h-10 bg-red-500 rounded-full border-[3px] border-slate-900 flex items-center justify-center shadow-md">
         <div className="w-0.5 h-full bg-slate-900 absolute"></div><div className="w-full h-0.5 bg-slate-900 absolute"></div><div className="w-2 h-2 bg-yellow-400 rounded-full border border-slate-900 z-30"></div>
      </motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.68, ease: "linear" }} className="absolute -bottom-2 left-34 w-14 h-14 bg-red-500 rounded-full border-[4px] border-slate-900 flex items-center justify-center shadow-md">
         <div className="w-0.5 h-full bg-slate-900 absolute"></div><div className="w-full h-0.5 bg-slate-900 absolute"></div><div className="w-0.5 h-full bg-slate-900 absolute rotate-45"></div><div className="w-full h-0.5 bg-slate-900 absolute rotate-45"></div><div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-slate-900 z-30"></div>
      </motion.div>
    </div>
  </div>
);

const CssCoach = ({ color, roofColor }) => (
  <div className="relative w-32 h-36 ml-3">
    <div className="absolute bottom-[22px] -left-4 w-5 h-2 bg-slate-800 z-0"></div>
    <div className="absolute bottom-4 left-0 w-full h-4 bg-slate-900 rounded-sm shadow-md z-10"></div>
    <div className={`absolute bottom-8 left-0 w-full h-16 ${color} border-2 border-slate-800 flex items-center justify-evenly z-10`}>
       <div className="relative w-8 h-10 bg-cyan-100 border-2 border-slate-800 flex items-center justify-center">
         <div className="w-full h-0.5 bg-slate-800 absolute"></div><div className="w-0.5 h-full bg-slate-800 absolute"></div>
       </div>
       <div className="relative w-8 h-10 bg-cyan-100 border-2 border-slate-800 flex items-center justify-center">
         <div className="w-full h-0.5 bg-slate-800 absolute"></div><div className="w-0.5 h-full bg-slate-800 absolute"></div>
       </div>
    </div>
    <div className={`absolute bottom-24 -left-1 w-[136px] h-4 ${roofColor} border-2 border-slate-800 rounded-t-md z-20 shadow-md`}></div>
    <div className="absolute bottom-0 left-0 w-full h-10 z-20 flex justify-around">
      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="w-10 h-10 bg-red-500 rounded-full border-[3px] border-slate-900 flex items-center justify-center shadow-md">
         <div className="w-0.5 h-full bg-slate-900 absolute"></div><div className="w-full h-0.5 bg-slate-900 absolute"></div><div className="w-2 h-2 bg-yellow-400 rounded-full border border-slate-900 z-30"></div>
      </motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="w-10 h-10 bg-red-500 rounded-full border-[3px] border-slate-900 flex items-center justify-center shadow-md">
         <div className="w-0.5 h-full bg-slate-900 absolute"></div><div className="w-full h-0.5 bg-slate-900 absolute"></div><div className="w-2 h-2 bg-yellow-400 rounded-full border border-slate-900 z-30"></div>
      </motion.div>
    </div>
  </div>
);

const FullCssTrain = () => (
  <div className="flex flex-row items-end scale-[0.5] sm:scale-75 md:scale-100 origin-bottom-left">
    <CssTrainEngine />
    <CssCoach color="bg-purple-500" roofColor="bg-yellow-400" />
    <CssCoach color="bg-green-400" roofColor="bg-pink-500" />
    <CssCoach color="bg-orange-500" roofColor="bg-cyan-400" />
  </div>
);

// ================= MAIN VIEW =================

const CarnivalsView = () => {
  const scrollContainerRef = useRef(null);

  // === CMS STATES & DYNAMIC LOGIC ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCaseStudies, setDbCaseStudies] = useState([]);
  const [dbBlogs, setDbBlogs] = useState([]);
  const [hiddenCards, setHiddenCards] = useState(new Set()); 

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      // Fetch Gallery Highlights (Preserving old 'carnival' theme_id)
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'carnival')
        .order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      // Fetch Case Studies (Connected to new admin 'carnivals' theme_id)
      const { data: caseStudies } = await supabase
        .from('case_studies')
        .select('*')
        .eq('theme_id', 'carnivals')
        .order('created_at', { ascending: false });
      if (caseStudies) setDbCaseStudies(caseStudies);

      // Fetch Blogs (Connected to new admin 'carnivals' theme_id)
      const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .eq('theme_id', 'carnivals')
        .order('created_at', { ascending: false });
      if (blogs) setDbBlogs(blogs);
    };

    fetchData();

    // Realtime listeners
    const channels = [
      supabase.channel('live-carnival-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe(),
      supabase.channel('live-carnival-cases').on('postgres_changes', { event: '*', schema: 'public', table: 'case_studies' }, fetchData).subscribe(),
      supabase.channel('live-carnival-blogs').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchData).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 250 : 450; 
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const scrollAmount = window.innerWidth < 640 ? 250 : 450;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500); 
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (cardId, type = "card") => {
    setHiddenCards(prev => new Set(prev).add(`${type}-${cardId}`));
  };

  // === FALLBACK DATA ===
  const fallbackImages = [
    { id: 1, src: "/assets/carnivals 2026.pdf/1.jpg", title: "Grand Entrance", tag: "Welcome" },
    { id: 2, src: "/assets/carnivals 2026.pdf/10.jpg", title: "The Great Candy Factory", tag: "Sweet Treats" },
    { id: 3, src: "/assets/carnivals 2026.pdf/11.jpg", title: "Alien Missions", tag: "Adventure" },
    { id: 4, src: "/assets/family-day (1).pdf/4.jpg", title: "Lunar Base", tag: "Sci-Fi" },
    { id: 5, src: "/assets/carnivals 2026.pdf/1.jpg", title: "Main Stage", tag: "Entertainment" },
  ];

  const fallbackCaseStudies = [
    { id: 1, title: "The Mega Winter Carnival", description: "How we transformed a standard field into an immersive winter wonderland featuring 20+ interactive zones and hosting over 2,000 attendees.", image_url: "/assets/carnivals 2026.pdf/10.jpg", icon: "MEGA EVENT" },
    { id: 2, title: "School Foundation Day Festival", description: "A seamless execution of a multi-sensory carnival spanning art, science, and physical challenges for a premier school's milestone celebration.", image_url: "/assets/carnivals 2026.pdf/11.jpg", icon: "SCHOOL EVENT" }
  ];

  const fallbackBlogs = [
    { id: 1, title: "5 Secrets to Managing Large Crowds", description: "Discover our proven strategies for keeping lines moving and attendees engaged at massive carnival events.", image_url: "/assets/carnivals 2026.pdf/4.jpg", icon: "EVENT TIPS", date: "Oct 9, 2026" },
    { id: 2, title: "Why Themed Zones Beat Standard Stalls", description: "Learn why creating immersive worlds generates higher engagement than traditional isolated carnival games.", image_url: "/assets/carnivals 2026.pdf/1.jpg", icon: "TRENDS", date: "Sep 28, 2026" },
    { id: 3, title: "Weather-Proofing Your Carnival", description: "Essential contingency planning tips to ensure your outdoor mega-event shines regardless of the forecast.", image_url: "/assets/family-day (1).pdf/4.jpg", icon: "GUIDE", date: "Sep 15, 2026" }
  ];

  const displaySlider = dbGallery.length > 0 ? dbGallery : fallbackImages;
  const displayCaseStudies = dbCaseStudies.length > 0 ? dbCaseStudies : fallbackCaseStudies;
  const displayBlogs = dbBlogs.length > 0 ? dbBlogs : fallbackBlogs;

  return (
    <div className="font-sans text-gray-600 bg-[#f8fafc] min-h-screen flex flex-col selection:bg-purple-200 selection:text-brand-navy overflow-hidden relative">
      <BrandLogo />
      <Navbar />

      {/* ================= FULL-LENGTH CARNIVAL HERO SECTION ================= */}
      <section className="relative min-h-[95vh] flex items-center bg-[#0f172a] flex-grow overflow-hidden">
        
        {/* Full Size Crisp Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/Carnival 1.png" 
            alt="Grand Carnival Background" 
            className="w-full h-full object-cover object-[70%_center] md:object-center" 
            onError={(e) => { 
              e.target.style.display = 'none'; 
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-900', 'to-purple-900'); 
            }} 
          />
          {/* Subtle dark gradient strictly on the left to ensure neon text pops while keeping image clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/60 to-transparent w-full md:w-[70%] lg:w-[55%]"></div>
        </div>

        {/* Animated Fireworks */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <Firework left="20%" delay={0} color1="bg-pink-500" color2="bg-yellow-400" />
          <Firework left="45%" delay={1.5} color1="bg-cyan-400" color2="bg-blue-500" />
          <Firework left="75%" delay={0.8} color1="bg-purple-500" color2="bg-fuchsia-400" />
          <Firework left="85%" delay={2.2} color1="bg-yellow-400" color2="bg-orange-500" />
        </div>

        {/* CSS Train traversing the bottom */}
        <motion.div 
          animate={{ x: ["100vw", "-120vw"] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute bottom-6 left-0 z-20 pointer-events-none"
        >
          <FullCssTrain />
        </motion.div>

        {/* Foreground Content - Left Aligned to edge */}
        <div className="w-full px-5 sm:px-6 lg:pl-12 xl:pl-20 relative z-30 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} 
            className="w-full lg:w-[60%] xl:w-[50%] flex flex-col items-start text-left pt-24 sm:pt-20 mt-4 sm:mt-0"
          >
            <span className="bg-white/10 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/20 text-yellow-300 font-bold tracking-widest uppercase text-[10px] sm:text-sm mb-4 sm:mb-6 inline-block shadow-lg">
              Step Right Up
            </span>
            
            {/* Glowing Neon Heading */}
            <h1 className="text-[40px] sm:text-[52px] md:text-[80px] lg:text-[84px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 leading-[1.05] tracking-tight mb-4 sm:mb-6 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
              Immersive Carnivals, <br className="hidden md:block" /> Spectacular Fun.
            </h1>
            
            <p className="text-[14px] sm:text-[15px] md:text-[17px] text-gray-100 max-w-xl font-medium leading-relaxed drop-shadow-md bg-black/50 md:bg-black/40 p-4 sm:p-5 rounded-[16px] sm:rounded-2xl backdrop-blur-sm border border-white/10 mb-6 sm:mb-8">
              Transform any space into a magical wonderland. From alien invasions to massive candy factories, we build grand-scale carnivals that leave families spellbound.
            </p>

            <button onClick={() => window.scrollTo({ top: 850, behavior: 'smooth' })} className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transform hover:-translate-y-1 transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide border border-purple-300/50 flex items-center gap-2 sm:gap-3">
              Explore Our Work <span className="text-[16px] sm:text-lg">🎪</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom Curve Detail to transition into the next section smoothly */}
        <div className="absolute -bottom-1 left-0 w-full text-[#f8fafc] z-30 pointer-events-none">
          <svg viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none" className="w-full h-8 sm:h-12 md:h-24"><path d="M0,50 C150,100 250,0 400,50 C550,100 650,20 800,50 C950,80 1100,10 1200,50 L1440,30 L1440,100 L0,100 Z"></path></svg>
        </div>
      </section>

      {/* Ambient Background Globs for Liquid Glass effect in content sections */}
      <div className="fixed top-1/3 -right-32 w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 -left-32 w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 pointer-events-none z-0"></div>
      
      {/* ================= AUTO IMAGE SLIDER ================= */}
      <section className="pt-10 sm:pt-16 pb-10 sm:pb-12 relative z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-10 gap-4">
           <div>
             <h2 className="text-[26px] sm:text-[32px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-1 sm:mb-2 leading-tight">Carnival Highlights</h2>
             <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">Glimpses of our grand-scale immersive worlds.</p>
           </div>
           <div className="hidden md:flex gap-3">
             <button onClick={() => scroll(-1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/60 backdrop-blur-md border border-white flex items-center justify-center text-gray-500 hover:bg-white hover:text-purple-600 transition-all shadow-sm">
               <span className="text-xl">&larr;</span>
             </button>
             <button onClick={() => scroll(1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/60 backdrop-blur-md border border-white flex items-center justify-center text-gray-500 hover:bg-white hover:text-purple-600 transition-all shadow-sm">
               <span className="text-xl">&rarr;</span>
             </button>
           </div>
        </div>

        <div 
          ref={scrollContainerRef} 
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex overflow-x-auto gap-4 sm:gap-8 pb-8 sm:pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {displaySlider.map((img, i) => {
            if (hiddenCards.has(`glimpse-${img.id}`)) return null;

            return (
              <div key={img.id || i} className="min-w-[240px] sm:min-w-[320px] md:min-w-[480px] h-[200px] sm:h-[300px] md:h-[380px] snap-center group relative rounded-[20px] sm:rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] cursor-pointer">
                <img 
                  src={img.image_url || img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out p-1 sm:p-2 rounded-[20px] sm:rounded-[32px]" 
                  onError={() => handleImageError(img.id, "glimpse")}
                />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/70 backdrop-blur-md border border-white/80 p-3 sm:p-5 rounded-[16px] sm:rounded-[24px] shadow-sm transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-purple-600 font-bold text-[9px] sm:text-[11px] uppercase tracking-widest mb-1 block">
                    {img.tag || img.category || "Highlight"}
                  </span>
                  <h3 className="text-[#1e293b] text-[16px] sm:text-[20px] md:text-[24px] font-serif font-bold leading-tight">{img.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CASE STUDIES SECTION (LIQUID GLASS) ================= */}
      <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#1e293b] mb-2">Carnival Success Stories</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">See how we engineer magic for crowds of all sizes.</p>
            </div>
            <Link to="/portfolio/case-studies" className="hidden sm:inline-flex text-purple-600 font-bold hover:text-pink-600 transition-colors items-center gap-2 text-[15px]">
              View All Studies <span>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence>
              {displayCaseStudies.map((study, i) => {
                if (hiddenCards.has(`study-${study.id}`)) return null;
                return (
                  <motion.div 
                    layout 
                    key={study.id || i} 
                    className="flex flex-col sm:flex-row bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:bg-white/60 rounded-[24px] overflow-hidden group transition-all duration-500 p-2 sm:p-3"
                  >
                    <div className="w-full sm:w-[45%] h-56 sm:h-auto overflow-hidden relative shrink-0 rounded-[18px]">
                      <img 
                        src={study.image_url} 
                        alt={study.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                        onError={() => handleImageError(study.id, "study")}
                      />
                    </div>
                    <div className="w-full sm:w-[55%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                      <span className="text-purple-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2 inline-block">
                        {study.icon || "CASE STUDY"}
                      </span>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#1e293b] mb-3 leading-tight">
                        {study.title}
                      </h3>
                      <p className="text-gray-500 font-light text-[13px] sm:text-[14px] leading-relaxed line-clamp-3 mb-6">
                        {study.description}
                      </p>
                      <Link to="/contact" className="inline-flex items-center gap-2 text-[#1e293b] font-bold hover:text-purple-600 transition-colors w-fit text-[13px] sm:text-[14px] mt-auto">
                        Read Report <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= BLOGS SECTION (LIQUID GLASS) ================= */}
      <section className="pt-10 pb-24 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#1e293b] mb-2">Event Planning Insights</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">Tips and inspiration for your next large-scale event.</p>
            </div>
            <Link to="/contact" className="hidden sm:inline-flex text-purple-600 font-bold hover:text-pink-600 transition-colors items-center gap-2 text-[15px]">
              View All Articles <span>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence>
              {displayBlogs.map((blog, i) => {
                if (hiddenCards.has(`blog-${blog.id}`)) return null;
                return (
                  <motion.div 
                    layout 
                    key={blog.id || i} 
                    className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:bg-white/60 rounded-[24px] overflow-hidden group transition-all duration-500 flex flex-col p-2 sm:p-2.5"
                  >
                    <div className="w-full aspect-[4/3] overflow-hidden relative shrink-0 rounded-[18px]">
                      <img 
                        src={blog.image_url} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                        onError={() => handleImageError(blog.id, "blog")}
                      />
                    </div>
                    
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] sm:text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                          {blog.icon || "ARTICLE"}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400">{blog.date || "Recent"}</span>
                      </div>
                      
                      <h3 className="text-[18px] sm:text-[20px] font-serif font-bold text-[#1e293b] mb-3 line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-500 font-light text-[13px] sm:text-[14px] mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {blog.description}
                      </p>
                      
                      <Link to="/contact" className="text-[13px] sm:text-[14px] font-bold text-[#1e293b] group-hover:text-purple-600 transition-colors flex items-center gap-1 mt-auto w-fit">
                        Read Article <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link to="/contact" className="inline-flex text-purple-600 font-bold hover:text-pink-600 transition-colors items-center gap-2 text-[14px]">
              View All Articles <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CarnivalsView;