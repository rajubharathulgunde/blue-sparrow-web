import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';

const ExperiencesView = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const themes = [
    {
      id: 'science',
      title: 'Mad Science Lab',
      icon: '🧪',
      color: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      description: 'Goggles on! Kids step into a crazy laboratory for interactive slime-making, safe dry-ice experiments, and erupting chemistry that makes learning wildly fun.',
      tags: ['Slime Station', 'Volcanoes', 'Lab Coats']
    },
    {
      id: 'wizarding',
      title: 'Wizarding Academy',
      icon: '🪄',
      color: 'bg-purple-600',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Step into a world of magic. We transform your space into a magical school featuring custom wand-making workshops, mystical potion classes, and spellbinding illusions.',
      tags: ['Wand Making', 'Potions', 'Illusionists']
    },
    {
      id: 'superhero',
      title: 'Superhero Bootcamp',
      icon: '🦸‍♂️',
      color: 'bg-red-500',
      lightBg: 'bg-red-50',
      textColor: 'text-red-700',
      description: 'Calling all heroes! Action-packed agility obstacle courses, custom cape designing stations, and interactive missions to save the day.',
      tags: ['Agility Course', 'Cape Design', 'Missions']
    },
    {
      id: 'princess',
      title: 'Royal Princess Ball',
      icon: '👑',
      color: 'bg-pink-400',
      lightBg: 'bg-pink-50',
      textColor: 'text-pink-700',
      description: 'An elegant fairytale brought to life. Featuring royal grand entrances, tiara decoration workshops, ballroom dancing, and immersive storytelling.',
      tags: ['Tiara Workshop', 'Storytelling', 'Royal Entry']
    }
  ];

  return (
    <div className="font-sans text-gray-600 bg-[#f8fafc] min-h-screen flex flex-col selection:bg-purple-100 selection:text-brand-navy">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6 lg:px-12 bg-gradient-to-b from-purple-50 to-[#f8fafc]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#4f46e5] font-bold tracking-widest uppercase text-xs mb-3 block">Immersive Worlds</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-navy mb-6 tracking-tight">
            Curated <span className="text-pink-500 italic">Themes</span>
          </h1>
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
            From bubbling potions to royal ballrooms, we build end-to-end thematic worlds that transport kids into their favorite imaginations.
          </p>
        </div>
      </section>

      {/* Main Themes Grid */}
      <section className="px-6 lg:px-12 pb-16 flex-grow">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {themes.map((theme, index) => (
            <motion.div 
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Decorative background circle */}
              <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full ${theme.lightBg} opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${theme.lightBg} ${theme.textColor} flex items-center justify-center text-3xl mb-6 shadow-sm`}>
                  {theme.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-3">{theme.title}</h3>
                <p className="text-gray-500 mb-6 text-[15px] leading-relaxed">{theme.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {theme.tags.map(tag => (
                    <span key={tag} className="text-xs font-bold uppercase tracking-wider bg-gray-50 text-gray-400 px-3 py-1 rounded-full border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link 
                  to="/contact" 
                  className={`inline-flex items-center font-bold text-sm ${theme.textColor} hover:opacity-70 transition-opacity`}
                >
                  Book this theme <span className="ml-2">&rarr;</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* "Other / Custom" Full Width Section */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-navy rounded-[40px] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
          >
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4f46e5] rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl text-center md:text-left">
              <span className="text-pink-400 font-bold tracking-widest uppercase text-xs mb-3 block">Custom Creations</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Have something else in mind?</h2>
              <p className="text-gray-300 text-[15px] leading-relaxed mb-0">
                Space Explorers, Dinosaur Digs, Pirates, or a brand new concept? Our "End-to-End Execution" model means we can design, build, and run absolutely any theme you can dream up from scratch.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Link 
                to="/contact" 
                className="bg-[#4f46e5] hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-full transition-colors shadow-lg flex items-center gap-2"
              >
                Discuss a Custom Theme ✨
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExperiencesView;