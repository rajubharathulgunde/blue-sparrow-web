import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const ExperiencesSection = () => {
  const [dbCards, setDbCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const { data } = await supabase
        .from('theme_cards')
        .select('*')
        .eq('theme_id', 'home')
        .order('created_at', { ascending: true });
      if (data) setDbCards(data);
    };

    fetchCards();

    const channel = supabase.channel('live-home-cards')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchCards)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fallbackCards = [
    {
      id: 1,
      title: "Focused Celebrations",
      icon: "15–30 Kids",
      description: "Home or small banquet\nSelected core activities\nSmaller, intimate setup"
    },
    {
      id: 2,
      title: "Mid-size Celebrations",
      icon: "30–50 Kids",
      description: "More activities & zones\nDedicated hosts & facilitators\nMore detailed visual setup"
    },
    {
      id: 3,
      title: "Large Celebrations",
      icon: "50+ Kids",
      description: "Multiple activity zones\nLarger facilitation team\nDetailed event flow & grand setup"
    }
  ];

  const displayCards = dbCards.length > 0 ? dbCards : fallbackCards;

  return (
    <section className="py-24 bg-white relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center mb-16">
          <span className="text-[#4f46e5] font-bold tracking-widest uppercase text-sm mb-4 block">Birthdays & Celebrations</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-6">
            What is your child into right now?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            We don't do fixed packages. Tell us what your child loves, and we engineer the perfect, safe, and engaging celebration around it.
          </p>
        </div>

        {/* ================= THEMES TAGS (NOW LINKED) ================= */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link to="/theme/science" className="bg-blue-50 border border-blue-100 text-blue-600 font-bold px-6 py-2.5 rounded-full shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">🧪 Science</Link>
          <Link to="/theme/wizarding" className="bg-purple-50 border border-purple-100 text-purple-600 font-bold px-6 py-2.5 rounded-full shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">⚡ Wizarding</Link>
          <Link to="/theme/princess" className="bg-pink-50 border border-pink-100 text-pink-600 font-bold px-6 py-2.5 rounded-full shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">👑 Princess</Link>
          <Link to="/theme/superhero" className="bg-red-50 border border-red-100 text-red-600 font-bold px-6 py-2.5 rounded-full shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">🦸‍♂️ Superhero</Link>
        </div>

        {/* ================= SCALES OF CELEBRATION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {displayCards.map((card, index) => {
            const bulletPoints = card.description 
              ? card.description.split('\n').filter(line => line.trim() !== '') 
              : [];

            if (index === 1) {
              return (
                <motion.div key={card.id || index} whileHover={{ y: -10 }} className="bg-gradient-to-b from-pink-50 to-white rounded-[32px] p-8 border border-pink-100 shadow-md flex flex-col h-full relative transform md:-translate-y-4">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">Most Popular</div>
                  <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2 mt-2">{card.title}</h3>
                  <p className="text-sm font-bold text-pink-400 uppercase tracking-widest mb-6">{card.icon}</p>
                  <ul className="space-y-4 text-gray-600 font-medium mb-8 flex-grow">
                    {bulletPoints.map((bullet, i) => (
                      <li key={i} className="flex gap-3"><span className="text-pink-500">✦</span> {bullet}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className="w-full block text-center bg-pink-500 text-white font-bold py-3 rounded-full hover:bg-brand-navy transition-colors shadow-md">
                    Plan Event
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div key={card.id || index} whileHover={{ y: -10 }} className="bg-[#f8fafc] rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col h-full">
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2">{card.title}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">{card.icon}</p>
                <ul className="space-y-4 text-gray-600 font-medium mb-8 flex-grow">
                  {bulletPoints.map((bullet, i) => (
                    <li key={i} className="flex gap-3"><span className="text-[#4f46e5]">✦</span> {bullet}</li>
                  ))}
                </ul>
                <Link to="/contact" className="w-full block text-center border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-full hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors">
                  Plan Event
                </Link>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;