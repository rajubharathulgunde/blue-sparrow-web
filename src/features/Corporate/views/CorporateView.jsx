import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';
import FaqBrochureSection from '../../Home/components/FaqBrochureSection';

const CorporateView = () => {
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
        .eq('theme_id', 'corporate')
        .order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      // Fetch Theme Cards (Workshops)
      const { data: cards } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'corporate')
        .order('created_at', { ascending: true });
      if (cards) setDbCards(cards);
    };

    fetchData();

    // === REALTIME LISTENERS ===
    const channel1 = supabase.channel('live-corporate-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData)
      .subscribe();
      
    const channel2 = supabase.channel('live-corporate-cards')
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
    { id: 1, image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/1.jpg", title: "Team Building", category: "Engagement" },
    { id: 2, image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/14.jpg", title: "Planter Painting", category: "Creative" },
    { id: 3, image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/15.jpg", title: "Tie-Dye Session", category: "Hands-On" },
    { id: 4, image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/16.jpg", title: "Canvas Art", category: "Collaborative" },
    { id: 5, image_url: "/assets/family-day (1).pdf/1.jpg", title: "Family Day", category: "Corporate Event" },
  ];

  const fallbackCards = [
    {
      id: 1,
      title: "Planter Painting",
      description: "Paint a ceramic planter with easy botanical motifs and take home a stylish desk accessory to brighten up your workspace.",
      image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/14.jpg",
      icon: "45 MINS"
    },
    {
      id: 2,
      title: "Tie-Dye Masterclass",
      description: "Learn professional folding and dyeing techniques to create vibrant, custom-designed apparel for your team.",
      image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/15.jpg",
      icon: "60 MINS"
    },
    {
      id: 3,
      title: "Collaborative Canvas",
      description: "A guided painting session where individual canvases come together to form one giant, cohesive masterpiece.",
      image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/16.jpg",
      icon: "90 MINS"
    }
  ];

  // Logic: Use database if available, otherwise fallbacks
  const displaySlider = dbGallery.length > 0 ? dbGallery : fallbackImages;
  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;

  // Trusted Brands Array - Hardcoded
  const brands = [
    { name: "Hamleys", logo: "/assets/brands/hamleys.png" },
    { name: "Ritu Kumar", logo: "/assets/brands/ritu-kumar.png" },
    { name: "Reliance Brands", logo: "/assets/brands/reliance.png" },
    { name: "Satya Paul", logo: "/assets/brands/satya-paul.png" },
    { name: "CRISIL", logo: "/assets/brands/crisil.png" },
    { name: "Cisco", logo: "/assets/brands/cisco.png" },
    { name: "Webex", logo: "/assets/brands/webex.png" },
    { name: "Accenture", logo: "/assets/brands/accenture.png" }
  ];
  
  const duplicatedBrands = [...brands, ...brands, ...brands]; 

  return (
    <div className="font-sans text-gray-600 bg-[#f8fafc] min-h-screen flex flex-col selection:bg-blue-100 selection:text-brand-navy overflow-hidden relative">
      <Navbar />
      
      {/* ================= FLOATING CHATBOT WIDGET ================= */}
      <Link 
        to="/contact" 
        className="fixed bottom-8 right-8 z-[100] flex items-center justify-center w-16 h-16 bg-[#4f46e5] text-white rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.5)] hover:bg-blue-600 hover:shadow-[0_15px_35px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 transition-all duration-300 group"
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
          Plan an Event ✨
        </span>
      </Link>
      
      {/* ================= GEOMETRIC CORPORATE HERO SECTION ================= */}
      <section className="relative pt-48 pb-24 px-6 lg:px-12 bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#f8fafc] flex-grow">
        
        {/* Abstract Professional Geometry & Glassmorphism */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }} 
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} 
            className="absolute top-[15%] right-[15%] w-64 h-64 bg-white/30 backdrop-blur-md rounded-[40px] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
          ></motion.div>
          
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }} 
            className="absolute -left-[10%] top-[20%] w-[500px] h-[500px] opacity-10"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            </svg>
          </motion.div>

          <div className="absolute top-[40%] right-[5%] opacity-20">
             <svg width="120" height="120" viewBox="0 0 100 100">
               <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                 <circle fill="#3b82f6" cx="2" cy="2" r="1.5"></circle>
               </pattern>
               <rect x="0" y="0" width="100" height="100" fill="url(#dots)"></rect>
             </svg>
          </div>

          <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-blue-400/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto text-center relative z-20"
        >
          <span className="bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-blue-100 text-blue-600 font-bold tracking-widest uppercase text-sm mb-6 inline-block shadow-sm">
            Corporate Experiences
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-navy mb-6 tracking-tight drop-shadow-sm">
            Team Building, <br className="hidden md:block" /> Reimagined.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/50 shadow-sm">
            Meaningful, hands-on workshops designed to inspire creativity, foster collaboration, and bring your team together through shared, unforgettable experiences.
          </p>
        </motion.div>
      </section>

      {/* ================= SMART TRUSTED BRANDS LOGO MARQUEE ================= */}
      <section className="py-12 bg-white border-y border-gray-100 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
           <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Trusted By Industry Leaders</p>
        </div>
        
        <div className="relative flex overflow-hidden group items-center">
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <motion.div 
            className="flex gap-20 whitespace-nowrap px-8 items-center"
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          >
            {duplicatedBrands.map((brand, idx) => (
              <div key={idx} className="flex items-center justify-center min-w-[120px]">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-h-12 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.classList.add('hidden');
                    e.currentTarget.nextElementSibling.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-xl md:text-2xl font-serif font-bold text-gray-300 hover:text-blue-500 transition-colors duration-500 cursor-default">
                  {brand.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* ================= DYNAMIC AUTO IMAGE SLIDER ================= */}
      <section className="py-20 bg-[#f8fafc] relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-end mb-10">
           <div>
             <h2 className="text-[32px] font-serif font-bold text-brand-navy mb-2">Event Highlights</h2>
             <p className="text-gray-500 text-[16px] font-light">Watch teams connect and create in action.</p>
           </div>
           <div className="flex gap-3 hidden md:flex">
             <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>
             <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm">
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
                  onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wider uppercase inline-block mb-3">
                    {img.category || img.tag || "Event"}
                  </span>
                  <h3 className="text-white text-2xl font-serif font-bold drop-shadow-md">{img.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= DYNAMIC WORKSHOPS GRID ================= */}
      <section className="pt-10 pb-32 px-6 lg:px-12 bg-[#f8fafc] relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {displayCards.map((card, i) => (
              <motion.div 
                layout
                key={card.id || i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
              >
                 <div className="w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[32px] overflow-hidden relative mb-6 bg-blue-50">
                   <img 
                     src={card.image_url} 
                     onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                     alt={card.title} 
                     className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out" 
                   />
                   <span className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-blue-600 text-[11px] font-bold px-4 py-2 rounded-full shadow-sm">
                     {card.icon || "WORKSHOP"}
                   </span>
                 </div>
                 <div className="px-2 pb-2 flex-grow flex flex-col">
                   <h3 className="font-serif font-bold text-brand-navy text-[26px] mb-3 leading-tight group-hover:text-blue-600 transition-colors">{card.title}</h3>
                   <p className="text-[15px] text-gray-500 mb-6 leading-relaxed flex-grow font-light">{card.description}</p>
                   <button className="text-blue-500 font-semibold text-[15px] flex items-center gap-2 group-hover:text-blue-700 transition-colors mt-auto">
                     Explore Workshop <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                   </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
      <FaqBrochureSection pageTheme="corporate" />

      <Footer />
    </div>
  );
};

export default CorporateView;