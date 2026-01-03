'use client';

import VideoListItem from './VideoListItem';
import type { Video } from '@/types/video';

interface VideoListProps {
  /**
   * Video 배열
   */
  videos: Video[];
  /**
   * 기본적으로 펼쳐져 있는 Video ID
   */
  defaultExpandedId?: string;
  /**
   * 아이템 클릭 핸들러
   */
  onItemClick?: (video: Video) => void;
  /**
   * 리스트가 비어있을 때 표시할 메시지
   */
  emptyMessage?: string;
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * Video 리스트 컴포넌트
 * 여러 Video를 리스트 형태로 표시합니다.
 */
export default function VideoList({
  videos,
  defaultExpandedId,
  onItemClick,
  emptyMessage = '비디오가 없습니다.',
  className = '',
}: VideoListProps) {
  if (videos.length === 0) {
    return (
      <div
        className={`flex items-center justify-center p-12 text-zinc-500 dark:text-zinc-400 ${className}`}
      >
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden ${className}`}
    >
      {videos.map((video) => (
        <VideoListItem
          key={video.videoId}
          video={video}
          defaultExpanded={video.videoId === defaultExpandedId}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}

