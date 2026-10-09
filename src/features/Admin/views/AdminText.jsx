import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_TABS = [
  { id: 'global', label: '🌍 Global (Nav/Footer)' },
  { id: 'home', label: '🏠 Home Page' },
  { id: 'about', label: '📖 About Us' },
  { id: 'birthday', label: '🎈 Kids Parties' },
  { id: 'corporate', label: '💼 Corporate' },
  { id: 'carnival', label: '🎪 Carnivals' },
  { id: 'discovery', label: '🧭 Discovery' },
  { id: 'malls', label: '🛍️ Schools & Malls' },
  { id: 'science', label: '🧪 Science' },
  { id: 'superhero', label: '🦸‍♂️ Superhero' },
  { id: 'wizarding', label: '🧙‍♂️ Wizarding' },
  { id: 'princess', label: '👑 Princess' },
];

const DEFAULT_PAGE_TEXTS = {
  malls: [
    { text_key: 'hero_badge', content: 'Mall & Brand Activities' },
    { text_key: 'hero_title', content: 'High Footfall.\nZero Friction.' },
    { text_key: 'hero_desc', content: 'We transform retail atriums into powerful family magnets. We engineer the participant flow, manage the queues, and run multi-day programming flawlessly.' },
    { text_key: 'hero_btn', content: 'Explore Activations' },
    { text_key: 'chal1_title', content: 'Queue Management' },
    { text_key: 'chal1_desc', content: 'Fast-turnaround activities designed to keep lines moving while delivering high-value engagement, preventing atrium bottlenecks.' },
    { text_key: 'chal2_title', content: 'Spatial Design' },
    { text_key: 'chal2_desc', content: 'Whether you have a massive main atrium or a compact dead zone, we optimize the footprint for maximum participant volume.' },
    { text_key: 'chal3_title', content: 'Multi-Day Scalability' },
    { text_key: 'chal3_desc', content: 'Robust operational structures that allow activities to run consistently across weekends or entire month-long festive seasons.' },
    { text_key: 'glimpse_title', content: 'Activations in Action' },
    { text_key: 'glimpse_desc', content: 'See how we transform retail spaces.' },
    { text_key: 'card_btn', content: 'Learn More' },
    { text_key: 'case_badge', content: 'Case Study Highlight' },
    { text_key: 'case_title', content: 'How We Work:\nRetail Edition' },
    { text_key: 'step1_title', content: 'The Brief' },
    { text_key: 'step1_desc', content: 'Weekend engagement, limited atrium space, high family footfall. The objective: keep kids deeply engaged while parents shop without crowding the aisles.' },
    { text_key: 'step2_title', content: 'The Plan' },
    { text_key: 'step2_desc', content: '3 distinct, fast-paced activity zones with strict 10-minute rotation batches. Dedicated queue facilitators manage lines, utilizing self-contained, mess-free materials.' },
    { text_key: 'step3_title', content: 'Made Real' },
    { text_key: 'step3_desc', content: 'Seamless execution handling 500+ kids a day without a single crowd-control escalation for mall security.' },
    { text_key: 'quote_text', content: 'Flawless crowd control.' },
    { text_key: 'quote_author', content: 'Center Manager, Leading Retail Mall' },
  ]
};

const AdminText = () => {
  const [activePage, setActivePage] = useState('home');
  const [texts, setTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tabsScrollRef = useRef(null);

  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');

  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchTexts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('website_text')
      .select('*')
      .eq('page_id', activePage)
      .order('created_at', { ascending: false });

    if (!error && data) setTexts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTexts();
    const channel = supabase.channel('live-website-text')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'website_text' }, fetchTexts)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [activePage]);

  const handleLoadDefaults = async () => {
    const defaults = DEFAULT_PAGE_TEXTS[activePage];
    if (!defaults) return alert("No default texts predefined for this specific page yet.");
    setIsLoading(true);
    for (const item of defaults) {
      const exists = texts.find(t => t.text_key === item.text_key);
      if (!exists) await supabase.from('website_text').insert([{ page_id: activePage, ...item }]);
    }
    fetchTexts();
    setIsLoading(false);
    alert("Pre-Integrated Texts Loaded Successfully!");
  };

  const handleAddText = async (e) => {
    e.preventDefault();
    if (!newKey || !newContent) return alert("Please fill both fields");
    const formattedKey = newKey.toLowerCase().replace(/[^a-z0-9]/g, '_');
    setIsLoading(true);
    const { error } = await supabase.from('website_text').insert([{ page_id: activePage, text_key: formattedKey, content: newContent }]);
    if (error) {
      if (error.code === '23505') alert("This Text Key already exists! Please use a unique key.");
      else alert(`Error: ${error.message}`);
    } else {
      setNewKey(''); setNewContent(''); alert("Text added successfully!");
    }
    setIsLoading(false);
  };

  const startEditing = (id, content) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleUpdateContent = async (id) => {
    if (!window.confirm("Are you sure you want to overwrite the existing text with these changes?")) return;
    setIsLoading(true);
    const { error } = await supabase.from('website_text').update({ content: editContent }).eq('id', id);
    if (error) alert("Error updating text");
    else alert("Text updated successfully!");
    setEditingId(null);
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("WARNING: Are you sure you want to permanently delete this text block? The website will revert to its fallback text.")) return;
    await supabase.from('website_text').delete().eq('id', id);
  };

  const scrollTabs = (direction) => {
    if (tabsScrollRef.current) tabsScrollRef.current.scrollBy({ left: direction * 250, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full">
      <div className="relative mb-8 flex items-center w-full bg-white rounded-2xl shadow-sm border border-gray-200">
        <button onClick={() => scrollTabs(-1)} className="absolute left-0 z-10 h-[80%] px-2 bg-gradient-to-r from-white via-white to-transparent flex items-center justify-start text-gray-500 hover:text-[#0f172a] rounded-l-2xl">
          <div className="bg-white rounded-full shadow-md border border-gray-100 p-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg></div>
        </button>

        <div ref={tabsScrollRef} className="flex gap-2 p-2 w-full overflow-x-auto whitespace-nowrap scroll-smooth px-10 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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

        <button onClick={() => scrollTabs(1)} className="absolute right-0 z-10 h-[80%] px-2 bg-gradient-to-l from-white via-white to-transparent flex items-center justify-end text-gray-500 hover:text-[#0f172a] rounded-r-2xl">
          <div className="bg-white rounded-full shadow-md border border-gray-100 p-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg></div>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <div className="w-full lg:w-[35%] bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200 h-fit lg:sticky lg:top-8">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-[#0f172a] border-b pb-4">Add Text to {PAGE_TABS.find(p=>p.id===activePage)?.label}</h3>
          <form onSubmit={handleAddText} className="flex flex-col gap-4">
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Text Key (e.g. hero_title)</label>
                <input type="text" required value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="E.g. main_heading" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white text-sm sm:text-base" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Text Content</label>
                <textarea required value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Enter the text that will appear on the website..." className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 h-32 outline-none focus:border-[#4f46e5] focus:bg-white resize-none text-sm sm:text-base" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#4f46e5] text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-[#4338ca] mt-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm sm:text-base">
              {isLoading ? 'Saving...' : 'Save Text Entry'}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-[65%] flex flex-col gap-6">
          <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-2">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a]">Active Text Blocks</h3>
              <div className="flex items-center gap-3">
                <span className="bg-gray-100 text-gray-500 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full">{texts.length} Keys</span>
                {DEFAULT_PAGE_TEXTS[activePage] && (
                  <button onClick={handleLoadDefaults} disabled={isLoading} className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full transition-colors">+ Load Defaults</button>
                )}
              </div>
            </div>

            {texts.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-5xl block mb-4">🔤</span>
                <h4 className="text-xl font-bold text-[#0f172a] mb-2">No text keys added yet</h4>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">Use the form to add customizable text, or click "Load Defaults" above to automatically pull in pre-integrated text blocks.</p>
                {DEFAULT_PAGE_TEXTS[activePage] && (
                  <button onClick={handleLoadDefaults} className="bg-[#0f172a] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-slate-800 transition-colors">Load Pre-Integrated Texts</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 w-full">
                {texts.map((item) => {
                  const isEditing = editingId === item.id;
                  
                  return (
                    <div key={item.id} className={`bg-gray-50 p-4 rounded-2xl border ${isEditing ? 'border-[#4f46e5] ring-2 ring-[#4f46e5]/20 bg-white' : 'border-gray-100'} flex flex-col gap-3 transition-all w-full`}>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-bold text-[#4f46e5] bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">{item.text_key}</span>
                        
                        <div className="flex gap-2">
                          {!isEditing ? (
                            <>
                              <button onClick={() => startEditing(item.id, item.content)} className="text-blue-500 text-xs font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                              <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                              <button onClick={() => handleUpdateContent(item.id)} className="text-white text-xs font-bold bg-[#4f46e5] hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm">Update</button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <textarea 
                        disabled={!isEditing}
                        value={isEditing ? editContent : item.content} 
                        onChange={(e) => setEditContent(e.target.value)}
                        className={`w-full rounded-xl p-3 text-sm sm:text-base text-gray-700 outline-none resize-y min-h-[60px] ${isEditing ? 'bg-gray-50 border border-gray-200' : 'bg-transparent border-transparent'}`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminText;