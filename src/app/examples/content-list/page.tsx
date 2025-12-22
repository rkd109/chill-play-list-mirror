'use client';

import { useEffect, useState } from 'react';
import { ContentList } from '@/components/content';
import type { ContentItem } from '@/types/content';
import { fetchContentList } from '@/utils/api/content';

export default function ContentListExample() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchContentList();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        console.error('Failed to fetch content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleItemClick = (item: ContentItem) => {
    console.log('클릭된 아이템:', item);
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
          <ContentList
            items={items}
            onItemClick={handleItemClick}
            emptyMessage="아직 콘텐츠가 없습니다."
          />
        )}
      </div>
    </div>
  );
}

