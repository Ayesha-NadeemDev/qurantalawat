'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AudioPlayerProps {
  surahId: number;
  ayahNumber?: number;
  reciter?: string;
  onClose?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  surahId, 
  ayahNumber, 
  reciter = 'ar.alafasy',
  onClose 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Construct audio URL - using the correct format
    let url = '';
    if (ayahNumber) {
      // For single ayah - need to get global ayah number
      url = `https://cdn.islamic.network/quran/audio/128/${reciter}/${getGlobalAyahNumber(surahId, ayahNumber)}.mp3`;
    } else {
      // For full surah - play first ayah
      url = `https://cdn.islamic.network/quran/audio/128/${reciter}/${getGlobalAyahNumber(surahId, 1)}.mp3`;
    }
    setAudioUrl(url);
    setLoading(false);
  }, [surahId, ayahNumber, reciter]);

  // Helper function to get global ayah number
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

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        // Auto-play next ayah if playing full surah and not on last ayah
        if (!ayahNumber && surahId) {
          // Could implement next ayah logic here
        }
      };
      const handleError = () => {
        setError('Failed to load audio. Please try again.');
        setIsPlaying(false);
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audioRef.current, ayahNumber, surahId]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
          setError(null);
        }
      } catch (err) {
        console.error('Playback failed:', err);
        setError('Playback failed. The audio might not be available.');
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-green-600 to-emerald-700 text-white p-4 shadow-lg z-50">
        <div className="text-center">Loading audio...</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-green-600 to-emerald-700 text-white p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-white hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        )}
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Info */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xl">🎧</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                Surah {surahId} {ayahNumber ? `- Ayah ${ayahNumber}` : ''}
              </p>
              <p className="text-xs opacity-75">Mishary Al-Afasy</p>
            </div>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white text-green-600 flex items-center justify-center hover:scale-110 transition-transform shrink-0"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Progress Bar */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 text-sm">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = parseFloat(e.target.value);
                  }
                }}
                className="flex-1 h-2 rounded-lg appearance-none bg-white/30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="text-center text-red-200 text-sm mt-2">
            {error}
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
    </div>
  );
};

export default AudioPlayer;