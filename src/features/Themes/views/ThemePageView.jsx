import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

const ThemePageView = () => {
  const scrollContainerRef = useRef(null);

  // === CMS STATES ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCards, setDbCards] = useState([]);
  const [dbCaseStudies, setDbCaseStudies] = useState([]);
  const [dbBlogs, setDbBlogs] = useState([]);
  const [dbTexts, setDbTexts] = useState({});
  const [hiddenItems, setHiddenItems] = useState(new Set()); 

  // === HERO AUTO-SLIDER & HOVER STATE ===
  const [heroIndex, setHeroIndex] = useState(0);
  const [hoverColor, setHoverColor] = useState('text-[#0f172a]');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      // Fetch Gallery (Highlights & Hero Slider)
      const { data: gallery } = await supabase.from('gallery_images').select('*').eq('theme_id', 'themes').order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      // Fetch Cards (Categories)
      const { data: cards } = await supabase.from('theme_cards').select('*').eq('theme_id', 'themes').order('created_at', { ascending: true });
      if (cards) setDbCards(cards);

      // Fetch Case Studies
      const { data: caseStudies } = await supabase.from('case_studies').select('*').eq('theme_id', 'themes').order('created_at', { ascending: false });
      if (caseStudies) setDbCaseStudies(caseStudies);

      // Fetch Blogs
      const { data: blogs } = await supabase.from('blogs').select('*').eq('theme_id', 'themes').order('created_at', { ascending: false });
      if (blogs) setDbBlogs(blogs);

      // Fetch Custom Texts
      const { data: texts } = await supabase.from('website_text').select('*').eq('page_id', 'themes');
      if (texts) {
        const textMap = texts.reduce((acc, curr) => ({ ...acc, [curr.text_key]: curr.content }), {});
        setDbTexts(textMap);
      }
    };

    fetchData();

    // Realtime connections
    const channels = [
      supabase.channel('live-themes-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe(),
      supabase.channel('live-themes-cards').on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData).subscribe(),
      supabase.channel('live-themes-cases').on('postgres_changes', { event: '*', schema: 'public', table: 'case_studies' }, fetchData).subscribe(),
      supabase.channel('live-themes-blogs').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchData).subscribe(),
      supabase.channel('live-themes-texts').on('postgres_changes', { event: '*', schema: 'public', table: 'website_text' }, fetchData).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 250 : 400; 
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  const handleImageError = (id, type) => {
    setHiddenItems(prev => new Set(prev).add(`${type}-${id}`));
  };

  // === HERO INTERACTION & SLIDER LOGIC ===
  const handleHeroHover = () => {
    const colors = ['text-pink-500', 'text-cyan-500', 'text-purple-500', 'text-rose-500', 'text-amber-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setHoverColor(randomColor);
  };

  const handleHeroLeave = () => {
    setHoverColor('text-[#0f172a]');
  };

  const heroImages = dbGallery.filter(img => img.category === 'hero' || img.tag?.toLowerCase() === 'hero').map(img => img.image_url);
  const displayHeroImages = heroImages.length > 0 ? heroImages : ["/assets/Harry-potter-theme-ring-decor.webp"];

  useEffect(() => {
    if (displayHeroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % displayHeroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayHeroImages.length]);

  // === FALLBACK DATA (ELEGANT & NATURAL) ===
  const fallbackImages = [
    { id: 1, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/1.jpg", title: "Immersive Environments", category: "Design" },
    { id: 2, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg", title: "Joyful Moments", category: "Experience" },
    { id: 3, image_url: "/assets/family-day (1).pdf/8.jpg", title: "Engaging Activities", category: "Play" },
    { id: 4, image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/3.jpg", title: "Beautiful Details", category: "Decor" }
  ];

  const fallbackCategories = [
    { id: 1, title: "Science Laboratory", description: "Safe, explosive fun. We transform your space into a mind-blowing STEM laboratory where every child gets to be a scientist for the day.", image_url: "/assets/Science2.png", icon: "DISCOVERY" },
    { id: 2, title: "Wizarding Academy", description: "Step into a magical world of spells, potions, and unforgettable enchantment. Your child and their friends will craft wands and brew bubbling potions.", image_url: "/assets/wizarding.png", icon: "MAGIC" },
    { id: 3, title: "Superhero Training", description: "Action-packed adventures for heroes in the making. Watch your kids test their powers and conquer obstacle courses.", image_url: "/assets/Superhero.png", icon: "ACTION" },
    { id: 4, title: "Royal Celebration", description: "A beautifully curated royal experience featuring tiara crafting, magical storytelling, and elegant ballroom games.", image_url: "/assets/Princess.png", icon: "ELEGANCE" }
  ];

  const fallbackCaseStudies = [
    { id: 1, title: "The Ultimate Wizarding Experience", description: "How we turned a residential backyard into a full-scale magical academy, complete with sorting ceremonies and potion masters.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/1.jpg", icon: "CASE STUDY" },
    { id: 2, title: "A STEM Birthday to Remember", description: "Creating a completely interactive science fair birthday that engaged 50 kids for three hours without a single dull moment.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/4.jpg", icon: "CASE STUDY" }
  ];

  const fallbackBlogs = [
    { id: 1, title: "Choosing the Perfect Theme", description: "A parent's guide to matching party themes with your child's current interests and age group.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/3.jpg", icon: "PLANNING", date: "Oct 12, 2026" },
    { id: 2, title: "Why Immersive Play Matters", description: "Moving beyond bounce houses: the cognitive and social benefits of narrative-driven party activities.", image_url: "/assets/Bluesparrow_Party_Themes_Catalogue.pdf/5.jpg", icon: "INSIGHT", date: "Sep 22, 2026" },
    { id: 3, title: "Designing for Impact", description: "Behind the scenes of how our design team crafts environments that feel completely authentic.", image_url: "/assets/family-day (1).pdf/8.jpg", icon: "DESIGN", date: "Sep 05, 2026" }
  ];

  const glimpseImages = dbGallery.filter(g => !['hero', 'case_study'].includes(g.category) && !['hero', 'case_study'].includes(g.tag?.toLowerCase()));
  
  const displaySlider = glimpseImages.length > 0 ? glimpseImages : fallbackImages;
  const displayCategories = dbCards.length > 0 ? dbCards : fallbackCategories;
  const displayCaseStudies = dbCaseStudies.length > 0 ? dbCaseStudies : fallbackCaseStudies;
  const displayBlogs = dbBlogs.length > 0 ? dbBlogs : fallbackBlogs;

  return (
    <div className="font-sans text-gray-600 bg-[#f8fafc] min-h-screen flex flex-col selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden w-full relative">
      <BrandLogo />
      <Navbar />

      {/* ================= AMBIENT LIQUID GLASS BACKGROUND BLOBS ================= */}
      <div className="fixed top-[10%] left-[-10%] w-[500px] h-[500px] bg-teal-200/40 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-rose-200/40 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-[40%] right-[10%] w-[400px] h-[400px] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none z-0"></div>

      {/* ================= ELEGANT AUTO-SLIDER HERO SECTION ================= */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[95vh] flex items-center pt-20 overflow-hidden z-10">
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
                src={displayHeroImages[heroIndex]} 
                alt="Themed Experiences" 
                className="w-full h-full object-cover object-center"
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            </motion.div>
          </AnimatePresence>
          {/* Masking gradients adapted for left alignment */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-full md:w-[70%] lg:w-[60%] z-10"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f8fafc] to-transparent z-10"></div>
        </div>

        <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-12 relative z-20 flex flex-col items-start mt-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="w-full lg:w-[65%] xl:w-[50%] flex flex-col items-start text-left"
          >
            
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              onMouseEnter={handleHeroHover}
              onMouseLeave={handleHeroLeave}
              className={`text-[42px] sm:text-[64px] md:text-[80px] lg:text-[96px] font-serif font-bold ${hoverColor} transition-colors duration-500 leading-[1.05] tracking-tight mb-6 cursor-default`}
            >
              {dbTexts.themes_hero_title || "Worlds Built\nFor Wonder."}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[15px] sm:text-[18px] text-gray-600 max-w-[500px] font-light leading-relaxed mb-10 bg-white/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/60 shadow-sm"
            >
              {dbTexts.themes_hero_desc || "We design breathtaking, immersive themes that turn ordinary celebrations into extraordinary adventures. Choose a world, and let us bring it to life."}
            </motion.p>

            <motion.button 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })} 
              className="bg-[#0f172a] hover:bg-teal-700 text-white font-medium py-3.5 sm:py-4 px-10 sm:px-12 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 text-[14px] sm:text-[15px] tracking-wide"
            >
              {dbTexts.themes_hero_btn || "Explore Themes"}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ================= THEME CATEGORIES (LIQUID GLASS GRID) ================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto text-center mb-12 sm:mb-16">
           <h2 className="text-[32px] sm:text-[42px] font-serif font-bold text-[#0f172a] mb-4">Our Core Themes</h2>
           <p className="text-gray-500 text-[15px] sm:text-[17px] font-light max-w-2xl mx-auto">Meticulously crafted environments tailored to engage, inspire, and entertain.</p>
        </div>

        {/* Updated to a compact, beautiful grid (2 columns mobile, 4 columns large desktop) */}
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <AnimatePresence>
            {displayCategories.map((theme, i) => {
              if (hiddenItems.has(`theme-${theme.id}`)) return null;

              return (
                <motion.div 
                  layout key={theme.id || i} 
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: (i % 4) * 0.1, ease: "easeOut" }} 
                  className="w-full rounded-[20px] sm:rounded-[32px] p-2.5 sm:p-4 bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:bg-white/60 hover:-translate-y-1 transition-all duration-500 group flex flex-col relative"
                >
                   <div className="w-full aspect-[4/5] sm:aspect-[3/4] rounded-[16px] sm:rounded-[24px] overflow-hidden relative mb-3 sm:mb-5 z-10 bg-slate-50">
                     <img 
                       src={theme.image_url} 
                       onError={(e) => handleImageError(theme.id, "theme")} 
                       alt={theme.title} 
                       className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/50 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                     <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md text-[#0f172a] text-[8px] sm:text-[10px] tracking-widest font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm border border-white uppercase">
                       {theme.icon || "THEME"}
                     </span>
                     
                     <h3 className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 font-serif font-bold text-white text-[15px] sm:text-[20px] leading-tight transition-colors drop-shadow-md z-20 pr-2">
                       {theme.title}
                     </h3>
                   </div>
                   
                   <div className="px-1 sm:px-2 pb-1 sm:pb-2 flex-grow flex flex-col z-10">
                     <p className="text-[11px] sm:text-[13px] text-gray-500 mb-3 sm:mb-4 leading-relaxed flex-grow font-light line-clamp-3">{theme.description}</p>
                     
                     <Link to="/contact" className="text-teal-600 font-medium text-[10px] sm:text-[12px] uppercase tracking-wider flex items-center gap-1.5 group-hover:text-teal-800 transition-colors mt-auto w-fit pb-0.5">
                       <span className="hidden sm:inline">Enquire Theme</span>
                       <span className="sm:hidden">Enquire</span>
                       <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                     </Link>
                   </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= EVENT HIGHLIGHTS (LIQUID GLASS SLIDER) ================= */}
      <section className="py-16 sm:py-24 relative z-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12 gap-4">
           <div>
             <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#0f172a] mb-2 leading-tight">
               {dbTexts.themes_glimpse_title || "Moments of Magic"}
             </h2>
             <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">Real celebrations, authentic joy.</p>
           </div>
           <div className="hidden md:flex gap-3">
             <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-white flex items-center justify-center text-gray-600 hover:bg-white hover:text-teal-600 transition-all shadow-sm">
               <span className="text-xl font-light">&larr;</span>
             </button>
             <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-white flex items-center justify-center text-gray-600 hover:bg-white hover:text-teal-600 transition-all shadow-sm">
               <span className="text-xl font-light">&rarr;</span>
             </button>
           </div>
        </div>

        <div ref={scrollContainerRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex overflow-x-auto gap-4 sm:gap-6 pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth relative z-10">
          <AnimatePresence>
            {displaySlider.map((img, i) => {
              if (hiddenItems.has(`glimpse-${img.id}`)) return null;

              return (
                <motion.div layout key={img.id || i} className="min-w-[260px] sm:min-w-[340px] md:min-w-[420px] h-[220px] sm:h-[320px] snap-center group relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm cursor-pointer p-1.5 sm:p-2">
                  <div className="w-full h-full relative rounded-[18px] sm:rounded-[24px] overflow-hidden">
                    <img 
                      src={img.image_url || img.src} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                      onError={() => handleImageError(img.id, "glimpse")} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/80 backdrop-blur-lg border border-white p-4 rounded-xl sm:rounded-2xl shadow-sm transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span className="text-teal-600 font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.15em] mb-1 block">
                        {img.category || img.tag || 'Highlight'}
                      </span>
                      <h3 className="text-[#0f172a] text-[16px] sm:text-[18px] font-serif font-bold leading-tight">{img.title}</h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= CASE STUDIES SECTION (LIQUID GLASS) ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#0f172a] mb-2">Featured Case Studies</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">Deep dives into our most ambitious themed projects.</p>
            </div>
            <Link to="/portfolio/case-studies" className="hidden sm:inline-flex text-[#0f172a] font-medium hover:text-teal-600 transition-colors items-center gap-2 text-[14px] border-b border-gray-300 hover:border-teal-600 pb-1">
              View All Work <span className="text-lg">&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence>
              {displayCaseStudies.map((study, i) => {
                if (hiddenItems.has(`study-${study.id}`)) return null;
                return (
                  <motion.div 
                    layout key={study.id || i} 
                    className="flex flex-col xl:flex-row bg-white/50 backdrop-blur-2xl border border-white/60 shadow-sm hover:shadow-lg rounded-[24px] overflow-hidden group transition-all duration-500 p-2 sm:p-3"
                  >
                    <div className="w-full xl:w-[45%] h-60 xl:h-auto overflow-hidden relative shrink-0 rounded-[18px]">
                      <img 
                        src={study.image_url} 
                        alt={study.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                        onError={() => handleImageError(study.id, "study")}
                      />
                    </div>
                    <div className="w-full xl:w-[55%] p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                      <span className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] mb-2 inline-block">
                        {study.icon || "PROJECT"}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] mb-3 leading-snug group-hover:text-teal-700 transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-gray-500 font-light text-[13px] sm:text-[15px] leading-relaxed line-clamp-3 mb-6">
                        {study.description}
                      </p>
                      <Link to="/contact" className="inline-flex items-center gap-2 text-[#0f172a] font-medium hover:text-teal-600 transition-colors w-fit text-[13px] sm:text-[14px] mt-auto">
                        Explore Project <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
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
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto border-t border-gray-200/50 pt-16">
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#0f172a] mb-2">Thoughts & Ideas</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">Insights on event design, parenting, and play.</p>
            </div>
            <Link to="/contact" className="hidden sm:inline-flex text-[#0f172a] font-medium hover:text-teal-600 transition-colors items-center gap-2 text-[14px] border-b border-gray-300 hover:border-teal-600 pb-1">
              Read the Journal <span className="text-lg">&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence>
              {displayBlogs.map((blog, i) => {
                if (hiddenItems.has(`blog-${blog.id}`)) return null;
                return (
                  <motion.div 
                    layout key={blog.id || i} 
                    className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-md rounded-[24px] overflow-hidden group transition-all duration-500 flex flex-col p-2.5"
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
                        <span className="text-[10px] sm:text-[11px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                          {blog.icon || "ARTICLE"}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400 tracking-wide">{blog.date || "Recent"}</span>
                      </div>
                      
                      <h3 className="text-[18px] sm:text-[20px] font-serif font-bold text-[#0f172a] mb-3 line-clamp-2 leading-snug group-hover:text-teal-700 transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-500 font-light text-[13px] sm:text-[14px] mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {blog.description}
                      </p>
                      
                      <Link to="/contact" className="text-[13px] sm:text-[14px] font-medium text-[#0f172a] group-hover:text-teal-600 transition-colors flex items-center gap-2 mt-auto w-fit border-b border-transparent group-hover:border-teal-200 pb-0.5">
                        Read Story <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          <div className="mt-10 text-center sm:hidden">
             <Link to="/contact" className="inline-flex text-[#0f172a] font-medium hover:text-teal-600 transition-colors items-center gap-2 text-[14px] border-b border-gray-300 pb-1">
              Read the Journal <span className="text-lg">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThemePageView;