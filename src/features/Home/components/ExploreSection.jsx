import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const ExploreSection = () => {
  const [exploreLinks, setExploreLinks] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [dbTexts, setDbTexts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Explore Links and Workshops
      const { data } = await supabase
        .from('theme_cards')
        .select('*')
        .in('theme_id', ['home_explore', 'home_workshops'])
        .order('created_at', { ascending: true });

      if (data) {
        setExploreLinks(data.filter(item => item.theme_id === 'home_explore'));
        setWorkshops(data.filter(item => item.theme_id === 'home_workshops'));
      }

      // 2. Fetch Text Blocks for this specific section
      const { data: textData } = await supabase
        .from('website_text')
        .select('*')
        .eq('page_id', 'home');

      if (textData) {
        const textMap = textData.reduce((acc, curr) => ({ ...acc, [curr.text_key]: curr.content }), {});
        setDbTexts(textMap);
      }
    };

    fetchData();

    // Setup Realtime Listeners
    const cardChannel = supabase.channel('live-explore')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData)
      .subscribe();
      
    const textChannel = supabase.channel('live-home-texts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'website_text' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(cardChannel);
      supabase.removeChannel(textChannel);
    };
  }, []);

  // === FALLBACK DATA ===
  const defaultExplore = [
    // ==={ id: 'e1', title: "Mad Science Lab", description: "Potions & Experiments", image_url: "/assets/Science2.png", link: "/theme/science" },
   // ===  { id: 'e2', title: "Wizarding Academy", description: "Spells & Magic", image_url: "/assets/wizarding.png", link: "/theme/wizarding" },
    // === { id: 'e3', title: "Superhero Bootcamp", description: "Action & Obstacles", image_url: "/assets/Superhero.png", link: "/theme/superhero" },
    // === { id: 'e4', title: "Royal Princess", description: "Crowns & Castles", image_url: "/assets/Princess.png", link: "/theme/princess" },
    { id: 'e5', title: "Birthday Parties", description: "Magical Celebrations", image_url: "/assets/Birthday Section.png", link: "/kids-parties" },
    { id: 'e6', title: "Corporate FamilyDays", description: "Team Building, Reimagined", image_url: "/assets/Corporate Family Days.png", link: "/corporate" },
    { id: 'e7', title: "Carnivals", description: "Spectacular Fun", image_url: "/assets/Carnival 1.png", link: "/carnivals" },
    { id: 'e8', title: "Malls & Brands", description: " Activations", image_url: "/assets/Malls and Brands Activites.png", link: "/malls" },
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

  const displayExplore = exploreLinks.length > 0 ? exploreLinks : defaultExplore;
  const displayWorkshops = workshops.length > 0 ? workshops : defaultWorkshops;

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#f8fafc] relative z-20 overflow-hidden font-sans border-t border-gray-100">
      
      {/* Background Glows Scaled for Mobile */}
      <div className="absolute top-[5%] left-[-5%] w-[80vw] h-[80vw] lg:w-[40vw] lg:h-[40vw] bg-cyan-400/10 blur-[80px] lg:blur-[140px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[60vw] h-[60vw] lg:w-[30vw] lg:h-[30vw] bg-pink-400/10 blur-[60px] lg:blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* ================= 1. ABOUT US / FOUNDER SECTION (MODERN PHOTO COLLAGE) ================= */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24 sm:mb-32">
          
          {/* LEFT: Photo Collage */}
          <div className="w-full lg:w-1/2 relative min-h-[350px] sm:min-h-[450px] lg:min-h-[500px]">
            {/* Background decorative blob */}
            <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-blue-100/50 rounded-full blur-3xl pointer-events-none z-0"></div>

            <motion.div 
              initial={{ opacity: 0, x: -30, rotate: -5 }}
              whileInView={{ opacity: 1, x: 0, rotate: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-[10%] left-[5%] w-[70%] h-[75%] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl border-[6px] border-white z-10 bg-gray-100"
            >
              <img 
                src={dbTexts.team_image_1 || "/assets/Team 1.jpg"} 
                alt="Blue Sparrow Team 1" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                onError={(e) => { e.target.src = "/assets/Team 1.jpg"; }} 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute bottom-[5%] right-[5%] w-[65%] h-[65%] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border-[6px] border-white z-20 bg-gray-100"
            >
              <img 
                src={dbTexts.team_image_2 || "/assets/Team 2.jpg"} 
                alt="Blue Sparrow Team 2" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                onError={(e) => { e.target.src = "/assets/Team 2.jpg"; }} 
              />
            </motion.div>
          </div>

          {/* RIGHT: Text Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col justify-center"
          >
            <Link to="/about" className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 font-bold tracking-widest uppercase text-[10px] sm:text-[11px] px-4 py-1.5 rounded-full mb-6 w-fit border border-emerald-100 hover:bg-emerald-100 transition-colors">
              {dbTexts.about_badge || "About Us"}
            </Link>

            <h2 className="text-[32px] sm:text-[42px] lg:text-[48px] font-sans font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
              {dbTexts.about_title || "Bringing Joy to Every Celebration"}
            </h2>

            <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-slate-600 font-medium leading-relaxed mb-6">
              {dbTexts.about_desc_1 || "At Blue Sparrow Events, we believe every child deserves a celebration that sparks wonder and creates lasting memories. With years of experience in event planning, we specialize in transforming ordinary moments into extraordinary adventures."}
            </p>

            <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-slate-600 font-medium leading-relaxed mb-8">
              {dbTexts.about_desc_2 || "Our team of creative professionals is passionate about crafting safe, engaging, and magical experiences that bring families together and create stories worth telling for years to come."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-slate-700 font-bold text-[14px]">Safety First Approach</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-slate-700 font-bold text-[14px]">Creative & Unique Themes</span>
              </div>
            </div>

          </motion.div>
        </div>

        {/* ================= 2. QUICK EXPLORE LINKS ( GRID ON MOBILE) ================= */}
        <div className="relative">
          
          <div className="text-center mb-10 sm:mb-16 relative z-10 flex flex-col items-center">
            <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-sans font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">
              {dbTexts.explore_title || "Curated Experiences"}
            </h2>
            <p className="text-slate-500 text-[14px] sm:text-[16px] md:text-[18px] font-medium max-w-2xl px-2">
              {dbTexts.explore_desc || "Explore our most popular magical worlds, designed meticulously for maximum joy."}
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
                              
                            </div>
                            {time}
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center ${iconColor} text-sm sm:text-lg shadow-sm border border-slate-100`}>
                              
                            </div>
                            {place}
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center ${iconColor} text-sm sm:text-lg shadow-sm border border-slate-100`}>
                              
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