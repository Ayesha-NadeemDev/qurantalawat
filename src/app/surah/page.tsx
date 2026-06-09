'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Surah from '@/components/Surah';

export default function SurahPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  const SurahComponent = Surah as React.ComponentType<any>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SurahComponent initialSearch={searchTerm} />
    </div>
  );
}