'use server';

import { getAdminAuth } from '@/lib/firebase/admin';
import { createVideos } from '@/lib/firebase/videos';
import type { VideoInput } from '@/types/video';
import { getCuratedDate } from '@/utils/firestore/video';

/**
 * Admin 이메일 주소
 */
const ADMIN_EMAIL = 'rkdk24@gmail.com';

/**
 * ID 토큰을 검증하고 관리자 이메일인지 확인
 */
async function verifyAdminToken(idToken: string): Promise<boolean> {
  try {
    const adminAuth = getAdminAuth();
    
    // ID 토큰 검증
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // 이메일이 관리자 이메일인지 확인
    const isAdmin = decodedToken.email === ADMIN_EMAIL;
    
    if (!isAdmin) {
      console.warn(`Unauthorized access attempt: ${decodedToken.email}`);
    }
    
    return isAdmin;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

/**
 * 인급동 데이터 수집 Server Action
 * 
 * @param idToken - 클라이언트에서 전달받은 Firebase ID 토큰
 * @returns 수집된 비디오 개수 또는 에러 메시지
 */
export async function fetchTrendingVideos(idToken: string) {
  try {
    // 1. 토큰 검증 및 관리자 확인
    const isAdmin = await verifyAdminToken(idToken);
    
    if (!isAdmin) {
      return {
        success: false,
        error: '관리자 권한이 필요합니다.',
      };
    }

    // 2. 인급동 데이터 수집 로직 (예시)
    // TODO: 실제 인급동 API 호출 또는 데이터 수집 로직 구현
    const now = new Date();
    const curatedDate = getCuratedDate();

    // 예시: 수집된 데이터 (실제로는 외부 API에서 가져옴)
    const collectedVideos: VideoInput[] = [
      // TODO: 실제 인급동 데이터로 교체
      {
        videoId: 'example1',
        title: '인급동 수집 영상 1',
        description: '인급동에서 수집한 영상입니다.',
        customComment: '인급동 트렌딩 영상',
        thumbnail: '',
        viewCount: 0,
        publishedAt: now,
        curatedDate: curatedDate,
        curatedAt: now,
        category: '트렌딩',
        tags: ['인급동', '트렌딩'],
      },
    ];

    // 3. Firestore에 저장
    const savedVideos = await createVideos(collectedVideos);

    return {
      success: true,
      message: `${savedVideos.length}개의 비디오를 수집했습니다.`,
      count: savedVideos.length,
      data: savedVideos,
    };
  } catch (error) {
    console.error('fetchTrendingVideos error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '데이터 수집 중 오류가 발생했습니다.',
    };
  }
}


