import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTheme = () => {
  const [activeTab, setActiveTab] = useState('text'); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Data States
  const [texts, setTexts] = useState({});
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cases, setCases] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Form States (Pre-filled with globally unique keys for this page)
  const [textForm, setTextForm] = useState({
    themes_hero_badge: '',
    themes_hero_title: '',
    themes_hero_desc: '',
    themes_hero_btn: '',
    themes_glimpse_title: ''
  });
  
  const [mediaForm, setMediaForm] = useState({ title: '', description: '', icon: '', category: 'hero', date: '' });
  const [uploadFile, setUploadFile] = useState(null);
  const fileInputRef = useRef(null);

  // === FETCH ALL THEMES PAGE DATA ===
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [textRes, galleryRes, cardsRes, casesRes, blogsRes] = await Promise.all([
        supabase.from('website_text').select('*').eq('page_id', 'themes'),
        supabase.from('gallery_images').select('*').eq('theme_id', 'themes').order('created_at', { ascending: false }),
        supabase.from('theme_cards').select('*').eq('theme_id', 'themes').order('created_at', { ascending: true }),
        supabase.from('case_studies').select('*').eq('theme_id', 'themes').order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').eq('theme_id', 'themes').order('created_at', { ascending: false })
      ]);

      if (textRes.data) {
        const textMap = textRes.data.reduce((acc, curr) => ({ ...acc, [curr.text_key]: curr.content }), {});
        setTexts(textMap);
        setTextForm(prev => ({ ...prev, ...textMap }));
      }
      if (galleryRes.data) setGallery(galleryRes.data);
      if (cardsRes.data) setCategories(cardsRes.data);
      if (casesRes.data) setCases(casesRes.data);
      if (blogsRes.data) setBlogs(blogsRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === TEXT UPDATER LOGIC (Fixed Unique Constraint) ===
  const handleTextUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updates = Object.keys(textForm).map(key => ({
        page_id: 'themes',
        text_key: key,
        content: textForm[key]
      }));

      // Because text_key is unique in your DB, we must use 'text_key' as the conflict target
      const { error } = await supabase.from('website_text').upsert(updates, { onConflict: 'text_key' });
      
      if (error) throw error;
      alert("Text updated successfully!");
      fetchData();
    } catch (error) {
      alert("Error updating text: " + error.message);
    }
    setIsLoading(false);
  };

  // === FILE UPLOAD LOGIC ===
  const handleFileUpload = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from('website-assets').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);
      const { data: urlData } = supabase.storage.from('website-assets').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (err) { throw err; }
  };

  // === MEDIA / CARDS / BLOGS ADDER LOGIC ===
  const handleAddMedia = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let uploadedUrl = null;
      if (uploadFile) {
        uploadedUrl = await handleFileUpload(uploadFile);
      } else if (activeTab === 'gallery') {
        throw new Error("An image is required for this section.");
      }

      let error = null;

      if (activeTab === 'gallery') {
        const { error: err } = await supabase.from('gallery_images').insert([{
          theme_id: 'themes',
          category: mediaForm.category, // 'hero' or 'glimpse'
          title: mediaForm.title,
          tag: mediaForm.icon,
          image_url: uploadedUrl
        }]);
        error = err;
      } else if (activeTab === 'categories') {
        const { error: err } = await supabase.from('theme_cards').insert([{
          theme_id: 'themes',
          title: mediaForm.title,
          description: mediaForm.description,
          icon: mediaForm.icon,
          image_url: uploadedUrl
        }]);
        error = err;
      } else if (activeTab === 'cases') {
        const { error: err } = await supabase.from('case_studies').insert([{
          theme_id: 'themes',
          title: mediaForm.title,
          description: mediaForm.description,
          icon: mediaForm.icon || 'CASE STUDY',
          image_url: uploadedUrl
        }]);
        error = err;
      } else if (activeTab === 'blogs') {
        const { error: err } = await supabase.from('blogs').insert([{
          theme_id: 'themes',
          title: mediaForm.title,
          description: mediaForm.description,
          icon: mediaForm.icon || 'ARTICLE',
          date: mediaForm.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          image_url: uploadedUrl
        }]);
        error = err;
      }

      if (error) throw error;
      alert("Content added successfully!");
      setMediaForm({ title: '', description: '', icon: '', category: 'hero', date: '' });
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const currentList = activeTab === 'gallery' ? gallery : activeTab === 'categories' ? categories : activeTab === 'cases' ? cases : blogs;
  const tableTarget = activeTab === 'gallery' ? 'gallery_images' : activeTab === 'categories' ? 'theme_cards' : activeTab === 'cases' ? 'case_studies' : 'blogs';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Sub-Navigation */}
      <div className="relative mb-8 flex flex-wrap gap-2 w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
         {[
           { id: 'text', label: '🔤 Page Text' },
           { id: 'gallery', label: '🖼️ Hero & Highlights' },
           { id: 'categories', label: '✨ Theme Categories' },
           { id: 'cases', label: '📘 Case Studies' },
           { id: 'blogs', label: '📝 Blogs' }
         ].map(tab => (
           <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setUploadFile(null); }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-[#0f172a] text-white shadow-md' : 'text-gray-500 hover:bg-slate-50'}`}
            >
              {tab.label}
           </button>
         ))}
      </div>

      {/* TEXT MANAGER TAB */}
      {activeTab === 'text' && (
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-200 max-w-4xl">
          <h3 className="text-xl font-bold text-[#0f172a] mb-6 border-b pb-4">Themes Landing Page Text</h3>
          <form onSubmit={handleTextUpdate} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800 border-b pb-2">Hero Section</h4>
                <div>
                  
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Hero Title</label>
                  <textarea value={textForm.themes_hero_title} onChange={e => setTextForm({...textForm, themes_hero_title: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-500 h-20 resize-none" placeholder="Worlds Built\nFor Wonder."/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Hero Description</label>
                  <textarea value={textForm.themes_hero_desc} onChange={e => setTextForm({...textForm, themes_hero_desc: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-500 h-24 resize-none"/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Hero Button</label>
                  <input type="text" value={textForm.themes_hero_btn} onChange={e => setTextForm({...textForm, themes_hero_btn: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-500"/>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800 border-b pb-2">Event Highlights Section</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Slider Title</label>
                  <input type="text" value={textForm.themes_glimpse_title} onChange={e => setTextForm({...textForm, themes_glimpse_title: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-500" placeholder="Moments of Magic"/>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save Text Changes'}
            </button>
          </form>
        </div>
      )}

      {/* MEDIA, CARDS, CASES, BLOGS TABS */}
      {activeTab !== 'text' && (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* FORM SIDE */}
          <div className="w-full lg:w-[35%] bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200 h-fit lg:sticky lg:top-8">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-[#0f172a] border-b pb-4 capitalize">
              Add New {activeTab.replace('_', ' ')}
            </h3>
            
            <form onSubmit={handleAddMedia} className="flex flex-col gap-4">
              <div className="space-y-4 pt-2">
                
                {activeTab === 'gallery' && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Image Type</label>
                    <select value={mediaForm.category} onChange={e => setMediaForm({...mediaForm, category: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-teal-500">
                      <option value="hero">Main Hero Auto-Slider</option>
                      <option value="glimpse">Moments of Magic (Highlights)</option>
                    </select>
                  </div>
                )}

                <input type="text" placeholder="Title / Heading *" required value={mediaForm.title} onChange={e => setMediaForm({...mediaForm, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-teal-500 text-sm" />
                
                {activeTab !== 'gallery' && (
                  <textarea placeholder="Description Text *" required value={mediaForm.description} onChange={e => setMediaForm({...mediaForm, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 h-28 outline-none focus:border-teal-500 resize-none text-sm" />
                )}

                <input type="text" placeholder={activeTab === 'categories' ? "Badge (e.g. MAGIC)" : activeTab === 'cases' ? "Badge (e.g. PROJECT)" : "Category Tag"} value={mediaForm.icon} onChange={e => setMediaForm({...mediaForm, icon: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-teal-500 text-sm" />

                {activeTab === 'blogs' && (
                   <input type="text" placeholder="Date (Optional, defaults to today)" value={mediaForm.date} onChange={e => setMediaForm({...mediaForm, date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-teal-500 text-sm" />
                )}

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Upload Image</label>
                  <input type="file" required={activeTab === 'gallery'} ref={fileInputRef} onChange={e => setUploadFile(e.target.files[0])} className="w-full text-[10px] sm:text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 file:cursor-pointer border border-gray-200 rounded-xl p-1.5 bg-gray-50 overflow-hidden" />
                </div>
              </div>
              
              <button type="submit" disabled={isLoading} className="w-full bg-[#0f172a] text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-slate-800 mt-2 sm:mt-4 transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm">
                {isLoading ? 'Saving...' : `Upload to ${activeTab}`}
              </button>
            </form>
          </div>

          {/* LIST SIDE */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
              <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] capitalize">Manage {activeTab.replace('_', ' ')}</h3>
                  <span className="bg-gray-100 text-gray-500 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full w-fit">{currentList.length} Items</span>
                </div>
                
                {currentList.length === 0 ? (
                   <div className="bg-gray-50 rounded-[24px] border border-gray-100 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm">📭</div>
                      <h3 className="text-lg font-bold text-[#0f172a] mb-2">No Content Found</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Use the form on the left to add items to this section.</p>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentList.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-[20px] p-2 border border-gray-100 relative group flex flex-col h-[280px]">
                          <div className="w-full h-36 bg-gray-200 rounded-[16px] overflow-hidden relative shrink-0">
                          {item.image_url ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">NO IMAGE</div>}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-20">
                              <button onClick={() => handleDelete(tableTarget, item.id)} className="bg-red-500 text-white text-xs font-bold py-2 px-6 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all">Delete</button>
                          </div>
                          
                          {activeTab === 'gallery' && (
                            <div className="absolute top-2 left-2 bg-[#0f172a]/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md z-10 uppercase tracking-widest">
                               {item.category}
                            </div>
                          )}
                          </div>
                          <div className="p-3 flex flex-col flex-grow overflow-hidden">
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-teal-600 truncate mb-1">{item.icon || item.tag}</span>
                            <h4 className="font-bold text-xs sm:text-sm text-[#0f172a] leading-tight line-clamp-1">{item.title || 'Untitled'}</h4>
                            {item.description && <p className="text-[10px] text-gray-500 mt-1 line-clamp-3 leading-relaxed">{item.description}</p>}
                          </div>
                      </div>
                      ))}
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTheme;