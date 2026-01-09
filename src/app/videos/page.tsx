'use client';

import { useEffect, useState } from 'react';
import { VideoList } from '@/components/content';
import { useVideos } from '@/hooks/useVideos';
import type { Video } from '@/types/video';

/**
 * Video 리스트 페이지
 */
export default function VideosPage() {
  const { fetchVideos, loading, error } = useVideos();
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchVideos({
          orderBy: 'curatedAt',
          orderDirection: 'desc',
        });
        setVideos(data);
      } catch (err) {
        console.error('Failed to load videos:', err);
      }
    };

    loadVideos();
  }, [fetchVideos]);

  const handleItemClick = (video: Video) => {
    console.log('클릭된 비디오:', video);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Chill PlaylistPlus
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          편하게 즐길 수 있는 영상·글 기반 큐레이션
        </p>

        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="text-zinc-600 dark:text-zinc-400">로딩 중...</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <VideoList
            videos={videos}
            onItemClick={handleItemClick}
            emptyMessage="아직 비디오가 없습니다."
          />
        )}
      </div>
    </div>
  );
}


