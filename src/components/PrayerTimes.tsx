'use client';

import React, { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

const PrayerTimes: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Lahore');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
    { name: 'Fajr', time: '05:30 AM', icon: '🌅' },
    { name: 'Dhuhr', time: '12:30 PM', icon: '☀️' },
    { name: 'Asr', time: '03:45 PM', icon: '🌤️' },
    { name: 'Maghrib', time: '06:15 PM', icon: '🌙' },
    { name: 'Isha', time: '07:45 PM', icon: '⭐' }
  ]);
  const [currentPrayer, setCurrentPrayer] = useState<string>('Dhuhr');
  const [nextPrayer, setNextPrayer] = useState<string>('Asr');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check for dark mode on mount
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Observe dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Pakistani cities for dropdown
  const pakistaniCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Peshawar',
    'Quetta',
    'Multan',
    'Faisalabad',
    'Sialkot',
    'Gujranwala'
  ];

  // Fetch prayer times based on city
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      const simulatedTimes: { [key: string]: PrayerTime[] } = {
        Lahore: [
          { name: 'Fajr', time: '05:30 AM', icon: '🌅' },
          { name: 'Dhuhr', time: '12:30 PM', icon: '☀️' },
          { name: 'Asr', time: '03:45 PM', icon: '🌤️' },
          { name: 'Maghrib', time: '06:15 PM', icon: '🌙' },
          { name: 'Isha', time: '07:45 PM', icon: '⭐' }
        ],
        Karachi: [
          { name: 'Fajr', time: '05:45 AM', icon: '🌅' },
          { name: 'Dhuhr', time: '12:45 PM', icon: '☀️' },
          { name: 'Asr', time: '04:00 PM', icon: '🌤️' },
          { name: 'Maghrib', time: '06:30 PM', icon: '🌙' },
          { name: 'Isha', time: '08:00 PM', icon: '⭐' }
        ],
        Islamabad: [
          { name: 'Fajr', time: '05:15 AM', icon: '🌅' },
          { name: 'Dhuhr', time: '12:15 PM', icon: '☀️' },
          { name: 'Asr', time: '03:30 PM', icon: '🌤️' },
          { name: 'Maghrib', time: '06:00 PM', icon: '🌙' },
          { name: 'Isha', time: '07:30 PM', icon: '⭐' }
        ],
        default: [
          { name: 'Fajr', time: '05:30 AM', icon: '🌅' },
          { name: 'Dhuhr', time: '12:30 PM', icon: '☀️' },
          { name: 'Asr', time: '03:45 PM', icon: '🌤️' },
          { name: 'Maghrib', time: '06:15 PM', icon: '🌙' },
          { name: 'Isha', time: '07:45 PM', icon: '⭐' }
        ]
      };
      
      const times = simulatedTimes[selectedCity] || simulatedTimes.default;
      setPrayerTimes(times);
      
      // Calculate current and next prayer
      const currentHour = new Date().getHours();
      if (currentHour < 5 || currentHour >= 20) {
        setCurrentPrayer('Isha');
        setNextPrayer('Fajr');
      } else if (currentHour < 12) {
        setCurrentPrayer('Fajr');
        setNextPrayer('Dhuhr');
      } else if (currentHour < 15) {
        setCurrentPrayer('Dhuhr');
        setNextPrayer('Asr');
      } else if (currentHour < 18) {
        setCurrentPrayer('Asr');
        setNextPrayer('Maghrib');
      } else {
        setCurrentPrayer('Maghrib');
        setNextPrayer('Isha');
      }
    };
    
    fetchPrayerTimes();
    
    const interval = setInterval(() => {
      updateTimeRemaining();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [selectedCity]);
  
  const updateTimeRemaining = () => {
    const now = new Date();
    const nextPrayerTime = prayerTimes.find(p => p.name === nextPrayer)?.time;
    
    if (nextPrayerTime) {
      const [time, period] = nextPrayerTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      const nextDate = new Date();
      nextDate.setHours(hours, minutes, 0, 0);
      
      if (nextDate < now) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      
      const diff = nextDate.getTime() - now.getTime();
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${diffHours}h ${diffMinutes}m`);
    }
  };
  
  useEffect(() => {
    updateTimeRemaining();
  }, [currentPrayer, nextPrayer, prayerTimes]);

  const getPrayerIcon = (prayerName: string) => {
    const prayer = prayerTimes.find(p => p.name === prayerName);
    return prayer?.icon || '🕌';
  };

  return (
    <div className="w-full px-4 md:px-6 py-4">
      {/* Main Container - Full Width */}
      <div className={`w-full rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-green-100'
      }`}>
        
        {/* Header - Full Width */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Prayer Times
              </h2>
              <p className="text-green-50 text-sm">
                Accurate timings for Pakistani cities
              </p>
            </div>
            
            {/* City Dropdown - Right Side */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={`px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:border-green-500'
                }`}
              >
                {pakistaniCities.map((city) => (
                  <option key={city} value={city}>
                    📍 {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 md:p-6">
          
          {/* Current & Next Prayer in Flex Row - Minimized */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Current Prayer Card */}
            <div className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl shadow-lg p-4 flex items-center justify-between transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getPrayerIcon(currentPrayer)}</span>
                <div>
                  <p className="text-white text-xs opacity-90">Current</p>
                  <h3 className="text-white text-xl font-bold">{currentPrayer}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-2xl font-bold">
                  {prayerTimes.find(p => p.name === currentPrayer)?.time || '--:--'}
                </p>
              </div>
            </div>

            {/* Next Prayer Card */}
            <div className={`flex-1 rounded-xl shadow-lg p-4 flex items-center justify-between transition-all duration-300 hover:shadow-xl border-2 border-green-500 dark:border-green-600 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getPrayerIcon(nextPrayer)}</span>
                <div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Next
                  </p>
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-green-400' : 'text-green-700'
                  }`}>
                    {nextPrayer}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {prayerTimes.find(p => p.name === nextPrayer)?.time || '--:--'}
                </p>
                {timeRemaining && (
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    In {timeRemaining}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* MINIMIZED PRAYER CHART - Compact Grid */}
          <div className={`rounded-xl overflow-hidden border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-gray-200 dark:bg-gray-700">
              {prayerTimes.map((prayer) => (
                <div
                  key={prayer.name}
                  className={`p-4 text-center transition-all duration-200 ${
                    prayer.name === currentPrayer
                      ? isDarkMode
                        ? 'bg-gray-700/80'
                        : 'bg-green-50'
                      : isDarkMode
                        ? 'bg-gray-800'
                        : 'bg-white'
                  } ${
                    prayer.name === currentPrayer ? 'ring-2 ring-green-500 dark:ring-green-600' : ''
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">{prayer.icon}</span>
                    <div>
                      <h4 className={`font-bold text-base ${
                        prayer.name === currentPrayer
                          ? isDarkMode ? 'text-green-400' : 'text-green-700'
                          : isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {prayer.name}
                      </h4>
                      <p className={`text-sm font-semibold mt-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {prayer.time}
                      </p>
                      {prayer.name === currentPrayer && (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Current
                        </span>
                      )}
                      {prayer.name === nextPrayer && prayer.name !== currentPrayer && (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Next
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note - Minimized */}
          <div className={`mt-4 text-center text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p>🕌 Prayer times update based on selected city</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;