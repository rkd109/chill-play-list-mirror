'use server';

/**
 * Firebase 설정 타입
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/**
 * 서버 액션: Firebase 설정 정보 가져오기
 * 환경 변수는 서버에서만 접근 가능하므로 키 노출 방지
 */
export async function getFirebaseConfig(): Promise<FirebaseConfig> {
  const config: FirebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  // 필수 설정 확인
  if (!config.apiKey || !config.authDomain || !config.projectId) {
    throw new Error(
      'Firebase 클라이언트 설정이 완료되지 않았습니다. FIREBASE_* 환경 변수를 확인해주세요.'
    );
  }

  return config;
}

