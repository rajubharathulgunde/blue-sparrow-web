import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="#fcd34d" />
  </svg>
);

const FaqBrochureSection = ({ pageTheme = 'home' }) => {
  const [faqs, setFaqs] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [isFaqEnabled, setIsFaqEnabled] = useState(false); // Controlled by Supabase

  useEffect(() => {
    const fetchData = async () => {
      const faqThemeString = `${pageTheme}_faq`;
      const brochureThemeString = `${pageTheme}_brochure`;

      const { data } = await supabase
        .from('theme_cards')
        .select('*')
        .in('theme_id', [faqThemeString, brochureThemeString, 'config'])
        .order('created_at', { ascending: true });

      if (data) {
        setFaqs(data.filter(item => item.theme_id === faqThemeString));
        setBrochures(data.filter(item => item.theme_id === brochureThemeString));
        
        // Check global FAQ toggle
        const toggleCard = data.find(item => item.title === 'global_faq_mode');
        if (toggleCard && toggleCard.description === 'enabled') {
          setIsFaqEnabled(true);
        } else {
          setIsFaqEnabled(false);
        }
      }
    };
    fetchData();
    const channel = supabase.channel(`live-faq-${pageTheme}`).on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData).subscribe();
    return () => supabase.removeChannel(channel);
  }, [pageTheme]);

  const defaultFaqs = [
    { title: "What age groups do you cater to?", description: "We specialize in events for all ages!\nToddlers & Pre-K (Ages 1-5)\nKids (Ages 6-12)\nTeens & Adults (Corporate & Carnivals)" },
    { title: "How far in advance should I book?", description: "For birthdays, we recommend 3-4 weeks in advance.\nFor corporate events and mall activations, 2-3 months is ideal to ensure full customization." }
  ];
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  // Render ONLY if enabled from Admin Dashboard
  if (!isFaqEnabled) return null;

  return (
    <section className="py-24 bg-white relative z-20 overflow-hidden font-sans border-t border-gray-100">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-pink-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3 z-0"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        <div className="w-full lg:w-3/5 relative">
          <StarIcon className="absolute -top-4 -left-6 w-5 h-5 animate-pulse opacity-70" />
          <span className="text-[#4f46e5] font-bold tracking-widest uppercase text-sm mb-4 block relative inline-block">
            Got Questions?
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b] mb-10">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const bullets = faq.description ? faq.description.split('\n').filter(line => line.trim() !== '') : [];

              return (
                <div key={faq.id || index} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 relative ${isOpen ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none relative z-10">
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
                              {bullets.map((b, i) => <li key={i} className="flex gap-3 items-start"><span className="mt-1 opacity-70 drop-shadow-sm">✦</span> <span>{b}</span></li>)}
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

      </div>
    </section>
  );
};

export default FaqBrochureSection;