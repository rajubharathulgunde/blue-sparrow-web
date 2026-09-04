import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';
import FaqBrochureSection from '../../Home/components/FaqBrochureSection';

const MallsView = () => {
  const scrollContainerRef = useRef(null);

  // === CMS STATES ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCards, setDbCards] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // === FETCH CMS DATA ===
    const fetchData = async () => {
      // Fetch Slider Images
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'malls')
        .order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      // Fetch Theme Cards
      const { data: cards } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'malls')
        .order('created_at', { ascending: true });
      if (cards) setDbCards(cards);
    };

    fetchData();

    // === REALTIME LISTENERS ===
    const channel1 = supabase.channel('live-malls-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData)
      .subscribe();
      
    const channel2 = supabase.channel('live-malls-cards')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  // Function for manual slider navigation
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450; 
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto-scroll logic for the image slider
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

  // === FALLBACK DATA ===
  const fallbackImages = [
    { id: 1, image_url: "/assets/carnivals 2026.pdf/10.jpg", title: "Festive Season Atrium", category: "High Footfall" },
    { id: 2, image_url: "/assets/family-day (1).pdf/6.jpg", title: "Brand Product Launch", category: "Activation" },
    { id: 3, image_url: "/assets/family-day (1).pdf/8.jpg", title: "Weekend Kids Zone", category: "Queue Managed" },
    { id: 4, image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/14.jpg", title: "Interactive DIY Booth", category: "Engagement" },
  ];

  const fallbackCards = [
    {
      id: 1,
      title: "Pop-Up Craft Stations",
      description: "Quick, engaging crafts that take less than 15 minutes, ensuring steady flow and high volume without crowding.",
      image_url: "/assets/carnivals 2026.pdf/10.jpg",
      icon: "HIGH VOLUME"
    },
    {
      id: 2,
      title: "Stage Shows & Games",
      description: "Interactive crowd games and mini-shows that draw attention and create an electric atmosphere in the atrium.",
      image_url: "/assets/family-day (1).pdf/8.jpg",
      icon: "CROWD PULLER"
    },
    {
      id: 3,
      title: "Themed Photo Booths",
      description: "Custom-built, immersive photo ops that encourage social sharing and organic brand reach for your retail space.",
      image_url: "/assets/family-day (1).pdf/6.jpg",
      icon: "VIRAL REACH"
    }
  ];

  const displaySlider = dbGallery.length > 0 ? dbGallery : fallbackImages;
  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;

  return (
    <div className="font-sans text-gray-600 bg-[#f8fafc] min-h-screen flex flex-col selection:bg-indigo-100 selection:text-brand-navy overflow-hidden relative">
      <Navbar />
      
      {/* ================= FLOATING CHATBOT WIDGET ================= */}
      <Link 
        to="/contact" 
        className="fixed bottom-8 right-8 z-[100] flex items-center justify-center w-16 h-16 bg-[#4f46e5] text-white rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.5)] hover:bg-indigo-600 hover:shadow-[0_15px_35px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 transition-all duration-300 group"
      >
        <motion.div 
          animate={{ y: [0, -4, 0] }} 
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </motion.div>
        <span className="absolute right-full mr-4 bg-white text-brand-navy text-sm font-bold py-2.5 px-4 rounded-2xl shadow-floating opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-gray-100">
          Plan an Activation ✨
        </span>
      </Link>

      {/* ================= GEOMETRIC HERO SECTION ================= */}
      <section className="relative pt-48 pb-24 px-6 lg:px-12 bg-gradient-to-b from-[#eef2ff] via-[#f5f3ff] to-[#f8fafc] flex-grow">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [-5, -8, -5] }} 
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} 
            className="absolute top-[20%] left-[15%] w-72 h-72 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/60 shadow-[0_8px_32px_0_rgba(79,70,229,0.07)]"
          ></motion.div>
          
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ repeat: Infinity, duration: 45, ease: "linear" }} 
            className="absolute -right-[10%] top-[10%] w-[600px] h-[600px] opacity-10"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-500">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            </svg>
          </motion.div>

          <div className="absolute top-[30%] right-[30%] w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto text-center relative z-20"
        >
          <span className="bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-indigo-100 text-indigo-600 font-bold tracking-widest uppercase text-sm mb-6 inline-block shadow-sm">
            Mall & Brand Activities
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-navy mb-6 tracking-tight drop-shadow-sm">
            High Footfall. <br className="hidden md:block" /> Zero Friction.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/50 shadow-sm">
            We transform retail atriums into powerful family magnets. We engineer the participant flow, manage the queues, and run multi-day programming flawlessly.
          </p>
        </motion.div>
      </section>

      {/* ================= B2B RETAIL CHALLENGES GRID ================= */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto relative z-20 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white p-10 rounded-[40px] border border-indigo-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🔄</div>
            <h3 className="text-xl font-serif font-bold text-brand-navy mb-3">Queue Management</h3>
            <p className="text-gray-500 text-[15px] font-light leading-relaxed">Fast-turnaround activities designed to keep lines moving while delivering high-value engagement, preventing atrium bottlenecks.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[40px] border border-purple-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group transform md:-translate-y-6"
          >
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📐</div>
            <h3 className="text-xl font-serif font-bold text-brand-navy mb-3">Spatial Design</h3>
            <p className="text-gray-500 text-[15px] font-light leading-relaxed">Whether you have a massive main atrium or a compact dead zone, we optimize the footprint for maximum participant volume.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="bg-white p-10 rounded-[40px] border border-pink-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📅</div>
            <h3 className="text-xl font-serif font-bold text-brand-navy mb-3">Multi-Day Scalability</h3>
            <p className="text-gray-500 text-[15px] font-light leading-relaxed">Robust operational structures that allow activities to run consistently across weekends or entire month-long festive seasons.</p>
          </motion.div>
        </div>
      </section>

      {/* ================= DYNAMIC AUTO IMAGE SLIDER ================= */}
      <section className="py-20 bg-[#f8fafc] relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-end mb-10">
           <div>
             <h2 className="text-[32px] font-serif font-bold text-brand-navy mb-2">Activations in Action</h2>
             <p className="text-gray-500 text-[16px] font-light">See how we transform retail spaces.</p>
           </div>
           <div className="flex gap-3 hidden md:flex">
             <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>
             <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
           </div>
        </div>

        <div ref={scrollContainerRef} className="max-w-7xl mx-auto px-6 lg:px-12 flex overflow-x-auto gap-8 pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth">
          <AnimatePresence>
            {displaySlider.map((img, i) => (
              <motion.div layout key={img.id || i} className="min-w-[320px] md:min-w-[480px] h-[300px] md:h-[380px] snap-center group relative rounded-[32px] overflow-hidden shadow-md bg-gray-100">
                <img 
                  src={img.image_url || img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wider uppercase inline-block mb-3">
                    {img.category || img.tag || 'Activation'}
                  </span>
                  <h3 className="text-white text-2xl font-serif font-bold drop-shadow-md">{img.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= DYNAMIC THEME CARDS ================= */}
      <section className="pt-10 pb-20 px-6 lg:px-12 bg-[#f8fafc] relative z-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {displayCards.map((card, i) => (
              <motion.div 
                layout
                key={card.id || i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
              >
                 <div className="w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[32px] overflow-hidden relative mb-6 bg-indigo-50">
                   <img 
                     src={card.image_url} 
                     onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"; }}
                     alt={card.title} 
                     className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out" 
                   />
                   <span className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-indigo-600 text-[11px] font-bold px-4 py-2 rounded-full shadow-sm">
                     {card.icon || "SERVICE"}
                   </span>
                 </div>
                 <div className="px-2 pb-2 flex-grow flex flex-col">
                   <h3 className="font-serif font-bold text-brand-navy text-[26px] mb-3 leading-tight group-hover:text-indigo-600 transition-colors">{card.title}</h3>
                   <p className="text-[15px] text-gray-500 mb-6 leading-relaxed flex-grow font-light">{card.description}</p>
                   <button className="text-indigo-500 font-semibold text-[15px] flex items-center gap-2 group-hover:text-indigo-700 transition-colors mt-auto">
                     Learn More <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                   </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= THE BRIEF -> PLAN -> MADE REAL ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4 block">Case Study Highlight</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-navy mb-10 leading-tight">How We Work: <br/>Retail Edition</h2>
              
              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 bg-[#f8fafc] border border-gray-200 rounded-full flex items-center justify-center font-bold text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 group-hover:border-indigo-200 transition-colors">1</div>
                  <div>
                    <h4 className="text-xl font-serif font-bold text-brand-navy mb-2">The Brief</h4>
                    <p className="text-[15px] text-gray-500 font-light leading-relaxed">Weekend engagement, limited atrium space, high family footfall. The objective: keep kids deeply engaged while parents shop without crowding the aisles.</p>
                  </div>
                </div>
                
                <div className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-500">2</div>
                  <div>
                    <h4 className="text-xl font-serif font-bold text-brand-navy mb-2">The Plan</h4>
                    <p className="text-[15px] text-gray-500 font-light leading-relaxed">3 distinct, fast-paced activity zones with strict 10-minute rotation batches. Dedicated queue facilitators manage lines, utilizing self-contained, mess-free materials.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 bg-[#4f46e5] text-white rounded-full flex items-center justify-center font-bold shadow-md">3</div>
                  <div>
                    <h4 className="text-xl font-serif font-bold text-brand-navy mb-2">Made Real</h4>
                    <p className="text-[15px] text-gray-500 font-light leading-relaxed">Seamless execution handling 500+ kids a day without a single crowd-control escalation for mall security.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[600px] w-full rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(31,38,135,0.1)]">
              <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply z-10"></div>
              <img 
                src="/assets/carnivals 2026.pdf/10.jpg" 
                alt="Mall Activation Success" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                }}
              />
              <div className="absolute bottom-10 left-10 right-10 z-20 bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl">
                <p className="text-brand-navy font-serif font-bold text-2xl mb-2">"Flawless crowd control."</p>
                <p className="text-xs text-indigo-500 uppercase tracking-widest font-bold">— Center Manager, Leading Retail Mall</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FaqBrochureSection pageTheme="malls" />

      <Footer />
    </div>
  );
};

export default MallsView;