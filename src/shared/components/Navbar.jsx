import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[98%] max-w-[1400px] bg-white/90 backdrop-blur-xl border border-white/60 rounded-full shadow-soft flex items-center justify-between px-4 lg:px-6 py-3 z-[60] transition-all duration-500">
        
        {/* LEFT: Logo Section */}
     <Link
  to="/"
  onClick={closeMenu}
  className="flex items-center gap-3 cursor-pointer group shrink-0"
>
  <text
    Text="Blue Sparrow Events"
    alt="Blue Sparrow Events"
    className="h-12 xl:h-13 w-auto object-contain"
  />
</Link>

        {/* CENTER: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          <Link to="/" className="text-brand-navy font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300">Home</Link>
          <Link to="/about" className="text-gray-600 font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300">About Us</Link>
          <Link to="/kids-parties" className="text-gray-600 font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300">Birthday Party</Link>
          <Link to="/corporate" className="text-gray-600 font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300">Corporate Family Days</Link>
          <Link to="/carnivals" className="text-gray-600 font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300">Carnival</Link>
          <Link to="/family-day" className="text-gray-600 font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300">Family Day</Link>
          <Link to="/malls" className="text-gray-600 font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300">Malls & Brand Activities</Link>
          
          {/* THEMES DROPDOWN (Renamed from Experiences) */}
          <div className="relative group">
            <span className="text-gray-600 font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300 flex items-center gap-1 cursor-pointer py-2">
              Themes <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#4f46e5] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-floating opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
              <Link to="/theme/science" className="px-5 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Science</Link>
              <Link to="/theme/wizarding" className="px-5 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors">Wizarding</Link>
              <Link to="/theme/princess" className="px-5 py-3 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors">Princess</Link>
              <Link to="/theme/superhero" className="px-5 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">Superhero</Link>
              <Link to="/theme/other" className="px-5 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Other Themes</Link>
            </div>
          </div>

          {/* PORTFOLIO DROPDOWN */}
          <div className="relative group">
            <span className="text-gray-600 font-medium text-[12px] xl:text-[13px] hover:text-[#4f46e5] transition-colors duration-300 flex items-center gap-1 cursor-pointer py-2">
              Portfolio <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#4f46e5] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-floating opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
              <Link to="/portfolio/gallery" className="px-5 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-[#4f46e5] transition-colors">Gallery</Link>
              <Link to="/portfolio/case-studies" className="px-5 py-3 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors">Case Studies</Link>
            </div>
          </div>
        </div>

        {/* RIGHT: Call to Action & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/contact" className="hidden lg:flex bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[12px] xl:text-[13px] font-bold py-2.5 px-6 rounded-full shadow-soft hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300">
            Enquire Now
          </Link>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 lg:hidden bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-navy shadow-sm hover:bg-gray-50 transition-all duration-300"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl lg:hidden flex flex-col justify-start items-center overflow-y-auto pt-24 pb-12 px-6"
          >
            <button onClick={closeMenu} className="absolute top-8 right-8 text-gray-400 hover:text-brand-navy">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="flex flex-col items-center gap-5 w-full max-w-sm">
              <Link to="/" onClick={closeMenu} className="text-xl font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Home</Link>
              <Link to="/about" onClick={closeMenu} className="text-xl font-serif font-bold text-brand-navy hover:text-[#4f46e5]">About Us</Link>
              <Link to="/kids-parties" onClick={closeMenu} className="text-xl font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Birthday Party</Link>
              <Link to="/corporate" onClick={closeMenu} className="text-xl font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Corporate Family Days</Link>
              <Link to="/carnivals" onClick={closeMenu} className="text-xl font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Carnival</Link>
              <Link to="/family-day" onClick={closeMenu} className="text-xl font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Family Day</Link>
              <Link to="/malls" onClick={closeMenu} className="text-xl font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Malls & Brand Activities</Link>
              
              {/* Themes Mobile Group */}
              <div className="w-full border-t border-gray-100 pt-5 mt-2 flex flex-col items-center">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Themes</span>
                <div className="flex flex-col items-center gap-4">
                  <Link to="/theme/science" onClick={closeMenu} className="text-lg font-serif font-bold text-blue-500">Science</Link>
                  <Link to="/theme/wizarding" onClick={closeMenu} className="text-lg font-serif font-bold text-purple-500">Wizarding</Link>
                  <Link to="/theme/princess" onClick={closeMenu} className="text-lg font-serif font-bold text-pink-500">Princess</Link>
                  <Link to="/theme/superhero" onClick={closeMenu} className="text-lg font-serif font-bold text-red-500">Superhero</Link>
                  <Link to="/theme/other" onClick={closeMenu} className="text-lg font-serif font-bold text-indigo-500">Other Themes</Link>
                </div>
              </div>

              {/* Portfolio Mobile Group */}
              <div className="w-full border-t border-gray-100 pt-5 mt-2 flex flex-col items-center">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Portfolio</span>
                <div className="flex flex-col items-center gap-4">
                  <Link to="/portfolio/gallery" onClick={closeMenu} className="text-lg font-serif font-bold text-[#4f46e5]">Gallery</Link>
                  <Link to="/portfolio/case-studies" onClick={closeMenu} className="text-lg font-serif font-bold text-pink-500">Case Studies</Link>
                </div>
              </div>

              <Link to="/contact" onClick={closeMenu} className="text-center bg-[#4f46e5] text-white font-bold py-4 px-12 rounded-full mt-6 shadow-md w-full">
                Enquire Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;