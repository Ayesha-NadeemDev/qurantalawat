'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const whiteOverlayOpacity = 20;
  const router = useRouter(); // Add this
  
  const handleReciteClick = () => {
    router.push('/surah'); // Navigate to the surah page
  };
  
  return (
    <div className="relative w-full h-125 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.png')",
        }}
      />

      {/* White Transparent Sheet */}
      <div 
        className="absolute inset-0 backdrop-blur-sm flex items-center justify-center"
        style={{ backgroundColor: `rgba(255, 255, 255, ${whiteOverlayOpacity / 100})` }}
      >
        
        {/* Content */}
        <div className="text-center px-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to Quran Talawat
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Experience the beauty of Quran recitation
          </p>
          
          <button 
            onClick={handleReciteClick} // Add this
            className="px-8 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-full hover:scale-105 transition-all"
          >
            🎧 Recite Quran
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;