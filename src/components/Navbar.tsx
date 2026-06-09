'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const router = useRouter();

  // Initialize dark mode from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('website-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(initialDarkMode);
    
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Toggle dark/light mode for WHOLE website
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
      localStorage.setItem('website-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('website-theme', 'light');
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    const ayahPattern = /^(\d+):(\d+)$/;
    const ayahMatch = query.match(ayahPattern);
    
    if (ayahMatch) {
      const surahNum = parseInt(ayahMatch[1]);
      const ayahNum = parseInt(ayahMatch[2]);
      router.push(`/surah/${surahNum}#ayah-${ayahNum}`);
      setSearchInput('');
      return;
    }

    router.push(`/surah?search=${encodeURIComponent(query)}`);
    setSearchInput('');
  };

  return (
    <nav className={`w-full px-6 py-3 transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
    } shadow-md border-b ${
      isDarkMode ? 'border-gray-700' : 'border-green-100'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo and Website Name - LEFT SIDE */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
            <img 
              src="/LOGO.png" 
              alt="Quran Talawat Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="text-2xl font-black tracking-wide whitespace-nowrap" style={{
            fontFamily: "'Comic Neue', 'Poppins', 'Pacifico', 'Baloo 2', cursive",
            textShadow: isDarkMode ? 'none' : '2px 2px 4px rgba(0,0,0,0.1)',
            background: isDarkMode ? 'none' : 'linear-gradient(135deg, #15803d, #166534)',
            WebkitBackgroundClip: isDarkMode ? 'none' : 'text',
            WebkitTextFillColor: isDarkMode ? 'white' : 'transparent',
            color: isDarkMode ? 'white' : 'transparent'
          }}>
            Quran Talawat
          </h1>
        </div>

        {/* Empty space that pushes search bar to right */}
        <div className="flex-1"></div>

        {/* Search Bar - RIGHT SIDE */}
        <form onSubmit={handleSearch} className="max-w-md w-full">
          <div className={`relative transition-all duration-300 ${
            isSearchFocused ? 'scale-105' : 'scale-100'
          }`}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="🔍 Search: 'Rahman', '2:255', or any word..."
              className={`w-full px-5 py-2.5 rounded-full border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/30' 
                  : 'bg-green-50 border-green-200 text-gray-800 placeholder-gray-500 focus:border-green-500 focus:ring-green-500/30'
              }`}
            />
            
            {/* Search hint tooltip */}
            {isSearchFocused && (
              <div className={`absolute top-full right-0 mt-2 p-2 rounded-lg text-xs shadow-lg z-10 whitespace-nowrap ${
                isDarkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-600 border border-green-200'
              }`}>
                💡 Surah name → Open Surah | 2:255 → Jump to Ayah | Any word → Search all
              </div>
            )}
          </div>
        </form>

        {/* Dark/Light Mode Toggle - FAR RIGHT */}
        <button
          onClick={toggleDarkMode}
          className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0 ${
            isDarkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;