import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

// =========================================================================
// 1. REUSABLE COMPONENTS & ICONS
// =========================================================================

// Custom Non-Copyrighted SVG Illustrations for the Journey Timeline
const JourneyIcon = ({ type, color }) => {
  const baseClasses = `w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]`;
  switch(type) {
    case 'flask': return (
      <svg className={baseClasses} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 20 L40 40 L20 80 A10 10 0 0 0 30 95 L70 95 A10 10 0 0 0 80 80 L60 40 L60 20 Z" fill="url(#glass-grad)" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
        <path d="M25 75 C 40 85, 60 65, 75 75 L70 95 L30 95 Z" fill={color} opacity="0.6"/>
        <circle cx="45" cy="70" r="5" fill="white" opacity="0.8"/>
        <circle cx="60" cy="85" r="3" fill="white" opacity="0.8"/>
        <ellipse cx="50" cy="50" rx="30" ry="10" stroke={color} strokeWidth="3" transform="rotate(-20 50 50)" opacity="0.5"/>
        <defs><linearGradient id="glass-grad" x1="0" y1="0" x2="100" y2="100"><stop offset="0%" stopColor="white" stopOpacity="0.8"/><stop offset="100%" stopColor="white" stopOpacity="0.2"/></linearGradient></defs>
      </svg>
    );
    case 'workshop': return (
      <svg className={baseClasses} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L70 40 L65 90 L35 90 Z" fill="url(#glass-grad)" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
        <path d="M45 20 L40 45 M55 15 L50 45 M65 25 L55 45" stroke={color} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="45" cy="15" r="5" fill={color}/>
        <path d="M20 70 L40 60 L30 80 Z" fill={color} opacity="0.6"/>
        <path d="M80 60 L70 80 L90 75 Z" fill={color} opacity="0.8"/>
      </svg>
    );
    case 'store': return (
      <svg className={baseClasses} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 50 L80 50 L80 90 L20 90 Z" fill="white" stroke={color} strokeWidth="4"/>
        <path d="M30 60 L70 60 L70 80 L30 80 Z" fill="url(#glass-grad)" stroke={color} strokeWidth="3"/>
        <path d="M15 50 L25 30 L35 50 L45 30 L55 50 L65 30 L75 50 L85 30 L85 50 Z" fill={color}/>
        <path d="M45 70 L55 70" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    );
    case 'ferris': return (
      <svg className={baseClasses} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="45" r="35" fill="none" stroke={color} strokeWidth="4"/>
        <circle cx="50" cy="45" r="25" fill="none" stroke={color} strokeWidth="2" opacity="0.5"/>
        <path d="M50 45 L50 10 M50 45 L50 80 M50 45 L15 45 M50 45 L85 45 M50 45 L25 20 M50 45 L75 70 M50 45 L75 20 M50 45 L25 70" stroke={color} strokeWidth="2"/>
        <path d="M50 45 L35 95 L65 95 Z" fill="url(#glass-grad)" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
        <circle cx="50" cy="10" r="5" fill={color}/>
        <circle cx="85" cy="45" r="5" fill={color}/>
        <circle cx="15" cy="45" r="5" fill={color}/>
        <circle cx="50" cy="80" r="5" fill={color}/>
      </svg>
    );
    case 'map': return (
      <svg className={baseClasses} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10 C 70 20, 80 40, 70 70 C 60 90, 50 95, 50 95 C 50 95, 40 90, 30 70 C 20 40, 30 20, 50 10 Z" fill="url(#glass-grad)" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
        <circle cx="40" cy="40" r="4" fill={color}/><circle cx="60" cy="35" r="4" fill={color}/><circle cx="55" cy="60" r="4" fill={color}/><circle cx="35" cy="55" r="4" fill={color}/>
        <path d="M40 40 L60 35 L55 60 L35 55 Z" stroke={color} strokeWidth="1.5" strokeDasharray="3 3"/>
      </svg>
    );
    case 'camera': return (
      <svg className={baseClasses} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L70 40 L75 75 L25 75 Z" fill="url(#glass-grad)" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
        <circle cx="50" cy="57" r="10" fill="none" stroke={color} strokeWidth="3"/>
        <path d="M40 40 L45 30 L55 30 L60 40" fill={color}/>
        <path d="M80 30 L90 20 M85 45 L95 40 M75 20 L80 10" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    );
    default: return null;
  }
};

const CssLocationPin = ({ colorClass }) => (
  <div className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14">
    <div className={`w-8 h-8 md:w-12 md:h-12 border-[4px] md:border-[5px] ${colorClass} bg-white rounded-[50%_50%_50%_0] transform rotate-45 flex items-center justify-center shadow-lg relative z-20`}>
      <div className="w-2 h-2 md:w-3 md:h-3 bg-current rounded-full" />
    </div>
    <div className="absolute -bottom-1 w-4 h-2 bg-black/20 rounded-full blur-[2px] z-10"></div>
  </div>
);

const StarDoodle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient></defs>
    <path d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z" fill="url(#aboutGrad)" />
  </svg>
);

// =========================================================================
// MAIN PAGE COMPONENT
// =========================================================================

const AboutView = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dbGallery, setDbGallery] = useState([]);
  const [dbTexts, setDbTexts] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      // Fetch Images
      const { data: gallery } = await supabase.from('gallery_images').select('*').eq('theme_id', 'about').order('created_at', { ascending: false });
      if (gallery) setDbGallery(gallery);

      // Fetch Texts
      const { data: texts } = await supabase.from('website_text').select('*').eq('page_id', 'about');
      if (texts) {
        const textMap = texts.reduce((acc, curr) => ({ ...acc, [curr.text_key]: curr.content }), {});
        setDbTexts(textMap);
      }
    };
    
    fetchData();

    // Listeners for live updates from Admin Panel
    const imgChannel = supabase.channel('live-about-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe();
    const textChannel = supabase.channel('live-about-texts').on('postgres_changes', { event: '*', schema: 'public', table: 'website_text' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(imgChannel);
      supabase.removeChannel(textChannel);
    };
  }, []);

  // === SAFE IMAGE LOOKUPS ===
  const desktopHero = dbGallery.find(img => img.category === 'hero_desktop')?.image_url;
  const mobileHero = dbGallery.find(img => img.category === 'hero_mobile')?.image_url;
  const visionImg1 = dbGallery.find(img => img.category === 'vision1')?.image_url;
  const visionImg2 = dbGallery.find(img => img.category === 'vision2')?.image_url;

  const sanskritiImg = dbGallery.find(img => img.category === 'team_sanskriti')?.image_url;
  const parulImg = dbGallery.find(img => img.category === 'team_parul')?.image_url;
  const deeptiImg = dbGallery.find(img => img.category === 'team_deepti')?.image_url;
  const nagmaImg = dbGallery.find(img => img.category === 'team_nagma')?.image_url;

  // === DATA STRUCTURES ===
  const milestones = [
    { year: '2015', title: 'Bringing science parties to vogue', subtitle: '', icon: 'flask', color: 'border-[#38BDF8] text-[#38BDF8]', blob: 'bg-[#38BDF8]/20' },
    { year: '2016', title: 'Workshop started', subtitle: '', icon: 'workshop', color: 'border-[#8B5CF6] text-[#8B5CF6]', blob: 'bg-[#8B5CF6]/20' },
    { year: '2018', title: 'First franchise in Pune', subtitle: '', icon: 'store', color: 'border-[#F5B82E] text-[#F5B82E]', blob: 'bg-[#F5B82E]/20' },
    { year: '2019', title: 'Jio Wonderland', subtitle: 'No. 1 choice for kids events', icon: 'ferris', color: 'border-[#22B8CF] text-[#22B8CF]', blob: 'bg-[#22B8CF]/20' },
    { year: '2022', title: 'Top 7 Indian cities', subtitle: 'Availability across India', icon: 'map', color: 'border-[#EC6FA9] text-[#EC6FA9]', blob: 'bg-[#EC6FA9]/20' },
    { year: '2023', title: "Becoming celebrities' choice", subtitle: '', icon: 'camera', color: 'border-[#765FE8] text-[#765FE8]', blob: 'bg-[#765FE8]/20' },
  ];

  const teamData = [
    { name: "Sanskriti", role: "Chief Playmaker", bio: "Turns chaos into carnival—on time, every time.", power: "Chaos → Carnival", img: sanskritiImg || "assets/Sanskriti.jpg", color: "text-[#EC6FA9]" },
    { name: "Parul", role: "Event Captain", bio: "If there’s a crowd, she’s the conductor.", power: "Setup-to-Sparkle", img: parulImg || "assets/Parul.jpg", color: "text-[#3979D8]" },
    { name: "Deepti", role: "Head of Sales", bio: "Turns maybes into yeses without the push.", power: "Yes-Maker", img: deeptiImg || "assets/Deepti.jpg", color: "text-[#F5B82E]" },
    { name: "Nagma", role: "Accountant", bio: "Balances budgets and confetti counts.", power: "Invoice Tamer", img: nagmaImg || "assets/Deepti.jpg", color: "text-[#8B5CF6]" },
  ];

  // Slider Array Preparation
  const glimpseImages = dbGallery.filter(g => g.category === 'glimpse');
  const fallbackImages = [
    { id: 'f1', src: "https://images.unsplash.com/photo-1530213786676-4122d1e2e989?auto=format&fit=crop&w=800&q=80", tag: "Kids Event" },
    { id: 'f2', src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", tag: "Carnival" },
    { id: 'f3', src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80", tag: "Corporate" },
  ];
  
  let displaySlider = glimpseImages.length > 0 ? glimpseImages : fallbackImages;
  if (displaySlider.length > 0 && displaySlider.length < 5) {
    const extendedGallery = [...displaySlider];
    while (extendedGallery.length < 5) extendedGallery.push(...displaySlider);
    displaySlider = extendedGallery.slice(0, 5);
  }

  // Auto-scroll Timer for Gallery
  useEffect(() => {
    if (displaySlider.length === 0) return;
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % displaySlider.length), 3000); 
    return () => clearInterval(timer);
  }, [displaySlider.length]);

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-pink-100 selection:text-[#102A56] overflow-hidden relative">
      <BrandLogo />
      <Navbar />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full h-[60vh] lg:h-[85vh] flex items-center justify-center overflow-hidden bg-[#F4FBFF] mt-16 sm:mt-24 border-b border-blue-50">
        <div className="absolute inset-0 z-0 hidden sm:block">
          <img src={desktopHero || "/assets/About.png"} alt="About Blue Sparrow" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 z-0 block sm:hidden">
          <img src={mobileHero || desktopHero || "/assets/About.png"} alt="About Blue Sparrow Mobile" className="w-full h-full object-cover object-center" />
        </div>
        
        {/* Soft gradient to blend with the next section, NO heavy dark blurs */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F4FBFF] to-transparent z-10"></div>
        
        <div className="relative z-20 text-center px-4 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-serif font-bold text-white tracking-tight drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)] relative inline-block"
          >
            {dbTexts.hero_title || ""}
          </motion.h1>
        </div>
      </section>

      {/* ================= 2. VISION & MISSION ================= */}
      <section className="py-20 lg:py-32 bg-[#F4FBFF] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-pink-100/40 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="w-full lg:w-1/2 relative min-h-[350px] sm:min-h-[500px] flex items-center justify-center mt-10 lg:mt-0 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -40, rotate: -10 }} whileInView={{ opacity: 1, x: 0, rotate: -6 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-[5%] left-[5%] w-[65%] aspect-[4/3] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-[8px] border-white z-10 bg-gray-200"
            >
              <img src={visionImg1 || "/assets/Team 1.jpg"} alt="Our Vision 1" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"; }} />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 40, rotate: 10 }} whileInView={{ opacity: 1, x: 0, rotate: 6 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute bottom-[5%] right-[5%] w-[70%] aspect-[4/3] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.15)] border-[8px] border-white z-20 bg-gray-200"
            >
              <img src={visionImg2 || "/assets/Team 2.jpg"} alt="Our Vision 2" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&w=800&q=80"; }} />
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 relative z-30 pt-10 lg:pt-0 order-1 lg:order-2">
            <span className="inline-block bg-white/60 backdrop-blur-md text-[#4C8FEA] font-bold px-6 py-2 rounded-full text-xs uppercase tracking-widest mb-6 shadow-sm border border-white">
              {dbTexts.vision_badge || "About Us"}
            </span>
            <h2 className="text-[32px] sm:text-[42px] lg:text-[50px] font-sans font-extrabold text-[#102A56] leading-[1.15] tracking-tight mb-8">
              {dbTexts.vision_title || "Bringing Joy to Every Celebration"}
            </h2>
            <div className="space-y-5 text-[#55708F] text-[15px] sm:text-[16px] font-medium leading-relaxed">
              <p>{dbTexts.vision_p1 || "At Blue Sparrow Events, we believe every child deserves a celebration that sparks wonder and creates lasting memories. With years of experience in event planning, we specialize in transforming ordinary moments into extraordinary adventures."}</p>
              <p>{dbTexts.vision_p2 || "Our team of creative professionals is passionate about crafting safe, engaging, and magical experiences that bring families together and create stories worth telling for years to come."}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 pt-8 border-t border-blue-100/50">
              <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white">
                <h4 className="font-bold text-[#4C8FEA] mb-1">Our Mission</h4>
                <p className="text-sm text-[#55708F]">{dbTexts.mission_desc || "To be the No.1 events company for parents when they seek premium edutainment."}</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white">
                <h4 className="font-bold text-[#765FE8] mb-1">Our Vision</h4>
                <p className="text-sm text-[#55708F]">{dbTexts.vision_desc || "Delivering meaningful events while making science & art deeply engaging."}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. OUR JOURNEY (CSS TIMELINE) ================= */}
      <section className="py-24 sm:py-32 bg-[#F4FBFF] relative overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-[#DDF3FF] rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
        <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] bg-[#E9E3FF] rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px] bg-[#C7EBFF] rounded-full blur-[90px] opacity-30 pointer-events-none"></div>

        <div className="max-w-[1000px] mx-auto px-6 sm:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-[56px] font-sans font-extrabold text-[#102A56] tracking-tight">Our Journey</h2>
          </div>

          <div className="relative">
            {/* Vertical Winding Timeline SVG */}
            <div className="absolute left-[36px] md:left-1/2 top-4 bottom-4 w-[60px] md:-translate-x-1/2 z-0 hidden md:block">
              <svg width="100%" height="100%" viewBox="0 0 60 1000" preserveAspectRatio="none">
                <path d="M30,0 Q60,100 30,200 T30,400 T30,600 T30,800 T30,1000" fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="8 12" />
                <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4AA7E8"/><stop offset="100%" stopColor="#6D63E8"/></linearGradient></defs>
              </svg>
            </div>
            {/* Simple straight dashed line for mobile */}
            <div className="absolute left-[36px] top-4 bottom-4 w-1 z-0 md:hidden" style={{ backgroundImage: 'linear-gradient(to bottom, #4AA7E8 50%, rgba(255,255,255,0) 0%)', backgroundPosition: 'right', backgroundSize: '3px 16px', backgroundRepeat: 'repeat-y' }}></div>

            <div className="space-y-16 md:space-y-20 relative z-10">
              {milestones.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`flex flex-col md:flex-row items-start md:items-center w-full ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="hidden md:block w-1/2"></div>
                  
                  <div className="absolute left-[16px] md:left-1/2 transform md:-translate-x-1/2 z-20 mt-6 md:mt-0">
                    <CssLocationPin colorClass={item.color} />
                  </div>

                  <div className={`w-full md:w-1/2 flex pl-[80px] md:pl-0 ${i % 2 !== 0 ? 'md:justify-start md:pl-12' : 'md:justify-end md:pr-12'}`}>
                    <div className="w-full sm:w-[95%] lg:w-[90%] bg-white/60 backdrop-blur-[24px] border border-white/80 shadow-[0_15px_40px_rgba(50,120,180,0.08)] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 relative group hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] border-[1px] border-white/60 pointer-events-none"></div>

                      <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-4">
                        <div>
                          <h3 className={`text-[32px] sm:text-[40px] font-sans font-extrabold tracking-tight leading-none ${item.color.split(' ')[1]}`}>{item.year}</h3>
                          <div className={`w-10 h-1 rounded-full mt-2 sm:mt-3 mb-3 sm:mb-4 ${item.color.split(' ')[0].replace('border-', 'bg-')}`}></div>
                          <h4 className="text-[16px] sm:text-[20px] font-bold text-[#18345F] leading-snug mb-1 pr-2">{item.title}</h4>
                          {item.subtitle && <p className="text-[13px] sm:text-[15px] text-[#55708F] font-medium mt-1">{item.subtitle}</p>}
                        </div>
                        <div className="self-end sm:self-center group-hover:scale-110 transition-transform duration-500 origin-center shrink-0">
                          <JourneyIcon type={item.icon} color={item.color.split(' ')[0].replace('border-[', '').replace(']', '') || '#38BDF8'} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. TEAM SECTION ================= */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden border-t border-[#DDF3FF]">
        <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-blue-100/50 blur-[120px] rounded-full z-0 pointer-events-none"></div>
        <div className="absolute bottom-10 right-[-10%] w-[400px] h-[400px] bg-purple-100/50 blur-[100px] rounded-full z-0 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 mb-16 text-center">
          <span className="inline-block bg-blue-50 text-blue-600 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-widest mb-4 border border-blue-100">
            Our People
          </span>
          <h2 className="text-[36px] md:text-[52px] font-serif font-bold text-[#102A56] mb-4">
            {dbTexts.team_title || "Meet the Playmakers"}
          </h2>
          <p className="text-[#55708F] text-[16px] sm:text-[18px] max-w-2xl mx-auto font-medium">
            {dbTexts.team_desc || "The friendly faces who turn themes into squeals, safely and on schedule."}
          </p>
        </div>

        {/* --- CONTINUOUS SCROLL MARQUEE FIX --- */}
        <div className="relative w-full overflow-hidden flex pb-12 pt-4">
          <motion.div 
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 55 }} // Adjusted for the longer array width
          >
            {/* 
              Render 4 identical blocks. Moving to -50% shifts by exactly 2 blocks. 
              This ensures ultra-wide screens always have enough content buffered on the right before the loop snaps back to 0%.
            */}
            {[...Array(4)].map((_, blockIndex) => (
              <div key={blockIndex} className="flex gap-4 sm:gap-6 lg:gap-8 pr-4 sm:pr-6 lg:pr-8">
                {teamData.map((member, i) => (
                  <div key={i} className="w-[300px] sm:w-[340px] md:w-[380px] shrink-0 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_15px_40px_rgba(50,120,180,0.08)] hover:shadow-[0_20px_50px_rgba(50,120,180,0.12)] p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] flex flex-col relative overflow-hidden group transition-all duration-300">
                    
                    <div className="w-full aspect-[3/4] sm:aspect-[4/5] rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-sm mb-4 sm:mb-6 z-10 relative bg-gray-100 shrink-0">
                      <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700" onError={(e)=> e.target.src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=800&q=80"} />
                    </div>

                    <div className="z-10 flex-grow text-left">
                      <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest block mb-1 sm:mb-1.5 ${member.color}`}>{member.role}</span>
                      <h3 className="text-[20px] sm:text-[24px] lg:text-[28px] font-serif font-bold text-[#102A56] mb-1.5 sm:mb-2">{member.name}</h3>
                      <p className="text-[13px] sm:text-[15px] text-[#55708F] font-medium mb-4 sm:mb-6 line-clamp-2 leading-relaxed">{member.bio}</p>
                    </div>

                    <div className="mt-auto z-10">
                      <div className="bg-[#F4FBFF] border border-[#DDF3FF] py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl flex items-center gap-2 shadow-sm w-fit">
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Superpower:</span>
                        <span className={`text-[11px] sm:text-[13px] font-bold truncate ${member.color}`}>{member.power}</span>
                      </div>
                    </div>

                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${member.color.replace('text-', 'bg-')}/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0`}></div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= 5. GALLERY SECTION ================= */}
      <section className="py-20 sm:py-32 bg-[#F4FBFF] relative z-20 overflow-hidden border-t border-[#DDF3FF]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-10 sm:mb-16 text-center">
          <h2 className="text-[32px] sm:text-[42px] md:text-[50px] font-serif font-bold text-[#102A56] mb-3 sm:mb-4 leading-tight">Our World in Color</h2>
          <p className="text-[#55708F] text-[14px] sm:text-[17px] font-medium px-4">A sneak peek into the beautiful events we've brought to life.</p>
        </div>

        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] flex justify-center items-center overflow-hidden">
          <AnimatePresence>
            {displaySlider.map((img, index) => {
              let offset = index - currentIndex;
              if (offset < -2) offset += displaySlider.length;
              if (offset > 2) offset -= displaySlider.length;

              const isCenter = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;
              const scale = isCenter ? 1.1 : isAdjacent ? 0.8 : 0.6;
              const offsetMultiplier = window.innerWidth < 640 ? 110 : (window.innerWidth < 768 ? 160 : 300); 
              const x = offset * offsetMultiplier; 
              const zIndex = 10 - Math.abs(offset);
              const opacity = Math.abs(offset) <= 2 ? (isCenter ? 1 : isAdjacent ? 0.7 : 0.3) : 0;

              return (
                <motion.div
                  key={`gallery-item-${index}`}  
                  animate={{ x, scale, zIndex, opacity }} 
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute w-[180px] h-[140px] sm:w-[260px] sm:h-[190px] md:w-[420px] md:h-[280px] rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-xl bg-white flex-shrink-0 border border-white/50"
                >
                  {img.image_url?.match(/\.(mp4|webm)$/i) ? (
                    <video src={img.image_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                  ) : (
                    <img src={img.image_url || img.src} alt="Gallery" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519335359739-16629737f909?auto=format&fit=crop&w=800&q=80"; }} />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102A56]/70 via-[#102A56]/10 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-6 left-0 w-full flex justify-center">
                    <span className="text-white font-bold tracking-widest uppercase text-[7px] sm:text-[10px] border border-white/30 bg-black/30 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-sm line-clamp-1 truncate max-w-[90%]">
                      {img.tag || img.category || 'Event Highlight'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutView;