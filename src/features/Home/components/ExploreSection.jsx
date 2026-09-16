import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const ExploreSection = () => {
  const [curatorNote, setCuratorNote] = useState(null);
  const [exploreLinks, setExploreLinks] = useState([]);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('theme_cards')
        .select('*')
        .in('theme_id', ['home_curator', 'home_explore', 'home_workshops'])
        .order('created_at', { ascending: true });

      if (data) {
        const curator = data.find(item => item.theme_id === 'home_curator');
        if (curator) setCuratorNote(curator);

        setExploreLinks(data.filter(item => item.theme_id === 'home_explore'));
        setWorkshops(data.filter(item => item.theme_id === 'home_workshops'));
      }
    };

    fetchData();

    const channel = supabase.channel('live-explore')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // === FALLBACK DATA ===
  const defaultCurator = {
    title: "Chief Happiness Officer",
    description: "Every event is a blank canvas. We don't just organize parties; we hand-craft magical worlds where families can disconnect from the noise and reconnect with each other. Come explore with us!",
    image_url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=800&q=80",
    icon: "With Love, Blue Sparrow"
  };

  const defaultExplore = [
    { id: 'e1', title: "Mad Science Lab", description: "Potions & Experiments", image_url: "/assets/Science2.png", link: "/theme/science" },
    { id: 'e2', title: "Wizarding Academy", description: "Spells & Magic", image_url: "/assets/wizarding.png", link: "/theme/wizarding" },
    { id: 'e3', title: "Superhero Bootcamp", description: "Action & Obstacles", image_url: "/assets/Superhero.png", link: "/theme/superhero" },
    { id: 'e4', title: "Royal Princess", description: "Crowns & Castles", image_url: "/assets/Princess.png", link: "/theme/princess" },
    { id: 'e5', title: "Birthday Parties", description: "Magical Celebrations", image_url: "/assets/Birthday Section.png", link: "/kids-parties" },
    { id: 'e6', title: "Corporate Days", description: "Team Building, Reimagined", image_url: "/assets/Corporate Family Days.png", link: "/corporate" },
    { id: 'e7', title: "Carnivals", description: "Spectacular Fun", image_url: "/assets/Carnival 1.png", link: "/carnivals" },
    { id: 'e8', title: "Malls & Brands", description: "High Footfall Activations", image_url: "/assets/Malls and Brands Activites.png", link: "/malls" },
  ];

  const defaultWorkshops = [
    {
      id: 'w1', title: "Tie-Dye Masterclass", 
      description: "Saturday, 10:00 AM\nMain Atrium\nSarah Jenkins" 
    },
    {
      id: 'w2', title: "Slime Lab Workshop", 
      description: "Sunday, 2:00 PM\nDiscovery Center\nDr. Boom"
    }
  ];

  const displayCurator = curatorNote || defaultCurator;
  const displayExplore = exploreLinks.length > 0 ? exploreLinks : defaultExplore;
  const displayWorkshops = workshops.length > 0 ? workshops : defaultWorkshops;

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#f8fafc] relative z-20 overflow-hidden font-sans">
      
      {/* Background Glows Scaled for Mobile */}
      <div className="absolute top-[5%] left-[-5%] w-[80vw] h-[80vw] lg:w-[40vw] lg:h-[40vw] bg-cyan-400/10 blur-[80px] lg:blur-[140px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[60vw] h-[60vw] lg:w-[30vw] lg:h-[30vw] bg-pink-400/10 blur-[60px] lg:blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* ================= 1. PREMIUM CURATOR NOTE (EDITORIAL DESIGN) ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row w-full bg-[#fff6f0] mb-20 sm:mb-32 overflow-hidden shadow-sm rounded-2xl lg:rounded-none"
        >
          {/* LEFT: Geometric Image Container */}
          <div className="w-full lg:w-[35%] relative min-h-[250px] sm:min-h-[350px] lg:min-h-[450px] flex items-end justify-center bg-white lg:bg-transparent">
            
            {/* The bold, angled background shape (Customer.io style) */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[85%] bg-[#f97316] hidden lg:block" 
              style={{ clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 100%)' }}
            ></div>
            
            {/* Image clipped cleanly to match the geometric aesthetic */}
            <div 
              className="relative z-10 w-full h-full lg:w-[90%] lg:h-[90%] overflow-hidden lg:mb-0"
              style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)' }}
            >
              <img 
                src={displayCurator.image_url} 
                alt="Curator" 
                className="w-full h-full object-cover object-center" 
                onError={(e) => { e.target.src = defaultCurator.image_url; }} 
              />
            </div>
          </div>

          {/* RIGHT: Text Content Area */}
          <div className="w-full lg:w-[65%] p-6 sm:p-10 md:p-14 lg:p-20 flex flex-col justify-center bg-[#fff6f0]">
            
            {/* The Top Stats Header */}
            <div className="flex flex-wrap gap-4 sm:gap-8 md:gap-12 mb-8 sm:mb-10 border-b border-orange-200/60 pb-5 sm:pb-6 w-full max-w-xl">
              <div>
                <span className="block text-[22px] sm:text-[28px] font-sans font-bold text-slate-800 leading-tight">500+</span>
                <span className="text-[9px] sm:text-[11px] text-slate-500 uppercase tracking-widest font-bold">Events Delivered</span>
              </div>
              <div className="w-px h-10 sm:h-12 bg-orange-200/60 hidden md:block"></div>
              <div>
                <span className="block text-[22px] sm:text-[28px] font-sans font-bold text-slate-800 leading-tight">100K+</span>
                <span className="text-[9px] sm:text-[11px] text-slate-500 uppercase tracking-widest font-bold">Smiles Crafted</span>
              </div>
            </div>

            <div className="relative">
              {/* Massive Quote Mark - Scaled for mobile */}
              <div className="text-[80px] sm:text-[120px] font-serif leading-none text-slate-800 opacity-10 absolute -top-10 -left-2 sm:-top-16 sm:-left-6 pointer-events-none">
                &ldquo;
              </div>
              
              <h3 className="text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] text-slate-800 font-medium leading-[1.4] mb-8 sm:mb-10 z-10 relative">
                {displayCurator.description}
              </h3>
            </div>
            
            <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between border-t border-transparent pt-4 gap-4 sm:gap-0">
              <div>
                <p className="font-bold text-slate-900 text-[14px] sm:text-[16px] mb-0.5">{displayCurator.icon}</p>
                <p className="text-slate-500 text-[12px] sm:text-[14px] font-medium">{displayCurator.title}</p>
              </div>
              <Link to="/about" className="text-[13px] sm:text-[14px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors w-fit">
                Read our story &rarr;
              </Link>
            </div>
            
          </div>
        </motion.div>

        {/* ================= 2. QUICK EXPLORE LINKS (8 ITEMS - 2 GRID ON MOBILE) ================= */}
        <div className="relative">
          
          <div className="text-center mb-10 sm:mb-16 relative z-10 flex flex-col items-center">
            <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-sans font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">
              Curated Experiences
            </h2>
            <p className="text-slate-500 text-[14px] sm:text-[16px] md:text-[18px] font-medium max-w-2xl px-2">
              Explore our most popular magical worlds, designed meticulously for maximum joy.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            // Forced grid-cols-2 on all small screens before expanding on large screens
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 relative z-10"
          >
            {displayExplore.map((item, i) => (
              <Link 
                to={item.link || "/"}
                key={item.id || i} 
                className="bg-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center rounded-[20px] sm:rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 transform hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 group"
              >
                {/* Image Scaled Down for 2-Grid Mobile Layout */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-slate-50 flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-105 transition-transform duration-500 relative shadow-inner p-1 border-2 border-slate-50">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?auto=format&fit=crop&w=500&q=80"; }}
                  />
                </div>

                <h4 className="font-bold text-[13px] sm:text-[16px] md:text-[20px] text-slate-900 mb-1 sm:mb-2 leading-tight group-hover:text-cyan-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-[12px] md:text-[14px] text-slate-500 font-medium leading-snug">
                  {item.description}
                </p>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* ================= 3. WORKSHOP TICKETS (DISABLED FOR NOW) ================= */}
        {false && (
          <div className="relative mt-20 sm:mt-32">
            <div className="text-center mb-10 sm:mb-16 relative z-10">
              <span className="text-pink-500 font-bold tracking-[0.2em] uppercase text-[9px] sm:text-[11px] mb-3 sm:mb-4 block">
                Daily Activities
              </span>
              <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-sans font-extrabold text-slate-900 tracking-tight">
                Explore The Workshops
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 relative z-10">
              <AnimatePresence>
                {displayWorkshops.map((workshop, i) => {
                  const details = workshop.description ? workshop.description.split('\n') : [];
                  const time = details[0] || "10:00 AM";
                  const place = details[1] || "Main Atrium";
                  const coordinator = details[2] || "Blue Sparrow Team";
                  
                  const gradients = [
                    'bg-gradient-to-r from-cyan-400 to-blue-500', 
                    'bg-gradient-to-r from-pink-400 to-rose-500', 
                    'bg-gradient-to-r from-amber-400 to-orange-500'
                  ];
                  const textColors = ['text-cyan-600', 'text-pink-600', 'text-amber-600'];
                  
                  const gradientBar = gradients[i % gradients.length];
                  const iconColor = textColors[i % textColors.length];

                  return (
                    <motion.div 
                      layout key={workshop.id || i}
                      initial={{ opacity: 0, y: 20 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      viewport={{ once: true }} 
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative bg-white rounded-[24px] sm:rounded-[32px] flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                    >
                      <div className={`w-full h-2 ${gradientBar}`}></div>

                      <div className="p-6 sm:p-8 pb-5 sm:pb-6 flex-grow">
                        <h4 className="font-sans font-bold text-[18px] sm:text-[22px] text-slate-900 mb-4 sm:mb-6 leading-tight group-hover:scale-[1.02] transition-transform origin-left">
                          {workshop.title}
                        </h4>
                        
                        <div className="space-y-3 sm:space-y-4 font-medium text-[13px] sm:text-[15px] text-slate-600">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center ${iconColor} text-sm sm:text-lg shadow-sm border border-slate-100`}>
                              ⏰
                            </div>
                            {time}
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center ${iconColor} text-sm sm:text-lg shadow-sm border border-slate-100`}>
                              📍
                            </div>
                            {place}
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center ${iconColor} text-sm sm:text-lg shadow-sm border border-slate-100`}>
                              🙋‍♂️
                            </div>
                            {coordinator}
                          </div>
                        </div>
                      </div>

                      <div className="px-6 sm:px-8 py-4 sm:py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center transition-colors group-hover:bg-slate-100/50">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Admit One
                        </span>
                        <Link to="/contact" className={`text-[12px] sm:text-[14px] font-bold ${iconColor} hover:opacity-80 transition-opacity flex items-center gap-1`}>
                          Book Spot &rarr;
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ExploreSection;