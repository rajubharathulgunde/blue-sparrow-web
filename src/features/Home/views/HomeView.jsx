import React from 'react';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import HeroSection from '../components/HeroSection';
import QuickSummary from '../components/QuickSummary';
import ExperiencesSection from '../components/ExperiencesSection';
import BrandsSection from '../components/BrandsSection';
import FeaturedEventsSection from '../components/FeaturedEventsSection';
import ExploreSection from '../components/ExploreSection';
import FaqBrochureSection from '../components/FaqBrochureSection';
import CtaSection from '../components/CtaSection';

const HomeView = () => {
  return (
    <div className="font-sans text-gray-600 bg-white overflow-x-hidden selection:bg-brand-pink selection:text-brand-navy">
      <Navbar />
      
      {/* The Video Slider */}
      <HeroSection />
      
      {/* The New Photo Collage & Summary */}
      <QuickSummary />
      <ExploreSection />
      
      {/* Your Original Sections */}
      <ExperiencesSection />
      <BrandsSection />
      <FeaturedEventsSection />
      <FaqBrochureSection />
      <CtaSection />
      
      <Footer />
    </div>
  );
};

export default HomeView;