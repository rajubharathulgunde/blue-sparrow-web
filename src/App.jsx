import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './shared/utils/ScrollToTop'; 
import FloatingWhatsApp from './shared/components/FloatingWhatsApp'; 
import HomeView from './features/Home/views/HomeView';
import CorporateView from './features/Corporate/views/CorporateView';
import KidsPartyView from './features/KidsParty/views/KidsPartyView';
import CarnivalsView from './features/Carnivals/views/CarnivalsView';
import MallsView from './features/Malls/views/MallsView';
import FamilyDiscoveryView from './features/FamilyDiscovery/views/FamilyDiscoveryView';
import PortfolioView from './features/Portfolio/views/PortfolioView';
import ContactView from './features/Contact/views/ContactView';
import AboutView from './features/About/views/AboutView'; 
import AdminDashboard from './features/Admin/views/AdminDashboard';
import ExperiencesView from './features/Experiences/views/ExperiencesView';
import ScienceThemeView from './features/Experiences/views/ScienceThemeView';
import WizardingThemeView from './features/Experiences/views/WizardingThemeView';
import PrincessThemeView from './features/Experiences/views/PrincessThemeView';
import SuperheroThemeView from './features/Experiences/views/SuperheroThemeView';
import OtherThemesView from './features/Experiences/views/OtherThemesView';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> 
      
      {/* Global WhatsApp Button - Renders on every page */}
      <FloatingWhatsApp />
      
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/corporate" element={<CorporateView />} />
        <Route path="/kids-parties" element={<KidsPartyView />} />
        <Route path="/carnivals" element={<CarnivalsView />} />
        <Route path="/malls" element={<MallsView />} />
        <Route path="/family-day" element={<FamilyDiscoveryView />} />
        
        <Route path="/portfolio" element={<PortfolioView />} />
        <Route path="/portfolio/gallery" element={<PortfolioView />} />
        <Route path="/portfolio/case-studies" element={<PortfolioView />} />
        
        <Route path="/experiences" element={<ExperiencesView />} />
        <Route path="/theme/wizarding" element={<WizardingThemeView />} />
        <Route path="/theme/princess" element={<PrincessThemeView />} />
        <Route path="/theme/superhero" element={<SuperheroThemeView />} />
        <Route path="/theme/science" element={<ScienceThemeView />} />
        <Route path="/theme/other" element={<OtherThemesView />} />
        
        <Route path="/contact" element={<ContactView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<AboutView />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;