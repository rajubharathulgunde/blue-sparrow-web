"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/shared/components/Navbar'; // Adjust path as needed
import Footer from '@/shared/components/Footer'; // Adjust path as needed

export default function BirthdaysPage() {
  return (
    <main className="font-sans text-gray-600 bg-white selection:bg-pink-100 selection:text-brand-navy">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern-bg.png')] opacity-10 mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-4 block">
            Meaningful Kids Events
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-brand-navy mb-6 leading-tight">
            Birthdays built around what your child actually loves.
          </motion.span>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
            No rigid packages. Tell us their wild imagination, and we engineer a safe, interactive, and mind-blowing celebration[cite: 3].
          </motion.p>
          <Link href="/contact" className="inline-block bg-[#4f46e5] hover:bg-pink-500 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md">
            Start Planning
          </Link>
        </div>
      </section>

      {/* ================= WHAT IS YOUR CHILD INTO? ================= */}
      <section className="py-24 px-6 lg:px-12 bg-white max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4">What is your child into right now?[cite: 3]</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16">We take their current obsession and turn it into hands-on art, STEM, and play[cite: 3].</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { theme: "Science", icon: "🧪", desc: "Experiments, Science Art, STEM Making[cite: 3]", color: "blue" },
            { theme: "Wizarding", icon: "⚡", desc: "Wand Making, Potions, Magical Experiments[cite: 3]", color: "purple" },
            { theme: "Princess", icon: "👑", desc: "Coronations, Tiara Crafts, Ballroom Games", color: "pink" },
            { theme: "Superhero", icon: "🦸‍♂️", desc: "Obstacle Courses, Cape Designing, Missions", color: "red" }
          ].map((item, idx) => (
            <div key={idx} className={`bg-${item.color}-50 rounded-[32px] p-8 border border-${item.color}-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300`}>
              <span className="text-5xl mb-4">{item.icon}</span>
              <h3 className={`text-xl font-bold text-${item.color}-600 mb-2`}>{item.theme}</h3>
              <p className="text-sm text-gray-600 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SCALE OF CELEBRATION ================= */}
      <section className="py-24 bg-[#f8fafc] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4">Every Scale of Celebration</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From intimate home gatherings to grand banquet takeovers[cite: 3].</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2">Focused[cite: 3]</h3>
              <p className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-6">15–30 Kids[cite: 3]</p>
              <ul className="space-y-3 text-gray-600 font-medium mb-8">
                <li className="flex gap-2"><span>✦</span> Home or small banquet[cite: 3]</li>
                <li className="flex gap-2"><span>✦</span> Selected core activities[cite: 3]</li>
                <li className="flex gap-2"><span>✦</span> Smaller, intimate setup[cite: 3]</li>
              </ul>
            </div>

            <div className="bg-brand-navy p-10 rounded-[32px] shadow-xl text-white transform md:-translate-y-4">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Mid-size[cite: 3]</h3>
              <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-6">30–50 Kids</p>
              <ul className="space-y-3 text-blue-100 font-medium mb-8">
                <li className="flex gap-2"><span>✦</span> More activities & zones[cite: 3]</li>
                <li className="flex gap-2"><span>✦</span> Dedicated hosts & facilitators[cite: 3]</li>
                <li className="flex gap-2"><span>✦</span> Detailed visual setup[cite: 3]</li>
              </ul>
              <Link href="/contact" className="block text-center bg-pink-500 text-white font-bold py-3 rounded-full hover:bg-white hover:text-brand-navy transition-colors">
                Get a Proposal
              </Link>
            </div>

            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2">Large[cite: 3]</h3>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-6">50+ Kids[cite: 3]</p>
              <ul className="space-y-3 text-gray-600 font-medium mb-8">
                <li className="flex gap-2"><span>✦</span> Multiple activity zones[cite: 3]</li>
                <li className="flex gap-2"><span>✦</span> Larger facilitation team[cite: 3]</li>
                <li className="flex gap-2"><span>✦</span> Grand setup & event flow[cite: 3]</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}