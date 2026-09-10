import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ExperiencesSection = () => {
  const experiences = [
    {
      id: "birthday",
      title: "Birthday Parties",
      subtitle: "Magical Celebrations",
      image: "/assets/Birthday Section.png",
      link: "/kids-parties",
      gradient: "from-pink-500 to-rose-400",
      hoverGradient: "hover:from-pink-400 hover:to-rose-300",
      shadow: "shadow-pink-500/30"
    },
    {
      id: "corporate",
      title: "Corporate Events",
      subtitle: "Team Building, Reimagined",
      image: "/assets/Corporate Family Days.png",
      link: "/corporate",
      gradient: "from-blue-600 to-cyan-500",
      hoverGradient: "hover:from-blue-500 hover:to-cyan-400",
      shadow: "shadow-blue-500/30"
    },
    {
      id: "carnival",
      title: "Carnivals",
      subtitle: "Spectacular Fun",
      image: "/assets/Carnival 1.png",
      link: "/carnivals",
      gradient: "from-purple-600 to-indigo-500",
      hoverGradient: "hover:from-purple-500 hover:to-indigo-400",
      shadow: "shadow-purple-500/30"
    },
    {
      id: "family",
      title: "Family Day",
      subtitle: "Cherish Every Moment",
      image: "/assets/Family.png",
      link: "/family-day",
      gradient: "from-amber-500 to-orange-400",
      hoverGradient: "hover:from-amber-400 hover:to-orange-300",
      shadow: "shadow-orange-500/30"
    },
    {
      id: "malls",
      title: "Malls & Brands",
      subtitle: "High Footfall Activations",
      image: "/assets/Malls and Brands Activites.png",
      link: "/malls",
      gradient: "from-cyan-500 to-blue-400",
      hoverGradient: "hover:from-cyan-400 hover:to-blue-300",
      shadow: "shadow-cyan-500/30"
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[10%] left-[-5%] w-[40vw] h-[40vw] bg-indigo-400/10 blur-[140px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] bg-pink-400/10 blur-[140px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-20 relative z-10">
        
        {/* ================= LEFT SIDE: STICKY PREMIUM HEADER ================= */}
        <div className="w-full lg:w-[35%] relative">
          <div className="lg:sticky lg:top-32 flex flex-col items-start">
            
            <span className="bg-white/80 backdrop-blur-md text-indigo-600 font-bold tracking-[0.2em] uppercase text-[11px] px-5 py-2 rounded-full mb-8 shadow-sm border border-indigo-100">
              The Blue Sparrow Range
            </span>
            
            <h2 className="text-[42px] sm:text-[56px] lg:text-[60px] xl:text-[64px] font-sans font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6">
              We make spaces <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">come alive.</span>
            </h2>
            
            <p className="text-[16px] lg:text-[17px] text-slate-500 font-medium leading-relaxed bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-10">
              Blue Sparrow can take your child's interest, your audience, your space, or your objective and build the exact right event around it.
            </p>
            
            <Link to="/contact" className="inline-flex bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-10 rounded-full shadow-[0_10px_30px_rgba(15,23,42,0.2)] transform hover:-translate-y-1 transition-all duration-300 text-[15px] tracking-wide items-center gap-3">
              Discuss Your Space <span className="text-cyan-400 text-lg">✨</span>
            </Link>

            {/* Subtle Handwritten Decorative Note */}
            <div className="hidden lg:block absolute bottom-[-80px] right-0 opacity-60 rotate-[-10deg]">
              <span className="text-pink-500 text-[24px]" style={{ fontFamily: '"Caveat", cursive' }}>
                Unforgettable Experiences ⤵
              </span>
            </div>

          </div>
        </div>

        {/* ================= RIGHT SIDE: PREMIUM TWO-COLUMN GRID ================= */}
        <div className="w-full lg:w-[65%] grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16 lg:gap-y-20 pt-8 lg:pt-0">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: (idx % 2) * 0.2, ease: "easeOut" }}
              // The 5th item gracefully spans both columns on larger screens to balance the grid
              className={`relative flex flex-col items-center group ${idx === 4 ? 'sm:col-span-2 sm:w-[85%] sm:mx-auto' : ''}`}
            >
              
              {/* Premium Framed Image Container */}
              <div className="w-full aspect-[4/3] rounded-[40px] md:rounded-[48px] overflow-hidden border-[6px] md:border-[8px] border-white bg-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative z-10 transition-all duration-700 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
                <img 
                  src={exp.image} 
                  alt={exp.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[10s] ease-out"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?auto=format&fit=crop&w=1000&q=80"; }}
                />
                {/* Dark gradient for text legibility & depth */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
              </div>

              {/* High-End Glassmorphic Pill */}
              <div className="relative -mt-10 md:-mt-12 z-20 w-[90%] md:w-[85%]">
                <Link 
                  to={exp.link}
                  className={`bg-gradient-to-r ${exp.gradient} ${exp.hoverGradient} text-white flex flex-col items-center justify-center w-full py-4 md:py-5 rounded-full shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3)] ${exp.shadow} border-[3px] border-white/40 backdrop-blur-md transform group-hover:-translate-y-2 transition-all duration-500`}
                >
                  <span className="font-sans font-bold text-[20px] lg:text-[22px] tracking-tight drop-shadow-md text-center leading-tight">
                    {exp.title}
                  </span>
                  <span className="text-white/90 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mt-1 drop-shadow-sm text-center">
                    {exp.subtitle}
                  </span>
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExperiencesSection;