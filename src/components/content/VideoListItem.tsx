'use client';

import { useState } from 'react';
import { YouTubePlayer } from '@/components/youtube';
import type { Video } from '@/types/video';

interface VideoListItemProps {
  /**
   * Video 데이터
   */
  video: Video;
  /**
   * 기본적으로 펼쳐져 있는지 여부
   */
  defaultExpanded?: boolean;
  /**
   * 아이템 클릭 핸들러
   */
  onItemClick?: (video: Video) => void;
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * Video 리스트 아이템 컴포넌트
 * 클릭하면 펼쳐지면서 YouTube 플레이어가 표시됩니다.
 */
export default function VideoListItem({
  video,
  defaultExpanded = false,
  onItemClick,
  className = '',
}: VideoListItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (onItemClick) {
      onItemClick(video);
    }
  };

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return date.toString();
    }
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000000) {
      return `${(count / 1000000000).toFixed(1)}B`;
    }
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div
      className={`border-b border-zinc-200 dark:border-zinc-800 transition-colors ${className}`}
    >
      {/* 헤더 (클릭 가능 영역) */}
      <button
        onClick={handleClick}
        className="w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 rounded-t-lg"
        aria-expanded={isExpanded}
        aria-controls={`video-${video.videoId}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              {video.title}
            </h3>
            {video.customComment && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                {video.customComment}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              {video.category && (
                <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  {video.category}
                </span>
              )}
              {video.curatedDate && (
                <span>{video.curatedDate}</span>
              )}
              {video.viewCount > 0 && (
                <span>조회수 {formatViewCount(video.viewCount)}</span>
              )}
            </div>
          </div>
          {/* 화살표 아이콘 */}
          <div
            className={`flex-shrink-0 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            <svg
              className="w-5 h-5 text-zinc-500 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* 펼쳐지는 내용 영역 */}
      <div
        id={`video-${video.videoId}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 space-y-4">
          {/* YouTube 플레이어 */}
          <div className="mt-2">
            <YouTubePlayer
              videoIdOrUrl={video.videoId}
              responsive={true}
              className="w-full"
            />
          </div>

          {/* 추가 정보 */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            {video.description && (
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  설명
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}
            {video.customComment && (
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  추천 이유
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {video.customComment}
                </p>
              </div>
            )}
            {video.tags && video.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  태그
                </h4>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              <p>업로드일: {formatDate(video.publishedAt)}</p>
              <p>큐레이션일: {formatDate(video.curatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

