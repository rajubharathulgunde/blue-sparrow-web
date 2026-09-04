import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, leads, content, media
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [leads, setLeads] = useState([]);
  const [cards, setCards] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Time Filter State
  const [timeFilter, setTimeFilter] = useState('all'); // all, today, week, month

  // Content/Media Upload States
  const [newCard, setNewCard] = useState({ theme_id: 'home', title: '', description: '', icon: '', bg_color: 'bg-white' });
  const [newGallery, setNewGallery] = useState({ theme_id: 'home', category: 'featured_events', title: '', description: '' });
  const [uploadFile, setUploadFile] = useState(null);

  // Modal States for Leads
  const [approveModal, setApproveModal] = useState({ isOpen: false, leadId: null, budget: '', section: 'Corporate Events' });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, leadId: null, reason: 'Budget too high' });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, cardsRes, galleryRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('theme_cards').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
      ]);
      if (leadsRes.data) setLeads(leadsRes.data);
      if (cardsRes.data) setCards(cardsRes.data);
      if (galleryRes.data) setGallery(galleryRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === TIME FILTERING LOGIC ===
  const filterByTime = (dataArray) => {
    const now = new Date();
    return dataArray.filter(item => {
      const itemDate = new Date(item.created_at);
      if (timeFilter === 'today') {
        return itemDate.toDateString() === now.toDateString();
      } else if (timeFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return itemDate >= oneWeekAgo;
      } else if (timeFilter === 'month') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredLeads = filterByTime(leads);

  // === ANALYTICS LOGIC ===
  const approvedLeads = filteredLeads.filter(l => l.status === 'approved');
  const rejectedLeads = filteredLeads.filter(l => l.status === 'rejected');
  const pendingLeads = filteredLeads.filter(l => !l.status || l.status === 'pending');
  
  const totalRevenue = approvedLeads.reduce((sum, l) => sum + (Number(l.budget) || 0), 0);

  // Calculate Top Section
  const sectionsCount = approvedLeads.reduce((acc, l) => {
    const section = l.planned_section || l.event_type || 'Unknown';
    acc[section] = (acc[section] || 0) + 1;
    return acc;
  }, {});
  const topSection = Object.keys(sectionsCount).sort((a,b) => sectionsCount[b] - sectionsCount[a])[0] || 'N/A';

  // Calculate Top Rejection Reason
  const reasonsCount = rejectedLeads.reduce((acc, l) => {
    const reason = l.rejection_reason || 'Unknown';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});
  const topRejectionReason = Object.keys(reasonsCount).sort((a,b) => reasonsCount[b] - reasonsCount[a])[0] || 'N/A';


  // === LEAD ACTIONS ===
  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('leads').update({ 
      status: 'approved', 
      budget: Number(approveModal.budget), 
      planned_section: approveModal.section 
    }).eq('id', approveModal.leadId);
    
    setApproveModal({ isOpen: false, leadId: null, budget: '', section: 'Corporate Events' });
    fetchData();
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('leads').update({ 
      status: 'rejected', 
      rejection_reason: rejectModal.reason 
    }).eq('id', rejectModal.leadId);
    
    setRejectModal({ isOpen: false, leadId: null, reason: 'Budget too high' });
    fetchData();
  };

  // === UPLOAD LOGIC ===
  const handleFileUpload = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError, data } = await supabase.storage.from('website-assets').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from('website-assets').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageUrl = null;
      if (uploadFile) imageUrl = await handleFileUpload(uploadFile);
      await supabase.from('theme_cards').insert([{ ...newCard, image_url: imageUrl }]);
      alert('Added Successfully!');
      setNewCard({ theme_id: 'home', title: '', description: '', icon: '', bg_color: 'bg-white' });
      setUploadFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      fetchData();
    } catch (error) { alert('Error: ' + error.message); }
    setIsLoading(false);
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert('Please select a file.');
    setIsLoading(true);
    try {
      const imageUrl = await handleFileUpload(uploadFile);
      await supabase.from('gallery_images').insert([{ ...newGallery, image_url: imageUrl }]);
      alert('Media Added Successfully!');
      setNewGallery({ theme_id: 'home', category: 'featured_events', title: '', description: '' });
      setUploadFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      fetchData();
    } catch (error) { alert('Error: ' + error.message); }
    setIsLoading(false);
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Delete this item?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-left selection:bg-brand-pink selection:text-brand-navy">
      
      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-brand-navy text-white flex flex-col p-6 shadow-2xl z-20 min-h-screen fixed h-full border-r border-indigo-900/50">
        <div className="mb-10 flex flex-col">
          <span className="text-2xl font-serif font-bold text-white tracking-tight">Blue Sparrow</span>
          <span className="text-[#ff7eb3] text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Workspace</span>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-[#4f46e5] text-white shadow-lg' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}>
            📊 Dashboard
          </button>
          <button onClick={() => setActiveTab('leads')} className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'leads' ? 'bg-[#4f46e5] text-white shadow-lg' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}>
            📥 Leads CRM {pendingLeads.length > 0 && <span className="bg-[#ff7eb3] text-brand-navy text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">{pendingLeads.length}</span>}
          </button>
          <button onClick={() => setActiveTab('content')} className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'content' ? 'bg-[#4f46e5] text-white shadow-lg' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}>
            📝 Web Content
          </button>
          <button onClick={() => setActiveTab('media')} className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === 'media' ? 'bg-[#4f46e5] text-white shadow-lg' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}>
            🖼️ Media Gallery
          </button>
        </nav>
        
        <Link to="/" className="mt-auto text-center text-sm font-bold text-indigo-300 hover:text-white border border-indigo-700/50 rounded-xl py-3 hover:bg-white/5 transition-colors">
          ← Back to Website
        </Link>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-8 lg:p-12 ml-64 overflow-y-auto h-screen bg-[#f4f7f9]">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-brand-navy capitalize">{activeTab === 'content' ? 'Website Content' : activeTab === 'media' ? 'Media Gallery' : activeTab}</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Manage your magical experiences</p>
          </div>

          {/* Global Time Filter for Overview and Leads */}
          {(activeTab === 'overview' || activeTab === 'leads') && (
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              {['today', 'week', 'month', 'all'].map((tf) => (
                <button 
                  key={tf} onClick={() => setTimeFilter(tf)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-colors ${timeFilter === tf ? 'bg-brand-navy text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {tf === 'all' ? 'All Time' : tf}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= TAB 1: OVERVIEW ANALYTICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Total Revenue</span>
                <span className="text-4xl font-serif font-bold text-[#10b981]">₹{totalRevenue.toLocaleString()}</span>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Conversion Rate</span>
                <span className="text-4xl font-serif font-bold text-[#4f46e5]">
                  {filteredLeads.length > 0 ? Math.round((approvedLeads.length / filteredLeads.length) * 100) : 0}%
                </span>
                <span className="text-sm text-gray-500 font-medium mt-2">{approvedLeads.length} Approved / {rejectedLeads.length} Rejected</span>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Most Popular Theme</span>
                <span className="text-2xl font-serif font-bold text-[#ec4899] truncate">{topSection}</span>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Top Rejection Reason</span>
                <span className="text-2xl font-serif font-bold text-[#ef4444] truncate">{topRejectionReason}</span>
              </div>

            </div>

            <div className="bg-[#f0f9ff] border border-blue-100 p-8 rounded-3xl text-center">
              <h3 className="text-xl font-bold text-brand-navy mb-2">Keep crafting smiles! ✨</h3>
              <p className="text-gray-600 font-medium">You have {pendingLeads.length} leads waiting for your review in the CRM.</p>
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
                <div key={lead.id} className={`bg-white rounded-[24px] shadow-sm border overflow-hidden flex flex-col ${isApproved ? 'border-[#10b981]' : isRejected ? 'border-[#ef4444]' : 'border-yellow-400'}`}>
                  {/* Status Banner */}
                  <div className={`px-5 py-2 text-xs font-bold uppercase tracking-widest text-white ${isApproved ? 'bg-[#10b981]' : isRejected ? 'bg-[#ef4444]' : 'bg-yellow-400 text-yellow-900'}`}>
                    {isApproved ? '✅ Approved' : isRejected ? '❌ Rejected' : '⏳ Pending Review'}
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-serif font-bold text-brand-navy mb-1">{lead.name}</h3>
                    <div className="text-sm text-gray-500 font-medium mb-4 flex flex-col gap-1">
                      <a href={`mailto:${lead.email}`} className="hover:text-[#4f46e5]">{lead.email}</a>
                      <a href={`tel:${lead.phone}`} className="hover:text-[#4f46e5]">{lead.phone}</a>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 flex-grow">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Inquiry for:</p>
                      <p className="text-brand-navy font-bold">{lead.event_type}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(lead.created_at).toLocaleString()}</p>
                    </div>

                    {/* Show results if processed */}
                    {isApproved && (
                      <div className="mt-auto bg-[#f0fdf4] text-[#065f46] p-3 rounded-xl text-sm font-bold flex justify-between">
                        <span>{lead.planned_section}</span>
                        <span>₹{Number(lead.budget).toLocaleString()}</span>
                      </div>
                    )}
                    {isRejected && (
                      <div className="mt-auto bg-[#fef2f2] text-[#991b1b] p-3 rounded-xl text-sm font-medium">
                        <span className="font-bold">Reason:</span> {lead.rejection_reason}
                      </div>
                    )}

                    {/* Action Buttons if Pending */}
                    {isPending && (
                      <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                        <button onClick={() => setApproveModal({ isOpen: true, leadId: lead.id, budget: '', section: lead.event_type || 'Corporate Events' })} className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 rounded-xl transition-colors">Approve</button>
                        <button onClick={() => setRejectModal({ isOpen: true, leadId: lead.id, reason: 'Budget too high' })} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2.5 rounded-xl transition-colors">Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= TAB 3: CONTENT CARDS ================= */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-bold mb-4 text-brand-navy">Add New Element</h3>
              <form onSubmit={handleAddCard} className="flex flex-col gap-4">
                <select value={newCard.theme_id} onChange={e => setNewCard({...newCard, theme_id: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-[#4f46e5]">
                  <optgroup label="📱 SOCIAL & CONTACT">
                    <option value="social_whatsapp">Global WhatsApp Link</option>
                    <option value="social_footer">Footer Social Icon & Link</option>
                  </optgroup>
                  <optgroup label="🏡 HOME PAGE">
                    <option value="home">Sparrow Range Cards</option>
                    <option value="home_curator">Curator Note</option>
                    <option value="home_explore">Quick Explore Link</option>
                    <option value="home_workshops">Daily Workshop Ticket</option>
                    <option value="home_faq">Home FAQ Item</option>
                    <option value="home_brochure">Home PDF Brochure</option>
                  </optgroup>
                  <optgroup label="🎉 THEMES & PAGES">
                    <option value="birthday">Birthday Cards</option>
                    <option value="birthday_faq">Birthday FAQ</option>
                    <option value="birthday_brochure">Birthday Brochure</option>
                    <option value="corporate">Corporate Cards</option>
                    <option value="corporate_faq">Corporate FAQ</option>
                    <option value="discovery">Discovery Cards</option>
                    <option value="discovery_faq">Discovery FAQ</option>
                    <option value="malls">Malls Cards</option>
                    <option value="malls_faq">Malls FAQ</option>
                    <option value="science">Science Theme</option>
                    <option value="princess">Princess Theme</option>
                    <option value="wizarding">Wizarding Theme</option>
                    <option value="superhero">Superhero Theme</option>
                  </optgroup>
                </select>

                <input type="text" placeholder="Title / Question / Platform Name" required value={newCard.title} onChange={e => setNewCard({...newCard, title: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#4f46e5]" />
                <textarea placeholder="Description / Answer / Hover Text" required={!newCard.theme_id.includes('_brochure')} value={newCard.description} onChange={e => setNewCard({...newCard, description: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-slate-800 h-24 outline-none focus:ring-2 focus:ring-[#4f46e5]" />
                <input type="text" placeholder="Icon / File Size / URL Link" value={newCard.icon} onChange={e => setNewCard({...newCard, icon: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#4f46e5]" />
                
                <input type="file" accept={newCard.theme_id.includes('_brochure') ? ".pdf" : "image/*"} ref={fileInputRef} onChange={e => setUploadFile(e.target.files[0])} className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <button type="submit" disabled={isLoading} className="bg-[#4f46e5] text-white font-bold py-3.5 rounded-xl hover:bg-[#4338ca] mt-2 transition-colors shadow-md">{isLoading ? 'Saving...' : 'Save Element'}</button>
              </form>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map(card => (
                <div key={card.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative group flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-[#eef2ff] text-[#4f46e5] px-3 py-1 rounded-full mb-3 inline-block">{card.theme_id}</span>
                    <h4 className="font-bold text-lg text-brand-navy">{card.title}</h4>
                    {card.icon && <div className="text-sm font-medium text-pink-500 mb-2 truncate break-all">{card.icon}</div>}
                    <p className="text-sm text-gray-500 mt-2 whitespace-pre-line line-clamp-3">{card.description}</p>
                    
                    {card.image_url && card.image_url.endsWith('.pdf') ? (
                       <a href={card.image_url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm font-bold block mt-3 underline">📄 View Document</a>
                    ) : (
                      card.image_url && <img src={card.image_url} alt="card" className="w-full h-24 object-contain object-left mt-4 rounded-lg" />
                    )}
                  </div>
                  <button onClick={() => handleDelete('theme_cards', card.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 text-xs bg-red-50 px-3 py-1 rounded-full font-bold transition-opacity">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: MEDIA GALLERY ================= */}
        {activeTab === 'media' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-bold mb-4 text-brand-navy">Upload Media</h3>
              <form onSubmit={handleAddGallery} className="flex flex-col gap-4">
                <select value={newGallery.theme_id} onChange={e => setNewGallery({...newGallery, theme_id: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-[#4f46e5]">
                  <option value="home">Home Page (Video/Events)</option>
                  <option value="birthday">Birthday Slider</option>
                  <option value="corporate">Corporate Gallery</option>
                  <option value="discovery">Discovery Gallery</option>
                  <option value="malls">Malls Gallery</option>
                  <option value="other">Other Themes</option>
                  <option value="science">Science Glimpse</option>
                  <option value="princess">Princess Glimpse</option>
                  <option value="wizarding">Wizarding Glimpse</option>
                  <option value="superhero">Superhero Glimpse</option>
                </select>
              
                {(newGallery.theme_id === 'home' || newGallery.theme_id === 'other') && (
                  <select value={newGallery.category} onChange={e => setNewGallery({...newGallery, category: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#4f46e5]">
                    {newGallery.theme_id === 'home' ? (
                      <>
                        <option value="featured_events">Featured Events Glimpse</option>
                        <option value="cta_image">Call To Action Image</option>
                        <option value="hero_video">Main Background Video (.mp4)</option>
                        <option value="hero_slider_video">Small Slider Videos (.mp4)</option>
                      </>
                    ) : (
                      <>
                        <option value="Adventure">Adventure</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Action">Action</option>
                      </>
                    )}
                  </select>
                )}
              
                <input type="text" placeholder="Image Title/Tag" required value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none" />
                <textarea placeholder="Description (Optional)" value={newGallery.description || ''} onChange={e => setNewGallery({...newGallery, description: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-slate-800 h-20 outline-none" />
                <input type="file" required ref={fileInputRef} onChange={e => setUploadFile(e.target.files[0])} className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <button type="submit" disabled={isLoading} className="bg-[#4f46e5] text-white font-bold py-3.5 rounded-xl hover:bg-[#4338ca] mt-2 transition-colors shadow-md">{isLoading ? 'Uploading...' : 'Upload Media'}</button>
              </form>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map(img => (
                <div key={img.id} className="relative group rounded-2xl overflow-hidden shadow-sm h-48 bg-gray-100">
                  {img.category?.includes('video') ? (
                    <video src={img.image_url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 p-4 flex flex-col justify-between transition-opacity duration-300">
                    <div>
                      <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-1 rounded uppercase tracking-wider">{img.theme_id} {img.category ? `- ${img.category}` : ''}</span>
                      <h4 className="text-white font-bold text-sm mt-2">{img.title}</h4>
                    </div>
                    <button onClick={() => handleDelete('gallery_images', img.id)} className="bg-red-500 text-white text-xs font-bold py-1.5 px-4 rounded-full self-start hover:bg-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= MODALS ================= */}
      <AnimatePresence>
        {approveModal.isOpen && (
          <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2">Approve Lead</h3>
              <p className="text-sm text-gray-500 mb-6">Awesome! Let's log the details for analytics.</p>
              <form onSubmit={handleApproveSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Final Budget (₹)</label>
                  <input type="number" required min="0" value={approveModal.budget} onChange={e => setApproveModal({...approveModal, budget: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#10b981]" placeholder="e.g. 50000" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Final Section/Theme</label>
                  <select value={approveModal.section} onChange={e => setApproveModal({...approveModal, section: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#10b981]">
                    <option value="Corporate Events">Corporate Events</option>
                    <option value="Birthday Parties">Birthday Parties</option>
                    <option value="Carnivals">Carnivals</option>
                    <option value="Family Discovery">Family Discovery</option>
                    <option value="Malls">Malls</option>
                    <option value="Other">Other Custom Theme</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setApproveModal({...approveModal, isOpen: false})} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#10b981] text-white font-bold py-3 rounded-xl hover:bg-[#059669] transition-colors shadow-md">Confirm Approval</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {rejectModal.isOpen && (
          <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2">Reject Lead</h3>
              <p className="text-sm text-gray-500 mb-6">Log the reason so we can improve in the future.</p>
              <form onSubmit={handleRejectSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Reason for Rejection</label>
                  <select value={rejectModal.reason} onChange={e => setRejectModal({...rejectModal, reason: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#ef4444]">
                    <option value="Budget too high">Budget was too high</option>
                    <option value="Dates unavailable">Our dates were unavailable</option>
                    <option value="Service not offered">We don't offer this service</option>
                    <option value="Went with competitor">Went with a competitor</option>
                    <option value="Ghosted / No response">Ghosted / No response</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setRejectModal({...rejectModal, isOpen: false})} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#ef4444] text-white font-bold py-3 rounded-xl hover:bg-[#dc2626] transition-colors shadow-md">Confirm Rejection</button>
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