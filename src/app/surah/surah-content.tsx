'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Surah from '@/components/Surah';

export default function SurahPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  const SurahComponent = Surah as React.ComponentType<any>;

  return <SurahComponent initialSearch={searchTerm} />;
}
