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

  // ALL 8 CATEGORIES WITH IMAGES
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
    <section className="py-24 lg:py-32 bg-[#f8fafc] relative z-20 overflow-hidden font-sans">
      
      {/* Soft Premium Ambient Glows */}
      <div className="absolute top-[5%] left-[-5%] w-[40vw] h-[40vw] bg-cyan-400/10 blur-[140px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[30vw] h-[30vw] bg-pink-400/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* ================= 1. PREMIUM CURATOR NOTE ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center bg-white p-8 md:p-12 lg:p-16 rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 mb-32 relative"
        >
          {/* Large Clean Image */}
          <div className="w-full lg:w-[40%] relative shrink-0">
            <div className="w-full aspect-square md:aspect-[4/5] bg-slate-100 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] relative border-4 border-white">
              <img 
                src={displayCurator.image_url} 
                alt="Curator" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out" 
                onError={(e) => { e.target.src = defaultCurator.image_url; }} 
              />
            </div>
            {/* Elegant Floating Element */}
            <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
          </div>

          {/* Editorial Quote Text */}
          <div className="w-full lg:w-[60%] flex flex-col justify-center text-center lg:text-left z-10">
            <span className="text-[12px] md:text-[13px] font-bold text-cyan-600 uppercase tracking-[0.2em] mb-6">
              {displayCurator.title}
            </span>
            
            <h3 className="text-[32px] md:text-[42px] lg:text-[48px] text-slate-800 font-serif leading-[1.2] mb-10 tracking-tight">
              "{displayCurator.description}"
            </h3>
            
            <p className="font-sans font-bold text-slate-400 text-lg uppercase tracking-wider">
              — {displayCurator.icon}
            </p>
          </div>
        </motion.div>

        {/* ================= 2. QUICK EXPLORE LINKS (8 ITEMS) ================= */}
        <div className="relative">
          
          <div className="text-center mb-16 relative z-10 flex flex-col items-center">
            <h2 className="text-[36px] md:text-[48px] font-sans font-extrabold text-slate-900 mb-4 tracking-tight">
              Curated Experiences
            </h2>
            <p className="text-slate-500 text-[16px] md:text-[18px] font-medium max-w-2xl">
              Explore our most popular magical worlds, designed meticulously for maximum joy.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
          >
            {displayExplore.map((item, i) => (
              <Link 
                to={item.link || "/"}
                key={item.id || i} 
                className="bg-white p-8 flex flex-col items-center justify-center text-center rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 transform hover:-translate-y-2 transition-all duration-300 group"
              >
                {/* PREMIUM CIRCULAR IMAGE CONTAINER */}
                <div className="w-28 h-28 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 relative shadow-inner p-1 border-2 border-slate-50">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?auto=format&fit=crop&w=500&q=80"; }}
                  />
                </div>

                <h4 className="font-bold text-[20px] text-slate-900 mb-2 leading-tight group-hover:text-cyan-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[14px] text-slate-500 font-medium">
                  {item.description}
                </p>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* ================= 3. WORKSHOP TICKETS (DISABLED FOR NOW) ================= */}
        {/* To re-enable, simply remove the "false && (" at the top and the ")" at the bottom */}
        {false && (
          <div className="relative mt-32">
            <div className="text-center mb-16 relative z-10">
              <span className="text-pink-500 font-bold tracking-[0.2em] uppercase text-[11px] mb-4 block">
                Daily Activities
              </span>
              <h2 className="text-[36px] md:text-[48px] font-sans font-extrabold text-slate-900 tracking-tight">
                Explore The Workshops
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              <AnimatePresence>
                {displayWorkshops.map((workshop, i) => {
                  const details = workshop.description ? workshop.description.split('\n') : [];
                  const time = details[0] || "10:00 AM";
                  const place = details[1] || "Main Atrium";
                  const coordinator = details[2] || "Blue Sparrow Team";
                  
                  // Sleek Gradient Top Bars
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
                      className="relative bg-white rounded-[32px] flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                    >
                      {/* Modern Top Color Bar */}
                      <div className={`w-full h-2 ${gradientBar}`}></div>

                      <div className="p-8 pb-6 flex-grow">
                        <h4 className="font-sans font-bold text-[22px] text-slate-900 mb-6 leading-tight group-hover:scale-[1.02] transition-transform origin-left">
                          {workshop.title}
                        </h4>
                        
                        <div className="space-y-4 font-medium text-[15px] text-slate-600">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center ${iconColor} text-lg shadow-sm border border-slate-100`}>
                              ⏰
                            </div>
                            {time}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center ${iconColor} text-lg shadow-sm border border-slate-100`}>
                              📍
                            </div>
                            {place}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center ${iconColor} text-lg shadow-sm border border-slate-100`}>
                              🙋‍♂️
                            </div>
                            {coordinator}
                          </div>
                        </div>
                      </div>

                      {/* Minimalist Footer */}
                      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center transition-colors group-hover:bg-slate-100/50">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Admit One
                        </span>
                        <Link to="/contact" className={`text-[14px] font-bold ${iconColor} hover:opacity-80 transition-opacity flex items-center gap-1`}>
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