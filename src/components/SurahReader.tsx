'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSurahById } from '@/lib/quranApi';

interface SurahReaderProps {
  surahId: number;
}

const SurahReader: React.FC<SurahReaderProps> = ({ surahId }) => {
  const [surah, setSurah] = useState<any>(null);
  const [translation, setTranslation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState<boolean>(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

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

  // Load surah data and translation
  useEffect(() => {
    const loadSurahData = async () => {
      setLoading(true);
      
      const arabicData = await fetchSurahById(surahId);
      const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.asad`);
      const translationData = await translationResponse.json();
      
      if (arabicData && translationData.code === 200) {
        setSurah(arabicData);
        setTranslation(translationData.data);
      }
      
      setLoading(false);
    };
    
    loadSurahData();
  }, [surahId]);

  // Handle audio end for full surah playback
  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        if (isPlayingFullSurah && surah && currentAyahIndex < surah.ayahs.length - 1) {
          const nextIndex = currentAyahIndex + 1;
          setCurrentAyahIndex(nextIndex);
          playAyahByIndex(nextIndex);
        } else if (isPlayingFullSurah && currentAyahIndex >= (surah?.ayahs.length || 0) - 1) {
          setIsPlayingFullSurah(false);
          setPlayingAyah(null);
          setCurrentAyahIndex(0);
        }
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [isPlayingFullSurah, currentAyahIndex, surah]);

  const playAyahByIndex = (index: number) => {
    if (!surah) return;
    
    const ayahNumber = surah.ayahs[index].numberInSurah;
    const globalAyahNumber = getGlobalAyahNumber(surahId, ayahNumber);
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(err => console.error('Audio play error:', err));
      setPlayingAyah(ayahNumber);
    }
  };

  const playAyah = (ayahNumber: number) => {
    if (isPlayingFullSurah) {
      setIsPlayingFullSurah(false);
      setCurrentAyahIndex(0);
    }
    
    const globalAyahNumber = getGlobalAyahNumber(surahId, ayahNumber);
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(err => console.error('Audio play error:', err));
      setPlayingAyah(ayahNumber);
      setIsPlayingFullSurah(false);
    }
  };

  const playFullSurah = () => {
    if (!surah || surah.ayahs.length === 0) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setIsPlayingFullSurah(true);
    setCurrentAyahIndex(0);
    playAyahByIndex(0);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingAyah(null);
      setIsPlayingFullSurah(false);
      setCurrentAyahIndex(0);
    }
  };

  const getGlobalAyahNumber = (surahId: number, ayahNumber: number): number => {
    const ayahCounts: { [key: number]: number } = {
      1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129,
      10: 109, 11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111,
      18: 110, 19: 98, 20: 135, 21: 112, 22: 78, 23: 118, 24: 64, 25: 77,
      26: 227, 27: 93, 28: 88, 29: 69, 30: 60, 31: 34, 32: 30, 33: 73,
      34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85, 41: 54,
      42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18,
      50: 45, 51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29,
      58: 22, 59: 24, 60: 13, 61: 14, 62: 11, 63: 11, 64: 18, 65: 12,
      66: 12, 67: 30, 68: 52, 69: 52, 70: 44, 71: 28, 72: 28, 73: 20,
      74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42, 81: 29,
      82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30,
      90: 20, 91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5,
      98: 8, 99: 8, 100: 11, 101: 11, 102: 8, 103: 3, 104: 9, 105: 5,
      106: 4, 107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4, 113: 5, 114: 6
    };
    
    let globalNumber = 0;
    for (let i = 1; i < surahId; i++) {
      globalNumber += ayahCounts[i] || 7;
    }
    return globalNumber + ayahNumber;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!surah || !translation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Surah not found</p>
          <button 
            onClick={() => router.push('/surah')} 
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Back to Surah List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 md:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Hidden audio element */}
        <audio ref={audioRef} />

        {/* Header with Back and Audio Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/surah')}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-all ${
              isDarkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-800 hover:bg-gray-100 shadow-md'
            }`}
          >
            ← Back to List
          </button>
          
          <div className="flex gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                showTranslation
                  ? 'bg-green-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
              }`}
            >
              <span>🌐</span>
              {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </button>
            
            {!isPlayingFullSurah && !playingAyah ? (
              <button
                onClick={playFullSurah}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>🎧</span>
                Listen Full Surah
              </button>
            ) : (
              <button
                onClick={stopAudio}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>⏹️</span>
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Surah Header - REMOVED the play button */}
        <div className={`text-center mb-8 p-6 rounded-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
        }`}>
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {surah.englishName}
          </h1>
          <p className={`text-2xl font-arabic mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {surah.name}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {surah.englishNameTranslation} • {surah.revelationType} • {surah.ayahs.length} Verses
          </p>
          <p className={`text-xs mt-2 italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Translation by Muhammad Asad
          </p>
        </div>

        {/* Ayahs with Translation */}
        <div className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {surah.ayahs.map((ayah: any, index: number) => {
              const translationAyah = translation.ayahs[index];
              return (
                <div 
                  key={ayah.number} 
                  className={`p-6 transition-colors ${
                    playingAyah === ayah.numberInSurah
                      ? isDarkMode 
                        ? 'bg-green-900/30' 
                        : 'bg-green-50'
                      : ''
                  }`}
                >
                  {/* Top row with number and buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    {/* Ayah Number - Fixed border */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold border-2 ${
                        playingAyah === ayah.numberInSurah
                          ? isDarkMode 
                            ? 'border-green-400 text-green-400 bg-green-900/50'
                            : 'border-green-500 text-green-600 bg-green-50'
                          : isDarkMode 
                            ? 'border-gray-600 text-gray-400 bg-gray-800'
                            : 'border-gray-300 text-gray-600 bg-white'
                      }`}>
                        {ayah.numberInSurah}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => playAyah(ayah.numberInSurah)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                          playingAyah === ayah.numberInSurah
                            ? 'bg-green-500 text-white'
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {playingAyah === ayah.numberInSurah ? (
                          <>
                            <span>🔊</span> Playing
                          </>
                        ) : (
                          <>
                            <span>🎧</span> Listen
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ayah.text);
                          alert('Arabic text copied!');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>📋</span> Copy Arabic
                      </button>
                      
                      {showTranslation && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(translationAyah?.text || '');
                            alert('Translation copied!');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                            isDarkMode 
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span>📝</span> Copy Translation
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Arabic Text */}
                  <div className={`text-right text-2xl md:text-3xl font-arabic leading-loose mb-4 p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-900/50 text-gray-200' : 'bg-gray-50 text-gray-800'
                  }`}>
                    {ayah.text}
                  </div>
                  
                  {/* English Translation */}
                  {showTranslation && translationAyah && (
                    <div className={`mt-2 p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-900/30' : 'bg-gray-50'
                    }`}>
                      <p className={`text-base md:text-lg leading-relaxed ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {translationAyah.text}
                      </p>
                    </div>
                  )}
                  
                  {/* Page Info */}
                  <div className={`text-xs mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Page: {ayah.page} • Juz: {ayah.juz}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={() => {
              stopAudio();
              if (surah.number > 1) {
                router.push(`/surah/${surah.number - 1}`);
              }
            }}
            disabled={surah.number === 1}
            className={`px-4 py-2 rounded-lg transition-all ${
              surah.number === 1
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-gray-800 hover:bg-gray-100 shadow-md'
            }`}
          >
            ← Previous Surah
          </button>
          
          <button
            onClick={!isPlayingFullSurah && !playingAyah ? playFullSurah : stopAudio}
            className={`px-6 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
              !isPlayingFullSurah && !playingAyah
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {!isPlayingFullSurah && !playingAyah ? (
              <>
                <span>🎧</span> Listen Full Surah
              </>
            ) : (
              <>
                <span>⏹️</span> Stop Playing
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              stopAudio();
              if (surah.number < 114) {
                router.push(`/surah/${surah.number + 1}`);
              }
            }}
            disabled={surah.number === 114}
            className={`px-4 py-2 rounded-lg transition-all ${
              surah.number === 114
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-gray-800 hover:bg-gray-100 shadow-md'
            }`}
          >
            Next Surah →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurahReader;