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
    { id: 'e1', title: "Mad Science Lab", description: "Potions & Experiments", icon: "🧪", link: "/theme/science" },
    { id: 'e2', title: "Wizarding Academy", description: "Spells & Magic", icon: "⚡", link: "/theme/wizarding" },
    { id: 'e3', title: "Superhero Bootcamp", description: "Action & Obstacles", icon: "🦸‍♂️", link: "/theme/superhero" },
    { id: 'e4', title: "Royal Princess Ball", description: "Crowns & Castles", icon: "👑", link: "/theme/princess" },
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
    <section className="py-24 bg-[#fffdfa] relative z-20 overflow-hidden font-sans">
      
      {/* Background Doodle Textures */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fbcfe8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-10 left-10 text-pink-300 text-6xl animate-spin-slow rotate-12">☀️</div>
      <div className="absolute bottom-40 right-10 text-blue-300 text-5xl rotate-[-20deg]">✏️</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* ================= 1. MASSIVE CURATOR NOTE ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center bg-white p-8 md:p-16 rounded-[40px] shadow-[8px_8px_0px_0px_rgba(244,114,182,0.2)] border-2 border-pink-100 mb-24"
          style={{ borderRadius: '2% 98% 3% 97% / 97% 3% 98% 2%' }}
        >
          {/* Huge Curator Image Polaroid */}
          <div className="w-full lg:w-1/2 relative shrink-0">
            <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-white p-4 md:p-6 shadow-lg border border-gray-100 rotate-[-3deg] hover:rotate-0 transition-transform duration-500 rounded-sm relative">
              <div className="w-full h-full overflow-hidden bg-gray-100">
                <img src={displayCurator.image_url} alt="Curator" className="w-full h-full object-cover" onError={(e) => { e.target.src = defaultCurator.image_url; }} />
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-5 bg-red-200/60 rotate-3 backdrop-blur-sm"></div>
            </div>
          </div>

          {/* Huge Note Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
            <h3 className="text-lg md:text-xl font-bold text-gray-400 uppercase tracking-widest mb-6">{displayCurator.title}</h3>
            <p className="text-3xl md:text-5xl lg:text-[56px] text-[#ec4899] mb-10 leading-[1.2]" style={{ fontFamily: '"Caveat", "Comic Sans MS", cursive', transform: 'rotate(-2deg)' }}>
              "{displayCurator.description}"
            </p>
            <p className="font-serif font-bold text-brand-navy text-2xl md:text-3xl">{displayCurator.icon}</p>
          </div>
        </motion.div>

        {/* ================= 2. QUICK EXPLORE LINKS (FULL WIDTH GRID) ================= */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-4">Curated Experiences</h2>
            <p className="text-gray-500 text-lg font-light">Explore our most popular magical worlds.</p>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayExplore.map((item, i) => (
              <Link 
                to={item.icon?.includes('/') ? item.icon : item.link || "/"}
                key={item.id || i} 
                className={`bg-white p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group border-2 ${i%2 === 0 ? 'border-blue-100 rotate-2' : 'border-yellow-100 -rotate-2'} hover:rotate-0`}
                style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon && !item.icon.includes('/') ? item.icon : '✨'}
                </div>
                <h4 className="font-bold text-xl text-brand-navy mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 font-medium">{item.description}</p>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* ================= 3. WORKSHOP TICKETS ================= */}
        <div>
          <div className="text-center mb-10">
            <span className="text-[#10b981] font-bold tracking-widest uppercase text-sm mb-2 block">Daily Activities</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy">Explore The Workshops</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {displayWorkshops.map((workshop, i) => {
                const details = workshop.description ? workshop.description.split('\n') : [];
                const time = details[0] || "10:00 AM";
                const place = details[1] || "Main Atrium";
                const coordinator = details[2] || "Blue Sparrow Team";
                
                const ticketColors = ['bg-pink-50 border-pink-200', 'bg-blue-50 border-blue-200', 'bg-yellow-50 border-yellow-200'];
                const textColor = ['text-pink-600', 'text-blue-600', 'text-yellow-600'];
                const colorTheme = ticketColors[i % ticketColors.length];
                const textTheme = textColor[i % textColor.length];

                return (
                  <motion.div 
                    layout key={workshop.id || i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative ${colorTheme} border-2 border-dashed rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group`}
                  >
                    <div className="absolute -left-4 top-1/2 w-8 h-8 bg-[#fffdfa] rounded-full transform -translate-y-1/2 border-r-2 border-dashed border-inherit"></div>
                    <div className="absolute -right-4 top-1/2 w-8 h-8 bg-[#fffdfa] rounded-full transform -translate-y-1/2 border-l-2 border-dashed border-inherit"></div>

                    <div className="pl-4 pr-4">
                      <h4 className="font-serif font-bold text-2xl text-brand-navy mb-4 group-hover:scale-105 transition-transform origin-left">{workshop.title}</h4>
                      
                      <div className="space-y-3 font-medium text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${textTheme}`}>⏰</span>
                          {time}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${textTheme}`}>📍</span>
                          {place}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${textTheme}`}>🙋‍♂️</span>
                          {coordinator}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t-2 border-dashed border-inherit pl-4 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admit One</span>
                      <Link to="/contact" className={`text-sm font-bold ${textTheme} hover:underline`}>Book Spot</Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExploreSection;