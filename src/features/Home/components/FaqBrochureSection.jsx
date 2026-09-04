import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

// 1. Accept pageTheme as a prop, defaulting to 'home'
const FaqBrochureSection = ({ pageTheme = 'home' }) => {
  const [faqs, setFaqs] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [openIndex, setOpenIndex] = useState(0); // First FAQ open by default

  useEffect(() => {
    const fetchData = async () => {
      // 2. Dynamically build the theme strings based on the page
      const faqThemeString = `${pageTheme}_faq`;
      const brochureThemeString = `${pageTheme}_brochure`;

      const { data } = await supabase
        .from('theme_cards')
        .select('*')
        .in('theme_id', [faqThemeString, brochureThemeString])
        .order('created_at', { ascending: true });

      if (data) {
        setFaqs(data.filter(item => item.theme_id === faqThemeString));
        setBrochures(data.filter(item => item.theme_id === brochureThemeString));
      }
    };

    fetchData();

    // 3. Make the realtime channel dynamic to the specific page
    const channel = supabase.channel(`live-faq-brochures-${pageTheme}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [pageTheme]); // Re-run if the pageTheme changes

  // === FALLBACK DATA ===
  const defaultFaqs = [
    { title: "What age groups do you cater to?", description: "We specialize in events for all ages!\nToddlers & Pre-K (Ages 1-5)\nKids (Ages 6-12)\nTeens & Adults (Corporate & Carnivals)" },
    { title: "How far in advance should I book?", description: "For birthdays, we recommend 3-4 weeks in advance.\nFor corporate events and mall activations, 2-3 months is ideal to ensure full customization." },
    { title: "Are your activities safe and non-toxic?", description: "Absolutely! All materials, from our science lab chemicals to our paints and slimes, are 100% child-safe, non-toxic, and rigorously tested." },
  ];

  const defaultBrochures = [
    { title: "Corporate Events 2026", description: "Team building & workshops.", icon: "2.4 MB", image_url: "#" },
    { title: "Birthday Themes Catalogue", description: "Our 40+ magical setups.", icon: "5.1 MB", image_url: "#" }
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;
  const displayBrochures = brochures.length > 0 ? brochures : defaultBrochures;

  // Colorful array for FAQ boxes
  const faqColors = [
    'bg-blue-50 border-blue-200 text-blue-900',
    'bg-pink-50 border-pink-200 text-pink-900',
    'bg-yellow-50 border-yellow-200 text-yellow-900',
    'bg-green-50 border-green-200 text-green-900',
    'bg-purple-50 border-purple-200 text-purple-900'
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white relative z-20 overflow-hidden font-sans border-t border-gray-100">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-pink-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* ================= LEFT: FAQ SECTION ================= */}
        <div className="w-full lg:w-3/5">
          <span className="text-[#4f46e5] font-bold tracking-widest uppercase text-sm mb-4 block">Got Questions?</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-10">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const colorClass = faqColors[index % faqColors.length];
              const isOpen = openIndex === index;
              const bullets = faq.description ? faq.description.split('\n').filter(line => line.trim() !== '') : [];

              return (
                <div key={faq.id || index} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? colorClass : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                  
                  <button 
                    onClick={() => toggleFaq(index)} 
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <h3 className={`text-xl font-bold font-serif ${isOpen ? '' : 'text-brand-navy'}`}>{faq.title}</h3>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOpen ? 'bg-white/40' : 'bg-gray-50 text-gray-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm md:text-[15px] font-medium leading-relaxed opacity-90">
                          {bullets.length > 1 ? (
                            <ul className="space-y-2">
                              {bullets.map((bullet, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                  <span className="mt-1 opacity-70">✦</span> <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>{faq.description}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT: BROCHURES SECTION ================= */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center">
          <div className="bg-[#f8fafc] p-8 md:p-10 rounded-[40px] border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy mb-4 relative z-10">Download Our Catalogues</h3>
            <p className="text-gray-500 mb-8 font-light relative z-10">Browse our complete list of themes, activities, and corporate event frameworks.</p>

            <div className="space-y-4 relative z-10">
              {displayBrochures.map((brochure, index) => (
                <a 
                  key={brochure.id || index}
                  href={brochure.image_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#4f46e5] group/btn transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0 group-hover/btn:bg-[#4f46e5] group-hover/btn:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy group-hover/btn:text-[#4f46e5] transition-colors">{brochure.title}</h4>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                        {brochure.description} 
                        {brochure.icon && <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase">{brochure.icon}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover/btn:bg-[#4f46e5] group-hover/btn:text-white transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </div>
                </a>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
};

export default FaqBrochureSection;