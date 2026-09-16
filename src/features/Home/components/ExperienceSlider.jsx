import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Keep the data outside the component so it is not recreated
// every time the component renders.
const experiences = [
  {
    id: 1,
    src: "/assets/Carnival 1.png",
    title: "Grand Carnivals",
    subtitle:
      "Immersive, large-scale festival experiences designed to captivate thousands.",
    link: "/carnivals",
    fallback:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 2,
    src: "/assets/Corporate Family Days.png",
    title: "Corporate Family Days",
    subtitle:
      "Creating meaningful experiences for employees, children and families.",
    link: "/corporate",
    fallback:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 3,
    src: "/assets/Birthday Section.png",
    title: "Enchanted Birthdays",
    subtitle:
      "Personalised celebrations where childhood imagination becomes reality.",
    link: "/kids-parties",
    fallback:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 4,
    src: "/assets/Malls and Brands Activites.png",
    title: "Brand Activations",
    subtitle:
      "High-footfall experiences designed to attract, engage and inspire audiences.",
    link: "/malls",
    fallback:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2000&q=80",
  },
];

const slideVariants = {
  enter: {
    opacity: 0,
  },

  center: {
    opacity: 1,
  },

  exit: {
    opacity: 0,
  },
};

const textVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
};

const ExperienceSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const currentExperience = experiences[currentIndex];

  // --------------------------------------------------
  // NEXT SLIDE
  // --------------------------------------------------
  const nextSlide = () => {
    setDirection(1);

    setCurrentIndex((prev) => {
      return (prev + 1) % experiences.length;
    });
  };

  // --------------------------------------------------
  // PREVIOUS SLIDE
  // --------------------------------------------------
  const previousSlide = () => {
    setDirection(-1);

    setCurrentIndex((prev) => {
      return (prev - 1 + experiences.length) % experiences.length;
    });
  };

  // --------------------------------------------------
  // SELECT SPECIFIC SLIDE
  // --------------------------------------------------
  const goToSlide = (index) => {
    if (index === currentIndex) return;

    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // --------------------------------------------------
  // AUTO SLIDER
  // --------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);

      setCurrentIndex((prev) => {
        return (prev + 1) % experiences.length;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="
        relative
        w-full
        min-h-[500px]
        sm:min-h-[600px]
        md:min-h-[720px]
        lg:min-h-[780px]
        overflow-hidden
        bg-[#071A36]
      "
    >
      {/* =====================================================
          BACKGROUND SLIDER
      ====================================================== */}

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentExperience.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: {
              duration: 0.8,
              ease: "easeInOut",
            },
          }}
          className="absolute inset-0"
        >
          {/* Image with subtle cinematic zoom - Scaled down for mobile */}
          <motion.img
            key={`image-${currentExperience.id}`}
            src={currentExperience.src}
            alt={currentExperience.title}
            initial={{
              scale: 1.03, // Reduced from 1.08 to prevent massive zooming effect
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              duration: 6,
              ease: "linear",
            }}
            onError={(e) => {
              // Prevent infinite fallback loop
              if (e.currentTarget.dataset.fallbackLoaded === "true") {
                return;
              }

              e.currentTarget.dataset.fallbackLoaded = "true";
              e.currentTarget.src = currentExperience.fallback;
            }}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
          />

          {/* =================================================
              DARK CINEMATIC GRADIENT
          ================================================== */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#06152D]
              via-[#06152D]/75
              to-[#06152D]/10
            "
          />

          {/* Bottom gradient */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[60%]
              sm:h-[45%]
              bg-gradient-to-t
              from-[#06152D]
              via-[#06152D]/60
              to-transparent
            "
          />

          {/* Subtle overall overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[500px]
          sm:min-h-[600px]
          md:min-h-[720px]
          lg:min-h-[780px]
          max-w-[1400px]
          items-end
          px-5
          pb-24
          pt-20
          sm:px-10
          md:px-14
          lg:px-20
          sm:pb-28
          lg:pb-32
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExperience.id}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              max-w-2xl
              text-white
            "
          >
            {/* Eyebrow */}
            <div className="mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <span className="h-px w-6 sm:w-8 bg-white/60" />

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  sm:tracking-[0.28em]
                  text-white/70
                  sm:text-xs
                "
              >
                Blue Sparrow Experiences
              </span>
            </div>

            {/* Title */}
            <h2
              className="
                max-w-3xl
                font-serif
                text-3xl
                font-semibold
                leading-[1.1]
                sm:leading-[0.98]
                tracking-[-0.03em]
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
              "
            >
              {currentExperience.title}
            </h2>

            {/* Subtitle */}
            <p
              className="
                mt-3
                sm:mt-5
                max-w-xl
                text-[13px]
                leading-6
                text-white/75
                sm:text-base
                md:text-lg
                md:leading-8
              "
            >
              {currentExperience.subtitle}
            </p>

            {/* CTA */}
            <div className="mt-6 sm:mt-8">
              <Link
                to={currentExperience.link}
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  sm:gap-3
                  rounded-full
                  bg-white
                  px-5
                  py-3
                  sm:px-6
                  sm:py-3.5
                  text-[13px]
                  sm:text-sm
                  font-semibold
                  text-[#071A36]
                  shadow-xl
                  shadow-black/20
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                "
              >
                Explore Experience

                <span
                  className="
                    flex
                    h-5
                    w-5
                    sm:h-6
                    sm:w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-[#071A36]
                    text-white
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =====================================================
          SLIDER CONTROLS
      ====================================================== */}

      <div
        className="
          absolute
          bottom-6
          left-5
          right-5
          sm:bottom-8
          z-20
          flex
          items-center
          justify-between
          sm:left-10
          sm:right-10
          md:left-14
          md:right-14
          lg:left-20
          lg:right-20
        "
      >
        {/* Progress indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {experiences.map((experience, index) => {
            const isActive = currentIndex === index;

            return (
              <button
                key={experience.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to ${experience.title}`}
                aria-current={isActive ? "true" : "false"}
                className="
                  group
                  relative
                  h-1
                  sm:h-1.5
                  w-8
                  overflow-hidden
                  rounded-full
                  bg-white/25
                  sm:w-14
                  md:w-16
                "
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    key={`progress-${currentIndex}`}
                    initial={{
                      width: "0%",
                    }}
                    animate={{
                      width: "100%",
                    }}
                    transition={{
                      duration: 6,
                      ease: "linear",
                    }}
                    className="
                      absolute
                      inset-y-0
                      left-0
                      rounded-full
                      bg-white
                    "
                  />
                )}

                {/* Hover state */}
                {!isActive && (
                  <span
                    className="
                      absolute
                      inset-0
                      origin-left
                      scale-x-0
                      bg-white/60
                      transition-transform
                      duration-300
                      group-hover:scale-x-100
                    "
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Previous / Next */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous */}
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous experience"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-white/10
              text-sm
              sm:text-lg
              text-white
              backdrop-blur-md
              transition-all
              duration-300
              hover:bg-white
              hover:text-[#071A36]
              sm:h-11
              sm:w-11
            "
          >
            ←
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next experience"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-white/10
              text-sm
              sm:text-lg
              text-white
              backdrop-blur-md
              transition-all
              duration-300
              hover:bg-white
              hover:text-[#071A36]
              sm:h-11
              sm:w-11
            "
          >
            →
          </button>
        </div>
      </div>

      {/* =====================================================
          SMALL DECORATIVE ELEMENT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-8
          top-1/2
          z-10
          hidden
          -translate-y-1/2
          lg:block
        "
      >
        <div
          className="
            h-20
            w-20
            rounded-full
            border
            border-white/20
            bg-white/5
            backdrop-blur-sm
          "
        />
      </div>
    </section>
  );
};

export default ExperienceSlider;