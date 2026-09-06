import React from 'react';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import HeroSection from '../components/HeroSection';
import ExperiencesSection from '../components/ExperiencesSection';
import BrandsSection from '../components/BrandsSection';
import FeaturedEventsSection from '../components/FeaturedEventsSection';
import ExploreSection from '../components/ExploreSection';
import FaqBrochureSection from '../components/FaqBrochureSection';
import CtaSection from '../components/CtaSection';

const HomeView = () => {
  return (
    // Added w-full and max-w-[100vw] to strictly prevent horizontal scrolling on mobile
    <div className="font-sans text-gray-600 bg-white overflow-x-hidden w-full max-w-[100vw] selection:bg-brand-pink selection:text-brand-navy">
      <Navbar />
      
      {/* 1. Hero */}
      <HeroSection />
      
      {/* 2. The New Unified Experiences/Summary Section */}
      <ExperiencesSection />
      
      {/* 3. The Rest of the Page */}
      <ExploreSection />
      <BrandsSection />
      <FeaturedEventsSection />
      <FaqBrochureSection />
      <CtaSection />
      
      <Footer />
    </div>
  );
};

export default HomeView;