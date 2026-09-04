"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="font-sans text-gray-600 bg-white overflow-x-hidden selection:bg-pink-100 selection:text-brand-navy">
      
      {/* ================= STRATEGIC HERO SECTION ================= */}
      <section className="relative w-full min-h-[85vh] flex items-center bg-[#fbf9fe] pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center relative z-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-6 block"
          >
            Blue Sparrow Events
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-[#1e1b4b] leading-[1.1] mb-8 tracking-tight"
          >
            We make spaces come alive <br className="hidden md:block" /> for kids and families.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            From an unforgettable 8-year-old's science birthday at home to a massive corporate family day or mall activation, we build the right event around your audience, space, and objective.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/contact" className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Discuss Your Event
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= SHOW THE RANGE (NOT JUST BIRTHDAYS) ================= */}
      <section className="py-24 bg-white relative z-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1e1b4b] mb-4">The Blue Sparrow Range</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We do much more than birthday parties. See how we transform different spaces.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: "Birthday at Home", color: "bg-pink-50", text: "text-pink-600" },
              { title: "Mall Activation", color: "bg-blue-50", text: "text-blue-600" },
              { title: "Corporate Family Day", color: "bg-emerald-50", text: "text-emerald-600" },
              { title: "Society Event", color: "bg-amber-50", text: "text-amber-600" },
              { title: "Carnival", color: "bg-purple-50", text: "text-purple-600" }
            ].map((item, idx) => (
              <div key={idx} className={`${item.color} rounded-2xl p-6 text-center shadow-sm flex items-center justify-center min-h-[120px]`}>
                <span className={`font-bold ${item.text} text-sm md:text-base`}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= THE BRIEF -> THE PLAN -> MADE REAL ================= */}
      <section className="py-24 bg-[#f8fafc] relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1e1b4b] mb-4">How We Actually Work</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We don't just sell packages. You give us the context, and we engineer the experience.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* The Brief */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <span className="text-[#4f46e5] font-bold tracking-widest uppercase text-xs mb-4 block">Step 1</span>
              <h3 className="text-2xl font-serif font-bold text-[#1e1b4b] mb-6">The Brief</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-2"><span>•</span> 8-year-old who loves science</li>
                <li className="flex gap-2"><span>•</span> 25 kids attending</li>
                <li className="flex gap-2"><span>•</span> Indoor banquet setting</li>
              </ul>
            </div>

            {/* The Plan */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <span className="text-pink-500 font-bold tracking-widest uppercase text-xs mb-4 block">Step 2</span>
              <h3 className="text-2xl font-serif font-bold text-[#1e1b4b] mb-6">The Plan</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-2"><span>•</span> Safe, explosive experiments</li>
                <li className="flex gap-2"><span>•</span> Science art & edible activities</li>
                <li className="flex gap-2"><span>•</span> Trained facilitators & strict activity flow</li>
              </ul>
            </div>

            {/* Made Real */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 bg-gradient-to-br from-white to-emerald-50">
              <span className="text-emerald-500 font-bold tracking-widest uppercase text-xs mb-4 block">Step 3</span>
              <h3 className="text-2xl font-serif font-bold text-[#1e1b4b] mb-6">Made Real</h3>
              <p className="text-gray-600 mb-4">Execution that looks exactly like the pitch, backed by verified parent and corporate feedback.</p>
              <Link href="/case-studies" className="text-emerald-600 font-bold text-sm hover:underline">View Case Studies &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}