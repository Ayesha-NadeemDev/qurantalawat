'use client';

import React, { Suspense } from 'react';
import Surah from '@/components/Surah';
import SurahPageContent from './surah-content';

export default function SurahPage() {
  const SurahComponent = Surah as React.ComponentType<any>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Suspense fallback={<div>Loading...</div>}>
        <SurahPageContent />
      </Suspense>
    </div>
  );
}