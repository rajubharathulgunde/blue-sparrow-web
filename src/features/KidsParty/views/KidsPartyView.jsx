import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

const KidsPartyView = () => {
  const scrollContainerRef = useRef(null);
  
  // === INTRO ANIMATION STATE ===
  const [showIntro, setShowIntro] = useState(false);

  // === CMS & CARD STATES ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCards, setDbCards] = useState([]); // Used for Themes
  const [dbCaseStudies, setDbCaseStudies] = useState([]); // Separated CMS for Case Studies
  const [dbBlogs, setDbBlogs] = useState([]); // Separated CMS for Blogs
  const [dbTexts, setDbTexts] = useState({});
  const [hiddenCards, setHiddenCards] = useState(new Set()); 
  
  // === DYNAMIC HERO SLIDESHOW STATE ===
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroImages, setHeroImages] = useState([
    "/assets/Birthday Section.png",
    "/assets/Birthday.png"
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Hide rainbow intro after 3.5 seconds
    const introTimer = setTimeout(() => setShowIntro(false), 3500);

    // === FETCH CMS DATA ===
    const fetchData = async () => {
      // 1. Fetch Images (Gallery & Hero)
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'birthday')
        .order('created_at', { ascending: false });
        
      if (gallery) {
        setDbGallery(gallery);
        const heroes = gallery.filter(g => g.category === 'hero').map(g => g.image_url);
        if (heroes.length > 0) setHeroImages(heroes);
      }

      // 2. Fetch Theme Cards
      const { data: cards } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'birthday')
        .order('created_at', { ascending: true });
      if (cards) setDbCards(cards);

      // 3. Fetch Case Studies
      const { data: caseStudies } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });
      if (caseStudies) setDbCaseStudies(caseStudies);

      // 4. Fetch Blogs
      const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (blogs) setDbBlogs(blogs);

      // 5. Fetch Dynamic Text
      const { data: texts } = await supabase
        .from('website_text')
        .select('*')
        .eq('page_id', 'birthday');
      if (texts) {
        const textMap = texts.reduce((acc, curr) => ({ ...acc, [curr.text_key]: curr.content }), {});
        setDbTexts(textMap);
      }
    };

    fetchData();

    // === REALTIME LISTENERS ===
    const channels = [
      supabase.channel('live-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe(),
      supabase.channel('live-cards').on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData).subscribe(),
      supabase.channel('live-case-studies').on('postgres_changes', { event: '*', schema: 'public', table: 'case_studies' }, fetchData).subscribe(),
      supabase.channel('live-blogs').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchData).subscribe(),
      supabase.channel('live-texts').on('postgres_changes', { event: '*', schema: 'public', table: 'website_text' }, fetchData).subscribe()
    ];

    return () => {
      clearTimeout(introTimer);
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  // Update Hero interval dynamically if heroImages changes
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(heroTimer);
  }, [heroImages.length]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 250 : 350;
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const scrollAmount = window.innerWidth < 640 ? 250 : 350;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (cardId, type = "card") => {
    setHiddenCards(prev => new Set(prev).add(`${type}-${cardId}`));
  };

  // === FALLBACK DATA ===
  const fallbackImages = [
    { id: 1, image_url: "/assets/family-day (1).pdf/6.jpg", title: "Astronomy" },
    { id: 2, image_url: "/assets/family-day (1).pdf/4.jpg", title: "Laboratory" },
    { id: 3, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/1.jpg", title: "Celebration" },
    { id: 4, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg", title: "Fun & Games" },
    { id: 5, image_url: "/assets/carnivals 2026.pdf/11.jpg", title: "Sci-Fi Fun" },
  ];

  const fallbackCards = [
    { id: 3, title: "Frozen Princess Party", description: "A magical celebration filled with wonder, creativity, and icy fun! Includes Snow Volcanoes, Wand Making, and Princess Training.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/3.jpg", icon: "FEATURED" },
    { id: 4, title: "Peppa's Muddy Puddles", description: "Oink oink! Jump into muddy puddles with Peppa Pig themed sensory bins, craft stations, and a vibrant picnic setup.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg", icon: "TODDLERS" },
    { id: 5, title: "Superhero Academy", description: "Calling all heroes! Features an obstacle course, cape designing, and a special graduation ceremony to get their hero licenses.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/5.jpg", icon: "ACTION PACKED" }
  ];

  const fallbackCaseStudies = [
    { id: 1, title: "The Ultimate Carnival Birthday", description: "How we turned a regular backyard into a full-scale carnival with 10 game stalls, a live MC, and magical science shows.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/1.jpg", icon: "CASE STUDY" },
    { id: 2, title: "Space Explorer Setup", description: "A deep dive into our most immersive space-themed birthday, featuring real telescope viewing and astronaut training courses.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/2.jpg", icon: "CASE STUDY" }
  ];

  const fallbackBlogs = [
    { id: 1, title: "Top 5 Party Trends for 2026", description: "Discover the latest trends in kids entertainment, from interactive science to immersive storytelling.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/3.jpg", icon: "PARTY TIPS", date: "Oct 9, 2026" },
    { id: 2, title: "How to Plan a Stress-Free Birthday", description: "Our ultimate guide for parents who want to enjoy the party as much as the kids do.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg", icon: "GUIDE", date: "Sep 28, 2026" },
    { id: 3, title: "Why Edutainment is Winning", description: "Combining education with entertainment is the secret to a memorable event.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/5.jpg", icon: "INSIGHTS", date: "Sep 15, 2026" }
  ];

  const glimpseImages = dbGallery.filter(g => g.category === 'glimpse' || !g.category);
  const displaySlider = glimpseImages.length > 0 ? glimpseImages : fallbackImages;
  
  // MVVM architecture mappings
  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;
  const displayCaseStudies = dbCaseStudies.length > 0 ? dbCaseStudies : fallbackCaseStudies;
  const displayBlogs = dbBlogs.length > 0 ? dbBlogs : fallbackBlogs;

  return (
    <div className="font-sans text-gray-600 bg-[#f8fafc] min-h-screen flex flex-col selection:bg-brand-pink selection:text-brand-navy overflow-hidden relative">
      
      {/* ================= WELCOME RAINBOW ANIMATION ================= */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            exit={{ opacity: 0, filter: "blur(10px)" }} 
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="relative w-full max-w-2xl px-6 flex items-end justify-center mb-6 sm:mb-8">
              <svg viewBox="0 0 1000 500" className="w-full h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <motion.path d="M 50 500 A 450 450 0 0 1 950 500" stroke="#ef4444" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
                <motion.path d="M 72 500 A 428 428 0 0 1 928 500" stroke="#f97316" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }} />
                <motion.path d="M 94 500 A 406 406 0 0 1 906 500" stroke="#eab308" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} />
                <motion.path d="M 116 500 A 384 384 0 0 1 884 500" stroke="#22c55e" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }} />
                <motion.path d="M 138 500 A 362 362 0 0 1 862 500" stroke="#3b82f6" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }} />
                <motion.path d="M 160 500 A 340 340 0 0 1 840 500" stroke="#6366f1" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} />
                <motion.path d="M 182 500 A 318 318 0 0 1 818 500" stroke="#a855f7" strokeWidth="20" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }} />
              </svg>

              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, repeatDelay: 1 }} className="absolute bottom-[5%] right-[5%] text-2xl sm:text-3xl md:text-5xl drop-shadow-md">✨</motion.div>
              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }} transition={{ duration: 1.5, delay: 1.8, repeat: Infinity, repeatDelay: 1 }} className="absolute bottom-[15%] right-[15%] text-3xl sm:text-4xl md:text-6xl drop-shadow-md">🌟</motion.div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.5, duration: 1 }}
              className="text-white font-serif text-[22px] sm:text-3xl md:text-5xl font-bold mt-[-20px] sm:mt-[-30px] z-10 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-center px-4"
            >
              {dbTexts.intro_text || "Welcome to the Magic"}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <BrandLogo />
      <Navbar />
      
      {/* ================= FULL SCREEN NEON HERO SECTION ================= */}
      <section className="relative w-full min-h-[95vh] flex items-center bg-[#0f172a] flex-grow overflow-hidden">
        
        {/* Full Screen Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={heroImages[heroIndex]} 
                alt="Magical Birthday Experiences" 
                className="w-full h-full object-cover object-[70%_center] md:object-center"
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent w-full md:w-[70%]"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f8fafc] to-transparent z-10"></div>
        </div>

        {/* Foreground Content */}
        <div className="w-full px-5 sm:px-6 lg:pl-12 xl:pl-20 relative z-20 pt-28 sm:pt-28 pb-16 flex flex-col justify-center min-h-[95vh]">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 3.2, ease: "easeOut" }} 
            className="w-full lg:w-[70%] xl:w-[50%] flex flex-col items-start text-left mt-8 sm:mt-0"
          >
            <span className="text-[#06b6d4] font-bold tracking-widest uppercase text-[10px] sm:text-sm mb-3 sm:mb-4 block drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              {dbTexts.hero_badge || "Kids Parties"}
            </span>
            
            <h1 className="text-[44px] leading-[1.05] sm:text-6xl md:text-8xl lg:text-[100px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 sm:leading-[1.1] mb-5 sm:mb-6 drop-shadow-[0_0_25px_rgba(236,72,153,0.8)] whitespace-pre-line">
              {dbTexts.hero_title || "Magical Birthdays,\nCome to Life."}
            </h1>
            
            <p className="text-[14px] sm:text-lg text-gray-100 max-w-xl font-medium leading-relaxed drop-shadow-md bg-black/40 sm:bg-black/30 p-4 sm:p-5 rounded-[16px] sm:rounded-2xl backdrop-blur-sm border border-white/10 whitespace-pre-line">
              {dbTexts.hero_desc || "From immersive decorations to engaging activities, we turn your child's favorite dreams and stories into unforgettable celebrations."}
            </p>

            <Link to="/contact" className="mt-8 sm:mt-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] transform hover:-translate-y-1 transition-all duration-300 text-[14px] sm:text-[16px] tracking-wide border border-pink-300/50 inline-block text-center">
              {dbTexts.hero_button || "Plan a Celebration"}
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* ================= DYNAMIC AUTO IMAGE SLIDER ================= */}
      <section className="py-10 sm:py-12 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-4">
           <div>
             <h2 className="text-[24px] sm:text-[28px] font-serif font-bold text-brand-navy mb-1 leading-tight">{dbTexts.glimpse_title || "A Glimpse of the Magic"}</h2>
             <p className="text-gray-500 text-[13px] sm:text-[15px]">{dbTexts.glimpse_desc || "Kids enjoying space suits, lab experiments & celebrations!"}</p>
           </div>
           <div className="hidden md:flex gap-3">
             <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
             </button>
             <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
           </div>
        </div>

        <div ref={scrollContainerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex overflow-x-auto gap-4 sm:gap-6 pb-6 hide-scrollbar snap-x snap-mandatory scroll-smooth">
          <AnimatePresence>
            {displaySlider.map((img, i) => {
              if (hiddenCards.has(`glimpse-${img.id}`)) return null;

              return (
                <motion.div layout key={img.id || i} className="min-w-[220px] sm:min-w-[280px] md:min-w-[320px] h-[160px] sm:h-[220px] snap-center group relative rounded-[20px] sm:rounded-3xl overflow-hidden shadow-soft">
                  <img 
                    src={img.image_url || img.src} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={() => handleImageError(img.id, "glimpse")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/90 backdrop-blur-sm text-pink-500 text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {img.title || img.tag || 'Magic'}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= CASE STUDIES SECTION (LIQUID GLASS + COMPACT GRID) ================= */}
      {/* Background decoration elements to enhance the glassmorphism effect */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="absolute top-10 right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-brand-navy mb-2">Success Stories</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px]">See how we transform ordinary spaces into extraordinary adventures.</p>
            </div>
            <Link to="/portfolio/case-studies" className="hidden sm:inline-flex text-brand-navy font-bold hover:text-pink-500 transition-colors items-center gap-2 text-[15px]">
              View All Case Studies
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
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
                    className="flex flex-col sm:flex-row bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[24px] overflow-hidden group transition-all duration-500"
                  >
                    <div className="w-full sm:w-[40%] h-48 sm:h-auto overflow-hidden relative shrink-0">
                      <img 
                        src={study.image_url} 
                        alt={study.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        onError={() => handleImageError(study.id, "study")}
                      />
                    </div>
                    <div className="w-full sm:w-[60%] p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                      <span className="text-pink-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2 inline-block">
                        {study.icon || "CASE STUDY"}
                      </span>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-brand-navy mb-2 leading-tight">
                        {study.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-[13px] sm:text-[14px] leading-relaxed line-clamp-3">
                        {study.description}
                      </p>
                      <Link to="/contact" className="inline-flex items-center gap-2 text-brand-navy font-bold hover:text-pink-500 transition-colors w-fit text-[13px] sm:text-[14px] mt-auto">
                        Read Story
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= BLOGS SECTION (LIQUID GLASS + GRID) ================= */}
      <section className="pt-12 pb-24 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-brand-navy mb-2">Latest from Our Blog</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px]">Event tips, party inspiration, and behind-the-scenes magic.</p>
            </div>
            <Link to="/contact" className="hidden sm:inline-flex text-brand-navy font-bold hover:text-blue-500 transition-colors items-center gap-2 text-[15px]">
              View All Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
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
                    className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:bg-white/50 rounded-[24px] overflow-hidden group transition-all duration-500 flex flex-col"
                  >
                    <div className="w-full aspect-[4/3] overflow-hidden relative shrink-0">
                      <img 
                        src={blog.image_url} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        onError={() => handleImageError(blog.id, "blog")}
                      />
                    </div>
                    
                    <div className="p-5 sm:p-7 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 bg-blue-100/50 backdrop-blur-sm border border-blue-200/50 px-3 py-1 rounded-full uppercase tracking-wider">
                          {blog.icon || "PARTY TIPS"}
                        </span>
                        <span className="text-[11px] font-medium text-gray-500">{blog.date || "Recent"}</span>
                      </div>
                      
                      <h3 className="text-[18px] sm:text-[22px] font-serif font-bold text-brand-navy mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 text-[13px] sm:text-[14px] mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {blog.description}
                      </p>
                      
                      <Link to="/contact" className="text-[13px] sm:text-[14px] font-bold text-brand-navy group-hover:text-blue-600 transition-colors flex items-center gap-1 mt-auto w-fit">
                        Read Article 
                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link to="/contact" className="inline-flex text-brand-navy font-bold hover:text-blue-500 transition-colors items-center gap-2 text-[14px]">
              View All Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KidsPartyView;