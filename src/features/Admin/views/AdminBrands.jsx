import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [brandName, setBrandName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const fileInputRef = useRef(null);

  const fetchBrands = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('theme_id', 'global')
      .eq('category', 'brand')
      .order('created_at', { ascending: false });

    if (!error && data) setBrands(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBrands();
    const channel = supabase.channel('live-brands')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchBrands)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleFileUpload = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('website-assets').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);
    const { data: urlData } = supabase.storage.from('website-assets').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("A brand logo image is required.");
    
    setIsLoading(true);
    try {
      const uploadedUrl = await handleFileUpload(uploadFile);

      const { error } = await supabase.from('gallery_images').insert([{ 
        theme_id: 'global', 
        category: 'brand', 
        title: brandName || null, // Optional text
        image_url: uploadedUrl 
      }]);

      if (error) throw error;

      alert("Brand added successfully!");
      setBrandName('');
      setUploadFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      fetchBrands();
    } catch (err) {
      alert(err.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    await supabase.from('gallery_images').delete().eq('id', id);
    fetchBrands();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full animate-in fade-in duration-500">
      
      {/* LEFT: ADD FORM */}
      <div className="w-full lg:w-[35%] bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200 h-fit lg:sticky lg:top-8">
        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-[#0f172a] border-b pb-4">
          Add Trusted Brand <br></br>
          
        </h3>
        <p>
          Format: PNG (Transparent Background)<br></br>
          Size: 400x150 pixels (Approximate horizontal rectangle)<br></br>
          Cropping: Tight to the edges<br></br>
          Color: Original brand colors (the code handles the grey effect)
          </p>
        
        <form onSubmit={handleAddBrand} className="flex flex-col gap-4">
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Brand Name (Optional)</label>
              <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="E.g. Hamleys" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white text-sm" />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Brand Logo Image *</label>
              <input type="file" required accept="image/*" ref={fileInputRef} onChange={e => setUploadFile(e.target.files[0])} className="w-full text-[10px] sm:text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer border border-gray-200 rounded-xl p-1.5 bg-gray-50" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#4f46e5] text-white font-bold py-3.5 rounded-xl hover:bg-[#4338ca] mt-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm">
            {isLoading ? 'Saving...' : 'Add Brand'}
          </button>
        </form>
      </div>

      {/* RIGHT: LIST OF BRANDS */}
      <div className="w-full lg:w-[65%] flex flex-col gap-6">
        <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a]">Active Brands</h3>
            <span className="bg-gray-100 text-gray-500 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full">{brands.length} Brands</span>
          </div>

          {brands.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">🏢</span>
              <h4 className="text-xl font-bold text-[#0f172a] mb-2">No brands added yet</h4>
              <p className="text-sm text-gray-500">Upload logos using the form to show them in the scrolling marquee.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {brands.map((brand) => (
                <div key={brand.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-between gap-3 relative group">
                  <div className="h-16 flex items-center justify-center w-full">
                    <img src={brand.image_url} alt={brand.title || "Brand Logo"} className="max-h-full max-w-full object-contain" />
                  </div>
                  {brand.title && <span className="text-xs font-bold text-slate-700 text-center line-clamp-1">{brand.title}</span>}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button onClick={() => handleDelete(brand.id)} className="bg-red-500 text-white text-xs font-bold py-2 px-4 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBrands;