import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Footer = () => {
  const [cmsSocials, setCmsSocials] = useState([]);

  useEffect(() => {
    const fetchSocials = async () => {
      const { data } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'social_footer')
        .order('created_at', { ascending: true });
        
      if (data) setCmsSocials(data);
    };

    fetchSocials();

    const channel = supabase.channel('live-footer-socials')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards', filter: "theme_id=eq.social_footer" }, fetchSocials)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <footer className="relative z-50 bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] pt-20 sm:pt-24 pb-8 sm:pb-10 px-5 sm:px-6 lg:px-12 mt-16 sm:mt-20">
      
      {/* Cloud SVG Top Border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-full pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 sm:h-12 md:h-20 fill-[#f0f9ff]">
          <path d="M0,60 C150,120 250,0 400,50 C550,100 650,20 800,60 C950,100 1100,10 1200,50 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* ================= CUSTOM HOVERING SPARROW IMAGE ================= */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -top-12 sm:-top-16 md:-top-24 right-6 sm:right-10 md:right-32 drop-shadow-lg z-10 pointer-events-none"
      >
        <img 
          src="/assets/blue sparrow.png" 
          alt="Hovering Blue Sparrow" 
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain"
          onError={(e) => {
            e.target.style.display = 'none'; 
          }}
        />
      </motion.div>
      {/* ================================================================ */}

      <div className="max-w-7xl mx-auto relative z-20">
        
        {/* RESPONSIVE GRID: 2 cols on mobile, 4 on PC */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-12 mb-12 sm:mb-16">
          
          {/* BRAND INFO - Spans full width (2 cols) on mobile, 1 col on PC */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 cursor-pointer group mb-5 sm:mb-6 inline-flex">
              <div className="flex flex-col justify-center">
                <span className="text-brand-navy font-serif font-bold text-lg sm:text-xl leading-none tracking-tight">
                  Blue Sparrow
                </span>
                <span className="text-[#4f46e5] font-sans text-[8px] sm:text-[9px] font-semibold tracking-[0.3em] uppercase mt-1 leading-none">
                  Events
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-[13px] sm:text-[14px] leading-relaxed mb-6 pr-4 font-medium max-w-sm lg:max-w-none">
              Crafting magical experiences and unforgettable memories since 2013. We turn your imagination into reality.
            </p>
            
            {/* ================= SOCIAL ICONS ================= */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {cmsSocials.length > 0 ? (
                cmsSocials.map((social) => (
                  <a 
                    key={social.id} 
                    href={social.icon || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={social.title}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-brand-navy hover:bg-[#4f46e5] hover:text-white shadow-sm hover:shadow transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {social.image_url ? (
                      <img src={social.image_url} alt={social.title} className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                    ) : (
                      <span className="font-bold text-[10px] sm:text-xs uppercase">{social.title.charAt(0)}</span>
                    )}
                  </a>
                ))
              ) : (
                <>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white shadow-sm hover:shadow transform hover:-translate-y-1 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#E4405F] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white shadow-sm hover:shadow transform hover:-translate-y-1 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white shadow-sm hover:shadow transform hover:-translate-y-1 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </>
              )}
            </div>
            {/* ============================================================= */}
          </div>

          {/* QUICK LINKS - Spans 1 col on mobile (sits next to Experiences) */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="text-brand-navy font-serif font-bold mb-4 sm:mb-6 text-[15px] sm:text-[17px]">Quick Links</h4>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              <li><Link to="/about" className="text-gray-600 hover:text-[#4f46e5] font-medium transition-colors text-[13px] sm:text-[14px]">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-[#4f46e5] font-medium transition-colors text-[13px] sm:text-[14px]">Plan an Event</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-[#4f46e5] font-medium transition-colors text-[13px] sm:text-[14px]">Trusted Brands</a></li>
            </ul>
          </div>

          {/* EXPERIENCES - Spans 1 col on mobile */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="text-brand-navy font-serif font-bold mb-4 sm:mb-6 text-[15px] sm:text-[17px]">Experiences</h4>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              <li><Link to="/corporate" className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-[13px] sm:text-[14px] line-clamp-1">Corporate Events</Link></li>
              <li><Link to="/kids-parties" className="text-gray-600 hover:text-pink-500 font-medium transition-colors text-[13px] sm:text-[14px] line-clamp-1">Kids Parties</Link></li>
              <li><Link to="/carnivals" className="text-gray-600 hover:text-emerald-500 font-medium transition-colors text-[13px] sm:text-[14px] line-clamp-1">Carnivals</Link></li>
              <li><Link to="/family-discovery" className="text-gray-600 hover:text-orange-500 font-medium transition-colors text-[13px] sm:text-[14px] line-clamp-1">Family Discovery</Link></li>
            </ul>
          </div>

          {/* GET IN TOUCH - Spans full width (2 cols) on mobile to accommodate long emails/numbers */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-brand-navy font-serif font-bold mb-4 sm:mb-6 text-[15px] sm:text-[17px]">Get In Touch</h4>
            <ul className="flex flex-col gap-3 sm:gap-4">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <a href="mailto:hello@bluesparrowevents.com" className="text-gray-600 font-medium hover:text-[#4f46e5] transition-colors text-[13px] sm:text-[14px] break-all">hello@bluesparrowevents.com</a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <a href="tel:+919619780981" className="text-gray-600 font-medium hover:text-pink-500 transition-colors text-[13px] sm:text-[14px]">+91 96197 80981</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-blue-200/50 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-center md:text-left">
          <p className="text-gray-500 text-[12px] sm:text-[13px] font-medium">
            © 2026 Blue Sparrow Events. All rights reserved.
          </p>
          <div className="text-gray-500 text-[12px] sm:text-[13px] font-medium flex items-center gap-1">
            Made with <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg> in India
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;