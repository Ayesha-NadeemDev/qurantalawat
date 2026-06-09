'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAllSurahs } from '@/lib/quranApi';
import { Surah as SurahType } from '@/types/quran';

const SurahList: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahType[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<SurahType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Fetch surahs from API
  useEffect(() => {
    const loadSurahs = async () => {
      setLoading(true);
      const data = await fetchAllSurahs();
      setSurahs(data);
      setFilteredSurahs(data);
      setLoading(false);
    };
    
    loadSurahs();
  }, []);

  // Filter surahs based on search and filter
  useEffect(() => {
    let filtered = surahs;
    
    if (searchTerm) {
      filtered = filtered.filter(surah =>
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.name.includes(searchTerm) ||
        surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(surah => surah.revelationType === selectedFilter);
    }
    
    setFilteredSurahs(filtered);
  }, [searchTerm, selectedFilter, surahs]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading Holy Quran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 md:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📖 Holy Quran
        </h1>
        <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          114 Surahs • Complete Holy Quran
        </p>
      </div>
     
      {/* Search and Filter Bar */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Search Surah by name, Arabic name, or meaning..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 px-5 py-3 rounded-full border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500'
          }`}
        />
        
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className={`px-5 py-3 rounded-full border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
              : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
          }`}
        >
          <option value="all">All Surahs</option>
          <option value="Meccan">Meccan Surahs</option>
          <option value="Medinan">Medinan Surahs</option>
        </select>
      </div>

      {/* Surah Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredSurahs.map((surah) => (
            <Link href={`/surah/${surah.number}`} key={surah.number}>
              <div
                className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                    : 'bg-white hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 border border-gray-200 shadow-md'
                }`}
              >
                {/* Surah Number */}
                <div className="flex justify-start mb-3">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                    isDarkMode
                      ? 'bg-green-600 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {surah.number}
                  </div>
                </div>
                
                {/* Surah Name */}
                <h3 className={`text-xl font-bold mb-1 transition-colors duration-200 ${
                  isDarkMode
                    ? 'text-white group-hover:text-green-400'
                    : 'text-gray-800 group-hover:text-green-600'
                }`}>
                  {surah.englishName}
                </h3>
                
                {/* Arabic Name */}
                <p className={`text-right text-2xl font-arabic mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {surah.name}
                </p>
                
                {/* Translation */}
                <p className={`text-sm mb-2 line-clamp-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {surah.englishNameTranslation}
                </p>
                
                {/* Verses & Revelation Type */}
                <div className={`flex justify-between items-center mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    surah.revelationType === 'Meccan'
                      ? isDarkMode
                        ? 'bg-purple-900 text-purple-300'
                        : 'bg-purple-100 text-purple-700'
                      : isDarkMode
                        ? 'bg-blue-900 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                  }`}>
                    {surah.revelationType}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {surah.ayahs.length} verses
                  </span>
                </div>
                
                {/* Read Button on Hover */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}>
                    📖 Read Surah
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Results Count */}
        <div className={`text-center mt-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredSurahs.length} of {surahs.length} Surahs
        </div>
      </div>
    </div>
  );
};

export default SurahList;