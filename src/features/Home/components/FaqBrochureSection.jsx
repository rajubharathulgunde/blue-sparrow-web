import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

// Reusable Dual-Tone Star doodle
const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="#fcd34d" />
  </svg>
);

const FaqBrochureSection = ({ pageTheme = 'home' }) => {
  const [faqs, setFaqs] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
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
    const channel = supabase.channel(`live-faq-brochures-${pageTheme}`).on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData).subscribe();
    return () => supabase.removeChannel(channel);
  }, [pageTheme]);

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

  const faqColors = [
    'bg-blue-50 border-blue-200 text-blue-900',
    'bg-pink-50 border-pink-200 text-pink-900',
    'bg-yellow-50 border-yellow-200 text-yellow-900',
    'bg-emerald-50 border-emerald-200 text-emerald-900',
    'bg-purple-50 border-purple-200 text-purple-900'
  ];

  const toggleFaq = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="py-24 bg-white relative z-20 overflow-hidden font-sans border-t border-gray-100">
      
      {/* Decorative CSS Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-pink-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3 z-0"></div>
      
      {/* Abstract CSS shapes floating in empty space */}
      <div className="absolute top-[30%] left-[2%] w-[15vw] h-[15vw] border-[3px] border-dashed border-blue-100 rounded-full opacity-40 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[5%] w-[20vw] h-[20vw] border-[2px] border-pink-100 rounded-full opacity-30 z-0 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* ================= LEFT: FAQ SECTION ================= */}
        <div className="w-full lg:w-3/5 relative">
          
          <StarIcon className="absolute -top-4 -left-6 w-5 h-5 animate-pulse opacity-70" />
          
          <span className="text-[#4f46e5] font-bold tracking-widest uppercase text-sm mb-4 block relative inline-block">
            Got Questions?
            {/* CSS squiggly line under text */}
            <div className="absolute -bottom-1 left-0 w-full h-1 border-b-2 border-dashed border-indigo-200 opacity-60 rotate-[-1deg]"></div>
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b] mb-10">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const colorClass = faqColors[index % faqColors.length];
              const isOpen = openIndex === index;
              const bullets = faq.description ? faq.description.split('\n').filter(line => line.trim() !== '') : [];

              return (
                <div key={faq.id || index} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 relative ${isOpen ? colorClass : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                  
                  {/* CSS glowing gradient blob behind open FAQ item */}
                  {isOpen && <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent pointer-events-none z-0"></div>}

                  <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none relative z-10">
                    <h3 className={`text-lg md:text-xl font-bold font-serif ${isOpen ? '' : 'text-[#1e293b]'}`}>{faq.title}</h3>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOpen ? 'bg-white/50 shadow-sm' : 'bg-gray-50 text-gray-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="px-6 pb-6 text-[14px] md:text-[15px] font-medium leading-relaxed opacity-90 relative z-10">
                          {bullets.length > 1 ? (
                            <ul className="space-y-2">
                              {bullets.map((bullet, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                  <span className="mt-1 opacity-70 drop-shadow-sm">✦</span> <span>{bullet}</span>
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
        <div className="w-full lg:w-2/5 flex flex-col justify-center relative">
          
          {/* CSS abstract doodle floating behind the box */}
          <div className="absolute -top-10 -right-10 w-32 h-32 border-[4px] border-dashed border-blue-100 rounded-full opacity-60 z-0"></div>
          <div className="absolute bottom-10 -left-6 text-pink-300 text-3xl rotate-12 z-0"></div>

          <div className="bg-[#f8fafc] p-8 md:p-10 rounded-[40px] border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group z-10">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b] mb-4 relative z-10 inline-block">
              Download Our Catalogues
              {/* CSS highlighter streak under header */}
              <div className="absolute bottom-0 left-0 w-[105%] h-3 bg-blue-100 opacity-60 rounded-full rotate-[-1deg] z-[-1]"></div>
            </h3>
            <p className="text-gray-500 mb-8 font-light relative z-10">Browse our complete list of themes, activities, and corporate event frameworks.</p>

            <div className="space-y-4 relative z-10">
              {displayBrochures.map((brochure, index) => (
                <a 
                  key={brochure.id || index}
                  href={brochure.image_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#4f46e5] group/btn transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle CSS hover accent bar */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#4f46e5] opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>

                  <div className="flex items-center gap-4 pl-2">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0 group-hover/btn:bg-[#4f46e5] group-hover/btn:text-white transition-colors border border-red-100 group-hover/btn:border-[#4f46e5]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1e293b] group-hover/btn:text-[#4f46e5] transition-colors">{brochure.title}</h4>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                        {brochure.description} 
                        {brochure.icon && <span className="bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-[10px] uppercase">{brochure.icon}</span>}
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