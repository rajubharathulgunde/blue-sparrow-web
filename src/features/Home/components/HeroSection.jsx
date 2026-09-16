import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const PremiumStar = ({ className, color = "cyan" }) => {
  const gradients = {
    cyan: { stop1: "#06b6d4", stop2: "#3b82f6" },
    pink: { stop1: "#ec4899", stop2: "#f43f5e" }
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`grad-${color}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={gradients[color].stop1} />
          <stop offset="100%" stopColor={gradients[color].stop2} />
        </linearGradient>
      </defs>

      <path
        d="M12 1L13.8 8.5L21 10L13.8 11.5L12 19L10.2 11.5L3 10L10.2 8.5L12 1Z"
        fill={`url(#grad-${color})`}
      />
    </svg>
  );
};

const HeroSection = () => {
  const [dbSliderVideos, setDbSliderVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for the Media Filter (Controlled by the Admin Dashboard)
  const [mediaFilter, setMediaFilter] = useState('all');

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('theme_id', 'home')
        .in('category', ['hero_video', 'hero_slider_video'])
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setDbSliderVideos(data.map(item => item.image_url));
      }
    };

    // Fetch the display setting from the CMS
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('theme_cards')
        .select('description')
        .eq('title', 'hero_display_mode')
        .limit(1);

      if (data && data.length > 0) {
        setMediaFilter(data[0].description);
        setCurrentIndex(0); // Reset index on change
      }
    };

    fetchMedia();
    fetchConfig();

    const mediaChannel = supabase
      .channel('live-hero-media')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gallery_images'
        },
        fetchMedia
      )
      .subscribe();

    const configChannel = supabase
      .channel('live-config')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'theme_cards'
        },
        fetchConfig
      )
      .subscribe();

    return () => {
      supabase.removeChannel(mediaChannel);
      supabase.removeChannel(configChannel);
    };
  }, []);

  const fallbackSliderImages = [
    "/assets/ig videos/Alien Invasion experience zone built and executed by Bluesparrow parties for Hamleys WonderlandL.mp4",
    "/assets/Carnival 1.png",
    "/assets/ig videos/Another STEM Fair at Abbott in the books 🚀Last week was one of those days where everything just.mp4",
    "/assets/Birthday Section.png",
    "/assets/ig videos/Gratitude in every shade of blue! 🎉 Thank you Megha kulchandani,for curating an inventors lab.mp4",
    "/assets/ig videos/If your child would love to hitchhike to the space, why not bring the galaxy to them!At our Sp.mp4",
    "/assets/ig videos/We turned hamleysplay into a world of fun! 🎉 Our in-store activation made kids and families smi.mp4"
  ];

  const rawSliderData =
    dbSliderVideos.length > 0 ? dbSliderVideos : fallbackSliderImages;

  // Filter based on CMS preference
  const displaySliderImages = rawSliderData.filter(media => {
    const isVideo = media?.endsWith('.mp4') || media?.endsWith('.webm');

    if (mediaFilter === 'videos') return isVideo;
    if (mediaFilter === 'images') return !isVideo;

    return true;
  });

  useEffect(() => {
    if (currentIndex >= displaySliderImages.length) {
      setCurrentIndex(0);
    }
  }, [displaySliderImages.length, currentIndex]);

  useEffect(() => {
    if (displaySliderImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(
        prev => (prev + 1) % displaySliderImages.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [displaySliderImages.length]);

  return (
    <section className="relative w-full min-h-[95vh] flex items-center bg-[#f8fafc] overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-20">

      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-[10%] left-[-12%] sm:left-[-5%] w-[55vw] h-[55vw] sm:w-[40vw] sm:h-[40vw] bg-cyan-400/10 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="absolute bottom-[-8%] right-[-12%] sm:right-[-5%] w-[55vw] h-[55vw] sm:w-[40vw] sm:h-[40vw] bg-pink-400/10 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-10 sm:gap-12 lg:gap-16 relative z-10">

        {/* LEFT ALIGNED CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[45%] xl:w-[42%] flex flex-col items-start text-left z-20"
        >

          {/* LABEL */}
          <div className="relative mb-5 sm:mb-6">
            <PremiumStar
              color="cyan"
              className="absolute -left-4 sm:-left-6 -top-3 sm:-top-4 w-4 h-4 sm:w-5 sm:h-5 animate-pulse opacity-80"
            />

            <span className="text-cyan-600 font-bold text-[9px] sm:text-[11px] md:text-[13px] tracking-[0.2em] sm:tracking-[0.25em] uppercase bg-cyan-50 border border-cyan-100 px-3 sm:px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap">
              Events That Inspire
            </span>
          </div>

          {/* MAIN HEADING */}
          <h1 className="text-[38px] leading-[1.04] sm:text-[48px] sm:leading-[1.02] md:text-[60px] lg:text-[72px] xl:text-[84px] font-sans font-extrabold text-[#0f172a] tracking-tight mb-5 sm:mb-6 relative">

            Learn, <br className="hidden sm:block" />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500">
              Laugh & Play-
            </span>

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500">
              The Bluesparrow Way!
            </span>

          </h1>

          {/* SUB HEADING */}
          <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-serif font-bold text-slate-500 mb-6 sm:mb-8 leading-tight">
            Storytelling that stays with you forever.
          </h2>

          {/* DESCRIPTION */}
          <p className="text-[15px] sm:text-[16px] md:text-[18px] text-slate-600 mb-8 sm:mb-10 max-w-[480px] leading-relaxed font-medium">
            From corporate workshops to immersive carnivals, we craft exceptional experiences that inspire, engage and bring people together.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full sm:w-auto">

            <button
              onClick={() =>
                window.scrollTo({
                  top: 850,
                  behavior: 'smooth'
                })
              }
              className="w-full sm:w-auto justify-center bg-[#0f172a] hover:bg-slate-800 text-white font-semibold py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_10px_25px_rgba(15,23,42,0.2)] transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 text-[14px] sm:text-[15px]"
            >
              Explore Experiences
              <span className="ml-1 text-cyan-400 font-bold">
                &rarr;
              </span>
            </button>

            <Link
              to="/contact"
              className="w-full sm:w-auto justify-center bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-md text-[#0f172a] font-semibold py-3.5 sm:py-4 px-6 sm:px-8 rounded-full transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 text-[14px] sm:text-[15px]"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>

              Plan an Event
            </Link>

          </div>

          {/* METRICS */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-6 w-full pt-5 sm:pt-6 border-t border-slate-200/60">

            {[
              {
                icon: '500+',
                label: 'Events Delivered',
                color: 'text-cyan-500'
              },
              {
                icon: '1100+',
                label: 'Happy Kids',
                color: 'text-pink-500'
              },
              {
                icon: '150+',
                label: 'Corp Clients',
                color: 'text-blue-500'
              },
              {
                icon: '12+',
                label: 'Years Magic',
                color: 'text-purple-500'
              }
            ].map((metric, i) => (
              <div
                key={i}
                className="flex flex-col relative group cursor-default"
              >
                <span
                  className={`font-extrabold text-[24px] sm:text-[28px] ${metric.color} leading-none mb-1`}
                >
                  {metric.icon}
                </span>

                <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-[0.12em] sm:tracking-widest">
                  {metric.label}
                </span>
              </div>
            ))}

          </div>

        </motion.div>

        {/* MEDIA SLIDER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.2,
            ease: "easeOut"
          }}
          className="w-full lg:w-[55%] xl:w-[58%] relative mt-4 sm:mt-8 lg:mt-0 flex flex-col items-center"
        >

          {/* MEDIA DECORATION */}
          <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-50 animate-pulse"></div>

          {/* MAIN MEDIA CONTAINER */}
          <div className="relative w-full aspect-square lg:aspect-[5/6] xl:aspect-[1/1.05] rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-[5px] sm:border-[8px] border-white bg-slate-900">

            <AnimatePresence>

              {displaySliderImages.length > 0 && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 w-full h-full"
                >

                  {displaySliderImages[currentIndex]?.endsWith('.mp4') ? (
                    <video
                      src={displaySliderImages[currentIndex]}
                      className="w-full h-full object-cover object-center absolute inset-0"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={displaySliderImages[currentIndex]}
                      alt="Magical Experiences"
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-[10s] ease-out"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                </motion.div>
              )}

            </AnimatePresence>

            {/* INNER SHADOW */}
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] sm:shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] rounded-[28px] sm:rounded-[40px] lg:rounded-[56px] pointer-events-none"></div>

          </div>

          {/* FLOATING BADGE */}
          <div className="absolute -bottom-5 -left-3 sm:-bottom-8 sm:-left-8 lg:bottom-12 lg:-left-12 bg-white/90 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] w-[105px] h-[105px] sm:w-[140px] sm:h-[140px] flex flex-col items-center justify-center p-3 sm:p-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-100 transform hover:scale-105 transition-transform duration-500 z-30">

            <span className="text-pink-500 text-[24px] sm:text-[32px] mb-1.5 sm:mb-2 drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
              ❤️
            </span>

            <span className="text-slate-800 font-extrabold text-[8px] sm:text-[11px] text-center leading-tight tracking-[0.12em] sm:tracking-widest uppercase">
              Crafting
              <br />
              Smiles Since
              <br />
              2016
            </span>

          </div>

          {/* PINK STAR */}
          <PremiumStar
            color="pink"
            className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 animate-pulse opacity-60 z-30"
          />

        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;