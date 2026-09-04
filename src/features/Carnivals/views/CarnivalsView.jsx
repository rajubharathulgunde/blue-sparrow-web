import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';

// ================= CSS GEOMETRY COMPONENTS =================

const Firework = ({ left, delay, color1, color2 }) => (
  <div className="absolute bottom-0 z-0" style={{ left }}>
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
          className={`w-3 h-3 rounded-full ${i % 2 === 0 ? color1 : color2} absolute bottom-0 left-0`}
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
  <div className="flex flex-row items-end scale-75 md:scale-100 origin-bottom-left">
    <CssTrainEngine />
    <CssCoach color="bg-purple-500" roofColor="bg-yellow-400" />
    <CssCoach color="bg-green-400" roofColor="bg-pink-500" />
    <CssCoach color="bg-orange-500" roofColor="bg-cyan-400" />
  </div>
);

// ================= NEW: INTERACTIVE LAUNCHING ROCKET =================
const InteractiveRocket = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const navigate = useNavigate();

  const handleLaunch = () => {
    setIsLaunching(true);
    // Wait for the rocket to fly off screen before redirecting
    setTimeout(() => {
      navigate('/contact');
    }, 700);
  };

  return (
    <div onClick={handleLaunch} className="fixed bottom-12 right-6 md:right-12 z-[60] flex flex-col items-center group cursor-pointer">
      
      <motion.div 
        // When launching, it shoots up (-1000px). Otherwise it floats.
        animate={isLaunching ? { y: -1000, scale: 1.1 } : { y: [-8, 8, -8] }} 
        transition={isLaunching ? { duration: 0.7, ease: "easeIn" } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative w-24 h-40 hover:scale-105 transition-transform duration-300"
      >
        {/* Animated Fire Exhaust */}
        <motion.div 
          animate={isLaunching ? { scaleY: [1, 3], opacity: 1 } : { scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={isLaunching ? { duration: 0.5 } : { repeat: Infinity, duration: 0.4 }}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-10 h-16 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 rounded-b-full origin-top filter blur-[2px] z-0"
        ></motion.div>

        {/* Sharp Aerodynamic Fins */}
        <div className="absolute bottom-2 -left-6 w-8 h-16 bg-red-600 rounded-bl-[40px] rounded-tr-md transform -skew-y-12 z-0 border-l-2 border-b-2 border-red-700"></div>
        <div className="absolute bottom-2 -right-6 w-8 h-16 bg-red-600 rounded-br-[40px] rounded-tl-md transform skew-y-12 z-0 border-r-2 border-b-2 border-red-700"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-10 bg-red-700 rounded-t-md z-20"></div>

        {/* Main Rocket Body (Sharp Bullet Curve) */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 rounded-[50%_50%_15%_15%] border-2 border-gray-400 z-10 overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.2)]">
          
          {/* Sharp Red Nose Cone */}
          <div className="absolute top-0 w-full h-14 bg-red-600 border-b-2 border-red-700 rounded-[50%_50%_0_0]"></div>
          
          {/* Window / Porthole */}
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-sky-200 rounded-full border-4 border-gray-400 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] flex justify-center items-end pb-1 overflow-hidden">
            
            {/* CSS Kid inside window */}
            <motion.div 
              animate={isLaunching ? { y: 15 } : { y: [0, -2, 0] }} // Kid sinks down due to G-Force on launch!
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="relative w-10 h-10 bg-[#fcd5ce] rounded-full z-10"
            >
              {/* Hair */}
              <div className="absolute -top-1 left-0 w-10 h-5 bg-amber-800 rounded-t-full"></div>
              
              {/* Eyes (Blinking & Moving side to side) */}
              <div className="absolute top-3.5 left-2 flex gap-1.5">
                <motion.div 
                  animate={isLaunching ? { scaleY: 0.1 } : { scaleY: [1, 1, 0, 1, 1] }} 
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] }}
                  className="w-2.5 h-2.5 bg-white rounded-full flex items-center overflow-hidden"
                >
                  <motion.div animate={{ x: [0, 1.5, -1.5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="w-1.5 h-1.5 bg-black rounded-full"></motion.div>
                </motion.div>
                <motion.div 
                  animate={isLaunching ? { scaleY: 0.1 } : { scaleY: [1, 1, 0, 1, 1] }} 
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] }}
                  className="w-2.5 h-2.5 bg-white rounded-full flex items-center overflow-hidden"
                >
                  <motion.div animate={{ x: [0, 1.5, -1.5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="w-1.5 h-1.5 bg-black rounded-full"></motion.div>
                </motion.div>
              </div>
              
              {/* Mouth */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-red-400 rounded-b-full"></div>
            </motion.div>

            {/* Window Glass Glare */}
            <div className="absolute top-1 -left-1 w-6 h-4 bg-white/60 rounded-full transform -rotate-45 z-20 pointer-events-none"></div>
          </div>
          
          {/* Rocket Body Rivets */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </motion.div>

      {/* Action Text at the bottom */}
      <div className="mt-14 text-white md:text-brand-navy font-bold text-sm tracking-wide bg-brand-navy/60 md:bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg opacity-90 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none border border-white/20">
        Plan an Event <span className="text-yellow-400">🚀</span>
      </div>

    </div>
  );
};

// ================= MAIN VIEW =================

const CarnivalsView = () => {
  const scrollContainerRef = useRef(null);

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
    }, 3500); 
    return () => clearInterval(interval);
  }, []);

  const sliderImages = [
    { id: 1, src: "/assets/carnivals 2026.pdf/1.jpg", title: "Grand Entrance", tag: "Welcome" },
    { id: 2, src: "/assets/carnivals 2026.pdf/10.jpg", title: "The Great Candy Factory", tag: "Sweet Treats" },
    { id: 3, src: "/assets/carnivals 2026.pdf/11.jpg", title: "Alien Missions", tag: "Adventure" },
    { id: 4, src: "/assets/family-day (1).pdf/4.jpg", title: "Lunar Base", tag: "Sci-Fi" },
    { id: 5, src: "/assets/carnivals 2026.pdf/1.jpg", title: "Main Stage", tag: "Entertainment" },
  ];

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-purple-200 selection:text-brand-navy overflow-hidden relative">
      <Navbar />
      
      {/* The Animated Launching Rocket */}
      <InteractiveRocket />

      {/* ================= NIGHTTIME CARNIVAL HERO SECTION ================= */}
      <section className="relative pt-40 pb-32 px-6 lg:px-12 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81] flex-grow overflow-hidden">
        
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <img src="/assets/Carnival.png" alt="Grand Carnival Background" className="w-full h-full object-cover object-bottom" onError={(e) => e.target.style.display = 'none'} />
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Firework left="20%" delay={0} color1="bg-pink-500" color2="bg-yellow-400" />
          <Firework left="45%" delay={1.5} color1="bg-cyan-400" color2="bg-blue-500" />
          <Firework left="75%" delay={0.8} color1="bg-purple-500" color2="bg-fuchsia-400" />
          <Firework left="85%" delay={2.2} color1="bg-yellow-400" color2="bg-orange-500" />
        </div>

        <div className="absolute bottom-16 right-[15%] md:right-[25%] z-20 flex flex-col items-center pointer-events-none">
          <motion.div 
            animate={{ rotate: [-15, 15, -15] }} 
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-48 h-3 bg-amber-500 rounded-full flex justify-between items-end px-4 relative"
            style={{ transformOrigin: "center center" }}
          >
            <div className="w-8 h-8 bg-pink-500 rounded-t-xl border-2 border-white transform translate-y-[-12px] shadow-lg"></div>
            <div className="w-8 h-8 bg-cyan-400 rounded-t-xl border-2 border-white transform translate-y-[-12px] shadow-lg"></div>
          </motion.div>
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-transparent border-b-slate-400 -mt-2"></div>
        </div>

        <motion.div 
          animate={{ x: ["100vw", "-120vw"] }} 
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          className="absolute bottom-6 left-0 z-20 pointer-events-none"
        >
          <FullCssTrain />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto text-center relative z-30 mt-12"
        >
          <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-yellow-300 font-bold tracking-widest uppercase text-sm mb-6 inline-block shadow-lg">
            Step Right Up
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg tracking-tight">
            Immersive Carnivals, <br className="hidden md:block" /> Spectacular Fun.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed bg-black/30 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-2xl">
            Transform any space into a magical wonderland. From alien invasions to massive candy factories, we build grand-scale carnivals that leave families spellbound.
          </p>
        </motion.div>
        
        <div className="absolute -bottom-1 left-0 w-full text-[#f8fafc] z-30">
          <svg viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none" className="w-full h-12 md:h-24"><path d="M0,50 C150,100 250,0 400,50 C550,100 650,20 800,50 C950,80 1100,10 1200,50 L1440,30 L1440,100 L0,100 Z"></path></svg>
        </div>
      </section>
      
      {/* ================= AUTO IMAGE SLIDER ================= */}
      <section className="pt-16 pb-12 bg-[#f8fafc] relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-end mb-10">
           <div>
             <h2 className="text-[32px] font-serif font-bold text-brand-navy mb-2">Carnival Highlights</h2>
             <p className="text-gray-500 text-[16px] font-light">Glimpses of our grand-scale immersive worlds.</p>
           </div>
           <div className="flex gap-3 hidden md:flex">
             <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all shadow-sm">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>
             <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all shadow-sm">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
           </div>
        </div>

        <div 
          ref={scrollContainerRef} 
          className="max-w-7xl mx-auto px-6 lg:px-12 flex overflow-x-auto gap-8 pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {sliderImages.map((img) => (
            <div key={img.id} className="min-w-[320px] md:min-w-[480px] h-[300px] md:h-[380px] snap-center group relative rounded-[32px] overflow-hidden shadow-md bg-gray-100">
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-transparent to-transparent opacity-90"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wider uppercase inline-block mb-3">
                  {img.tag}
                </span>
                <h3 className="text-white text-2xl font-serif font-bold drop-shadow-md">{img.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= THEME CARDS GRID ================= */}
      <section className="pt-10 pb-32 px-6 lg:px-12 bg-[#f8fafc] relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
          >
             <div className="w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[32px] overflow-hidden relative mb-6 bg-purple-50">
               <img 
                 src="/assets/carnivals 2026.pdf/10.jpg" 
                 onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                 alt="The Great Candy Factory" 
                 className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out" 
               />
             </div>
             <div className="px-2 pb-2 flex-grow flex flex-col">
               <h3 className="font-serif font-bold text-brand-navy text-[26px] mb-3 leading-tight group-hover:text-purple-600 transition-colors">The Great Candy Factory</h3>
               <p className="text-[15px] text-gray-500 mb-6 leading-relaxed flex-grow font-light">A colourful factory mission combining sensory discovery, sorting, art and collaborative engineering for the whole family.</p>
               <button className="text-purple-500 font-semibold text-[15px] flex items-center gap-2 group-hover:text-purple-700 transition-colors mt-auto">
                 Explore Carnival <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
               </button>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
          >
             <div className="w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[32px] overflow-hidden relative mb-6 bg-purple-50">
               <img 
                 src="/assets/carnivals 2026.pdf/11.jpg" 
                 onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                 alt="Alien Invasions" 
                 className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out" 
               />
             </div>
             <div className="px-2 pb-2 flex-grow flex flex-col">
               <h3 className="font-serif font-bold text-brand-navy text-[26px] mb-3 leading-tight group-hover:text-purple-600 transition-colors">Alien Invasions</h3>
               <p className="text-[15px] text-gray-500 mb-6 leading-relaxed flex-grow font-light">Step into an extraterrestrial world filled with glowing props, cosmic challenges, and out-of-this-world fun.</p>
               <button className="text-purple-500 font-semibold text-[15px] flex items-center gap-2 group-hover:text-purple-700 transition-colors mt-auto">
                 Explore Carnival <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
               </button>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
          >
             <div className="w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[32px] overflow-hidden relative mb-6 bg-purple-50">
               <img 
                 src="/assets/family-day (1).pdf/4.jpg" 
                 onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                 alt="Lunar Missions" 
                 className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out" 
               />
             </div>
             <div className="px-2 pb-2 flex-grow flex flex-col">
               <h3 className="font-serif font-bold text-brand-navy text-[26px] mb-3 leading-tight group-hover:text-purple-600 transition-colors">Lunar Missions</h3>
               <p className="text-[15px] text-gray-500 mb-6 leading-relaxed flex-grow font-light">Suit up for a journey to the moon! Navigate asteroid fields and experience gravity-defying interactive zones.</p>
               <button className="text-purple-500 font-semibold text-[15px] flex items-center gap-2 group-hover:text-purple-700 transition-colors mt-auto">
                 Explore Carnival <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
               </button>
             </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CarnivalsView;