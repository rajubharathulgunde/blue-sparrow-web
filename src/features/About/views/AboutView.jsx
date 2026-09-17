import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

// ================= CUSTOM CSS ICONS FOR STATS =================
const CssIcon = ({ type }) => {
  switch(type) {
    case 'kids': return <div className="flex gap-1 justify-center items-end h-full pb-2"><div className="w-3 h-5 sm:w-4 sm:h-6 bg-current rounded-full"><div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full mx-auto mt-1"></div></div><div className="w-4 h-6 sm:w-5 sm:h-8 bg-current rounded-full"><div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-white rounded-full mx-auto mt-1"></div></div></div>;
    case 'schools': return <div className="w-6 h-6 sm:w-8 sm:h-8 border-[3px] sm:border-4 border-current rounded-sm relative mt-2"><div className="absolute -top-2.5 sm:-top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] sm:border-l-[16px] border-r-[12px] sm:border-r-[16px] border-b-[8px] sm:border-b-[12px] border-transparent border-b-current"></div></div>;
    case 'events': return <div className="w-6 h-6 sm:w-8 sm:h-8 border-[3px] sm:border-4 border-current rounded-md relative mt-2 flex flex-col justify-end p-1"><div className="absolute -top-1.5 sm:-top-2 left-1 w-1.5 sm:w-2 h-2 sm:h-3 bg-current rounded-full"></div><div className="absolute -top-1.5 sm:-top-2 right-1 w-1.5 sm:w-2 h-2 sm:h-3 bg-current rounded-full"></div><div className="w-full h-3 sm:h-4 bg-current"></div></div>;
    case 'workshops': return <div className="w-6 h-6 sm:w-8 sm:h-8 border-[3px] sm:border-4 border-current rounded-full relative mt-1 flex items-center justify-center"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-current rounded-full"></div></div>;
    case 'carnivals': return <div className="relative w-6 h-6 sm:w-8 sm:h-8 border-[3px] sm:border-4 border-current rounded-full flex items-center justify-center animate-[spin_6s_linear_infinite] mt-1"><div className="absolute w-full h-[1.5px] sm:h-0.5 bg-current"></div><div className="absolute w-[1.5px] sm:w-0.5 h-full bg-current"></div><div className="absolute w-full h-[1.5px] sm:h-0.5 bg-current rotate-45"></div></div>;
    case 'cities': return <div className="w-5 h-5 sm:w-6 sm:h-6 border-[3px] sm:border-4 border-current rounded-full rounded-br-none transform -rotate-45 relative mt-2"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full absolute top-1 left-1"></div></div>;
    case 'teachers': return <div className="w-6 h-5 sm:w-8 sm:h-6 border-[3px] sm:border-4 border-current rounded-sm relative mt-3 flex items-center justify-center"><div className="absolute -top-2.5 sm:-top-3 left-1.5 sm:left-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-current rounded-full"></div><div className="w-3 sm:w-4 h-1 bg-current"></div></div>;
    case 'labs': return <div className="w-5 h-6 sm:w-6 sm:h-8 border-[3px] sm:border-4 border-t-0 border-current rounded-b-xl relative mt-2"><div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-1 bg-current"></div></div>;
    default: return <div className="w-5 h-5 sm:w-6 sm:h-6 bg-current rounded-full"></div>;
  }
};

const StarDoodle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient></defs>
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="url(#aboutGrad)" />
  </svg>
);

const AboutView = () => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0); // State for Hero Auto-Slider

  // === SUPABASE CMS INTEGRATION ===
  const [dbGallery, setDbGallery] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'about')
        .order('created_at', { ascending: false });
      
      if (data) setDbGallery(data);
    };
    
    fetchGallery();

    const channel = supabase.channel('live-about-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchGallery)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // === DYNAMIC IMAGE ROUTING ===
  const heroImagesDb = dbGallery.filter(img => img.category === 'hero' || img.tag?.toLowerCase() === 'hero');
  const founderImageDb = dbGallery.find(img => img.category === 'founder' || img.tag?.toLowerCase() === 'founder')?.image_url;
  const blog1ImageDb = dbGallery.find(img => img.category === 'blog1' || img.tag?.toLowerCase() === 'blog1')?.image_url;
  const blog2ImageDb = dbGallery.find(img => img.category === 'blog2' || img.tag?.toLowerCase() === 'blog2')?.image_url;
  const blog3ImageDb = dbGallery.find(img => img.category === 'blog3' || img.tag?.toLowerCase() === 'blog3')?.image_url;

  // Fallback Data
  const fallbackHeroImages = [{ id: 'hero1', image_url: "/assets/About.png" }];
  const fallbackImages = [
    { id: 'f1', src: "/assets/dummy-gallery-1.jpg", tag: "Kids Parties" },
    { id: 'f2', src: "/assets/dummy-gallery-2.jpg", tag: "Corporate" },
    { id: 'f3', src: "/assets/dummy-gallery-3.jpg", tag: "Carnivals" },
    { id: 'f4', src: "/assets/dummy-gallery-4.jpg", tag: "Family Day" },
    { id: 'f5', src: "/assets/dummy-gallery-5.jpg", tag: "Workshops" },
  ];

  // Set Displays
  const displayHeroImages = heroImagesDb.length > 0 ? heroImagesDb : fallbackHeroImages;
  
  // Pull only "glimpse" category items for the slider (exclude specific ones like hero/founder/blogs)
  const glimpseImages = dbGallery.filter(g => !['hero', 'founder', 'blog1', 'blog2', 'blog3'].includes(g.category) && !['hero', 'founder', 'blog1', 'blog2', 'blog3'].includes(g.tag?.toLowerCase()));
  let displaySlider = glimpseImages.length > 0 ? glimpseImages : fallbackImages;

  // Safety mechanism: The infinite slider logic requires at least 5 images to look correct.
  if (displaySlider.length > 0 && displaySlider.length < 5) {
    const extendedGallery = [...displaySlider];
    while (extendedGallery.length < 5) {
      extendedGallery.push(...displaySlider);
    }
    displaySlider = extendedGallery.slice(0, 5);
  }

  // Hero Auto-Slider Timer
  useEffect(() => {
    if (displayHeroImages.length <= 1) return;
    const timer = setInterval(() => { 
      setHeroIndex((prev) => (prev + 1) % displayHeroImages.length); 
    }, 5000); 
    return () => clearInterval(timer);
  }, [displayHeroImages.length]);

  // Glimpse Slider Timer
  useEffect(() => {
    if (displaySlider.length === 0) return;
    const timer = setInterval(() => { 
      setCurrentIndex((prev) => (prev + 1) % displaySlider.length); 
    }, 3000); 
    return () => clearInterval(timer);
  }, [displaySlider.length]);

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-pink-100 selection:text-brand-navy overflow-hidden relative">
      <BrandLogo />
      <Navbar />
      
      {/* ================= HERO & CORE VALUES ================= */}
      <section className="relative min-h-[95vh] lg:min-h-screen flex flex-col items-center justify-between pt-32 sm:pt-40 pb-12 sm:pb-20 overflow-hidden bg-[#f4f9ff]">
        
        {/* Full Screen Background Slider (DYNAMIC & CLEAR) */}
        <div className="absolute inset-0 z-0 bg-[#1e293b]">
          <AnimatePresence>
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {displayHeroImages[heroIndex]?.image_url?.match(/\.(mp4|webm)$/i) ? (
                <video 
                  src={displayHeroImages[heroIndex].image_url} 
                  className="w-full h-full object-cover object-center" 
                  autoPlay loop muted playsInline 
                />
              ) : (
                <img 
                  src={displayHeroImages[heroIndex]?.image_url} 
                  alt="About Blue Sparrow" 
                  className="w-full h-full object-cover object-center" 
                  onError={(e) => { 
                    e.target.style.display = 'none'; 
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-[#fff6ef]', 'via-[#f0f9ff]', 'to-[#fce7f3]'); 
                  }} 
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Subtle gradients to frame the clear image and ensure text legibility */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/90 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 sm:h-72 bg-gradient-to-t from-[#f4f9ff] via-[#f4f9ff]/80 to-transparent"></div>
        </div>

        {/* Title positioned at the top */}
        <div className="w-full text-center relative z-20 px-4 sm:px-6">
          <StarDoodle className="absolute top-2 left-[5%] sm:left-[20%] w-6 h-6 sm:w-8 sm:h-8 animate-pulse opacity-80" />
          <StarDoodle className="absolute bottom-[-20px] right-[5%] sm:right-[20%] w-4 h-4 sm:w-6 sm:h-6 animate-pulse opacity-80" />
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-serif font-bold text-[#1e293b] tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.9)] relative inline-block">
            About Blue Sparrow
            {/* CSS abstract doodle under title */}
            <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-2 sm:h-4 border-b-[3px] sm:border-b-[4px] border-pink-300 rounded-full opacity-80 rotate-[1deg]"></div>
          </h1>
        </div>

        {/* Cards pushed lower to reveal the center of the image */}
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-20 mt-40 sm:mt-56 lg:mt-80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left relative z-20">
            <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(244,114,182,0.15)] transition-shadow">
              <h3 className="font-bold text-pink-500 mb-2 sm:mb-3 uppercase tracking-widest text-[10px] sm:text-[11px]">Our Vision</h3>
              <p className="text-[#1e293b] font-serif text-[18px] sm:text-[22px] font-bold">No. 1 Kids Edutainer</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] transition-shadow">
              <h3 className="font-bold text-blue-500 mb-2 sm:mb-3 uppercase tracking-widest text-[10px] sm:text-[11px]">Our Mission</h3>
              <p className="text-gray-600 text-[13px] sm:text-[14px] font-medium leading-relaxed">To be the no. 1 events company for parents and corporates when they buy edutainment services for their kids.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] transition-shadow">
              <h3 className="font-bold text-emerald-500 mb-2 sm:mb-3 uppercase tracking-widest text-[10px] sm:text-[11px]">Value Prop</h3>
              <p className="text-gray-600 text-[13px] sm:text-[14px] font-medium leading-relaxed">Delivering meaningful events while making science & art fun for 3 to 11 yr old urban kids.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALIDATION & ROADMAP ================= */}
      <section className="py-16 sm:py-24 bg-[#f4f9ff] relative border-y border-blue-50 overflow-hidden">
        
        {/* Background CSS Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-blue-100 rounded-full blur-[60px] sm:blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] bg-pink-100 rounded-full blur-[50px] sm:blur-[80px] opacity-60"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          
          <div className="text-center mb-10 sm:mb-16 relative">
            <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-2 sm:mb-4 relative inline-block">
              Validation from Market
              <div className="absolute -bottom-1 left-0 w-[110%] h-2 sm:h-3 bg-blue-100 opacity-60 rounded-full rotate-[-1deg] z-[-1] -translate-x-[5%]"></div>
            </h2>
            <p className="text-gray-500 text-[13px] sm:text-[15px]">Our footprint of spreading joy across the nation.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-24 relative z-10">
            {[
              { icon: 'kids', value: '45,000+', label: 'Kids', color: 'text-[#f472b6]' },
              { icon: 'schools', value: '33+', label: 'Schools', color: 'text-[#3b82f6]' },
              { icon: 'events', value: '350+', label: 'Events', color: 'text-[#f59e0b]' },
              { icon: 'workshops', value: '150', label: 'Workshops', color: 'text-[#10b981]' },
              { icon: 'carnivals', value: '24', label: 'Carnivals', color: 'text-[#a855f7]' },
              { icon: 'cities', value: '16', label: 'Cities', color: 'text-[#f43f5e]' },
              { icon: 'teachers', value: '150+', label: 'Teachers', color: 'text-[#06b6d4]' },
              { icon: 'labs', value: '25', label: 'Science Labs', color: 'text-[#6366f1]' }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center text-center group">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[20px] bg-white shadow-sm border border-gray-50 flex items-center justify-center mb-2 sm:mb-4 ${stat.color} group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:scale-105 sm:group-hover:scale-110 transition-all duration-300 relative`}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-current rounded-[16px] sm:rounded-[20px] transition-opacity`}></div>
                  <CssIcon type={stat.icon} />
                </div>
                <h4 className="text-[18px] sm:text-[24px] font-bold text-[#1e293b]">{stat.value}</h4>
                <p className="text-[10px] sm:text-[12px] text-gray-500 font-medium uppercase tracking-wide mt-0.5 sm:mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Winding CSS Roadmap */}
          <div className="relative max-w-4xl mx-auto py-10 mt-10 hidden md:block">
             <svg className="absolute inset-0 w-full h-full text-blue-200" preserveAspectRatio="none" viewBox="0 0 1000 200"><path d="M 50,100 C 200,200 400,0 600,100 S 800,200 950,100" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10"/></svg>
             <div className="relative z-10 flex justify-between items-center h-[200px]">
               <div className="text-center transform -translate-y-8"><div className="w-12 h-12 bg-white rounded-full border-4 border-[#f472b6] mx-auto flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform"><span className="w-4 h-4 bg-[#f472b6] rounded-full animate-pulse"></span></div><h5 className="font-bold text-[#1e293b] text-[18px]">2015</h5><p className="text-[11px] text-gray-500 max-w-[120px] mx-auto leading-tight mt-1">Bringing science parties to vogue</p></div>
               <div className="text-center transform translate-y-12"><div className="w-12 h-12 bg-white rounded-full border-4 border-[#3b82f6] mx-auto flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform"><span className="w-4 h-4 bg-[#3b82f6] rounded-full animate-pulse"></span></div><h5 className="font-bold text-[#1e293b] text-[18px]">2016</h5><p className="text-[11px] text-gray-500 max-w-[120px] mx-auto leading-tight mt-1">Workshop started</p></div>
               <div className="text-center transform -translate-y-12"><div className="w-12 h-12 bg-white rounded-full border-4 border-[#f59e0b] mx-auto flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform"><span className="w-4 h-4 bg-[#f59e0b] rounded-full animate-pulse"></span></div><h5 className="font-bold text-[#1e293b] text-[18px]">2018</h5><p className="text-[11px] text-gray-500 max-w-[120px] mx-auto leading-tight mt-1">First franchise in Pune</p></div>
               <div className="text-center transform translate-y-8"><div className="w-12 h-12 bg-white rounded-full border-4 border-[#10b981] mx-auto flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform"><span className="w-4 h-4 bg-[#10b981] rounded-full animate-pulse"></span></div><h5 className="font-bold text-[#1e293b] text-[18px]">2019</h5><p className="text-[11px] text-gray-500 max-w-[120px] mx-auto leading-tight mt-1">Jio Wonderland. No. 1 choice for kids events</p></div>
             </div>
          </div>
        </div>
      </section>

      {/* ================= THE BLUESPARROW PHILOSOPHY ================= */}
      <section className="py-16 sm:py-24 bg-white relative z-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center relative z-10">
          <div>
            <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-6 sm:mb-10 relative inline-block">
              Our Philosophy
              <div className="absolute bottom-0 sm:bottom-1 left-[-5%] w-[110%] h-2 sm:h-3 bg-yellow-100 opacity-60 rounded-full rotate-[1deg] z-[-1]"></div>
            </h2>
            <div className="mb-6 sm:mb-8 relative group">
              <div className="absolute -left-4 sm:-left-6 top-0.5 sm:top-1 w-1 sm:w-2 h-full bg-pink-100 rounded-full group-hover:bg-pink-400 transition-colors"></div>
              <h4 className="text-[14px] sm:text-[16px] font-bold text-pink-500 mb-1 sm:mb-2 uppercase tracking-wide">Target Group</h4>
              <ul className="list-disc pl-4 sm:pl-5 text-gray-600 text-[13px] sm:text-[15px] space-y-1 sm:space-y-1.5 leading-relaxed">
                <li>Retail spaces for families like malls, stores, realtors, offices.</li>
                <li>Affluent Urban mothers of 3-11yr olds from Urban HNI families.</li>
              </ul>
            </div>
            <div className="mb-6 sm:mb-8 relative group">
              <div className="absolute -left-4 sm:-left-6 top-0.5 sm:top-1 w-1 sm:w-2 h-full bg-blue-100 rounded-full group-hover:bg-blue-400 transition-colors"></div>
              <h4 className="text-[14px] sm:text-[16px] font-bold text-blue-500 mb-1 sm:mb-2 uppercase tracking-wide">The Need</h4>
              <p className="text-gray-600 text-[13px] sm:text-[15px] leading-relaxed">For rearing atma nirbhar kids, society needs GREEN Event planners, edutainers who inspire fascination for Science and arts in an ultra experiential fun design.</p>
            </div>
            <div className="mb-6 relative group">
              <div className="absolute -left-4 sm:-left-6 top-0.5 sm:top-1 w-1 sm:w-2 h-full bg-emerald-100 rounded-full group-hover:bg-emerald-400 transition-colors"></div>
              <h4 className="text-[14px] sm:text-[16px] font-bold text-emerald-500 mb-1 sm:mb-2 uppercase tracking-wide">Point of Difference</h4>
              <p className="text-gray-600 text-[13px] sm:text-[15px] leading-relaxed">Blue Sparrow creates activity-first, learning-led experiences highly engaging for children and commercially valuable for brands.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] text-white p-6 sm:p-10 md:p-14 rounded-[24px] sm:rounded-[40px] shadow-2xl relative overflow-hidden">
            <h3 className="text-[20px] sm:text-[24px] font-serif font-bold text-pink-400 mb-2 sm:mb-4 relative z-10">The Problem</h3>
            <p className="text-blue-50 text-[13px] sm:text-[14px] leading-relaxed mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10 relative z-10">
              Planning green kids' edutainment requires expert child psychology knowledge and hands-on experience, making it time-consuming and expensive.
            </p>
            <h3 className="text-[20px] sm:text-[24px] font-serif font-bold text-emerald-400 mb-2 sm:mb-4 relative z-10">Our Solution</h3>
            <p className="text-blue-50 text-[13px] sm:text-[14px] leading-relaxed relative z-10">
              Combining education with entertainment by organizing science and arts activities to disseminate knowledge in a fun-filled manner.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY HIRE US ================= */}
      <section className="py-16 sm:py-24 bg-[#fffdfa] relative z-20 overflow-hidden border-t border-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-10 sm:mb-16 relative inline-block">
            Why Hire Us?
            <div className="absolute -bottom-1 sm:-bottom-2 left-[10%] w-[80%] h-1 border-b-2 border-dashed border-pink-300 opacity-60"></div>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 text-left">
            <div className="bg-white p-6 sm:p-10 rounded-[20px] sm:rounded-[32px] shadow-sm border border-pink-50 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all relative group overflow-hidden">
              <span className="text-[32px] sm:text-[48px] font-serif text-pink-400 block mb-3 sm:mb-6 leading-none relative z-10">01</span>
              <p className="text-[#1e293b] font-bold text-[13px] sm:text-[16px] leading-relaxed relative z-10">Because you don't want to choose from a set catalogue; you want us to customise as per your audience and specific event goals.</p>
            </div>
            <div className="bg-white p-6 sm:p-10 rounded-[20px] sm:rounded-[32px] shadow-sm border border-blue-50 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all relative group overflow-hidden md:-translate-y-6">
              <span className="text-[32px] sm:text-[48px] font-serif text-blue-400 block mb-3 sm:mb-6 leading-none relative z-10">02</span>
              <p className="text-[#1e293b] font-bold text-[13px] sm:text-[16px] leading-relaxed relative z-10">Cause you don't want your weeks and months of hard work put in the event to be forgotten in 2 days!</p>
            </div>
            <div className="bg-white p-6 sm:p-10 rounded-[20px] sm:rounded-[32px] shadow-sm border border-emerald-50 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all relative group overflow-hidden">
              <span className="text-[32px] sm:text-[48px] font-serif text-emerald-400 block mb-3 sm:mb-6 leading-none relative z-10">03</span>
              <p className="text-[#1e293b] font-bold text-[13px] sm:text-[16px] leading-relaxed relative z-10">Unique Innovative approach, a distinctive blend of science, play, and arts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEET THE TEAM (DYNAMIC) ================= */}
      <section className="py-24 bg-white relative z-20 overflow-hidden">
        {/* CSS abstract curves filling empty space */}
        <div className="absolute top-[10%] left-[5%] w-[20vw] h-[20vw] border-[2px] border-dashed border-purple-100 rounded-full opacity-40 z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-16 relative inline-block">
            Meet The Founder
            <div className="absolute bottom-2 left-[-10%] w-[120%] h-3 bg-pink-100 opacity-60 rounded-full rotate-[1deg] z-[-1]"></div>
          </h2>
          
          <div className="flex flex-col items-center group cursor-pointer w-full max-w-lg mx-auto relative">
            <StarDoodle className="absolute top-10 right-10 w-8 h-8 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
            
            <motion.div 
              animate={{ borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-56 h-56 md:w-72 md:h-72 bg-gradient-to-tr from-pink-300 to-amber-200 p-1 mb-8 shadow-md group-hover:shadow-[0_10px_40px_rgba(244,114,182,0.3)] transition-all duration-500 relative z-10"
            >
              <div className="w-full h-full bg-white rounded-inherit overflow-hidden">
                <img src={founderImageDb || "/assets/team-sanskriti.jpg"} alt="Sanskriti Singh" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => { e.target.style.display='none'; e.target.parentElement.classList.add('bg-gradient-to-br', 'from-pink-100', 'to-pink-50'); }} 
                />
              </div>
            </motion.div>
            
            <h3 className="text-[28px] font-serif font-bold text-[#1e293b] group-hover:text-pink-500 transition-colors mb-2">Sanskriti Singh</h3>
            <p className="text-pink-400 font-bold text-[12px] tracking-[0.2em] uppercase mb-5">Founder</p>
            <div className="flex flex-wrap justify-center gap-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              <span className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">MA in Economics</span>
              <span className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">IIM B 10k Women</span>
              <span className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">IIM-K School Leadership</span>
              <span className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">15yrs exp in Kids Edutainment</span>
            </div>
            <p className="text-gray-500 mt-6 max-w-md text-[15px] leading-relaxed font-light">On a mission to bring alternative teaching methods to masses through meaningful events.</p>
          </div>
        </div>
      </section>

      {/* ================= DYNAMIC MACOS STYLE INFINITE IMAGE SLIDER ================= */}
      <section className="py-16 sm:py-24 bg-[#f4f9ff] relative z-20 overflow-hidden border-y border-blue-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-8 sm:mb-12 text-center">
          <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-serif font-bold text-[#1e293b] mb-2 sm:mb-3">Our World in Color</h2>
          <p className="text-gray-500 text-[13px] sm:text-[15px] font-light">A sneak peek into the beautiful events we've brought to life.</p>
        </div>

        <div className="relative w-full h-[200px] sm:h-[350px] md:h-[450px] flex justify-center items-center overflow-hidden">
          <AnimatePresence>
            {displaySlider.map((img, index) => {
              let offset = index - currentIndex;
              if (offset < -2) offset += displaySlider.length;
              if (offset > 2) offset -= displaySlider.length;

              const isCenter = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;
              const scale = isCenter ? 1.1 : isAdjacent ? 0.8 : 0.6;
              const offsetMultiplier = window.innerWidth < 640 ? 100 : (window.innerWidth < 768 ? 160 : 280); 
              const x = offset * offsetMultiplier; 
              const zIndex = 10 - Math.abs(offset);
              const opacity = Math.abs(offset) <= 2 ? (isCenter ? 1 : isAdjacent ? 0.7 : 0.3) : 0;

              return (
                <motion.div
                  key={img.id || index} 
                  animate={{ x, scale, zIndex, opacity }} 
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute w-[160px] h-[120px] sm:w-[260px] sm:h-[190px] md:w-[380px] md:h-[260px] rounded-[16px] sm:rounded-[32px] overflow-hidden shadow-md bg-white flex-shrink-0"
                >
                  <img 
                    src={img.image_url || img.src} 
                    alt={img.tag || img.category || 'Gallery'} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/60 to-transparent flex items-end justify-center pb-3 sm:pb-6">
                    <span className="text-white font-bold tracking-widest uppercase text-[8px] sm:text-[10px] border border-white/30 bg-black/20 backdrop-blur-md px-3 sm:px-5 py-1 sm:py-2 rounded-full">
                      {img.tag || img.category || 'Event'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= DYNAMIC BLOGS SECTION ================= */}
      <section className="py-24 bg-white relative z-20 overflow-hidden">
        
        {/* CSS abstract doodle shapes */}
        <div className="absolute top-[15%] right-[-5%] w-[30vw] h-[30vw] bg-pink-50 opacity-40 blur-[80px] rounded-full z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          
          <div className="text-center mb-16 relative">
            <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#965a3e] mb-2 relative inline-block">
              Our Blogs
              <div className="absolute -bottom-1 left-0 w-full h-1 border-b-2 border-dashed border-[#965a3e]/30 opacity-60"></div>
            </h2>
            <p className="text-gray-500 mt-3 font-light text-[15px]">Insights, tips, and stories from the event planning world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(150,90,62,0.1)] transition-all duration-500 border border-red-50 p-5 group cursor-pointer relative">
              <div className="absolute top-8 right-8 text-pink-300 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-12 z-10">✨</div>
              <div className="w-full h-52 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center relative">
                <img src={blog1ImageDb || "/assets/blog-1.jpg"} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-[10px] uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 1" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] leading-tight mb-4 px-2 group-hover:text-pink-500 transition-colors">Peppa Pig Birthday Magic at Sofitel, BKC</h4>
              <p className="text-gray-500 text-[13px] font-light leading-relaxed mb-8 px-4 flex-grow">When it comes to making birthday experiences unforgettable, Blue Sparrow Events is well aware of how to turn dreams into reality.</p>
              <button className="border border-[#965a3e]/30 text-[#965a3e] group-hover:bg-[#965a3e] group-hover:text-white transition-colors rounded-full px-8 py-3 text-[13px] font-bold mt-auto mb-2 w-full max-w-[200px]">Read More</button>
            </div>

            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(150,90,62,0.1)] transition-all duration-500 border border-red-50 p-5 group cursor-pointer md:-translate-y-6">
              <div className="w-full h-52 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center">
                <img src={blog2ImageDb || "/assets/blog-2.jpg"} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-[10px] uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 2" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] leading-tight mb-4 px-2 group-hover:text-pink-500 transition-colors">DIY vs. Pro Birthday Planner</h4>
              <p className="text-gray-500 text-[13px] font-light leading-relaxed mb-8 px-4 flex-grow">As we plan a birthday party, one is usually met with a decision: do it yourself and sort everything out individually, or take a pro.</p>
              <button className="border border-[#965a3e]/30 text-[#965a3e] group-hover:bg-[#965a3e] group-hover:text-white transition-colors rounded-full px-8 py-3 text-[13px] font-bold mt-auto mb-2 w-full max-w-[200px]">Read More</button>
            </div>

            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(150,90,62,0.1)] transition-all duration-500 border border-red-50 p-5 group cursor-pointer relative">
              <div className="absolute top-8 left-8 text-blue-300 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -rotate-12 z-10">✦</div>
              <div className="w-full h-52 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center">
                <img src={blog3ImageDb || "/assets/blog-3.jpg"} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-[10px] uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 3" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] leading-tight mb-4 px-2 group-hover:text-pink-500 transition-colors">Planning a Party Around Your Child's Interests</h4>
              <p className="text-gray-500 text-[13px] font-light leading-relaxed mb-8 px-4 flex-grow">Want to throw a birthday bash that's as unique as your child? A party that reflects their wildest dreams, favorite heroes, and biggest passions?</p>
              <button className="border border-[#965a3e]/30 text-[#965a3e] group-hover:bg-[#965a3e] group-hover:text-white transition-colors rounded-full px-8 py-3 text-[13px] font-bold mt-auto mb-2 w-full max-w-[200px]">Read More</button>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutView;