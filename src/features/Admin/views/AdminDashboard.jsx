import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- CONFIGURATION FOR DYNAMIC PAGE SECTIONS ---
const PAGE_TABS = [
  { id: 'home', label: '🏠 Home Page' },
  { id: 'about', label: '📖 About Us' },
  { id: 'birthday', label: '🎈 Kids Parties' },
  { id: 'corporate', label: '💼 Corporate' },
  { id: 'carnival', label: '🎪 Carnivals' },
  { id: 'discovery', label: '🧭 Discovery' },
  { id: 'malls', label: '🛍️ Schools & Malls' }, // Renamed from Malls
  { id: 'science', label: '🧪 Science' },
  { id: 'superhero', label: '🦸‍♂️ Superhero' },
  { id: 'wizarding', label: '🧙‍♂️ Wizarding' },
  { id: 'princess', label: '👑 Princess' },
  { id: 'other', label: '✨ Other Themes' },
  { id: 'portfolio_gallery', label: '📸 Portfolio Gallery' },
  { id: 'case_studies', label: '📘 Case Studies' },
];

const getSectionsForPage = (pageId) => {
  if (pageId === 'home') {
    return [
      { id: 'hero_slider_video', label: 'Main Hero Slider (Images/Videos)', table: 'gallery_images', type: 'media', category: 'hero_slider_video' },
      { id: 'featured_events', label: 'Featured Events (Instagram Style)', table: 'gallery_images', type: 'media', category: 'featured_events' },
      { id: 'home', label: 'Sparrow Range Cards', table: 'theme_cards', type: 'card', theme_id: 'home' },
      { id: 'home_curator', label: 'Curator Note', table: 'theme_cards', type: 'card', theme_id: 'home_curator' },
    ];
  }
  if (pageId === 'about') {
    return [
      { id: 'about_hero', label: 'About Hero Image', table: 'gallery_images', type: 'media', category: 'hero' },
      { id: 'about_founder', label: 'Founder Image', table: 'gallery_images', type: 'media', category: 'founder' },
      { id: 'about_blog1', label: 'Blog 1 Image', table: 'gallery_images', type: 'media', category: 'blog1' },
      { id: 'about_blog2', label: 'Blog 2 Image', table: 'gallery_images', type: 'media', category: 'blog2' },
      { id: 'about_blog3', label: 'Blog 3 Image', table: 'gallery_images', type: 'media', category: 'blog3' },
      { id: 'about_glimpse', label: 'Glimpse Images (Slider Media)', table: 'gallery_images', type: 'media', category: 'glimpse' },
    ];
  }
  if (pageId === 'portfolio_gallery') {
    return [
      { id: 'portfolio_images', label: 'Gallery Images', table: 'gallery_images', type: 'media', category: 'portfolio' }
    ];
  }
  if (pageId === 'case_studies') {
    return [
      { id: 'case_studies_cards', label: 'Case Studies', table: 'theme_cards', type: 'card', theme_id: 'case_studies' }
    ];
  }
  // Default structure for all themes/pages
  return [
    { id: `${pageId}_hero`, label: 'Main Screen Image (Hero Background)', table: 'gallery_images', type: 'media', category: 'hero' },
    { id: `${pageId}_glimpse`, label: 'Glimpse Images (Slider Media)', table: 'gallery_images', type: 'media', category: 'glimpse' },
    { id: pageId, label: 'Content Cards & Workshops', table: 'theme_cards', type: 'card', theme_id: pageId },
  ];
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [activePage, setActivePage] = useState('home'); 
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const fileInputRef = useRef(null);
  const tabsScrollRef = useRef(null); 

  const [leads, setLeads] = useState([]);
  const [cards, setCards] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [timeFilter, setTimeFilter] = useState('all'); 

  // Content Upload Form State
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', badge: '', location: '', ig_link: '', tagColor: 'text-cyan-600' });
  const [uploadFile, setUploadFile] = useState(null);

  // Modal States
  const [approveModal, setApproveModal] = useState({ isOpen: false, leadId: null, budget: '', section: 'Corporate Events' });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, leadId: null, reason: 'Budget too high' });

  // === DATA FETCHING & REALTIME ===
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, cardsRes, galleryRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('theme_cards').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
      ]);
      
      setLeads(leadsRes.data || []);
      setCards(cardsRes.data || []);
      setGallery(galleryRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    const leadsSub = supabase.channel('leads-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchData).subscribe();
    const cardsSub = supabase.channel('cards-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'theme_cards' }, fetchData).subscribe();
    const gallerySub = supabase.channel('gallery-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(leadsSub);
      supabase.removeChannel(cardsSub);
      supabase.removeChannel(gallerySub);
    };
  }, []);

  // Update selected section dropdown when page tab changes
  useEffect(() => {
    const sections = getSectionsForPage(activePage);
    setSelectedSection(sections[0]);
    setFormData({ title: '', description: '', badge: '', location: '', ig_link: '', tagColor: 'text-cyan-600' });
    setUploadFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }, [activePage]);

  const scrollTabs = (direction) => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: direction * 250, behavior: 'smooth' });
    }
  };

  // === CRM LOGIC ===
  const filterByTime = (dataArray) => {
    if (!Array.isArray(dataArray)) return [];
    const now = new Date();
    return dataArray.filter(item => {
      const itemDate = new Date(item.created_at);
      if (timeFilter === 'today') return itemDate.toDateString() === now.toDateString();
      if (timeFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return itemDate >= oneWeekAgo;
      }
      if (timeFilter === 'month') return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      return true;
    });
  };

  const filteredLeads = filterByTime(leads);
  const approvedLeads = filteredLeads.filter(l => l.status === 'approved');
  const rejectedLeads = filteredLeads.filter(l => l.status === 'rejected');
  const pendingLeads = filteredLeads.filter(l => !l.status || l.status === 'pending');
  const totalRevenue = approvedLeads.reduce((sum, l) => sum + (Number(l.budget) || 0), 0);

  const sectionsCount = filteredLeads.reduce((acc, l) => {
    const section = l.event_type || 'Unknown';
    acc[section] = (acc[section] || 0) + 1;
    return acc;
  }, {});
  const topSection = Object.keys(sectionsCount).sort((a,b) => sectionsCount[b] - sectionsCount[a])[0] || 'N/A';
  
  const sortedSections = Object.keys(sectionsCount).map(key => ({
    name: key,
    count: sectionsCount[key]
  })).sort((a, b) => b.count - a.count);

  const reasonsCount = rejectedLeads.reduce((acc, l) => {
    const reason = l.rejection_reason || 'Unknown';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});
  const topRejectionReason = Object.keys(reasonsCount).sort((a,b) => reasonsCount[b] - reasonsCount[a])[0] || 'N/A';

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('leads').update({ status: 'approved', budget: Number(approveModal.budget), planned_section: approveModal.section }).eq('id', approveModal.leadId);
    setApproveModal({ isOpen: false, leadId: null, budget: '', section: 'Corporate Events' });
    fetchData();
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('leads').update({ status: 'rejected', rejection_reason: rejectModal.reason }).eq('id', rejectModal.leadId);
    setRejectModal({ isOpen: false, leadId: null, reason: 'Budget too high' });
    fetchData();
  };

  const currentModeCard = (cards || []).find(c => c.title === 'hero_display_mode');
  const currentHeroMode = currentModeCard ? currentModeCard.description : 'all';

  const updateHeroDisplayMode = async (mode) => {
    setIsLoading(true);
    if (currentModeCard) {
      await supabase.from('theme_cards').update({ description: mode }).eq('id', currentModeCard.id);
    } else {
      await supabase.from('theme_cards').insert([{ theme_id: 'config', title: 'hero_display_mode', description: mode }]);
    }
    fetchData();
    setIsLoading(false);
  };

  const currentFaqCard = (cards || []).find(c => c.title === 'global_faq_mode');
  const currentFaqMode = currentFaqCard ? currentFaqCard.description : 'disabled';

  const updateFaqMode = async (mode) => {
    setIsLoading(true);
    if (currentFaqCard) {
      await supabase.from('theme_cards').update({ description: mode }).eq('id', currentFaqCard.id);
    } else {
      await supabase.from('theme_cards').insert([{ theme_id: 'config', title: 'global_faq_mode', description: mode }]);
    }
    fetchData();
    setIsLoading(false);
  };

  // === IMAGE UPLOAD LOGIC ===
  const handleFileUpload = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from('website-assets').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw new Error(`Storage Error: ${uploadError.message}. Ensure your 'website-assets' bucket allows public uploads.`);
      const { data: urlData } = supabase.storage.from('website-assets').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (err) { throw err; }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;
    setIsLoading(true);
    try {
      let uploadedUrl = null;
      if (uploadFile) {
        uploadedUrl = await handleFileUpload(uploadFile);
      } else if (selectedSection.type === 'media') {
        throw new Error("A Media file (Image/Video) is required for this section.");
      }
      let dbError = null;

      if (selectedSection.table === 'theme_cards') {
        const { error } = await supabase.from('theme_cards').insert([{
          theme_id: selectedSection.theme_id || null,
          title: formData.title || null,
          description: formData.description || null,
          icon: formData.badge || null,
          image_url: uploadedUrl || null
        }]);
        dbError = error;
      } else {
        const payload = {
          theme_id: activePage || null,
          category: selectedSection.category || null,
          title: formData.title || null,
          tag: formData.badge || null,
          image_url: uploadedUrl || null
        };
        if (selectedSection.id === 'featured_events') {
          payload.location = formData.location || null;
          payload.ig_link = formData.ig_link || null;
          payload.tagColor = formData.tagColor || null;
        }
        const { error } = await supabase.from('gallery_images').insert([payload]);
        dbError = error;
      }
      if (dbError) throw new Error(`DB Error: ${dbError.message} \nDetails: ${dbError.details || 'None'}`);

      alert('Content Added Successfully!');
      setFormData({ title: '', description: '', badge: '', location: '', ig_link: '', tagColor: 'text-cyan-600' });
      setUploadFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      fetchData();
    } catch (error) { alert(error.message); }
    setIsLoading(false);
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Are you sure you want to delete this item completely?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans flex text-left selection:bg-brand-pink selection:text-brand-navy overflow-hidden">
      
      {/* ================= MOBILE OVERLAY ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ================= RESPONSIVE SIDEBAR ================= */}
      <div className={`fixed top-0 left-0 h-screen w-64 bg-[#0f172a] text-white flex flex-col p-6 shadow-2xl z-50 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:shrink-0 lg:border-r lg:border-slate-800`}>
        <div className="mb-10 flex flex-col relative">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-0 right-0 text-slate-400 hover:text-white lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <span className="text-2xl font-serif font-bold text-white tracking-tight">Blue Sparrow</span>
          <span className="text-[#38bdf8] text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Admin Center</span>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <button onClick={() => switchTab('overview')} className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            📊 Dashboard
          </button>
          <button onClick={() => switchTab('leads')} className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'leads' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            📥 Leads CRM {pendingLeads.length > 0 && <span className="bg-[#f43f5e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">{pendingLeads.length}</span>}
          </button>
          <button onClick={() => switchTab('content')} className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'content' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            📝 Website Content
          </button>
        </nav>
        
        <Link to="/" className="mt-auto text-center text-sm font-bold text-slate-400 hover:text-white border border-slate-700 rounded-xl py-3 hover:bg-white/5 transition-colors">
          ← View Live Website
        </Link>
      </div>

      {/* ================= MAIN SCROLLABLE CONTENT ================= */}
      <div className="flex-1 overflow-y-auto h-screen relative w-full">
        <div className="p-5 sm:p-8 lg:p-12 max-w-[1600px] mx-auto min-w-0">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-[#0f172a] hover:bg-gray-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a] capitalize">{activeTab === 'content' ? 'Website Content Manager' : activeTab === 'leads' ? 'Leads CRM' : 'Dashboard Overview'}</h1>
                <p className="text-gray-500 font-medium text-xs sm:text-sm mt-1">Manage and organize your platform</p>
              </div>
            </div>

            {(activeTab === 'overview' || activeTab === 'leads') && (
              <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 w-full lg:w-auto overflow-x-auto hide-scrollbar">
                {['today', 'week', 'month', 'all'].map((tf) => (
                  <button key={tf} onClick={() => setTimeFilter(tf)} className={`flex-1 lg:flex-none px-4 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold capitalize transition-colors whitespace-nowrap ${timeFilter === tf ? 'bg-[#0f172a] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                    {tf === 'all' ? 'All Time' : tf}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= TAB 1: OVERVIEW ANALYTICS (MODERNIZED) ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col"><span className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2">Total Revenue</span><span className="text-2xl sm:text-4xl font-serif font-bold text-[#10b981]">₹{totalRevenue.toLocaleString()}</span></div>
                <div className="bg-white p-5 sm:p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col"><span className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2">Total Leads</span><span className="text-2xl sm:text-4xl font-serif font-bold text-[#3b82f6]">{filteredLeads.length}</span></div>
                <div className="bg-white p-5 sm:p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col"><span className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2">Conversion Rate</span><span className="text-2xl sm:text-4xl font-serif font-bold text-[#4f46e5]">{filteredLeads.length > 0 ? Math.round((approvedLeads.length / filteredLeads.length) * 100) : 0}%</span></div>
                <div className="bg-white p-5 sm:p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col"><span className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2">Pending Reviews</span><span className="text-2xl sm:text-4xl font-serif font-bold text-[#f59e0b]">{pendingLeads.length}</span></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#0f172a] mb-6">Lead Pipeline</h3>
                  <div className="w-full h-4 sm:h-6 bg-gray-100 rounded-full flex overflow-hidden mb-6">
                    {filteredLeads.length > 0 ? (
                      <>
                        <div style={{ width: `${(approvedLeads.length / filteredLeads.length) * 100}%` }} className="bg-[#10b981] transition-all duration-1000"></div>
                        <div style={{ width: `${(pendingLeads.length / filteredLeads.length) * 100}%` }} className="bg-[#f59e0b] transition-all duration-1000"></div>
                        <div style={{ width: `${(rejectedLeads.length / filteredLeads.length) * 100}%` }} className="bg-[#ef4444] transition-all duration-1000"></div>
                      </>
                    ) : <div className="w-full bg-gray-200"></div>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#f0fdf4] p-3 rounded-xl border border-emerald-100"><span className="block text-xl sm:text-2xl font-bold text-[#10b981]">{approvedLeads.length}</span><span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase">Approved</span></div>
                    <div className="bg-[#fffbeb] p-3 rounded-xl border border-amber-100"><span className="block text-xl sm:text-2xl font-bold text-[#f59e0b]">{pendingLeads.length}</span><span className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase">Pending</span></div>
                    <div className="bg-[#fef2f2] p-3 rounded-xl border border-red-100"><span className="block text-xl sm:text-2xl font-bold text-[#ef4444]">{rejectedLeads.length}</span><span className="text-[10px] sm:text-xs font-bold text-red-600 uppercase">Rejected</span></div>
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#0f172a] mb-6">Inquiries by Theme</h3>
                  {sortedSections.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-gray-400 text-sm font-medium">No inquiries in this period.</div>
                  ) : (
                    <div className="space-y-4">
                      {sortedSections.slice(0, 4).map((section, index) => {
                        const maxCount = sortedSections[0].count;
                        const percentage = (section.count / maxCount) * 100;
                        const colors = ['bg-[#4f46e5]', 'bg-[#0ea5e9]', 'bg-[#ec4899]', 'bg-[#8b5cf6]'];
                        return (
                          <div key={section.name} className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-bold text-[#0f172a]"><span className="truncate pr-4">{section.name}</span><span>{section.count}</span></div>
                            <div className="w-full h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full rounded-full ${colors[index % colors.length]}`}/></div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-6 sm:p-8 rounded-[32px] shadow-sm"><span className="text-blue-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2 block">Most Popular Theme</span><span className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy">{topSection}</span></div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 p-6 sm:p-8 rounded-[32px] shadow-sm"><span className="text-red-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2 block">Top Rejection Reason</span><span className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy">{topRejectionReason}</span></div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: LEADS CRM ================= */}
          {activeTab === 'leads' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLeads.length === 0 && <div className="col-span-full text-center py-20 text-gray-400 font-bold text-lg">No leads found for this time period.</div>}
              
              {filteredLeads.map(lead => {
                const isApproved = lead.status === 'approved';
                const isRejected = lead.status === 'rejected';
                const isPending = !isApproved && !isRejected;

                return (
                  <div key={lead.id} className={`bg-white rounded-[24px] shadow-sm border overflow-hidden flex flex-col ${isApproved ? 'border-[#10b981]' : isRejected ? 'border-[#ef4444]' : 'border-amber-400'}`}>
                    <div className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white ${isApproved ? 'bg-[#10b981]' : isRejected ? 'bg-[#ef4444]' : 'bg-amber-400 text-amber-900'}`}>
                      {isApproved ? '✅ Approved' : isRejected ? '❌ Rejected' : '⏳ Pending Review'}
                    </div>

                    <div className="p-5 sm:p-6 flex-grow flex flex-col">
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] mb-1">{lead.name}</h3>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium mb-4 flex flex-col gap-1 break-all">
                        <a href={`mailto:${lead.email}`} className="hover:text-[#4f46e5]">{lead.email}</a>
                        <a href={`tel:${lead.phone}`} className="hover:text-[#4f46e5]">{lead.phone}</a>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-4 mb-4 flex-grow border border-slate-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Inquiry for:</p>
                        <p className="text-[#0f172a] font-bold text-sm sm:text-base">{lead.event_type}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-2">{new Date(lead.created_at).toLocaleString()}</p>
                      </div>

                      {isApproved && (
                        <div className="mt-auto bg-[#f0fdf4] text-[#065f46] p-3 rounded-xl text-xs sm:text-sm font-bold flex justify-between">
                          <span className="truncate pr-2">{lead.planned_section}</span>
                          <span>₹{Number(lead.budget).toLocaleString()}</span>
                        </div>
                      )}
                      {isRejected && (
                        <div className="mt-auto bg-[#fef2f2] text-[#991b1b] p-3 rounded-xl text-xs sm:text-sm font-medium">
                          <span className="font-bold">Reason:</span> {lead.rejection_reason}
                        </div>
                      )}

                      {isPending && (
                        <div className="flex gap-2 sm:gap-3 mt-auto pt-4 border-t border-gray-100">
                          <button onClick={() => setApproveModal({ isOpen: true, leadId: lead.id, budget: '', section: lead.event_type || 'Corporate Events' })} className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-colors">Approve</button>
                          <button onClick={() => setRejectModal({ isOpen: true, leadId: lead.id, reason: 'Budget too high' })} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-colors">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= TAB 3: WEBSITE CONTENT MANAGER ================= */}
          {activeTab === 'content' && (
            <div className="flex flex-col h-full">
              
              {/* --- PAGE SELECTOR NAVBAR WITH SCROLL ARROWS --- */}
              <div className="relative mb-8 flex items-center w-full bg-white rounded-2xl shadow-sm border border-gray-200">
                
                {/* Left Arrow */}
                <button onClick={() => scrollTabs(-1)} className="absolute left-0 z-10 h-[80%] px-2 bg-gradient-to-r from-white via-white to-transparent border-r-0 flex items-center justify-start text-gray-500 hover:text-[#0f172a] rounded-l-2xl">
                  <div className="bg-white rounded-full shadow-md border border-gray-100 p-1.5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                  </div>
                </button>

                <div 
                  ref={tabsScrollRef}
                  className="flex gap-2 p-2 w-full overflow-x-auto whitespace-nowrap scroll-smooth px-10"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                  {PAGE_TABS.map(page => (
                    <button 
                      key={page.id} onClick={() => setActivePage(page.id)}
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shrink-0 ${activePage === page.id ? 'bg-[#0f172a] text-white shadow-md' : 'text-gray-500 hover:bg-slate-50'}`}
                    >
                      {page.label}
                    </button>
                  ))}
                </div>

                {/* Right Arrow */}
                <button onClick={() => scrollTabs(1)} className="absolute right-0 z-10 h-[80%] px-2 bg-gradient-to-l from-white via-white to-transparent border-l-0 flex items-center justify-end text-gray-500 hover:text-[#0f172a] rounded-r-2xl">
                  <div className="bg-white rounded-full shadow-md border border-gray-100 p-1.5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </button>
              </div>

              {/* SPECIAL HOME PAGE CONTROLS (Hero Switch & FAQ Global Toggle) */}
              {activePage === 'home' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-5 sm:p-6 rounded-[24px] shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">Hero Slider Settings</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-4">Control what visitors see in the Home Page Main Slider.</p>
                    </div>
                    <div className="flex w-full bg-slate-50 p-1 rounded-xl shadow-inner border border-slate-200">
                      {['all', 'videos', 'images'].map(type => (
                        <button key={type} onClick={() => updateHeroDisplayMode(type)} disabled={isLoading} className={`flex-1 px-3 sm:px-5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${currentHeroMode === type ? 'bg-white text-[#4f46e5] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>
                          {type === 'all' ? 'Mix (Both)' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-[24px] shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">FAQ Section Visibility</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-4">Globally Enable or Disable the FAQ section across the site.</p>
                    </div>
                    <div className="flex w-full bg-slate-50 p-1 rounded-xl shadow-inner border border-slate-200">
                      {['enabled', 'disabled'].map(type => (
                        <button key={type} onClick={() => updateFaqMode(type)} disabled={isLoading} className={`flex-1 px-3 sm:px-5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${currentFaqMode === type ? (type === 'enabled' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-red-500 text-white shadow-sm') : 'text-slate-500 hover:text-slate-800'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT MANAGER TWO-COLUMN LAYOUT */}
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* LEFT: ADD NEW ITEM FORM */}
                <div className="w-full lg:w-[35%] bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200 h-fit lg:sticky lg:top-8">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-[#0f172a] border-b pb-4">
                    Add to {PAGE_TABS.find(p=>p.id===activePage)?.label || 'Section'}
                  </h3>
                  
                  <form onSubmit={handleAddItem} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Select Section to Edit</label>
                      <select value={selectedSection?.id || ''} onChange={e => setSelectedSection(getSectionsForPage(activePage).find(s => s.id === e.target.value))} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 font-medium outline-none focus:border-[#4f46e5] focus:bg-white transition-colors text-sm sm:text-base">
                        {getSectionsForPage(activePage).map(section => <option key={section.id} value={section.id}>{section.label}</option>)}
                      </select>
                    </div>

                    {selectedSection && (
                      <>
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                          <input type="text" placeholder={selectedSection.type === 'card' ? "Header / Title *" : "Media Title (Optional)"} required={selectedSection.type === 'card'} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white transition-colors text-sm sm:text-base" />
                          {selectedSection.type === 'card' && <textarea placeholder="Description Text *" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 h-28 outline-none focus:border-[#4f46e5] focus:bg-white transition-colors resize-none text-sm sm:text-base" />}

                          {/* PORTFOLIO SPECIFIC CATEGORY SELECTOR */}
                          {selectedSection.id === 'portfolio_images' ? (
                            <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Select Event Type (Category)</label>
                              <select value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] text-sm sm:text-base cursor-pointer">
                                <option value="">Select Category...</option>
                                <option value="Birthdays">Birthdays</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Schools & Malls">Schools & Malls</option>
                                <option value="Carnivals">Carnivals</option>
                              </select>
                            </div>
                          ) : (
                            <input type="text" placeholder={selectedSection.type === 'card' ? "Badge Text (e.g. WORKSHOP)" : "Category Tag (e.g. Adventure)"} value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white transition-colors text-sm sm:text-base" />
                          )}

                          {selectedSection.id === 'featured_events' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                              <input type="text" placeholder="Location (e.g. Mumbai)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="sm:col-span-2 p-3 border border-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                              <input type="url" placeholder="Instagram Video URL" value={formData.ig_link} onChange={e => setFormData({...formData, ig_link: e.target.value})} className="sm:col-span-2 p-3 border border-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                              <select value={formData.tagColor || 'text-cyan-600'} onChange={e => setFormData({...formData, tagColor: e.target.value})} className="sm:col-span-2 p-3 border border-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400">
                                <option value="text-cyan-600">Cyan Text</option>
                                <option value="text-pink-600">Pink Text</option>
                                <option value="text-purple-600">Purple Text</option>
                                <option value="text-amber-600">Amber Text</option>
                              </select>
                            </div>
                          )}

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{selectedSection.type === 'media' ? "Upload Image/Video *" : "Upload Cover Image"}</label>
                            <input type="file" required={selectedSection.type === 'media'} accept="image/*,video/mp4,video/webm" ref={fileInputRef} onChange={e => setUploadFile(e.target.files[0])} className="w-full text-[10px] sm:text-sm text-slate-600 file:mr-4 file:py-2 sm:file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer border border-gray-200 rounded-xl p-1.5 bg-gray-50 overflow-hidden" />
                          </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-[#4f46e5] text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-[#4338ca] mt-2 sm:mt-4 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                          {isLoading ? 'Uploading & Saving...' : `Save to ${selectedSection.label}`}
                        </button>
                      </>
                    )}
                  </form>
                </div>

                {/* RIGHT: DISPLAY CURRENT CONTENT SECTIONS */}
                <div className="w-full lg:w-[65%] flex flex-col gap-6 sm:gap-10">
                  {getSectionsForPage(activePage).map(section => {
                    const sectionItems = section.table === 'theme_cards' ? (cards || []).filter(c => c.theme_id === section.theme_id) : (gallery || []).filter(g => g.theme_id === activePage && (g.category === section.category || (!g.category && section.category === 'glimpse'))); 
                    if (sectionItems.length === 0) return null;

                    return (
                      <div key={section.id} className="bg-white p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a]">{section.label}</h3>
                          <span className="bg-gray-100 text-gray-500 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full w-fit">{sectionItems.length} Items</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                          {sectionItems.map(item => {
                            const isVideo = item.image_url?.match(/\.(mp4|webm)$/i);
                            return (
                              <div key={item.id} className="bg-gray-50 rounded-[20px] p-2 border border-gray-100 relative group flex flex-col overflow-hidden h-[250px] sm:h-[280px]">
                                <div className="w-full h-32 sm:h-36 bg-gray-200 rounded-[16px] overflow-hidden relative shrink-0">
                                  {isVideo ? <video src={item.image_url} className="w-full h-full object-cover" muted loop autoPlay playsInline /> : <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <button onClick={() => handleDelete(section.table, item.id)} className="bg-red-500 text-white text-xs font-bold py-2 px-6 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all">Delete</button>
                                  </div>
                                </div>
                                <div className="p-3 flex flex-col flex-grow">
                                  {(item.icon || item.tag) && <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#4f46e5] mb-1 truncate">{item.icon || item.tag}</span>}
                                  <h4 className="font-bold text-xs sm:text-sm text-[#0f172a] leading-tight line-clamp-1">{item.title || 'Untitled'}</h4>
                                  {item.description && <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {getSectionsForPage(activePage).every(sec => {
                    const i = sec.table === 'theme_cards' ? (cards || []).filter(c => c.theme_id === sec.theme_id) : (gallery || []).filter(g => g.theme_id === activePage && (g.category === sec.category || (!g.category && sec.category === 'glimpse')));
                    return i.length === 0;
                  }) && (
                    <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-gray-200 p-8 sm:p-16 flex flex-col items-center justify-center text-center shadow-sm mt-4 sm:mt-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-4">📭</div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-2">No Content Uploaded</h3>
                      <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm">Select a section from the left form to upload Hero Images, Sliders, and Theme Cards.</p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= LEAD MODALS ================= */}
      <AnimatePresence>
        {approveModal.isOpen && (
          <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[24px] sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] mb-2">Approve Lead</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">Awesome! Let's log the details for analytics.</p>
              <form onSubmit={handleApproveSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Final Budget (₹)</label>
                  <input type="number" required min="0" value={approveModal.budget} onChange={e => setApproveModal({...approveModal, budget: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#10b981] text-sm sm:text-base" placeholder="e.g. 50000" />
                </div>
                <div>
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Final Section/Theme</label>
                  <select value={approveModal.section} onChange={e => setApproveModal({...approveModal, section: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#10b981] text-sm sm:text-base">
                    <option value="Corporate Events">Corporate Events</option>
                    <option value="Birthday Parties">Birthday Parties</option>
                    <option value="Carnivals">Carnivals</option>
                    <option value="Family Discovery">Family Discovery</option>
                    <option value="Malls">Malls</option>
                    <option value="Other">Other Custom Theme</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setApproveModal({...approveModal, isOpen: false})} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#10b981] text-white font-bold py-3 rounded-xl hover:bg-[#059669] transition-colors shadow-md text-sm sm:text-base">Confirm</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {rejectModal.isOpen && (
          <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[24px] sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] mb-2">Reject Lead</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">Log the reason so we can improve in the future.</p>
              <form onSubmit={handleRejectSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Reason for Rejection</label>
                  <select value={rejectModal.reason} onChange={e => setRejectModal({...rejectModal, reason: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#ef4444] text-sm sm:text-base">
                    <option value="Budget too high">Budget was too high</option>
                    <option value="Dates unavailable">Our dates were unavailable</option>
                    <option value="Service not offered">We don't offer this service</option>
                    <option value="Went with competitor">Went with a competitor</option>
                    <option value="Ghosted / No response">Ghosted / No response</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setRejectModal({...rejectModal, isOpen: false})} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#ef4444] text-white font-bold py-3 rounded-xl hover:bg-[#dc2626] transition-colors shadow-md text-sm sm:text-base">Confirm</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;