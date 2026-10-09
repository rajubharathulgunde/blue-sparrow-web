import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

const NeonStar = ({ className, color = "indigo" }) => {
  const gradients = {
    indigo: { stop1: "#818cf8", stop2: "#c084fc" },
    pink: { stop1: "#f472b6", stop2: "#ec4899" },
    cyan: { stop1: "#22d3ee", stop2: "#06b6d4" }
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`star-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradients[color].stop1} />
          <stop offset="100%" stopColor={gradients[color].stop2} />
        </linearGradient>
        <filter id={`glow-${color}`}>
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill={`url(#star-${color})`} filter={`url(#glow-${color})`} />
    </svg>
  );
};

const MallsView = () => {
  const scrollContainerRef = useRef(null);

  const [dbGallery, setDbGallery] = useState([]);
  const [dbCaseStudies, setDbCaseStudies] = useState([]);
  const [dbBlogs, setDbBlogs] = useState([]);
  const [dbTexts, setDbTexts] = useState({});
  const [hiddenCards, setHiddenCards] = useState(new Set()); 

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      // Fetch Gallery
      const { data: gallery } = await supabase.from('gallery_images').select('*').eq('theme_id', 'malls').order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      // Fetch Case Studies
      const { data: caseStudies } = await supabase.from('case_studies').select('*').eq('theme_id', 'malls').order('created_at', { ascending: false });
      if (caseStudies) setDbCaseStudies(caseStudies);

      // Fetch Blogs
      const { data: blogs } = await supabase.from('blogs').select('*').eq('theme_id', 'malls').order('created_at', { ascending: false });
      if (blogs) setDbBlogs(blogs);

      // Fetch Custom Texts
      const { data: texts } = await supabase.from('website_text').select('*').eq('page_id', 'malls');
      if (texts) {
        const textMap = texts.reduce((acc, curr) => ({ ...acc, [curr.text_key]: curr.content }), {});
        setDbTexts(textMap);
      }
    };

    fetchData();

    const channels = [
      supabase.channel('live-malls-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe(),
      supabase.channel('live-malls-cases').on('postgres_changes', { event: '*', schema: 'public', table: 'case_studies' }, fetchData).subscribe(),
      supabase.channel('live-malls-blogs').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchData).subscribe(),
      supabase.channel('live-malls-texts').on('postgres_changes', { event: '*', schema: 'public', table: 'website_text' }, fetchData).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 250 : 450; 
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const scrollAmount = window.innerWidth < 640 ? 250 : 450;
        if (scrollLeft + clientWidth >= scrollWidth - 10) scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        else scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3500); 
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (cardId, type = "card") => {
    setHiddenCards(prev => new Set(prev).add(`${type}-${cardId}`));
  };

  const fallbackImages = [
    { id: 1, image_url: "/assets/carnivals 2026.pdf/10.jpg", title: "Festive Season Atrium", category: "High Footfall" },
    { id: 2, image_url: "/assets/family-day (1).pdf/6.jpg", title: "Brand Product Launch", category: "Activation" },
    { id: 3, image_url: "/assets/family-day (1).pdf/8.jpg", title: "Weekend Kids Zone", category: "Queue Managed" },
    { id: 4, image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/14.jpg", title: "Interactive DIY Booth", category: "Engagement" }
  ];

  const fallbackCaseStudies = [
    { id: 1, title: "Diwali Fest: Central Mall", description: "How we managed a 10-day activation handling 5,000+ children with zero queue friction and glowing tenant feedback.", image_url: "/assets/carnivals 2026.pdf/11.jpg", icon: "FESTIVE" },
    { id: 2, title: "Product Launch: Kids Apparel", description: "Creating an immersive, interactive runway and craft experience that boosted weekend footfall by 40%.", image_url: "/assets/family-day (1).pdf/4.jpg", icon: "BRAND ACTIVATION" }
  ];

  const fallbackBlogs = [
    { id: 1, title: "Maximizing Atrium Space for Engagement", description: "Strategies for converting dead mall zones into high-energy family magnets without disrupting tenant visibility.", image_url: "/assets/carnivals 2026.pdf/1.jpg", icon: "SPATIAL DESIGN", date: "Oct 9, 2026" },
    { id: 2, title: "The Psychology of Queue Management", description: "How to keep parents happy and kids entertained when wait times exceed 20 minutes.", image_url: "/assets/family-day (1).pdf/6.jpg", icon: "OPERATIONS", date: "Sep 28, 2026" },
    { id: 3, title: "Why Edutainment Drives Retail Sales", description: "The direct correlation between hands-on kids activities and increased dwell time in shopping centers.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/16.jpg", icon: "RETAIL TRENDS", date: "Sep 15, 2026" }
  ];

  const heroImageDb = dbGallery.find(img => img.category === 'hero' || img.tag?.toLowerCase() === 'hero')?.image_url;
  const glimpseImages = dbGallery.filter(g => !['hero', 'case_study'].includes(g.category) && !['hero', 'case_study'].includes(g.tag?.toLowerCase()));
  
  const displaySlider = glimpseImages.length > 0 ? glimpseImages : fallbackImages;
  const displayCaseStudies = dbCaseStudies.length > 0 ? dbCaseStudies : fallbackCaseStudies;
  const displayBlogs = dbBlogs.length > 0 ? dbBlogs : fallbackBlogs;

  return (
    <div className="font-sans text-gray-600 bg-[#f4f7fb] min-h-screen flex flex-col selection:bg-indigo-200 selection:text-indigo-900 overflow-x-hidden w-full max-w-[100vw] relative">
      <BrandLogo />
      <Navbar />
      
      {/* ================= FLOATING CHATBOT WIDGET ================= */}
      <Link 
        to="/contact" 
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transform hover:-translate-y-1 transition-all duration-300 group"
      >
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </motion.div>
        <span className="absolute right-full mr-3 sm:mr-4 bg-white/90 backdrop-blur-md text-indigo-900 text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-indigo-100">
          Plan an Activation ✨
        </span>
      </Link>

      {/* ================= FULL SCREEN NEON HERO SECTION ================= */}
      <section className="relative w-full min-h-[95vh] flex items-center bg-[#0f172a] flex-grow overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImageDb || "/assets/Malls and Brands Activites.png"} 
            alt="Malls and Brand Activities" 
            className="w-full h-full object-cover object-[70%_center] md:object-center" 
            onError={(e) => { 
              e.target.style.display = 'none'; 
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-900', 'to-purple-900'); 
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 md:via-black/40 to-transparent w-full md:w-[70%] lg:w-[60%]"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-[#f4f7fb] to-transparent z-10"></div>
        </div>

        <div className="w-full px-5 sm:px-10 lg:pl-16 xl:pl-24 relative z-20 pt-24 sm:pt-28 pb-16 flex flex-col justify-center min-h-[95vh]">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full lg:w-[65%] xl:w-[50%] flex flex-col items-start text-left mt-4 sm:mt-0">
            <NeonStar color="cyan" className="absolute -top-4 sm:-top-6 left-[5%] w-6 h-6 sm:w-8 sm:h-8 animate-pulse opacity-90" />
            <NeonStar color="pink" className="absolute top-[40%] right-[5%] w-4 h-4 sm:w-5 sm:h-5 animate-pulse opacity-70" />
            
            <span className="text-[#22d3ee] font-bold tracking-widest uppercase text-[9px] sm:text-[11px] md:text-sm mb-3 sm:mb-4 block drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
              {dbTexts.hero_badge || "Schools & Brands Activities"}
            </span>
            
            <h1 className="text-[40px] sm:text-[60px] md:text-[76px] lg:text-[84px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 leading-[1.05] tracking-tight mb-4 sm:mb-6 drop-shadow-[0_0_20px_rgba(192,132,252,0.6)] whitespace-pre-line">
              {dbTexts.hero_title || "Brands Activation\nSchools Activites"}
            </h1>
            
            <p className="text-[14px] sm:text-[15px] md:text-[17px] text-gray-100 max-w-xl font-medium leading-relaxed drop-shadow-md bg-black/50 sm:bg-black/30 p-4 sm:p-5 rounded-[16px] sm:rounded-2xl backdrop-blur-sm border border-white/10 mb-6 sm:mb-8 whitespace-pre-line">
              {dbTexts.hero_desc || "We transform retail atriums into powerful family magnets. We engineer the participant flow, manage the queues, and run multi-day programming flawlessly."}
            </p>

            <button onClick={() => window.scrollTo({ top: 850, behavior: 'smooth' })} className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transform hover:-translate-y-1 transition-all duration-300 text-[13px] sm:text-[15px] tracking-wide border border-indigo-300/50 flex items-center gap-2 sm:gap-3">
              {dbTexts.hero_btn || "Explore Activations"} <span className="text-[16px] sm:text-lg">&rarr;</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Ambient Background Globs for Liquid Glass effect in content sections */}
      <div className="fixed top-1/4 -right-32 w-[600px] h-[600px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 -left-32 w-[500px] h-[500px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 pointer-events-none z-0"></div>

      {/* ================= DYNAMIC AUTO IMAGE SLIDER ================= */}
      <section className="py-12 sm:py-24 relative z-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12 relative z-10 gap-4">
           <div className="relative">
             <NeonStar color="indigo" className="absolute -top-3 -left-4 sm:-top-4 sm:-left-6 w-4 h-4 sm:w-5 sm:h-5 animate-pulse opacity-80" />
             <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-1 sm:mb-2 relative inline-block leading-tight">
               {dbTexts.glimpse_title || "Activations in Action"}
               <div className="absolute bottom-0 sm:bottom-1 left-[-5%] w-[110%] h-2 sm:h-3 bg-indigo-100 opacity-60 rounded-full rotate-[1deg] z-[-1]"></div>
             </h2>
             <p className="text-gray-500 text-[13px] sm:text-[16px] font-light mt-1">{dbTexts.glimpse_desc || "See how we transform retail spaces."}</p>
           </div>
           <div className="hidden md:flex gap-3">
             <button onClick={() => scroll(-1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/60 backdrop-blur-md border border-white flex items-center justify-center text-gray-500 hover:bg-white hover:text-indigo-600 transition-all shadow-sm">
               <span className="text-xl">&larr;</span>
             </button>
             <button onClick={() => scroll(1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/60 backdrop-blur-md border border-white flex items-center justify-center text-gray-500 hover:bg-white hover:text-indigo-600 transition-all shadow-sm">
               <span className="text-xl">&rarr;</span>
             </button>
           </div>
        </div>

        <div ref={scrollContainerRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex overflow-x-auto gap-4 sm:gap-8 pb-8 sm:pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth relative z-10">
          <AnimatePresence>
            {displaySlider.map((img, i) => {
              if (hiddenCards.has(`glimpse-${img.id}`)) return null;

              return (
                <motion.div layout key={img.id || i} className="min-w-[240px] sm:min-w-[320px] md:min-w-[480px] h-[200px] sm:h-[300px] md:h-[380px] snap-center group relative rounded-[20px] sm:rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] cursor-pointer">
                  <img 
                    src={img.image_url || img.src} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out p-1 sm:p-2 rounded-[20px] sm:rounded-[32px]" 
                    onError={(e) => handleImageError(img.id, "glimpse")} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/70 via-transparent to-transparent opacity-90"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/70 backdrop-blur-md border border-white/80 p-3 sm:p-5 rounded-[16px] sm:rounded-[24px] shadow-sm transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-indigo-600 font-bold text-[9px] sm:text-[11px] uppercase tracking-widest mb-1 block">
                      {img.category || img.tag || 'Activation'}
                    </span>
                    <h3 className="text-[#1e293b] text-[16px] sm:text-[20px] md:text-[24px] font-serif font-bold leading-tight">{img.title}</h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= CASE STUDIES SECTION (LIQUID GLASS) ================= */}
      <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#1e293b] mb-2">Activation Success Stories</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">See how we drive footfall and manage complex mall events.</p>
            </div>
            <Link to="/portfolio/case-studies" className="hidden sm:inline-flex text-indigo-600 font-bold hover:text-purple-600 transition-colors items-center gap-2 text-[15px]">
              View All Studies <span>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence>
              {displayCaseStudies.map((study, i) => {
                if (hiddenCards.has(`study-${study.id}`)) return null;
                return (
                  <motion.div 
                    layout 
                    key={study.id || i} 
                    className="flex flex-col sm:flex-row bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:bg-white/60 rounded-[24px] overflow-hidden group transition-all duration-500 p-2 sm:p-3"
                  >
                    <div className="w-full sm:w-[45%] h-56 sm:h-auto overflow-hidden relative shrink-0 rounded-[18px]">
                      <img 
                        src={study.image_url} 
                        alt={study.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                        onError={() => handleImageError(study.id, "study")}
                      />
                    </div>
                    <div className="w-full sm:w-[55%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                      <span className="text-indigo-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2 inline-block">
                        {study.icon || "CASE STUDY"}
                      </span>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#1e293b] mb-3 leading-tight">
                        {study.title}
                      </h3>
                      <p className="text-gray-500 font-light text-[13px] sm:text-[14px] leading-relaxed line-clamp-3 mb-6">
                        {study.description}
                      </p>
                      <Link to="/contact" className="inline-flex items-center gap-2 text-[#1e293b] font-bold hover:text-indigo-600 transition-colors w-fit text-[13px] sm:text-[14px] mt-auto">
                        Read Report <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= BLOGS SECTION (LIQUID GLASS) ================= */}
      <section className="pt-10 pb-24 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#1e293b] mb-2">Retail & Activation Insights</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">Strategies to turn passive shoppers into active participants.</p>
            </div>
            <Link to="/contact" className="hidden sm:inline-flex text-indigo-600 font-bold hover:text-purple-600 transition-colors items-center gap-2 text-[15px]">
              View All Articles <span>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence>
              {displayBlogs.map((blog, i) => {
                if (hiddenCards.has(`blog-${blog.id}`)) return null;
                return (
                  <motion.div 
                    layout 
                    key={blog.id || i} 
                    className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:bg-white/60 rounded-[24px] overflow-hidden group transition-all duration-500 flex flex-col p-2 sm:p-2.5"
                  >
                    <div className="w-full aspect-[4/3] overflow-hidden relative shrink-0 rounded-[18px]">
                      <img 
                        src={blog.image_url} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                        onError={() => handleImageError(blog.id, "blog")}
                      />
                    </div>
                    
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] sm:text-[11px] font-bold text-[#4f46e5] uppercase tracking-wider">
                          {blog.icon || "ARTICLE"}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400">{blog.date || "Recent"}</span>
                      </div>
                      
                      <h3 className="text-[18px] sm:text-[20px] font-serif font-bold text-[#1e293b] mb-3 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-500 font-light text-[13px] sm:text-[14px] mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {blog.description}
                      </p>
                      
                      <Link to="/contact" className="text-[13px] sm:text-[14px] font-bold text-[#1e293b] group-hover:text-indigo-600 transition-colors flex items-center gap-1 mt-auto w-fit">
                        Read Article <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link to="/contact" className="inline-flex text-indigo-600 font-bold hover:text-purple-600 transition-colors items-center gap-2 text-[14px]">
              View All Articles <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MallsView;