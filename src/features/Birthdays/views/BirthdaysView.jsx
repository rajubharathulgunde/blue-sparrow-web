import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar'; 
import Footer from '../../../shared/components/Footer'; 

const BirthdaysView = () => {
  return (
    <main className="font-sans text-gray-600 bg-white selection:bg-pink-100 selection:text-brand-navy">
      <Navbar />

      <section className="pt-32 pb-20 px-6 lg:px-12 bg-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern-bg.png')] opacity-10 mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-4 block">
            Meaningful Kids Events
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-brand-navy mb-6 leading-tight">
            Birthdays built around what your child actually loves.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
            No rigid packages. Tell us their wild imagination, and we engineer a safe, interactive, and mind-blowing celebration.
          </motion.p>
          <Link to="/contact" className="inline-block bg-[#4f46e5] hover:bg-pink-500 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md">
            Start Planning
          </Link>
        </div>
      </section>

      {/* Rest of your Birthdays page code goes here... */}
      <Footer />
    </main>
  );
};

export default BirthdaysView;