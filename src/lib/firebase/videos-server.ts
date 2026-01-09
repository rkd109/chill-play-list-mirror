'use server';

import { Timestamp } from 'firebase-admin/firestore';
import { getAdminFirestore } from './admin';
import type {
  VideoDocument,
  Video,
  VideoInput,
} from '@/types/video';
import {
  convertVideoDocumentToVideo,
  convertVideoInputToDocument,
} from '@/utils/firestore/video';

const COLLECTION_NAME = 'videos';

/**
 * Timestamp 타입 가드
 */
function isTimestamp(value: unknown): value is Timestamp {
  return value instanceof Timestamp;
}

/**
 * 서버 사이드: Video ID로 단일 Video 조회 (Admin SDK 사용)
 */
export async function getVideoByIdServer(videoId: string): Promise<Video | null> {
  try {
    const db = await getAdminFirestore();
    const videoRef = db.collection(COLLECTION_NAME).doc(videoId);
    const videoSnap = await videoRef.get();

    if (!videoSnap.exists) {
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
 * 서버 사이드: Video 생성 또는 업데이트 (Admin SDK 사용)
 * Document ID는 videoId를 사용
 */
export async function createOrUpdateVideoServer(
  input: VideoInput
): Promise<Video> {
  try {
    const db = await getAdminFirestore();
    const videoRef = db.collection(COLLECTION_NAME).doc(input.videoId);

    // VideoInput을 Firestore 문서 형태로 변환
    const documentData = convertVideoInputToDocument(input);

    // Timestamp 변환 (Firestore Timestamp로 변환)
    const now = new Date();
    
    // publishedAt 변환
    let publishedAtTimestamp: Timestamp;
    if (input.publishedAt instanceof Date) {
      publishedAtTimestamp = Timestamp.fromDate(input.publishedAt);
    } else if (typeof input.publishedAt === 'string') {
      publishedAtTimestamp = Timestamp.fromDate(new Date(input.publishedAt));
    } else if (isTimestamp(input.publishedAt)) {
      publishedAtTimestamp = input.publishedAt;
    } else {
      publishedAtTimestamp = Timestamp.fromDate(now);
    }
    
    // curatedAt 변환
    let curatedAtTimestamp: Timestamp;
    if (input.curatedAt instanceof Date) {
      curatedAtTimestamp = Timestamp.fromDate(input.curatedAt);
    } else if (typeof input.curatedAt === 'string') {
      curatedAtTimestamp = Timestamp.fromDate(new Date(input.curatedAt));
    } else if (isTimestamp(input.curatedAt)) {
      curatedAtTimestamp = input.curatedAt;
    } else {
      curatedAtTimestamp = Timestamp.fromDate(now);
    }
    
    const firestoreData: VideoDocument = {
      ...documentData,
      publishedAt: publishedAtTimestamp,
      curatedAt: curatedAtTimestamp,
    };

    // 문서 생성 또는 업데이트 (Admin SDK는 set 메서드 사용)
    await videoRef.set(firestoreData, { merge: true });

    // 생성된 문서 반환
    const savedVideo = await getVideoByIdServer(input.videoId);
    if (!savedVideo) {
      throw new Error('비디오를 저장한 후 조회에 실패했습니다.');
    }
    return savedVideo;
  } catch (error) {
    console.error('Error creating/updating video:', error);
    // 더 자세한 에러 정보 출력
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    throw new Error(`비디오를 저장하는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 서버 사이드: 여러 Video 일괄 생성 (Admin SDK 사용)
 */
export async function createVideosServer(inputs: VideoInput[]): Promise<Video[]> {
  try {
    const results = await Promise.all(
      inputs.map((input) => createOrUpdateVideoServer(input))
    );
    return results;
  } catch (error) {
    console.error('Error creating videos:', error);
    throw new Error('비디오들을 저장하는 중 오류가 발생했습니다.');
  }
}

