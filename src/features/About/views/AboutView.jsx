import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';

// ================= CUSTOM CSS ICONS FOR STATS =================
const CssIcon = ({ type }) => {
  switch(type) {
    case 'kids':
      return (
        <div className="flex gap-1 justify-center items-end h-full pb-2">
          <div className="w-4 h-6 bg-current rounded-full"><div className="w-3 h-3 bg-white rounded-full mx-auto mt-1"></div></div>
          <div className="w-5 h-8 bg-current rounded-full"><div className="w-4 h-4 bg-white rounded-full mx-auto mt-1"></div></div>
        </div>
      );
    case 'schools':
      return (
        <div className="w-8 h-8 border-4 border-current rounded-sm relative mt-2">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[12px] border-transparent border-b-current"></div>
          <div className="w-2 h-4 bg-current mx-auto mt-3"></div>
        </div>
      );
    case 'events':
      return (
        <div className="w-8 h-8 border-4 border-current rounded-md relative mt-2 flex flex-col justify-end p-1">
          <div className="absolute -top-2 left-1 w-2 h-3 bg-current rounded-full"></div>
          <div className="absolute -top-2 right-1 w-2 h-3 bg-current rounded-full"></div>
          <div className="w-full h-4 bg-current"></div>
        </div>
      );
    case 'workshops':
      return (
        <div className="w-8 h-8 border-4 border-current rounded-full relative mt-1 flex items-center justify-center">
          <div className="w-4 h-4 bg-current rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
        </div>
      );
    case 'carnivals':
      return (
        <div className="relative w-8 h-8 border-4 border-current rounded-full flex items-center justify-center animate-[spin_6s_linear_infinite] mt-1">
          <div className="absolute w-full h-0.5 bg-current"></div>
          <div className="absolute w-0.5 h-full bg-current"></div>
          <div className="absolute w-full h-0.5 bg-current rotate-45"></div>
          <div className="absolute w-0.5 h-full bg-current rotate-45"></div>
        </div>
      );
    case 'cities':
      return (
        <div className="w-6 h-6 border-4 border-current rounded-full rounded-br-none transform -rotate-45 relative mt-2">
           <div className="w-2 h-2 bg-current rounded-full absolute top-1 left-1"></div>
        </div>
      );
    case 'teachers':
      return (
        <div className="w-8 h-6 border-4 border-current rounded-sm relative mt-3 flex items-center justify-center">
           <div className="absolute -top-3 left-2 w-3 h-3 bg-current rounded-full"></div>
           <div className="w-4 h-1 bg-current"></div>
        </div>
      );
    case 'labs':
      return (
        <div className="w-6 h-8 border-4 border-t-0 border-current rounded-b-xl relative mt-2">
           <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-current"></div>
           <div className="absolute bottom-1 left-1 w-3 h-3 bg-current rounded-full"></div>
        </div>
      );
    default: return <div className="w-6 h-6 bg-current rounded-full"></div>;
  }
};

// Reusable Dual-Tone Star doodle
const StarDoodle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="url(#aboutGrad)" />
  </svg>
);

