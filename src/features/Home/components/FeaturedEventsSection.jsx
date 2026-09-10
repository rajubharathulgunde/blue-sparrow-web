import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

const FeaturedEventsSection = () => {
  const scrollContainerRef = useRef(null);
  const [dbEvents, setDbEvents] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

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
      const scrollAmount = 412; 
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isHovered) return; 

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 412, behavior: 'smooth' });
        }
      }
    }, 3500); 

    return () => clearInterval(interval);
  }, [isHovered]);

  // POINTED TO YOUR LOCAL FOLDER AND FILES
  const fallbackEvents = [
    { 
      id: 1, 
      video_url: "/assets/ig videos/Alien Invasion experience zone built and executed by Bluesparrow parties for Hamleys WonderlandL.mp4", 
      ig_link: "https://www.instagram.com/reel/DKwksq9scgF/", 
      tag: "Immersive", tagColor: "text-cyan-600", 
      title: "Alien Invasion Zone", 
      description: "Step into an extraterrestrial adventure with cinematic production and immersive tech, curated for Hamleys Wonderland.", 
      location: "Mumbai" 
    },
    { 
      id: 2, 
      video_url: "/assets/ig videos/Another STEM Fair at Abbott in the books 🚀Last week was one of those days where everything just.mp4", 
      ig_link: "https://www.instagram.com/reel/DRJWR-ODBDS/", 
      tag: "Corporate", tagColor: "text-blue-600", 
      title: "STEM Fair at Abbott", 
      description: "Connecting bright minds with future solutions. A high-impact corporate science fair, designed to inspire innovation.", 
      location: "Delhi" 
    },
    { 
      id: 3, 
      video_url: "/assets/ig videos/Gratitude in every shade of blue! 🎉 Thank you Megha kulchandani,for curating an inventors lab.mp4", 
      ig_link: "https://www.instagram.com/reel/DSq9oztk-dQ/", 
      tag: "Innovation", tagColor: "text-purple-600", 
      title: "The Inventors Lab", 
      description: "Unlock creativity and fuel the maker mindset. A collaborative space where big ideas are hand-crafted into reality.", 
      location: "Bangalore" 
    },
    { 
      id: 4, 
      video_url: "/assets/ig videos/If your child would love to hitchhike to the space, why not bring the galaxy to them!At our Sp.mp4", 
      ig_link: "https://www.instagram.com/reel/C3PYV-CISKe/", 
      tag: "Discovery", tagColor: "text-pink-600", 
      title: "A Hitchhiker's Guide to Space", 
      description: "Fueling cosmic dreams. Bring the wonders of the universe directly to your child with our interactive space experience.", 
      location: "Pune" 
    },
    { 
      id: 5, 
      video_url: "/assets/ig videos/We turned hamleysplay into a world of fun! 🎉 Our in-store activation made kids and families smi.mp4", 
      ig_link: "https://www.instagram.com/reel/C6VZ3N2IgFu/", 
      tag: "Retail", tagColor: "text-amber-600", 
      title: "Hamleys Play Takeover", 
      description: "Elevating retail experiences with in-store magic, interactive play, and endless smiles for families.", 
      location: "Hyderabad" 
    }
  ];

  const displayEvents = dbEvents.length > 0 ? dbEvents : fallbackEvents;

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 bg-[#f8fafc] relative overflow-hidden font-sans border-t border-slate-100">
      <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-cyan-400/10 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-pink-400/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 relative z-10"
      >
         <div className="relative">
           <span className="text-cyan-600 font-bold tracking-[0.2em] uppercase text-[11px] mb-4 block">
             Captured Magic
           </span>
           <h2 className="text-[36px] md:text-[48px] font-sans font-extrabold text-slate-900 mb-2 tracking-tight">
             Featured Events
           </h2>
           <p className="text-slate-500 text-[16px] md:text-[18px] font-medium">
             Glimpses of the extraordinary worlds we build.
           </p>
         </div>
         
         <div className="flex gap-3">
           <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] active:scale-95 z-10">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)] active:scale-95 z-10">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
           </button>
         </div>
      </motion.div>

      <div 
        ref={scrollContainerRef} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="max-w-[1440px] mx-auto flex overflow-x-auto gap-8 pb-12 hide-scrollbar snap-x snap-mandatory scroll-smooth relative z-10"
      >
        <AnimatePresence>
          {displayEvents.map((event, index) => (
            <motion.div
              layout
              key={event.id || index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="min-w-[320px] md:min-w-[380px] snap-center block h-full group"
            >
              <div className="bg-white rounded-[40px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col relative transform hover:-translate-y-1">
                
                <div className="w-full aspect-[9/16] max-h-[550px] rounded-[32px] overflow-hidden relative mb-6 bg-slate-900 border-[4px] border-slate-50 shadow-inner">
                  <video 
                    src={event.video_url || event.image_url} 
                    className="w-full h-full object-cover absolute inset-0 bg-slate-900"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                  />
                  
                  <div className="absolute top-4 right-4 pointer-events-none z-20">
                    <span className={`bg-white/90 backdrop-blur-md ${event.tagColor || 'text-cyan-600'} text-[10px] font-extrabold px-4 py-2 rounded-full shadow-sm tracking-widest uppercase border border-white/50`}>
                      {event.tag || "Featured"}
                    </span>
                  </div>
                </div>

                <div className="px-4 pb-4 flex-grow flex flex-col relative z-10">
                  <h4 className="font-sans font-bold text-slate-900 text-[22px] mb-2 leading-tight group-hover:text-cyan-600 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-[15px] text-slate-500 mb-5 leading-relaxed flex-grow font-medium">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <p className="text-[12px] text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> 
                      {event.location || "Featured Location"}
                    </p>

                    <a 
                      href={event.ig_link || "https://instagram.com/bluesparrowevents"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-600 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      Instagram
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedEventsSection;