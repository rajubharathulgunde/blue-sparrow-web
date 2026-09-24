import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

const PortfolioView = () => {
  const location = useLocation();
  const initialTab = location.pathname.includes('case-studies') ? 'case-studies' : 'gallery';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Supabase State
  const [galleryItems, setGalleryItems] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data from Supabase
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch published gallery images from the admin 'portfolio_gallery' theme
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('theme_id', 'portfolio_gallery')
          .order('created_at', { ascending: false });
          
        if (galleryError) throw galleryError;
        
        // Fetch published case studies from the admin 'case_studies' theme
        const { data: caseData, error: caseError } = await supabase
          .from('theme_cards')
          .select('*')
          .eq('theme_id', 'case_studies')
          .order('created_at', { ascending: false });
          
        if (caseError) throw caseError;

        setGalleryItems(galleryData || []);
        setCaseStudies(caseData || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();

    // Listen for realtime updates
    const channel1 = supabase.channel('live-portfolio-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchPortfolioData).subscribe();
    const channel2 = supabase.channel('live-case-studies').on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchPortfolioData).subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  const filters = ['All', 'Birthdays', 'Corporate', 'Schools & Malls', 'Carnivals'];

  // Filter based on the 'tag' column which is set via the Admin Dashboard dropdown
  const filteredGallery = activeFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.tag === activeFilter);

  return (
    <main className="font-sans text-gray-600 bg-[#f8fafc] min-h-screen flex flex-col selection:bg-purple-100 selection:text-brand-navy relative overflow-hidden">
      <BrandLogo />
      <Navbar />

      {/* ================= FLOATING CHATBOT WIDGET ================= */}
      <Link 
        to="/contact" 
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#4f46e5] text-white rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.5)] hover:bg-purple-600 hover:shadow-[0_15px_35px_rgba(147,51,234,0.6)] transform hover:-translate-y-1 transition-all duration-300 group"
      >
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </motion.div>
      </Link>

      {/* ================= HERO SECTION ================= */}
      <section className="pt-32 sm:pt-40 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-purple-50 to-[#f8fafc]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-navy mb-4 sm:mb-6 tracking-tight">
            Our Work
          </h1>
          <p className="text-[14px] sm:text-lg text-gray-500 max-w-2xl mx-auto font-light mb-8 sm:mb-10 px-2">
            Explore our visual gallery of past events, or dive deep into our logistical case studies to see exactly how we engineer magic.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex bg-white p-1 sm:p-1.5 rounded-full shadow-sm border border-gray-100 relative">
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`relative px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-[12px] sm:text-sm transition-colors duration-300 ${activeTab === 'gallery' ? 'text-white' : 'text-gray-500 hover:text-brand-navy'}`}
            >
              {activeTab === 'gallery' && (
                <motion.div layoutId="activePill" className="absolute inset-0 bg-[#4f46e5] rounded-full z-0" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <span className="relative z-10">Visual Gallery</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('case-studies')}
              className={`relative px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-[12px] sm:text-sm transition-colors duration-300 ${activeTab === 'case-studies' ? 'text-white' : 'text-gray-500 hover:text-brand-navy'}`}
            >
              {activeTab === 'case-studies' && (
                <motion.div layoutId="activePill" className="absolute inset-0 bg-[#4f46e5] rounded-full z-0" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <span className="relative z-10">Case Studies</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= TAB CONTENT ================= */}
      <section className="px-4 sm:px-6 lg:px-12 pb-20 sm:pb-24 flex-grow">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-[#4f46e5] rounded-full animate-spin"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* GALLERY TAB */}
              {activeTab === 'gallery' && (
                <motion.div 
                  key="gallery"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Category Filters */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                    {filters.map(filter => (
                      <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold transition-all duration-300 border ${
                          activeFilter === filter 
                          ? 'bg-brand-navy text-white border-brand-navy shadow-md' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-brand-navy'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {filteredGallery.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                      <span className="text-4xl block mb-3">🖼️</span>
                      No images uploaded to this category yet.<br/> Head to the Admin panel to add some!
                    </div>
                  ) : (
                    /* Responsive 2-Column Mobile Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                      {filteredGallery.map((item) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          key={item.id} 
                          className="group relative rounded-[16px] sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-square bg-gray-100"
                        >
                          <img 
                            src={item.image_url} 
                            alt={item.title || 'Portfolio Event'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-6">
                            <span className="text-white/80 text-[8px] sm:text-xs font-bold uppercase tracking-widest mb-0.5 sm:mb-1 truncate w-full">
                              {item.title || 'Event Highlight'}
                            </span>
                            <h3 className="text-white font-serif text-[13px] sm:text-2xl font-bold leading-tight">
                              {item.tag || 'Portfolio'}
                            </h3>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* CASE STUDIES TAB */}
              {activeTab === 'case-studies' && (
                <motion.div 
                  key="case-studies"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 sm:space-y-12 max-w-5xl mx-auto"
                >
                  {caseStudies.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                      <span className="text-4xl block mb-3">📘</span>
                      No case studies published yet.<br/> Add them via the Admin Panel.
                    </div>
                  ) : (
                    caseStudies.map((study) => (
                      <div key={study.id} className="bg-white rounded-[24px] sm:rounded-[40px] p-5 sm:p-8 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                          <span className="bg-blue-50 text-blue-600 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest w-fit">
                            {study.icon || 'Case Study'}
                          </span>
                          <h2 className="text-xl sm:text-3xl font-serif font-bold text-brand-navy leading-tight">
                            {study.title}
                          </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                          <div className="bg-[#f8fafc] p-5 sm:p-6 rounded-[20px] sm:rounded-3xl border border-gray-50 flex flex-col justify-center">
                            <h4 className="font-bold text-brand-navy mb-2 text-base sm:text-lg">The Mission</h4>
                            <p className="text-[13px] sm:text-sm text-gray-500 whitespace-pre-wrap leading-relaxed">{study.description}</p>
                          </div>
                          <div className="rounded-[20px] sm:rounded-3xl overflow-hidden h-[200px] sm:h-[300px] shadow-sm bg-gray-100">
                            <img src={study.image_url} className="w-full h-full object-cover" alt={study.title} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PortfolioView;