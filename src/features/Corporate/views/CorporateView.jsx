import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';
// import FaqBrochureSection from '../../Home/components/FaqBrochureSection'; // Commented out for now

// Reusable Star Doodle for Corporate Theme
const CorporateStar = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="corpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
        <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
      </linearGradient>
    </defs>
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="url(#corpGrad)" />
  </svg>
);

const CorporateView = () => {
  const scrollContainerRef = useRef(null);
  
  // === CMS STATES ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCards, setDbCards] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // === FETCH CMS DATA ===
    const fetchData = async () => {
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'corporate')
        .order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      const { data: cards } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'corporate')
        .order('created_at', { ascending: true });
      if (cards) setDbCards(cards);
    };

    fetchData();

    // === REALTIME LISTENERS ===
    const channel1 = supabase.channel('live-corporate-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe();
    const channel2 = supabase.channel('live-corporate-cards').on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450; 
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

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

  // Specific custom text for known cards
  const specificCards = [
    { id: 14, title: "Planter Painting", description: "Paint a ceramic planter with easy botanical motifs and take home a stylish desk accessory to brighten up your workspace.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/14.jpg", icon: "45 MINS" },
    { id: 15, title: "Tie-Dye Masterclass", description: "Learn professional folding and dyeing techniques to create vibrant, custom-designed apparel for your team.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/15.jpg", icon: "60 MINS" },
    { id: 16, title: "Collaborative Canvas", description: "A guided painting session where individual canvases come together to form one giant, cohesive masterpiece.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/16.jpg", icon: "90 MINS" }
  ];

  // Generate all 37 fallback cards automatically
  const fallbackCards = Array.from({ length: 37 }, (_, i) => {
    const cardNum = i + 1;
    const specificMatch = specificCards.find(c => c.id === cardNum);
    
    if (specificMatch) return specificMatch;
    
    return {
      id: cardNum,
      title: `Corporate Experience ${cardNum}`,
      description: "Meaningful, hands-on workshop designed to inspire creativity, foster collaboration, and bring your team together.",
      image_url: `/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/${cardNum}.jpg`,
      icon: "WORKSHOP"
    };
  });

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
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </motion.div>
        <span className="absolute right-full mr-4 bg-white text-brand-navy text-sm font-bold py-2.5 px-4 rounded-2xl shadow-floating opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-gray-100">
          Plan an Event ✨
        </span>
      </Link>
      
      {/* ================= FULL SCREEN IMAGE HERO SECTION ================= */}
      <section className="relative w-full min-h-[95vh] flex items-center overflow-hidden bg-white flex-grow">
        
        {/* Full Size Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/Corporate Family Days.png" 
            alt="Corporate Family Days" 
            className="w-full h-full object-cover object-center" 
            onError={(e) => { 
              e.target.style.display = 'none'; 
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-indigo-50'); 
            }} 
          />
          {/* Masking gradients reduced for max image clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent w-full lg:w-[60%]"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f8fafc] to-transparent z-10"></div>
        </div>

        <div className="w-full px-6 sm:px-10 lg:pl-16 xl:pl-24 relative z-20 pt-28 pb-16 flex flex-col justify-center min-h-[95vh]">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="w-full lg:w-[55%] xl:w-[50%] flex flex-col items-start text-left relative z-20"
          >
            <CorporateStar className="absolute -top-10 left-[5%] w-8 h-8 animate-pulse" />
            <CorporateStar className="absolute top-[50%] right-[5%] w-6 h-6 animate-pulse" />
            
            <span className="bg-white/80 backdrop-blur-md px-5 py-2 rounded-full border border-blue-100 text-blue-600 font-bold tracking-widest uppercase text-[11px] md:text-sm mb-6 inline-block shadow-sm relative">
              Corporate Experiences
              <div className="absolute -bottom-2 left-[-5%] w-[110%] h-1 border-b-[2px] border-dashed border-blue-200 rounded-full opacity-80 rotate-[-1deg]"></div>
            </span>
            
            <h1 className="text-[48px] sm:text-[60px] md:text-[76px] lg:text-[84px] font-serif font-bold text-[#1e293b] leading-[1.05] tracking-tight mb-4 drop-shadow-sm">
              Team Building, <br className="hidden sm:block" /> Reimagined.
            </h1>
            
            <p className="text-[15px] md:text-[17px] text-[#1e293b] max-w-[500px] font-medium leading-relaxed bg-white/60 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white shadow-sm mb-8">
              Meaningful, hands-on workshops designed to inspire creativity, foster collaboration, and bring your team together through shared, unforgettable experiences.
            </p>

            <button onClick={() => window.scrollTo({ top: 850, behavior: 'smooth' })} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-[15px] flex items-center gap-3">
              Explore Workshops <span className="text-lg">&rarr;</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= SMART TRUSTED BRANDS LOGO MARQUEE ================= */}
      <section className="py-12 bg-white border-y border-gray-100 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
           <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Trusted By Industry Leaders</p>
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
      <section className="py-24 bg-[#f8fafc] relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-end mb-12">
           <div className="relative">
             <CorporateStar className="absolute -top-4 -left-6 w-5 h-5 animate-pulse opacity-80" />
             <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-2 relative inline-block">
               Event Highlights
               <div className="absolute bottom-1 left-[-5%] w-[110%] h-3 bg-blue-100 opacity-60 rounded-full rotate-[1deg] z-[-1]"></div>
             </h2>
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

        <div ref={scrollContainerRef} className="max-w-[1400px] mx-auto px-6 lg:px-12 flex overflow-x-auto gap-8 pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth">
          <AnimatePresence>
            {displaySlider.map((img, i) => (
              <motion.div layout key={img.id || i} className="min-w-[320px] md:min-w-[480px] h-[300px] md:h-[380px] snap-center group relative rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-gray-100 cursor-pointer">
                <img 
                  src={img.image_url || img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                  onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/70 via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm tracking-widest uppercase inline-block mb-3">
                    {img.category || img.tag || "Event"}
                  </span>
                  <h3 className="text-white text-2xl md:text-3xl font-serif font-bold drop-shadow-md">{img.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= DYNAMIC WORKSHOPS GRID (ALL 37 BROCHURE CARDS) ================= */}
      <section className="pt-10 pb-32 px-6 lg:px-12 bg-[#f8fafc] relative z-20 border-b border-gray-100">
        
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {displayCards.map((card, i) => (
              <motion.div 
                layout
                key={card.id || i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: (i % 6) * 0.1, ease: "easeOut" }}
                className="bg-white rounded-[40px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-50 to-transparent rounded-tr-[40px] z-0"></div>

                 <div className="w-full aspect-[3/4] md:aspect-[9/16] max-h-[450px] rounded-[32px] overflow-hidden relative mb-6 bg-blue-50 z-10 border border-gray-50">
                   <img 
                     src={card.image_url} 
                     onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                     alt={card.title} 
                     className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out" 
                   />
                   <span className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] tracking-wider font-bold px-4 py-2 rounded-full shadow-sm">
                     {card.icon || "WORKSHOP"}
                   </span>
                 </div>
                 <div className="px-2 pb-2 flex-grow flex flex-col z-10">
                   <h3 className="font-serif font-bold text-[#1e293b] text-[24px] mb-3 leading-tight group-hover:text-blue-600 transition-colors">{card.title}</h3>
                   <p className="text-[14px] md:text-[15px] text-gray-500 mb-6 leading-relaxed flex-grow font-light">{card.description}</p>
                   <button className="text-blue-500 font-bold text-[14px] uppercase tracking-wider flex items-center gap-2 group-hover:text-blue-700 transition-colors mt-auto">
                     Explore Workshop <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                   </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ & Brochure Section temporarily disabled per request */}
      {/* <FaqBrochureSection pageTheme="corporate" /> */}

      <Footer />
    </div>
  );
};

export default CorporateView;