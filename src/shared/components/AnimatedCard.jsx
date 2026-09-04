import React from 'react';

const AnimatedCard = ({ title, description, hoverColorClass, children }) => {
  return (
    <div 
      className={`relative p-8 bg-white rounded-3xl shadow-apple transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-apple-hover ${hoverColorClass} overflow-hidden cursor-pointer flex flex-col justify-between h-full`}
    >
        <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
            {children}
        </div>
    </div>
  );
};

export default AnimatedCard;