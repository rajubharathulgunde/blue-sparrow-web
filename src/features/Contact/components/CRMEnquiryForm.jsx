import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase'; 

const CRMEnquiryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Birthday Party', 
    budget: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            event_type: formData.eventType,
            budget: formData.budget,
            message: formData.message,
            status: 'NEW'
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', eventType: 'Birthday Party', budget: '', message: '' }); 
    } catch (error) {
      console.error('Error submitting lead:', error.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 max-w-2xl mx-auto relative overflow-hidden w-full">
      
      {/* Decorative Blur - Scaled for mobile */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[#4f46e5] opacity-5 rounded-full blur-[40px] sm:blur-[60px] pointer-events-none"></div>

      <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-navy mb-1.5 sm:mb-2">Plan Your Event</h3>
      <p className="text-gray-500 text-[12px] sm:text-[13px] md:text-sm mb-6 sm:mb-8">Fill out the details below, and our team will get back to you within 24 hours.</p>

      {submitStatus === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-5 sm:p-6 rounded-[20px] sm:rounded-2xl text-center"
        >
          <span className="text-3xl block mb-2">🎉</span>
          <h4 className="font-bold text-base sm:text-lg mb-1">Request Received!</h4>
          <p className="text-[12px] sm:text-[13px] md:text-sm">We have your details and will be in touch shortly.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10 w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
            <div className="w-full min-w-0">
              <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 sm:px-5 py-3 rounded-[14px] sm:rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-[16px] sm:text-[15px]" placeholder="Jane Doe" />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 sm:px-5 py-3 rounded-[14px] sm:rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-[16px] sm:text-[15px]" placeholder="+91 98765 43210" />
            </div>
          </div>

          <div className="w-full min-w-0">
            <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 sm:px-5 py-3 rounded-[14px] sm:rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-[16px] sm:text-[15px]" placeholder="jane@example.com" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
            
            {/* MODERN DROPDOWN - EVENT TYPE */}
            <div className="w-full min-w-0">
              <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Event Type</label>
              <div className="relative w-full">
                <select name="eventType" value={formData.eventType} onChange={handleChange} required className="w-full px-4 sm:px-5 py-3 pr-10 rounded-[14px] sm:rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-[16px] sm:text-[15px] text-gray-600 cursor-pointer appearance-none truncate">
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Corporate Family Days">Corporate Family Days</option>
                  <option value="Family Discovery">Family Discovery</option>
                  <option value="Malls & Brand Activities">Malls & Brand Activities</option>
                  <option value="Other">Other</option>
                </select>
                {/* Custom modern arrow pointing down */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* MODERN DROPDOWN - BUDGET */}
            <div className="w-full min-w-0">
              <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Estimated Budget</label>
              <div className="relative w-full">
                <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 sm:px-5 py-3 pr-10 rounded-[14px] sm:rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-[16px] sm:text-[15px] text-gray-600 cursor-pointer appearance-none truncate">
                  <option value="">Select a range...</option>
                  <option value="₹25k - ₹50k">₹25k - ₹50k (Focused)</option>
                  <option value="₹50k - ₹1 Lakh">₹50k - ₹1 Lakh (Mid-Size)</option>
                  <option value="₹1 Lakh+">₹1 Lakh+ (Large Scale)</option>
                </select>
                {/* Custom modern arrow pointing down */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

          </div>

          <div className="w-full min-w-0">
            <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Tell us about your event</label>
            <textarea name="message" rows="4" value={formData.message} onChange={handleChange} className="w-full px-4 sm:px-5 py-3 rounded-[14px] sm:rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-[16px] sm:text-[15px]" placeholder="Dates, location, child's interests, or business objectives..."></textarea>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#4f46e5] hover:bg-pink-500 text-white font-bold py-3.5 sm:py-4 rounded-[14px] sm:rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-[14px] sm:text-base mt-2">
            {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
          </button>
          
          {submitStatus === 'error' && (
            <p className="text-red-500 text-[12px] sm:text-[13px] md:text-sm text-center mt-3 font-medium">Something went wrong. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
};

export default CRMEnquiryForm;