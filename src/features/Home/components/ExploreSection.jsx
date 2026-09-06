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
      
      {/* Background Doodle Textures (Retained & Expanded) */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fbcfe8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-10 left-10 text-pink-300 text-6xl animate-spin-slow rotate-12"></div>
      <div className="absolute bottom-40 right-10 text-blue-300 text-5xl rotate-[-20deg]"></div>

      {/* Pure CSS background doodles filling empty space */}
      <div className="absolute z-[-1] inset-0 overflow-hidden pointer-events-none">
        {/* Abstract CSS drawn plane/curve at top right */}
        <div className="absolute top-[5%] right-[-10%] w-[30vw] h-[30vw] border-[2px] border-blue-100 rounded-full opacity-40"></div>
        <div className="absolute top-[8%] right-[2%] w-[25vw] h-[25vw] border-[1px] border-dashed border-pink-100 rounded-full opacity-30"></div>
        {/* Bottom Left CSS abstract shape */}
        <div className="absolute bottom-[-10%] left-[-15%] w-[40vw] h-[40vw] bg-pink-50 opacity-20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-5%] left-[5%] w-[20vw] h-[20vw] border-[3px] border-double border-yellow-100 rounded-full opacity-50"></div>
        {/* Abstract CSS curve in center background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vh] border-t-4 border-dashed border-pink-50 opacity-20 rounded-t-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* ================= 1. MASSIVE CURATOR NOTE ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center bg-white p-8 md:p-16 rounded-[40px] shadow-[8px_8px_0px_0px_rgba(244,114,182,0.2)] border-2 border-pink-100 mb-24 relative"
          style={{ borderRadius: '2% 98% 3% 97% / 97% 3% 98% 2%' }}
        >
          {/* Internal Curator Doodles */}
          <div className="absolute -top-6 -right-6 text-yellow-300 text-5xl rotate-12 drop-shadow-md z-10">✨</div>
          <div className="absolute bottom-10 left-10 text-pink-200 text-4xl rotate-[-15deg]">⭐</div>
          {/* Abstract CSS curve pointing to photo */}
          <div className="absolute top-[-20%] left-[-10%] w-32 h-32 border-b-4 border-l-4 border-dashed border-yellow-100 opacity-60 rounded-bl-[60px] pointer-events-none"></div>

          {/* Huge Curator Image Polaroid */}
          <div className="w-full lg:w-1/2 relative shrink-0 z-10">
            <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-white p-4 md:p-6 shadow-lg border border-gray-100 rotate-[-3deg] hover:rotate-0 transition-transform duration-500 rounded-sm relative">
              <div className="w-full h-full overflow-hidden bg-gray-100">
                <img src={displayCurator.image_url} alt="Curator" className="w-full h-full object-cover" onError={(e) => { e.target.src = defaultCurator.image_url; }} />
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-5 bg-red-200/60 rotate-3 backdrop-blur-sm"></div>
            </div>
          </div>

          {/* Huge Note Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left z-10 relative">
            {/* abstract doodle behind text */}
            <div className="absolute inset-0 bg-[#fff9f6] opacity-40 blur-xl z-[-1] rounded-full scale-110"></div>
            
            <h3 className="text-lg md:text-xl font-bold text-gray-400 uppercase tracking-widest mb-6 relative">
              {displayCurator.title}
              {/* highlighter stroke constructed with pure CSS linear gradient */}
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-pink-100 via-yellow-100 to-transparent z-[-1] opacity-60 rounded-full scale-105 origin-left"></div>
            </h3>
            
            <p className="text-3xl md:text-5xl lg:text-[56px] text-[#ec4899] mb-10 leading-[1.2]" style={{ fontFamily: '"Caveat", "Comic Sans MS", cursive', transform: 'rotate(-2deg)' }}>
              "{displayCurator.description}"
            </p>
            
            <p className="font-serif font-bold text-brand-navy text-2xl md:text-3xl relative inline-block mx-auto lg:mx-0">
              {displayCurator.icon}
              {/* Stylized CSS quote mark doodle */}
              <div className="absolute -bottom-6 right-0 text-pink-200 text-7xl font-serif leading-none opacity-50 z-[-1]">’’</div>
            </p>
          </div>
        </motion.div>

        {/* ================= 2. QUICK EXPLORE LINKS (FULL WIDTH GRID) ================= */}
        <div className="mb-24 relative">
          
          {/* abstract doodle behind grid heading */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-blue-50 opacity-30 blur-3xl rounded-full z-0"></div>
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-4 relative inline-block mx-auto">
              Curated Experiences
              {/* CSS highlighter loop sketch under text */}
              <div className="absolute -bottom-3 left-0 w-full h-4 border-b-4 border-yellow-200 rounded-full opacity-60 z-[-1] rotate-[-1deg]"></div>
            </h2>
            <p className="text-gray-500 text-lg font-light">Explore our most popular magical worlds.</p>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            
            {/* CSS confeti doodles scattered between cards */}
            <div className="absolute top-1/2 left-[12%] w-3 h-3 bg-blue-300 rounded-full z-[-1] opacity-70"></div>
            <div className="absolute top-[20%] left-[37%] w-2 h-2 bg-pink-300 rotate-45 z-[-1] opacity-70"></div>
            <div className="absolute bottom-[30%] left-[62%] w-3 h-1 bg-yellow-300 rotate-[15deg] z-[-1] opacity-70"></div>
            <div className="absolute top-[60%] right-[12%] w-2 h-2 bg-emerald-300 rounded-full z-[-1] opacity-70"></div>

            {displayExplore.map((item, i) => (
              <Link 
                to={item.icon?.includes('/') ? item.icon : item.link || "/"}
                key={item.id || i} 
                className={`bg-white p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group border-2 ${i%2 === 0 ? 'border-blue-100 rotate-2' : 'border-yellow-100 -rotate-2'} hover:rotate-0 relative`}
                style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
              >
                {/* CSS corner accents on cards */}
                <div className={`absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 ${i%2===0?'border-blue-50':'border-yellow-50'} opacity-60`}></div>
                <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 ${i%2===0?'border-blue-50':'border-yellow-50'} opacity-60`}></div>
                
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform relative">
                  {/* CSS glowing orb doodle constructed around icon */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-blue-100/50 rounded-full blur-md z-[-1]"></div>
                  {item.icon && !item.icon.includes('/') ? item.icon : '✨'}
                </div>
                <h4 className="font-bold text-xl text-brand-navy mb-2 relative mx-auto">
                  {item.title}
                  {/* CSS abstract doodle constructed under card title */}
                  <div className={`absolute -bottom-1 left-0 w-full h-1 ${i%2===0?'bg-blue-100':'bg-yellow-100'} rounded-full z-[-1]`}></div>
                </h4>
                <p className="text-sm text-gray-500 font-medium">{item.description}</p>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* ================= 3. WORKSHOP TICKETS ================= */}
        <div className="relative">
          
          {/* CSS constructed curve doodle sketched behind header */}
          <div className="absolute -top-10 right-10 w-40 h-40 border-[5px] border-dashed border-emerald-100 rounded-full opacity-50 pointer-events-none z-0"></div>

          <div className="text-center mb-10 relative z-10">
            <span className="text-[#10b981] font-bold tracking-widest uppercase text-sm mb-2 block relative inline-block mx-auto">
              Daily Activities
              {/* CSS highlighter squiggle sketch accent constructed under the label */}
              <div className="absolute -bottom-1 left-0 w-full h-2 border-b-2 border-emerald-200 rounded-full rotate-[-1deg] opacity-60 z-[-1]"></div>
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy">Explore The Workshops</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            
            {/* pure CSS stylized airplane doodles filling empty grid space */}
            <div className="absolute top-[30%] -left-12 lg:-left-20 w-8 h-8 rotate-[-15deg] opacity-60 pointer-events-none">
              <div className="w-8 h-1 bg-pink-200 rounded-full"></div>
              <div className="w-1 h-8 bg-pink-200 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-pink-200 rounded-full"></div>
            </div>
            <div className="absolute bottom-[20%] -right-12 lg:-right-20 w-10 h-6 opacity-60 pointer-events-none">
              <div className="w-full h-full bg-blue-100 rounded-lg"></div>
              <div className="absolute -top-2 left-[20%] w-3 h-3 bg-blue-100 rounded-full"></div>
              <div className="absolute -top-2 right-[20%] w-3 h-3 bg-blue-100 rounded-full"></div>
              <div className="absolute top-1/2 right-[-10px] -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-[10px] border-t-transparent border-b-transparent border-l-blue-100"></div>
            </div>

            <AnimatePresence>
              {displayWorkshops.map((workshop, i) => {
                const details = workshop.description ? workshop.description.split('\n') : [];
                const time = details[0] || "10:00 AM";
                const place = details[1] || "Main Atrium";
                const coordinator = details[2] || "Blue Sparrow Team";
                
                const ticketColors = ['bg-pink-50 border-pink-200', 'bg-blue-50 border-blue-200', 'bg-yellow-50 border-yellow-200'];
                const textColor = ['text-pink-600', 'text-blue-600', 'text-yellow-600'];
                const accentColor = ['border-pink-300', 'border-blue-300', 'border-yellow-300'];
                const colorTheme = ticketColors[i % ticketColors.length];
                const textTheme = textColor[i % textColor.length];
                const borderTheme = accentColor[i % accentColor.length];

                return (
                  <motion.div 
                    layout key={workshop.id || i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative ${colorTheme} border-2 border-dashed ${borderTheme} rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group`}
                  >
                    {/* Tick Cutouts constructs using CSS relative positioning and border-radius */}
                    <div className={`absolute -left-4 top-1/2 w-8 h-8 bg-[#fffdfa] rounded-full transform -translate-y-1/2 border-r-2 border-dashed border-inherit z-10`}></div>
                    <div className={`absolute -right-4 top-1/2 w-8 h-8 bg-[#fffdfa] rounded-full transform -translate-y-1/2 border-l-2 border-dashed border-inherit z-10`}></div>
                    
                    {/* Internal doodles within ticket constructed with pure CSS linear gradient loops */}
                    <div className={`absolute top-2 right-2 w-16 h-16 border-2 border-dashed ${borderTheme} opacity-30 rounded-full scale-110 rotate-[20deg] z-0`}></div>

                    <div className="pl-4 pr-4 z-10">
                      <h4 className="font-serif font-bold text-2xl text-brand-navy mb-4 group-hover:scale-105 transition-transform origin-left relative inline-block mx-auto">
                        {workshop.title}
                        {/* CSS sketched curve loopconstructed under title */}
                        <div className={`absolute -bottom-1 left-0 w-full h-1 ${borderTheme} opacity-60 z-[-1] rounded-full rotate-[-0.5deg]`}></div>
                      </h4>
                      
                      <div className="space-y-3 font-medium text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          {/* native emoji augmented with CSS sketched ring sketch doodle around it */}
                          <span className={`relative w-8 h-8 rounded-full bg-white flex items-center justify-center ${textTheme} z-10`}>
                            <div className={`absolute inset-0 rounded-full border-2 border-dashed ${borderTheme} scale-110 opacity-70 z-[-1]`}></div>
                            ⏰
                          </span>
                          {time}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`relative w-8 h-8 rounded-full bg-white flex items-center justify-center ${textTheme} z-10`}>
                            <div className={`absolute inset-0 rounded-full border-2 border-dashed ${borderTheme} scale-110 opacity-70 z-[-1]`}></div>
                            📍
                          </span>
                          {place}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`relative w-8 h-8 rounded-full bg-white flex items-center justify-center ${textTheme} z-10`}>
                            <div className={`absolute inset-0 rounded-full border-2 border-dashed ${borderTheme} scale-110 opacity-70 z-[-1]`}></div>
                            🙋‍♂️
                          </span>
                          {coordinator}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t-2 border-dashed border-inherit pl-4 flex justify-between items-center z-10 relative">
                      {/* Stylized CSS constructed arrow doodle pointing to button */}
                      <div className={`absolute -top-3 right-20 w-8 h-3 border-r-2 border-b-2 border-dashed ${borderTheme} rounded-br-lg opacity-60 z-[-1] rotate-[-5deg]`}></div>
                      
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest relative mx-auto">
                        Admit One
                        {/* Sketched CSS highlight doodleconstructed over text */}
                        <div className="absolute inset-0 bg-white/60 opacity-60 blur-sm scale-110 z-[-1]"></div>
                      </span>
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