import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

// Reusable Dual-Tone Star doodle
const DualToneStar = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dualToneGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" /> {/* Pink */}
        <stop offset="100%" stopColor="#fbbf24" /> {/* Yellow */}
      </linearGradient>
    </defs>
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="url(#dualToneGrad2)" />
  </svg>
);

const FeaturedEventsSection = () => {
  const scrollContainerRef = useRef(null);
  const [dbEvents, setDbEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'home')
        .eq('category', 'featured_events')
        .order('created_at', { ascending: false });
      if (data) setDbEvents(data);
    };

    fetchEvents();
    const channel = supabase.channel('live-featured-events').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchEvents).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  const fallbackEvents = [
    { id: 1, link: "/corporate", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/14.jpg", tag: "Corporate", tagColor: "text-[#4f46e5]", bgClass: "bg-[#f0f9ff]", title: "Modern Planter Painting", description: "Paint a ceramic planter with easy botanical motifs and take home a stylish desk accessory.", location: "Mumbai" },
    { id: 2, link: "/kids-parties", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/3.jpg", tag: "Kids Party", tagColor: "text-[#ec4899]", bgClass: "bg-[#fff1f2]", title: "Frozen Princess Party", description: "A magical celebration filled with wonder, creativity & icy fun! Includes Snow Volcanoes & Wands.", location: "Delhi" },
    { id: 3, link: "/carnivals", image_url: "/assets/carnivals 2026.pdf/10.jpg", tag: "Carnival", tagColor: "text-[#10b981]", bgClass: "bg-[#f0fdf4]", title: "The Great Candy Factory", description: "A colourful factory mission combining sensory discovery, sorting, art and collaborative engineering.", location: "Bangalore" },
    { id: 4, link: "/family-discovery", image_url: "/assets/family-day (1).pdf/4.jpg", tag: "Discovery", tagColor: "text-[#f97316]", bgClass: "bg-[#fff7ed]", title: "Crazy Science Laboratory", description: "A high-energy STEM world packed with experiments, physics challenges and live science moments.", location: "Hyderabad" }
  ];

  const displayEvents = dbEvents.length > 0 ? dbEvents : fallbackEvents;

  const colorCycles = [
    { tagColor: "text-[#4f46e5]", bgClass: "bg-[#f0f9ff]" },
    { tagColor: "text-[#ec4899]", bgClass: "bg-[#fff1f2]" },
    { tagColor: "text-[#10b981]", bgClass: "bg-[#f0fdf4]" },
    { tagColor: "text-[#f97316]", bgClass: "bg-[#fff7ed]" }
  ];

  return (
    <section className="py-24 px-6 lg:px-12 bg-white relative overflow-hidden font-sans border-t border-gray-50">
      
      {/* Background Magic Elements constructed with pure CSS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-gradient-to-tr from-pink-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none z-0"></div>
      
      {/* Abstract CSS curved doodle behind header */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[20vw] border-t-[3px] border-l-[3px] border-dashed border-purple-100 rounded-tl-full opacity-40 z-0 pointer-events-none"></div>

      {/* Animated Header & Functional Navigation Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10"
      >
         <div className="relative">
           {/* Floating Star Doodles around Title */}
           <DualToneStar className="absolute -top-6 -left-6 w-6 h-6 animate-pulse opacity-80" />
           <div className="absolute top-2 -right-8 w-3 h-3 bg-blue-300 rounded-full opacity-60"></div>

           <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-2 relative inline-block">
             Featured Events
             {/* Highlighter loop under text */}
             <div className="absolute -bottom-1 left-0 w-full h-2 border-b-[3px] border-pink-200 rounded-full opacity-70 rotate-[-1deg] z-[-1]"></div>
           </h2>
           <p className="text-gray-500 text-[16px] font-light">Glimpses of the magic we create</p>
         </div>
         <div className="flex gap-3">
           <button onClick={() => scroll(-1)} className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:border-pink-300 hover:text-[#ec4899] transition-all shadow-sm active:scale-95 z-10 relative overflow-hidden group">
             <div className="absolute inset-0 bg-pink-50 translate-y-full group-hover:translate-y-0 transition-transform z-[-1]"></div>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <button onClick={() => scroll(1)} className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:border-blue-300 hover:text-[#3b82f6] transition-all shadow-sm active:scale-95 z-10 relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-50 translate-y-full group-hover:translate-y-0 transition-transform z-[-1]"></div>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
           </button>
         </div>
      </motion.div>

      {/* The Scrollable Grid */}
      <div 
        ref={scrollContainerRef} 
        className="max-w-7xl mx-auto flex overflow-x-auto gap-8 pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth relative z-10 pt-4"
      >
        <AnimatePresence>
          {displayEvents.map((event, index) => {
            const themeStyle = event.bgClass ? event : colorCycles[index % 4];
            
            return (
              <motion.div
                layout
                key={event.id || index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="min-w-[320px] md:min-w-[360px] snap-center block h-full"
              >
                <Link to={event.link || "/portfolio"} className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col group cursor-pointer block relative">
                  
                  {/* Subtle CSS hover sparkles that appear on hover */}
                  <div className="absolute -top-3 -right-3 text-yellow-300 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-12 z-10">✨</div>
                  <div className="absolute top-1/2 -left-4 text-blue-300 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 -rotate-12 z-10">✦</div>

                  <div className={`w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[24px] overflow-hidden relative mb-5 ${themeStyle.bgClass}`}>
                    <img 
                      src={event.image_url || event.imgSrc} 
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?w=800&q=80"; }}
                      alt={event.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    <span className={`absolute bottom-4 left-4 bg-white/95 backdrop-blur-md ${themeStyle.tagColor} text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm tracking-wide uppercase`}>
                      {event.tag || event.category || "Featured"}
                    </span>
                  </div>
                  <div className="px-2 pb-2 flex-grow flex flex-col relative z-10">
                    <h4 className="font-serif font-bold text-[#1e293b] text-[22px] mb-2 leading-tight group-hover:text-[#4f46e5] transition-colors">{event.title}</h4>
                    <p className="text-[14px] text-gray-500 mb-4 leading-relaxed flex-grow">{event.description || event.desc}</p>
                    <p className="text-[13px] text-gray-400 flex items-center gap-1.5 font-medium mt-auto">
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> 
                      {event.location || "Multiple Locations"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedEventsSection;