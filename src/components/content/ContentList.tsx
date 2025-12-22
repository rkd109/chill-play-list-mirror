'use client';

import ContentListItem from './ContentListItem';
import type { ContentItem } from '@/types/content';

interface ContentListProps {
  /**
   * 콘텐츠 아이템 배열
   */
  items: ContentItem[];
  /**
   * 기본적으로 펼쳐져 있는 아이템 ID
   */
  defaultExpandedId?: string;
  /**
   * 아이템 클릭 핸들러
   */
  onItemClick?: (item: ContentItem) => void;
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
 * 콘텐츠 리스트 컴포넌트
 * 여러 콘텐츠 아이템을 리스트 형태로 표시합니다.
 */
export default function ContentList({
  items,
  defaultExpandedId,
  onItemClick,
  emptyMessage = '콘텐츠가 없습니다.',
  className = '',
}: ContentListProps) {
  if (items.length === 0) {
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
      {items.map((item) => (
        <ContentListItem
          key={item.id}
          item={item}
          defaultExpanded={item.id === defaultExpandedId}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}

