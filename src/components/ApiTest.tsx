'use client';

import React, { useState } from 'react';

const ApiTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
      const data = await response.json();
      setResult(data);
      console.log('API Response:', data);
    } catch (error) {
      console.error('API Error:', error);
      setResult({ error: String(error) });
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={testApi}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Test API
      </button>
      {loading && <p>Loading...</p>}
      {result && (
        <pre className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-96">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ApiTest;