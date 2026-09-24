import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import BrandLogo from '../../../shared/components/BrandLogo';
import { supabase } from '../../../lib/supabase';

const ContactView = () => {
  // === FORM STATE & LOGIC ===
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '', 
    budget: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            event_type: formData.eventType || 'Other',
            budget: formData.budget,
            message: formData.message,
            status: 'NEW'
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', eventType: '', budget: '', message: '' }); 
    } catch (error) {
      console.error('Error submitting lead:', error.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans text-gray-600 bg-[#f8fafc] min-h-screen flex flex-col selection:bg-brand-pink selection:text-brand-navy relative overflow-hidden">
      <BrandLogo />
      <Navbar />
      
      {/* ================= AMBIENT GLASSMORPHIC BACKGROUND ORBS ================= */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-[40%] left-[30%] w-[30vw] h-[30vw] bg-pink-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <section className="pt-28 sm:pt-40 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-12 flex-grow relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* ================= HEADER ================= */}
          <div className="text-center mb-8 sm:mb-14 relative z-10">
            <span className="text-[#4f46e5] font-bold tracking-widest uppercase text-[10px] sm:text-sm mb-3 sm:mb-4 block">Get In Touch</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-brand-navy mb-4 sm:mb-6 leading-tight drop-shadow-sm">
              Let's Plan Your <br className="hidden sm:block"/> Next <span className="text-pink-500 font-script font-normal transform -rotate-2 inline-block">Magic</span> Moment.
            </h1>
            <p className="text-[14px] sm:text-lg text-gray-500 max-w-2xl mx-auto px-2 sm:px-0 font-medium">
              Whether you have a clear vision or just a spark of an idea, we're here to bring it to life. Fill out the form below and our experts will be in touch!
            </p>
          </div>

          {/* ================= GLASSMORPHIC MAIN CONTAINER ================= */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white/40 backdrop-blur-2xl rounded-[32px] sm:rounded-[48px] shadow-[0_8px_32px_rgba(31,38,135,0.05)] border border-white/60 p-5 sm:p-8 lg:p-12 relative overflow-hidden">
            
            {/* Inner decorative light sweep */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-0"></div>

            {/* ================= LEFT: CONTACT INFO ================= */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 sm:gap-8 relative z-10">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-navy mb-2 sm:mb-4">Contact Information</h3>
                <p className="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed mb-4 sm:mb-6">
                  We'd love to hear from you! Reach out directly using the details below or use our quick inquiry form.
                </p>
              </div>

              <div className="flex flex-col gap-5 sm:gap-6 w-full">
                
                {/* EMAIL - Fixed Overflow with flex-1 min-w-0 and truncate */}
                <div className="flex items-start gap-3 sm:gap-4 w-full group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/70 border border-white shadow-sm text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] sm:text-[12px] text-gray-400 font-bold tracking-wider uppercase mb-0.5">Email Us</span>
                    <a href="mailto:hello@bluesparrowevents.com" className="text-brand-navy font-bold text-[14px] sm:text-[15px] truncate block w-full hover:text-blue-600 transition-colors" title="hello@bluesparrowevents.com">
                      hello@bluesparrowevents.com
                    </a>
                  </div>
                </div>

                {/* PHONE */}
                <div className="flex items-start gap-3 sm:gap-4 w-full group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/70 border border-white shadow-sm text-pink-500 flex items-center justify-center shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] sm:text-[12px] text-gray-400 font-bold tracking-wider uppercase mb-0.5">Call Us</span>
                    <a href="tel:+919619780981" className="text-brand-navy font-bold text-[14px] sm:text-[15px] truncate block w-full hover:text-pink-500 transition-colors">
                      +91 96197 80981
                    </a>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex items-start gap-3 sm:gap-4 w-full group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/70 border border-white shadow-sm text-emerald-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="block text-[10px] sm:text-[12px] text-gray-400 font-bold tracking-wider uppercase mb-0.5">Visit Us</span>
                    <span className="text-brand-navy font-bold text-[14px] sm:text-[15px] leading-snug block truncate w-full">
                      Mumbai, Maharashtra, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT: THE FORM ================= */}
            <div className="w-full lg:w-2/3 bg-white/50 backdrop-blur-md rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col justify-center mt-6 lg:mt-0 relative z-10">
              {submitStatus === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 sm:py-16">
                  <span className="text-5xl sm:text-6xl mb-4 sm:mb-6 block drop-shadow-md">🎉</span>
                  <h4 className="text-xl sm:text-3xl font-serif font-bold text-brand-navy mb-3">Inquiry Sent Successfully!</h4>
                  <p className="text-gray-500 text-[14px] sm:text-[16px] mb-8 max-w-md mx-auto">Thank you for reaching out. Our team will review your details and contact you shortly.</p>
                  <button onClick={() => setSubmitStatus(null)} className="text-[#4f46e5] font-bold text-[14px] sm:text-[16px] hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                  
                  {/* NAME */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Doe" className="w-full bg-white/70 border border-white/80 rounded-[14px] sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 focus:bg-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[16px] sm:text-[15px] shadow-sm text-brand-navy placeholder-gray-400" />
                  </div>

                  {/* PHONE */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full bg-white/70 border border-white/80 rounded-[14px] sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 focus:bg-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[16px] sm:text-[15px] shadow-sm text-brand-navy placeholder-gray-400" />
                  </div>

                  {/* EMAIL */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-2">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com" className="w-full bg-white/70 border border-white/80 rounded-[14px] sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 focus:bg-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[16px] sm:text-[15px] shadow-sm text-brand-navy placeholder-gray-400" />
                  </div>

                  {/* EVENT TYPE (Scroll Wheel Fix + Custom Arrow) */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Event Type *</label>
                    <div className="relative w-full">
                      <select name="eventType" value={formData.eventType} onChange={handleChange} required className="w-full bg-white/70 border border-white/80 rounded-[14px] sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 focus:bg-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[16px] sm:text-[15px] text-brand-navy shadow-sm cursor-pointer appearance-none truncate pr-10">
                        <option value="" disabled>Select an experience...</option>
                        <option value="Birthday Party">Birthday Party</option>
                        <option value="Corporate Family Days">Corporate Family Days</option>
                        <option value="Family Discovery">Family Discovery</option>
                        <option value="Malls & Brand Activities">Malls & Brand Activities</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* BUDGET (Scroll Wheel Fix + Custom Arrow) */}
                  {/* 
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Estimated Budget</label>
                    <div className="relative w-full">
                      <select name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-white/70 border border-white/80 rounded-[14px] sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 focus:bg-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[16px] sm:text-[15px] text-brand-navy shadow-sm cursor-pointer appearance-none truncate pr-10">
                        <option value="">Select a range...</option>
                        <option value="₹25k - ₹50k">₹25k - ₹50k (Focused)</option>
                        <option value="₹50k - ₹1 Lakh">₹50k - ₹1 Lakh (Mid-Size)</option>
                        <option value="₹1 Lakh+">₹1 Lakh+ (Large Scale)</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  */}

                  {/* MESSAGE */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-2">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Tell us about your event *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="3" placeholder="Estimated dates, location, guest count, or ideas..." className="w-full bg-white/70 border border-white/80 rounded-[14px] sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 focus:bg-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[16px] sm:text-[15px] shadow-sm text-brand-navy placeholder-gray-400 resize-none"></textarea>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="sm:col-span-2 mt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-4 sm:py-4 px-8 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-[15px] sm:text-[16px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                      {isSubmitting ? 'Sending Request...' : 'Send Inquiry'}
                    </button>
                    {submitStatus === 'error' && (
                      <p className="text-red-500 text-[12px] sm:text-[13px] text-center font-medium mt-3 bg-red-50 p-2 rounded-lg border border-red-100">Something went wrong. Please check your connection and try again.</p>
                    )}
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactView;