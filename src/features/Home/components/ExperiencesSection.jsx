import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

// Reusable SVG Star Doodle
const StarDoodle = ({ className, color = "#fcd34d" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill={color} />
  </svg>
);

// Reusable SVG Paperclip
const Paperclip = () => (
  <svg width="20" height="40" viewBox="0 0 24 48" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-sm">
    <path d="M12 36V10c0-3.3 2.7-6 6-6s6 2.7 6 6v24c0 5.5-4.5 10-10 10S4 39.5 4 34V12"/>
  </svg>
);

const ExperiencesSection = () => {
  const [dbCards, setDbCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const { data } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'home')
        .order('created_at', { ascending: true });
      if (data) setDbCards(data);
    };

    fetchCards();
    const channel = supabase.channel('live-home-cards').on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchCards).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const fallbackCards = [
    { title: "Birthdays", description: "Magical Celebrations", icon: "🎂", color: "pink" },
    { title: "Corporate", description: "Family Days", icon: "👥", color: "blue" },
    { title: "Mall & Retail", description: "Activations", icon: "🛍️", color: "green" },
    { title: "Schools & Colleges", description: "Interactive Programs", icon: "🎓", color: "purple" },
    { title: "Realtor & Society", description: "Community Events", icon: "🏢", color: "orange" },
    { title: "Carnivals & Festivals", description: "Large Scale Experiences", icon: "🎪", color: "pink-dark" },
  ];

  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;

  // Exact glow and color mapping for the pills
  const colorMap = {
    'pink': { textTitle: 'text-[#f472b6]', shadow: 'shadow-[0_8px_20px_rgba(244,114,182,0.12)] border-pink-50 hover:border-pink-100' },
    'blue': { textTitle: 'text-[#3b82f6]', shadow: 'shadow-[0_8px_20px_rgba(59,130,246,0.12)] border-blue-50 hover:border-blue-100' },
    'green': { textTitle: 'text-[#10b981]', shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.12)] border-emerald-50 hover:border-emerald-100' },
    'purple': { textTitle: 'text-[#a855f7]', shadow: 'shadow-[0_8px_20px_rgba(168,85,247,0.12)] border-purple-50 hover:border-purple-100' },
    'orange': { textTitle: 'text-[#f59e0b]', shadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.12)] border-orange-50 hover:border-orange-100' },
    'pink-dark': { textTitle: 'text-[#e11d48]', shadow: 'shadow-[0_8px_20px_rgba(225,29,72,0.12)] border-rose-50 hover:border-rose-100' },
  };

  return (
    <section className="py-20 lg:py-28 bg-white relative z-20 overflow-hidden font-sans border-b border-gray-50">
      
      {/* 
        Using CSS Grid here completely solves the overlapping issue. 
        It forces the collage and the text into two strict, non-overlapping columns.
      */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* ================= LEFT: 4 Polaroid Collage ================= */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative w-full">
          
          {/* Constrained Aspect-Square Box prevents images from blowing up and overlapping */}
          <div className="relative w-full max-w-[500px] mx-auto aspect-square">
            
            <div className="absolute top-[2%] left-[2%] w-[48%] aspect-[4/3] bg-white p-2 shadow-lg rounded-xl transform -rotate-6 z-10 border border-gray-100">
              <div className="absolute -top-5 left-[60%] transform -translate-x-1/2 z-50 rotate-12"><Paperclip /></div>
              <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" alt="Corporate" className="w-full h-full object-cover rounded-md" />
            </div>
            
            <div className="absolute top-[10%] right-[2%] w-[48%] aspect-[4/3] bg-white p-2 shadow-lg rounded-xl transform rotate-4 z-20 border border-gray-100">
              <div className="absolute -top-5 left-[30%] transform -translate-x-1/2 z-50 -rotate-6"><Paperclip /></div>
              <img src="https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=600&q=80" alt="Festival" className="w-full h-full object-cover rounded-md" />
            </div>

            <div className="absolute bottom-[5%] left-[8%] w-[45%] aspect-square bg-white p-2 shadow-xl rounded-xl transform rotate-[-4deg] z-30 border border-gray-100">
              <img src="https://images.unsplash.com/photo-1560523159-4a9692d222f9?auto=format&fit=crop&w=600&q=80" alt="Kids Event" className="w-full h-full object-cover rounded-md" />
            </div>

            <div className="absolute bottom-[0%] right-[6%] w-[50%] aspect-[4/3] bg-white p-2 shadow-2xl rounded-xl transform rotate-[6deg] z-40 border border-gray-100">
               <img src="https://images.unsplash.com/photo-1530021544433-289542f53cb4?auto=format&fit=crop&w=600&q=80" alt="Happy Girl" className="w-full h-full object-cover rounded-md" />
            </div>

            {/* CSS Doodles around the collage */}
            <div className="absolute top-[40%] -left-8 md:-left-16 transform -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <StarDoodle className="absolute -top-8 -left-4 w-6 h-6" color="#f9a8d4" />
              <StarDoodle className="absolute -top-2 -right-8 w-4 h-4" color="#fde047" />
              <p className="text-[20px] md:text-[24px] text-gray-600 leading-[1.1] rotate-[-10deg] text-center" style={{ fontFamily: '"Caveat", cursive' }}>
                Different<br/>Audiences<br/>Same<br/>Magic!
              </p>
              <img src="/assets/blue sparrow.png" alt="Sparrow" className="w-10 h-10 mt-2 -rotate-12" onError={(e) => e.target.style.display='none'} />
            </div>
            
          </div>
        </motion.div>

        {/* ================= RIGHT: Text & Pill Cards ================= */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative w-full">
          
          <span className="text-[#a855f7] font-bold tracking-[0.15em] uppercase text-[10px] md:text-[11px] mb-4 block">The Blue Sparrow Range</span>
          <h2 className="text-[32px] sm:text-[36px] lg:text-[44px] font-serif font-bold text-[#1e293b] mb-4 leading-[1.1]">
            We make spaces come alive for people.
          </h2>
          <p className="text-gray-500 text-[14px] md:text-[15px] font-light leading-relaxed mb-10 max-w-[500px]">
            Blue Sparrow can take your child's interest, your audience, your space, or your objective and build the exact right event around it.
          </p>

          {/* Glowing Pill Grid (Forces 3 columns on Desktop, responsive on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {displayCards.slice(0, 6).map((card, i) => {
              const theme = colorMap[card.color] || colorMap[['pink', 'blue', 'green', 'purple', 'orange', 'pink-dark'][i]];
              
              return (
                <Link 
                  to={card.icon?.includes('/') ? card.icon : card.link || "/contact"} 
                  key={card.id || i}
                  className={`flex items-center gap-3 bg-white px-4 py-3 rounded-full border hover:-translate-y-1 transition-all duration-300 group ${theme.shadow}`}
                >
                  <div className="text-xl shrink-0 drop-shadow-sm group-hover:scale-110 transition-transform">
                    {card.icon && !card.icon.includes('/') ? card.icon : '✨'}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className={`font-bold text-[12px] md:text-[13px] leading-tight ${theme.textTitle}`}>{card.title}</h4>
                    <p className="text-[10px] md:text-[11px] leading-tight font-medium text-gray-400 mt-0.5">{card.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-3.5 px-8 rounded-full shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] transform hover:-translate-y-0.5 transition-all text-[15px]">
            Discuss Your Space &rarr;
          </Link>

          {/* Right CSS Doodles (Hidden on mobile to prevent horizontal scroll issues) */}
          <div className="absolute top-4 -right-10 xl:-right-24 transform rotate-[-5deg] hidden lg:block pointer-events-none">
            <div className="relative">
              {/* CSS Orange Dashes */}
              <div className="absolute top-8 -left-6 flex gap-1 rotate-12">
                 <div className="w-0.5 h-3 bg-orange-400 rounded-full"></div>
                 <div className="w-0.5 h-3 bg-orange-400 rounded-full"></div>
              </div>
              <div className="absolute bottom-6 -left-4 flex gap-1 rotate-12">
                 <div className="w-0.5 h-3 bg-orange-400 rounded-full"></div>
              </div>

              <p className="text-[20px] xl:text-[22px] text-gray-600 leading-tight text-center" style={{ fontFamily: '"Caveat", cursive' }}>
                Ideas<br/>People<br/>Spaces<br/>Unforgettable<br/>Experiences
              </p>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default ExperiencesSection;