'use client';

import { ContentList } from '@/components/content';
import type { ContentItem } from '@/types/content';

// 예시 데이터
const exampleContent: ContentItem[] = [
  {
    id: '1',
    title: 'Next.js 14 완전 정리',
    description:
      'Next.js 14의 새로운 기능들과 App Router에 대해 자세히 알아봅니다. 서버 컴포넌트, 클라이언트 컴포넌트, 그리고 최적화 기법들을 다룹니다.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: '개발',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'React 19 새로운 기능',
    description:
      'React 19에서 추가된 새로운 기능들을 살펴봅니다. 컴파일러 개선, 서버 컴포넌트 지원 등이 포함됩니다.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: '프론트엔드',
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    title: 'TypeScript 고급 타입 활용하기',
    description:
      'TypeScript의 고급 타입 기능들을 실전에서 어떻게 활용하는지 알아봅니다.',
    youtubeUrl: 'dQw4w9WgXcQ', // Video ID만 사용해도 됩니다
    category: '개발',
    createdAt: '2024-01-25T09:15:00Z',
  },
];

export default function ContentListExample() {
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

        <ContentList
          items={exampleContent}
          onItemClick={handleItemClick}
          emptyMessage="아직 콘텐츠가 없습니다."
        />
      </div>
    </div>
  );
}

