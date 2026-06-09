// src/lib/quranApi.ts
const BASE_URL = 'https://api.alquran.cloud/v1';

// Fetch all surahs with correct data structure
export async function fetchAllSurahs() {
  try {
    const response = await fetch(`${BASE_URL}/quran/quran-uthmani`);
    const data = await response.json();
    
    if (data.code === 200) {
      return data.data.surahs;
    }
    return [];
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

// Fetch a specific surah by ID
export async function fetchSurahById(surahId: number) {
  try {
    const response = await fetch(`${BASE_URL}/surah/${surahId}/quran-uthmani`);
    const data = await response.json();
    
    if (data.code === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching surah ${surahId}:`, error);
    return null;
  }
}