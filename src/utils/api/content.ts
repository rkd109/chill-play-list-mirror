import type { ContentItem } from '@/types/content';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 콘텐츠 리스트를 가져오는 API 함수
 */
export async function fetchContentList(): Promise<ContentItem[]> {
  const response = await fetch('/api/content', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Next.js에서 캐싱 설정 (선택사항)
    // cache: 'no-store', // 항상 최신 데이터
    // next: { revalidate: 60 }, // 60초마다 재검증
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<ContentItem[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || '콘텐츠를 불러오는데 실패했습니다.');
  }

  return result.data;
}

