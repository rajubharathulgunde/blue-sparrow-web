import React from 'react';

const events = [
  {
    id: 1,
    title: "Corporate Events",
    description: "Round Paper Lanterns & Desk Planters.",
    img: "/assets/corporate-lanterns.jpg", // From Corporate PDF
    hoverColor: "hover:bg-brand-mint"
  },
  {
    id: 2,
    title: "Kids Birthday Themes",
    description: "Superhero Academy & Frozen Princess.",
    img: "/assets/frozen-party.jpg", // From Birthday PDF
    hoverColor: "hover:bg-brand-pink"
  },
  {
    id: 3,
    title: "Immersive Carnivals",
    description: "Alien Invasion & The Candy Factory.",
    img: "/assets/candy-factory.jpg", // From Carnival PDF
    hoverColor: "hover:bg-brand-blue"
  }
];

const EventSlider = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-4xl font-extrabold text-brand-navy mb-12 text-center">
          Explore Our Worlds
        </h2>
        
        {/* Horizontal Scroll Slider */}
        <div className="flex overflow-x-auto pb-10 space-x-8 snap-x snap-mandatory hide-scrollbar">
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`flex-none w-80 md:w-96 rounded-3xl bg-gray-50 border border-gray-100 shadow-crisp snap-center overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:-translate-y-3 hover:shadow-crisp-hover ${event.hoverColor} group`}
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src={event.img} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brand-navy mb-2">{event.title}</h3>
                <p className="text-gray-600 font-medium">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSlider;