'use server';

import { getFirebaseConfig } from '@/lib/firebase/client-server';

/**
 * YouTube API 응답 타입
 */
export interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      standard?: { url: string };
      maxres?: { url: string };
    };
    channelTitle: string;
    tags?: string[];
  };
  statistics?: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
}

interface YouTubeApiResponse {
  items: YouTubeVideoItem[];
}

/**
 * YouTube API 키 가져오기 (Firebase API 키 사용)
 */
async function getYouTubeApiKey(): Promise<string> {
  const config = await getFirebaseConfig();
  if (!config.apiKey) {
    throw new Error('FIREBASE_API_KEY 환경 변수가 설정되지 않았습니다. YouTube Data API 권한이 추가되었는지 확인해주세요.');
  }
  return config.apiKey;
}

/**
 * YouTube 인기 영상 가져오기 (상위 10개)
 * 
 * @returns YouTube 영상 목록
 */
export async function fetchYouTubeTrendingVideos(): Promise<YouTubeVideoItem[]> {
  const apiKey = await getYouTubeApiKey();
  
  // YouTube Data API v3 - 인기 영상 가져오기
  // chart=mostPopular: 가장 인기 있는 영상
  // regionCode=KR: 한국 지역
  // maxResults=10: 최대 10개
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'snippet,statistics');
  url.searchParams.set('chart', 'mostPopular');
  url.searchParams.set('regionCode', 'KR');
  url.searchParams.set('maxResults', '10');
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `YouTube API 호출 실패: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data: YouTubeApiResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('YouTube API에서 영상을 가져올 수 없습니다.');
    }

    return data.items;
  } catch (error) {
    console.error('YouTube API 호출 오류:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('YouTube API 호출 중 알 수 없는 오류가 발생했습니다.');
  }
}

/**
 * YouTube 영상 ID로 상세 정보 가져오기
 * 
 * @param videoIds - YouTube 영상 ID 배열
 * @returns YouTube 영상 목록
 */
export async function fetchYouTubeVideosByIds(
  videoIds: string[]
): Promise<YouTubeVideoItem[]> {
  if (videoIds.length === 0) {
    return [];
  }

  const apiKey = await getYouTubeApiKey();
  
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'snippet,statistics');
  url.searchParams.set('id', videoIds.join(','));
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `YouTube API 호출 실패: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data: YouTubeApiResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('YouTube API 호출 오류:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('YouTube API 호출 중 알 수 없는 오류가 발생했습니다.');
  }
}
