/**
 * 콘텐츠 아이템 타입
 */
export interface ContentItem {
  /**
   * 고유 ID
   */
  id: string;
  /**
   * 제목
   */
  title: string;
  /**
   * 설명 또는 내용
   */
  description?: string;
  /**
   * YouTube 영상 URL 또는 Video ID
   */
  youtubeUrl: string;
  /**
   * 작성일 (ISO 8601 형식)
   */
  createdAt?: string;
  /**
   * 카테고리 또는 태그
   */
  category?: string;
  /**
   * 추가 메타데이터
   */
  metadata?: Record<string, unknown>;
}

