import type { VideoDocument, Video, FirestoreTimestamp, VideoInput } from '@/types/video';

/**
 * Firestore Timestamp를 Date로 변환하는 헬퍼 함수
 */
export function convertTimestampToDate(
  timestamp: FirestoreTimestamp
): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }

  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }

  // Firestore Timestamp 객체인 경우
  if (typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000);
  }

  // 기본값
  return new Date();
}

/**
 * Firestore VideoDocument를 클라이언트용 Video로 변환
 */
export function convertVideoDocumentToVideo(
  doc: VideoDocument,
  docId?: string
): Video {
  return {
    videoId: doc.videoId || docId || '',
    title: doc.title,
    description: doc.description,
    customComment: doc.customComment,
    thumbnail: doc.thumbnail,
    viewCount: doc.viewCount,
    publishedAt: convertTimestampToDate(doc.publishedAt),
    curatedDate: doc.curatedDate,
    curatedAt: convertTimestampToDate(doc.curatedAt),
    category: doc.category,
    tags: doc.tags || [],
  };
}

/**
 * VideoInput을 Firestore에 저장할 수 있는 형태로 변환
 */
export function convertVideoInputToDocument(
  input: VideoInput
): Omit<VideoDocument, 'videoId'> & { videoId: string } {
  return {
    videoId: input.videoId,
    title: input.title,
    description: input.description,
    customComment: input.customComment,
    thumbnail: input.thumbnail,
    viewCount: input.viewCount,
    publishedAt:
      input.publishedAt instanceof Date
        ? input.publishedAt.toISOString()
        : input.publishedAt,
    curatedDate: input.curatedDate,
    curatedAt:
      input.curatedAt instanceof Date
        ? input.curatedAt.toISOString()
        : input.curatedAt,
    category: input.category,
    tags: input.tags || [],
  };
}

/**
 * curatedDate를 생성하는 헬퍼 함수
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getCuratedDate(date?: Date): string {
  const targetDate = date || new Date();
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


