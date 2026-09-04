import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';

// ================= CUSTOM CSS ICONS FOR STATS =================
const CssIcon = ({ type }) => {
  switch(type) {
    case 'kids':
      return (
        <div className="flex gap-1 justify-center items-end h-full pb-2">
          <div className="w-4 h-6 bg-current rounded-full"><div className="w-3 h-3 bg-white rounded-full mx-auto mt-1"></div></div>
          <div className="w-5 h-8 bg-current rounded-full"><div className="w-4 h-4 bg-white rounded-full mx-auto mt-1"></div></div>
        </div>
      );
    case 'schools':
      return (
        <div className="w-8 h-8 border-4 border-current rounded-sm relative mt-2">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[12px] border-transparent border-b-current"></div>
          <div className="w-2 h-4 bg-current mx-auto mt-3"></div>
        </div>
      );
    case 'events':
      return (
        <div className="w-8 h-8 border-4 border-current rounded-md relative mt-2 flex flex-col justify-end p-1">
          <div className="absolute -top-2 left-1 w-2 h-3 bg-current rounded-full"></div>
          <div className="absolute -top-2 right-1 w-2 h-3 bg-current rounded-full"></div>
          <div className="w-full h-4 bg-current"></div>
        </div>
      );
    case 'workshops':
      return (
        <div className="w-8 h-8 border-4 border-current rounded-full relative mt-1 flex items-center justify-center">
          <div className="w-4 h-4 bg-current rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
        </div>
      );
    case 'carnivals':
      return (
        <div className="relative w-8 h-8 border-4 border-current rounded-full flex items-center justify-center animate-[spin_6s_linear_infinite] mt-1">
          <div className="absolute w-full h-0.5 bg-current"></div>
          <div className="absolute w-0.5 h-full bg-current"></div>
          <div className="absolute w-full h-0.5 bg-current rotate-45"></div>
          <div className="absolute w-0.5 h-full bg-current rotate-45"></div>
        </div>
      );
    case 'cities':
      return (
        <div className="w-6 h-6 border-4 border-current rounded-full rounded-br-none transform -rotate-45 relative mt-2">
           <div className="w-2 h-2 bg-current rounded-full absolute top-1 left-1"></div>
        </div>
      );
    case 'teachers':
      return (
        <div className="w-8 h-6 border-4 border-current rounded-sm relative mt-3 flex items-center justify-center">
           <div className="absolute -top-3 left-2 w-3 h-3 bg-current rounded-full"></div>
           <div className="w-4 h-1 bg-current"></div>
        </div>
      );
    case 'labs':
      return (
        <div className="w-6 h-8 border-4 border-t-0 border-current rounded-b-xl relative mt-2">
           <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-current"></div>
           <div className="absolute bottom-1 left-1 w-3 h-3 bg-current rounded-full"></div>
        </div>
      );
    default: return <div className="w-6 h-6 bg-current rounded-full"></div>;
  }
};

