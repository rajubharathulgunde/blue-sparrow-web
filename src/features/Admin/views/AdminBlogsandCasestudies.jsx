import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_OPTIONS = [
  { id: 'corporate', label: 'Corporate Events' },
  { id: 'birthday', label: 'Kids Parties (Birthdays)' },
  { id: 'carnivals', label: 'Carnivals' },
  { id: 'malls', label: 'Schools & Malls' },
  { id: 'portfolio', label: 'Portfolio Page' }, // ADDED THIS
];

const AdminBlogsandCasestudies = () => {
  const [activeTab, setActiveTab] = useState('case_studies'); // 'case_studies' or 'blogs'
  const [caseStudies, setCaseStudies] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterTheme, setFilterTheme] = useState('all');
  
  const [formData, setFormData] = useState({ title: '', description: '', icon: '', date: '', theme_id: 'corporate' });
  const [uploadFile, setUploadFile] = useState(null);
  const fileInputRef = useRef(null);

  // === FETCH DATA ===
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: caseStudiesData } = await supabase.from('case_studies').select('*').order('created_at', { ascending: false });
      if (caseStudiesData) setCaseStudies(caseStudiesData);

      const { data: blogsData } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (blogsData) setBlogs(blogsData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    
    const caseStudiesSub = supabase.channel('live-case-studies-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'case_studies' }, fetchData).subscribe();
    const blogsSub = supabase.channel('live-blogs-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(caseStudiesSub);
      supabase.removeChannel(blogsSub);
    };
  }, []);

  // === FILE UPLOAD ===
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

  // === ADD ITEM ===
  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let uploadedUrl = null;
      if (uploadFile) {
        uploadedUrl = await handleFileUpload(uploadFile);
      }

      const table = activeTab === 'case_studies' ? 'case_studies' : 'blogs';
      
      const payload = {
        title: formData.title || null,
        description: formData.description || null,
        icon: formData.icon || (activeTab === 'case_studies' ? 'CASE STUDY' : 'PARTY TIPS'),
        theme_id: formData.theme_id || 'corporate',
        image_url: uploadedUrl || null
      };

      if (activeTab === 'blogs') {
         payload.date = formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }

      const { error } = await supabase.from(table).insert([payload]);
      if (error) throw new Error(`DB Error: ${error.message}`);

      alert(`${activeTab === 'case_studies' ? 'Case Study' : 'Blog'} Added Successfully!`);
      
      // Reset form
      setFormData({ title: '', description: '', icon: '', date: '', theme_id: formData.theme_id });
      setUploadFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      
      fetchData();
    } catch (error) { 
        alert(error.message); 
    }
    setIsLoading(false);
  };

  // === DELETE ITEM ===
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item completely?')) return;
    const table = activeTab === 'case_studies' ? 'case_studies' : 'blogs';
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const rawList = activeTab === 'case_studies' ? caseStudies : blogs;
  const currentList = filterTheme === 'all' ? rawList : rawList.filter(item => item.theme_id === filterTheme);
  const listLabel = activeTab === 'case_studies' ? 'Case Studies' : 'Blogs';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Sub Navigation */}
      <div className="relative mb-8 flex flex-col sm:flex-row justify-between items-center w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-2 gap-4">
         <div className="flex gap-2 w-full sm:w-auto">
           <button 
              onClick={() => setActiveTab('case_studies')}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === 'case_studies' ? 'bg-[#0f172a] text-white shadow-md' : 'text-gray-500 hover:bg-slate-50'}`}
            >
              📘 Case Studies
           </button>
           <button 
              onClick={() => setActiveTab('blogs')}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === 'blogs' ? 'bg-[#0f172a] text-white shadow-md' : 'text-gray-500 hover:bg-slate-50'}`}
            >
              📝 Blogs & News
           </button>
         </div>
         
         {/* Filter Dropdown */}
         <div className="w-full sm:w-auto px-2">
            <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)} className="w-full sm:w-[200px] p-2 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#4f46e5]">
              <option value="all">Show All Pages</option>
              {PAGE_OPTIONS.map(page => <option key={`filter-${page.id}`} value={page.id}>{page.label}</option>)}
            </select>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ADD NEW ITEM FORM */}
        <div className="w-full lg:w-[35%] bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200 h-fit lg:sticky lg:top-8">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-[#0f172a] border-b pb-4">
            Add New {listLabel.slice(0, -1)}
          </h3>
          
          <form onSubmit={handleAddItem} className="flex flex-col gap-4">
            <div className="space-y-4 pt-2 border-t border-gray-100">
              
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Target Page / Theme</label>
                <select value={formData.theme_id} onChange={e => setFormData({...formData, theme_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white transition-colors text-sm sm:text-base">
                  {PAGE_OPTIONS.map(page => <option key={page.id} value={page.id}>{page.label}</option>)}
                </select>
              </div>

              <input type="text" placeholder="Title *" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white transition-colors text-sm sm:text-base" />
              
              <textarea placeholder="Description Text *" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 h-28 outline-none focus:border-[#4f46e5] focus:bg-white transition-colors resize-none text-sm sm:text-base" />

              <input type="text" placeholder={activeTab === 'case_studies' ? "Badge (e.g. CASE STUDY)" : "Category (e.g. PARTY TIPS)"} value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white transition-colors text-sm sm:text-base" />

              {activeTab === 'blogs' && (
                 <input type="text" placeholder="Date (Optional, defaults to today)" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white transition-colors text-sm sm:text-base" />
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Upload Cover Image</label>
                <input type="file" ref={fileInputRef} onChange={e => setUploadFile(e.target.files[0])} className="w-full text-[10px] sm:text-sm text-slate-600 file:mr-4 file:py-2 sm:file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer border border-gray-200 rounded-xl p-1.5 bg-gray-50 overflow-hidden" />
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full bg-[#4f46e5] text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-[#4338ca] mt-2 sm:mt-4 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
              {isLoading ? 'Saving...' : `Publish ${listLabel.slice(0, -1)}`}
            </button>
          </form>
        </div>

        {/* DISPLAY CURRENT ITEMS */}
        <div className="w-full lg:w-[65%] flex flex-col gap-6 sm:gap-10">
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a]">Manage {listLabel}</h3>
                <span className="bg-gray-100 text-gray-500 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full w-fit">{currentList.length} Items</span>
              </div>
              
              {currentList.length === 0 ? (
                 <div className="bg-gray-50 rounded-[24px] border border-gray-100 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-4 shadow-sm">📭</div>
                    <h3 className="text-lg font-bold text-[#0f172a] mb-2">No {listLabel} Found</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Use the form on the left to add your first {listLabel.slice(0, -1)}.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {currentList.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-[20px] p-2 border border-gray-100 relative group flex flex-col overflow-hidden h-[250px] sm:h-[280px]">
                        <div className="w-full h-32 sm:h-36 bg-gray-200 rounded-[16px] overflow-hidden relative shrink-0">
                        {item.image_url ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">NO IMAGE</div>}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-20">
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white text-xs font-bold py-2 px-6 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all">Delete</button>
                        </div>
                        {/* Show what page this belongs to */}
                        <div className="absolute top-2 left-2 bg-[#0f172a]/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md z-10 uppercase tracking-widest">
                           {item.theme_id || 'Global'}
                        </div>
                        </div>
                        <div className="p-3 flex flex-col flex-grow">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#4f46e5] truncate">{item.icon}</span>
                            {activeTab === 'blogs' && <span className="text-[8px] font-bold text-slate-400">{item.date}</span>}
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#0f172a] leading-tight line-clamp-1">{item.title || 'Untitled'}</h4>
                        {item.description && <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>}
                        </div>
                    </div>
                    ))}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsandCasestudies;