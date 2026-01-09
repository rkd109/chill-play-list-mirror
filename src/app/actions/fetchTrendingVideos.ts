'use server';

import { getAdminAuth } from '@/lib/firebase/admin';
import { createVideosServer } from '@/lib/firebase/videos-server';
import { fetchYouTubeTrendingVideos } from '@/lib/youtube/api';
import { convertYouTubeVideoToVideoInput } from '@/lib/youtube/converter';
import type { VideoInput } from '@/types/video';

/**
 * Admin 이메일 주소
 */
const ADMIN_EMAIL = 'rkdk24@gmail.com';

/**
 * ID 토큰을 검증하고 관리자 이메일인지 확인
 */
async function verifyAdminToken(idToken: string): Promise<boolean> {
  try {
    const adminAuth = await getAdminAuth();
    
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

    // 2. YouTube API를 통해 인기 영상 수집 (상위 10개)
    const youtubeVideos = await fetchYouTubeTrendingVideos();
    
    // YouTube 영상 데이터를 VideoInput 형식으로 변환
    const collectedVideos: VideoInput[] = youtubeVideos.map((video) =>
      convertYouTubeVideoToVideoInput(video)
    );

    // 3. Firestore에 저장 (서버 사이드 Admin SDK 사용)
    const savedVideos = await createVideosServer(collectedVideos);

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


