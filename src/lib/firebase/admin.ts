'use server';

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

/**
 * Firebase Admin 앱 초기화
 */
function initializeAdminApp(): App {
  // 이미 초기화된 앱이 있으면 재사용
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  // 환경 변수에서 Firebase Admin 설정 가져오기
  // 방법 1: JSON 문자열로 제공
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  // 방법 2: 개별 필드로 제공
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  let serviceAccountKey;

  if (serviceAccountJson) {
    // JSON 문자열인 경우 파싱
    try {
      serviceAccountKey = JSON.parse(serviceAccountJson);
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY가 유효한 JSON 형식이 아닙니다.');
    }
  } else if (projectId && clientEmail && privateKey) {
    // 개별 필드로 제공된 경우
    serviceAccountKey = {
      projectId,
      clientEmail,
      privateKey,
    };
  } else {
    throw new Error(
      'Firebase Admin 설정이 완료되지 않았습니다. FIREBASE_SERVICE_ACCOUNT_KEY 또는 FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY를 설정해주세요.'
    );
  }

  return initializeApp({
    credential: cert(serviceAccountKey),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

/**
 * Firebase Admin Auth 인스턴스 가져오기
 */
export function getAdminAuth(): Auth {
  const app = initializeAdminApp();
  return getAuth(app);
}