const AboutView = () => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = [
    { id: 1, src: "/assets/dummy-gallery-1.jpg", tag: "Kids Parties" },
    { id: 2, src: "/assets/dummy-gallery-2.jpg", tag: "Corporate" },
    { id: 3, src: "/assets/dummy-gallery-3.jpg", tag: "Carnivals" },
    { id: 4, src: "/assets/dummy-gallery-4.jpg", tag: "Family Day" },
    { id: 5, src: "/assets/dummy-gallery-5.jpg", tag: "Workshops" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000); 
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-pink-100 selection:text-brand-navy overflow-hidden">
      <Navbar />
      
      {/* ================= HERO & CORE VALUES ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-white">
        
        {/* Full Screen Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/About.png" 
            alt="About Blue Sparrow" 
            className="w-full h-full object-cover object-center" 
            onError={(e) => { 
              e.target.style.display = 'none'; 
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-[#fff6ef]', 'via-[#f0f9ff]', 'to-[#fce7f3]'); 
            }} 
          />
          {/* Masking gradients to make text legible over image */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-white/90"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f4f9ff] to-transparent"></div>
        </div>

        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 text-center relative z-20 pb-20 pt-16">
          <StarDoodle className="absolute top-10 left-[15%] w-8 h-8 animate-pulse opacity-80" />
          <StarDoodle className="absolute bottom-10 right-[15%] w-6 h-6 animate-pulse opacity-80" />
          
          <h1 className="text-5xl md:text-7xl lg:text-[84px] font-serif font-bold text-[#1e293b] mb-12 tracking-tight drop-shadow-md relative inline-block">
            About Blue Sparrow
            {/* CSS abstract doodle under title */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 border-b-[4px] border-pink-300 rounded-full opacity-60 rotate-[1deg]"></div>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-20">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(244,114,182,0.15)] transition-shadow">
              <h3 className="font-bold text-pink-500 mb-3 uppercase tracking-widest text-[11px]">Our Vision</h3>
              <p className="text-[#1e293b] font-serif text-[22px] font-bold">No. 1 Kids Edutainer</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] transition-shadow">
              <h3 className="font-bold text-blue-500 mb-3 uppercase tracking-widest text-[11px]">Our Mission</h3>
              <p className="text-gray-600 text-[14px] font-medium leading-relaxed">To be the no. 1 events company for parents and corporates when they buy edutainment services for their kids.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] transition-shadow">
              <h3 className="font-bold text-emerald-500 mb-3 uppercase tracking-widest text-[11px]">Value Prop</h3>
              <p className="text-gray-600 text-[14px] font-medium leading-relaxed">Delivering meaningful events while making science & art fun for 3 to 11 yr old urban kids.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALIDATION & ROADMAP ================= */}
      <section className="py-24 bg-[#f4f9ff] relative border-y border-blue-50 overflow-hidden">
        
        {/* Background CSS Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-pink-100 rounded-full blur-[80px] opacity-60"></div>
        <div className="absolute top-[20%] right-[5%] w-24 h-24 border-[4px] border-dashed border-blue-200 rounded-full opacity-40"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          
          <div className="text-center mb-16 relative">
            <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-4 relative inline-block">
              Validation from Market
              <div className="absolute -bottom-1 left-0 w-[110%] h-3 bg-blue-100 opacity-60 rounded-full rotate-[-1deg] z-[-1] -translate-x-[5%]"></div>
            </h2>
            <p className="text-gray-500 text-[15px]">Our footprint of spreading joy across the nation.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 relative z-10">
            {[
              { icon: 'kids', value: '45,000+', label: 'Kids', color: 'text-[#f472b6]' },
              { icon: 'schools', value: '33+', label: 'Schools & Preschools', color: 'text-[#3b82f6]' },
              { icon: 'events', value: '350+', label: 'Events', color: 'text-[#f59e0b]' },
              { icon: 'workshops', value: '150', label: 'Unique Workshops', color: 'text-[#10b981]' },
              { icon: 'carnivals', value: '24', label: 'Carnivals', color: 'text-[#a855f7]' },
              { icon: 'cities', value: '16', label: 'Cities Presence', color: 'text-[#f43f5e]' },
              { icon: 'teachers', value: '150+', label: 'Teachers Trained', color: 'text-[#06b6d4]' },
              { icon: 'labs', value: '25', label: 'Interactive Science Labs', color: 'text-[#6366f1]' }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center text-center group">
                <div className={`w-16 h-16 rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50 flex items-center justify-center mb-4 ${stat.color} group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300 relative`}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-current rounded-[20px] transition-opacity`}></div>
                  <CssIcon type={stat.icon} />
                </div>
                <h4 className="text-[24px] font-bold text-[#1e293b]">{stat.value}</h4>
                <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wide mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Winding CSS Roadmap */}
          <div className="relative max-w-4xl mx-auto py-10 mt-10 hidden md:block">
             <svg className="absolute inset-0 w-full h-full text-blue-200" preserveAspectRatio="none" viewBox="0 0 1000 200">
               <path d="M 50,100 C 200,200 400,0 600,100 S 800,200 950,100" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10"/>
             </svg>
             
             <div className="relative z-10 flex justify-between items-center h-[200px]">
               <div className="text-center transform -translate-y-8">
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-[#f472b6] mx-auto flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform"><span className="w-4 h-4 bg-[#f472b6] rounded-full animate-pulse"></span></div>
                 <h5 className="font-bold text-[#1e293b] text-[18px]">2015</h5>
                 <p className="text-[11px] text-gray-500 max-w-[120px] mx-auto leading-tight mt-1">Bringing science parties to vogue</p>
               </div>
               <div className="text-center transform translate-y-12">
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-[#3b82f6] mx-auto flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform"><span className="w-4 h-4 bg-[#3b82f6] rounded-full animate-pulse"></span></div>
                 <h5 className="font-bold text-[#1e293b] text-[18px]">2016</h5>
                 <p className="text-[11px] text-gray-500 max-w-[120px] mx-auto leading-tight mt-1">Workshop started</p>
               </div>
               <div className="text-center transform -translate-y-12">
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-[#f59e0b] mx-auto flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform"><span className="w-4 h-4 bg-[#f59e0b] rounded-full animate-pulse"></span></div>
                 <h5 className="font-bold text-[#1e293b] text-[18px]">2018</h5>
                 <p className="text-[11px] text-gray-500 max-w-[120px] mx-auto leading-tight mt-1">First franchise in Pune</p>
               </div>
               <div className="text-center transform translate-y-8">
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-[#10b981] mx-auto flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform"><span className="w-4 h-4 bg-[#10b981] rounded-full animate-pulse"></span></div>
                 <h5 className="font-bold text-[#1e293b] text-[18px]">2019</h5>
                 <p className="text-[11px] text-gray-500 max-w-[120px] mx-auto leading-tight mt-1">Jio Wonderland. No. 1 choice for kids events</p>
               </div>
             </div>
          </div>

        </div>
      </section>

      {/* ================= THE BLUESPARROW PHILOSOPHY ================= */}
      <section className="py-24 bg-white relative z-20 overflow-hidden">
        {/* CSS abstract curves filling empty space */}
        <div className="absolute top-[20%] left-[-10%] w-[30vw] h-[30vw] border-[2px] border-pink-100 rounded-full opacity-50 z-0 pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] bg-blue-50 opacity-40 blur-[80px] rounded-full z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          
          <div>
            <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-10 relative inline-block">
              Our Philosophy
              <div className="absolute bottom-1 left-[-5%] w-[110%] h-3 bg-yellow-100 opacity-60 rounded-full rotate-[1deg] z-[-1]"></div>
            </h2>
            
            <div className="mb-8 relative group">
              <div className="absolute -left-6 top-1 w-2 h-full bg-pink-100 rounded-full group-hover:bg-pink-400 transition-colors"></div>
              <h4 className="text-[16px] font-bold text-pink-500 mb-2 uppercase tracking-wide">Target Group</h4>
              <ul className="list-disc pl-5 text-gray-600 text-[15px] space-y-1.5 leading-relaxed">
                <li>Retail spaces for families like malls, stores, realtors, offices.</li>
                <li>Affluent Urban mothers of 3-11yr olds from Urban HNI families.</li>
              </ul>
            </div>

            <div className="mb-8 relative group">
              <div className="absolute -left-6 top-1 w-2 h-full bg-blue-100 rounded-full group-hover:bg-blue-400 transition-colors"></div>
              <h4 className="text-[16px] font-bold text-blue-500 mb-2 uppercase tracking-wide">The Need</h4>
              <p className="text-gray-600 text-[15px] leading-relaxed">For rearing atma nirbhar kids, society needs GREEN Event planners, edutainers who inspire fascination for Science and arts in an ultra experiential fun design.</p>
            </div>

            <div className="mb-6 relative group">
              <div className="absolute -left-6 top-1 w-2 h-full bg-emerald-100 rounded-full group-hover:bg-emerald-400 transition-colors"></div>
              <h4 className="text-[16px] font-bold text-emerald-500 mb-2 uppercase tracking-wide">Point of Difference</h4>
              <p className="text-gray-600 text-[15px] leading-relaxed">Blue Sparrow creates activity-first, learning-led experiences highly engaging for children and commercially valuable for brands. Our strength lies in turning STEM, art, play, and storytelling into scalable, premium formats that are execution-ready.</p>
            </div>
          </div>

          {/* Problem & Solution Callout Box */}
          <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] text-white p-10 md:p-14 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500 rounded-full blur-[60px] opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-[50px] opacity-30"></div>
            <div className="absolute top-10 right-10 text-yellow-300 text-3xl opacity-50 rotate-12">✦</div>
            
            <h3 className="text-[24px] font-serif font-bold text-pink-400 mb-4 relative z-10">The Problem</h3>
            <p className="text-blue-50 text-[14px] leading-relaxed mb-8 pb-8 border-b border-white/10 relative z-10">
              Planning green kids' edutainment requires expert child psychology knowledge and hands-on experience, making it time-consuming and expensive. For retail spaces, it's hard to attract footfall, and for parents, it's painstaking to identify vendors in a fast-paced lifestyle.
            </p>

            <h3 className="text-[24px] font-serif font-bold text-emerald-400 mb-4 relative z-10">Our Solution</h3>
            <p className="text-blue-50 text-[14px] leading-relaxed relative z-10">
              Combining education with entertainment by organizing science and arts activities to disseminate knowledge in a fun-filled manner. We also build trust by undertaking CSR education projects for corporates.
            </p>
          </div>

        </div>
      </section>

      {/* ================= WHY HIRE US ================= */}
      <section className="py-24 bg-[#fffdfa] relative z-20 overflow-hidden border-t border-gray-50">
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-50 via-transparent to-transparent opacity-80 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-16 relative inline-block">
            Why Hire Us?
            <div className="absolute -bottom-2 left-[10%] w-[80%] h-1 border-b-2 border-dashed border-pink-300 opacity-60"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-left">
            <div className="bg-white p-10 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-pink-50 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(244,114,182,0.15)] transition-all duration-300 relative group overflow-hidden">
              <div className="absolute -right-10 -bottom-10 text-[120px] font-serif font-bold text-pink-50/50 group-hover:text-pink-100/50 transition-colors z-0">01</div>
              <span className="text-[48px] font-serif text-pink-400 block mb-6 leading-none relative z-10">01</span>
              <p className="text-[#1e293b] font-bold text-[16px] leading-relaxed relative z-10">Because you don't want to choose from a set catalogue; you want us to customise as per your audience and specific event goals.</p>
            </div>
            
            <div className="bg-white p-10 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-blue-50 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] transition-all duration-300 relative group overflow-hidden md:-translate-y-6">
              <div className="absolute -right-10 -bottom-10 text-[120px] font-serif font-bold text-blue-50/50 group-hover:text-blue-100/50 transition-colors z-0">02</div>
              <span className="text-[48px] font-serif text-blue-400 block mb-6 leading-none relative z-10">02</span>
              <p className="text-[#1e293b] font-bold text-[16px] leading-relaxed relative z-10">Cause you don't want your weeks and months of hard work put in the event to be forgotten in 2 days!</p>
            </div>
            
            <div className="bg-white p-10 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-emerald-50 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] transition-all duration-300 relative group overflow-hidden">
              <div className="absolute -right-10 -bottom-10 text-[120px] font-serif font-bold text-emerald-50/50 group-hover:text-emerald-100/50 transition-colors z-0">03</div>
              <span className="text-[48px] font-serif text-emerald-400 block mb-6 leading-none relative z-10">03</span>
              <p className="text-[#1e293b] font-bold text-[16px] leading-relaxed relative z-10">Unique Innovative approach, a distinctive blend of science, play, and arts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEET THE TEAM ================= */}
      <section className="py-24 bg-white relative z-20 overflow-hidden">
        {/* CSS abstract curves filling empty space */}
        <div className="absolute top-[10%] left-[5%] w-[20vw] h-[20vw] border-[2px] border-dashed border-purple-100 rounded-full opacity-40 z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#1e293b] mb-16 relative inline-block">
            Meet The Founder
            <div className="absolute bottom-2 left-[-10%] w-[120%] h-3 bg-pink-100 opacity-60 rounded-full rotate-[1deg] z-[-1]"></div>
          </h2>
          
          <div className="flex flex-col items-center group cursor-pointer w-full max-w-lg mx-auto relative">
            <StarDoodle className="absolute top-10 right-10 w-8 h-8 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
            
            <motion.div 
              animate={{ borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-56 h-56 md:w-72 md:h-72 bg-gradient-to-tr from-pink-300 to-amber-200 p-1 mb-8 shadow-md group-hover:shadow-[0_10px_40px_rgba(244,114,182,0.3)] transition-all duration-500 relative z-10"
            >
              <div className="w-full h-full bg-white rounded-inherit overflow-hidden">
                <img src="/assets/team-sanskriti.jpg" alt="Sanskriti Singh" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => { e.target.style.display='none'; e.target.parentElement.classList.add('bg-gradient-to-br', 'from-pink-100', 'to-pink-50'); }} 
                />
              </div>
            </motion.div>
            
            <h3 className="text-[28px] font-serif font-bold text-[#1e293b] group-hover:text-pink-500 transition-colors mb-2">Sanskriti Singh</h3>
            <p className="text-pink-400 font-bold text-[12px] tracking-[0.2em] uppercase mb-5">Founder</p>
            <div className="flex flex-wrap justify-center gap-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              <span className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">MA in Economics</span>
              <span className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">IIM B 10k Women</span>
              <span className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">IIM-K School Leadership</span>
              <span className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">15yrs exp in Kids Edutainment</span>
            </div>
            <p className="text-gray-500 mt-6 max-w-md text-[15px] leading-relaxed font-light">On a mission to bring alternative teaching methods to masses through meaningful events.</p>
          </div>
        </div>
      </section>

      {/* ================= MACOS STYLE INFINITE IMAGE SLIDER ================= */}
      <section className="py-24 bg-[#f4f9ff] relative z-20 overflow-hidden border-y border-blue-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12 text-center">
          <h2 className="text-[32px] md:text-[36px] font-serif font-bold text-[#1e293b] mb-3">Our World in Color</h2>
          <p className="text-gray-500 text-[15px] font-light">A sneak peek into the beautiful events we've brought to life.</p>
        </div>

        <div className="relative w-full h-[350px] md:h-[450px] flex justify-center items-center">
          {galleryImages.map((img, index) => {
            let offset = index - currentIndex;
            if (offset < -2) offset += galleryImages.length;
            if (offset > 2) offset -= galleryImages.length;

            const isCenter = offset === 0;
            const isAdjacent = Math.abs(offset) === 1;
            const scale = isCenter ? 1.2 : isAdjacent ? 0.85 : 0.65;
            // Use responsive offsets
            const offsetMultiplier = window.innerWidth < 768 ? 160 : 280; 
            const x = offset * offsetMultiplier; 
            const zIndex = 10 - Math.abs(offset);
            const opacity = Math.abs(offset) <= 2 ? (isCenter ? 1 : isAdjacent ? 0.7 : 0.3) : 0;

            return (
              <motion.div
                key={img.id}
                animate={{ x, scale, zIndex, opacity }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute w-[260px] h-[190px] md:w-[380px] md:h-[260px] rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.15)] bg-white flex-shrink-0"
              >
                <img 
                  src={img.src} 
                  alt={img.tag} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-100', 'to-pink-100', 'flex', 'items-center', 'justify-center');
                    e.target.nextElementSibling.innerHTML = `<span class="text-indigo-500 font-bold uppercase tracking-widest text-[10px]">Image Placeholder</span>`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/60 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold tracking-widest uppercase text-[10px] border border-white/30 bg-black/20 backdrop-blur-md px-5 py-2 rounded-full">
                    {img.tag}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= OUR BLOGS ================= */}
      <section className="py-24 bg-white relative z-20 overflow-hidden">
        
        {/* CSS abstract doodle shapes */}
        <div className="absolute top-[15%] right-[-5%] w-[30vw] h-[30vw] bg-pink-50 opacity-40 blur-[80px] rounded-full z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          
          <div className="text-center mb-16 relative">
            <h2 className="text-[36px] md:text-[42px] font-serif font-bold text-[#965a3e] mb-2 relative inline-block">
              Our Blogs
              <div className="absolute -bottom-1 left-0 w-full h-1 border-b-2 border-dashed border-[#965a3e]/30 opacity-60"></div>
            </h2>
            <p className="text-gray-500 mt-3 font-light text-[15px]">Insights, tips, and stories from the event planning world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(150,90,62,0.1)] transition-all duration-500 border border-red-50 p-5 group cursor-pointer relative">
              <div className="absolute top-8 right-8 text-pink-300 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-12 z-10">✨</div>
              <div className="w-full h-52 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center relative">
                <img src="/assets/blog-1.jpg" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-[10px] uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 1" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] leading-tight mb-4 px-2 group-hover:text-pink-500 transition-colors">Peppa Pig Birthday Magic at Sofitel, BKC</h4>
              <p className="text-gray-500 text-[13px] font-light leading-relaxed mb-8 px-4 flex-grow">When it comes to making birthday experiences unforgettable, Blue Sparrow Events is well aware of how to turn dreams into reality.</p>
              <button className="border border-[#965a3e]/30 text-[#965a3e] group-hover:bg-[#965a3e] group-hover:text-white transition-colors rounded-full px-8 py-3 text-[13px] font-bold mt-auto mb-2 w-full max-w-[200px]">Read More</button>
            </div>

            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(150,90,62,0.1)] transition-all duration-500 border border-red-50 p-5 group cursor-pointer md:-translate-y-6">
              <div className="w-full h-52 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center">
                <img src="/assets/blog-2.jpg" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-[10px] uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 2" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] leading-tight mb-4 px-2 group-hover:text-pink-500 transition-colors">DIY vs. Pro Birthday Planner</h4>
              <p className="text-gray-500 text-[13px] font-light leading-relaxed mb-8 px-4 flex-grow">As we plan a birthday party, one is usually met with a decision: do it yourself and sort everything out individually, or take a pro.</p>
              <button className="border border-[#965a3e]/30 text-[#965a3e] group-hover:bg-[#965a3e] group-hover:text-white transition-colors rounded-full px-8 py-3 text-[13px] font-bold mt-auto mb-2 w-full max-w-[200px]">Read More</button>
            </div>

            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(150,90,62,0.1)] transition-all duration-500 border border-red-50 p-5 group cursor-pointer relative">
              <div className="absolute top-8 left-8 text-blue-300 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -rotate-12 z-10">✦</div>
              <div className="w-full h-52 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center">
                <img src="/assets/blog-3.jpg" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-[10px] uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 3" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] leading-tight mb-4 px-2 group-hover:text-pink-500 transition-colors">Planning a Party Around Your Child's Interests</h4>
              <p className="text-gray-500 text-[13px] font-light leading-relaxed mb-8 px-4 flex-grow">Want to throw a birthday bash that's as unique as your child? A party that reflects their wildest dreams, favorite heroes, and biggest passions?</p>
              <button className="border border-[#965a3e]/30 text-[#965a3e] group-hover:bg-[#965a3e] group-hover:text-white transition-colors rounded-full px-8 py-3 text-[13px] font-bold mt-auto mb-2 w-full max-w-[200px]">Read More</button>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutView;