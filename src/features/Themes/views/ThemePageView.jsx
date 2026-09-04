import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import CRMEnquiryForm from '../../Contact/components/CRMEnquiryForm';

const themeData = {
  science: {
    title: "Science Birthday",
    headline: "A birthday where kids don't just watch. They mix, build, test, and experiment.",
    description: "Safe, explosive fun. We transform your space into a mind-blowing STEM laboratory where every child gets to be a mad scientist for the day.",
    color: "blue",
    activities: ["Explosive Experiments", "Science Art", "STEM Making", "Interactive Games", "Edible Science Activities"],
    images: ["/assets/science-1.jpg", "/assets/science-2.jpg"]
  },
  wizarding: {
    title: "Wizarding Birthday",
    headline: "Step into a magical world of spells, potions, and unforgettable enchantment.",
    description: "We bring the academy of magic to you. Your child and their friends will craft wands, brew bubbling potions, and master their powers.",
    color: "purple",
    activities: ["Wand Making Workshops", "Bubbling Potions Class", "Magical Experiments", "Academy Games", "Themed Crafting"],
    images: ["/assets/wizard-1.jpg", "/assets/wizard-2.jpg"]
  },
  superhero: {
    title: "Superhero Training Camp",
    headline: "Action-packed adventures for heroes in the making.",
    description: "Watch your kids test their powers, design their own capes, and conquer obstacle courses in a high-energy, fully facilitated heroic adventure.",
    color: "red",
    activities: ["Hero Training Obstacles", "Cape & Mask Designing", "Power Test Challenges", "Action-Packed Games", "Team Rescue Missions"],
    images: ["/assets/superhero-1.jpg", "/assets/superhero-2.jpg"]
  },
  princess: {
    title: "Royal Princess Celebration",
    headline: "A day of elegance, magic, and royal crowning ceremonies.",
    description: "A beautifully curated royal experience featuring tiara crafting, magical storytelling, and elegant ballroom games fit for a princess.",
    color: "pink",
    activities: ["Royal Coronation", "Tiara & Wand Making", "Magical Storytelling", "Ballroom Games", "Glitter & Gem Art"],
    images: ["/assets/princess-1.jpg", "/assets/princess-2.jpg"]
  }
};

const fallbackTheme = {
  title: "Custom Celebration",
  headline: "We build the exact right event around your child's wildest dreams.",
  description: "Tell us what your child loves, and our expert planners will engineer the perfect celebration.",
  color: "indigo",
  activities: ["Custom Games", "Interactive Art", "Themed Challenges", "Facilitated Play", "Immersive Setup"],
  images: ["/assets/dummy-gallery-1.jpg", "/assets/dummy-gallery-2.jpg"]
};

const ThemePageView = () => {
  const { themeId } = useParams();
  const data = themeData[themeId?.toLowerCase()] || fallbackTheme;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [themeId]);

  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', dot: 'bg-pink-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', dot: 'bg-indigo-500' },
  };
  const themeColors = colorMap[data.color];

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-pink-100 selection:text-brand-navy">
      <Navbar />
      <section className={`pt-40 pb-20 px-6 lg:px-12 relative overflow-hidden ${themeColors.bg}`}>
        <div className="absolute inset-0 bg-white/40 z-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${themeColors.text} font-bold tracking-widest uppercase text-sm mb-4 block`}>
            {data.title}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-brand-navy mb-6 leading-tight">
            {data.headline}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
            {data.description}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <span className={`${themeColors.text} font-bold tracking-widest uppercase text-xs mb-2 block`}>The Plan</span>
          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">Activity-First, Learning-Led</h2>
          <p className="text-gray-500 mb-10">We curate highly engaging formats that turn play and storytelling into execution-ready magic.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {data.activities.map((activity, idx) => (
              <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className={`bg-white p-4 rounded-2xl shadow-sm border ${themeColors.border} flex items-center gap-3`}>
                <span className={`w-2 h-2 rounded-full ${themeColors.dot}`}></span>
                <span className="font-bold text-brand-navy text-sm">{activity}</span>
              </motion.div>
            ))}
          </div>
          <div className="bg-brand-navy p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-20 ${themeColors.dot}`}></div>
            <h3 className="text-xl font-serif font-bold text-white mb-4">Why Parents Trust Us</h3>
            <p className="text-sm text-blue-100 italic mb-4">"Blue Sparrow handled everything. From the setup to the facilitators keeping the kids engaged for hours. I actually got to enjoy my child's birthday!"</p>
            <span className="text-xs font-bold text-[#ff7eb3] uppercase tracking-widest">— Verified Parent Feedback</span>
          </div>
        </div>
        <div className="relative z-20">
          <CRMEnquiryForm />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ThemePageView;