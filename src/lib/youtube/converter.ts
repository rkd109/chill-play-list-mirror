import type { VideoInput } from '@/types/video';
import type { YouTubeVideoItem } from './api';

/**
 * YouTube 영상 데이터를 VideoInput 형식으로 변환
 * 
 * @param youtubeVideo - YouTube API 응답 데이터
 * @returns VideoInput 형식의 데이터
 */
export function convertYouTubeVideoToVideoInput(
  youtubeVideo: YouTubeVideoItem
): VideoInput {
  const now = new Date();
  const publishedAt = new Date(youtubeVideo.snippet.publishedAt);
  
  // 썸네일 URL 선택 (우선순위: maxres > standard > high > medium > default)
  const thumbnail =
    youtubeVideo.snippet.thumbnails.maxres?.url ||
    youtubeVideo.snippet.thumbnails.standard?.url ||
    youtubeVideo.snippet.thumbnails.high?.url ||
    youtubeVideo.snippet.thumbnails.medium?.url ||
    youtubeVideo.snippet.thumbnails.default?.url ||
    '';

  // 조회수 파싱
  const viewCount = youtubeVideo.statistics?.viewCount
    ? parseInt(youtubeVideo.statistics.viewCount, 10)
    : 0;

  // 태그 처리 (YouTube 태그가 있으면 사용, 없으면 기본 태그)
  const tags = youtubeVideo.snippet.tags?.slice(0, 5) || ['인기', '트렌딩'];

  return {
    videoId: youtubeVideo.id,
    title: youtubeVideo.snippet.title,
    description: youtubeVideo.snippet.description || '',
    customComment: `YouTube 인기 영상 - ${youtubeVideo.snippet.channelTitle}`,
    thumbnail,
    viewCount,
    publishedAt,
    curatedDate: getCuratedDate(),
    curatedAt: now,
    category: '트렌딩',
    tags: ['YouTube', '인기', ...tags],
  };
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getCuratedDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
