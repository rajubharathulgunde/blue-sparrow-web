import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[98%] max-w-[1400px] xl:bg-white/95 xl:backdrop-blur-xl border-transparent xl:border xl:border-white/60 rounded-full xl:shadow-soft flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 z-[60] transition-all duration-500">
        
        {/* LEFT: Spacing to accommodate the floating BrandLogo */}
        <div className="flex items-center gap-2 shrink-0 w-[90px] sm:w-[110px] md:w-[130px]">
          {/* Logo is handled by BrandLogo.jsx floating above this */}
        </div>

        {/* CENTER: Desktop Navigation Links (Removed overflow-hidden to fix dropdowns) */}
        <div className="hidden xl:flex items-center justify-center flex-grow mx-4 relative">
          <div className="flex items-center justify-center gap-4 2xl:gap-6 whitespace-nowrap w-full">
            
            <Link to="/" className="text-brand-navy font-medium text-[13px] hover:text-[#4f46e5] transition-colors duration-300 shrink-0">Home</Link>
            <Link to="/about" className="text-gray-600 font-medium text-[13px] hover:text-[#4f46e5] transition-colors duration-300 shrink-0">About Us</Link>
            <Link to="/kids-parties" className="text-gray-600 font-medium text-[13px] hover:text-[#4f46e5] transition-colors duration-300 shrink-0">Birthday Party</Link>
            <Link to="/corporate" className="text-gray-600 font-medium text-[13px] hover:text-[#4f46e5] transition-colors duration-300 shrink-0">Corporate Family Days</Link>
            <Link to="/carnivals" className="text-gray-600 font-medium text-[13px] hover:text-[#4f46e5] transition-colors duration-300 shrink-0">Carnival</Link>
            <Link to="/family-day" className="text-gray-600 font-medium text-[13px] hover:text-[#4f46e5] transition-colors duration-300 shrink-0">Family Day</Link>
            <Link to="/malls" className="text-gray-600 font-medium text-[13px] hover:text-[#4f46e5] transition-colors duration-300 shrink-0">Schools & Malls</Link>
            
            {/* THEMES DROPDOWN */}
            <div className="relative group shrink-0">
              <span className="text-gray-600 font-medium text-[13px] group-hover:text-[#4f46e5] transition-colors duration-300 flex items-center gap-1 cursor-pointer py-2">
                Themes <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#4f46e5] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              {/* Added pt-2 wrapper to create a transparent hover bridge so the menu doesn't glitch when moving the mouse down */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="w-48 bg-white border border-gray-100 rounded-2xl shadow-floating flex flex-col overflow-hidden">
                  <Link to="/theme/science" className="px-5 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Science</Link>
                  <Link to="/theme/wizarding" className="px-5 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors">Wizarding</Link>
                  <Link to="/theme/princess" className="px-5 py-3 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors">Princess</Link>
                  <Link to="/theme/superhero" className="px-5 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">Superhero</Link>
                  <Link to="/theme/other" className="px-5 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Other Themes</Link>
                </div>
              </div>
            </div>

            {/* PORTFOLIO DROPDOWN */}
            <div className="relative group shrink-0">
              <span className="text-gray-600 font-medium text-[13px] group-hover:text-[#4f46e5] transition-colors duration-300 flex items-center gap-1 cursor-pointer py-2">
                Portfolio <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#4f46e5] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              {/* Added pt-2 wrapper here as well */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="w-44 bg-white border border-gray-100 rounded-2xl shadow-floating flex flex-col overflow-hidden">
                  <Link to="/portfolio/gallery" className="px-5 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-[#4f46e5] transition-colors">Gallery</Link>
                  <Link to="/portfolio/case-studies" className="px-5 py-3 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors">Case Studies</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Call to Action & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0 relative">
          <Link to="/contact" className="hidden xl:flex bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[13px] font-bold py-2.5 px-6 rounded-full shadow-soft hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300">
            Enquire Now
          </Link>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 sm:w-11 sm:h-11 xl:hidden bg-white/95 backdrop-blur-md border border-gray-100/50 rounded-full flex items-center justify-center text-brand-navy shadow-md hover:bg-white transition-all duration-300 relative z-50"
          >
            {isOpen ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>

        {/* ================= COMPACT MOBILE MENU DROPDOWN ================= */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[calc(100%+12px)] right-4 sm:right-6 xl:right-0 w-[260px] sm:w-[300px] bg-white/95 backdrop-blur-xl border border-gray-100/60 rounded-[24px] shadow-2xl xl:hidden flex flex-col justify-start overflow-y-auto max-h-[75vh] p-5 origin-top-right z-50"
            >
              <div className="flex flex-col items-start gap-3 w-full">
                <Link to="/" onClick={closeMenu} className="text-[15px] font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Home</Link>
                <Link to="/about" onClick={closeMenu} className="text-[15px] font-serif font-bold text-brand-navy hover:text-[#4f46e5]">About Us</Link>
                <Link to="/kids-parties" onClick={closeMenu} className="text-[15px] font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Birthday Party</Link>
                <Link to="/corporate" onClick={closeMenu} className="text-[15px] font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Corporate Family Days</Link>
                <Link to="/carnivals" onClick={closeMenu} className="text-[15px] font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Carnival</Link>
                <Link to="/family-day" onClick={closeMenu} className="text-[15px] font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Family Day</Link>
                <Link to="/malls" onClick={closeMenu} className="text-[15px] font-serif font-bold text-brand-navy hover:text-[#4f46e5]">Malls & Brand Activities</Link>
                
                {/* Themes Mobile Group */}
                <div className="w-full border-t border-gray-100 pt-3 mt-1 flex flex-col items-start">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Themes</span>
                  <div className="flex flex-col items-start gap-2.5 w-full pl-1">
                    <Link to="/theme/science" onClick={closeMenu} className="text-[14px] font-serif font-bold text-blue-500">Science</Link>
                    <Link to="/theme/wizarding" onClick={closeMenu} className="text-[14px] font-serif font-bold text-purple-500">Wizarding</Link>
                    <Link to="/theme/princess" onClick={closeMenu} className="text-[14px] font-serif font-bold text-pink-500">Princess</Link>
                    <Link to="/theme/superhero" onClick={closeMenu} className="text-[14px] font-serif font-bold text-red-500">Superhero</Link>
                    <Link to="/theme/other" onClick={closeMenu} className="text-[14px] font-serif font-bold text-indigo-500">Other Themes</Link>
                  </div>
                </div>

                {/* Portfolio Mobile Group */}
                <div className="w-full border-t border-gray-100 pt-3 mt-1 flex flex-col items-start">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Portfolio</span>
                  <div className="flex flex-col items-start gap-2.5 w-full pl-1">
                    <Link to="/portfolio/gallery" onClick={closeMenu} className="text-[14px] font-serif font-bold text-[#4f46e5]">Gallery</Link>
                    <Link to="/portfolio/case-studies" onClick={closeMenu} className="text-[14px] font-serif font-bold text-pink-500">Case Studies</Link>
                  </div>
                </div>

                <Link to="/contact" onClick={closeMenu} className="text-center bg-[#4f46e5] text-white text-[14px] font-bold py-3 w-full rounded-full mt-2 shadow-md hover:bg-[#4338ca] transition-colors">
                  Enquire Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;