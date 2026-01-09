/**
 * Firestore Timestamp 타입 (Firebase SDK 사용 시)
 * Firebase SDK를 설치하지 않은 경우 Date 또는 string으로 대체 가능
 */
export type FirestoreTimestamp = Date | string | { seconds: number; nanoseconds: number };

/**
 * Firestore에 저장되는 Video 문서 타입
 * Document ID는 videoId를 사용
 */
export interface VideoDocument {
  /**
   * YouTube Video ID (중복 저장)
   * Document ID와 동일한 값
   */
  videoId: string;
  
  /**
   * YouTube 영상 제목
   */
  title: string;
  
  /**
   * YouTube 영상 설명
   */
  description: string;
  
  /**
   * PM님이 직접 쓴 추천 이유
   */
  customComment: string;
  
  /**
   * 고화질 썸네일 URL
   */
  thumbnail: string;
  
  /**
   * 수집 시점 조회수
   */
  viewCount: number;
  
  /**
   * 영상 자체 업로드일 (Firestore Timestamp)
   */
  publishedAt: FirestoreTimestamp;
  
  /**
   * 날짜별 그룹화 조회용 날짜 (예: "2024-05-20")
   * YYYY-MM-DD 형식
   */
  curatedDate: string;
  
  /**
   * 정밀 정렬용 타임스탬프 (Firestore Timestamp)
   * 큐레이션된 시점
   */
  curatedAt: FirestoreTimestamp;
  
  /**
   * 분류 카테고리
   */
  category: string;
  
  /**
   * 검색용 키워드 배열
   */
  tags: string[];
}

/**
 * 클라이언트에서 사용하는 Video 타입
 * Firestore Timestamp를 Date로 변환한 버전
 */
export interface Video {
  /**
   * YouTube Video ID
   */
  videoId: string;
  
  /**
   * YouTube 영상 제목
   */
  title: string;
  
  /**
   * YouTube 영상 설명
   */
  description: string;
  
  /**
   * PM님이 직접 쓴 추천 이유
   */
  customComment: string;
  
  /**
   * 고화질 썸네일 URL
   */
  thumbnail: string;
  
  /**
   * 수집 시점 조회수
   */
  viewCount: number;
  
  /**
   * 영상 자체 업로드일 (Date)
   */
  publishedAt: Date;
  
  /**
   * 날짜별 그룹화 조회용 날짜 (예: "2024-05-20")
   */
  curatedDate: string;
  
  /**
   * 정밀 정렬용 타임스탬프 (Date)
   * 큐레이션된 시점
   */
  curatedAt: Date;
  
  /**
   * 분류 카테고리
   */
  category: string;
  
  /**
   * 검색용 키워드 배열
   */
  tags: string[];
}

/**
 * Video 생성/업데이트 시 사용하는 타입
 * Firestore에 저장하기 전의 데이터
 */
export interface VideoInput {
  /**
   * YouTube Video ID
   */
  videoId: string;
  
  /**
   * YouTube 영상 제목
   */
  title: string;
  
  /**
   * YouTube 영상 설명
   */
  description: string;
  
  /**
   * PM님이 직접 쓴 추천 이유
   */
  customComment: string;
  
  /**
   * 고화질 썸네일 URL
   */
  thumbnail: string;
  
  /**
   * 수집 시점 조회수
   */
  viewCount: number;
  
  /**
   * 영상 자체 업로드일
   */
  publishedAt: Date | string;
  
  /**
   * 날짜별 그룹화 조회용 날짜 (예: "2024-05-20")
   */
  curatedDate: string;
  
  /**
   * 정밀 정렬용 타임스탬프
   * 큐레이션된 시점
   */
  curatedAt: Date | string;
  
  /**
   * 분류 카테고리
   */
  category: string;
  
  /**
   * 검색용 키워드 배열
   */
  tags: string[];
}

/**
 * Video 쿼리 옵션
 */
export interface VideoQueryOptions {
  /**
   * 카테고리 필터
   */
  category?: string;
  
  /**
   * 큐레이션 날짜 필터 (예: "2024-05-20")
   */
  curatedDate?: string;
  
  /**
   * 태그 필터 (하나 이상 포함)
   */
  tags?: string[];
  
  /**
   * 정렬 기준
   */
  orderBy?: 'curatedAt' | 'publishedAt' | 'viewCount';
  
  /**
   * 정렬 방향
   */
  orderDirection?: 'asc' | 'desc';
  
  /**
   * 페이지 크기
   */
  limit?: number;
  
  /**
   * 시작 지점 (페이지네이션용)
   */
  startAfter?: string;
}


