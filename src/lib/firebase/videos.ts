import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { getClientFirestoreInstance } from './client';
import type {
  VideoDocument,
  Video,
  VideoInput,
  VideoQueryOptions,
} from '@/types/video';
import {
  convertVideoDocumentToVideo,
  convertVideoInputToDocument,
} from '@/utils/firestore/video';

const COLLECTION_NAME = 'videos';

/**
 * Video ID로 단일 Video 조회
 */
export async function getVideoById(videoId: string): Promise<Video | null> {
  try {
    const db = await getClientFirestoreInstance();
    const videoRef = doc(db, COLLECTION_NAME, videoId);
    const videoSnap = await getDoc(videoRef);

    if (!videoSnap.exists()) {
      return null;
    }

    const data = videoSnap.data() as VideoDocument;
    return convertVideoDocumentToVideo(data, videoSnap.id);
  } catch (error) {
    console.error('Error getting video:', error);
    throw new Error('비디오를 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * Video 리스트 조회 (쿼리 옵션 지원)
 */
export async function getVideos(
  options?: VideoQueryOptions
): Promise<Video[]> {
  try {
    const db = await getClientFirestoreInstance();
    const videosRef = collection(db, COLLECTION_NAME);

    // 쿼리 제약 조건 생성
    const constraints: QueryConstraint[] = [];

    // 필터 조건
    if (options?.category) {
      constraints.push(where('category', '==', options.category));
    }

    if (options?.curatedDate) {
      constraints.push(where('curatedDate', '==', options.curatedDate));
    }

    if (options?.tags && options.tags.length > 0) {
      // 태그는 array-contains-any를 사용 (하나 이상 포함)
      constraints.push(where('tags', 'array-contains-any', options.tags));
    }

    // 정렬
    const orderByField = options?.orderBy || 'curatedAt';
    const orderDirection = options?.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));

    // 페이지네이션
    if (options?.limit) {
      constraints.push(limit(options.limit));
    }

    // 쿼리 실행
    const q = query(videosRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const videos: Video[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as VideoDocument;
      videos.push(convertVideoDocumentToVideo(data, docSnap.id));
    });

    return videos;
  } catch (error) {
    console.error('Error getting videos:', error);
    throw new Error('비디오 리스트를 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * Video 생성 또는 업데이트
 * Document ID는 videoId를 사용
 */
export async function createOrUpdateVideo(
  input: VideoInput
): Promise<Video> {
  try {
    const db = await getClientFirestoreInstance();
    const videoRef = doc(db, COLLECTION_NAME, input.videoId);

    // VideoInput을 Firestore 문서 형태로 변환
    const documentData = convertVideoInputToDocument(input);

    // Timestamp 변환 (Firestore Timestamp로 변환)
    const now = new Date();
    const firestoreData: VideoDocument = {
      ...documentData,
      publishedAt:
        input.publishedAt instanceof Date
          ? Timestamp.fromDate(input.publishedAt)
          : typeof input.publishedAt === 'string'
          ? Timestamp.fromDate(new Date(input.publishedAt))
          : input.publishedAt,
      curatedAt:
        input.curatedAt instanceof Date
          ? Timestamp.fromDate(input.curatedAt)
          : typeof input.curatedAt === 'string'
          ? Timestamp.fromDate(new Date(input.curatedAt))
          : Timestamp.fromDate(now),
    };

    // 문서 생성 또는 업데이트
    await setDoc(videoRef, firestoreData, { merge: true });

    // 생성된 문서 반환
    const savedVideo = await getVideoById(input.videoId);
    if (!savedVideo) {
      throw new Error('비디오를 저장한 후 조회에 실패했습니다.');
    }
    return savedVideo;
  } catch (error) {
    console.error('Error creating/updating video:', error);
    throw new Error('비디오를 저장하는 중 오류가 발생했습니다.');
  }
}

/**
 * 여러 Video 일괄 생성
 */
export async function createVideos(inputs: VideoInput[]): Promise<Video[]> {
  try {
    const results = await Promise.all(
      inputs.map((input) => createOrUpdateVideo(input))
    );
    return results;
  } catch (error) {
    console.error('Error creating videos:', error);
    throw new Error('비디오들을 저장하는 중 오류가 발생했습니다.');
  }
}

