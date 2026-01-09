'use client';

import { useState } from 'react';
import VideoForm from '@/components/video/VideoForm';
import type { Video } from '@/types/video';

/**
 * Video Form 사용 예시 페이지
 */
export default function VideoFormExamplePage() {
  const [savedVideo, setSavedVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (video: Video) => {
    setSavedVideo(video);
    setError(null);
    console.log('Video saved:', video);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSavedVideo(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Video 등록
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          클라이언트에서 직접 Firestore에 저장합니다.
        </p>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6">
          <VideoForm onSuccess={handleSuccess} onError={handleError} />
        </div>

        {savedVideo && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              저장 성공!
            </h2>
            <pre className="text-sm text-green-700 dark:text-green-300 overflow-auto">
              {JSON.stringify(savedVideo, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}


