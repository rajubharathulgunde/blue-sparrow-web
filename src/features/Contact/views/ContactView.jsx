import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import { supabase } from '../../../lib/supabase'; // Make sure this path is correct

const ContactView = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '', 
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
            message: formData.message,
            status: 'NEW'
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', eventType: '', message: '' }); 
    } catch (error) {
      console.error('Error submitting lead:', error.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-brand-pink selection:text-brand-navy">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 lg:px-12 bg-gradient-to-b from-[#eef2ff] via-white to-white flex-grow">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#4f46e5] font-bold tracking-widest uppercase text-sm mb-4 block">Get In Touch</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-navy mb-6">
              Let's Plan Your <br/> Next <span className="text-pink-400 font-script font-normal transform -rotate-2 inline-block">Magic</span> Moment.
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Whether you have a clear vision or just a spark of an idea, we're here to bring it to life. Fill out the form below and our event experts will be in touch!
            </p>
          </div>

          {/* Contact Layout */}
          <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-[40px] shadow-floating border border-gray-50 p-8 lg:p-12">
            
            {/* Left: Contact Info */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-6">Contact Information</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
                  We'd love to hear from you! Reach out directly using the details below or use our quick inquiry form.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <span className="block text-[13px] text-gray-400 font-bold tracking-wider uppercase mb-1">Email Us</span>
                    <a href="mailto:hello@bluesparrowevents.com" className="text-brand-navy font-medium hover:text-blue-600 transition-colors">hello@bluesparrowevents.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <span className="block text-[13px] text-gray-400 font-bold tracking-wider uppercase mb-1">Call Us</span>
                    <a href="tel:+919619780981" className="text-brand-navy font-medium hover:text-pink-500 transition-colors">+91 96197 80981</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <span className="block text-[13px] text-gray-400 font-bold tracking-wider uppercase mb-1">Visit Us</span>
                    <span className="text-brand-navy font-medium">Mumbai, Maharashtra, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The Form */}
            <div className="w-full lg:w-2/3 bg-gray-50/50 rounded-[32px] p-8 border border-gray-100 flex flex-col justify-center">
              {submitStatus === 'success' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <span className="text-5xl mb-4 block">🎉</span>
                  <h4 className="text-2xl font-serif font-bold text-brand-navy mb-2">Inquiry Sent Successfully!</h4>
                  <p className="text-gray-500 mb-6">Thank you for reaching out. Our team will review your details and contact you shortly.</p>
                  <button onClick={() => setSubmitStatus(null)} className="text-[#4f46e5] font-bold text-[15px] hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-brand-navy tracking-wide">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[15px]" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-brand-navy tracking-wide">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[15px]" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-brand-navy tracking-wide">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[15px]" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-brand-navy tracking-wide">Event Type *</label>
                    <select name="eventType" value={formData.eventType} onChange={handleChange} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[15px] text-gray-500 cursor-pointer">
                      <option value="" disabled>Select an experience...</option>
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Corporate Family Days">Corporate Family Days</option>
                      <option value="Family Discovery">Family Discovery</option>
                      <option value="Malls and Brands Activities">Malls & Brands Activities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[13px] font-bold text-brand-navy tracking-wide">Tell us about your event *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" placeholder="Estimated dates, guest count, location, or any specific ideas you have in mind!" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all text-[15px] resize-none"></textarea>
                  </div>

                  <div className="md:col-span-2 mt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-4 px-8 rounded-xl shadow-soft hover:shadow-soft-hover transform hover:-translate-y-0.5 transition-all duration-300 text-[15px] disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                    {submitStatus === 'error' && (
                      <p className="text-red-500 text-sm text-center font-medium mt-3">Something went wrong. Please check your connection and try again.</p>
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