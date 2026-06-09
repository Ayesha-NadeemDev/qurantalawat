// src/app/surah/[id]/page.tsx
import SurahReader from '@/components/SurahReader';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  const surahId = parseInt(id);
  
  // Validate surah ID
  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Invalid Surah Number
          </h1>
          <a 
            href="/surah"
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Back to Surah List
          </a>
        </div>
      </div>
    );
  }
  
  return <SurahReader surahId={surahId} />;
}