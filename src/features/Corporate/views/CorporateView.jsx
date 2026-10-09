import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

// Reusable Star Doodle for Corporate Theme
const CorporateStar = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="corpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="url(#corpGrad)" />
  </svg>
);

const CorporateView = () => {
  const scrollContainerRef = useRef(null);
  
  // === CMS STATES ===
  const [dbGallery, setDbGallery] = useState([]);
  const [dbCaseStudies, setDbCaseStudies] = useState([]); 
  const [dbBlogs, setDbBlogs] = useState([]); 

  useEffect(() => {
    window.scrollTo(0, 0);

    // === FETCH CMS DATA ===
    const fetchData = async () => {
      // 1. Fetch Event Highlights Gallery
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'corporate')
        .order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      // 2. Fetch Case Studies
      const { data: caseStudies } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });
      if (caseStudies) setDbCaseStudies(caseStudies);

      // 3. Fetch Blogs
      const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (blogs) setDbBlogs(blogs);
    };

    fetchData();

    // === REALTIME LISTENERS ===
    const channels = [
      supabase.channel('live-corporate-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe(),
      supabase.channel('live-case-studies').on('postgres_changes', { event: '*', schema: 'public', table: 'case_studies' }, fetchData).subscribe(),
      supabase.channel('live-blogs').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchData).subscribe()
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
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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

  const fallbackCaseStudies = [
    { id: 1, title: "TechCorp Annual Retreat", description: "How we organized a 3-day creative retreat focusing on mental wellness, collaborative art, and team bonding for 500+ employees.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/1.jpg", icon: "CASE STUDY" },
    { id: 2, title: "Finance Group Family Day", description: "A seamless transition from a corporate campus to a full-scale family carnival featuring science shows and DIY stations.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/2.jpg", icon: "CASE STUDY" }
  ];

  const fallbackBlogs = [
    { id: 1, title: "Top Team Building Trends for 2026", description: "Move past the trust falls. Discover how hands-on art and science workshops are transforming corporate culture.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/3.jpg", icon: "CULTURE", date: "Oct 9, 2026" },
    { id: 2, title: "The ROI of Employee Engagement Events", description: "Understanding why investing in high-quality experiential events leads to better retention and productivity.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/4.jpg", icon: "INSIGHTS", date: "Sep 28, 2026" },
    { id: 3, title: "Planning a Sustainable Corporate Event", description: "A comprehensive guide to reducing waste and ensuring your next company gathering is eco-friendly.", image_url: "/assets/Blue_Sparrow_Corporate_Events_Complete_Workshop_Brochure.pdf/5.jpg", icon: "GUIDE", date: "Sep 15, 2026" }
  ];

  const displaySlider = dbGallery.length > 0 ? dbGallery : fallbackImages;
  const displayCaseStudies = dbCaseStudies.length > 0 ? dbCaseStudies : fallbackCaseStudies;
  const displayBlogs = dbBlogs.length > 0 ? dbBlogs : fallbackBlogs;

  return (
    <div className="font-sans text-gray-600 bg-[#f4f7fb] min-h-screen flex flex-col selection:bg-blue-100 selection:text-brand-navy overflow-hidden relative">
      <BrandLogo />
      <Navbar />
      
      {/* ================= FLOATING CHATBOT WIDGET ================= */}
      <Link 
        to="/contact" 
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#4f46e5] text-white rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.5)] hover:bg-blue-600 hover:shadow-[0_15px_35px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 transition-all duration-300 group"
      >
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </motion.div>
      </Link>
      
      {/* ================= FULL SCREEN IMAGE HERO SECTION ================= */}
      <section className="relative w-full min-h-[95vh] flex items-center overflow-hidden bg-white flex-grow">
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
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 md:via-white/40 to-transparent w-full md:w-[70%] lg:w-[60%]"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-[#f4f7fb] to-transparent z-10"></div>
        </div>

        <div className="w-full px-5 sm:px-10 lg:pl-16 xl:pl-24 relative z-20 pt-24 sm:pt-28 pb-16 flex flex-col justify-center min-h-[95vh]">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="w-full lg:w-[65%] xl:w-[50%] flex flex-col items-start text-left relative z-20 mt-4 sm:mt-0"
          >
            
            <span className="bg-white/80 backdrop-blur-md px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-blue-100 text-blue-600 font-bold tracking-widest uppercase text-[9px] sm:text-[11px] md:text-sm mb-4 sm:mb-6 inline-block shadow-sm relative">
              Corporate Experiences
              <div className="absolute -bottom-1.5 sm:-bottom-2 left-[-5%] w-[110%] h-1 border-b-[2px] border-dashed border-blue-200 rounded-full opacity-80 rotate-[-1deg]"></div>
            </span>
            
            <h1 className="text-[40px] sm:text-[60px] md:text-[76px] lg:text-[84px] font-serif font-bold text-[#1e293b] leading-[1.05] tracking-tight mb-3 sm:mb-4 drop-shadow-sm">
              Corporate Activities, <br className="hidden sm:block" /> Reimagined.
            </h1>
            
            <p className="text-[14px] sm:text-[15px] md:text-[17px] text-[#1e293b] max-w-[500px] font-medium leading-relaxed bg-white/40 sm:bg-white/30 backdrop-blur-xl p-3.5 sm:p-4 md:p-6 rounded-[16px] sm:rounded-2xl border border-white/60 shadow-sm mb-6 sm:mb-8">
              Meaningful, hands-on workshops designed to inspire creativity, foster collaboration, and bring your team together through shared, unforgettable experiences.
            </p>

            <button onClick={() => window.scrollTo({ top: 850, behavior: 'smooth' })} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-[13px] sm:text-[15px] flex items-center gap-2 sm:gap-3">
              View Success Stories <span className="text-[16px] sm:text-lg">&rarr;</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Background Soft Glow Elements to Enhance Glassmorphism */}
      <div className="fixed top-1/4 -right-32 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 -left-32 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 pointer-events-none z-0"></div>

      {/* ================= DYNAMIC AUTO IMAGE SLIDER (EVENT HIGHLIGHTS) ================= */}
      <section className="py-12 sm:py-20 relative z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12 gap-4">
           <div className="relative">
             <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-1 sm:mb-2 relative inline-block leading-tight">
               Event Highlights
               <div className="absolute bottom-0 sm:bottom-1 left-[-5%] w-[110%] h-2 sm:h-3 bg-blue-100 opacity-60 rounded-full rotate-[1deg] z-[-1]"></div>
             </h2>
             <p className="text-gray-500 text-[13px] sm:text-[16px] font-light mt-1">Watch teams connect and create in action.</p>
           </div>
           <div className="hidden md:flex gap-3">
             <button onClick={() => scroll(-1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/60 backdrop-blur-md border border-white flex items-center justify-center text-gray-600 hover:bg-white transition-all shadow-sm">
               <span className="text-xl">&larr;</span>
             </button>
             <button onClick={() => scroll(1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/60 backdrop-blur-md border border-white flex items-center justify-center text-gray-600 hover:bg-white transition-all shadow-sm">
               <span className="text-xl">&rarr;</span>
             </button>
           </div>
        </div>

        <div ref={scrollContainerRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex overflow-x-auto gap-4 sm:gap-8 pb-8 sm:pb-10 hide-scrollbar snap-x snap-mandatory scroll-smooth">
          <AnimatePresence>
            {displaySlider.map((img, i) => (
              <motion.div layout key={img.id || i} className="min-w-[240px] sm:min-w-[320px] md:min-w-[480px] h-[200px] sm:h-[300px] md:h-[380px] snap-center group relative rounded-[20px] sm:rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] cursor-pointer">
                <img 
                  src={img.image_url || img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out p-1 sm:p-2 rounded-[20px] sm:rounded-[32px]" 
                  onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/70 backdrop-blur-md border border-white/80 p-3 sm:p-5 rounded-[16px] sm:rounded-[24px] shadow-sm transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-blue-600 font-bold text-[9px] sm:text-[11px] uppercase tracking-widest mb-1 block">
                    {img.category || img.tag || "Event"}
                  </span>
                  <h3 className="text-[#1e293b] text-[16px] sm:text-[20px] md:text-[24px] font-serif font-bold leading-tight">{img.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= CASE STUDIES SECTION ================= */}
      <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#1e293b] mb-2">Corporate Success Stories</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">See how we transform office cultures through shared experiences.</p>
            </div>
            <Link to="/portfolio/case-studies" className="hidden sm:inline-flex text-blue-600 font-bold hover:text-indigo-600 transition-colors items-center gap-2 text-[15px]">
              View All Studies <span>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence>
              {displayCaseStudies.map((study, i) => (
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
                      onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                    />
                  </div>
                  <div className="w-full sm:w-[55%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                    <span className="text-blue-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2 inline-block">
                      {study.icon || "CASE STUDY"}
                    </span>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#1e293b] mb-3 leading-tight">
                      {study.title}
                    </h3>
                    <p className="text-gray-500 font-light text-[13px] sm:text-[14px] leading-relaxed line-clamp-3 mb-6">
                      {study.description}
                    </p>
                    <Link to="/contact" className="inline-flex items-center gap-2 text-[#1e293b] font-bold hover:text-blue-600 transition-colors w-fit text-[13px] sm:text-[14px] mt-auto">
                      Read Report <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= BLOGS SECTION ================= */}
      <section className="pt-10 pb-24 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-serif font-bold text-[#1e293b] mb-2">Corporate Insights & News</h2>
              <p className="text-gray-500 text-[14px] sm:text-[16px] font-light">Strategies and inspiration for your next team gathering.</p>
            </div>
            <Link to="/contact" className="hidden sm:inline-flex text-blue-600 font-bold hover:text-indigo-600 transition-colors items-center gap-2 text-[15px]">
              View All Articles <span>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence>
              {displayBlogs.map((blog, i) => (
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
                      onError={(e) => e.target.src = e.target.src.replace('.jpg', '.png')}
                    />
                  </div>
                  
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] sm:text-[11px] font-bold text-[#4f46e5] uppercase tracking-wider">
                        {blog.icon || "ARTICLE"}
                      </span>
                      <span className="text-[11px] font-medium text-gray-400">{blog.date || "Recent"}</span>
                    </div>
                    
                    <h3 className="text-[18px] sm:text-[20px] font-serif font-bold text-[#1e293b] mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-500 font-light text-[13px] sm:text-[14px] mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {blog.description}
                    </p>
                    
                    
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link to="/contact" className="inline-flex text-blue-600 font-bold hover:text-indigo-600 transition-colors items-center gap-2 text-[14px]">
              View All Articles <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorporateView;