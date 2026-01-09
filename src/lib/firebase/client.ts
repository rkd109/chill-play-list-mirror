'use server';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Firebase 설정 타입
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/**
 * 클라이언트 사이드 Firebase 앱 초기화
 *  접두사가 있는 환경 변수 사용
 */
async function initializeClientFirebaseApp(): Promise<FirebaseApp> {
  // 이미 초기화된 앱이 있으면 재사용
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  // 클라이언트 사이드에서는  접두사가 있는 환경 변수 사용
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
    console.log(config);
    throw new Error(
      'Firebase 클라이언트 설정이 완료되지 않았습니다. FIREBASE_* 환경 변수를 확인해주세요.'
    );
  }

  return initializeApp(config);
}

/**
 * 클라이언트 사이드 Firebase Auth 인스턴스 가져오기
 */
export async function getClientAuthInstance(): Promise<Auth> {
  const app = await initializeClientFirebaseApp();
  return getAuth(app);
}

/**
 * 클라이언트 사이드 Firestore 인스턴스 가져오기
 */
export async function getClientFirestoreInstance(): Promise<Firestore> {
  const app = await initializeClientFirebaseApp();
  return getFirestore(app);
}


