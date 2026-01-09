'use server';

/**
 * Firebase 클라이언트 설정 타입
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
 * Firebase Admin 설정 타입
 */
export interface FirebaseAdminConfig {
  serviceAccountKey?: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
  projectId: string;
}

/**
 * 서버 액션: Firebase 클라이언트 설정 정보 가져오기
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

/**
 * 서버 액션: Firebase Admin 설정 정보 가져오기
 * 환경 변수는 서버에서만 접근 가능하므로 키 노출 방지
 */
export async function getFirebaseAdminConfig(): Promise<FirebaseAdminConfig> {
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
      const parsed = JSON.parse(serviceAccountJson);
      serviceAccountKey = {
        projectId: parsed.project_id || parsed.projectId,
        clientEmail: parsed.client_email || parsed.clientEmail,
        privateKey: parsed.private_key || parsed.privateKey,
      };
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

  return {
    serviceAccountKey,
    projectId: projectId || serviceAccountKey.projectId,
  };
}