const AboutView = () => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = [
    { id: 1, src: "/assets/dummy-gallery-1.jpg", tag: "Kids Parties" },
    { id: 2, src: "/assets/dummy-gallery-2.jpg", tag: "Corporate" },
    { id: 3, src: "/assets/dummy-gallery-3.jpg", tag: "Carnivals" },
    { id: 4, src: "/assets/dummy-gallery-4.jpg", tag: "Family Day" },
    { id: 5, src: "/assets/dummy-gallery-5.jpg", tag: "Workshops" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000); 
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  return (
    <div className="font-sans text-gray-600 bg-white min-h-screen flex flex-col selection:bg-pink-100 selection:text-brand-navy overflow-hidden">
      <Navbar />
      
      {/* ================= HERO & CORE VALUES ================= */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 bg-gradient-to-br from-[#fff6ef] via-[#f0f9ff] to-[#fce7f3]">
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-navy mb-8 tracking-tight">
            About Blue Sparrow
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-soft">
              <h3 className="font-bold text-pink-500 mb-2 uppercase tracking-widest text-sm">Our Vision</h3>
              <p className="text-brand-navy font-serif text-xl font-bold">No. 1 Kids Edutainer</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-soft">
              <h3 className="font-bold text-blue-500 mb-2 uppercase tracking-widest text-sm">Our Mission</h3>
              <p className="text-gray-600 text-sm font-medium">To be the no. 1 events company for parents and corporates when they buy edutainment services for their kids.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-soft">
              <h3 className="font-bold text-emerald-500 mb-2 uppercase tracking-widest text-sm">Value Prop</h3>
              <p className="text-gray-600 text-sm font-medium">Delivering meaningful events while making science & art fun for 3 to 11 yr old urban kids.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALIDATION & ROADMAP ================= */}
      <section className="py-24 bg-[#f4f9ff] relative border-y border-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-navy mb-4">Validation from Market</h2>
            <p className="text-gray-500">Our footprint of spreading joy across the nation.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {[
              { icon: 'kids', value: '45,000+', label: 'Kids', color: 'text-pink-500' },
              { icon: 'schools', value: '33+', label: 'Schools & Preschools', color: 'text-blue-500' },
              { icon: 'events', value: '350+', label: 'Events', color: 'text-amber-500' },
              { icon: 'workshops', value: '150', label: 'Unique Workshops', color: 'text-emerald-500' },
              { icon: 'carnivals', value: '24', label: 'Carnivals', color: 'text-purple-500' },
              { icon: 'cities', value: '16', label: 'Cities Presence', color: 'text-rose-500' },
              { icon: 'teachers', value: '150+', label: 'Teachers Trained', color: 'text-cyan-500' },
              { icon: 'labs', value: '25', label: 'Interactive Science Labs', color: 'text-indigo-500' }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 ${stat.color}`}>
                  <CssIcon type={stat.icon} />
                </div>
                <h4 className="text-2xl font-bold text-brand-navy">{stat.value}</h4>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Winding CSS Roadmap */}
          <div className="relative max-w-4xl mx-auto py-10">
             {/* Dashed SVG Path Background */}
             <svg className="absolute inset-0 w-full h-full text-blue-200" preserveAspectRatio="none" viewBox="0 0 1000 200">
               <path d="M 50,100 C 200,200 400,0 600,100 S 800,200 950,100" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10"/>
             </svg>
             
             {/* Milestones */}
             <div className="relative z-10 flex justify-between items-center h-[200px]">
               <div className="text-center transform -translate-y-8">
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-pink-400 mx-auto flex items-center justify-center shadow-lg mb-2"><span className="w-4 h-4 bg-pink-400 rounded-full"></span></div>
                 <h5 className="font-bold text-brand-navy">2015</h5>
                 <p className="text-xs text-gray-500 max-w-[120px] mx-auto">Bringing science parties to vogue</p>
               </div>
               <div className="text-center transform translate-y-12">
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-blue-400 mx-auto flex items-center justify-center shadow-lg mb-2"><span className="w-4 h-4 bg-blue-400 rounded-full"></span></div>
                 <h5 className="font-bold text-brand-navy">2016</h5>
                 <p className="text-xs text-gray-500 max-w-[120px] mx-auto">Workshop started</p>
               </div>
               <div className="text-center transform -translate-y-12">
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-amber-400 mx-auto flex items-center justify-center shadow-lg mb-2"><span className="w-4 h-4 bg-amber-400 rounded-full"></span></div>
                 <h5 className="font-bold text-brand-navy">2018</h5>
                 <p className="text-xs text-gray-500 max-w-[120px] mx-auto">First franchise in Pune</p>
               </div>
               <div className="text-center transform translate-y-8">
                 <div className="w-12 h-12 bg-white rounded-full border-4 border-emerald-400 mx-auto flex items-center justify-center shadow-lg mb-2"><span className="w-4 h-4 bg-emerald-400 rounded-full"></span></div>
                 <h5 className="font-bold text-brand-navy">2019</h5>
                 <p className="text-xs text-gray-500 max-w-[120px] mx-auto">Jio Wonderland. No. 1 choice for kids events</p>
               </div>
             </div>
          </div>

        </div>
      </section>

      {/* ================= THE BLUESPARROW PHILOSOPHY ================= */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-4xl font-serif font-bold text-brand-navy mb-8">Our Philosophy</h2>
            
            <div className="mb-6">
              <h4 className="text-lg font-bold text-pink-500 mb-2">Target Group</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Retail spaces for families like malls, stores, realtors, offices.</li>
                <li>Affluent Urban mothers of 3-11yr olds from Urban HNI families.</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold text-blue-500 mb-2">The Need</h4>
              <p className="text-gray-600">For rearing atma nirbhar kids, society needs GREEN Event planners, edutainers who inspire fascination for Science and arts in an ultra experiential fun design.</p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold text-emerald-500 mb-2">Point of Difference</h4>
              <p className="text-gray-600">Blue Sparrow creates activity-first, learning-led experiences highly engaging for children and commercially valuable for brands. Our strength lies in turning STEM, art, play, and storytelling into scalable, premium formats that are execution-ready.</p>
            </div>
          </div>

          {/* Problem & Solution Callout Box */}
          <div className="bg-brand-navy text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 rounded-full blur-[50px] opacity-50"></div>
            
            <h3 className="text-2xl font-serif font-bold text-pink-400 mb-4">The Problem</h3>
            <p className="text-blue-100 text-sm mb-6 pb-6 border-b border-white/20">
              Planning green kids' edutainment requires expert child psychology knowledge and hands-on experience, making it time-consuming and expensive. For retail spaces, it's hard to attract footfall, and for parents, it's painstaking to identify vendors in a fast-paced lifestyle.
            </p>

            <h3 className="text-2xl font-serif font-bold text-emerald-400 mb-4">Our Solution</h3>
            <p className="text-blue-100 text-sm">
              Combining education with entertainment by organizing science and arts activities to disseminate knowledge in a fun-filled manner. We also build trust by undertaking CSR education projects for corporates.
            </p>
          </div>

        </div>
      </section>

      {/* ================= WHY HIRE US ================= */}
      <section className="py-20 bg-[#fff9f9] relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-serif font-bold text-brand-navy mb-12">Why Hire Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-50 hover:-translate-y-2 transition-transform">
              <span className="text-5xl font-serif text-pink-200 block mb-4">01</span>
              <p className="text-brand-navy font-bold">Because you don't want to choose from a set catalogue; you want us to customise as per your audience and specific event goals.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-50 hover:-translate-y-2 transition-transform">
              <span className="text-5xl font-serif text-blue-200 block mb-4">02</span>
              <p className="text-brand-navy font-bold">Cause you don't want your weeks and months of hard work put in the event to be forgotten in 2 days!</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-50 hover:-translate-y-2 transition-transform">
              <span className="text-5xl font-serif text-emerald-200 block mb-4">03</span>
              <p className="text-brand-navy font-bold">Unique Innovative approach, a distinctive blend of science, play, and arts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEET THE TEAM ================= */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-serif font-bold text-brand-navy mb-16">Meet The Founder</h2>
          
          <div className="flex flex-col items-center group cursor-pointer w-full max-w-sm mx-auto">
            <motion.div 
              animate={{ borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-56 h-56 md:w-64 md:h-64 bg-gradient-to-tr from-pink-300 to-amber-200 p-1 mb-6 shadow-soft group-hover:shadow-floating transition-all duration-500"
            >
              <div className="w-full h-full bg-white rounded-inherit overflow-hidden">
                <img src="/assets/team-sanskriti.jpg" alt="Sanskriti Singh" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => { e.target.style.display='none'; e.target.parentElement.classList.add('bg-gradient-to-br', 'from-pink-100', 'to-pink-50'); }} 
                />
              </div>
            </motion.div>
            <h3 className="text-3xl font-serif font-bold text-brand-navy group-hover:text-pink-500 transition-colors mb-2">Sanskriti Singh</h3>
            <p className="text-pink-500 font-bold text-sm tracking-wider uppercase mb-4">Founder</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">MA in Economics</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">IIM B 10k Women</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">IIM-K School Leadership</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">15yrs exp in Kids Edutainment</span>
            </div>
            <p className="text-gray-500 mt-4 max-w-md">On a mission to bring alternative teaching methods to masses through meaningful events.</p>
          </div>

        </div>
      </section>

      {/* ================= MACOS STYLE INFINITE IMAGE SLIDER ================= */}
      <section className="py-20 bg-[#f4f9ff] relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-2">Our World in Color</h2>
          <p className="text-gray-500 text-[15px]">A sneak peek into the beautiful events we've brought to life.</p>
        </div>

        <div className="relative w-full h-[400px] flex justify-center items-center">
          {galleryImages.map((img, index) => {
            let offset = index - currentIndex;
            if (offset < -2) offset += galleryImages.length;
            if (offset > 2) offset -= galleryImages.length;

            const isCenter = offset === 0;
            const isAdjacent = Math.abs(offset) === 1;
            const scale = isCenter ? 1.2 : isAdjacent ? 0.8 : 0.6;
            const x = offset * 250; 
            const zIndex = 10 - Math.abs(offset);
            const opacity = Math.abs(offset) <= 2 ? (isCenter ? 1 : isAdjacent ? 0.6 : 0.2) : 0;

            return (
              <motion.div
                key={img.id}
                animate={{ x, scale, zIndex, opacity }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute w-[300px] h-[220px] md:w-[350px] md:h-[250px] rounded-3xl overflow-hidden shadow-2xl bg-white flex-shrink-0"
              >
                <img 
                  src={img.src} 
                  alt={img.tag} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-100', 'to-pink-100', 'flex', 'items-center', 'justify-center');
                    e.target.nextElementSibling.innerHTML = `<span class="text-indigo-500 font-bold uppercase tracking-widest text-xs">Image Placeholder</span>`;
                  }}
                />
                <div className="absolute inset-0 bg-brand-navy/20 flex items-end justify-center pb-6">
                  <span className="text-white font-bold tracking-widest uppercase text-xs border border-white/50 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full">
                    {img.tag}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= OUR BLOGS ================= */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-[#965a3e]">Our Blogs</h2>
            <p className="text-gray-500 mt-2">Insights, tips, and stories from the event planning world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Blog Card 1 */}
            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-floating transition-all duration-500 border border-red-50 p-4">
              <div className="w-full h-48 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center">
                <img src="/assets/blog-1.jpg" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-xs uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 1" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] mb-3 px-2">Peppa Pig Birthday Magic at Sofitel, BKC</h4>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 px-4">When it comes to making birthday experiences unforgettable, Blue Sparrow Events is well aware of how to turn dreams into reality.</p>
              <button className="border border-[#965a3e] text-[#965a3e] hover:bg-[#965a3e] hover:text-white transition-colors rounded-full px-8 py-2.5 text-sm font-semibold mt-auto mb-2">Read More</button>
            </div>

            {/* Blog Card 2 */}
            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-floating transition-all duration-500 border border-red-50 p-4">
              <div className="w-full h-48 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center">
                <img src="/assets/blog-2.jpg" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-xs uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 2" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] mb-3 px-2">DIY vs. Pro Birthday Planner</h4>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 px-4">As we plan a birthday party, one is usually met with a decision: do it yourself and sort everything out individually, or take a pro.</p>
              <button className="border border-[#965a3e] text-[#965a3e] hover:bg-[#965a3e] hover:text-white transition-colors rounded-full px-8 py-2.5 text-sm font-semibold mt-auto mb-2">Read More</button>
            </div>

            {/* Blog Card 3 */}
            <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-floating transition-all duration-500 border border-red-50 p-4">
              <div className="w-full h-48 rounded-[32px] overflow-hidden mb-6 bg-red-50 flex items-center justify-center">
                <img src="/assets/blog-3.jpg" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-red-300 font-bold text-xs uppercase tracking-widest">Image Placeholder</span>'; }} alt="Blog 3" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <h4 className="font-bold text-[#965a3e] text-[18px] mb-3 px-2">Planning a Party Around Your Child's Interests</h4>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 px-4">Want to throw a birthday bash that's as unique as your child? A party that reflects their wildest dreams, favorite heroes, and biggest passions?</p>
              <button className="border border-[#965a3e] text-[#965a3e] hover:bg-[#965a3e] hover:text-white transition-colors rounded-full px-8 py-2.5 text-sm font-semibold mt-auto mb-2">Read More</button>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutView;