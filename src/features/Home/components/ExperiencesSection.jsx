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
      shadow: "shadow-pink-500/30",
      blobColor: "bg-pink-400"
    },
    {
      id: "corporate",
      title: "Corporate Family Days",
      subtitle: "Team Building, Reimagined",
      image: "/assets/Corporate Family Days.png",
      link: "/corporate",
      gradient: "from-blue-600 to-cyan-500",
      hoverGradient: "hover:from-blue-500 hover:to-cyan-400",
      shadow: "shadow-blue-500/30",
      blobColor: "bg-blue-400"
    },
    {
      id: "carnival",
      title: "Carnivals",
      subtitle: "Spectacular Fun",
      image: "/assets/Carnival 1.png",
      link: "/carnivals",
      gradient: "from-purple-600 to-indigo-500",
      hoverGradient: "hover:from-purple-500 hover:to-indigo-400",
      shadow: "shadow-purple-500/30",
      blobColor: "bg-purple-400"
    },
    {
      id: "malls",
      title: "Malls & Brands",
      subtitle: "High Footfall Activations",
      image: "/assets/Malls and Brands Activites.png",
      link: "/malls",
      gradient: "from-cyan-500 to-blue-400",
      hoverGradient: "hover:from-cyan-400 hover:to-blue-300",
      shadow: "shadow-cyan-500/30",
      blobColor: "bg-cyan-400"
    }
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#f4f7f9] relative overflow-hidden">
      
      {/* ================= LIQUID AMBIENT BACKGROUND ORBS ================= */}
      <motion.div 
        animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[5%] left-[-10%] w-[60vw] h-[60vw] lg:w-[35vw] lg:h-[35vw] bg-indigo-400/20 blur-[100px] lg:blur-[140px] rounded-full z-0 pointer-events-none"
      />
      <motion.div 
        animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] right-[-10%] w-[60vw] h-[60vw] lg:w-[35vw] lg:h-[35vw] bg-pink-400/20 blur-[100px] lg:blur-[140px] rounded-full z-0 pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-cyan-400/15 blur-[120px] rounded-full z-0 pointer-events-none"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col items-center">
        
        {/* ================= TOP CENTERED LIQUID GLASS HEADER ================= */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl text-center flex flex-col items-center mb-12 sm:mb-20"
        >
          <h2 className="text-[36px] sm:text-[48px] lg:text-[60px] xl:text-[64px] font-sans font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-4 sm:mb-6 drop-shadow-sm">
             <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">What we Do</span>
          </h2>
          
          <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-slate-600 font-medium leading-relaxed bg-white/40 backdrop-blur-2xl p-4 sm:p-6 lg:p-8 rounded-[20px] sm:rounded-3xl border border-white/60 shadow-[0_10px_32px_rgba(31,38,135,0.04)] mb-8 sm:mb-10 max-w-3xl relative overflow-hidden">
            {/* Inner glass highlight */}
            <span className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-0"></span>
            <span className="relative z-10">Blue Sparrow can take your child's interest, your audience, your space, or your objective and build the exact right event around it.</span>
          </p>
          
          <Link to="/contact" className="inline-flex justify-center bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_10px_25px_rgba(79,70,229,0.3)] transform hover:-translate-y-1 transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide items-center gap-3 relative z-10">
            CONTACT US <span className="text-cyan-400 text-[16px] sm:text-lg"></span>
          </Link>
        </motion.div>

        {/* ================= HORIZONTAL CARDS & MOBILE 2-GRID ================= */}
        {/* On mobile: grid-cols-2 (vertical layout). On large screens: grid-cols-2 (horizontal layout) */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (idx % 2) * 0.15, ease: "easeOut" }}
              // The 5th item spans both columns to create a beautiful wide banner effect
              className={`relative flex flex-col group ${idx === 4 ? 'col-span-2' : ''}`}
            >
              <Link 
                to={exp.link}
                // On PC (lg+), the card itself becomes flex-row (image left, text right)
                className="bg-white/40 backdrop-blur-xl rounded-[24px] sm:rounded-[40px] p-2 sm:p-3 lg:p-4 border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] hover:shadow-[0_15px_45px_rgba(31,38,135,0.1)] transform hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 w-full flex flex-col lg:flex-row items-center h-full overflow-hidden relative"
              >
                
                {/* Glowing blob that follows behind the glass on hover */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${exp.blobColor} rounded-full blur-[40px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 z-0`}></div>

                {/* Liquid Frame Image Container (Left side on PC, Top on Mobile) */}
                <div className={`w-full ${idx === 4 ? 'lg:w-[45%]' : 'lg:w-[45%]'} shrink-0 aspect-[4/5] sm:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] rounded-[18px] sm:rounded-[32px] overflow-hidden relative bg-slate-100 z-10 border border-white/50 shadow-inner`}>
                  <img 
                    src={exp.image} 
                    alt={exp.title} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[10s] ease-out"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?auto=format&fit=crop&w=1000&q=80"; }}
                  />
                  {/* Glass highlight overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>

                {/* Content Container (Right side on PC, Bottom on Mobile) */}
                <div className="w-full lg:w-[55%] px-3 sm:px-6 pt-4 sm:pt-6 lg:pt-0 pb-3 sm:pb-5 lg:pb-0 flex flex-col flex-grow relative z-10 lg:pl-8 lg:justify-center">
                  <h3 className="font-sans font-extrabold text-[14px] sm:text-[22px] lg:text-[26px] text-slate-900 mb-1 sm:mb-2 leading-tight transition-colors duration-300 drop-shadow-sm line-clamp-1 sm:line-clamp-none">
                    {exp.title}
                  </h3>
                  
                  <p className="text-[10px] sm:text-[14px] md:text-[15px] font-medium text-slate-600 tracking-wide line-clamp-2 sm:line-clamp-none">
                    {exp.subtitle}
                  </p>

                  {/* Modern Animated Liquid Arrow */}
                  <div className="mt-auto pt-4 sm:pt-6 lg:pt-8 flex items-center justify-between">
                    <span className={`text-[10px] sm:text-[14px] font-bold text-transparent bg-clip-text bg-gradient-to-r ${exp.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                      Explore
                    </span>
                    <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/80 border border-white backdrop-blur-md group-hover:bg-gradient-to-r ${exp.gradient} transition-all duration-500 shadow-sm shrink-0`}>
                      <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-600 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExperiencesSection;