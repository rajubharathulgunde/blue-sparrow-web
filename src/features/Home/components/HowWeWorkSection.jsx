import React from 'react';

const HowWeWorkSection = () => {
  return (
    <section className="py-24 bg-[#f8fafc] relative z-20 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-4 block">Education & Trust</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-4">How We Build Experiences</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">We don't offer fixed packages. You give us the context, and we engineer the magic[cite: 3].</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white p-10 rounded-[32px] shadow-soft border border-gray-100 hover:shadow-floating transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-6">1</div>
            <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">The Brief[cite: 3]</h3>
            <ul className="space-y-3 text-gray-600 font-medium">
              <li className="flex gap-3"><span className="text-blue-400">✦</span> 8-year-old who loves science[cite: 3]</li>
              <li className="flex gap-3"><span className="text-blue-400">✦</span> 25 kids attending[cite: 3]</li>
              <li className="flex gap-3"><span className="text-blue-400">✦</span> Indoor banquet setting[cite: 3]</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-10 rounded-[32px] shadow-soft border border-gray-100 hover:shadow-floating transition-shadow duration-300 relative transform md:-translate-y-4">
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-xl mb-6">2</div>
            <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">The Plan[cite: 3]</h3>
            <ul className="space-y-3 text-gray-600 font-medium">
              <li className="flex gap-3"><span className="text-pink-400">✦</span> Explosive experiments[cite: 3]</li>
              <li className="flex gap-3"><span className="text-pink-400">✦</span> Science art & edible activities[cite: 3]</li>
              <li className="flex gap-3"><span className="text-pink-400">✦</span> Trained facilitators & strict flow[cite: 3]</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] p-10 rounded-[32px] shadow-soft text-white hover:shadow-floating transition-shadow duration-300">
            <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">3</div>
            <h3 className="text-2xl font-serif font-bold text-white mb-4">Made Real[cite: 3]</h3>
            <p className="text-blue-100 mb-6 font-medium leading-relaxed">
              Execution backed by actual photos, videos, and verified parent feedback[cite: 3].
            </p>
            <button className="bg-white text-brand-navy px-6 py-2.5 rounded-full font-bold text-sm hover:bg-pink-500 hover:text-white transition-colors">
              View Case Studies
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowWeWorkSection;