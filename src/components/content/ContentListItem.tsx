'use client';

import { useState } from 'react';
import { YouTubePlayer } from '@/components/youtube';
import type { ContentItem } from '@/types/content';

interface ContentListItemProps {
  /**
   * 콘텐츠 아이템 데이터
   */
  item: ContentItem;
  /**
   * 기본적으로 펼쳐져 있는지 여부
   */
  defaultExpanded?: boolean;
  /**
   * 아이템 클릭 핸들러
   */
  onItemClick?: (item: ContentItem) => void;
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * 콘텐츠 리스트 아이템 컴포넌트
 * 클릭하면 펼쳐지면서 YouTube 플레이어가 표시됩니다.
 */
export default function ContentListItem({
  item,
  defaultExpanded = false,
  onItemClick,
  className = '',
}: ContentListItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
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
        aria-controls={`content-${item.id}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              {item.category && (
                <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  {item.category}
                </span>
              )}
              {item.createdAt && (
                <span>{formatDate(item.createdAt)}</span>
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
        id={`content-${item.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 space-y-4">
          {/* YouTube 플레이어 */}
          <div className="mt-2">
            <YouTubePlayer
              videoIdOrUrl={item.youtubeUrl}
              responsive={true}
              className="w-full"
            />
          </div>

          {/* 추가 설명이 있는 경우 */}
          {item.description && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

