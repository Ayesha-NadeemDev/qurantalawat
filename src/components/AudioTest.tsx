'use client';

import React, { useRef, useState } from 'react';

const AudioTest = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const testAudio = () => {
    // Test with Surah Al-Fatiha first ayah
    const testUrl = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3';
    
    if (audioRef.current) {
      audioRef.current.src = testUrl;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          console.log('Audio playing successfully');
        })
        .catch(err => {
          console.error('Audio error:', err);
          alert(`Audio error: ${err.message}`);
        });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-8">
      <h3 className="text-lg font-bold mb-4 dark:text-white">Audio Test</h3>
      <div className="flex gap-3">
        <button 
          onClick={testAudio}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          🎧 Test Audio
        </button>
        {isPlaying && (
          <button 
            onClick={stopAudio}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ⏹️ Stop
          </button>
        )}
      </div>
      <audio ref={audioRef} className="hidden" />
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        This test plays Surah Al-Fatiha, Ayah 1
      </p>
    </div>
  );
};

export default AudioTest;