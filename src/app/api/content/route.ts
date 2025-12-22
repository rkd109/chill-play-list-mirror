import { NextResponse } from 'next/server';
import type { ContentItem } from '@/types/content';

/**
 * GET /api/content
 * 콘텐츠 리스트를 반환하는 API
 */
export async function GET() {
  try {
    // TODO: 실제 데이터베이스나 외부 API에서 데이터를 가져오도록 수정
    // 현재는 예시 데이터를 반환합니다
    const contentItems: ContentItem[] = [
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

    return NextResponse.json(
      {
        success: true,
        data: contentItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Content API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '콘텐츠를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

