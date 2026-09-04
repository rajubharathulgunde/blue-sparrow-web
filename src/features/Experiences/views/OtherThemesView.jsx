import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase';

// === DREAMY LOADER ===
const DreamLoader = () => (
  <motion.div 
    key="dream-loader"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    className="fixed inset-0 z-[100] bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center overflow-hidden"
  >
    <div className="relative w-full h-[300px] flex justify-center items-center">
      <motion.div animate={{ y: [10, -10, 10], rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-7xl drop-shadow-[0_10px_20px_rgba(168,85,247,0.2)] relative z-20">✨</motion.div>
      {[...Array(8)].map((_, i) => (
        <motion.div key={`orb-${i}`} className="absolute z-10 rounded-full blur-xl opacity-60" style={{ backgroundColor: ['#fbcfe8', '#bfdbfe', '#e9d5ff', '#fef08a'][i % 4], width: Math.random() * 60 + 40 + 'px', height: Math.random() * 60 + 40 + 'px' }} animate={{ x: Math.random() * 200 - 100, y: Math.random() * 200 - 100, scale: [1, 1.5, 1] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, repeatType: 'reverse' }} />
      ))}
    </div>
    <motion.div className="mt-2 text-center z-50 relative" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-serif font-bold tracking-widest uppercase text-2xl mb-1">Dreaming up ideas...</h2>
      <p className="text-purple-400 text-sm font-medium tracking-wide">Gathering magical moments</p>
    </motion.div>
  </motion.div>
);

const OtherThemesView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // === CMS STATE ===
  const [dbGallery, setDbGallery] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoading(false), 1800);

    // === FETCH LIVE CMS DATA ===
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'other')
        .order('created_at', { ascending: false });
      
      if (data) setDbGallery(data);
    };
    
    fetchGallery();

    // === REALTIME LISTENER ===
    const channel = supabase.channel('live-other-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, () => {
          fetchGallery();
      })
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  // ================= HARDCODED FALLBACKS =================
  const galleryItems = [
    { id: 1, title: "Space Explorers", category: "Adventure", description: "Blast off into a galaxy of fun with astronaut training and glowing planets.", image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", color_gradient: "from-blue-900 to-indigo-900" },
    { id: 2, title: "Dinosaur Dig", category: "Discovery", description: "Unearth ancient fossils and step back into the Jurassic era.", image_url: "https://images.unsplash.com/photo-1590844436573-04e4e949ffad?auto=format&fit=crop&w=800&q=80", color_gradient: "from-emerald-800 to-green-900" },
    { id: 3, title: "Jungle Safari", category: "Adventure", description: "Wild animal encounters, lush greenery, and safari scavenger hunts.", image_url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80", color_gradient: "from-green-700 to-emerald-800" },
    { id: 4, title: "Pirate's Cove", category: "Action", description: "Treasure maps, pirate ships, and a swashbuckling good time.", image_url: "https://images.unsplash.com/photo-1590459529555-520e502cfa98?auto=format&fit=crop&w=800&q=80", color_gradient: "from-amber-800 to-red-900" },
    { id: 5, title: "Under the Sea", category: "Fantasy", description: "Mermaids, bubbles, and beautiful oceanic decorations.", image_url: "https://images.unsplash.com/photo-1518467166778-b88f373ff253?auto=format&fit=crop&w=800&q=80", color_gradient: "from-cyan-600 to-blue-800" },
    { id: 6, title: "Enchanted Garden", category: "Fantasy", description: "Fairies, oversized flowers, and magical woodland creatures.", image_url: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80", color_gradient: "from-pink-500 to-rose-700" },
    { id: 7, title: "Circus Carnival", category: "Action", description: "Step right up for juggling, games, popcorn, and big top thrills.", image_url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80", color_gradient: "from-red-600 to-rose-800" },
    { id: 8, title: "Farmyard Fun", category: "Toddler", description: "Petting zoos, tractors, and barnyard games for the little ones.", image_url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80", color_gradient: "from-yellow-600 to-amber-700" }
  ];

  const filters = ['All', 'Adventure', 'Fantasy', 'Action', 'Discovery', 'Toddler'];

  // Prioritize Database data over Fallback data
  const displayGallery = dbGallery.length > 0 ? dbGallery : galleryItems;

  // ONLY DECLARED ONCE NOW!
  const filteredItems = activeFilter === 'All' 
    ? displayGallery 
    : displayGallery.filter(item => item.category === activeFilter);

  return (
    <div className="font-sans text-[#4a5568] bg-[#fafafa] min-h-screen flex flex-col selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden relative">
      
      <AnimatePresence>
        {isLoading && <DreamLoader />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
        <Navbar />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: 1, delay: 0.2 }} className="flex-grow flex flex-col relative">
        
        <section className="pt-40 lg:pt-48 pb-16 px-6 lg:px-16 relative z-10 max-w-[1500px] mx-auto w-full text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none -z-10"></div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative inline-flex items-center justify-center px-6 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold tracking-widest uppercase text-[11px]">Endless Possibilities</span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[50px] md:text-[70px] lg:text-[80px] font-serif font-bold text-[#2d3748] leading-[1.1] tracking-tight mb-6">
            Dream It. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 italic font-light">We Build It.</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="text-[18px] text-gray-500 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore our vast gallery of custom worlds. From the depths of the ocean to the far reaches of space, if your child can imagine it, we can bring it to life.
          </motion.p>
        </section>

        <section className="px-6 lg:px-16 pb-10 relative z-20 max-w-[1500px] mx-auto w-full">
          <div className="flex flex-wrap justify-center items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-[#2d3748] text-white shadow-md' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 hover:shadow-sm'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="px-6 lg:px-16 pb-24 relative z-10 max-w-[1500px] mx-auto w-full">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div 
                  layout
                  key={item.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white border border-gray-50 cursor-pointer flex flex-col h-[450px]"
                >
                  <div className="w-full h-[75%] relative overflow-hidden bg-gray-100">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#2d3748] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-widest uppercase">
                      {item.category || "Gallery"}
                    </span>
                    
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.color_gradient || 'from-gray-800 to-gray-900'} opacity-0 group-hover:opacity-80 mix-blend-multiply transition-opacity duration-500`}></div>
                    
                    <div className="absolute inset-0 p-6 flex items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                      <p className="text-white font-medium text-[15px] leading-relaxed drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {item.description || "A magical Blue Sparrow experience."}
                      </p>
                    </div>
                  </div>

                  <div className="h-[25%] px-6 flex items-center justify-between bg-white relative z-20">
                    <h3 className="font-serif font-bold text-[22px] text-[#2d3748] leading-tight">
                      {item.title}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#2d3748] group-hover:text-white transition-colors duration-300">
                      <svg className="w-4 h-4 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="px-6 lg:px-16 pb-24 relative z-10 max-w-[1200px] mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full rounded-[40px] bg-gradient-to-br from-indigo-950 to-[#2d3748] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full border border-white/5 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full border border-white/5 translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative z-10">
              <span className="text-purple-300 font-bold tracking-widest uppercase text-sm mb-4 block">End-to-End Execution</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">Don't see your dream theme?</h2>
              <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto font-light">Our in-house design and production team can build absolutely anything from scratch. Bring us an idea, a movie, a book, or a sketch, and we'll transform it into reality.</p>
              
              <Link to="/contact" className="inline-flex items-center justify-center bg-white text-[#2d3748] font-bold py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg">
                Discuss a Custom Theme ✨
              </Link>
            </div>
          </motion.div>
        </section>

      </motion.div>
      <Footer />
    </div>
  );
};

export default OtherThemesView;