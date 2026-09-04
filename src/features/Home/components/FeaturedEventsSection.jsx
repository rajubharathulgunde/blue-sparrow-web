import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

const FeaturedEventsSection = () => {
  const scrollContainerRef = useRef(null);

  // === CMS STATE ===
  const [dbEvents, setDbEvents] = useState([]);

  useEffect(() => {
    // === FETCH CMS DATA ===
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'home')
        // We only want the featured events here, NOT the background video!
        .eq('category', 'featured_events')
        .order('created_at', { ascending: false });
        
      if (data) setDbEvents(data);
    };

    fetchEvents();

    // === REALTIME LISTENER ===
    const channel = supabase.channel('live-featured-events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchEvents)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Function to handle left/right button clicks
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380; // The width of one card + gap
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  // === FALLBACK DATA ===
  const fallbackEvents = [
    {
      id: 1,
      link: "/corporate",
      image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/14.jpg",
      tag: "Corporate",
      tagColor: "text-[#4f46e5]",
      bgClass: "bg-[#f0f9ff]",
      title: "Modern Planter Painting",
      description: "Paint a ceramic planter with easy botanical motifs and take home a stylish desk accessory.",
      location: "Mumbai"
    },
    {
      id: 2,
      link: "/kids-parties",
      image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/3.jpg",
      tag: "Kids Party",
      tagColor: "text-[#ec4899]",
      bgClass: "bg-[#fff1f2]",
      title: "Frozen Princess Party",
      description: "A magical celebration filled with wonder, creativity & icy fun! Includes Snow Volcanoes & Wands.",
      location: "Delhi"
    },
    {
      id: 3,
      link: "/carnivals",
      image_url: "/assets/carnivals 2026.pdf/10.jpg",
      tag: "Carnival",
      tagColor: "text-[#10b981]",
      bgClass: "bg-[#f0fdf4]",
      title: "The Great Candy Factory",
      description: "A colourful factory mission combining sensory discovery, sorting, art and collaborative engineering.",
      location: "Bangalore"
    },
    {
      id: 4,
      link: "/family-discovery",
      image_url: "/assets/family-day (1).pdf/4.jpg",
      tag: "Discovery",
      tagColor: "text-[#f97316]",
      bgClass: "bg-[#fff7ed]",
      title: "Crazy Science Laboratory",
      description: "A high-energy STEM world packed with experiments, physics challenges and live science moments.",
      location: "Hyderabad"
    }
  ];

  // Logic: Use database if available, otherwise fallbacks
  const displayEvents = dbEvents.length > 0 ? dbEvents : fallbackEvents;

  // Array to cycle card background colors & tag colors for CMS uploaded cards
  const colorCycles = [
    { tagColor: "text-[#4f46e5]", bgClass: "bg-[#f0f9ff]" }, // Blue
    { tagColor: "text-[#ec4899]", bgClass: "bg-[#fff1f2]" }, // Pink
    { tagColor: "text-[#10b981]", bgClass: "bg-[#f0fdf4]" }, // Green
    { tagColor: "text-[#f97316]", bgClass: "bg-[#fff7ed]" }  // Orange
  ];

  return (
    <section className="py-24 px-6 lg:px-12 bg-white">
      
      {/* Animated Header & Functional Navigation Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
      >
         <div>
           <h2 className="text-[32px] font-serif font-bold text-brand-navy mb-2">Featured Events</h2>
           <p className="text-gray-500 text-[16px]">Glimpses of the magic we create</p>
         </div>
         <div className="flex gap-3">
           <button onClick={() => scroll(-1)} className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-brand-navy transition-all shadow-sm active:scale-95">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <button onClick={() => scroll(1)} className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-brand-navy transition-all shadow-sm active:scale-95">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
           </button>
         </div>
      </motion.div>

      {/* The Scrollable Grid */}
      <div 
        ref={scrollContainerRef} 
        className="max-w-7xl mx-auto flex overflow-x-auto gap-8 pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        <AnimatePresence>
          {displayEvents.map((event, index) => {
            // If it's a CMS uploaded event, it won't have specific tagColors/bgClasses in the DB, 
            // so we automatically assign it one from our array based on its index!
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
                <Link to={event.link || "/portfolio"} className="bg-white rounded-[32px] p-5 shadow-soft border border-gray-50 hover:shadow-soft-hover transition-all duration-500 h-full flex flex-col group cursor-pointer block">
                  <div className={`w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[24px] overflow-hidden relative mb-5 ${themeStyle.bgClass}`}>
                    <img 
                      src={event.image_url || event.imgSrc} 
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?w=800&q=80"; }}
                      alt={event.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    <span className={`absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm ${themeStyle.tagColor} text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm tracking-wide uppercase`}>
                      {/* Using the CMS title as the tag, or defaulting to event.tag for fallbacks */}
                      {event.tag || event.category || "Featured"}
                    </span>
                  </div>
                  <div className="px-2 pb-2 flex-grow flex flex-col">
                    <h4 className="font-serif font-bold text-brand-navy text-[22px] mb-2 leading-tight">{event.title}</h4>
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